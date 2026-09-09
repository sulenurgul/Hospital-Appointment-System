
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Doctor, CreateDoctorRequest } from '@shared/models/doctor.model';
import { ApiResponse, PaginatedResponse } from '@shared/models/api-response.model';
import { DOCTOR_ENDPOINTS } from '@core/constants/api.constants';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  constructor(private httpService: HttpService) {}

  
  getAll(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Doctor>> {
    return this.httpService.getList<Doctor>(
      DOCTOR_ENDPOINTS.GET_ALL,
      page,
      limit
    );
  }

  
  getById(id: string): Observable<ApiResponse<Doctor>> {
    return this.httpService.get<Doctor>(
      DOCTOR_ENDPOINTS.GET_BY_ID(id)
    );
  }

 
  getByDepartment(departmentId: string): Observable<PaginatedResponse<Doctor>> {
    return this.httpService.getList<Doctor>(
      DOCTOR_ENDPOINTS.GET_BY_DEPARTMENT(departmentId)
    );
  }


  create(doctor: CreateDoctorRequest): Observable<ApiResponse<Doctor>> {
    return this.httpService.post<Doctor>(
      DOCTOR_ENDPOINTS.CREATE,
      doctor
    );
  }

 
  update(id: string, doctor: CreateDoctorRequest): Observable<ApiResponse<Doctor>> {
    return this.httpService.put<Doctor>(
      DOCTOR_ENDPOINTS.UPDATE(id),
      doctor
    );
  }

  
  patch(id: string, doctor: Partial<CreateDoctorRequest>): Observable<ApiResponse<Doctor>> {
    return this.httpService.patch<Doctor>(
      DOCTOR_ENDPOINTS.UPDATE(id),
      doctor
    );
  }

 
  delete(id: string): Observable<ApiResponse<void>> {
    return this.httpService.delete<void>(
      DOCTOR_ENDPOINTS.DELETE(id)
    );
  }
}