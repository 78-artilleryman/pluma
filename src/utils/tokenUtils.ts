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

export function checkTokenExpiration(dispatch: any): boolean {
  const currentDateTime = new Date();
  // Access token 유효성 검사
  const accessToken = getTokenFromCookie("access_token");
  if (accessToken) {
    const accessTokenExpiration = getTokenExpiration(accessToken);
    if (accessTokenExpiration && accessTokenExpiration > currentDateTime) {
      return true; // Access token이 유효하면 true 반환
    } else {
      dispatch(refreshTokenRequest());
      console.log("액세스 토큰 재발급 필요");
      // Access token이 유효하지 않은 경우, refreshToken 유효성 검사는 아래에서 수행됨
    }
  }
  // Refresh token 유효성 검사
  const refreshToken = getTokenFromCookie("refresh_token");
  if (refreshToken) {
    const refreshTokenExpiration = getTokenExpiration(refreshToken);
    if (refreshTokenExpiration && refreshTokenExpiration > currentDateTime) {
      // 여기서는 refreshTokenRequest가 액세스 토큰을 갱신한다고 가정
      return true; // Refresh token이 유효하면 true 반환
    } else {
      console.log("재로그인 필요");
      dispatch(logoutRequest());
    }
  }
  return false; // 모든 토큰이 유효하지 않으면 false 반환
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
