import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DepartmentService } from '@core/services/department.service';
import { GridComponent, GridColumn } from '@shared/components/grid/grid.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { PhoneFormatPipe } from '@shared/pipes/phone-format.pipe';
import { MESSAGES } from '@core/constants/app.constants';
import type { Department } from '@shared/models/department.model';

interface DepartmentRow extends Department {
  contactNumberDisplay: string;
}

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, GridComponent, ButtonComponent, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="list-page">
      <div class="list-header">
        <h1>Departman Yönetimi</h1>
        <app-button label="Yeni Departman" icon="pi pi-plus" severity="info" (onClick)="onAdd()" />
      </div>

      <app-grid
        [columns]="columns"
        [dataSource]="departments()"
        [loading]="departmentsRes.isLoading()"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event)"
      />

      @if (departmentsRes.error()) {
        <p class="list-error">
          Departmanlar yüklenemedi.
          <button type="button" class="retry-btn" (click)="departmentsRes.reload()">
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
export class DepartmentListComponent {
  private departmentService = inject(DepartmentService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  private phonePipe = new PhoneFormatPipe();

  columns: GridColumn[] = [
    { field: 'name', header: 'Ad' },
    { field: 'description', header: 'Açıklama' },
    { field: 'contactNumberDisplay', header: 'İletişim', sortable: false },
    { field: 'floorNumber', header: 'Kat' },
  ];

  departmentsRes = rxResource({
    params: () => ({}),
    stream: () => this.departmentService.getAll(1, 200),
  });

  departments = computed<DepartmentRow[]>(() => {
    const rows = this.departmentsRes.value()?.data ?? [];

    return rows.map((department) => ({
      ...department,
      contactNumberDisplay: this.phonePipe.transform(department.contactNumber),
    }));
  });

  onAdd(): void {
    this.router.navigateByUrl('/departments/new');
  }

  onEdit(row: DepartmentRow): void {
    this.router.navigateByUrl(`/departments/${row.id}/edit`);
  }

  onDelete(id: string): void {
    this.confirmationService.confirm({
      header: 'Departmanı Sil',
      message:
        'Bu departmanı silmek istediğinizden emin misiniz? Bu departmana bağlı doktor/randevu kayıtları varsa tutarsızlık oluşabilir.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Evet, Sil',
      rejectLabel: 'Vazgeç',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () => this.deleteDepartment(id),
    });
  }

  private deleteDepartment(id: string): void {
    this.departmentService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Silindi',
          detail: MESSAGES.SUCCESS.DELETE,
        });
        this.departmentsRes.reload();
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
