import { useState, useEffect } from 'react'
import { toHijri } from 'hijri-converter'

export function useHijriDate(gregorianDate) {
  const [hijri, setHijri] = useState(() => {
    // Compute synchronously for instant render
    const adjustment = parseInt(localStorage.getItem('hijriAdjustment') || '0')
    try {
      const { hy, hm, hd } = toHijri(
        gregorianDate.getFullYear(),
        gregorianDate.getMonth() + 1,
        gregorianDate.getDate()
      )
      let day = hd + adjustment
      let month = hm
      let year = hy
      if (day < 1) { month--; day += 30 }
      if (day > 30) { month++; day -= 30 }
      if (month < 1) { year--; month = 12 }
      if (month > 12) { year++; month = 1 }
      return { year, month, day, source: 'local' }
    } catch (e) {
      return { year: 1447, month: 1, day: 1, source: 'fallback' }
    }
  })

  return { hijri, loading: false }
}
