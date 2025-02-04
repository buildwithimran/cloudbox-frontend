import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private storageService: StorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let token = this.storageService.getItem('auth_token');;

    // Add Authorization header if token is available
    if (token) {
      req = this.addTokenHeader(req, token);
    }

    // Handle the request and catch any errors
    return next.handle(req).pipe(
      catchError(error => {
        const token = this.storageService.getItem('auth_token');
        if (!token) {
          // localStorage.clear();
          // location.href = '/';  // Redirect to login or home if token is invalid
        }
        return throwError(error); // Propagate the error
      })
    );
  }

  // Helper method to add the Authorization header
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token)
    });
  }
}
