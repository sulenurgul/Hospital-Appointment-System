import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PatientService } from '@core/services/patient.service';
import type { Patient } from '@shared/models/patient.model';

export const patientResolver: ResolveFn<Patient | null> = (route) => {
  const patientService = inject(PatientService);
  const id = route.paramMap.get('id');

  if (!id) {
    return of(null);
  }

  return patientService.getById(id).pipe(
    map((response) => response.data ?? null),
    catchError(() => of(null)),
  );
};
