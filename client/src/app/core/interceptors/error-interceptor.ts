import { HttpInterceptorFn, type HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router, type NavigationExtras } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBarService = inject(SnackbarService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err) {
        switch (err.status) {
          case 400:
            if (err.error.errors) {
              const validate: string[] = [];
              for (const key in err.error.errors) {
                if (err.error.errors[key]) validate.push(err.error.errors[key]);
              }
              return throwError(() => validate.flat());
            } else {
              snackBarService.error(err.error);
            }
            break;
          case 401:
            snackBarService.error(err.error.title);
            break;
          case 403:
            snackBarService.error("Forbidden")
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            const navigationExtra: NavigationExtras = {
              state: {error: err.error}
            }
            router.navigate(['/server-error'],navigationExtra);
            break;
        }
      }
      return throwError(() => err);
    })
  );
};
