import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { catchError, Observable, switchAll } from 'rxjs';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable()
export class CookiesInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token')?.toString();
    console.log(token);
    if (token) {
      req = req.clone({
        headers: req.headers.set('token', token)
      });
      return next.handle(req).pipe(
        catchError(this.handlerError)
      );
    }

    return next.handle(req).pipe(
      catchError(this.handlerError)
      );
  }
 
  handlerError(error:HttpErrorResponse) {
    
    switch (error.status) {
      case 401:
        console.log('error 401');
        break;
      case 403:
        console.log('error 403');
        break;
      case 404:
        console.log('error 404');
        break;
      case 452:
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href>Why do I have this issue?</a>'
        })
        alert('Usuario o contraseña incorrectos');
        break;
      case 500:
        console.log('error 500');
        break;
      default:
        console.log('error default');
        break;
    }
    return throwError(error);
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: CookiesInterceptor,
  multi: true
}