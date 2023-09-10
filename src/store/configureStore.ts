// configureStore.ts
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer"; // 루트 리듀서 가져오기
import rootSaga from "./rootSaga"; // 루트 사가 가져오기

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer, // 루트 리듀서 설정
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(rootSaga); // 루트 사가 실행

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
