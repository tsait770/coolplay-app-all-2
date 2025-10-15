const fs = require('fs');
const path = require('path');

const newKeys = {
  "now": {
    "en": "Now",
    "zh-TW": "現在",
    "zh-CN": "现在",
    "ja": "今",
    "ko": "지금",
    "es": "Ahora",
    "pt": "Agora",
    "pt-BR": "Agora",
    "de": "Jetzt",
    "fr": "Maintenant",
    "ru": "Сейчас",
    "ar": "الآن"
  },
  "hours_ago": {
    "en": " hours ago",
    "zh-TW": "小時前",
    "zh-CN": "小时前",
    "ja": "時間前",
    "ko": "시간 전",
    "es": " horas atrás",
    "pt": " horas atrás",
    "pt-BR": " horas atrás",
    "de": " Stunden her",
    "fr": " heures",
    "ru": " часов назад",
    "ar": " ساعات مضت"
  },
  "yesterday": {
    "en": "Yesterday",
    "zh-TW": "昨天",
    "zh-CN": "昨天",
    "ja": "昨日",
    "ko": "어제",
    "es": "Ayer",
    "pt": "Ontem",
    "pt-BR": "Ontem",
    "de": "Gestern",
    "fr": "Hier",
    "ru": "Вчера",
    "ar": "أمس"
  },
  "days_ago": {
    "en": " days ago",
    "zh-TW": "天前",
    "zh-CN": "天前",
    "ja": "日前",
    "ko": "일 전",
    "es": " días atrás",
    "pt": " dias atrás",
    "pt-BR": " dias atrás",
    "de": " Tage her",
    "fr": " jours",
    "ru": " дней назад",
    "ar": " أيام مضت"
  }
};

const l10nDir = path.join(process.cwd(), 'l10n');
const languages = ['en', 'zh-TW', 'zh-CN', 'ja', 'ko', 'es', 'pt', 'pt-BR', 'de', 'fr', 'ru', 'ar'];

languages.forEach(lang => {
  const filePath = path.join(l10nDir, `${lang}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(content);
    
    let updated = false;
    Object.keys(newKeys).forEach(key => {
      if (!translations[key]) {
        translations[key] = newKeys[key][lang];
        updated = true;
        console.log(`✓ Added "${key}" to ${lang}.json`);
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf8');
      console.log(`✓ Updated ${lang}.json`);
    } else {
      console.log(`- No updates needed for ${lang}.json`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${lang}.json:`, error.message);
  }
});

console.log('\n✓ Translation sync complete!');
