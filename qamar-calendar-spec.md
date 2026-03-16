# qamar-calendar - Full Project Specification

## Project Name
`qamar-calendar` (تقويم القمر)

## What It Is
A bilingual (Arabic default / English toggle) web calendar app that shows:
- The current Shia Hijri date (with automated Sistani-aligned month-start corrections)
- Which zodiac sign the moon is in (calculated from the Hijri day)
- How many nights the moon stays in that sign (2 or 3)
- A 4-category ruling matrix (marriage, travel, building, starting work) based on 3 cross-referenced hadith tables
- A pre-composed daily reading combining prophetic narration + rulings into a coherent, non-contradictory paragraph
- A protection duaa on days with مكروه rulings

## Stack
- React 19 + Vite 7 + Tailwind CSS 3
- `hijri-converter` npm package (local fallback)
- AlAdhan API (remote, Jafari method)
- Deployed to GitHub Pages via GitHub Actions
- Automated Hijri month-start scraping via GitHub Actions cron

---

## Core Calculation: Moon Sign from Hijri Day

```
Input: hijriDay (1-30)

1. n = hijriDay * 2 + 5
2. quotient = floor(n / 5)
3. remainder = n % 5
4. if remainder === 0: remainder = 5 (wraps, because we divide by 5)
5. totalDistributions = (remainder === 5) ? quotient : quotient + 1
6. signIndex = totalDistributions % 12
   - 0 = Pisces (الحوت)
   - 1 = Aries (الحمل)
   - 2 = Taurus (الثور)
   - 3 = Gemini (الجوزاء)
   - 4 = Cancer (السرطان)
   - 5 = Leo (الأسد)
   - 6 = Virgo (السنبلة)
   - 7 = Libra (الميزان)
   - 8 = Scorpio (العقرب)
   - 9 = Sagittarius (القوس)
   - 10 = Capricorn (الجدي)
   - 11 = Aquarius (الدلو)
7. nightDuration = (remainder is even: 2,4) ? 2 : (remainder is odd: 1,3,5) ? 3
8. positionInSign = remainder (which night the moon is on within this sign)
```

### Verification Table (first 15 days)

| Day | n  | Q  | R | R adj | TotalDist | Sign# | Sign      | Nights | Position |
|-----|----|----|---|-------|-----------|-------|-----------|--------|----------|
| 1   | 7  | 1  | 2 | 2     | 2         | 2     | Taurus    | 2      | 1 of 2   |
| 2   | 9  | 1  | 4 | 4     | 2         | 2     | Taurus    | 2      | 2 of 2   |
| 3   | 11 | 2  | 1 | 1     | 3         | 3     | Gemini    | 3      | 1 of 3   |
| 4   | 13 | 2  | 3 | 3     | 3         | 3     | Gemini    | 3      | 2 of 3   |
| 5   | 15 | 3  | 0 | 5     | 3         | 3     | Gemini    | 3      | 3 of 3   |
| 6   | 17 | 3  | 2 | 2     | 4         | 4     | Cancer    | 2      | 1 of 2   |
| 7   | 19 | 3  | 4 | 4     | 4         | 4     | Cancer    | 2      | 2 of 2   |
| 8   | 21 | 4  | 1 | 1     | 5         | 5     | Leo       | 3      | 1 of 3   |
| 9   | 23 | 4  | 3 | 3     | 5         | 5     | Leo       | 3      | 2 of 3   |
| 10  | 25 | 5  | 0 | 5     | 5         | 5     | Leo       | 3      | 3 of 3   |
| 11  | 27 | 5  | 2 | 2     | 6         | 6     | Virgo     | 2      | 1 of 2   |
| 12  | 29 | 5  | 4 | 4     | 6         | 6     | Virgo     | 2      | 2 of 2   |
| 13  | 31 | 6  | 1 | 1     | 7         | 7     | Libra     | 3      | 1 of 3   |
| 14  | 33 | 6  | 3 | 3     | 7         | 7     | Libra     | 3      | 2 of 3   |
| 15  | 35 | 7  | 0 | 5     | 7         | 7     | Libra     | 3      | 3 of 3   |

Pattern: 2, 3, 2, 3, 2, 3... nights, cycling through all 12 signs in 30 days.

---

## Ruling Tables (from hadith sources)

