import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';
import { MainLayoutComponent } from '@layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },

  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['Doctor', 'Nurse'] },
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },

      {
        path: 'patients',
        canActivate: [roleGuard],
        data: { roles: ['Doctor'] },
        loadChildren: () =>
          import('./features/patients/patient.routes').then((m) => m.patientRoutes),
      },

      {
        path: 'doctors',
        canActivate: [roleGuard],
        data: { roles: ['Doctor'] },
        loadChildren: () => import('./features/doctors/doctor.routes').then((m) => m.doctorRoutes),
      },

      {
        path: 'departments',
        canActivate: [roleGuard],
        data: { roles: ['Doctor'] },
        loadChildren: () =>
          import('./features/departments/department.routes').then((m) => m.departmentRoutes),
      },

      {
        path: 'appointments',
        canActivate: [roleGuard],
        data: { roles: ['Doctor', 'Nurse'] },
        loadChildren: () =>
          import('./features/appointments/appointment.routes').then((m) => m.appointmentRoutes),
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
