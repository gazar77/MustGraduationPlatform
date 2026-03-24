import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthMockService } from '../../../core/services/auth-mock.service';

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
    private authService: AuthMockService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // If already logged in, redirect to dashboard
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

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: (res) => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          if (res.user.role === 'Admin') {
            this.router.navigateByUrl(returnUrl || '/admin');
          } else {
            this.router.navigateByUrl(returnUrl || '/dashboard');
          }
        },
        error: (err) => {
          this.error = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
          this.loading = false;
        }
      });
  }
}