### Table 1: Moon in Zodiac Sign (القمر في البروج)
Source: الدروع الواقية - السيد ابن طاووس / Photo 2 (image 2)

| # | Sign (AR)  | Sign (EN)   | الزواج  | السفر  | البناء  | ابتداء الأعمال |
|---|-----------|-------------|---------|--------|---------|---------------|
| 1 | الحمل     | Aries       | مكروه   | حسن    | مكروه   | حسن           |
| 2 | الثور     | Taurus      | حسن     | -      | حسن     | -             |
| 3 | الجوزاء   | Gemini      | مكروه   | حسن    | حسن     | مكروه         |
| 4 | السرطان   | Cancer      | مكروه   | حسن    | مكروه   | حسن           |
| 5 | الأسد     | Leo         | حسن     | -      | -       | -             |
| 6 | السنبلة   | Virgo       | حسن     | حسن    | حسن     | -             |
| 7 | الميزان   | Libra       | NOTE: first 1.5 days travel+marriage+some affairs are حسن, after that all مكروه |
| 8 | العقرب    | Scorpio     | مكروه   | مكروه  | مكروه   | مكروه         |
| 9 | القوس     | Sagittarius | حسن     | -      | حسن     | -             |
| 10| الجدي     | Capricorn   | -       | مكروه  | حسن     | مكروه         |
| 11| الدلو     | Aquarius    | مكروه   | مكروه  | حسن     | -             |
| 12| الحوت     | Pisces      | -       | -      | -       | -             |

NOTE on Libra (الميزان): Special rule. For simplicity in code, treat position 1 of 3 as حسن for marriage+travel, positions 2-3 as مكروه for all.
NOTE on Aquarius (الدلو): الانتقال والتحويل مكروه (transfers and changes are مكروه).
NOTE: "-" means no specific ruling (neutral/مباح).

### Table 2: Day of the Week (أيام الأسبوع)
Source: Photo 2 (image 2)

| Day (AR)   | Day (EN)   | الزواج | السفر  | البناء | ابتداء الأعمال |
|-----------|-----------|--------|--------|--------|---------------|
| السبت     | Saturday  | -      | حسن    | -      | -             |
| الأحد     | Sunday    | -      | حسن    | حسن    | -             |
| الإثنين   | Monday    | -      | مكروه  | -      | -             |
| الثلاثاء  | Tuesday   | -      | حسن    | -      | -             |
| الأربعاء  | Wednesday | -      | مكروه  | -      | -             |
| الخميس    | Thursday  | -      | حسن    | -      | -             |
| الجمعة    | Friday    | حسن    | قبل الظهر مكروه | -  | -             |

NOTE on Friday travel: مكروه before noon only. For simplicity, mark as مكروه (conservative).

### Table 3: Day of the Lunar Month (أيام الشهر القمري)
Source: Photo 1 (image 1)

Format: each day is either a per-category ruling OR a blanket ruling.

| Day | Rule |
|-----|------|
| 1   | الزواج: حسن, السفر: حسن, البناء: -, ابتداء الأعمال: - |
| 2   | الزواج: حسن, السفر: حسن, البناء: حسن, ابتداء الأعمال: حسن |
| 3   | مكروه لكل الأمور |
| 4   | الزواج: حسن, السفر: مكروه, البناء: حسن, ابتداء الأعمال: - |
| 5   | مكروه لكل الأمور |
| 6   | الزواج: حسن, السفر: حسن, البناء: -, ابتداء الأعمال: - |
| 7   | حسن لكل الأمور |
| 8   | الزواج: -, السفر: مكروه, البناء: -, ابتداء الأعمال: - |
| 9   | حسن لكل الأمور |
| 10  | الزواج: -, السفر: حسن, البناء: -, ابتداء الأعمال: - |
| 11  | الزواج: -, السفر: حسن, البناء: -, ابتداء الأعمال: حسن |
| 12  | الزواج: حسن, السفر: حسن, البناء: حسن, ابتداء الأعمال: حسن |
| 13  | مكروه لكل الأمور |
| 14  | حسن لكل الأمور |
| 15  | الزواج: حسن, السفر: حسن, البناء: -, ابتداء الأعمال: حسن |
| 16  | الزواج: مكروه, السفر: مكروه, البناء: حسن, ابتداء الأعمال: مكروه |
| 17  | الزواج: حسن, السفر: حسن, البناء: -, ابتداء الأعمال: - |
| 18  | حسن لكل الأمور |
| 19  | حسن لكل الأمور |
| 20  | الزواج: -, السفر: حسن, البناء: حسن, ابتداء الأعمال: - |
| 21  | مكروه لكل الأمور |
| 22  | الزواج: -, السفر: حسن, البناء: -, ابتداء الأعمال: - |
| 23  | حسن لكل الأمور |
| 24  | مكروه لكل الأمور |
| 25  | مكروه لكل الأمور |
| 26  | الزواج: مكروه, السفر: مكروه, البناء: -, ابتداء الأعمال: - |
| 27  | حسن لكل الأمور |
| 28* | الزواج: -, السفر: حسن, البناء: -, ابتداء الأعمال: - |
| 29* | الزواج: -, السفر: حسن, البناء: حسن, ابتداء الأعمال: حسن |
| 30* | الزواج: حسن, السفر: مكروه, البناء: حسن, ابتداء الأعمال: حسن |

