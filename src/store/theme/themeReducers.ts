import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  theme: string;
}

const isServer = typeof window === "undefined";
const defaultTheme = isServer
  ? "light"
  : window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

const initialState: ThemeState = {
  theme: defaultTheme,
};

const themeReducers = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload;
    },
  },
});
export const { toggleTheme, setTheme } = themeReducers.actions;
export default themeReducers.reducer;
