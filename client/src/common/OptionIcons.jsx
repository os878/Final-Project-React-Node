// ===== אייקונים משותפים לאפשרויות (קטגוריות, אירועים, קשרים, סגנונות) =====
// הועברו לכאן מהשאלון, כדי שגם דף התחזוקה של המנהל יוכל להציג אותם (גלריית אייקונים).
// קו פשוט, בסגנון האתר. כדי להוסיף אייקון: מוסיפים אותו ל-ICONS ולרשימה ICON_CHOICES למטה.
export const ICONS = {
  // ברירת מחדל: שלוש נקודות – לכל דבר חדש שהמנהל מוסיף
  dots: <><circle cx="6" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /><circle cx="18" cy="12" r="1.6" fill="currentColor" stroke="none" /></>,
  gift: <><rect x="4" y="10" width="16" height="10" rx="1.5" /><path d="M3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z" /></>,
  boy: <><circle cx="12" cy="7" r="3.5" /><path d="M6 21v-3a6 6 0 0 1 12 0v3" /></>,
  girl: <><circle cx="12" cy="7" r="3.5" /><path d="M8.5 6.5c0-3 7-3 7 0M6 21l2-7h8l2 7" /></>,
  both: <><circle cx="8.5" cy="8" r="3" /><circle cx="15.5" cy="8" r="3" /><path d="M3 20v-2a5 5 0 0 1 10 0M11 20v-2a5 5 0 0 1 10 0" /></>,
  cake: <><path d="M4 20h16v-7H4zM4 15c2 1.5 4 1.5 5.3 0 1.4 1.5 4 1.5 5.4 0 1.3 1.5 3.3 1.5 5.3 0M8 13V9M12 13V9M16 13V9" /><path d="M8 6.5c0-1 .8-1.5.8-2.5M12 6.5c0-1 .8-1.5.8-2.5M16 6.5c0-1 .8-1.5.8-2.5" /></>,
  rings: <><circle cx="9" cy="14" r="5" /><circle cx="15" cy="14" r="5" /><path d="M10 5l2-2 2 2-2 2z" /></>,
  star: <path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.8Z" />,
  baby: <><circle cx="12" cy="10" r="6" /><path d="M9.5 10h.01M14.5 10h.01M10 13c1 .8 3 .8 4 0M9 20h6" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  home: <><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-5h4v5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20v-1.5a6.5 6.5 0 0 1 13 0V20" /><circle cx="17" cy="9" r="2.8" /><path d="M16 14a5 5 0 0 1 5.5 5V20" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5h6v2M3 13h18" /></>,
  school: <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></>,
  laptop: <><rect x="5" y="5" width="14" height="10" rx="1.5" /><path d="M2 19h20l-2-4H4z" /></>,
  ball: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c-3.5 4-3.5 14 0 18M12 3c3.5 4 3.5 14 0 18" /></>,
  pot: <><path d="M5 10h14v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" /><path d="M3 10h18M10 6c0-1.5 1-1.5 1-3M14 6c0-1.5 1-1.5 1-3" /></>,
  book: <path d="M12 6c-2-1.5-5-1.5-8-1v14c3-.5 6-.5 8 1 2-1.5 5-1.5 8-1V5c-3-.5-6-.5-8 1Zm0 0v14" />,
  palette: <><path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 1.5-2-.6-1.4.4-2.5 2-2.5H17a4 4 0 0 0 4-4c0-5-4-9.5-9-9.5Z" /><circle cx="7.5" cy="11" r="1" fill="currentColor" /><circle cx="11" cy="7" r="1" fill="currentColor" /><circle cx="15.5" cy="8" r="1" fill="currentColor" /></>,
  mountain: <><path d="M2 20l7-11 4 6 3-4 6 9z" /><circle cx="17" cy="6" r="2" /></>,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" />,
  music: <><path d="M9 18V6l11-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="17.5" cy="16" r="2.5" /></>,
  tools: <><path d="M14.5 6.5a4 4 0 0 0 5 5L12 19a2.1 2.1 0 0 1-3-3Z" /><path d="M5 5l4 4" /></>,
  flower: <><circle cx="12" cy="9" r="2.5" /><path d="M12 6.5c0-3 3-3 3 0s-3 2.5-3 2.5M12 6.5c0-3-3-3-3 0s3 2.5 3 2.5M14.5 9c3 0 3 3 0 3M9.5 9c-3 0-3 3 0 3M12 11.5V21M12 17c-2-2-4-1.5-4-1.5" /></>,
  ticket: <><path d="M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V4H3z" transform="translate(0 2)" /><path d="M14 6v12" strokeDasharray="2 2" /></>,
  diamond: <><path d="M6 4h12l3 5-9 11L3 9z" /><path d="M3 9h18M9 4l3 16 3-16" /></>,
  smile: <><circle cx="12" cy="12" r="9" /><path d="M8 14c1.5 2 6.5 2 8 0M9 9.5h.01M15 9.5h.01" /></>,
  pen: <><path d="M15 4l5 5L9 20H4v-5Z" /><path d="M13 6l5 5" /></>,
  coins: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3 3 7 3s7-1.3 7-3v-6" /></>,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  bulb: <><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3Z" /></>,
  // ----- קטגוריות -----
  vase: <><path d="M9 3h6M10 3v3c-3 2-4 5-4 8a6 6 0 0 0 12 0c0-3-1-6-4-8V3" /><path d="M6.5 13h11" /></>,
  puzzle: <path d="M4 7h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4h-4a2 2 0 1 0-4 0H4v-4a2 2 0 1 0 0-4Z" />,
  stationery: <><rect x="3" y="4" width="5" height="16" rx="1" /><rect x="8" y="7" width="5" height="13" rx="1" /><path d="M15.5 19.5 18 6l3 .6-2.5 13.4Z" /><path d="M10.5 10h0M5.5 8h0" /></>,
  towels: <><rect x="3" y="4" width="18" height="5" rx="2" /><rect x="3" y="9.5" width="18" height="5" rx="2" /><rect x="3" y="15" width="18" height="5" rx="2" /></>,
  giftcard: <><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M8 6v13M2 12h20" /><path d="M8 12c-2.5-1-3.5-3.5-1.5-4S8 10 8 12Zm0 0c2.5-1 3.5-3.5 1.5-4S8 10 8 12Z" /></>,
  // ----- אירועים -----
  torah: <><rect x="7" y="4" width="10" height="16" rx="1" /><path d="M5 2.5v19M19 2.5v19M10 9h4M10 12h4M10 15h4" /></>,
  candles: <><path d="M6 21h12M9 21V11h2v10M13 21V11h2v10" /><path d="M10 8c-.9-.8-.9-2.2 0-3.5.9 1.3.9 2.7 0 3.5ZM14 8c-.9-.8-.9-2.2 0-3.5.9 1.3.9 2.7 0 3.5Z" /></>,
  stroller: <><path d="M2.5 5h2.5l2 9h10.5a5.5 5.5 0 0 0-5.5-5.5H11V14" /><circle cx="8.5" cy="18.5" r="2" /><circle cx="16.5" cy="18.5" r="2" /></>,
  cup: <><path d="M7 3h10v4a5 5 0 0 1-10 0Z" /><path d="M12 12v6M8 21h8M10 18h4" /></>,
  sukkah: <><path d="M2.5 8.5h19" /><path d="M4 8.5V21M20 8.5V21M2.5 21h19M9 21v-6h6v6" /><path d="M5 8.5c0-2 2-3 3.5-3M10 8.5c0-2 2-3 3.5-3M15 8.5c0-2 2-3 3.5-3" /></>,
  menorah: <><path d="M12 7v13M8 21h8M3.5 7v2.5a8.5 8.5 0 0 0 17 0V7M7.5 7v2.5a4.5 4.5 0 0 0 9 0V7" /><path d="M12 3v1.5M3.5 3.5v1M7.5 3.5v1M16.5 3.5v1M20.5 3.5v1" /></>,
  matzah: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M7 9h.01M11 9h.01M15 9h.01M9 12h.01M13 12h.01M17 12h.01M7 15h.01M11 15h.01M15 15h.01" strokeWidth="2.6" /></>,
  mask: <><path d="M2.5 8c3-1.6 6.5-1.6 9.5 0 3-1.6 6.5-1.6 9.5 0 0 5.5-2.2 8.5-5.2 8.5-2 0-3.1-2-4.3-2s-2.3 2-4.3 2C4.7 16.5 2.5 13.5 2.5 8Z" /><path d="M6.5 11.2c.8-.7 2.2-.7 3 0M14.5 11.2c.8-.7 2.2-.7 3 0" /></>,
  palm: <><path d="M12.5 21c0-5 .4-8.5 1.8-11.5" /><path d="M14.3 9.5c-2.2-3-6.3-3-8.3-.8 3.2-.2 5.3.2 8.3.8Zm0 0c.9-3.2 5-4.4 7.2-2.4-3.1.2-5 1.1-7.2 2.4Zm0 0c-1-2.2-.9-5 1.2-6.5.2 2.3.1 4.4-1.2 6.5Z" /><path d="M5 21h14" /></>,
  apple: <><path d="M12 7.5c-3-2-8-1-8 4 0 5 3 9.5 6 9.5 1 0 1.3-.5 2-.5s1 .5 2 .5c3 0 6-4.5 6-9.5 0-5-5-6-8-4Z" /><path d="M12 7.5c0-2 1-3.5 3-4.5" /></>,
  award: <><circle cx="12" cy="9" r="5.5" /><path d="M9.2 13.8 7.5 21l4.5-2.5 4.5 2.5-1.7-7.2" /><path d="M12 6.5l.8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2Z" /></>,
  moving: <><path d="M2.5 11 12 3.5l9.5 7.5" /><path d="M4.5 9.5V20h7" /><circle cx="16" cy="15.5" r="2.5" /><path d="M17.8 17.3 21 20.5M19.6 19.1l1.2-1.2" /></>,
  diamondRing: <><circle cx="12" cy="15" r="6" /><path d="M9 6.5 10.5 3h3L15 6.5 12 9.5Z" /></>,
  // ----- קשרים -----
  family: <><circle cx="7" cy="6.5" r="2.5" /><circle cx="17" cy="6.5" r="2.5" /><circle cx="12" cy="12.5" r="2" /><path d="M2.5 19v-2.5a4.5 4.5 0 0 1 7-3.7M21.5 19v-2.5a4.5 4.5 0 0 0-7-3.7M8.5 20.5a3.5 3.5 0 0 1 7 0" /></>,
  person: <><circle cx="12" cy="8" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
  couple: <><path d="M8.5 18S3 14.6 3 10.2A3.2 3.2 0 0 1 8.5 8a3.2 3.2 0 0 1 5.5 2.2" /><path d="M15.5 21s-5.5-3.4-5.5-7.8A3.2 3.2 0 0 1 15.5 11 3.2 3.2 0 0 1 21 13.2c0 4.4-5.5 7.8-5.5 7.8Z" /></>,
  // ----- נוספו לגלריה של המנהל -----
  starOfDavid: <><path d="M12 3 20 17H4Z" /><path d="M12 21 4 7h16Z" /></>,
  scroll: <><path d="M6 4h11a2 2 0 0 1 2 2v12" /><path d="M6 4a2 2 0 0 0-2 2v1h4V6a2 2 0 0 0-2-2ZM8 7v11a2 2 0 0 0 2 2h9a2 2 0 0 1-2-2v-1h-7" /><path d="M11 9h5M11 12h5" /></>,
  plane: <path d="M10.5 21 12 16l-7-2v-2l7-1V5.5a1.5 1.5 0 0 1 3 0V11l7 1v2l-7 2 1.5 5-3-1Z" transform="rotate(-45 12 12)" />,
  wine: <><path d="M8 3h8l-.5 5a3.5 3.5 0 0 1-7 0Z" /><path d="M12 11.5V20M8.5 21h7M8.3 6.5h7.4" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4Z" /><circle cx="12" cy="13" r="3.5" /></>,
  leaf: <><path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" /><path d="M5 19c3-4 6-7 10-9" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>,
  shirt: <path d="M9 3 4 6l2 4 2-1v12h8V9l2 1 2-4-5-3c0 1.7-1.3 3-3 3S9 4.7 9 3Z" />,
  car: <><path d="M3 16v-4l2-5h14l2 5v4Z" /><path d="M3 12h18" /><circle cx="7.5" cy="17" r="1.8" /><circle cx="16.5" cy="17" r="1.8" /></>,
  check: <path d="M5 12l4 4L19 6" />,
  arrowLeft: <path d="M19 12H5m0 0 7 7m-7-7 7-7" />,
  arrowRight: <path d="M5 12h14m0 0-7-7m7 7-7 7" />,
};

