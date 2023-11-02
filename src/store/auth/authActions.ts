import { createAction } from "@reduxjs/toolkit";

// 로그인 액션
export const loginRequest = createAction<{ username: string; password: string }>(
  "auth/loginRequest"
);
export const loginSuccess = createAction<{ userName: string; userId: string }>("auth/loginSuccess");
export const loginFailure = createAction<string>("auth/loginFailure");

// 로그인 액션
export const logoutRequest = createAction("auth/logoutRequest");
export const logoutSuccess = createAction<string>("auth/logoutSuccess");
export const logoutFailure = createAction<string>("auth/logoutFailure");

//사용자 정보 요청
export const fetchUserInfoRequest = createAction("auth/fetchUserInfoRequest");
export const fetchUserInfoSuccess = createAction<{ name: string; userId: string }>(
  "auth/fetchUserInfoSuccess"
);
export const fetchUserInfoFailure = createAction<string>("auth/fetchUserInfoFailure");

// 회원가입 액션
export const registerRequest = createAction<{ username: string; password: string; name: string }>(
  "auth/registerRequest"
);
export const registerSuccess = createAction<string>("auth/registerSuccess");
export const registerFailure = createAction<string>("auth/registerFailure");

//토큰 검사
export const checkTokenExpirationRequest = createAction("auth/checkTokenExpirationRequest");
export const checkTokenExpirationSuccess = createAction("auth/checkTokenExpirationSuccess");
export const checkTokenExpirationFailure = createAction<string>("auth/checkTokenExpirationFailure");

// 토큰 재발급 관련 액션
export const refreshTokenRequest = createAction("auth/refreshTokenRequest");
export const refreshTokenSuccess = createAction("auth/refreshTokenSuccess");
export const refreshTokenFailure = createAction<string>("auth/refreshTokenFailure");

//이메일 인증 관련 액션
export const resetEmailAuthenticationRequest = createAction("auth/resetEmailAuthenticationRequest");

export const emailAuthenticationRequest = createAction<{ email: string }>(
  "auth/emailAuthenticationRequest"
);
export const emailAuthenticationSuccess = createAction("auth/emailAuthenticationSuccess");
export const emailAuthenticationFailure = createAction<string>("auth/emailAuthenticationFailure");

//이메일 인증 코드 확인 관련 액션
export const checkEmailAuthenticationRequest = createAction<{ email: string; code: string }>(
  "auth/checkEmailAuthenticationRequest"
);
export const checkEmailAuthenticationSuccess = createAction("auth/checkEmailAuthenticationSuccess");
export const checkEmailAuthenticationFailure = createAction<string>(
  "auth/checkEmailAuthenticationFailure"
);
