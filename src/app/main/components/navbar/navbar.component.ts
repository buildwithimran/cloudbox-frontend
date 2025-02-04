import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isDropdownOpen = false;
  isMobileMenuOpen = false;
  userName: string = 'John Doe';

  constructor(
    private router: Router,
    private storageService: StorageService,
  ) { }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    localStorage.removeItem(this.storageService.authTokenKey);
    this.router.navigate(['/authentication']);
  }

  ngOnInit(): void {
    let user = JSON.parse(this.storageService.getItem("user") ?? '{}');
    this.userName = user.name;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
