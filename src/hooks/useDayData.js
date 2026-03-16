import { useMemo } from 'react'
import { getMoonSign } from '../engine/moonSign.js'
import { getConsensus } from '../engine/consensus.js'
import { getReading } from '../engine/reading.js'
import lunarDayNarrations from '../data/lunarDayNarrations.js'
import signs from '../data/signMeta.js'
import { getWeekdayIndex } from '../utils/dateHelpers.js'

/**
 * Combines all engines for a given Hijri date + Gregorian date
 */
export function useDayData(hijri, gregorianDate) {
  return useMemo(() => {
    if (!hijri || !gregorianDate) return null

    const hijriDay = hijri.day
    const weekdayIndex = getWeekdayIndex(gregorianDate)
    const { signIndex, nightDuration, positionInSign } = getMoonSign(hijriDay)
    const consensus = getConsensus(hijriDay, signIndex, weekdayIndex, positionInSign)
    const reading = getReading(hijriDay, signIndex, weekdayIndex)
    const narration = lunarDayNarrations[hijriDay]
    const sign = signs[signIndex]

    return {
      hijriDay,
      weekdayIndex,
      signIndex,
      sign,
      nightDuration,
      positionInSign,
      consensus,
      reading,
      narration,
    }
  }, [hijri?.day, hijri?.month, hijri?.year, gregorianDate?.getTime()])
}
