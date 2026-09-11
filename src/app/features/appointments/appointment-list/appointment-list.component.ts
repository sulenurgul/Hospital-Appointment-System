import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AppointmentService } from '@core/services/appointment.service';
import { PatientService } from '@core/services/patient.service';
import { DoctorService } from '@core/services/doctor.service';
import { DepartmentService } from '@core/services/department.service';
import { GridComponent, GridColumn } from '@shared/components/grid/grid.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';
import { StatusPipe } from '@shared/pipes/status.pipe';
import { MESSAGES } from '@core/constants/app.constants';
import type { Appointment } from '@shared/models/appointment.model';

interface AppointmentRow extends Appointment {
  patientName: string;
  doctorName: string;
  departmentName: string;
  dateDisplay: string;
  statusLabel: string;
}

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, GridComponent, ButtonComponent, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="list-page">
      <div class="list-header">
        <h1>Randevu Yönetimi</h1>
        <app-button label="Yeni Randevu" icon="pi pi-plus" severity="info" (onClick)="onAdd()" />
      </div>

      <app-grid
        [columns]="columns"
        [dataSource]="appointments()"
        [loading]="isLoading()"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event)"
      />

      @if (appointmentsRes.error()) {
        <p class="list-error">
          Randevular yüklenemedi.
          <button type="button" class="retry-btn" (click)="appointmentsRes.reload()">
            Tekrar dene
          </button>
        </p>
      }
    </div>

    <p-confirmdialog />
    <p-toast />
  `,
  styles: [
    `
      .list-page {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .list-header h1 {
        margin: 0;
        font-size: 1.3rem;
        color: #333;
      }

      .list-error {
        color: #e24c4c;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .retry-btn {
        border: none;
        background: none;
        color: #667eea;
        text-decoration: underline;
        cursor: pointer;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class AppointmentListComponent {
  private appointmentService = inject(AppointmentService);
  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);
  private departmentService = inject(DepartmentService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  private datePipe = new DateFormatPipe();
  private statusPipe = new StatusPipe();

  columns: GridColumn[] = [
    { field: 'patientName', header: 'Hasta' },
    { field: 'doctorName', header: 'Doktor' },
    { field: 'departmentName', header: 'Birim' },
    { field: 'dateDisplay', header: 'Tarih / Saat', sortable: false },
    { field: 'statusLabel', header: 'Durum' },
  ];

  appointmentsRes = rxResource({
    params: () => ({}),
    stream: () => this.appointmentService.getAll(1, 200),
  });

  private patientsRes = rxResource({
    params: () => ({}),
    stream: () => this.patientService.getAll(1, 200),
  });

  private doctorsRes = rxResource({
    params: () => ({}),
    stream: () => this.doctorService.getAll(1, 200),
  });

  private departmentsRes = rxResource({
    params: () => ({}),
    stream: () => this.departmentService.getAll(1, 200),
  });

  isLoading = computed(
    () =>
      this.appointmentsRes.isLoading() ||
      this.patientsRes.isLoading() ||
      this.doctorsRes.isLoading() ||
      this.departmentsRes.isLoading(),
  );

  private patientNameById = computed(() => {
    const map = new Map<string, string>();
    for (const p of this.patientsRes.value()?.data ?? []) {
      map.set(p.id, `${p.firstName} ${p.lastName}`);
    }
    return map;
  });

  private doctorNameById = computed(() => {
    const map = new Map<string, string>();
    for (const d of this.doctorsRes.value()?.data ?? []) {
      map.set(d.id, `${d.firstName} ${d.lastName}`);
    }
    return map;
  });

  private departmentNameById = computed(() => {
    const map = new Map<string, string>();
    for (const dept of this.departmentsRes.value()?.data ?? []) {
      map.set(dept.id, dept.name);
    }
    return map;
  });

  appointments = computed<AppointmentRow[]>(() => {
    const rows = this.appointmentsRes.value()?.data ?? [];
    const patientNames = this.patientNameById();
    const doctorNames = this.doctorNameById();
    const deptNames = this.departmentNameById();

    return rows.map((appt) => ({
      ...appt,
      patientName: appt.patient
        ? `${appt.patient.firstName} ${appt.patient.lastName}`
        : (patientNames.get(appt.patientId) ?? '—'),
      doctorName: appt.doctor
        ? `${appt.doctor.firstName} ${appt.doctor.lastName}`
        : (doctorNames.get(appt.doctorId) ?? '—'),
      departmentName: appt.department?.name ?? deptNames.get(appt.departmentId) ?? '—',
      dateDisplay: `${this.datePipe.transform(appt.appointmentDate)} ${appt.appointmentTime}`,
      statusLabel: this.statusPipe.transform(appt.status),
    }));
  });

  onAdd(): void {
    this.router.navigateByUrl('/appointments/new');
  }

  onEdit(row: AppointmentRow): void {
    this.router.navigateByUrl(`/appointments/${row.id}/edit`);
  }

  onDelete(id: string): void {
    this.confirmationService.confirm({
      header: 'Randevuyu Sil',
      message: 'Bu randevuyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Evet, Sil',
      rejectLabel: 'Vazgeç',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.deleteAppointment(id),
    });
  }

  private deleteAppointment(id: string): void {
    this.appointmentService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Silindi',
          detail: MESSAGES.SUCCESS.DELETE,
        });
        this.appointmentsRes.reload();
      },
      error: (err: { message?: string }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: err?.message || MESSAGES.ERROR.SERVER_ERROR,
        });
      },
    });
  }
}
