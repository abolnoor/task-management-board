import { HttpInterceptorFn } from '@angular/common/http';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  // Add x-api-key header to all outgoing requests
  const modifiedReq = req.clone({
    setHeaders: {
      'x-api-key': 'task-board-api-key-2025' // Hardcoded API key for demo
    }
  });

  console.log('API Key Interceptor: Added x-api-key header');
  return next(modifiedReq);
};
