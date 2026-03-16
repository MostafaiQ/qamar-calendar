/**
 * Generate readings.json — 2,520 pre-composed daily readings
 * 30 hijriDays × 12 zodiac signs × 7 weekdays
 * Runs offline using template composition (no API needed)
 */

// ============ INLINE DATA ============

const signNamesAr = ['الحوت', 'الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'السنبلة', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو']
const signNamesEn = ['Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius']
const weekdayNamesAr = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
const weekdayNamesEn = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const zodiacRulings = {
  0:  { marriage: null,     travel: null,     building: null,     work: null     },
  1:  { marriage: 'مكروه', travel: 'حسن',   building: 'مكروه', work: 'حسن'   },
  2:  { marriage: 'حسن',   travel: null,     building: 'حسن',   work: null     },
  3:  { marriage: 'مكروه', travel: 'حسن',   building: 'حسن',   work: 'مكروه' },
  4:  { marriage: 'مكروه', travel: 'حسن',   building: 'مكروه', work: 'حسن'   },
  5:  { marriage: 'حسن',   travel: null,     building: null,     work: null     },
  6:  { marriage: 'حسن',   travel: 'حسن',   building: 'حسن',   work: null     },
  7:  { marriage: 'حسن',   travel: 'حسن',   building: null,     work: null     },
  8:  { marriage: 'مكروه', travel: 'مكروه', building: 'مكروه', work: 'مكروه' },
  9:  { marriage: 'حسن',   travel: null,     building: 'حسن',   work: null     },
  10: { marriage: null,     travel: 'مكروه', building: 'حسن',   work: 'مكروه' },
  11: { marriage: 'مكروه', travel: 'مكروه', building: 'حسن',   work: null     },
}

const weekdayRulings = {
  0: { marriage: null,   travel: 'حسن',   building: null,   work: null   },
  1: { marriage: null,   travel: 'حسن',   building: 'حسن', work: null   },
  2: { marriage: null,   travel: 'مكروه', building: null,   work: null   },
  3: { marriage: null,   travel: 'حسن',   building: null,   work: null   },
  4: { marriage: null,   travel: 'مكروه', building: null,   work: null   },
  5: { marriage: null,   travel: 'حسن',   building: null,   work: null   },
  6: { marriage: 'حسن', travel: 'مكروه', building: null,   work: null   },
}

// Source: مكارم الأخلاق - الشيخ الطبرسي (فقط)
const lunarDayRulings = {
  1:  { marriage: null,     travel: 'حسن',   building: null,     work: 'حسن'   },
  2:  { marriage: null,     travel: 'حسن',   building: null,     work: null     },
  3:  { blanket: 'مكروه' },
  4:  { marriage: 'حسن',   travel: 'مكروه', building: null,     work: null     },
  5:  { blanket: 'مكروه' },
  6:  { marriage: 'حسن',   travel: null,     building: null,     work: null     },
  7:  { blanket: 'حسن' },
  8:  { marriage: 'حسن',   travel: 'مكروه', building: 'حسن',   work: 'حسن'   },
  9:  { blanket: 'حسن' },
  10: { marriage: null,     travel: null,     building: null,     work: 'حسن'   },
  11: { marriage: null,     travel: 'حسن',   building: null,     work: 'حسن'   },
  12: { blanket: 'حسن' },
  13: { blanket: 'مكروه' },
  14: { blanket: 'حسن' },
  15: { blanket: 'حسن' },
  16: { blanket: 'مكروه' },
  17: { blanket: 'حسن' },
  18: { marriage: null,     travel: 'حسن',   building: null,     work: null     },
  19: { blanket: 'حسن' },
  20: { marriage: null,     travel: 'حسن',   building: 'حسن',   work: null     },
  21: { blanket: 'مكروه' },
  22: { marriage: null,     travel: 'حسن',   building: null,     work: 'حسن'   },
  23: { marriage: 'حسن',   travel: null,     building: null,     work: 'حسن'   },
  24: { blanket: 'مكروه' },
  25: { blanket: 'مكروه' },
  26: { marriage: 'مكروه', travel: 'مكروه', building: 'حسن',   work: 'حسن'   },
  27: { blanket: 'حسن' },
  28: { marriage: null,     travel: null,     building: null,     work: null     },
  29: { marriage: 'حسن',   travel: 'حسن',   building: 'حسن',   work: 'حسن'   },
  30: { marriage: 'حسن',   travel: null,     building: null,     work: 'حسن'   },
}

