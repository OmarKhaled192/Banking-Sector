import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';

import { inject } from '@angular/core';

import { catchError, finalize, throwError } from 'rxjs';


import { LoadingService } from '../services/loading.service';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (
  request,
  next
) => {
  const loadingService = inject(LoadingService);

  const messageService = inject(MessageService);

  loadingService.start();

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage =
        'Something went wrong. Please try again.';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      switch (error.status) {
        case 400:
          errorMessage = 'Bad request';
          break;

        case 401:
          errorMessage =
            'Unauthorized access';
          break;

        case 403:
          errorMessage =
            'Access denied';
          break;

        case 404:
          errorMessage =
            'Resource not found';
          break;

        case 500:
          errorMessage =
            'Internal server error';
          break;
      }

      messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
      });

      return throwError(() => error);
    }),

    finalize(() => {
      loadingService.stop();
    })
  );
};
