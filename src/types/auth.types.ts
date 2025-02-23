export interface SignupRequestBody {
  email: string;
  username: string;
  password: string;
}

export interface VerifyOtpRequestBody {
  otp: string;
  token: string;
}

export interface LoginRequestBody {
  identifier: string;
  password: string;
}
