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
  emailAuthenticationRequest,
  emailAuthenticationSuccess,
  emailAuthenticationFailure,
  checkEmailAuthenticationRequest,
  checkEmailAuthenticationSuccess,
  checkEmailAuthenticationFailure,
  kakaoLoginFailure,
  kakaoLoginSuccess,
  kakaoLoginRequest,
  googleLoginRequest,
  googleLoginSuccess,
  googleLoginFailure,
  naverLoginSuccess,
  naverLoginFailure,
  naverLoginRequest,
} from "./authActions";
import { Dispatch } from "redux";

import {
  setTokenToCookie, // 쿠키에 토큰 저장 함수 가져오기
  clearTokenFromCookie,
  checkTokenExpiration,
  getTokenFromCookie, // 쿠키에서 토큰 삭제 함수 가져오기
} from "../../utils/tokenUtils"; // tokenUtil 파일에서 가져옴

// 사용자 정보를 가져오는 사가
function* fetchUserInfo() {
  try {
    // 서버에 사용자 정보를 요청
    const response: AxiosResponse<any> = yield call(() =>
      axios.get("/users/getInfo", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getTokenFromCookie("access_token")}`,
        },
      })
    );

    if (response.status === 200) {
      // 응답 데이터에서 사용자 정보 추출
      const userInfo = response.data;
      localStorage.setItem("user", JSON.stringify(response.data));
      yield put(fetchUserInfoSuccess(userInfo));
      yield put(loginSuccess(userInfo.name));
    } else {
      yield put(fetchUserInfoFailure("사용자 정보를 가져오는데 실패했습니다."));
    }
  } catch (error) {
    yield put(fetchUserInfoFailure("사용자 정보를 가져오는데 실패했습니다."));
  }
}

// 이메일 인증번호 요청 사가
function* emailAuthentication(action: any) {
  try {
    const { email } = action.payload;
    // 서버에 사용자 정보를 요청
    const response: AxiosResponse<any> = yield call(() =>
      axios.post(
        "/auth/emails/verification",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    if (response.status === 200) {
      yield put(emailAuthenticationSuccess());
    } else {
      yield put(emailAuthenticationFailure("인증메일 전송에 실패했습니다."));
    }
  } catch (error) {
    yield put(emailAuthenticationFailure("인증메일 전송에 실패했습니다."));
  }
}
// 이메일 인증번호 확인 요청 사가
function* checkEmailAuthentication(action: any) {
  try {
    const { email, code } = action.payload;
    // 서버에 사용자 정보를 요청
    const response: AxiosResponse<any> = yield call(() =>
      axios.post(
        "/auth/emails-code/verification",
        { email, code },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    if (response.status === 200) {
      if (response.data === false) {
        alert("인증 코드가 틀렸습니다");
      }
      yield put(checkEmailAuthenticationSuccess(response.data));
    } else {
      yield put(checkEmailAuthenticationFailure("메일 인증에 실패했습니다."));
    }
  } catch (error) {
    yield put(checkEmailAuthenticationFailure("메일 인증에 실패했습니다."));
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
      yield put(refreshTokenRequest());
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
      axios.post("/auth/refresh", {
        accessToken: getTokenFromCookie("access_token"),
        refreshToken: getTokenFromCookie("refresh_token"),
      })
    );

    if (response.status === 200) {
      const access_token = response.data?.accessToken;
      const refresh_token = response.data?.refreshToken;
      // 새로 발급받은 access_token을 쿠키에 저장
      setTokenToCookie("access_token", access_token, 60);
      // axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setTokenToCookie("refresh_token", refresh_token, 296);
      yield put(refreshTokenSuccess());
    } else {
      yield put(refreshTokenFailure("토큰 재발급에 실패했습니다."));
      yield put(logoutRequest());
    }
  } catch (error) {
    yield put(refreshTokenFailure("토큰 재발급에 실패했습니다."));
    yield put(logoutRequest());
  }
}

// 로그인 사가
function* login(action: any) {
  try {
    const { username, password } = action.payload;

    // Axios를 사용하여 실제 API 호출
    const response: AxiosResponse<any> = yield call(() =>
      axios.post(
        "/auth/login",
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    );

    if (response.status === 200) {
      // 응답 데이터에서 access_token 추출
      const access_token = response.data?.accessToken;
      const refresh_token = response.data?.refreshToken;

      // access_token과 refresh_token을 쿠키에 저장
      setTokenToCookie("access_token", access_token, 60);
      // axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      setTokenToCookie("refresh_token", refresh_token, 296);

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
    delete axios.defaults.headers.common["ACCESS_TOKEN"];
    clearTokenFromCookie("refresh_token");
    localStorage.removeItem("user");

    yield put(logoutSuccess("로그아웃 성공"));
  } catch (error) {
    yield put(logoutFailure("로그아웃 실패했습니다."));
  }
}

// 회원가입 사가 - 유사한 방식으로 작성
function* register(action: any) {
  try {
    const { username, password, name } = action.payload;

    // Axios를 사용하여 실제 API 호출
    const response: AxiosResponse<any> = yield call(
      () =>
        axios.post(
          "/auth/signup",
          { username, password, name },
          { headers: { "Content-Type": "application/json" } }
        ) // 회원가입 엔드포인트 URL
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
// 카카오 로그인 사가
function* kakaoLogin(action: any) {
  try {
    console.log(action); // 카카오 토큰 API 호출
    const response: AxiosResponse<any> = yield call(() =>
      axios.get(`/oauth/kakao?code=${action.payload}`)
    );
    if (response.status === 200) {
      // 로그인 성공 처리
      console.log(response.data);
      setTokenToCookie("access_token", response.data.accessToken, 60);
      setTokenToCookie("refresh_token", response.data.refreshToken, 296);
      yield put(kakaoLoginSuccess(response.data));
      yield put(fetchUserInfoRequest());
    } else {
      yield put(kakaoLoginFailure("카카오 로그인 실패"));
    }
  } catch (error) {
    console.log(error);
    yield put(kakaoLoginFailure("카카오 로그인 실패"));
  }
}
// 구글 로그인 사가
function* googleLogin(action: any) {
  try {
    console.log(action); // 카카오 토큰 API 호출
    const response: AxiosResponse<any> = yield call(() =>
      axios.get(`/oauth/google?code=${action.payload}`)
    );
    if (response.status === 200) {
      // 로그인 성공 처리
      console.log(response.data);
      setTokenToCookie("access_token", response.data.accessToken, 60);
      setTokenToCookie("refresh_token", response.data.refreshToken, 296);
      yield put(googleLoginSuccess(response.data));
      yield put(fetchUserInfoRequest());
    } else {
      yield put(googleLoginFailure("구글 로그인 실패"));
    }
  } catch (error) {
    console.log(error);
    yield put(googleLoginFailure("구글 로그인 실패"));
  }
}
// 네이버 로그인 사가
function* naverLogin(action: any) {
  try {
    console.log(action); // 카카오 토큰 API 호출
    const response: AxiosResponse<any> = yield call(() =>
      axios.get(`/oauth/naver?code=${action.payload}&state=1234`)
    );
    if (response.status === 200) {
      // 로그인 성공 처리
      console.log(response.data);
      setTokenToCookie("access_token", response.data.accessToken, 60);
      setTokenToCookie("refresh_token", response.data.refreshToken, 296);
      yield put(naverLoginSuccess(response.data));
      yield put(fetchUserInfoRequest());
    } else {
      yield put(naverLoginFailure("구글 로그인 실패"));
    }
  } catch (error) {
    console.log(error);
    yield put(naverLoginFailure("구글 로그인 실패"));
  }
}

function* authSaga() {
  yield takeLatest(fetchUserInfoRequest.type, fetchUserInfo);
  yield takeLatest(emailAuthenticationRequest.type, emailAuthentication);
  yield takeLatest(checkEmailAuthenticationRequest.type, checkEmailAuthentication);
  yield takeLatest(checkTokenExpirationRequest.type, checkTokenExpirationSaga);
  yield takeLatest(refreshTokenRequest.type, refreshTokenSaga);
  yield takeLatest(loginRequest.type, login);
  yield takeLatest(logoutRequest.type, logout);
  yield takeLatest(registerRequest.type, register);
  yield takeLatest(kakaoLoginRequest.type, kakaoLogin);
  yield takeLatest(googleLoginRequest.type, googleLogin);
  yield takeLatest(naverLoginRequest.type, naverLogin);
}

export default authSaga;
