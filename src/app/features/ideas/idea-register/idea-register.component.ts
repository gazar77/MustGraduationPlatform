import { Component, OnInit } from '@angular/core';
import { IdeaService } from '../../../core/services/idea.service';
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
        private ideaService: IdeaService,
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

        this.ideaService.submitStudentIdea({
            title: formValue.titleEn + ' - ' + formValue.titleAr,
            description: `Year: ${formValue.academicYear}, Term: ${formValue.semester}, Dept: ${formValue.department}`,
            category: formValue.category,
            maxTeamSize: this.students.length,
            supervisorName: formValue.supervisorName
        }).subscribe(() => {
            alert('Form submitted successfully!');
            this.router.navigate(['/ideas']);
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

    async exportPdf(): Promise<void> {
        const el = document.getElementById('idea-register-document');
        if (!el) return;
        this.exportBusy = true;
        try {
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');
            const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * pageWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save('graduation-project-registration.pdf');
        } catch (e) {
            console.error(e);
            alert('PDF export failed.');
        } finally {
            this.exportBusy = false;
        }
    }

    async exportWord(): Promise<void> {
        this.exportBusy = true;
        try {
            const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
            const { saveAs } = await import('file-saver');
            const v = this.registrationForm.getRawValue() as Record<string, unknown>;
            const students = (v['students'] as Array<{ studentName?: string; universityId?: string; mobileNumber?: string }>) || [];
            const children = [
                new Paragraph({ text: 'Graduation Project Registration', heading: HeadingLevel.TITLE }),
                new Paragraph({ children: [new TextRun({ text: 'Academic Year: ', bold: true }), new TextRun(String(v['academicYear'] ?? ''))] }),
                new Paragraph({ children: [new TextRun({ text: 'Semester: ', bold: true }), new TextRun(String(v['semester'] ?? ''))] }),
                new Paragraph({ children: [new TextRun({ text: 'Department: ', bold: true }), new TextRun(String(v['department'] ?? ''))] }),
                new Paragraph({ children: [new TextRun({ text: 'Project Title (English): ', bold: true }), new TextRun(String(v['titleEn'] ?? ''))] }),
                new Paragraph({ children: [new TextRun({ text: 'Project Title (Arabic): ', bold: true }), new TextRun(String(v['titleAr'] ?? ''))] }),
                new Paragraph({ children: [new TextRun({ text: 'Category: ', bold: true }), new TextRun(String(v['category'] ?? ''))] }),
                new Paragraph({ children: [new TextRun({ text: 'Supervisor: ', bold: true }), new TextRun(String(v['supervisorName'] ?? ''))] }),
                new Paragraph({ children: [new TextRun({ text: 'Assistant Supervisor: ', bold: true }), new TextRun(String(v['assistantSupervisorName'] ?? ''))] }),
                new Paragraph({ children: [new TextRun({ text: 'External Organization: ', bold: true }), new TextRun(String(v['externalOrg'] ?? ''))] }),
                new Paragraph({ text: 'Project Team Students', heading: HeadingLevel.HEADING_2 }),
            ];
            students.forEach((s, i) => {
                children.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${i + 1}. `, bold: true }),
                            new TextRun(`${s.studentName ?? ''} — ID: ${s.universityId ?? ''} — Mobile: ${s.mobileNumber ?? ''}`),
                        ],
                    })
                );
            });
            const doc = new Document({ sections: [{ children }] });
            const blob = await Packer.toBlob(doc);
            saveAs(blob, 'graduation-project-registration.docx');
        } catch (e) {
            console.error(e);
            alert('Word export failed.');
        } finally {
            this.exportBusy = false;
        }
    }
}
