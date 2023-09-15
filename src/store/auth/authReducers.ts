import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTokenFromCookie } from "src/utils/tokenUtils";

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  loading: boolean;
  error: string | null;
  userInfo: { userName: string; userId: string } | null;
  refreshingToken: boolean;
}

const userFromCookie = getTokenFromCookie("user");
const initialUser = userFromCookie ? JSON.parse(userFromCookie) : null;

const initialState: AuthState = {
  isAuthenticated: !!getTokenFromCookie("refresh_token"),
  user: initialUser && initialUser.userName ? initialUser.userName : null,
  loading: false,
  error: null,
  userInfo: initialUser || null,
  refreshingToken: false,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 로그인 관련 리듀서
    loginRequest: (state, action: PayloadAction<{ username: string; password: string }>) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 로그인 관련 리듀서
    logoutRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 회원 정보 로드 리듀서
    fetchUserInfoRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserInfoSuccess: (state, action: PayloadAction<{ userName: string; userId: string }>) => {
      state.loading = false;
      state.userInfo = action.payload;
    },
    fetchUserInfoFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // 회원가입 관련 리듀서
    registerRequest: (
      state,
      action: PayloadAction<{ username: string; password: string; name: string }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    //토큰 재발급 리듀서
    refreshTokenRequest: (state) => {
      state.refreshingToken = true;
    },
    refreshTokenSuccess: (state) => {
      state.refreshingToken = false;
    },
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.refreshingToken = false;
      state.error = action.payload;
    },
  },
});

export default authReducer.reducer;