export const Icon = ({ name, className = 'qz-icon' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {ICONS[name] || ICONS.dots}
  </svg>
);

// הגלריה שהמנהל בוחר ממנה אייקון לקטגוריה / אירוע / קשר (בלי אייקוני ממשק כמו חיצים ו-V).
// label = שם בעברית, לקוראי מסך ולמעבר עכבר
export const ICON_CHOICES = [
  // כללי
  { name: 'gift', label: 'מתנה' }, { name: 'heart', label: 'לב' }, { name: 'star', label: 'כוכב' },
  { name: 'sparkle', label: 'ניצוץ' }, { name: 'smile', label: 'חיוך' }, { name: 'award', label: 'פרס' },
  { name: 'diamond', label: 'יהלום' }, { name: 'flower', label: 'פרח' }, { name: 'leaf', label: 'עלה' },
  { name: 'sun', label: 'שמש' }, { name: 'music', label: 'מוזיקה' }, { name: 'camera', label: 'מצלמה' },
  { name: 'ticket', label: 'כרטיס' }, { name: 'coins', label: 'מטבעות' }, { name: 'drop', label: 'טיפה' },
  // קטגוריות
  { name: 'vase', label: 'אגרטל' }, { name: 'home', label: 'בית' }, { name: 'pot', label: 'בישול' },
  { name: 'wine', label: 'יין' }, { name: 'cup', label: 'גביע' }, { name: 'towels', label: 'טקסטיל' },
  { name: 'shirt', label: 'בגדים' }, { name: 'puzzle', label: 'משחק' }, { name: 'ball', label: 'ספורט' },
  { name: 'book', label: 'ספר' }, { name: 'stationery', label: 'כלי כתיבה' }, { name: 'pen', label: 'עט' },
  { name: 'palette', label: 'אומנות' }, { name: 'tools', label: 'כלים' }, { name: 'laptop', label: 'טכנולוגיה' },
  { name: 'giftcard', label: 'שובר' }, { name: 'mountain', label: 'טבע' }, { name: 'plane', label: 'טיול' },
  { name: 'car', label: 'רכב' },
  // יהדות וחגים
  { name: 'starOfDavid', label: 'מגן דוד' }, { name: 'menorah', label: 'חנוכייה' }, { name: 'candles', label: 'נרות' },
  { name: 'torah', label: 'ספר תורה' }, { name: 'scroll', label: 'מגילה' }, { name: 'matzah', label: 'מצה' },
  { name: 'sukkah', label: 'סוכה' }, { name: 'apple', label: 'תפוח בדבש' }, { name: 'mask', label: 'מסכה' },
  // אירועים
  { name: 'cake', label: 'עוגה' }, { name: 'rings', label: 'טבעות' }, { name: 'diamondRing', label: 'טבעת אירוסין' },
  { name: 'baby', label: 'תינוק' }, { name: 'stroller', label: 'עגלה' }, { name: 'moving', label: 'בית חדש' },
  { name: 'palm', label: 'חופשה' }, { name: 'school', label: 'לימודים' },
  // קשרים
  { name: 'person', label: 'אדם' }, { name: 'couple', label: 'זוג' }, { name: 'family', label: 'משפחה' },
  { name: 'users', label: 'חברים' }, { name: 'briefcase', label: 'עבודה' }, { name: 'boy', label: 'בן' },
  { name: 'girl', label: 'בת' },
];

/* ---------- אייקון לכל אפשרות שמגיעה מהשרת ---------- */
// התאמה לפי השם המלא בדיוק, כפי שהוא שמור במסד הנתונים.
// שם שלא מופיע כאן (למשל קטגוריה/אירוע/קשר חדש שהמנהל הוסיף) → שלוש נקודות.
export const ITEM_ICONS = {
  // קטגוריות
  'כלי בית ועיצוב': 'vase',
  'משחקים וצעצועים': 'puzzle',
  'מוצרי ניר, ספרים וציוד משרדי': 'stationery',
  'טקסטיל ומוצרים לבית': 'towels',
  'שוברים/גיפט קארד/חוויה': 'giftcard',
  // אירועים
  'יום הולדת': 'cake',
  'חתונה': 'rings',
  'בר מצוה': 'torah',
  'בת מצוה': 'candles',
  'הולדת תינוק': 'stroller',
  'חג': 'cup',
  'סוכות': 'sukkah',
  'חנוכה': 'menorah',
  'פסח': 'matzah',
  'פורים': 'mask',
  'חופשה': 'palm',
  'ראש השנה': 'apple',
  'הודיה/הערכה': 'award',
  'מעבר דירה': 'moving',
  'אירוסין': 'diamondRing',
  // קשרים
  'בן/בת זוג': 'couple',
  'משפחה': 'family',
  'קולגה לעבודה': 'briefcase',
  'חבר/ה': 'users',
  'אחר': 'person',
};

// מנרמל רווחים, כדי ש"הודיה /הערכה" ו"הודיה/הערכה" ייחשבו אותו שם
const normalize = (name) => (name || '').toString().replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ').trim();

export const pickIcon = (item) => {
  if (item.icon && ICONS[item.icon]) return item.icon; // אייקון שהמנהל בחר בדף התחזוקה – קודם לכל
  return ITEM_ICONS[normalize(item.name)] || 'dots';
};
