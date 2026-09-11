import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { AppointmentService } from '@core/services/appointment.service';
import { PatientService } from '@core/services/patient.service';
import { DoctorService } from '@core/services/doctor.service';
import { DepartmentService } from '@core/services/department.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { StatusPipe } from '@shared/pipes/status.pipe';
import {
  APPOINTMENT_TIME_SLOTS,
  VALIDATION_MESSAGES,
  MESSAGES,
} from '@core/constants/app.constants';
import { appointmentDateValidator } from '@shared/utils/validators';
import type { Appointment, CreateAppointmentRequest } from '@shared/models/appointment.model';
import type { Doctor } from '@shared/models/doctor.model';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    MessageModule,
    ButtonComponent,
    StatusPipe,
  ],
  template: `
    <div class="form-page">
      <h1>{{ pageTitle() }}</h1>

      @if (isEditMode() && resolvedAppointment()) {
        <p class="current-status">
          Mevcut durum: <strong>{{ resolvedAppointment()!.status | status }}</strong>
        </p>
      }

      <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()" class="appointment-form">
        <div class="field">
          <label for="patientId">Hasta *</label>
          <p-select
            inputId="patientId"
            formControlName="patientId"
            [options]="patientOptions()"
            [loading]="patientsRes.isLoading()"
            optionLabel="label"
            optionValue="value"
            [filter]="true"
            placeholder="Hasta seçiniz"
            [fluid]="true"
          />
          @if (errorText('patientId'); as msg) {
            <small class="field-error">{{ msg }}</small>
          }
        </div>

        <div class="form-row">
          <div class="field">
            <label for="departmentId">Birim *</label>
            <p-select
              inputId="departmentId"
              formControlName="departmentId"
              [options]="departmentOptions()"
              [loading]="departmentsRes.isLoading()"
              optionLabel="label"
              optionValue="value"
              placeholder="Önce birim seçiniz"
              [fluid]="true"
            />
            @if (errorText('departmentId'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>

          <div class="field">
            <label for="doctorId">Doktor *</label>
            <p-select
              inputId="doctorId"
              [options]="doctorOptions()"
              [ngModel]="selectedDoctorId()"
              [ngModelOptions]="{ standalone: true }"
              [disabled]="!selectedDepartmentId()"
              (onChange)="onDoctorSelect($event.value)"
              optionLabel="label"
              optionValue="value"
              placeholder="Önce birim seçiniz"
              [fluid]="true"
            />
            @if (errorText('doctorId'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
            @if (
              selectedDepartmentId() && doctorOptions().length === 0 && !doctorsRes.isLoading()
            ) {
              <small class="field-hint">Bu birimde kayıtlı doktor bulunamadı.</small>
            }
          </div>
        </div>

        <div class="form-row">
          <div class="field">
            <label for="appointmentDate">Tarih *</label>
            <p-datepicker
              inputId="appointmentDate"
              formControlName="appointmentDate"
              dateFormat="dd.mm.yy"
              [minDate]="minDate"
              [maxDate]="maxDate"
              [showIcon]="true"
              [fluid]="true"
              appendTo="body"
            />
            @if (errorText('appointmentDate'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>

          <div class="field">
            <label for="appointmentTime">Saat *</label>
            <p-select
              inputId="appointmentTime"
              formControlName="appointmentTime"
              [options]="timeSlots"
              placeholder="Saat seçiniz"
              [fluid]="true"
            />
            @if (errorText('appointmentTime'); as msg) {
              <small class="field-error">{{ msg }}</small>
            }
          </div>
        </div>

        <div class="field">
          <label for="notes">Notlar</label>
          <textarea id="notes" pTextarea [fluid]="true" rows="3" formControlName="notes"></textarea>
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
        max-width: 760px;
        background: white;
        border-radius: 10px;
        padding: 2rem;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      }

      .form-page h1 {
        margin: 0 0 0.5rem;
        font-size: 1.3rem;
        color: #333;
      }

      .current-status {
        margin: 0 0 1.5rem;
        color: #666;
        font-size: 0.9rem;
      }

      .appointment-form {
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

      .field-hint {
        color: #999;
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
export class AppointmentFormComponent {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);
  private departmentService = inject(DepartmentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  submitting = signal(false);
  serverError = signal<string | null>(null);

  readonly timeSlots = APPOINTMENT_TIME_SLOTS;
  readonly minDate = new Date();
  readonly maxDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 20);
    return d;
  })();

  private resolvedData = toSignal(this.route.data);
  resolvedAppointment = computed<Appointment | null>(
    () => (this.resolvedData()?.['appointment'] as Appointment | null) ?? null,
  );

  isEditMode = computed(() => this.resolvedAppointment() !== null);
  pageTitle = computed(() => (this.isEditMode() ? 'Randevuyu Düzenle' : 'Yeni Randevu'));
  submitLabel = computed(() => (this.isEditMode() ? 'Güncelle' : 'Kaydet'));

  patientsRes = rxResource({
    params: () => ({}),
    stream: () => this.patientService.getAll(1, 200),
  });
  departmentsRes = rxResource({
    params: () => ({}),
    stream: () => this.departmentService.getAll(1, 200),
  });
  doctorsRes = rxResource({ params: () => ({}), stream: () => this.doctorService.getAll(1, 200) });

  patientOptions = computed(() =>
    (this.patientsRes.value()?.data ?? []).map((p) => ({
      label: `${p.firstName} ${p.lastName}`,
      value: p.id,
    })),
  );

  departmentOptions = computed(() =>
    (this.departmentsRes.value()?.data ?? []).map((d) => ({ label: d.name, value: d.id })),
  );

  appointmentForm = this.fb.group({
    patientId: this.fb.control<string | null>(null, [Validators.required]),
    departmentId: this.fb.control<string | null>(null, [Validators.required]),
    doctorId: this.fb.control<string | null>(null, [Validators.required]),
    appointmentDate: this.fb.control<Date | null>(null, [
      Validators.required,
      appointmentDateValidator(),
    ]),
    appointmentTime: this.fb.control<string | null>(null, [Validators.required]),
    notes: [''],
  });

  selectedDepartmentId = toSignal(this.appointmentForm.controls.departmentId.valueChanges, {
    initialValue: this.appointmentForm.controls.departmentId.value,
  });

  doctorOptions = computed<{ label: string; value: string }[]>(() => {
    const deptId = this.selectedDepartmentId();
    if (!deptId) return [];

    const allDoctors = this.doctorsRes.value()?.data ?? [];
    return allDoctors
      .filter((d: Doctor) => d.departmentId === deptId)
      .map((d) => ({ label: `${d.firstName} ${d.lastName} (${d.specialization})`, value: d.id }));
  });

  selectedDoctorId = linkedSignal<string | null>(() => {
    this.selectedDepartmentId();
    return null;
  });

  constructor() {
    effect(() => {
      const appointment = this.resolvedAppointment();

      if (appointment) {
        this.appointmentForm.patchValue({
          patientId: appointment.patientId,
          departmentId: appointment.departmentId,
          appointmentDate: appointment.appointmentDate
            ? new Date(appointment.appointmentDate)
            : null,
          appointmentTime: appointment.appointmentTime,
          notes: appointment.notes,
        });

        const doctors = untracked(() => this.doctorsRes.value()?.data ?? []);
        const stillValid = doctors.some((d) => d.id === appointment.doctorId);
        this.selectedDoctorId.set(stillValid ? appointment.doctorId : null);
      } else {
        this.appointmentForm.reset();
        this.selectedDoctorId.set(null);
      }
    });

    // selectedDoctorId (linkedSignal) değiştikçe gerçek FormControl'ü senkron tut —
    // validasyon ve submit hep appointmentForm üzerinden okunuyor.
    effect(() => {
      const doctorId = this.selectedDoctorId();
      const control = this.appointmentForm.controls.doctorId;
      if (control.value !== doctorId) {
        control.setValue(doctorId);
      }
    });
  }

  onDoctorSelect(doctorId: string | null): void {
    this.selectedDoctorId.set(doctorId);
    const control = this.appointmentForm.controls.doctorId;
    control.markAsDirty();
    control.markAsTouched();
  }

  errorText(controlName: keyof typeof this.appointmentForm.controls): string | null {
    const control = this.appointmentForm.controls[controlName];

    if (!control.invalid || (!control.dirty && !control.touched)) {
      return null;
    }

    const errors = control.errors ?? {};

    if (errors['required']) return VALIDATION_MESSAGES.REQUIRED;
    if (errors['geçmişTarih']) return 'Randevu tarihi geçmişte olamaz.';
    if (errors['çokİleriTarih']) return 'Randevu en fazla 20 gün sonrasına alınabilir.';

    return VALIDATION_MESSAGES.PATTERN;
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    this.serverError.set(null);
    this.submitting.set(true);

    const raw = this.appointmentForm.getRawValue();
    const payload: CreateAppointmentRequest = {
      patientId: raw.patientId!,
      doctorId: raw.doctorId!,
      departmentId: raw.departmentId!,
      appointmentDate: raw.appointmentDate!,
      appointmentTime: raw.appointmentTime!,
      notes: raw.notes ?? '',
    };

    const appointment = this.resolvedAppointment();
    const request$ = appointment
      ? this.appointmentService.update(appointment.id, payload)
      : this.appointmentService.create(payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigateByUrl('/appointments');
      },
      error: (err: { message?: string }) => {
        this.submitting.set(false);
        this.serverError.set(err?.message || MESSAGES.ERROR.SERVER_ERROR);
      },
    });
  }

  onCancel(): void {
    this.router.navigateByUrl('/appointments');
  }
}
