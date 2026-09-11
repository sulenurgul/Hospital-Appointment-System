import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

export interface GridColumn {
  field: string;
  header: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
}

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, RippleModule, TooltipModule],
  template: `
    <p-table
      [value]="dataSource()"
      [loading]="loading()"
      [rows]="10"
      [paginator]="true"
      [globalFilterFields]="getFilterFields()"
      responsiveLayout="scroll"
      styleClass="p-datatable-striped"
    >
      <ng-template #header>
        <tr>
          <th
            *ngFor="let col of columns()"
            [hidden]="col.field === 'actions'"
            [style.width]="col.width || 'auto'"
            [pSortableColumn]="col.sortable !== false ? col.field : undefined"
          >
            {{ col.header }}
          </th>
          <th style="width: 150px">İşlemler</th>
        </tr>
      </ng-template>

      <ng-template #body let-rowData>
        <tr>
          <td *ngFor="let col of columns()" [hidden]="col.field === 'actions'">
            {{ rowData[col.field] }}
          </td>
          <td>
            <div class="flex gap-2">
              <button
                pButton
                pRipple
                type="button"
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success p-button-sm"
                (click)="onEditClick(rowData)"
                pTooltip="Düzenle"
                tooltipPosition="top"
              ></button>

              <button
                pButton
                pRipple
                type="button"
                icon="pi pi-trash"
                class="p-button-rounded p-button-danger p-button-sm"
                (click)="onDeleteClick(rowData.id)"
                pTooltip="Sil"
                tooltipPosition="top"
              ></button>
            </div>
          </td>
        </tr>
      </ng-template>

      <ng-template #emptymessage>
        <tr>
          <td colspan="100" class="text-center p-4">Veri bulunamadı</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .flex {
        display: flex;
      }

      .gap-2 {
        gap: 0.5rem;
      }

      .text-center {
        text-align: center;
      }

      .p-4 {
        padding: 1rem;
      }
    `,
  ],
})
export class GridComponent {
  columns = input<GridColumn[]>([]);
  loading = input(false);

  dataSource = model<any[]>([]);

  onEdit = output<any>();
  onDelete = output<string>();

  onEditClick(row: any): void {
    this.onEdit.emit(row);
  }

  onDeleteClick(id: string): void {
    this.onDelete.emit(id);
  }

  getFilterFields(): string[] {
    return this.columns()
      .filter((col) => col.filterable !== false && col.field !== 'actions')
      .map((col) => col.field);
  }
}
