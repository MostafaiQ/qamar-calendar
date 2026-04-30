import { useMemo, useState, useEffect } from 'react'
import { getMoonSign } from '../engine/moonSign.js'
import { getConsensus } from '../engine/consensus.js'
import { getReading, getReadingAsync } from '../engine/reading.js'
import lunarDayNarrations from '../data/lunarDayNarrations.js'
import lunarDayRulings from '../data/lunarDayRulings.js'
import zodiacRulings from '../data/zodiacRulings.js'
import weekdayRulings from '../data/weekdayRulings.js'
import signs from '../data/signMeta.js'
import { getWeekdayIndex } from '../utils/dateHelpers.js'

export function useDayData(hijri, gregorianDate) {
  const [reading, setReading] = useState(null)

  const coreData = useMemo(() => {
    if (!hijri || !gregorianDate) return null

    const hijriDay = hijri.day
    const weekdayIndex = getWeekdayIndex(gregorianDate)
    const { signIndex, nightDuration, positionInSign } = getMoonSign(hijriDay, gregorianDate)
    const consensus = getConsensus(hijriDay, signIndex, weekdayIndex, positionInSign)
    const narration = lunarDayNarrations[hijriDay]
    const sign = signs[signIndex]

    // Individual source rulings (for showing per-source breakdown)
    const lunarRuling = lunarDayRulings[hijriDay] || {}
    const signRuling = signIndex === 7 && positionInSign > 1
      ? { marriage: 'مكروه', travel: 'مكروه', building: 'مكروه', work: 'مكروه' }
      : (zodiacRulings[signIndex] || {})
    const weekRuling = weekdayRulings[weekdayIndex] || {}

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
      lunarRuling,
      signRuling,
      weekRuling,
    }
  }, [hijri?.day, hijri?.month, hijri?.year, gregorianDate?.getTime()])

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
