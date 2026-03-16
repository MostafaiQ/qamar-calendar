// Table 3: Day of the Lunar Month rulings (أيام الشهر القمري)
// Source: مكارم الأخلاق - الشيخ الطبرسي (فقط)
// null means neutral/مباح (not mentioned)
// blanket: applies to all categories uniformly
const lunarDayRulings = {
  // سعيد يصلح للقاء الأمراء وطلب الحوائج والشراء والبيع والزراعة والسفر
  1:  { marriage: null,     travel: 'حسن',   building: null,     work: 'حسن'   },
  // يصلح للسفر وطلب الحوائج
  2:  { marriage: null,     travel: 'حسن',   building: null,     work: null     },
  // رديء لا يصلح لشيء جملة
  3:  { blanket: 'مكروه' },
  // صالح للتزويج ويكره السفر فيه
  4:  { marriage: 'حسن',   travel: 'مكروه', building: null,     work: null     },
  // رديء نحس
  5:  { blanket: 'مكروه' },
  // مبارك يصلح للتزويج وطلب الحوائج
  6:  { marriage: 'حسن',   travel: null,     building: null,     work: null     },
  // مبارك مختار يصلح لكل ما يراد ويسعى فيه
  7:  { blanket: 'حسن' },
  // يصلح لكل حاجة سوى السفر فإنه يكره فيه
  8:  { marriage: 'حسن',   travel: 'مكروه', building: 'حسن',   work: 'حسن'   },
  // مبارك يصلح لكل ما يريد الإنسان ومن سافر فيه رزق مالا
  9:  { blanket: 'حسن' },
  // صالح لكل حاجة... جيد للشراء والبيع
  10: { marriage: null,     travel: null,     building: null,     work: 'حسن'   },
  // يصلح للشراء والبيع وبجميع الحوائج وللسفر
  11: { marriage: null,     travel: 'حسن',   building: null,     work: 'حسن'   },
  // يوم مبارك فاطلبوا فيه حوائجكم
  12: { blanket: 'حسن' },
  // يوم نحس فاتقوا فيه جميع الأعمال
  13: { blanket: 'مكروه' },
  // جيد للحوائج ولكل عمل
  14: { blanket: 'حسن' },
  // صالح لكل حاجة تريدها
  15: { blanket: 'حسن' },
  // رديء مذموم لكل شيء
  16: { blanket: 'مكروه' },
  // صالح مختار... تزوجوا وبيعوا واشتروا وازرعوا وابنوا وادخلوا على السلطان
  17: { blanket: 'حسن' },
  // مختار صالح للسفر وطلب الحوائج
  18: { marriage: null,     travel: 'حسن',   building: null,     work: null     },
  // مختار صالح لكل عمل
  19: { blanket: 'حسن' },
  // جيد مختار للحوائج والسفر والبناء والغرس
  20: { marriage: null,     travel: 'حسن',   building: 'حسن',   work: null     },
  // يوم نحس مستمر
  21: { blanket: 'مكروه' },
  // مختار صالح للشراء والبيع ولقاء السلطان والسفر والصدقة
  22: { marriage: null,     travel: 'حسن',   building: null,     work: 'حسن'   },
  // مختار جيد خاصة للتزويج والتجارات كلها والدخول على السلطان
  23: { marriage: 'حسن',   travel: null,     building: null,     work: 'حسن'   },
  // يوم نحس شوم
  24: { blanket: 'مكروه' },
  // رديء مذموم يحذر فيه من كل شيء
  25: { blanket: 'مكروه' },
  // صالح لكل حاجة سوى التزويج والسفر
  26: { marriage: 'مكروه', travel: 'مكروه', building: 'حسن',   work: 'حسن'   },
  // جيد مختار للحوائج وكل ما يراد به
  27: { blanket: 'حسن' },
  // ممزوج
  28: { marriage: null,     travel: null,     building: null,     work: null     },
  // مختار جيد لكل حاجة ما خلا الكاتب
  29: { marriage: 'حسن',   travel: 'حسن',   building: 'حسن',   work: 'حسن'   },
  // مختار جيد لكل حاجة من شراء وبيع وتزويج
  30: { marriage: 'حسن',   travel: null,     building: null,     work: 'حسن'   },
}

export default lunarDayRulings
