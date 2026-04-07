import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  userType: 'Admin' | 'Student' | null = null;
  step: 'Identify' | 'AdminLogin' | 'StudentLogin' = 'Identify';

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      if (this.authService.currentUserValue.role === 'Admin') {
        this.router.navigateByUrl('/admin');
      } else {
        this.router.navigateByUrl(returnUrl);
      }
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.controls['email'].invalid) return;

    this.loading = true;
    this.error = '';

    if (this.step === 'Identify') {
      this.authService.identify(this.f['email'].value).subscribe({
        next: (res) => {
          this.userType = res.userType as any;
          if (res.exists) {
            if (res.userType === 'Admin') {
              this.step = 'AdminLogin';
              this.f['password'].setValidators([Validators.required]);
              this.f['password'].updateValueAndValidity();
            } else if (res.userType === 'Student') {
              this.step = 'StudentLogin';
              this.f['password'].setValidators([Validators.required]);
              this.f['password'].updateValueAndValidity();
            }
          } else {
            this.error = 'البريد الإلكتروني غير مسجل';
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = this.httpErrorMessage(err, 'حدث خطأ أثناء التحقق من الحساب');
          this.loading = false;
        }
      });
    } else if (this.step === 'AdminLogin') {
      this.authService.adminLogin(this.f['email'].value, this.f['password'].value).subscribe({
        next: () => this.router.navigateByUrl('/admin'),
        error: (err) => {
          this.error = this.httpErrorMessage(err, 'كلمة المرور غير صحيحة أو رفض الخادم الطلب.');
          this.loading = false;
        }
      });
    } else if (this.step === 'StudentLogin') {
      this.authService.studentLogin(this.f['email'].value, this.f['password'].value).subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: (err) => {
          this.error = this.httpErrorMessage(err, 'كلمة المرور غير صحيحة أو رفض الخادم الطلب.');
          this.loading = false;
        }
      });
    }
  }

  /** Prefer clear message when API is unreachable (status 0 / connection reset). */
  private httpErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return 'تعذر الاتصال بالخادم. تحقق من الإنترنت أو أن واجهة الـ API تعمل (ERR_CONNECTION_RESET / الخادم متوقف).';
      }
      if (err.status >= 500) {
        return 'الخادم غير متاح مؤقتاً. حاول لاحقاً.';
      }
    }
    return fallback;
  }
}
