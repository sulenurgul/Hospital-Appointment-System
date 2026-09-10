import { Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';

export const patientRoutes: Routes = [
  {
    path: '',
    component: PatientListComponent,
    data: { roles: ['Doctor'] },
  },
  {
    path: 'new',
    component: PatientFormComponent,
    data: { roles: ['Doctor'] },
  },
  {
    path: ':id/edit',
    component: PatientFormComponent,
    data: { roles: ['Doctor'] },
  },
];
