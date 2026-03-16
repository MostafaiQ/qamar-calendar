// 30-day narration from Imam al-Sadiq (as) via Yunus ibn Thibyan
// Sources: الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي / بحار الأنوار - المجلسي
const lunarDayNarrations = {
  1: {
    storyAr: 'يوم مبارك خلق الله فيه آدم عليه السلام وهو يوم محمود لطلب الحوائج والدخول على السلطان ولطلب العلم والتزويج والسفر والبيع والشراء واتخاذ الماشية.',
    storyEn: 'A blessed day on which Allah created Adam (as). It is a praiseworthy day for seeking needs, visiting rulers, seeking knowledge, marriage, travel, buying and selling, and acquiring livestock.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  2: {
    storyAr: 'يوم صالح خلقت فيه حواء وهو يوم مبارك تُقضى فيه الحوائج ويصلح للتزويج والسفر والبيع والشراء والبناء وابتداء الأعمال وهو يوم خفيف.',
    storyEn: 'A good day on which Eve was created. It is a blessed day where needs are fulfilled. It is suitable for marriage, travel, buying and selling, building, and starting new endeavors.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  3: {
    storyAr: 'يوم نحس مستمر فاتق فيه السلطان والبيع والشراء وطلب الحوائج ولا تتعرض فيه لمعاملة ولا تشارك فيه أحداً وفيه سُلب آدم وحواء لباسهما وأُخرجا من الجنة واجعل شغلك صلاح أمر منزلك وإن أمكنك أن لا تخرج من دارك فافعل.',
    storyEn: 'A day of continuous misfortune. Avoid rulers, buying and selling, and seeking needs. Do not engage in any transactions or partnerships. On this day, Adam and Eve were stripped of their garments and expelled from Paradise. Occupy yourself with fixing your household affairs, and if possible, do not leave your home.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  4: {
    storyAr: 'ولد فيه شيث بن آدم عليه السلام وهو يوم صالح للتزويج والبناء وغرس الأشجار وزراعة الأرض ولا تسافر فيه فإنه مكروه.',
    storyEn: 'Seth son of Adam (as) was born on this day. It is a good day for marriage, building, planting trees, and farming. Do not travel on this day as it is disliked.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  5: {
    storyAr: 'ولد فيه قابيل الشقي وفيه قتل أخاه هابيل وهو نحس مستمر فلا تبتدئ فيه بعمل وتعاهد من في منزلك وانظر في إصلاح الماشية.',
    storyEn: 'The wretched Cain was born on this day, and on it he killed his brother Abel. It is a day of continuous misfortune. Do not start any work. Look after your household and tend to your livestock.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  6: {
    storyAr: 'يوم صالح ولد فيه نوح عليه السلام وهو يوم مبارك تُقضى فيه الحوائج ويصلح للدخول على السلطان والتزويج والسفر وطلب العلم.',
    storyEn: 'A good day on which Noah (as) was born. It is a blessed day where needs are fulfilled. It is suitable for visiting rulers, marriage, travel, and seeking knowledge.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  7: {
    storyAr: 'يوم سعيد حسن لجميع الأعمال ولد فيه موسى بن عمران عليه السلام وهو يوم صالح للتزويج والسفر والبيع والشراء والبناء وابتداء الأعمال ولقاء السلطان.',
    storyEn: 'A felicitous and good day for all endeavors. Moses son of Imran (as) was born on this day. It is suitable for marriage, travel, buying and selling, building, starting work, and meeting rulers.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  8: {
    storyAr: 'يوم أُلقي فيه إبراهيم عليه السلام في النار فجعلها الله عليه برداً وسلاماً وهو يوم صالح ولا تسافر فيه.',
    storyEn: 'On this day, Abraham (as) was thrown into the fire, and Allah made it cool and peaceful for him. It is a good day, but do not travel on it.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  9: {
    storyAr: 'يوم سعيد حسن لجميع الأعمال وفيه أنزل الله التوراة على موسى عليه السلام وهو يوم مبارك يصلح للتزويج والسفر والبيع والشراء والبناء وابتداء كل عمل.',
    storyEn: 'A felicitous and good day for all endeavors. On this day Allah revealed the Torah to Moses (as). It is a blessed day suitable for marriage, travel, buying and selling, building, and starting any work.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  10: {
    storyAr: 'يوم صالح يُطلب فيه الحوائج وهو يوم السفر والدخول على السلطان وفيه غرق فرعون وجنوده.',
    storyEn: 'A good day for seeking needs. It is a day for travel and visiting rulers. On this day, Pharaoh and his soldiers were drowned.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  11: {
    storyAr: 'يوم صالح يصلح للسفر وابتداء الأعمال والتجارة وفيه أنزل الله الإنجيل على عيسى بن مريم عليه السلام.',
    storyEn: 'A good day suitable for travel, starting work, and trade. On this day Allah revealed the Gospel to Jesus son of Mary (as).',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  12: {
    storyAr: 'يوم مبارك سعيد حسن لجميع الأعمال من سفر وتزويج وبناء وبيع وشراء وابتداء الأعمال وفيه رُفع إدريس عليه السلام مكاناً علياً.',
    storyEn: 'A blessed and felicitous day, good for all endeavors including travel, marriage, building, buying and selling, and starting work. On this day, Idris (as) was raised to a lofty station.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  13: {
    storyAr: 'يوم نحس مستمر لا تبتدئ فيه بعمل ولا تسافر فيه ولا تتزوج واحفظ نفسك فيه وتصدق لدفع النحس.',
    storyEn: 'A day of continuous misfortune. Do not start any work, travel, or marry. Guard yourself and give charity to ward off misfortune.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  14: {
    storyAr: 'يوم سعيد حسن لجميع الأعمال وهو يوم نزول القرآن الكريم على النبي محمد صلى الله عليه وآله وفيه تتبرك بالذكر والصدقة.',
    storyEn: 'A felicitous and good day for all endeavors. It is the day the Holy Quran was revealed to the Prophet Muhammad (pbuh). Seek blessings through remembrance and charity.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  15: {
    storyAr: 'يوم صالح ولد فيه الإمام الحسن بن علي عليهما السلام في رمضان وهو يوم مبارك يصلح للتزويج والسفر وابتداء الأعمال وطلب الحوائج.',
    storyEn: 'A good day. Imam al-Hasan ibn Ali (as) was born on this day in Ramadan. It is a blessed day suitable for marriage, travel, starting work, and seeking needs.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  16: {
    storyAr: 'يوم مكروه فيه أكثر الأمور لا يصلح للتزويج ولا للسفر ولا لابتداء الأعمال ويصلح للبناء فقط.',
    storyEn: 'A disliked day for most matters. It is not suitable for marriage, travel, or starting work. It is only suitable for building.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  17: {
    storyAr: 'يوم صالح التقى فيه أصحاب الفيل بالطير الأبابيل وهو يوم مبارك يصلح للتزويج والسفر وطلب الحوائج.',
    storyEn: 'A good day on which the People of the Elephant were met by the birds (Ababil). It is a blessed day suitable for marriage, travel, and seeking needs.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  18: {
    storyAr: 'يوم سعيد حسن لجميع الأعمال ولد فيه إبراهيم خليل الرحمن عليه السلام وهو يوم مبارك يصلح لكل أمر.',
    storyEn: 'A felicitous and good day for all endeavors. Abraham, the Friend of the Most Merciful (as), was born on this day. It is a blessed day suitable for every matter.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  19: {
    storyAr: 'يوم سعيد حسن لجميع الأعمال يصلح للتزويج والسفر والبيع والشراء والبناء وابتداء كل عمل جديد.',
    storyEn: 'A felicitous and good day for all endeavors. Suitable for marriage, travel, buying and selling, building, and starting any new work.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  20: {
    storyAr: 'يوم صالح للسفر والبناء ويُطلب فيه الحوائج من ذوي السلطان وفيه كلّم الله موسى تكليماً.',
    storyEn: 'A good day for travel and building. Seek needs from those in authority. On this day, Allah spoke directly to Moses.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  21: {
    storyAr: 'يوم نحس مستمر فيه وُلد فرعون واحذر فيه من كل شيء ولا تبتدئ فيه بعمل ولا تسافر ولا تتزوج وتصدق لدفع البلاء.',
    storyEn: 'A day of continuous misfortune. Pharaoh was born on this day. Beware of everything. Do not start any work, travel, or marry. Give charity to ward off calamity.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  22: {
    storyAr: 'يوم صالح وفيه وُلد يونس بن متّى عليه السلام وهو يوم يصلح للسفر وطلب الحوائج.',
    storyEn: 'A good day. Jonah son of Matta (as) was born on this day. It is suitable for travel and seeking needs.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  23: {
    storyAr: 'يوم صالح ولد فيه يوسف عليه السلام وهو يوم خفيف تُطلب فيه الحوائج والتجارة والتزويج والدخول على السلطان ومن سافر فيه غنم وأصاب خيراً.',
    storyEn: 'A good day on which Joseph (as) was born. It is a light day for seeking needs, trade, marriage, and visiting rulers. Whoever travels on it will profit and find goodness.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  24: {
    storyAr: 'يوم نحس مستمر وهو يوم ثقيل لا تبتدئ فيه بعمل ولا تتعرض لشيء واحفظ نفسك ومالك فيه.',
    storyEn: 'A day of continuous misfortune. It is a heavy day. Do not start any work or engage in anything. Guard yourself and your property.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  25: {
    storyAr: 'يوم نحس مستمر وفيه أُهبط آدم عليه السلام من الجنة فلا تبتدئ فيه بعمل ولا تسافر ولا تتزوج.',
    storyEn: 'A day of continuous misfortune. On this day Adam (as) was sent down from Paradise. Do not start any work, travel, or marry.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  26: {
    storyAr: 'ضرب فيه موسى عليه السلام بعصاه البحر فانفلق وهو يوم يصلح للسفر ولكل أمر يُراد إلا التزويج فإنه من تزوج فيه فُرق بينهما ولا تدخل إذا وردت من سفرك فيه إلى أهلك.',
    storyEn: 'On this day Moses (as) struck the sea with his staff and it parted. It is a day suitable for travel and every endeavor except marriage, for whoever marries on it will be separated. Do not return to your family if you arrive from travel on this day.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  27: {
    storyAr: 'يوم سعيد حسن لجميع الأعمال بُعث فيه محمد صلى الله عليه وآله وهو يوم مبارك يصلح للتزويج والسفر والبناء وابتداء كل عمل.',
    storyEn: 'A felicitous and good day for all endeavors. The Prophet Muhammad (pbuh) was sent as a messenger on this day. It is a blessed day suitable for marriage, travel, building, and starting any work.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  28: {
    storyAr: 'يوم صالح يصلح للسفر وطلب الحوائج والدخول على السلطان.',
    storyEn: 'A good day suitable for travel, seeking needs, and visiting rulers.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  29: {
    storyAr: 'يوم صالح يصلح للسفر والبناء وابتداء الأعمال والبيع والشراء وطلب الحوائج.',
    storyEn: 'A good day suitable for travel, building, starting work, buying and selling, and seeking needs.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
  30: {
    storyAr: 'يوم صالح يصلح للتزويج والبناء وابتداء الأعمال ولا تسافر فيه فإن السفر فيه مكروه.',
    storyEn: 'A good day suitable for marriage, building, and starting work. Do not travel on it as travel is disliked.',
    source: 'الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي',
  },
}

export default lunarDayNarrations
