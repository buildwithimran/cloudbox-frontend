import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  private static setHeaders(): HttpHeaders {
    const headersConfig = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return new HttpHeaders(headersConfig);
  }

  post<T>(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post<T>(`${environment.baseurl}${path}`, JSON.stringify(body), {
        headers: ApiService.setHeaders()
      })
      .pipe(catchError(ApiService.formatErrors));
  }

  get<T>(path: string, httpParams: HttpParams = new HttpParams()): Observable<T> {
    return this.http
      .get<T>(`${environment.baseurl}${path}`, {
        headers: ApiService.setHeaders(),
        params: httpParams
      })
      .pipe(catchError(ApiService.formatErrors));
  }

  put<T>(path: string, body: Object = {}): Observable<T> {
    return this.http
      .put<T>(`${environment.baseurl}${path}`, JSON.stringify(body), {
        headers: ApiService.setHeaders()
      })
      .pipe(catchError(ApiService.formatErrors));
  }

  patch<T>(path: string, body: Object = {}): Observable<T> {
    return this.http
      .patch<T>(`${environment.baseurl}${path}`, JSON.stringify(body), {
        headers: ApiService.setHeaders()
      })
      .pipe(catchError(ApiService.formatErrors));
  }

  delete(path: string): Observable<any> {
    return this.http
      .delete(`${environment.baseurl}${path}`, { headers: ApiService.setHeaders() })
      .pipe(catchError(ApiService.formatErrors));
  }

  private static formatErrors(error: any) {
    return throwError(error.error);
  }

}
