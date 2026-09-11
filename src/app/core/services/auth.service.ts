import { Injectable, signal, computed } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { User, LoginRequest, LoginResponse } from '@shared/models/user.model';
import { AUTH_ENDPOINTS } from '@core/constants/api.constants';
import { STORAGE_KEYS } from '@core/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  userRole = computed(() => this.currentUserSignal()?.role ?? null);
  currentUser = this.currentUserSignal;

  constructor(
    private httpService: HttpService,
    private router: Router,
  ) {
    this.loadTokenFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.httpService.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials).pipe(
      map((response) => {
        if (!response.data) {
          throw new Error(response.message);
        }

        return response.data;
      }),
      tap((response) => {
        this.tokenSignal.set(response.token);
        this.currentUserSignal.set(response.user);

        localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        localStorage.setItem(STORAGE_KEYS.ROLE, response.user.role);
      }),
    );
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);

    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);

    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  hasRole(roles: string | string[]): boolean {
    const userRole = this.userRole();
    if (!userRole) return false;

    if (typeof roles === 'string') {
      return userRole === roles;
    }
    return roles.includes(userRole);
  }

  private loadTokenFromStorage(): void {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);

    if (token && userJson) {
      try {
        this.tokenSignal.set(token);
        this.currentUserSignal.set(JSON.parse(userJson));
      } catch (error) {
        console.error('localStorage verisi bozuk', error);
        this.logout();
      }
    }
  }

  getCurrentUser(): Observable<User> {
    return this.httpService.get<User>(AUTH_ENDPOINTS.ME).pipe(
      map((response) => {
        if (!response.data) {
          throw new Error(response.message);
        }

        return response.data;
      }),
    );
  }
}
