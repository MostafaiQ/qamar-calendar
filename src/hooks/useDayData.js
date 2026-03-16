import { useMemo, useState, useEffect } from 'react'
import { getMoonSign } from '../engine/moonSign.js'
import { getConsensus } from '../engine/consensus.js'
import { getReading, getReadingAsync } from '../engine/reading.js'
import lunarDayNarrations from '../data/lunarDayNarrations.js'
import signs from '../data/signMeta.js'
import { getWeekdayIndex } from '../utils/dateHelpers.js'

/**
 * Combines all engines for a given Hijri date + Gregorian date
 */
export function useDayData(hijri, gregorianDate) {
  const [reading, setReading] = useState(null)

  const coreData = useMemo(() => {
    if (!hijri || !gregorianDate) return null

    const hijriDay = hijri.day
    const weekdayIndex = getWeekdayIndex(gregorianDate)
    const { signIndex, nightDuration, positionInSign } = getMoonSign(hijriDay)
    const consensus = getConsensus(hijriDay, signIndex, weekdayIndex, positionInSign)
    const narration = lunarDayNarrations[hijriDay]
    const sign = signs[signIndex]

    // Try sync first
    const syncReading = getReading(hijriDay, signIndex, weekdayIndex)

    return {
      hijriDay,
      weekdayIndex,
      signIndex,
      sign,
      nightDuration,
      positionInSign,
      consensus,
      narration,
      syncReading,
    }
  }, [hijri?.day, hijri?.month, hijri?.year, gregorianDate?.getTime()])

  // Load reading async if sync wasn't available
  useEffect(() => {
    if (!coreData) { setReading(null); return }
    if (coreData.syncReading) { setReading(coreData.syncReading); return }

    getReadingAsync(coreData.hijriDay, coreData.signIndex, coreData.weekdayIndex)
      .then(r => setReading(r))
  }, [coreData?.hijriDay, coreData?.signIndex, coreData?.weekdayIndex])

  if (!coreData) return null

  return {
    ...coreData,
    reading: coreData.syncReading || reading,
  }
}
