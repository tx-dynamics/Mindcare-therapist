export const BASE_URL = 'https://mindcare.txdynamics.io/api/v1/';
export const SOCKETS_URL = BASE_URL.replace('https://', 'wss://').replace('/api/v1/', '');

export const api = {
  signIn: 'auth/signin',
  refreshToken: 'auth/refresh-token',
  forgotPassword: 'auth/forgot-password',
  verifyOtpForgotPassword: 'auth/verify-otp-forgot-password',
  resetPassword: 'auth/reset-password',
  updatePassword: 'auth/update-password',
  workouts: 'workouts',
  s3Upload: 's3/upload',
}
