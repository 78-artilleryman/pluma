// authSaga.js
import { put, takeLatest, call } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";

import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutSuccess,
  logoutFailure,
  logoutRequest,
} from "./authActions";

// 로그인 사가
function* login(action: any) {
  try {
    console.log(action.payload);
    const { username, password } = action.payload;

    // Axios를 사용하여 실제 API 호출
    const response: AxiosResponse<any> = yield call(() =>
      axios.post(
        "/users/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
    );
    if (response.status === 200) {
      // 응답 데이터에서 access_token 추출
      const access_token = response.data?.access_token;
      const refresh_token = response.data?.refresh_token;
      localStorage.setItem("user", username);
      if (access_token) {
        // access_token을 로컬 스토리지에 저장
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // 로그인 성공 액션 디스패치
        yield put(loginSuccess(username));
      } else {
        yield put(loginFailure("로그인에 실패했습니다."));
      }
    } else {
      yield put(loginFailure("로그인에 실패했습니다."));
    }
  } catch (error) {
    yield put(loginFailure("로그인에 실패했습니다."));
  }
}

// 회원가입 사가 - 유사한 방식으로 작성
function* logout(action: any) {
  try {
    yield put(logoutSuccess("로그아웃 성공"));
  } catch (error) {
    yield put(logoutFailure("로그아웃 실패했습니다."));
  }
}

// 회원가입 사가 - 유사한 방식으로 작성
function* register(action: any) {
  try {
    console.log(action.payload);
    const { username, password, name } = action.payload;

    // Axios를 사용하여 실제 API 호출
    const response: AxiosResponse<any> = yield call(
      () => axios.post("/users/join", { username, password, name }) // 회원가입 엔드포인트 URL
    );

    if (response.status === 200) {
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
  yield takeLatest(logoutRequest.type, logout);
  yield takeLatest(registerRequest.type, register);
}

export default authSaga;
