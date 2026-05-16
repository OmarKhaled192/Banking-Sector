import {
  HttpInterceptorFn,
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  catchError,
  finalize,
  throwError,
} from 'rxjs';

import { LoadingService } from '../services/loading.service';

export const httpInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  const loading = inject(LoadingService);

  loading.start();

  return next(req).pipe(
    catchError(error => {
      const normalizedError = {
        status: error.status,
        message:
          error?.error?.message ||
          error.message ||
          'Unexpected error occurred',
      };
      return throwError(() => normalizedError);
    }),

    finalize(() => {
      loading.stop();
    })
  );
};