// Day descriptions from مكارم الأخلاق - الطبرسي (فقط)
const dayStories = {
  1:  { ar: 'يوم سعيد يصلح للقاء الأمراء وطلب الحوائج', en: 'an auspicious day for meeting rulers and seeking needs' },
  2:  { ar: 'يصلح للسفر وطلب الحوائج', en: 'suitable for travel and seeking needs' },
  3:  { ar: 'رديء لا يصلح لشيء جملةً', en: 'bad — not suitable for anything at all' },
  4:  { ar: 'صالح للتزويج ويُكره السفر فيه', en: 'good for marriage, travel is disliked' },
  5:  { ar: 'رديء نحس', en: 'bad and inauspicious' },
  6:  { ar: 'مبارك يصلح للتزويج وطلب الحوائج', en: 'blessed, for marriage and seeking needs' },
  7:  { ar: 'مبارك مختار يصلح لكلّ ما يُراد', en: 'blessed and chosen for everything one seeks' },
  8:  { ar: 'يصلح لكلّ حاجة سوى السفر', en: 'good for every need except travel' },
  9:  { ar: 'مبارك يصلح لكلّ ما يريد الإنسان', en: 'blessed for anything one desires' },
  10: { ar: 'صالح لكلّ حاجة وجيّد للشراء والبيع', en: 'good for every need, for buying and selling' },
  11: { ar: 'يصلح للشراء والبيع والسفر', en: 'suitable for buying, selling, and travel' },
  12: { ar: 'يوم مبارك تُقضى فيه الحوائج', en: 'a blessed day where needs are fulfilled' },
  13: { ar: 'يوم نحس فاتّقوا فيه جميع الأعمال', en: 'inauspicious — avoid all works' },
  14: { ar: 'جيد للحوائج ولكلّ عمل', en: 'good for needs and every work' },
  15: { ar: 'صالح لكلّ حاجة تريدها', en: 'good for any need you desire' },
  16: { ar: 'رديء مذموم لكلّ شيء', en: 'bad and blameworthy for everything' },
  17: { ar: 'صالح مختار لكلّ ما يُراد', en: 'good and chosen for everything desired' },
  18: { ar: 'مختار صالح للسفر وطلب الحوائج', en: 'chosen for travel and seeking needs' },
  19: { ar: 'مختار صالح لكلّ عمل', en: 'chosen and good for every work' },
  20: { ar: 'جيّد مختار للحوائج والسفر والبناء', en: 'chosen for needs, travel, and building' },
  21: { ar: 'يوم نحسٍ مستمرّ', en: 'a day of continuous misfortune' },
  22: { ar: 'مختار صالح للشراء والبيع والسفر', en: 'chosen for buying, selling, and travel' },
  23: { ar: 'مختار جيّد للتزويج والتجارات', en: 'chosen for marriage and all trades' },
  24: { ar: 'يوم نحس شوم', en: 'an inauspicious, ominous day' },
  25: { ar: 'رديء مذموم يُحذر فيه من كلّ شيء', en: 'bad and blameworthy — beware of everything' },
  26: { ar: 'صالح لكلّ حاجة سوى التزويج والسفر', en: 'good for everything except marriage and travel' },
  27: { ar: 'جيّد مختار للحوائج وكلّ ما يُراد', en: 'chosen for needs and everything desired' },
  28: { ar: 'ممزوج', en: 'mixed' },
  29: { ar: 'مختار جيّد لكلّ حاجة', en: 'chosen and good for every need' },
  30: { ar: 'مختار جيّد للشراء والبيع والتزويج', en: 'chosen for buying, selling, and marriage' },
}

// ============ MOON SIGN CALCULATOR ============

function getMoonSign(hijriDay) {
  const n = hijriDay * 2 + 5
  const quotient = Math.floor(n / 5)
  let remainder = n % 5
  if (remainder === 0) remainder = 5
  const totalDistributions = remainder === 5 ? quotient : quotient + 1
  const signIndex = (totalDistributions - 1) % 12
  const nightDuration = (remainder % 2 === 0) ? 2 : 3
  let positionInSign
  if (nightDuration === 2) {
    positionInSign = remainder === 2 ? 1 : 2
  } else {
    positionInSign = remainder === 1 ? 1 : remainder === 3 ? 2 : 3
  }
  return { signIndex, nightDuration, positionInSign }
}

// ============ CONSENSUS CALCULATOR ============

function getConsensus(hijriDay, signIndex, weekday, positionInSign) {
  const categories = ['marriage', 'travel', 'building', 'work']
  const lunarDay = lunarDayRulings[hijriDay] || {}
  const sign = zodiacRulings[signIndex] || {}
  const week = weekdayRulings[weekday] || {}

  if (lunarDay.blanket === 'مكروه') {
    return { marriage: 'مكروه', travel: 'مكروه', building: 'مكروه', work: 'مكروه', overall: 'bad', showDuaa: true }
  }

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
    if (sources.includes('مكروه')) result[cat] = 'مكروه'
    else if (sources.includes('حسن')) result[cat] = 'حسن'
    else result[cat] = 'مباح'
  }

  const values = [result.marriage, result.travel, result.building, result.work]
  if (values.every(v => v === 'حسن')) result.overall = 'good'
  else if (values.every(v => v === 'مكروه')) result.overall = 'bad'
  else if (values.some(v => v === 'مكروه')) result.overall = 'mixed'
  else result.overall = 'neutral'
  result.showDuaa = values.includes('مكروه')
  return result
}

