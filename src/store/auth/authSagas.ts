import { put, takeLatest, call, getContext } from "redux-saga/effects";
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
  checkTokenExpirationSuccess,
  checkTokenExpirationFailure,
  checkTokenExpirationRequest,
  fetchUserInfoRequest,
  fetchUserInfoSuccess,
  fetchUserInfoFailure,
  refreshTokenSuccess,
  refreshTokenFailure,
  refreshTokenRequest,
} from "./authActions";
import { Dispatch } from "redux"; // Dispatch 가져오기

import {
  setTokenToCookie, // 쿠키에 토큰 저장 함수 가져오기
  clearTokenFromCookie,
  checkTokenExpiration,
  getTokenFromCookie, // 쿠키에서 토큰 삭제 함수 가져오기
} from "../../utils/tokenUtils"; // tokenUtil 파일에서 가져옴
import { Navigate } from "react-router-dom";

// 사용자 정보를 가져오는 사가
function* fetchUserInfo() {
  try {
    // 서버에 사용자 정보를 요청
    const response: AxiosResponse<any> = yield call(() =>
      axios.get("/users/info", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getTokenFromCookie("access_token")}`,
        },
      })
    );

    if (response.status === 200) {
      // 응답 데이터에서 사용자 정보 추출
      const userInfo = response.data;
      setTokenToCookie("user", JSON.stringify(response.data));
      yield put(fetchUserInfoSuccess(userInfo));
      yield put(loginSuccess(userInfo.userName));
    } else {
      yield put(fetchUserInfoFailure("사용자 정보를 가져오는데 실패했습니다."));
    }
  } catch (error) {
    yield put(fetchUserInfoFailure("사용자 정보를 가져오는데 실패했습니다."));
  }
}

// 토큰 만료 검사 사가
export function* checkTokenExpirationSaga() {
  try {
    // 먼저 dispatch 함수를 가져옴
    const dispatch: Dispatch = yield getContext("dispatch");

    // dispatch 함수를 이용하여 액션을 디스패치하고 결과를 반환
    const tokenExpired: boolean = yield call(checkTokenExpiration, dispatch);
    if (tokenExpired) {
      // 토큰이 만료되었다면 로그아웃을 실행
      yield put(logoutRequest());
    } else {
      yield put(checkTokenExpirationSuccess());
    }
  } catch (error) {
    yield put(checkTokenExpirationFailure("토큰 재발급 검사 실패"));
  }
}

// 토큰 재발급 사가
function* refreshTokenSaga() {
  try {
    // refresh_token을 사용하여 토큰 재발급 요청
    const response: AxiosResponse<any> = yield call(() =>
      axios.get("/users/token/refresh", {
        headers: {
          Authorization: `Bearer ${getTokenFromCookie("access_token")}`,
        },
      })
    );

    if (response.status === 200) {
      const access_token = response.data?.access_token;
      // 새로 발급받은 access_token을 쿠키에 저장
      setTokenToCookie("access_token", access_token, 30); // 예: 30분 동안 유효한 토큰

      yield put(refreshTokenSuccess());
    } else {
      yield put(refreshTokenFailure("토큰 재발급에 실패했습니다."));
    }
  } catch (error) {
    yield put(refreshTokenFailure("토큰 재발급에 실패했습니다."));
  }
}

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
      setTokenToCookie("access_token", access_token, 30);
      setTokenToCookie("refresh_token", refresh_token, 180);

      // 로그인 성공 액션 디스패치
      yield put(fetchUserInfoRequest());
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
    Navigate({ to: "/" });
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
  yield takeLatest(fetchUserInfoRequest.type, fetchUserInfo);
  yield takeLatest(checkTokenExpirationRequest.type, checkTokenExpirationSaga);
  yield takeLatest(refreshTokenRequest.type, refreshTokenSaga);
  yield takeLatest(loginRequest.type, login);
  yield takeLatest(logoutRequest.type, logout);
  yield takeLatest(registerRequest.type, register);
}

export default authSaga;
