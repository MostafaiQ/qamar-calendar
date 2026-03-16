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

const lunarDayRulings = {
  1:  { marriage: 'حسن',   travel: 'حسن',   building: null,     work: null     },
  2:  { marriage: 'حسن',   travel: 'حسن',   building: 'حسن',   work: 'حسن'   },
  3:  { blanket: 'مكروه' },
  4:  { marriage: 'حسن',   travel: 'مكروه', building: 'حسن',   work: null     },
  5:  { blanket: 'مكروه' },
  6:  { marriage: 'حسن',   travel: 'حسن',   building: null,     work: null     },
  7:  { blanket: 'حسن' },
  8:  { marriage: null,     travel: 'مكروه', building: null,     work: null     },
  9:  { blanket: 'حسن' },
  10: { marriage: null,     travel: 'حسن',   building: null,     work: null     },
  11: { marriage: null,     travel: 'حسن',   building: null,     work: 'حسن'   },
  12: { marriage: 'حسن',   travel: 'حسن',   building: 'حسن',   work: 'حسن'   },
  13: { blanket: 'مكروه' },
  14: { blanket: 'حسن' },
  15: { marriage: 'حسن',   travel: 'حسن',   building: null,     work: 'حسن'   },
  16: { marriage: 'مكروه', travel: 'مكروه', building: 'حسن',   work: 'مكروه' },
  17: { marriage: 'حسن',   travel: 'حسن',   building: null,     work: null     },
  18: { blanket: 'حسن' },
  19: { blanket: 'حسن' },
  20: { marriage: null,     travel: 'حسن',   building: 'حسن',   work: null     },
  21: { blanket: 'مكروه' },
  22: { marriage: null,     travel: 'حسن',   building: null,     work: null     },
  23: { blanket: 'حسن' },
  24: { blanket: 'مكروه' },
  25: { blanket: 'مكروه' },
  26: { marriage: 'مكروه', travel: 'مكروه', building: null,     work: null     },
  27: { blanket: 'حسن' },
  28: { marriage: null,     travel: 'حسن',   building: null,     work: null     },
  29: { marriage: null,     travel: 'حسن',   building: 'حسن',   work: 'حسن'   },
  30: { marriage: 'حسن',   travel: 'مكروه', building: 'حسن',   work: 'حسن'   },
}

// Day narration cores (short references for reading composition)
const dayStories = {
  1:  { ar: 'خلق الله فيه آدم عليه السلام', en: 'Allah created Adam (as) on this day' },
  2:  { ar: 'خُلقت فيه حواء', en: 'Eve was created on this day' },
  3:  { ar: 'سُلب آدم وحواء لباسهما وأُخرجا من الجنة', en: 'Adam and Eve were stripped and expelled from Paradise' },
  4:  { ar: 'ولد فيه شيث بن آدم عليه السلام', en: 'Seth son of Adam (as) was born on this day' },
  5:  { ar: 'ولد فيه قابيل وفيه قتل أخاه هابيل', en: 'Cain was born and killed his brother Abel on this day' },
  6:  { ar: 'ولد فيه نوح عليه السلام', en: 'Noah (as) was born on this day' },
  7:  { ar: 'ولد فيه موسى بن عمران عليه السلام', en: 'Moses son of Imran (as) was born on this day' },
  8:  { ar: 'أُلقي فيه إبراهيم عليه السلام في النار فجعلها الله برداً وسلاماً', en: 'Abraham (as) was thrown into the fire and Allah made it cool and peaceful' },
  9:  { ar: 'أنزل الله فيه التوراة على موسى عليه السلام', en: 'Allah revealed the Torah to Moses (as) on this day' },
  10: { ar: 'غرق فيه فرعون وجنوده', en: 'Pharaoh and his soldiers were drowned on this day' },
  11: { ar: 'أنزل الله فيه الإنجيل على عيسى عليه السلام', en: 'Allah revealed the Gospel to Jesus (as) on this day' },
  12: { ar: 'رُفع فيه إدريس عليه السلام مكاناً علياً', en: 'Idris (as) was raised to a lofty station on this day' },
  13: { ar: 'يوم نحس', en: 'a day of misfortune' },
  14: { ar: 'نزل فيه القرآن الكريم', en: 'the Holy Quran was revealed on this day' },
  15: { ar: 'ولد فيه الإمام الحسن عليه السلام', en: 'Imam al-Hasan (as) was born on this day' },
  16: { ar: 'يوم مكروه لأكثر الأمور', en: 'a day disliked for most matters' },
  17: { ar: 'التقى فيه أصحاب الفيل بالطير الأبابيل', en: 'the People of the Elephant met the Ababil birds on this day' },
  18: { ar: 'ولد فيه إبراهيم خليل الرحمن عليه السلام', en: 'Abraham the Friend of the Most Merciful (as) was born on this day' },
  19: { ar: 'يوم سعيد مبارك', en: 'a felicitous and blessed day' },
  20: { ar: 'كلّم الله فيه موسى تكليماً', en: 'Allah spoke directly to Moses on this day' },
  21: { ar: 'ولد فيه فرعون', en: 'Pharaoh was born on this day' },
  22: { ar: 'ولد فيه يونس بن متّى عليه السلام', en: 'Jonah son of Matta (as) was born on this day' },
  23: { ar: 'ولد فيه يوسف عليه السلام', en: 'Joseph (as) was born on this day' },
  24: { ar: 'يوم نحس ثقيل', en: 'a heavy day of misfortune' },
  25: { ar: 'أُهبط فيه آدم عليه السلام من الجنة', en: 'Adam (as) was sent down from Paradise on this day' },
  26: { ar: 'ضرب فيه موسى عليه السلام البحر بعصاه فانفلق', en: 'Moses (as) struck the sea with his staff and it parted on this day' },
  27: { ar: 'بُعث فيه محمد صلى الله عليه وآله', en: 'the Prophet Muhammad (pbuh) was sent as a messenger on this day' },
  28: { ar: 'يوم صالح للسفر', en: 'a good day for travel' },
  29: { ar: 'يوم صالح للسفر والبناء والأعمال', en: 'a good day for travel, building, and work' },
  30: { ar: 'يوم صالح للتزويج والبناء', en: 'a good day for marriage and building' },
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
