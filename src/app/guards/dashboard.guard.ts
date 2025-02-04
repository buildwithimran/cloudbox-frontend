import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.storageService.isAuthenticated()) {
      return true; // Allow access to dashboard if authenticated
    } else {
      this.router.navigate(['/authentication']);  // Redirect to login if not authenticated
      return false;
    }
  }
}
