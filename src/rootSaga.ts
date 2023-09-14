import { all } from "redux-saga/effects";
import authSaga from "./store/auth/authSagas";
import documentSaga from "./store/document/documentSagas";

function* rootSaga() {
  yield all([
    authSaga(),
    documentSaga(),
    // 다른 사가들을 추가하려면 위와 같이 추가합니다.
  ]);
}

export default rootSaga;
