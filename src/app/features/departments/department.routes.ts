import { Routes } from '@angular/router';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentFormComponent } from './department-form/department-form.component';

export const departmentRoutes: Routes = [
  {
    path: '',
    component: DepartmentListComponent,
    data: { roles: ['Doctor'] },
  },
  {
    path: 'new',
    component: DepartmentFormComponent,
    data: { roles: ['Doctor'] },
  },
  {
    path: ':id/edit',
    component: DepartmentFormComponent,
    data: { roles: ['Doctor'] },
  },
];
