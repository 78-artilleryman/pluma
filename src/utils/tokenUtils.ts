// 토큰을 쿠키에 저장하는 함수
export function setTokenToCookie(name: string, value: string) {
  const expirationTime = new Date();
  expirationTime.setTime(expirationTime.getTime() + 30 * 60 * 1000); // 30분 뒤의 시간을 계산
  const expires = `expires=${expirationTime.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`; // 쿠키 설정
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
