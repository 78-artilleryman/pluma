// configureStore.ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer, // 루트 리듀서 설정
  middleware: [sagaMiddleware],
  devTools: true, // 개발 환경에서만 활성화
});

sagaMiddleware.run(rootSaga); // 루트 사가 실행

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
