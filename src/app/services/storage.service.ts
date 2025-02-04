import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public authTokenKey: string = "auth_token";

  constructor() {}

  // Simulate checking user authentication (replace with actual logic)
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');  // Replace with actual logic, like checking a JWT token
  }

  // Simulate login logic (replace with actual API call)
  login(token: string) {
    localStorage.setItem('auth_token', token);
  }

  // Simulate logout logic (replace with actual API call)
  logout() {
    localStorage.removeItem('auth_token');
  }

  setAuthToken(token: string) {
    localStorage.setItem(this.authTokenKey, token);
  }

  getItem(key: string) {
    return localStorage.getItem(key);
  }

  clear() {
    localStorage.clear();
  }

  removeByKey(key: string) {
    localStorage.removeItem(key);
  }

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }


}