* Days 28-30: Footnote says when moon is in المحاق (dark moon / last 2 days), travel and marriage are مكروه per a separate narration. The last 2 days of the month are 29+30 or 28+29 depending on month length.

---

## Consensus Logic

```
function getConsensus(hijriDay, signIndex, weekday, positionInSign) {
  const categories = ['marriage', 'travel', 'building', 'work'];
  const lunarDay = lunarDayRulings[hijriDay];
  const sign = zodiacRulings[signIndex];
  const week = weekdayRulings[weekday];

  // Special case: blanket lunar day ruling
  if (lunarDay.blanket === 'مكروه') {
    return { marriage: 'مكروه', travel: 'مكروه', building: 'مكروه', work: 'مكروه', overall: 'bad' };
  }
  if (lunarDay.blanket === 'حسن') {
    // Still check other tables - حسن baseline but مكروه from sign/weekday overrides
  }

  // Special case: Libra position rule
  let signRuling = sign;
  if (signIndex === 7 && positionInSign > 1) {
    // Libra after first night: all مكروه
    signRuling = { marriage: 'مكروه', travel: 'مكروه', building: 'مكروه', work: 'مكروه' };
  }

  // Per category: مكروه wins over everything
  const result = {};
  for (const cat of categories) {
    const sources = [
      lunarDay.blanket === 'حسن' ? 'حسن' : (lunarDay[cat] || null),
      signRuling[cat] || null,
      week[cat] || null
    ].filter(s => s !== null && s !== '-');

    if (sources.includes('مكروه')) {
      result[cat] = 'مكروه';
    } else if (sources.includes('حسن')) {
      result[cat] = 'حسن';
    } else {
      result[cat] = 'مباح'; // no opinion from any source
    }
  }

  // Overall verdict
  const values = Object.values(result);
  if (values.every(v => v === 'حسن')) result.overall = 'good';
  else if (values.every(v => v === 'مكروه')) result.overall = 'bad';
  else if (values.some(v => v === 'مكروه')) result.overall = 'mixed';
  else result.overall = 'neutral';

  // Show duaa if any مكروه
  result.showDuaa = values.includes('مكروه');

  return result;
}
```

---

## Hadith Sources for Daily Narrations

### Primary Sources (ALL Shia)

1. **الدروع الواقية** - السيد ابن طاووس
   - The main source. Contains the 3 tables (zodiac, weekday, lunar day) plus the full 30-day narration from Imam al-Sadiq (as) via Yunus ibn Thibyan with prophetic stories.

2. **مكارم الأخلاق** - الشيخ الطبرسي
   - Contains both versions of the 30-day narration from Imam al-Sadiq (as):
     - Short version: brief per-day category rulings
     - Long version (via Yunus ibn Thibyan): includes which prophet was born, what historical event occurred, detailed guidance

3. **بحار الأنوار** - العلامة المجلسي
   - Compiles both narrations from the above sources + additional chains

4. **الكافي** - الشيخ الكليني
   - Supporting hadith on اختيارات الأيام (day selection)

5. **وسائل الشيعة** - الحر العاملي
   - Chapter on recommended/disliked days for travel, marriage, etc.

6. **مستدرك الوسائل** - الميرزا النوري
   - Additional chains for the same narrations

