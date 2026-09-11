import { Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { patientResolver } from './patient.resolver';

export const patientRoutes: Routes = [
  {
    path: '',
    component: PatientListComponent,
  },
  {
    path: 'new',
    component: PatientFormComponent,
  },
  {
    path: ':id/edit',
    component: PatientFormComponent,
    resolve: { patient: patientResolver },
  },
];
