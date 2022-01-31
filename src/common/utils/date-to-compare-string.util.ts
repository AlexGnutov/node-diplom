export function DateToComStrUtil(date: Date) {
  date.setMilliseconds(0);
  date.setSeconds(0);
  date.setHours(0);
  return date.valueOf();
}
