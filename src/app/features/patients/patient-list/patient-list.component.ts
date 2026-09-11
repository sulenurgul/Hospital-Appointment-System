import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PatientService } from '@core/services/patient.service';
import { GridComponent, GridColumn } from '@shared/components/grid/grid.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';
import { PhoneFormatPipe } from '@shared/pipes/phone-format.pipe';
import { MESSAGES } from '@core/constants/app.constants';
import type { Patient } from '@shared/models/patient.model';

const GENDER_LABELS: Record<Patient['gender'], string> = {
  Male: 'Erkek',
  Female: 'Kadın',
  Other: 'Diğer',
};

interface PatientRow extends Patient {
  genderLabel: string;
  phoneDisplay: string;
  dateOfBirthDisplay: string;
}

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, GridComponent, ButtonComponent, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="list-page">
      <div class="list-header">
        <h1>Hasta Yönetimi</h1>
        <app-button label="Yeni Hasta" icon="pi pi-plus" severity="info" (onClick)="onAdd()" />
      </div>

      <app-grid
        [columns]="columns"
        [dataSource]="patients()"
        [loading]="patientsRes.isLoading()"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event)"
      />

      @if (patientsRes.error()) {
        <p class="list-error">
          Hastalar yüklenemedi.
          <button type="button" class="retry-btn" (click)="patientsRes.reload()">
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
export class PatientListComponent {
  private patientService = inject(PatientService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  private datePipe = new DateFormatPipe();
  private phonePipe = new PhoneFormatPipe();

  columns: GridColumn[] = [
    { field: 'firstName', header: 'Ad' },
    { field: 'lastName', header: 'Soyad' },
    { field: 'email', header: 'E-posta' },
    { field: 'phoneDisplay', header: 'Telefon', sortable: false },
    { field: 'genderLabel', header: 'Cinsiyet' },
    { field: 'dateOfBirthDisplay', header: 'Doğum Tarihi' },
  ];

  patientsRes = rxResource({
    params: () => ({}),
    stream: () => this.patientService.getAll(1, 200),
  });

  patients = computed<PatientRow[]>(() => {
    const rows = this.patientsRes.value()?.data ?? [];

    return rows.map((patient) => ({
      ...patient,
      genderLabel: GENDER_LABELS[patient.gender] ?? patient.gender,
      phoneDisplay: this.phonePipe.transform(patient.phone),
      dateOfBirthDisplay: this.datePipe.transform(patient.dateOfBirth),
    }));
  });

  onAdd(): void {
    this.router.navigateByUrl('/patients/new');
  }

  onEdit(row: PatientRow): void {
    this.router.navigateByUrl(`/patients/${row.id}/edit`);
  }

  onDelete(id: string): void {
    this.confirmationService.confirm({
      header: 'Hastayı Sil',
      message: 'Bu hastayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Evet, Sil',
      rejectLabel: 'Vazgeç',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.deletePatient(id),
    });
  }

  private deletePatient(id: string): void {
    this.patientService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Silindi',
          detail: MESSAGES.SUCCESS.DELETE,
        });
        this.patientsRes.reload();
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
