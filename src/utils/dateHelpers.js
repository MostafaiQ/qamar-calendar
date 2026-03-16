/**
 * Get weekday index: 0=Saturday, 1=Sunday, ..., 6=Friday
 */
export function getWeekdayIndex(date) {
  // JS getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
  const jsDay = date.getDay()
  // Convert: Saturday=0, Sunday=1, Monday=2, ...Friday=6
  return jsDay === 6 ? 0 : jsDay + 1
}

/**
 * Get Arabic weekday name
 */
const weekdayNamesAr = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
const weekdayNamesEn = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export function getWeekdayName(index, lang = 'ar') {
  return lang === 'ar' ? weekdayNamesAr[index] : weekdayNamesEn[index]
}

/**
 * Format Gregorian date
 */
export function formatGregorian(date) {
  return date.toISOString().slice(0, 10)
}

/**
 * Add days to a date
 */
export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Get short weekday letters for calendar header
 */
const weekdayShortAr = ['س', 'أح', 'إث', 'ث', 'أر', 'خ', 'ج']
const weekdayShortEn = ['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr']

export function getWeekdayShort(index, lang = 'ar') {
  return lang === 'ar' ? weekdayShortAr[index] : weekdayShortEn[index]
}
