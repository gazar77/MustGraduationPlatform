import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
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
  sendCodeLoading = false;
  codeSent = false;
  departments: any[] = [];
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

  sendActivationCode(): void {
    this.error = '';
    this.f['email'].markAsTouched();
    if (this.f['email'].invalid) return;

    this.sendCodeLoading = true;
    this.authService.studentSendCode(this.f['email'].value).subscribe({
      next: () => {
        this.codeSent = true;
        this.sendCodeLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        const code = err.error?.code;
        if (code === 'AUTH_EMAIL_TAKEN') {
          this.error = 'هذا البريد مسجل مسبقاً. سجّل الدخول أو استخدم بريداً آخر.';
        } else {
          this.error = 'فشل إرسال كود التحقق. تأكد من أن البريد الإلكتروني صحيح وغير مسجل مسبقاً.';
        }
        this.sendCodeLoading = false;
      }
    });
  }

  onRegister(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.error = '';
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
