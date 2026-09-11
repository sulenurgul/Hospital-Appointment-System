import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { AuthService } from '@core/services/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { VALIDATION_MESSAGES } from '@core/constants/app.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ButtonComponent,
  ],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <h1>Hastane Sistemi</h1>
          <p>Devam etmek için giriş yapınız</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="field">
            <label for="username">Kullanıcı Adı</label>
            <input
              id="username"
              type="text"
              pInputText
              formControlName="username"
              [class.ng-invalid]="isInvalid('username')"
              class="w-full"
              autocomplete="username"
            />
            @if (isInvalid('username')) {
              <small class="field-error">{{ validationMessages.REQUIRED }}</small>
            }
          </div>

          <div class="field">
            <label for="password">Şifre</label>
            <p-password
              inputId="password"
              formControlName="password"
              [feedback]="false"
              [toggleMask]="true"
              inputStyleClass="w-full"
              autocomplete="current-password"
            />
            @if (isInvalid('password')) {
              <small class="field-error">{{ validationMessages.REQUIRED }}</small>
            }
          </div>

          @if (errorMessage()) {
            <p-message severity="error" styleClass="w-full">{{ errorMessage() }}</p-message>
          }

          <app-button
            type="submit"
            label="Giriş Yap"
            severity="info"
            [loading]="loading()"
            [fullWidth]="true"
          />
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .login-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
      }

      .login-card {
        width: 100%;
        max-width: 380px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        padding: 2.5rem 2rem;
      }

      .login-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .login-header h1 {
        margin: 0 0 0.5rem;
        font-size: 1.4rem;
        color: #333;
      }

      .login-header p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      .field label {
        font-size: 0.9rem;
        font-weight: 600;
        color: #333;
      }

      .field-error {
        color: #e24c4c;
        font-size: 0.8rem;
      }

      .w-full {
        width: 100%;
      }

      :host ::ng-deep .p-password,
      :host ::ng-deep .p-password-input {
        width: 100%;
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly validationMessages = VALIDATION_MESSAGES;

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  isInvalid(controlName: 'username' | 'password'): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: { message?: string }) => {
        this.loading.set(false);
        this.errorMessage.set(err?.message || 'Giriş yapılamadı. Bilgilerinizi kontrol ediniz.');
      },
    });
  }
}
