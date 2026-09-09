import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Patient, CreatePatientRequest } from '@shared/models/patient.model';
import { ApiResponse, PaginatedResponse } from '@shared/models/api-response.model';
import { PATIENT_ENDPOINTS } from '@core/constants/api.constants';


@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private httpService: HttpService) {}

 
  getAll(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Patient>> {
    return this.httpService.getList<Patient>(
      PATIENT_ENDPOINTS.GET_ALL,
      page,
      limit
    );
  }

 
  getById(id: string): Observable<ApiResponse<Patient>> {
    return this.httpService.get<Patient>(
      PATIENT_ENDPOINTS.GET_BY_ID(id)
    );
  }

 
  create(patient: CreatePatientRequest): Observable<ApiResponse<Patient>> {
    return this.httpService.post<Patient>(
      PATIENT_ENDPOINTS.CREATE,
      patient
    );
  }

  
  update(id: string, patient: CreatePatientRequest): Observable<ApiResponse<Patient>> {
    return this.httpService.put<Patient>(
      PATIENT_ENDPOINTS.UPDATE(id),
      patient
    );
  }

  
  patch(id: string, patient: Partial<CreatePatientRequest>): Observable<ApiResponse<Patient>> {
    return this.httpService.patch<Patient>(
      PATIENT_ENDPOINTS.UPDATE(id),
      patient
    );
  }

  
  delete(id: string): Observable<ApiResponse<void>> {
    return this.httpService.delete<void>(
      PATIENT_ENDPOINTS.DELETE(id)
    );
  }
}