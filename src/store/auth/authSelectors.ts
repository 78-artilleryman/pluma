// authSelectors.ts
import { RootState } from "../../configureStore";

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUser = (state: RootState) => state.auth.user;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUserInfo = (state: RootState) => state.auth.userInfo;
export const selectEmailVerified = (state: RootState) => state.auth.emailVerified;
