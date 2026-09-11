import { Routes } from '@angular/router';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { appointmentResolver } from './appointment.resolver';

export const appointmentRoutes: Routes = [
  {
    path: '',
    component: AppointmentListComponent,
    data: { roles: ['Doctor', 'Nurse'] },
  },
  {
    path: 'new',
    component: AppointmentFormComponent,
    data: { roles: ['Doctor', 'Nurse'] },
  },
  {
    path: ':id/edit',
    component: AppointmentFormComponent,
    data: { roles: ['Doctor', 'Nurse'] },
    resolve: { appointment: appointmentResolver },
  },
];
