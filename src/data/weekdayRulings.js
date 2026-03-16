// Table 2: Day of the Week rulings (أيام الأسبوع)
// Source: مكارم الأخلاق - الشيخ الطبرسي
// Index: 0=Saturday, 1=Sunday, ..., 6=Friday
// null means neutral/مباح
const weekdayRulings = {
  0: { marriage: null,   travel: 'حسن',   building: null,   work: null   }, // Saturday
  1: { marriage: null,   travel: 'حسن',   building: 'حسن', work: null   }, // Sunday
  2: { marriage: null,   travel: 'مكروه', building: null,   work: null   }, // Monday
  3: { marriage: null,   travel: 'حسن',   building: null,   work: null   }, // Tuesday
  4: { marriage: null,   travel: 'مكروه', building: null,   work: null   }, // Wednesday
  5: { marriage: null,   travel: 'حسن',   building: null,   work: null   }, // Thursday
  6: { marriage: 'حسن', travel: 'مكروه', building: null,   work: null   }, // Friday (travel مكروه before noon, conservative)
}

export default weekdayRulings
