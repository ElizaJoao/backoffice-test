import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Get token directly from localStorage to avoid circular dependency
  const token = localStorage.getItem('token');

  // Clone request and add authorization header if token exists
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      // Handle authentication errors
      if (error.status === 401) {
        // Token expired or invalid, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
