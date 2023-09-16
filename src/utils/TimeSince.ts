export function timeSince(date: string | number | Date): string {
  const currentDate = new Date();
  const inputDate = new Date(date);
  const seconds = Math.floor((currentDate.getTime() - inputDate.getTime()) / 1000);

  if (seconds < 60) {
    return seconds + " 초 전";
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return minutes + " 분 전";
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return hours + " 시간 전";
  } else if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    return days + " 일 전";
  } else if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return months + " 달 전";
  } else {
    const years = Math.floor(seconds / 31536000);
    return years + " 년 전";
  }
}
