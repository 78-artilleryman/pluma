import { put, takeLatest, call } from "redux-saga/effects";
// import axios, { AxiosResponse } from "axios";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
} from "./authActions";

// 로그인 사가
function* login(action: any) {
  try {
    const { username, password } = action.payload;

    // type ResponseType = AxiosResponse<any>;

    // const response: ResponseType = yield call(() =>
    //   axios.post("/api/login", { username, password })
    // );

    // 시뮬레이션을 위한 더미 데이터 생성
    const fakeResponse = { status: 200 };

    if (fakeResponse.status === 200) {
      yield put(loginSuccess(username));
    } else {
      yield put(loginFailure("로그인에 실패했습니다."));
    }
  } catch (error) {
    yield put(loginFailure("로그인에 실패했습니다."));
  }
}

// 회원가입 사가 - 유사한 방식으로 작성
function* register(action: any) {
  try {
    const { username, password } = action.payload;

    // type ResponseType = AxiosResponse<any>;

    // const response: ResponseType = yield call(() =>
    //   axios.post("/api/register", { username, password })
    // );
    const fakeResponse = { status: 200 };

    if (fakeResponse.status === 200) {
      yield put(registerSuccess(username));
    } else {
      yield put(registerFailure("회원가입에 실패했습니다."));
    }
  } catch (error) {
    yield put(registerFailure("회원가입에 실패했습니다."));
  }
}

function* authSaga() {
  yield takeLatest(loginRequest.type, login);
  yield takeLatest(registerRequest.type, register);
}

export default authSaga;
