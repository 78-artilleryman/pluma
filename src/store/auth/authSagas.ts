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

import {
  setTokenToCookie, // 쿠키에 토큰 저장 함수 가져오기
  clearTokenFromCookie, // 쿠키에서 토큰 삭제 함수 가져오기
} from "../../utils/tokenUtils"; // tokenUtil 파일에서 가져옴

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

      // access_token과 refresh_token을 쿠키에 저장
      setTokenToCookie("access_token", access_token);
      setTokenToCookie("refresh_token", refresh_token);
      setTokenToCookie("user", username);

      // 로그인 성공 액션 디스패치
      yield put(loginSuccess(username));
    } else {
      yield put(loginFailure("로그인에 실패했습니다."));
    }
  } catch (error) {
    yield put(loginFailure("로그인에 실패했습니다."));
  }
}

// 로그아웃 사가
function* logout(action: any) {
  try {
    // 쿠키에서 토큰 삭제
    clearTokenFromCookie("access_token");
    clearTokenFromCookie("refresh_token");
    clearTokenFromCookie("user");

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