// ============ READING COMPOSER ============

const catNamesAr = { marriage: 'الزواج', travel: 'السفر', building: 'البناء', work: 'ابتداء الأعمال' }
const catNamesEn = { marriage: 'marriage', travel: 'travel', building: 'building', work: 'starting work' }

function composeReading(hijriDay, signIndex, weekdayIndex) {
  const { positionInSign } = getMoonSign(hijriDay)
  const consensus = getConsensus(hijriDay, signIndex, weekdayIndex, positionInSign)
  const story = dayStories[hijriDay]
  const signAr = signNamesAr[signIndex]
  const signEn = signNamesEn[signIndex]
  const weekAr = weekdayNamesAr[weekdayIndex]
  const weekEn = weekdayNamesEn[weekdayIndex]

  // Categorize rulings
  const goodAr = []
  const badAr = []
  const goodEn = []
  const badEn = []

  for (const cat of ['marriage', 'travel', 'building', 'work']) {
    if (consensus[cat] === 'حسن') {
      goodAr.push(catNamesAr[cat])
      goodEn.push(catNamesEn[cat])
    } else if (consensus[cat] === 'مكروه') {
      badAr.push(catNamesAr[cat])
      badEn.push(catNamesEn[cat])
    }
  }

  // Compose Arabic reading
  let ar = ''
  if (consensus.overall === 'bad') {
    ar = `في هذا اليوم الذي ${story.ar}، والقمر في برج ${signAr} يوم ${weekAr}، يُكره فيه جميع الأمور من ${badAr.join(' و')}. يُستحب التصدق والدعاء لدفع النحس.`
  } else if (consensus.overall === 'good') {
    ar = `في هذا اليوم المبارك الذي ${story.ar}، والقمر في برج ${signAr} يوم ${weekAr}، يُستحب فيه ${goodAr.join(' و')}. فاغتنم هذا اليوم في قضاء حوائجك.`
  } else if (consensus.overall === 'mixed') {
    ar = `في هذا اليوم الذي ${story.ar}، والقمر في برج ${signAr} يوم ${weekAr}`
    if (goodAr.length > 0) {
      ar += `، يُستحب فيه ${goodAr.join(' و')}`
    }
    if (badAr.length > 0) {
      ar += `، ويُكره فيه ${badAr.join(' و')}`
    }
    ar += '. فاحرص على ما ينفعك وتجنب ما يُكره.'
  } else {
    ar = `في هذا اليوم الذي ${story.ar}، والقمر في برج ${signAr} يوم ${weekAr}، لم يرد نهي أو استحباب خاص. فتوكل على الله في أمورك.`
  }

  // Compose English reading
  let en = ''
  if (consensus.overall === 'bad') {
    en = `On this day when ${story.en}, with the moon in ${signEn} on ${weekEn}, all matters are disliked including ${badEn.join(' and ')}. It is recommended to give charity and recite prayers for protection.`
  } else if (consensus.overall === 'good') {
    en = `On this blessed day when ${story.en}, with the moon in ${signEn} on ${weekEn}, it is recommended to pursue ${goodEn.join(' and ')}. Take advantage of this auspicious day for your needs.`
  } else if (consensus.overall === 'mixed') {
    en = `On this day when ${story.en}, with the moon in ${signEn} on ${weekEn}`
    if (goodEn.length > 0) {
      en += `, ${goodEn.join(' and ')} ${goodEn.length === 1 ? 'is' : 'are'} recommended`
    }
    if (badEn.length > 0) {
      en += `, while ${badEn.join(' and ')} ${badEn.length === 1 ? 'is' : 'are'} disliked`
    }
    en += '. Focus on what benefits you and avoid what is disliked.'
  } else {
    en = `On this day when ${story.en}, with the moon in ${signEn} on ${weekEn}, there are no specific recommendations or prohibitions. Place your trust in Allah in your affairs.`
  }

  return { ar, en }
}

// ============ GENERATE ALL READINGS ============

console.log('Generating 2,520 readings...')
const readings = {}
let count = 0

for (let day = 1; day <= 30; day++) {
  for (let sign = 0; sign < 12; sign++) {
    for (let weekday = 0; weekday < 7; weekday++) {
      const key = `${day}-${sign}-${weekday}`
      readings[key] = composeReading(day, sign, weekday)
      count++
    }
  }
}

console.log(`Generated ${count} readings.`)

import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'src', 'data')
mkdirSync(outDir, { recursive: true })
const outPath = join(outDir, 'readings.json')
writeFileSync(outPath, JSON.stringify(readings, null, 0))
console.log(`Written to ${outPath} (${(JSON.stringify(readings).length / 1024).toFixed(0)} KB)`)
