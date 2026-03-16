/**
 * Calculate moon sign from Hijri day (1-30)
 * Returns: { signIndex, nightDuration, positionInSign }
 */
export function getMoonSign(hijriDay) {
  const n = hijriDay * 2 + 5
  const quotient = Math.floor(n / 5)
  let remainder = n % 5
  if (remainder === 0) remainder = 5

  const totalDistributions = remainder === 5 ? quotient : quotient + 1
  // Count totalDistributions steps starting from Pisces as 1
  // e.g. totalDist=12 → step 12 from Pisces(1) = Aquarius(11)
  const signIndex = (totalDistributions - 1) % 12

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
