import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { DepartmentService } from '@core/services/department.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { VALIDATION_MESSAGES, MESSAGES } from '@core/constants/app.constants';
import { phoneValidator, minLengthValidator } from '@shared/utils/validators';
import type { Department, CreateDepartmentRequest } from '@shared/models/department.model';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    MessageModule,
    ButtonComponent,
  ],
  template: `
    <div class="form-page">
      <h1>{{ pageTitle() }}</h1>

      <form [formGroup]="departmentForm" (ngSubmit)="onSubmit()" class="department-form">
        <div class="field">
          <label for="name">Departman Adı *</label>
          <input id="name" type="text" pInputText [fluid]="true" formControlName="name" />
          @if (errorText('name'); as msg) {
            <small class="field-error">{{ msg }}</small>
          }
        </div>

        <div class="field">
          <label for="description">Açıklama *</label>
          <textarea
            id="description"
            pTextarea
            [fluid]="true"
            rows="3"
            formControlName="description"
          ></textarea>
          @if (errorText('description'); as msg) {
            <small class="field-error">{{ msg }}</small>
          }
        </div>

        <div class="form-row">
          <div class="field">
            <label for="contactNumber">İletişim Numarası *</label>
            <input
              id="contactNumber"
              type="text"
              pInputText
              [fluid]="true"
              formControlName="contactNumber"
              placeholder="05XX XXX XXXX"
            />
            @if (errorText('contactNumber'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>

          <div class="field">
            <label for="floorNumber">Kat *</label>
            <p-inputnumber
              inputId="floorNumber"
              formControlName="floorNumber"
              [min]="0"
              [max]="50"
              [showButtons]="true"
              [fluid]="true"
            />
            @if (errorText('floorNumber'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>
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
        max-width: 640px;
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

      .department-form {
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
export class DepartmentFormComponent {
  private fb = inject(FormBuilder);
  private departmentService = inject(DepartmentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  submitting = signal(false);
  serverError = signal<string | null>(null);

  private resolvedData = toSignal(this.route.data);
  resolvedDepartment = computed<Department | null>(
    () => (this.resolvedData()?.['department'] as Department | null) ?? null,
  );

  isEditMode = computed(() => this.resolvedDepartment() !== null);
  pageTitle = computed(() => (this.isEditMode() ? 'Departmanı Düzenle' : 'Yeni Departman'));
  submitLabel = computed(() => (this.isEditMode() ? 'Güncelle' : 'Kaydet'));

  departmentForm = this.fb.group({
    name: ['', [Validators.required, minLengthValidator(2)]],
    description: ['', [Validators.required, minLengthValidator(5)]],
    contactNumber: ['', [Validators.required, phoneValidator()]],
    floorNumber: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(50),
    ]),
  });

  constructor() {
    effect(() => {
      const department = this.resolvedDepartment();

      if (department) {
        this.departmentForm.patchValue({
          name: department.name,
          description: department.description,
          contactNumber: department.contactNumber,
          floorNumber: department.floorNumber,
        });
      } else {
        this.departmentForm.reset();
      }
    });
  }

  errorText(controlName: keyof typeof this.departmentForm.controls): string | null {
    const control = this.departmentForm.controls[controlName];

    if (!control.invalid || (!control.dirty && !control.touched)) {
      return null;
    }

    const errors = control.errors ?? {};

    if (errors['required']) return VALIDATION_MESSAGES.REQUIRED;
    if (errors['invalidPhone']) return VALIDATION_MESSAGES.PHONE_INVALID;
    if (errors['minLength']) return VALIDATION_MESSAGES.MIN_LENGTH(2);
    if (errors['min'] || errors['max']) return 'Kat numarası 0-50 arasında olmalıdır.';

    return VALIDATION_MESSAGES.PATTERN;
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    this.serverError.set(null);
    this.submitting.set(true);

    const raw = this.departmentForm.getRawValue();
    const payload: CreateDepartmentRequest = {
      name: raw.name!,
      description: raw.description!,
      contactNumber: raw.contactNumber!,
      floorNumber: raw.floorNumber!,
    };

    const department = this.resolvedDepartment();
    const request$ = department
      ? this.departmentService.update(department.id, payload)
      : this.departmentService.create(payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigateByUrl('/departments');
      },
      error: (err: { message?: string }) => {
        this.submitting.set(false);
        this.serverError.set(err?.message || MESSAGES.ERROR.SERVER_ERROR);
      },
    });
  }

  onCancel(): void {
    this.router.navigateByUrl('/departments');
  }
}
