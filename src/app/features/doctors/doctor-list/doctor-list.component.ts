import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DoctorService } from '@core/services/doctor.service';
import { DepartmentService } from '@core/services/department.service';
import { GridComponent, GridColumn } from '@shared/components/grid/grid.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { PhoneFormatPipe } from '@shared/pipes/phone-format.pipe';
import { MESSAGES } from '@core/constants/app.constants';
import type { Doctor } from '@shared/models/doctor.model';

interface DoctorRow extends Doctor {
  phoneDisplay: string;
  departmentName: string;
}

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, GridComponent, ButtonComponent, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="list-page">
      <div class="list-header">
        <h1>Doktor Yönetimi</h1>
        <app-button label="Yeni Doktor" icon="pi pi-plus" severity="info" (onClick)="onAdd()" />
      </div>

      <app-grid
        [columns]="columns"
        [dataSource]="doctors()"
        [loading]="doctorsRes.isLoading() || departmentsRes.isLoading()"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event)"
      />

      @if (doctorsRes.error()) {
        <p class="list-error">
          Doktorlar yüklenemedi.
          <button type="button" class="retry-btn" (click)="doctorsRes.reload()">Tekrar dene</button>
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
export class DoctorListComponent {
  private doctorService = inject(DoctorService);
  private departmentService = inject(DepartmentService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  private phonePipe = new PhoneFormatPipe();

  columns: GridColumn[] = [
    { field: 'firstName', header: 'Ad' },
    { field: 'lastName', header: 'Soyad' },
    { field: 'specialization', header: 'Uzmanlık' },
    { field: 'departmentName', header: 'Birim' },
    { field: 'phoneDisplay', header: 'Telefon', sortable: false },
    { field: 'licenseNumber', header: 'Lisans No' },
  ];

  doctorsRes = rxResource({
    params: () => ({}),
    stream: () => this.doctorService.getAll(1, 200),
  });

  // Doktor kaydında sadece departmentId var; ekranda ismini göstermek için
  // departman listesini de çekip id -> ad eşlemesi kuruyoruz.
  departmentsRes = rxResource({
    params: () => ({}),
    stream: () => this.departmentService.getAll(1, 200),
  });

  private departmentNameById = computed(() => {
    const map = new Map<string, string>();
    for (const dept of this.departmentsRes.value()?.data ?? []) {
      map.set(dept.id, dept.name);
    }
    return map;
  });

  doctors = computed<DoctorRow[]>(() => {
    const rows = this.doctorsRes.value()?.data ?? [];
    const deptNames = this.departmentNameById();

    return rows.map((doctor) => ({
      ...doctor,
      phoneDisplay: this.phonePipe.transform(doctor.phone),
      departmentName: deptNames.get(doctor.departmentId) ?? '—',
    }));
  });

  onAdd(): void {
    this.router.navigateByUrl('/doctors/new');
  }

  onEdit(row: DoctorRow): void {
    this.router.navigateByUrl(`/doctors/${row.id}/edit`);
  }

  onDelete(id: string): void {
    this.confirmationService.confirm({
      header: 'Doktoru Sil',
      message: 'Bu doktoru silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Evet, Sil',
      rejectLabel: 'Vazgeç',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.deleteDoctor(id),
    });
  }

  private deleteDoctor(id: string): void {
    this.doctorService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Silindi',
          detail: MESSAGES.SUCCESS.DELETE,
        });
        this.doctorsRes.reload();
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
