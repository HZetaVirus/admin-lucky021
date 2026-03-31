import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = await auth.checkSession();
  if (!user) {
    router.navigate(['/login']);
    return false;
  }
  if (user.prefs?.role !== 'admin') {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = await auth.checkSession();
  if (user) {
    router.navigate(['/admin']);
    return false;
  }
  return true;
};
