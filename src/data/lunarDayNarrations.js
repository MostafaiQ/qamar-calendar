// 30-day narration from Imam al-Sadiq (as)
// Source: مكارم الأخلاق - الشيخ الطبرسي (فقط)
const lunarDayNarrations = {
  1: {
    storyAr: 'أوَّل يوم من الشهر: سعيد يَصلح للقاء الأمراء وطلب الحوائج والشراء والبيع والزراعة والسفر.',
    storyEn: 'First day of the month: auspicious, suitable for meeting rulers, seeking needs, buying, selling, farming, and travel.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  2: {
    storyAr: 'يَصلح للسفر وطلب الحوائج.',
    storyEn: 'Suitable for travel and seeking needs.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  3: {
    storyAr: 'رديء لا يَصلح لشيء جملةً.',
    storyEn: 'Bad — not suitable for anything at all.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  4: {
    storyAr: 'صالح للتزويج ويُكره السفر فيه.',
    storyEn: 'Good for marriage, but travel is disliked.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  5: {
    storyAr: 'رديء نحس.',
    storyEn: 'Bad — inauspicious.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  6: {
    storyAr: 'مبارك يَصلح للتزويج وطلب الحوائج.',
    storyEn: 'Blessed, suitable for marriage and seeking needs.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  7: {
    storyAr: 'مبارك مختار يَصلح لكلِّ ما يُراد ويُسعى فيه.',
    storyEn: 'Blessed and chosen — suitable for everything one seeks or pursues.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  8: {
    storyAr: 'يَصلح لكلِّ حاجةٍ سوى السفر فإنَّه يُكره فيه.',
    storyEn: 'Suitable for every need except travel, which is disliked.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  9: {
    storyAr: 'مبارك يَصلح لكلِّ ما يريد الإنسان، ومن سافر فيه رُزق مالاً ويرى في سفره كلَّ خيرٍ.',
    storyEn: 'Blessed, suitable for anything one desires. Whoever travels on it will be granted wealth and see every good in their journey.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  10: {
    storyAr: 'صالح لكلِّ حاجةٍ سوى الدخول على السلطان، وهو جيّد للشراء والبيع، ومن مرض فيه برأ.',
    storyEn: 'Good for every need except visiting rulers. Good for buying and selling. Whoever falls ill on it will recover.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  11: {
    storyAr: 'يَصلح للشراء والبيع وبجميع الحوائج وللسفر ما خلا الدخول على السلطان.',
    storyEn: 'Suitable for buying, selling, all needs, and travel, except visiting rulers.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  12: {
    storyAr: 'يوم مبارك فاطلبوا فيه حوائجكم واسعوا لها فإنَّها تُقضى.',
    storyEn: 'A blessed day — seek your needs and pursue them, for they will be fulfilled.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  13: {
    storyAr: 'يوم نحس فاتَّقوا فيه جميع الأعمال.',
    storyEn: 'An inauspicious day — avoid all works.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  14: {
    storyAr: 'جيد للحوائج ولكلِّ عمل.',
    storyEn: 'Good for needs and every work.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  15: {
    storyAr: 'صالح لكلِّ حاجةٍ تريدها فاطلبوا فيه حوائجكم.',
    storyEn: 'Good for any need you desire — seek your needs on it.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  16: {
    storyAr: 'رديء مذموم لكلِّ شيء.',
    storyEn: 'Bad and blameworthy for everything.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  17: {
    storyAr: 'صالح مختار فاطلبوا فيه ما شئتم وتزوَّجوا وبيعوا واشتروا وازرعوا وابنوا وادخلوا على السلطان.',
    storyEn: 'Good and chosen — seek whatever you wish: marry, buy, sell, farm, build, and visit rulers.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  18: {
    storyAr: 'مختار صالح للسفر وطلب الحوائج، ومن خاصم فيه عدوَّه خصمه.',
    storyEn: 'Chosen and good for travel and seeking needs. Whoever disputes with an enemy on it will prevail.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  19: {
    storyAr: 'مختار صالح لكلِّ عمل، ومن ولد فيه يكون مباركاً.',
    storyEn: 'Chosen and good for every work. Whoever is born on it will be blessed.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  20: {
    storyAr: 'جيَّد مختار للحوائج والسفر والبناء والغرس، والدخول على السلطان ويوم مبارك بمشيئة الله.',
    storyEn: 'Good and chosen for needs, travel, building, planting, and visiting rulers. A blessed day by the will of Allah.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  21: {
    storyAr: 'يوم نحسٍ مستمرّ.',
    storyEn: 'A day of continuous misfortune.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  22: {
    storyAr: 'مختار صالح للشراء والبيع ولقاء السلطان والسفر والصدقة.',
    storyEn: 'Chosen and good for buying, selling, meeting rulers, travel, and charity.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  23: {
    storyAr: 'مختار جيَّد خاصَّة للتزويج والتجارات كلّها، والدخول على السلطان.',
    storyEn: 'Chosen and good, especially for marriage, all trades, and visiting rulers.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  24: {
    storyAr: 'يوم نحس شوم.',
    storyEn: 'An inauspicious, ominous day.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  25: {
    storyAr: 'رديء مذموم يحذر فيه من كلِّ شيء.',
    storyEn: 'Bad and blameworthy — beware of everything on it.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  26: {
    storyAr: 'صالح لكلِّ حاجةٍ سوى التزويج والسفر.',
    storyEn: 'Good for every need except marriage and travel.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  27: {
    storyAr: 'جيّد مختار للحوائج وكلِّ ما يُراد به، ولقاء السلطان.',
    storyEn: 'Good and chosen for needs and everything one desires, and for meeting rulers.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  28: {
    storyAr: 'ممزوج.',
    storyEn: 'Mixed.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  29: {
    storyAr: 'مختار جيّد لكلِّ حاجةٍ ما خلا الكاتب.',
    storyEn: 'Chosen and good for every need except writing (contracts).',
    source: 'مكارم الأخلاق - الطبرسي',
  },
  30: {
    storyAr: 'مختار جيّد لكلِّ حاجةٍ من شراء وبيع وتزويج.',
    storyEn: 'Chosen and good for every need including buying, selling, and marriage.',
    source: 'مكارم الأخلاق - الطبرسي',
  },
}

export default lunarDayNarrations
