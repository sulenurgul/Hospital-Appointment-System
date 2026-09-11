import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppointmentService } from '@core/services/appointment.service';
import type { Appointment } from '@shared/models/appointment.model';

export const appointmentResolver: ResolveFn<Appointment | null> = (route) => {
  const appointmentService = inject(AppointmentService);
  const id = route.paramMap.get('id');

  if (!id) {
    return of(null);
  }

  return appointmentService.getById(id).pipe(
    map((response) => response.data ?? null),
    catchError(() => of(null)),
  );
};
