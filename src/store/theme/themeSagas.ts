// store/theme/themeSagas.ts
import { takeLatest, put, call, select } from "redux-saga/effects";
import { toggleTheme, setTheme } from "./themeReducers";
import { getTheme } from "./themeSelectors";
import { PayloadAction } from "@reduxjs/toolkit";

function setThemeInLocalStorage(theme: string) {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}

function* handleToggleTheme() {
  const currentTheme: ReturnType<typeof getTheme> = yield select(getTheme);
  const newTheme = currentTheme === "light" ? "dark" : "light";
  yield call(setThemeInLocalStorage, newTheme);
}

function* handleSetTheme(action: PayloadAction<string>) {
  const newTheme = action.payload;
  yield call(setThemeInLocalStorage, newTheme);
  // 액션 디스패치는 여기서 필요하지 않을 수 있습니다.
}

export function* themeSagas() {
  yield takeLatest(toggleTheme.type, handleToggleTheme);
  yield takeLatest(setTheme.type, handleSetTheme);
}
