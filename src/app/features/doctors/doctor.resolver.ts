import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DoctorService } from '@core/services/doctor.service';
import type { Doctor } from '@shared/models/doctor.model';

export const doctorResolver: ResolveFn<Doctor | null> = (route) => {
  const doctorService = inject(DoctorService);
  const id = route.paramMap.get('id');

  if (!id) {
    return of(null);
  }

  return doctorService.getById(id).pipe(
    map((response) => response.data ?? null),
    catchError(() => of(null)),
  );
};
