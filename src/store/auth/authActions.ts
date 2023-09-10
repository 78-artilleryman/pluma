import { createAction } from "@reduxjs/toolkit";

// 로그인 액션
export const loginRequest = createAction<{ username: string; password: string }>(
  "auth/loginRequest"
);
export const loginSuccess = createAction<string>("auth/loginSuccess");
export const loginFailure = createAction<string>("auth/loginFailure");

// 회원가입 액션
export const registerRequest = createAction<{ username: string; password: string }>(
  "auth/registerRequest"
);
export const registerSuccess = createAction<string>("auth/registerSuccess");
export const registerFailure = createAction<string>("auth/registerFailure");
