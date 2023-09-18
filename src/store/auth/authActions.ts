import { createAction } from "@reduxjs/toolkit";

// 로그인 액션
export const loginRequest = createAction<{ username: string; password: string }>(
  "auth/loginRequest"
);
export const loginSuccess = createAction<string>("auth/loginSuccess");
export const loginFailure = createAction<string>("auth/loginFailure");

// 로그인 액션
export const logoutRequest = createAction("auth/logoutRequest");
export const logoutSuccess = createAction<string>("auth/logoutSuccess");
export const logoutFailure = createAction<string>("auth/logoutFailure");

// 회원가입 액션
export const registerRequest = createAction<{ username: string; password: string; name: string }>(
  "auth/registerRequest"
);
export const registerSuccess = createAction<string>("auth/registerSuccess");
export const registerFailure = createAction<string>("auth/registerFailure");
