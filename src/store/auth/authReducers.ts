import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTokenFromCookie } from "../../utils/tokenUtils";

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  loading: {
    login: boolean;
    logout: boolean;
    fetchUserInfo: boolean;
    register: boolean;
    emailAuthentication: boolean;
    checkEmailAuthentication: boolean;
    refreshToken: boolean;
  };
  error: {
    login: string | null;
    logout: string | null;
    fetchUserInfo: string | null;
    register: string | null;
    emailAuthentication: string | null;
    checkEmailAuthentication: string | null;
    refreshToken: string | null;
  };
  userInfo: { name: string; userId: string } | null;
  emailVerified: boolean;
}

const userFromCookie = getTokenFromCookie("user");
const initialUser = userFromCookie ? JSON.parse(userFromCookie) : null;

const initialState: AuthState = {
  isAuthenticated: !!getTokenFromCookie("refresh_token"),
  user: initialUser && initialUser.name ? initialUser.name : null,
  loading: {
    login: false,
    logout: false,
    fetchUserInfo: false,
    register: false,
    emailAuthentication: false,
    checkEmailAuthentication: false,
    refreshToken: false,
  },
  error: {
    login: null,
    logout: null,
    fetchUserInfo: null,
    register: null,
    emailAuthentication: null,
    checkEmailAuthentication: null,
    refreshToken: null,
  },
  userInfo: initialUser || null,
  emailVerified: false,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 로그인 관련 리듀서
    loginRequest: (state, action: PayloadAction<{ username: string; password: string }>) => {
      state.loading.login = true;
      state.error.login = null;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.loading.login = false;
      state.isAuthenticated = true;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading.login = false;
      state.error.login = action.payload;
    },
    // 로그아웃 관련 리듀서
    logoutRequest: (state, action: PayloadAction<string>) => {
      state.loading.logout = true;
      state.error.logout = null;
    },
    logoutSuccess: (state, action: PayloadAction<string>) => {
      state.loading.logout = false;
      state.isAuthenticated = false;
      state.user = null;
      state.userInfo = null;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.loading.logout = false;
      state.error.logout = action.payload;
    },
    // 회원 정보 로드 리듀서
    fetchUserInfoRequest: (state) => {
      state.loading.fetchUserInfo = true;
      state.error.fetchUserInfo = null;
      state.userInfo = null;
    },
    fetchUserInfoSuccess: (state, action: PayloadAction<{ name: string; userId: string }>) => {
      state.loading.fetchUserInfo = false;
      state.userInfo = action.payload;
      state.user = action.payload.name;
    },
    fetchUserInfoFailure: (state, action: PayloadAction<string>) => {
      state.loading.fetchUserInfo = false;
      state.error.fetchUserInfo = action.payload;
    },
    // 회원가입 관련 리듀서
    registerRequest: (
      state,
      action: PayloadAction<{ username: string; password: string; name: string }>
    ) => {
      state.loading.register = true;
      state.error.register = null;
    },
    registerSuccess: (state, action: PayloadAction<string>) => {
      state.loading.register = false;
      state.isAuthenticated = true;
      state.emailVerified = false;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading.register = false;
      state.error.register = action.payload;
    },
    resetEmailAuthenticationRequest: (state) => {
      state.emailVerified = false;
    },
    // 이메일 인증 코드 요청
    emailAuthenticationRequest: (state, action: PayloadAction<{ email: string }>) => {
      state.loading.emailAuthentication = true;
      state.error.emailAuthentication = null;
    },
    emailAuthenticationSuccess: (state) => {
      state.loading.emailAuthentication = false;
    },
    emailAuthenticationFailure: (state, action: PayloadAction<string>) => {
      state.loading.emailAuthentication = false;
      state.error.emailAuthentication = action.payload;
    },
    // 이메일 인증코드 확인
    checkEmailAuthenticationRequest: (
      state,
      action: PayloadAction<{ email: string; code: string }>
    ) => {
      state.loading.checkEmailAuthentication = true;
      state.error.checkEmailAuthentication = null;
    },
    checkEmailAuthenticationSuccess: (state, action: PayloadAction<boolean>) => {
      state.loading.checkEmailAuthentication = false;
      state.emailVerified = action.payload;
    },
    checkEmailAuthenticationFailure: (state, action: PayloadAction<string>) => {
      state.loading.checkEmailAuthentication = false;
      state.error.checkEmailAuthentication = action.payload;
    },
    //토큰 재발급 리듀서
    refreshTokenRequest: (state) => {
      state.loading.refreshToken = true;
      state.error.refreshToken = null;
    },
    refreshTokenSuccess: (state, action: PayloadAction<string>) => {
      state.loading.refreshToken = false;
    },
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading.refreshToken = false;
      state.error.refreshToken = action.payload;
    },
  },
});

export default authReducer.reducer;
