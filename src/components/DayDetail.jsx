import { useLocale } from '../i18n/useLocale.jsx'
import { useDayData } from '../hooks/useDayData.js'
import { getWeekdayName } from '../utils/dateHelpers.js'
import months from '../data/monthNames.js'
import DreamCard from './DreamCard.jsx'
import DuaaCard from './DuaaCard.jsx'

const catLabels = {
  ar: { marriage: 'الزواج', travel: 'السفر', building: 'البناء', work: 'الأعمال' },
  en: { marriage: 'Marriage', travel: 'Travel', building: 'Building', work: 'Work' },
}

function RulingDot({ value }) {
  if (!value || value === 'مباح') return <span className="text-gray-400 dark:text-gray-500 text-xs">—</span>
  if (value === 'حسن') return <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
  if (value === 'مكروه') return <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
  return null
}

function RulingLabel({ value, lang }) {
  if (!value) return <span className="text-gray-400 dark:text-gray-500 text-xs font-arabic">—</span>
  if (value === 'حسن') return <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold font-arabic">{lang === 'ar' ? 'حسن' : 'Good'}</span>
  if (value === 'مكروه') return <span className="text-rose-600 dark:text-rose-400 text-xs font-semibold font-arabic">{lang === 'ar' ? 'مكروه' : 'Disliked'}</span>
  return <span className="text-gray-400 dark:text-gray-500 text-xs font-arabic">—</span>
}