### The 30-Day Narration Data

Each day includes (from the long version via Yunus ibn Thibyan):
- **storyAr**: The prophetic/historical story in Arabic
- **storyEn**: English translation
- **categoriesAr**: What is صالح/مكروه per the hadith text
- **categoriesEn**: English translation
- **source**: Book + page reference

Example entries:

Day 1:
```
storyAr: "يوم مبارك خلق الله فيه آدم وهو يوم محمود لطلب الحوائج، والدخول على السلطان، ولطلب العلم والتزويج والسفر والبيع والشراء واتخاذ الماشية."
source: "الدروع الواقية - ابن طاووس / مكارم الأخلاق - الطبرسي"
```

Day 3:
```
storyAr: "يوم نحس مستمر، فاتق فيه السلطان والبيع والشراء وطلب الحوائج، ولا تتعرض فيه لمعاملة ولا تشارك فيه أحداً، وفيه سُلب آدم وحوا لباسهما وأُخرجا من الجنة، واجعل شغلك صلاح أمر منزلك، وإن أمكنك أن لا تخرج من دارك فافعل."
```

Day 5:
```
storyAr: "ولد فيه قابيل الشقي وفيه قتل أخاه. وهو نحس مستمر، فلا تبتدئ فيه بعمل، وتعاهد من في منزلك، وانظر في إصلاح الماشية."
```

Day 23:
```
storyAr: "يوم صالح ولد فيه يوسف عليه السلام وهو يوم خفيف تطلب فيه الحوائج والتجارة والتزويج والدخول على السلطان ومن سافر فيه غنم وأصاب خيراً."
```

Day 26:
```
storyAr: "ضرب فيه موسى عليه السلام بعصاه البحر فانفلق. وهو يوم يصلح للسفر ولكل أمر يراد إلا التزويج، فإنه من تزوج فيه فُرق بينهما ولا تدخل إذا وردت من سفرك فيه إلى أهلك."
```

IMPORTANT: The full 30-day narration text is available at:
https://almaaref.org/maarefdetails.php?id=11321&subcatid=1549&cid=15&supcat=1
Use BOTH the short version (مكارم الأخلاق) and the long version (الدروع الواقية) from this page. The long version has the prophetic stories.

---

## Pre-Generated Readings

Total combinations: 30 days x 12 signs x 7 weekdays = 2,520 unique readings.

### Generation Process

Create a script `tools/generate-readings.js` that:
1. Iterates all 2,520 combinations
2. For each combo, computes the consensus ruling
3. Calls Claude API (Sonnet) in batches of ~30-50 to generate a 2-3 sentence Arabic reading + English translation
4. The prompt to Claude includes:
   - The day's narration (prophetic story)
   - The zodiac sign name
   - The weekday name
   - The computed consensus per category
   - Instruction: "Write a 2-3 sentence daily reading in formal Arabic that weaves the prophetic story with the category rulings. Never contradict the rulings. If marriage is مكروه, never call the day good for marriage. End with a clear practical takeaway. Then provide an English translation."
5. Outputs `src/data/readings.json`

Key format:
```json
{
  "1-2-0": {
    "ar": "يوم مبارك خلق الله فيه آدم عليه السلام...",
    "en": "A blessed day on which Allah created Adam..."
  }
}
```
Key = `{hijriDay}-{signIndex}-{weekdayIndex}` where weekday 0=Saturday, 6=Friday.

CRITICAL RULE for readings: NEVER contradict the ruling matrix. If consensus says travel is مكروه, the reading must say travel is مكروه. No averaging, no softening.

---

## Hijri Date Resolution Chain

### Priority Order
1. **Manual overrides** (`public/overrides/month-starts.json`)
2. **AlAdhan API** with Jafari method + user adjustment
3. **hijri-converter** npm package (offline fallback) + user adjustment

### month-starts.json Format
```json
{
  "1447": {
    "9": {
      "gregorianStart": "2026-02-19",
      "source": "imam-us.org",
      "fetchedAt": "2026-02-19T12:00:00Z"
    },
    "10": {
      "gregorianStart": "2026-03-21",
      "source": "imam-us.org",
      "fetchedAt": "2026-03-20T12:00:00Z"
    }
  }
}
```

