// Table 3: Day of the Lunar Month rulings
// Source: الدروع الواقية / مكارم الأخلاق
// null means neutral/مباح
// blanket: applies to all categories uniformly
const lunarDayRulings = {
  1:  { marriage: 'حسن',   travel: 'حسن',   building: null,     work: null     },
  2:  { marriage: 'حسن',   travel: 'حسن',   building: 'حسن',   work: 'حسن'   },
  3:  { blanket: 'مكروه' },
  4:  { marriage: 'حسن',   travel: 'مكروه', building: 'حسن',   work: null     },
  5:  { blanket: 'مكروه' },
  6:  { marriage: 'حسن',   travel: 'حسن',   building: null,     work: null     },
  7:  { blanket: 'حسن' },
  8:  { marriage: null,     travel: 'مكروه', building: null,     work: null     },
  9:  { blanket: 'حسن' },
  10: { marriage: null,     travel: 'حسن',   building: null,     work: null     },
  11: { marriage: null,     travel: 'حسن',   building: null,     work: 'حسن'   },
  12: { marriage: 'حسن',   travel: 'حسن',   building: 'حسن',   work: 'حسن'   },
  13: { blanket: 'مكروه' },
  14: { blanket: 'حسن' },
  15: { marriage: 'حسن',   travel: 'حسن',   building: null,     work: 'حسن'   },
  16: { marriage: 'مكروه', travel: 'مكروه', building: 'حسن',   work: 'مكروه' },
  17: { marriage: 'حسن',   travel: 'حسن',   building: null,     work: null     },
  18: { blanket: 'حسن' },
  19: { blanket: 'حسن' },
  20: { marriage: null,     travel: 'حسن',   building: 'حسن',   work: null     },
  21: { blanket: 'مكروه' },
  22: { marriage: null,     travel: 'حسن',   building: null,     work: null     },
  23: { blanket: 'حسن' },
  24: { blanket: 'مكروه' },
  25: { blanket: 'مكروه' },
  26: { marriage: 'مكروه', travel: 'مكروه', building: null,     work: null     },
  27: { blanket: 'حسن' },
  28: { marriage: null,     travel: 'حسن',   building: null,     work: null     },
  29: { marriage: null,     travel: 'حسن',   building: 'حسن',   work: 'حسن'   },
  30: { marriage: 'حسن',   travel: 'مكروه', building: 'حسن',   work: 'حسن'   },
}

export default lunarDayRulings
