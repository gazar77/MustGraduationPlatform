import { Component, OnInit } from '@angular/core';
import { ProjectSubmissionService } from '../../../core/services/project-submission.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

@Component({
    selector: 'app-idea-register',
    templateUrl: './idea-register.component.html',
    styleUrls: ['./idea-register.component.scss'],
    standalone: false
})
export class IdeaRegisterComponent implements OnInit {
    registrationForm!: FormGroup;
    exportBusy = false;

    constructor(
        private fb: FormBuilder,
        private projectSubmissionService: ProjectSubmissionService,
        private authService: AuthService,
        private router: Router,
        public langService: LanguageService,
        private siteSettingsService: SiteSettingsService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadSettings();
        // Initialize with minimum 5 students
        for(let i = 0; i < 5; i++) {
            this.addStudent();
        }
    }

    loadSettings(): void {
        this.siteSettingsService.getSetting('academicYearLabel').subscribe(res => {
            this.registrationForm.get('academicYear')?.setValue(this.siteSettingsService.parseStoredValue(res.value));
        });
    }

    initForm(): void {
        this.registrationForm = this.fb.group({
            academicYear: ['', [Validators.required]],
            semester: ['', [Validators.required]],
            department: ['', [Validators.required]],
            titleAr: ['', [Validators.required]],
            titleEn: ['', [Validators.required]],
            category: ['', [Validators.required]],
            supervisorName: ['', [Validators.required]],
            assistantSupervisorName: ['', [Validators.required]],
            externalOrg: [''],
            students: this.fb.array([], [this.minMaxStudentsValidator(5, 7)])
        });
    }

    get students(): FormArray {
        return this.registrationForm.get('students') as FormArray;
    }

    newStudent(): FormGroup {
        return this.fb.group({
            studentName: ['', [Validators.required]],
            universityId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
        });
    }

    addStudent(): void {
        if (this.students.length < 7) {
            this.students.push(this.newStudent());
        }
    }

    removeStudent(index: number): void {
        // Only allow removing if we have more than 5, or if we want to allow empty slots and validate later.
        // User requested minimum 5 students. 
        if (this.students.length > 5) {
            this.students.removeAt(index);
        }
    }

    minMaxStudentsValidator(min: number, max: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            const arr = control as FormArray;
            if (arr.length < min) return { minStudents: true };
            if (arr.length > max) return { maxStudents: true };
            return null;
        };
    }

    onSubmit() {
        this.registrationForm.markAllAsTouched();

        if (this.registrationForm.invalid) {
            return;
        }

        const formValue = this.registrationForm.value;
        const user = this.authService.currentUserValue;
        if (!user || (user.role !== 'Student' && user.role !== 'Admin')) {
            alert('يجب تسجيل الدخول كطالب لإرسال طلب تسجيل فكرة.');
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/ideas/register' } });
            return;
        }

        this.projectSubmissionService.submitIdeaRegistration({
            academicYear: formValue.academicYear,
            semester: formValue.semester,
            department: formValue.department,
            titleEn: formValue.titleEn,
            titleAr: formValue.titleAr,
            category: formValue.category,
            supervisorName: formValue.supervisorName,
            assistantSupervisorName: formValue.assistantSupervisorName,
            externalOrg: formValue.externalOrg || null,
            students: (formValue.students as Array<{ studentName: string; universityId: string; mobileNumber: string }>)
        }).subscribe({
            next: () => {
                alert('Form submitted successfully!');
                this.router.navigate(['/ideas']);
            },
            error: () => alert('فشل إرسال الاستمارة. حاول مرة أخرى.')
        });
    }

    resetForm(): void {
        this.registrationForm.reset();
        while (this.students.length !== 0) {
            this.students.removeAt(0);
        }
        for(let i = 0; i < 5; i++) {
            this.addStudent();
        }
    }

    /** A4 width in CSS px at 96dpi — matches jsPDF A4 when scaled uniformly */
    private static readonly pdfCaptureWidthPx = 794;

    async exportPdf(): Promise<void> {
        const el = document.getElementById('idea-register-document');
        if (!el) return;
        this.exportBusy = true;
        try {
            await document.fonts.ready;
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');
            const wPx = IdeaRegisterComponent.pdfCaptureWidthPx;
            const canvas = await html2canvas(el, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: wPx,
                onclone: (cloned) => {
                    const root = cloned.getElementById('idea-register-document');
                    root?.classList.add('pdf-one-page');
                    if (root) {
                        root.style.width = `${wPx}px`;
                        root.style.maxWidth = `${wPx}px`;
                        root.style.boxSizing = 'border-box';
                    }
                    const wrap = cloned.querySelector('.document-wrapper') as HTMLElement | null;
                    if (wrap) {
                        wrap.classList.remove('container', 'py-5');
                        wrap.style.width = `${wPx}px`;
                        wrap.style.maxWidth = `${wPx}px`;
                        wrap.style.padding = '0';
                        wrap.style.margin = '0 auto';
                        wrap.style.boxSizing = 'border-box';
                    }
                    cloned.querySelectorAll('.no-print, .idea-export-actions').forEach((n) => n.remove());
                }
            });
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const marginMm = 10;
            const maxW = pageWidth - marginMm * 2;
            const maxH = pageHeight - marginMm * 2;
            const canvasRatio = canvas.width / canvas.height;
            let imgW = maxW;
            let imgH = imgW / canvasRatio;
            if (imgH > maxH) {
                imgH = maxH;
                imgW = imgH * canvasRatio;
            }
            const x = (pageWidth - imgW) / 2;
            const y = (pageHeight - imgH) / 2;
            pdf.addImage(imgData, 'PNG', x, y, imgW, imgH);
            pdf.save('graduation-project-registration.pdf');
        } catch (e) {
            console.error(e);
            alert('PDF export failed.');
        } finally {
            this.exportBusy = false;
        }
    }
}
