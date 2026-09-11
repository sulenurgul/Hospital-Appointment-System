import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(
    url: string,
    options?: {
      headers?: HttpHeaders;
      params?: HttpParams;
      withCredentials?: boolean;
    },
  ): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(url, {
      ...options,
      responseType: 'json',
    });
  }

  getList<T>(url: string, page?: number, limit?: number): Observable<PaginatedResponse<T>> {
    let params = new HttpParams();
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get<PaginatedResponse<T>>(url, {
      params,
      responseType: 'json',
    });
  }

  post<T>(url: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(url, body, {
      responseType: 'json',
    });
  }

  put<T>(url: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(url, body, {
      responseType: 'json',
    });
  }

  patch<T>(url: string, body: unknown): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(url, body, {
      responseType: 'json',
    });
  }

  delete<T>(url: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(url, {
      responseType: 'json',
    });
  }
}
