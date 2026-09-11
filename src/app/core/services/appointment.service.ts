import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Appointment, CreateAppointmentRequest } from '@shared/models/appointment.model';
import { ApiResponse, PaginatedResponse } from '@shared/models/api-response.model';
import { APPOINTMENT_ENDPOINTS } from '@core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private httpService: HttpService) {}

  getAll(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Appointment>> {
    return this.httpService.getList<Appointment>(APPOINTMENT_ENDPOINTS.GET_ALL, page, limit);
  }

  getById(id: string): Observable<ApiResponse<Appointment>> {
    return this.httpService.get<Appointment>(APPOINTMENT_ENDPOINTS.GET_BY_ID(id));
  }

  getByPatient(patientId: string): Observable<PaginatedResponse<Appointment>> {
    return this.httpService.getList<Appointment>(APPOINTMENT_ENDPOINTS.GET_BY_PATIENT(patientId));
  }

  getByDoctor(doctorId: string): Observable<PaginatedResponse<Appointment>> {
    return this.httpService.getList<Appointment>(APPOINTMENT_ENDPOINTS.GET_BY_DOCTOR(doctorId));
  }

  create(appointment: CreateAppointmentRequest): Observable<ApiResponse<Appointment>> {
    return this.httpService.post<Appointment>(APPOINTMENT_ENDPOINTS.CREATE, appointment);
  }

  update(id: string, appointment: CreateAppointmentRequest): Observable<ApiResponse<Appointment>> {
    return this.httpService.put<Appointment>(APPOINTMENT_ENDPOINTS.UPDATE(id), appointment);
  }

  patch(
    id: string,
    appointment: Partial<CreateAppointmentRequest>,
  ): Observable<ApiResponse<Appointment>> {
    return this.httpService.patch<Appointment>(APPOINTMENT_ENDPOINTS.UPDATE(id), appointment);
  }

  updateStatus(id: string, status: Appointment['status']): Observable<ApiResponse<Appointment>> {
    return this.httpService.patch<Appointment>(APPOINTMENT_ENDPOINTS.UPDATE(id), { status });
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.httpService.delete<void>(APPOINTMENT_ENDPOINTS.DELETE(id));
  }
}