function OverallBadge({ overall, lang }) {
  const styles = {
    good: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700',
    bad: 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-700',
    mixed: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700',
    neutral: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  }
  const labels = {
    ar: { good: 'يوم حسن', bad: 'يوم مكروه', mixed: 'يوم ممزوج', neutral: 'يوم عادي' },
    en: { good: 'Good Day', bad: 'Disliked Day', mixed: 'Mixed Day', neutral: 'Neutral Day' },
  }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border font-arabic ${styles[overall]}`}>
      {labels[lang][overall]}
    </span>
  )
}

function SectionTitle({ children, number }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {number && (
        <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-gray-400">
          {number}
        </span>
      )}
      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 font-arabic">{children}</h3>
    </div>
  )
}

function SourceRulingRow({ label, ruling, lang, isBlanket, blanketValue }) {
  const cats = ['marriage', 'travel', 'building', 'work']
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 font-arabic">{label}</p>
      {isBlanket ? (
        <div className="flex items-center gap-2">
          <RulingDot value={blanketValue} />
          <RulingLabel value={blanketValue} lang={lang} />
          <span className="text-xs text-gray-400 dark:text-gray-500 font-arabic">
            {lang === 'ar' ? 'لجميع الأمور' : 'for all matters'}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {cats.map(cat => (
            <div key={cat} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-arabic">{catLabels[lang][cat]}</span>
              <RulingDot value={ruling[cat]} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DayDetail({ hijri, gregorianDate }) {
  const { lang, t } = useLocale()
  const dayData = useDayData(hijri, gregorianDate)

  if (!dayData || !hijri) return null

  const monthData = months.find(m => m.num === hijri.month) || months[0]
  const monthName = lang === 'ar' ? `شهر ${monthData.ar}` : monthData.en
  const weekday = getWeekdayName(dayData.weekdayIndex, lang)
  const signName = lang === 'ar' ? dayData.sign?.ar : dayData.sign?.en
  const cats = ['marriage', 'travel', 'building', 'work']

  const isLunarBlanket = !!dayData.lunarRuling.blanket

  return (
    <div className="space-y-4 p-4">
      {/* ═══ HEADER: Date + Overall Verdict ═══ */}
      <div className="text-center pb-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 font-arabic">
          {hijri.day} {monthName} {hijri.year}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic mb-2">{weekday} — {gregorianDate.toLocaleDateString('en-CA')}</p>
        <OverallBadge overall={dayData.consensus.overall} lang={lang} />
      </div>

      {/* ═══ 1. LUNAR DAY: حكم اليوم من الشهر ═══ */}
      <div>
        <SectionTitle number="١">
          {lang === 'ar' ? `حكم اليوم ${hijri.day} من الشهر القمري` : `Day ${hijri.day} of the Lunar Month`}
        </SectionTitle>
        <div className="bg-amber-50 dark:bg-amber-950 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-arabic mb-2">
            {lang === 'ar' ? dayData.narration?.storyAr : dayData.narration?.storyEn}
          </p>
          <p className="text-[10px] text-amber-500 dark:text-amber-600 font-arabic">{dayData.narration?.source}</p>
        </div>
        <div className="mt-2">
          <SourceRulingRow
            label={lang === 'ar' ? `حكم اليوم ${hijri.day}` : `Day ${hijri.day} ruling`}
            ruling={dayData.lunarRuling}
            lang={lang}
            isBlanket={isLunarBlanket}
            blanketValue={dayData.lunarRuling.blanket}
          />
        </div>
      </div>

      {/* ═══ 2. WEEKDAY: حكم يوم الأسبوع ═══ */}
      <div>
        <SectionTitle number="٢">
          {lang === 'ar' ? `حكم يوم ${weekday}` : `${weekday} Ruling`}
        </SectionTitle>
        <SourceRulingRow
          label={lang === 'ar' ? `يوم ${weekday}` : weekday}
          ruling={dayData.weekRuling}
          lang={lang}
        />
      </div>

      {/* ═══ 3. ZODIAC: حكم القمر في البرج ═══ */}
      <div>
        <SectionTitle number="٣">
          {lang === 'ar' ? `القمر في برج ${signName}` : `Moon in ${signName}`}
        </SectionTitle>
        <div className="bg-indigo-50 dark:bg-indigo-950 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{dayData.sign?.emoji}</span>
            <div>
              <p className="font-semibold text-indigo-900 dark:text-indigo-200 text-sm font-arabic">{signName}</p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-arabic">
                {t('night')} {dayData.positionInSign} {t('of')} {dayData.nightDuration}
              </p>
            </div>
            <div className="flex gap-1 mr-auto">
              {Array.from({ length: dayData.nightDuration }, (_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < dayData.positionInSign ? 'bg-indigo-500' : 'bg-indigo-200 dark:bg-indigo-700'}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <SourceRulingRow
            label={lang === 'ar' ? `حكم برج ${signName}` : `${signName} ruling`}
            ruling={dayData.signRuling}
            lang={lang}
          />
        </div>
      </div>

      {/* ═══ COMBINED: الحكم النهائي ═══ */}
      <div>
        <SectionTitle>
          {lang === 'ar' ? 'الحكم النهائي (المحصّلة)' : 'Final Ruling (Combined)'}
        </SectionTitle>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {cats.map(cat => {
            const value = dayData.consensus[cat]
            const bgMap = { 'حسن': 'bg-emerald-50 dark:bg-emerald-950/40', 'مكروه': 'bg-rose-50 dark:bg-rose-950/40', 'مباح': '' }
            return (
              <div key={cat} className={`flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0 ${bgMap[value] || ''}`}>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic">{catLabels[lang][cat]}</span>
                <div className="flex items-center gap-2">
                  <RulingDot value={value} />
                  <RulingLabel value={value} lang={lang} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ═══ READING: قراءة اليوم ═══ */}
      {dayData.reading && (
        <div className="bg-sky-50 dark:bg-sky-950 rounded-xl p-4 border border-sky-100 dark:border-sky-800">
          <h3 className="text-sm font-bold text-sky-800 dark:text-sky-300 mb-2 font-arabic">
            {t('reading')}
          </h3>
          <p className="text-sm text-sky-900 dark:text-sky-200 leading-relaxed font-arabic">
            {lang === 'ar' ? dayData.reading.ar : dayData.reading.en}
          </p>
        </div>
      )}

      {/* ═══ DREAM: تعبير الرؤيا ═══ */}
      <DreamCard hijriDay={hijri.day} />

      {/* ═══ DUAA: دعاء التحصين ═══ */}
      <DuaaCard show={dayData.consensus.showDuaa} />
    </div>
  )
}
