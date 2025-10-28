export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function dateToJulianDate(date) {
  return date.getTime() / MS_PER_DAY + 2440587.5;
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}
