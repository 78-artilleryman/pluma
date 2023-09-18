import { logoutRequest, refreshTokenRequest } from "../store/auth/authActions";

// 토큰을 쿠키에 저장하는 함수
export function setTokenToCookie(name: string, value: string, expirationMinutes?: number) {
  let expires = ""; // 만료 시간 문자열 초기화

  if (expirationMinutes !== undefined && expirationMinutes !== -1) {
    const expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() + expirationMinutes * 60 * 1000);
    expires = `expires=${expirationTime.toUTCString()}`;
  }

  document.cookie = `${name}=${value}; ${expires}; path=/`;
}
// 쿠키에서 토큰을 가져오는 함수
export function getTokenFromCookie(name: string): string | null {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(cookieName) === 0) {
      return c.substring(cookieName.length, c.length);
    }
  }
  return null;
}

// 쿠키에서 토큰을 삭제하는 함수
export function clearTokenFromCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
// 토큰 만료 시간을 검사하는 함수
export function checkTokenExpiration(dispatch: any) {
  const access_token = getTokenFromCookie("access_token");
  const refresh_token = getTokenFromCookie("refresh_token");

  if (access_token) {
    // access_token이 있는 경우, 만료 시간 확인 로직 추가
    const access_token_expiration = getTokenExpiration(access_token);

    if (access_token_expiration && access_token_expiration < new Date()) {
      // access_token이 만료된 경우, 재발급 요청 등의 처리를 수행
      dispatch(refreshTokenRequest());
      console.log("access토큰 재발급");
    }
  }

  if (refresh_token) {
    // refresh_token이 있는 경우, 만료 시간 확인 로직 추가
    const refresh_token_expiration = getTokenExpiration(refresh_token);

    if (refresh_token_expiration && refresh_token_expiration < new Date()) {
      // refresh_token이 만료된 경우, 로그아웃 등의 처리를 수행
      clearTokenFromCookie("user");
      clearTokenFromCookie("access_token");
      clearTokenFromCookie("refresh_token");
      console.log("재로그인 필요");

      dispatch(logoutRequest());
    }
  }
}

// 토큰의 만료 시간을 가져오는 함수
function getTokenExpiration(token: string): Date | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload && payload.exp) {
      return new Date(payload.exp * 1000);
    }
  } catch (error) {
    return null;
  }
  return null;
}
