import { Routes } from '@angular/router';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';

export const doctorRoutes: Routes = [
  { path: '', component: DoctorListComponent, data: { roles: ['Doctor'] } },
  { path: 'new', component: DoctorFormComponent, data: { roles: ['Doctor'] } },
  { path: ':id/edit', component: DoctorFormComponent, data: { roles: ['Doctor'] } },
];
