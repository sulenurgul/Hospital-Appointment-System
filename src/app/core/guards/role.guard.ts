import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';


export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  
  const requiredRoles = route.data['roles'] as string[];

  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  
  if (authService.hasRole(requiredRoles)) {
    return true; // ✅ Erişime izin ver
  }


  console.warn(`Yetkisiz erişim: Kullanıcı ${authService.currentUser()?.role} rolü ile ${state.url} sayfasına erişmeye çalıştı`);
  router.navigate(['/unauthorized']);
  return false;
};