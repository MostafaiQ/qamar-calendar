// Table 1: Moon in Zodiac Sign rulings
// Source: الدروع الواقية - السيد ابن طاووس
// null means neutral/مباح (no specific ruling)
const zodiacRulings = {
  0:  { marriage: null,     travel: null,     building: null,     work: null     }, // Pisces
  1:  { marriage: 'مكروه', travel: 'حسن',   building: 'مكروه', work: 'حسن'   }, // Aries
  2:  { marriage: 'حسن',   travel: null,     building: 'حسن',   work: null     }, // Taurus
  3:  { marriage: 'مكروه', travel: 'حسن',   building: 'حسن',   work: 'مكروه' }, // Gemini
  4:  { marriage: 'مكروه', travel: 'حسن',   building: 'مكروه', work: 'حسن'   }, // Cancer
  5:  { marriage: 'حسن',   travel: null,     building: null,     work: null     }, // Leo
  6:  { marriage: 'حسن',   travel: 'حسن',   building: 'حسن',   work: null     }, // Virgo
  7:  { marriage: 'حسن',   travel: 'حسن',   building: null,     work: null     }, // Libra (position 1 only)
  8:  { marriage: 'مكروه', travel: 'مكروه', building: 'مكروه', work: 'مكروه' }, // Scorpio
  9:  { marriage: 'حسن',   travel: null,     building: 'حسن',   work: null     }, // Sagittarius
  10: { marriage: null,     travel: 'مكروه', building: 'حسن',   work: 'مكروه' }, // Capricorn
  11: { marriage: 'مكروه', travel: 'مكروه', building: 'حسن',   work: null     }, // Aquarius
}

export default zodiacRulings
