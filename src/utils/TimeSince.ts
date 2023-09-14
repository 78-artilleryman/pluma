// util/timeSince.ts
export function timeSince(date: string | number | Date): string {
  const currentDate = new Date();
  const inputDate = new Date(date);
  const seconds = Math.floor((currentDate.getTime() - inputDate.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " 년 전";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " 달 전";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " 일 전";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " 시간 전";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " 분 전";
  }
  return Math.floor(seconds) + " 초 전";
}
