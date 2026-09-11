import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DepartmentService } from '@core/services/department.service';
import type { Department } from '@shared/models/department.model';

export const departmentResolver: ResolveFn<Department | null> = (route) => {
  const departmentService = inject(DepartmentService);
  const id = route.paramMap.get('id');

  if (!id) {
    return of(null);
  }

  return departmentService.getById(id).pipe(
    map((response) => response.data ?? null),
    catchError(() => of(null)),
  );
};