### Resolution Logic
```
function resolveHijriDate(gregorianDate) {
  // 1. Check overrides
  for each override in month-starts.json (sorted newest first):
    if gregorianDate >= override.gregorianStart:
      hijriDay = daysDiff(gregorianDate, override.gregorianStart) + 1
      if hijriDay <= 30: return { year, month, day: hijriDay }

  // 2. Try AlAdhan API
  const userAdj = localStorage.getItem('hijriAdjustment') || 0
  try:
    fetch(`https://api.aladhan.com/v1/gToH/${DD-MM-YYYY}?adjustment=${userAdj}`)
    return parsed response

  // 3. Fallback: hijri-converter + adjustment
  const { hy, hm, hd } = toHijri(y, m, d)
  return applyAdjustment({ hy, hm, hd }, userAdj)
}
```

### User Adjustment
- Stored in localStorage as integer (-2 to +2)
- Applied to AlAdhan API call AND local fallback
- UI: simple stepper control at bottom of page
- Label: "تعديل التاريخ الهجري" / "Hijri Date Adjustment"

---

## Automated Month-Start Scraping

### GitHub Actions Workflow: `.github/workflows/update-hijri.yml`

```yaml
name: Update Hijri Month Starts
on:
  schedule:
    - cron: '0 18 * * *'  # Daily at 6 PM UTC (9 PM Kuwait)
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: node scripts/update-month-start.js
      - name: Commit if changed
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add public/overrides/month-starts.json
          git diff --staged --quiet || git commit -m "auto: update hijri month starts" && git push
```

### Script: `scripts/update-month-start.js`

Scraping targets (priority order):
1. **imam-us.org** - Parses latest crescent announcement
2. **shia-calendar.com** - Backup
3. **AlAdhan API** - Final fallback

The script:
1. Fetches the imam-us.org homepage or latest crescent post
2. Parses the month name + Gregorian start date from the announcement text
3. Reads current month-starts.json
4. If this month is not already recorded, adds it
5. Writes back to month-starts.json

---

## Protection Duaa

Shown on any day where the overall verdict includes مكروه.

```
بسمه تعالى
دعاء وتحصين يقرأ عند الخوف

قال الإمام الكاظم عليه السلام: من أوجس في نفسه شيء أو خيف من الشؤم فليقل:

اللهم لا طير إلا طيرك ولا ضير إلا ضيرك ولا خير إلا خيرك ولا إله غيرك
اعتصمت بك يا ربّ من شرّ ما أجد في نفسي فاعصمني بمحمد وآل محمد
صلى الله عليه وآله من ذلك.

فإنه يُعصم من ذلك الشيء.
```

Also, from the hadith: the نحس (misfortune) of days can be lifted by giving صدقة (charity). This should be mentioned in the UI when a day is مكروه.

---

## File Structure

```
qamar-calendar/
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── update-hijri.yml
├── scripts/
│   └── update-month-start.js
├── tools/
│   └── generate-readings.js        # One-time: generates readings.json via Claude API
├── public/
│   └── overrides/
│       └── month-starts.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── i18n/
│   │   ├── ar.json                  # All UI strings Arabic
│   │   ├── en.json                  # All UI strings English
│   │   └── useLocale.js             # React context for language
│   ├── data/
│   │   ├── lunarDayNarrations.js    # 30 entries with prophetic stories AR+EN
│   │   ├── lunarDayRulings.js       # 30 entries from Table 3
│   │   ├── zodiacRulings.js         # 12 entries from Table 1
│   │   ├── weekdayRulings.js        # 7 entries from Table 2
│   │   ├── signMeta.js              # 12 signs: AR/EN names, order, emoji
│   │   ├── monthNames.js            # Hijri month names AR/EN
│   │   ├── duaa.js                  # Protection duaa text AR+EN
│   │   └── readings.json            # 2,520 pre-composed readings
│   ├── engine/
│   │   ├── hijriResolver.js         # Resolution chain
│   │   ├── moonSign.js              # Core formula
│   │   ├── consensus.js             # 3-table merge, مكروه-wins
│   │   └── reading.js               # Lookup from readings.json
│   ├── hooks/
│   │   ├── useHijriDate.js
│   │   ├── useDayData.js            # Combines all engines for a given date
│   │   └── useCalendarMonth.js      # Returns full month of day objects
│   ├── components/
│   │   ├── CalendarGrid.jsx         # Month grid, Apple calendar style
│   │   ├── DayCell.jsx              # Single day cell with sentiment dot
│   │   ├── DayDetail.jsx            # Main detail panel
│   │   ├── SignCard.jsx             # Zodiac sign + night position indicator
│   │   ├── RulingMatrix.jsx         # 4-column ruling table
│   │   ├── NarrationCard.jsx        # Prophetic story of the day
│   │   ├── ReadingCard.jsx          # Pre-composed daily reading
│   │   ├── MonthNav.jsx             # Month navigation arrows
│   │   ├── LanguageToggle.jsx       # AR/EN switch
│   │   ├── AdjustmentControl.jsx    # +/- day offset control
│   │   ├── DuaaCard.jsx             # Protection duaa
│   │   └── Header.jsx               # App title + controls
│   ├── styles/
│   │   └── index.css                # Tailwind + custom
│   └── utils/
│       └── dateHelpers.js
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## UI Layout

