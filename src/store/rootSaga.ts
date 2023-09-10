// rootSaga.ts
import { all } from "redux-saga/effects";
import authSaga from "./auth/authSaga";
// 다른 사가들을 가져오면 여기에 추가

function* rootSaga() {
  yield all([authSaga()]);
  // 다른 사가들을 추가하려면 위와 같이 yield all([...]) 형태로 추가합니다.
}

export default rootSaga;
