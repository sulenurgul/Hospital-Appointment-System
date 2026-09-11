import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageModule } from 'primeng/message';
import { DoctorService } from '@core/services/doctor.service';
import { DepartmentService } from '@core/services/department.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { VALIDATION_MESSAGES, MESSAGES } from '@core/constants/app.constants';
import { emailValidator, phoneValidator, minLengthValidator } from '@shared/utils/validators';
import type { Doctor, CreateDoctorRequest } from '@shared/models/doctor.model';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    MessageModule,
    ButtonComponent,
  ],
  template: `
    <div class="form-page">
      <h1>{{ pageTitle() }}</h1>

      <form [formGroup]="doctorForm" (ngSubmit)="onSubmit()" class="doctor-form">
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
            <label for="specialization">Uzmanlık Alanı *</label>
            <input
              id="specialization"
              type="text"
              pInputText
              [fluid]="true"
              formControlName="specialization"
            />
            @if (errorText('specialization'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>

          <div class="field">
            <label for="departmentId">Birim *</label>
            <p-select
              inputId="departmentId"
              formControlName="departmentId"
              [options]="departmentOptions()"
              [loading]="departmentsRes.isLoading()"
              optionLabel="label"
              optionValue="value"
              placeholder="Seçiniz"
              [fluid]="true"
            />
            @if (errorText('departmentId'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>
        </div>

        <div class="field">
          <label for="licenseNumber">Lisans No *</label>
          <input
            id="licenseNumber"
            type="text"
            pInputText
            [fluid]="true"
            formControlName="licenseNumber"
          />
          @if (errorText('licenseNumber'); as msg) {
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

      .doctor-form {
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
export class DoctorFormComponent {
  private fb = inject(FormBuilder);
  private doctorService = inject(DoctorService);
  private departmentService = inject(DepartmentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  submitting = signal(false);
  serverError = signal<string | null>(null);

  private resolvedData = toSignal(this.route.data);
  resolvedDoctor = computed<Doctor | null>(
    () => (this.resolvedData()?.['doctor'] as Doctor | null) ?? null,
  );

  isEditMode = computed(() => this.resolvedDoctor() !== null);
  pageTitle = computed(() => (this.isEditMode() ? 'Doktoru Düzenle' : 'Yeni Doktor'));
  submitLabel = computed(() => (this.isEditMode() ? 'Güncelle' : 'Kaydet'));

  departmentsRes = rxResource({
    params: () => ({}),
    stream: () => this.departmentService.getAll(1, 200),
  });

  departmentOptions = computed(() =>
    (this.departmentsRes.value()?.data ?? []).map((dept) => ({ label: dept.name, value: dept.id })),
  );

  doctorForm = this.fb.group({
    firstName: ['', [Validators.required, minLengthValidator(2)]],
    lastName: ['', [Validators.required, minLengthValidator(2)]],
    email: ['', [Validators.required, emailValidator()]],
    phone: ['', [Validators.required, phoneValidator()]],
    specialization: ['', [Validators.required, minLengthValidator(2)]],
    departmentId: this.fb.control<string | null>(null, [Validators.required]),
    licenseNumber: ['', [Validators.required, minLengthValidator(3)]],
  });

  constructor() {
    effect(() => {
      const doctor = this.resolvedDoctor();

      if (doctor) {
        this.doctorForm.patchValue({
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          email: doctor.email,
          phone: doctor.phone,
          specialization: doctor.specialization,
          departmentId: doctor.departmentId,
          licenseNumber: doctor.licenseNumber,
        });
      } else {
        this.doctorForm.reset();
      }
    });
  }

  errorText(controlName: keyof typeof this.doctorForm.controls): string | null {
    const control = this.doctorForm.controls[controlName];

    if (!control.invalid || (!control.dirty && !control.touched)) {
      return null;
    }

    const errors = control.errors ?? {};

    if (errors['required']) return VALIDATION_MESSAGES.REQUIRED;
    if (errors['invalidEmail']) return VALIDATION_MESSAGES.EMAIL_INVALID;
    if (errors['invalidPhone']) return VALIDATION_MESSAGES.PHONE_INVALID;
    if (errors['minLength']) return VALIDATION_MESSAGES.MIN_LENGTH(2);

    return VALIDATION_MESSAGES.PATTERN;
  }

  onSubmit(): void {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    this.serverError.set(null);
    this.submitting.set(true);

    const raw = this.doctorForm.getRawValue();
    const payload: CreateDoctorRequest = {
      firstName: raw.firstName!,
      lastName: raw.lastName!,
      email: raw.email!,
      phone: raw.phone!,
      specialization: raw.specialization!,
      departmentId: raw.departmentId!,
      licenseNumber: raw.licenseNumber!,
    };

    const doctor = this.resolvedDoctor();
    const request$ = doctor
      ? this.doctorService.update(doctor.id, payload)
      : this.doctorService.create(payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigateByUrl('/doctors');
      },
      error: (err: { message?: string }) => {
        this.submitting.set(false);
        this.serverError.set(err?.message || MESSAGES.ERROR.SERVER_ERROR);
      },
    });
  }

  onCancel(): void {
    this.router.navigateByUrl('/doctors');
  }
}
