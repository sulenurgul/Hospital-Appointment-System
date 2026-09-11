import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { PatientService } from '@core/services/patient.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { GENDER_OPTIONS, VALIDATION_MESSAGES, MESSAGES } from '@core/constants/app.constants';
import {
  emailValidator,
  phoneValidator,
  identityNumberValidator,
  minLengthValidator,
  pastDateValidator,
  ageValidator,
} from '@shared/utils/validators';
import type { Patient, CreatePatientRequest } from '@shared/models/patient.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    MessageModule,
    ButtonComponent,
  ],
  template: `
    <div class="form-page">
      <h1>{{ pageTitle() }}</h1>

      <form [formGroup]="patientForm" (ngSubmit)="onSubmit()" class="patient-form">
        <div class="form-row">
          <div class="field">
            <label for="firstName">Ad *</label>
            <input
              id="firstName"
              type="text"
              pInputText
              [fluid]="true"
              formControlName="firstName"
            />
            @if (errorText('firstName'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>

          <div class="field">
            <label for="lastName">Soyad *</label>
            <input id="lastName" type="text" pInputText [fluid]="true" formControlName="lastName" />
            @if (errorText('lastName'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>
        </div>

        <div class="form-row">
          <div class="field">
            <label for="email">E-posta *</label>
            <input id="email" type="email" pInputText [fluid]="true" formControlName="email" />
            @if (errorText('email'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>

          <div class="field">
            <label for="phone">Telefon *</label>
            <input
              id="phone"
              type="text"
              pInputText
              [fluid]="true"
              formControlName="phone"
              placeholder="05XX XXX XXXX"
            />
            @if (errorText('phone'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>
        </div>

        <div class="form-row">
          <div class="field">
            <label for="dateOfBirth">Doğum Tarihi *</label>
            <p-datepicker
              inputId="dateOfBirth"
              formControlName="dateOfBirth"
              dateFormat="dd.mm.yy"
              [showIcon]="true"
              [fluid]="true"
              appendTo="body"
            />
            @if (errorText('dateOfBirth'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>

          <div class="field">
            <label for="gender">Cinsiyet *</label>
            <p-select
              inputId="gender"
              formControlName="gender"
              [options]="genderOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seçiniz"
              [fluid]="true"
            />
            @if (errorText('gender'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>
        </div>

        <div class="field">
          <label for="identityNumber">TC Kimlik No *</label>
          <input
            id="identityNumber"
            type="text"
            pInputText
            [fluid]="true"
            formControlName="identityNumber"
            maxlength="11"
          />
          @if (errorText('identityNumber'); as msg) {
            <small class="field-error">{{ msg }}</small>
          }
        </div>

        <div class="field">
          <label for="address">Adres *</label>
          <textarea
            id="address"
            pTextarea
            [fluid]="true"
            rows="3"
            formControlName="address"
          ></textarea>
          @if (errorText('address'); as msg) {
            <small class="field-error">{{ msg }}</small>
          }
        </div>

        @if (serverError()) {
          <p-message severity="error">{{ serverError() }}</p-message>
        }

        <div class="form-actions">
          <app-button type="button" label="Vazgeç" severity="secondary" (onClick)="onCancel()" />
          <app-button
            type="submit"
            [label]="submitLabel()"
            severity="info"
            [loading]="submitting()"
          />
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .form-page {
        max-width: 720px;
        background: white;
        border-radius: 10px;
        padding: 2rem;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      }

      .form-page h1 {
        margin: 0 0 1.5rem;
        font-size: 1.3rem;
        color: #333;
      }

      .patient-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
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

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }

      @media (max-width: 600px) {
        .form-row {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column-reverse;
        }
      }
    `,
  ],
})
export class PatientFormComponent {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly genderOptions = GENDER_OPTIONS;

  submitting = signal(false);
  serverError = signal<string | null>(null);

