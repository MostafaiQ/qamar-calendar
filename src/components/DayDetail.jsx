import { useLocale } from '../i18n/useLocale.jsx'
import { useDayData } from '../hooks/useDayData.js'
import { getWeekdayName } from '../utils/dateHelpers.js'
import months from '../data/monthNames.js'
import SignCard from './SignCard.jsx'
import NarrationCard from './NarrationCard.jsx'
import RulingMatrix from './RulingMatrix.jsx'
import ReadingCard from './ReadingCard.jsx'
import DuaaCard from './DuaaCard.jsx'

export default function DayDetail({ hijri, gregorianDate }) {
  const { lang, t } = useLocale()
  const dayData = useDayData(hijri, gregorianDate)

  if (!dayData || !hijri) return null

  const monthData = months.find(m => m.num === hijri.month) || months[0]
  const monthName = lang === 'ar' ? monthData.ar : monthData.en
  const weekday = getWeekdayName(dayData.weekdayIndex, lang)

  return (
    <div className="space-y-3 p-4">
      {/* Day header */}
      <div className="text-center pb-2 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 font-arabic">
          {hijri.day} {monthName} {hijri.year}
        </h2>
        <p className="text-sm text-gray-500 font-arabic">{weekday}</p>
        <p className="text-xs text-gray-400 mt-1">
          {gregorianDate.toLocaleDateString('en-CA')}
        </p>
      </div>

      <SignCard
        sign={dayData.sign}
        nightDuration={dayData.nightDuration}
        positionInSign={dayData.positionInSign}
      />

      <NarrationCard narration={dayData.narration} />

      <RulingMatrix consensus={dayData.consensus} />

      <ReadingCard reading={dayData.reading} />

      <DuaaCard show={dayData.consensus.showDuaa} />
    </div>
  )
}
