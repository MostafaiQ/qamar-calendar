/**
 * Get the solar (sun) sign index from a Gregorian date.
 * Uses the same index system as signMeta.js:
 * 0=Pisces, 1=Aries, 2=Taurus, ... 11=Aquarius
 */
export function getSolarSignIndex(gregorianDate) {
  const m = gregorianDate.getMonth() + 1 // 1-12
  const d = gregorianDate.getDate()

  // [startMonth, startDay, signIndex]
  const boundaries = [
    [1, 20, 11],  // Jan 20 – Feb 18 → Aquarius (11)
    [2, 19, 0],   // Feb 19 – Mar 20 → Pisces (0)
    [3, 21, 1],   // Mar 21 – Apr 19 → Aries (1)
    [4, 20, 2],   // Apr 20 – May 20 → Taurus (2)
    [5, 21, 3],   // May 21 – Jun 20 → Gemini (3)
    [6, 21, 4],   // Jun 21 – Jul 22 → Cancer (4)
    [7, 23, 5],   // Jul 23 – Aug 22 → Leo (5)
    [8, 23, 6],   // Aug 23 – Sep 22 → Virgo (6)
    [9, 23, 7],   // Sep 23 – Oct 22 → Libra (7)
    [10, 23, 8],  // Oct 23 – Nov 21 → Scorpio (8)
    [11, 22, 9],  // Nov 22 – Dec 21 → Sagittarius (9)
    [12, 22, 10], // Dec 22 – Jan 19 → Capricorn (10)
  ]

  // Walk backwards to find which boundary we're in
  for (let i = boundaries.length - 1; i >= 0; i--) {
    const [bm, bd] = boundaries[i]
    if (m > bm || (m === bm && d >= bd)) return boundaries[i][2]
  }
  // Before Jan 20 → Capricorn
  return 10
}

/**
 * Calculate moon sign from Hijri day (1-30) and Gregorian date.
 * The sign is determined by stepping totalDistributions from the current solar sign.
 * Returns: { signIndex, nightDuration, positionInSign }
 */
export function getMoonSign(hijriDay, gregorianDate) {
  const n = hijriDay * 2 + 5
  const quotient = Math.floor(n / 5)
  let remainder = n % 5
  if (remainder === 0) remainder = 5

  const totalDistributions = remainder === 5 ? quotient : quotient + 1

  // Start from the current solar sign and step totalDistributions forward
  const solarSign = getSolarSignIndex(gregorianDate)
  const signIndex = (solarSign + totalDistributions - 1) % 12

  // Even remainders (2,4) = 2 nights; odd remainders (1,3,5) = 3 nights
  const nightDuration = (remainder % 2 === 0) ? 2 : 3

  // Position within the sign
  let positionInSign
  if (nightDuration === 2) {
    positionInSign = remainder === 2 ? 1 : 2
  } else {
    positionInSign = remainder === 1 ? 1 : remainder === 3 ? 2 : 3
  }

  return { signIndex, nightDuration, positionInSign }
}
