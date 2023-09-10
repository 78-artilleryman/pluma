import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
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

    // 회원가입 관련 리듀서
    registerRequest: (state, action: PayloadAction<{ username: string; password: string }>) => {
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
  },
});

export default authReducer.reducer;
