export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface VerificationCodePost {
  email: string;
  verificationCode: string;
}

export interface ResetPasswordRequestPost {
  email: string;
}

export interface UpdatePasswordPost {
  email: string;
  password: string;
}
