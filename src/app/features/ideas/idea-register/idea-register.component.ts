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
    styleUrls: ['./idea-register.component.scss', './idea-register-print.scss'],
    standalone: false
})
export class IdeaRegisterComponent implements OnInit {
    registrationForm!: FormGroup;
    /** Filled from site settings for API payload only (no longer shown on the form). */
    private academicYearForPayload = '';

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
            this.academicYearForPayload = this.siteSettingsService.parseStoredValue(res.value) ?? '';
        });
    }

    initForm(): void {
        this.registrationForm = this.fb.group({
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
            academicYear: this.academicYearForPayload,
            semester: '',
            department: '',
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

    /** Opens the browser print dialog; user can print or save as PDF (same as reference Pdf.html). */
    printPdf(): void {
        window.print();
    }
}
