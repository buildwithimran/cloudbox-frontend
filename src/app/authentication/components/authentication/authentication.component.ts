import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from 'src/app/services/utils.service';
import { USER_OTP_TYPES } from '../../models/otp-types.enums';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})

export class AuthenticationComponent implements OnInit {

  authForm!: FormGroup;
  isDisable: boolean = false;
  isLoginMode: boolean = false;
  showPassword: boolean = false;
  verificationCode: string = "";
  resetPasswordRequestForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  otpTypes: USER_OTP_TYPES = USER_OTP_TYPES.USER_VERIFIED;

  @ViewChild('otpPopup') otpPopup!: TemplateRef<any>;
  @ViewChild('resetPasswordRequestPopup') resetPasswordRequestPopup: any;
  @ViewChild('resetPasswordPopup') resetPasswordPopup: any;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private toastr: ToastrService,
    private router: Router,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.resetPasswordRequestForm = this.fb.group({
      email: ['', Validators.required],
    });

    this.resetPasswordForm = this.fb.group({
      email: [{ value: this.resetPasswordRequestForm.value.email, disabled: true }, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.authForm = this.fb.group({
      name: ['', this.isLoginMode ? [] : [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      return;
    }
    this.isDisable = true;
    const formData = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.login(formData).subscribe(
        (response) => {
          if (!response.verified) {
            // Open verificationCode modal
            this.otpTypes = USER_OTP_TYPES.USER_VERIFIED;
            this.utilsService.openMDModal(this.otpPopup);
          } else {
            // User is verified
            // Set jwt token in LocalStorage
            this.storageService.setAuthToken(response.token);

            // Set jwt token in LocalStorage
            this.storageService.setItem('user', JSON.stringify(response.user));

            // Navigate into home page
            this.router.navigate(['/']);
            this.isDisable = false;
          }
        },
        (error: any) => {
          this.isDisable = false;
          console.error('Login error:', error);
          this.toastr.error(error?.error?.message || 'Login failed');
        }
      );
    } else {
      this.authService.register(formData).subscribe(
        (response) => {
          if (!response.verified) {
            this.otpTypes = USER_OTP_TYPES.USER_VERIFIED;
            this.utilsService.openMDModal(this.otpPopup);
          }
          this.isDisable = false;
        },
        (error: any) => {
          this.isDisable = false;
          console.log('Registration error:', error);
          // Show generic message if error.message is undefined
          this.toastr.error(error?.error?.message || 'Registration failed');
        }
      );
    }
  }

  // On Change OTP
  onOtpChange(value: string): void {
    this.verificationCode = value;
    if (this.verificationCode.length === 6) {
      setTimeout(() => {
        console.log('this.otpTypes', this.otpTypes);

        if (this.otpTypes === "FOR_RESET_PASSWORD") {
          this.resetPasswordForm.patchValue({ email: this.resetPasswordRequestForm.value.email });
          this.verifyOtpForReset();
          console.log('1');
        } else {
          console.log('2');
          this.submitVerificationCode();
        }
      }, 1000);
    }
  }

  // Submit verificationCode For Login || Register User
  submitVerificationCode(): void {
    setTimeout(() => {
      this.authService.submitVerificationCode({ email: this.authForm.value.email, verificationCode: this.verificationCode }).subscribe(
        (response) => {
          if (response.success) {
            this.storageService.setAuthToken(response.token);
            this.storageService.setItem('user', JSON.stringify(response.user));
            this.utilsService.closeAllModals();
            this.utilsService.message("Success", 'success', 2000);
            this.router.navigate(['/']);
          }
        },
        (error: any) => {
          console.error('Login error:', error);
          this.toastr.error(error?.error?.message || 'Login failed');
        }
      );
    }, 1000);
  }

  // Request Otp For Reset Password
  resetPasswordRequestSubmit() {
    if (this.resetPasswordRequestForm.invalid) {
      return;
    }
    this.isDisable = true;
    const formData = this.resetPasswordRequestForm.value;

    this.authService.resetPasswordRequest(formData).subscribe(
      (response) => {
        this.utilsService.closeAllModals();
        this.otpTypes = USER_OTP_TYPES.RESET_PASSWORD;
        this.utilsService.openMDModal(this.otpPopup);
        this.isDisable = false;
      },
      (error: any) => {
        this.isDisable = false;
        this.utilsService.message(error?.error?.message, 'error', 5000);
        console.log('Reset password request error:', error);
      }
    );
  }

  // Verify Otp Of Reset Password
  verifyOtpForReset(): void {
    setTimeout(() => {
      this.authService.verifyOtpForReset({ email: this.resetPasswordRequestForm.value.email, verificationCode: this.verificationCode }).subscribe(
        (response) => {
          if (response.success) {
            this.utilsService.closeAllModals();
            this.utilsService.openMDModal(this.resetPasswordPopup);
          }
        },
        (error: any) => {
          console.error('Login error:', error);
          this.toastr.error(error?.error?.message || 'Login failed');
        }
      );
    }, 1000);
  }

  // Update Password
  updatePassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.isDisable = true;
    this.authService.updatePassword(
      {
        email: this.resetPasswordRequestForm.value.email,
        password: this.resetPasswordForm.value.password
      }).subscribe(
        (response) => {
          this.utilsService.closeAllModals();
          this.utilsService.message('Password Updated', 'success', 5000);
          this.resetPasswordRequestForm.reset();
          this.resetPasswordForm.reset();
          this.isDisable = false;
        },
        (error: any) => {
          this.isDisable = false;
          this.utilsService.message(error?.error?.message, 'error', 5000);
          console.log('Reset password request error:', error);
        }
      );

  }


  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.initForm();
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Close the verificationCode modal
  dismissModal() {
    this.utilsService.closeAllModals();
  }

  // Reset Password
  openResetPasswordModal() {
    this.utilsService.openMDModal(this.resetPasswordRequestPopup);
  }

}
