import { Injectable } from '@angular/core';
import { LoginUser, RegisterUser, ResetPasswordRequestPost, UpdatePasswordPost, VerificationCodePost } from '../models/registerUser.model';
import { ApiService } from 'src/app/services/api.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.baseurl; // Ensure this URL is correctly set in your environment config

  constructor(private api: ApiService, private http: HttpClient) { }

  // Register & Login
  register(formData: RegisterUser): Observable<any> {
    return this.http.post(`${this.apiUrl}users/register`, formData);
  }

  login(formData: LoginUser): Observable<any> {
    return this.http.post(`${this.apiUrl}users/login`, formData);
  }

  fetchUserById(): Observable<any> {
    return this.http.get(`${this.apiUrl}users/fetchLoggedInUser`);
  }

  // OTP Verification
  submitVerificationCode(formData: VerificationCodePost): Observable<any> {
    return this.http.post(`${this.apiUrl}users/verifyOtpCode`, formData);
  }

  // Password Reset Flow
  resetPasswordRequest(formData: ResetPasswordRequestPost): Observable<any> {
    return this.http.post(`${this.apiUrl}users/resetPasswordRequest`, formData);
  }

  verifyOtpForReset(formData: VerificationCodePost): Observable<any> {
    return this.http.post(`${this.apiUrl}users/resetPasswordVerifyOtp`, formData);
  }

  updatePassword(formData: UpdatePasswordPost): Observable<any> {
    return this.http.post(`${this.apiUrl}users/updatePassword`, formData);
  }
}
