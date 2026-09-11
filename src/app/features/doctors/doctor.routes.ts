import { Routes } from '@angular/router';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { doctorResolver } from './doctor.resolver';

export const doctorRoutes: Routes = [
  { path: '', component: DoctorListComponent },
  { path: 'new', component: DoctorFormComponent },
  {
    path: ':id/edit',
    component: DoctorFormComponent,
    resolve: { doctor: doctorResolver },
  },
];
