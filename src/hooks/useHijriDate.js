import { useState, useEffect } from 'react'
import { resolveHijriDate } from '../engine/hijriResolver.js'

export function useHijriDate(gregorianDate) {
  const [hijri, setHijri] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    resolveHijriDate(gregorianDate).then(result => {
      if (!cancelled) {
        setHijri(result)
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [gregorianDate.getTime()])

  return { hijri, loading }
}
