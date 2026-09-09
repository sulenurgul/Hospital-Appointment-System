import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Department, CreateDepartmentRequest } from '@shared/models/department.model';
import { ApiResponse, PaginatedResponse } from '@shared/models/api-response.model';
import { DEPARTMENT_ENDPOINTS } from '@core/constants/api.constants';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(private httpService: HttpService) {}

  
  getAll(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Department>> {
    return this.httpService.getList<Department>(
      DEPARTMENT_ENDPOINTS.GET_ALL,
      page,
      limit
    );
  }

 
  getById(id: string): Observable<ApiResponse<Department>> {
    return this.httpService.get<Department>(
      DEPARTMENT_ENDPOINTS.GET_BY_ID(id)
    );
  }

  
  create(department: CreateDepartmentRequest): Observable<ApiResponse<Department>> {
    return this.httpService.post<Department>(
      DEPARTMENT_ENDPOINTS.CREATE,
      department
    );
  }

  
  update(id: string, department: CreateDepartmentRequest): Observable<ApiResponse<Department>> {
    return this.httpService.put<Department>(
      DEPARTMENT_ENDPOINTS.UPDATE(id),
      department
    );
  }

  
  patch(id: string, department: Partial<CreateDepartmentRequest>): Observable<ApiResponse<Department>> {
    return this.httpService.patch<Department>(
      DEPARTMENT_ENDPOINTS.UPDATE(id),
      department
    );
  }

  
  delete(id: string): Observable<ApiResponse<void>> {
    return this.httpService.delete<void>(
      DEPARTMENT_ENDPOINTS.DELETE(id)
    );
  }
}