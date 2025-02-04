import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (!this.storageService.isAuthenticated()) {
      return true; // Allow access to login page if not authenticated
    } else {
      this.router.navigate(['/']);  // Redirect to dashboard if already authenticated
      return false;
    }
  }
}
