import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  departments: any[] = [];
  step: 'Identify' | 'EnterDetails' = 'Identify';
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      departmentId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      activationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.authService.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: () => this.error = 'فشل تحميل الأقسام'
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    if (this.registerForm.invalid && this.step === 'EnterDetails') return;
    if (this.f['email'].invalid && this.step === 'Identify') return;

    this.isLoading = true;
    this.error = '';

    if (this.step === 'Identify') {
      this.authService.studentSendCode(this.f['email'].value).subscribe({
        next: () => {
          this.step = 'EnterDetails';
          this.isLoading = false;
        },
        error: () => {
          this.error = 'فشل إرسال كود التحقق. تأكد من أن البريد الإلكتروني صحيح وغير مسجل مسبقاً.';
          this.isLoading = false;
        }
      });
    } else {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: () => {
          this.error = 'فشل إنشاء الحساب. برجاء التأكد من البيانات وكود التحقق.';
          this.isLoading = false;
        }
      });
    }
  }
}