  // Resolver'ın route.data'ya koyduğu değeri sinyale çeviriyoruz.
  // toSignal kullanmamızın sebebi: aynı component instance'ı
  // (/patients/1/edit -> /patients/2/edit gibi) route parametresi
  // değiştiğinde router tarafından yeniden kullanılabiliyor — snapshot
  // yerine observable'a abone olmak bu durumda da formu doğru dolduruyor.
  private resolvedData = toSignal(this.route.data);
  resolvedPatient = computed<Patient | null>(
    () => (this.resolvedData()?.['patient'] as Patient | null) ?? null,
  );

  isEditMode = computed(() => this.resolvedPatient() !== null);
  pageTitle = computed(() => (this.isEditMode() ? 'Hastayı Düzenle' : 'Yeni Hasta'));
  submitLabel = computed(() => (this.isEditMode() ? 'Güncelle' : 'Kaydet'));

  patientForm = this.fb.group({
    firstName: ['', [Validators.required, minLengthValidator(2)]],
    lastName: ['', [Validators.required, minLengthValidator(2)]],
    email: ['', [Validators.required, emailValidator()]],
    phone: ['', [Validators.required, phoneValidator()]],
    dateOfBirth: this.fb.control<Date | null>(null, [
      Validators.required,
      pastDateValidator(),
      ageValidator(0, 120),
    ]),
    gender: this.fb.control<'Male' | 'Female' | 'Other' | null>(null, [Validators.required]),
    address: ['', [Validators.required, minLengthValidator(5)]],
    identityNumber: ['', [Validators.required, identityNumberValidator()]],
  });

  constructor() {
    // Resolve edilen hasta değiştikçe (veya create modunda null geldiğinde)
    // formu güncel tutuyoruz.
    effect(() => {
      const patient = this.resolvedPatient();

      if (patient) {
        this.patientForm.patchValue({
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          phone: patient.phone,
          dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth) : null,
          gender: patient.gender,
          address: patient.address,
          identityNumber: patient.identityNumber,
        });
      } else {
        this.patientForm.reset();
      }
    });
  }

  errorText(controlName: keyof typeof this.patientForm.controls): string | null {
    const control = this.patientForm.controls[controlName];

    if (!control.invalid || (!control.dirty && !control.touched)) {
      return null;
    }

    const errors = control.errors ?? {};

    if (errors['required']) return VALIDATION_MESSAGES.REQUIRED;
    if (errors['invalidEmail']) return VALIDATION_MESSAGES.EMAIL_INVALID;
    if (errors['invalidPhone']) return VALIDATION_MESSAGES.PHONE_INVALID;
    if (errors['invalidIdentityNumber']) return VALIDATION_MESSAGES.IDENTITY_NUMBER_INVALID;
    if (errors['minLength']) return VALIDATION_MESSAGES.MIN_LENGTH(2);
    if (errors['futureDate']) return 'Doğum tarihi gelecekte olamaz.';
    if (errors['invalidAge']) return 'Geçerli bir doğum tarihi giriniz.';

    return VALIDATION_MESSAGES.PATTERN;
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.serverError.set(null);
    this.submitting.set(true);

    const raw = this.patientForm.getRawValue();
    const payload: CreatePatientRequest = {
      firstName: raw.firstName!,
      lastName: raw.lastName!,
      email: raw.email!,
      phone: raw.phone!,
      dateOfBirth: raw.dateOfBirth!,
      gender: raw.gender!,
      address: raw.address!,
      identityNumber: raw.identityNumber!,
    };

    const patient = this.resolvedPatient();
    const request$ = patient
      ? this.patientService.update(patient.id, payload)
      : this.patientService.create(payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigateByUrl('/patients');
      },
      error: (err: { message?: string }) => {
        this.submitting.set(false);
        this.serverError.set(err?.message || MESSAGES.ERROR.SERVER_ERROR);
      },
    });
  }

  onCancel(): void {
    this.router.navigateByUrl('/patients');
  }
}
