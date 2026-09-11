import { Routes } from '@angular/router';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { appointmentResolver } from './appointment.resolver';

export const appointmentRoutes: Routes = [
  {
    path: '',
    component: AppointmentListComponent,
  },
  {
    path: 'new',
    component: AppointmentFormComponent,
  },
  {
    path: ':id/edit',
    component: AppointmentFormComponent,
    resolve: { appointment: appointmentResolver },
  },
];
