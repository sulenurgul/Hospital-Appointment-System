import { Injectable } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MESSAGES } from '../constants/app.constants';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage: string = MESSAGES.ERROR.SERVER_ERROR;

      console.error('HTTP Hatası:', error);

      
      switch (error.status) {
        case 0:
      
          errorMessage = MESSAGES.ERROR.NETWORK_ERROR;
          break;

        case 400:
         
          errorMessage = error.error?.message || MESSAGES.ERROR.VALIDATION_ERROR;
          break;

        case 401:
         
          errorMessage = MESSAGES.ERROR.UNAUTHORIZED;
          authService.logout();
          router.navigate(['/auth/login']);
          break;

        case 403:
         
          errorMessage = MESSAGES.ERROR.FORBIDDEN;
          break;

        case 404:
         
          errorMessage = error.error?.message || MESSAGES.ERROR.NOT_FOUND;
          break;

        case 500:
        case 502:
        case 503:
        case 504:
         
          errorMessage = MESSAGES.ERROR.SERVER_ERROR;
          break;

        default:
          errorMessage = error.error?.message || MESSAGES.ERROR.SERVER_ERROR;
      }

    
      console.error(`[${error.status}] ${errorMessage}`);

      
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error
      }));
    })
  );
};