### Mobile (default, Arabic RTL)
```
┌─────────────────────────┐
│ تقويم القمر    [EN] [±] │  <- Header
│ ← رمضان ١٤٤٧ →         │  <- MonthNav
├─────────────────────────┤
│ ج  خ  أر ث  إ  أح س    │  <- Weekday headers
│ [1●][2●][3○][4●][5○]... │  <- DayCell grid
│ [6●][7●][8●]...         │     ● = green (حسن)
│ ...                      │     ○ = red (مكروه)
│ [26○][27●][28●][29●][30]│     ◐ = yellow (mixed)
├─────────────────────────┤
│ ▼ تفاصيل اليوم ٢٦      │  <- DayDetail (slides up)
│                          │
│ ┌─ القمر في الدلو ──┐   │  <- SignCard
│ │ الليلة ١ من ٢      │   │
│ └────────────────────┘   │
│                          │
│ ┌─ رواية اليوم ──────┐  │  <- NarrationCard
│ │ ضرب فيه موسى ع...  │  │
│ └────────────────────┘   │
│                          │
│ ┌─ أحكام اليوم ──────┐  │  <- RulingMatrix
│ │ الزواج:  مكروه 🔴   │  │
│ │ السفر:   مكروه 🔴   │  │
│ │ البناء:  حسن   🟢   │  │
│ │ الأعمال: حسن   🟢   │  │
│ └────────────────────┘   │
│                          │
│ ┌─ قراءة اليوم ──────┐  │  <- ReadingCard
│ │ في هذا اليوم ضرب   │  │
│ │ موسى ع البحر...     │  │
│ │ تجنب الزواج والسفر  │  │
│ │ وابدأ بالبناء...    │  │
│ └────────────────────┘   │
│                          │
│ ┌─ دعاء التحصين ─────┐  │  <- DuaaCard (if مكروه)
│ │ اللهم لا طير إلا... │  │
│ │ + تصدق لدفع النحس   │  │
│ └────────────────────┘   │
│                          │
│ تعديل: [−] ٠ [+]        │  <- AdjustmentControl
└─────────────────────────┘
```

### Desktop
Side-by-side: CalendarGrid on left, DayDetail on right.

---

## Design Notes

- Default language: Arabic (RTL)
- Force light mode (no dark mode, same as existing project)
- Font: system Arabic font stack
- Colors:
  - حسن = emerald/green
  - مكروه = rose/red
  - mixed = amber/yellow
  - neutral = gray
- Calendar grid cells show day number + a small colored dot indicating overall verdict
- Clicking a day scrolls to / reveals the detail panel
- Month navigation preserves selected day when possible
- Footer disclaimer: "هذه أداة إرشادية مبنية على أحاديث أهل البيت عليهم السلام وليست فتوى"

---

## Package Dependencies

```json
{
  "dependencies": {
    "hijri-converter": "^1.1.1",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.4",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.18",
    "vite": "^7.1.7"
  }
}
```

---

## Build & Deploy

- `npm run dev` - local dev
- `npm run build` - production build to `dist/`
- GitHub Pages via Actions (same as existing arabic-mapper project)
- `vite.config.js` base path: `/qamar-calendar/`

---

## What NOT to Build

- No user accounts or auth
- No backend server
- No database
- No dark mode
- No notifications
- No social sharing
- No ads
- No analytics (for now)
