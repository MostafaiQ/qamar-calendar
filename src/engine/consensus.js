import zodiacRulings from '../data/zodiacRulings.js'
import weekdayRulings from '../data/weekdayRulings.js'
import lunarDayRulings from '../data/lunarDayRulings.js'

/**
 * Get consensus ruling for a given day
 * @param {number} hijriDay - 1-30
 * @param {number} signIndex - 0-11
 * @param {number} weekday - 0=Saturday, 6=Friday
 * @param {number} positionInSign - 1-based position within sign
 * @returns {{ marriage, travel, building, work, overall, showDuaa }}
 */
export function getConsensus(hijriDay, signIndex, weekday, positionInSign) {
  const categories = ['marriage', 'travel', 'building', 'work']
  const lunarDay = lunarDayRulings[hijriDay] || {}
  const sign = zodiacRulings[signIndex] || {}
  const week = weekdayRulings[weekday] || {}

  // Blanket مكروه from lunar day overrides everything
  if (lunarDay.blanket === 'مكروه') {
    return {
      marriage: 'مكروه', travel: 'مكروه', building: 'مكروه', work: 'مكروه',
      overall: 'bad', showDuaa: true,
    }
  }

  // Libra special rule: position > 1 means all مكروه
  let signRuling = { ...sign }
  if (signIndex === 7 && positionInSign > 1) {
    signRuling = { marriage: 'مكروه', travel: 'مكروه', building: 'مكروه', work: 'مكروه' }
  }

  const result = {}
  for (const cat of categories) {
    const sources = [
      lunarDay.blanket === 'حسن' ? 'حسن' : (lunarDay[cat] || null),
      signRuling[cat] || null,
      week[cat] || null,
    ].filter(s => s !== null)

    if (sources.includes('مكروه')) {
      result[cat] = 'مكروه'
    } else if (sources.includes('حسن')) {
      result[cat] = 'حسن'
    } else {
      result[cat] = 'مباح'
    }
  }

  const values = Object.values(result)
  if (values.every(v => v === 'حسن')) result.overall = 'good'
  else if (values.every(v => v === 'مكروه')) result.overall = 'bad'
  else if (values.some(v => v === 'مكروه')) result.overall = 'mixed'
  else result.overall = 'neutral'

  result.showDuaa = values.includes('مكروه')
  return result
}
