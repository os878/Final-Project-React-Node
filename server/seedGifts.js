require('dotenv').config(); // טעינת משתני הסביבה מקובץ .env
const mongoose = require('mongoose');

// ייבוא המודלים (ודאי שהנתיבים תואמים לפרויקט שלך)
const Gift = require('./models/Gift');
const Supplier = require('./models/Supplier');

// ודאי ששם המשתנה תואם למה שכתוב אצלך בקובץ .env
const MONGO_URI = process.env.DATABASE_URI;

// המזהים המדויקים מתוך מסד הנתונים שלך
const CATEGORIES = {
    HOME_DESIGN: new mongoose.Types.ObjectId('6ae66867829898c3c6426824'), // כלי בית ועיצוב
    GAMES_TOYS: new mongoose.Types.ObjectId('6ae668eb829898c3c6426825'),  // משחקים וצעצועים
    PAPER_BOOKS: new mongoose.Types.ObjectId('6ae66928829898c3c6426826'), // מוצרי ניר, ספרים וציוד משרדי
    TEXTILE: new mongoose.Types.ObjectId('6ae66944829898c3c6426827'),     // טקסטיל ומוצרים לבית
    VOUCHERS: new mongoose.Types.ObjectId('6ae6695d829898c3c6426828'),    // שוברים / גיפט קארד / חוויה
    JUDAICA: new mongoose.Types.ObjectId('6af6453a7b8ab5c4ece47488')      // יודאיקה
};

const EVENTS = {
    BIRTHDAY: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e70'),      // יום הולדת
    WEDDING: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e71'),       // חתונה
    BAR_MITZVAH: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e72'),   // בר מצוה
    BAT_MITZVAH: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e73'),   // בת מצוה
    NEW_BABY: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e74'),      // הולדת תינוק
    HOLIDAY: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e75'),       // חג
    SUKKOT: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e76'),        // סוכות
    HANUKKAH: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e77'),      // חנוכה
    PASSOVER: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e78'),      // פסח
    PURIM: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e79'),         // פורים
    VACATION: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e7a'),      // חופשה
    ROSH_HASHANAH: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e7b'), // ראש השנה
    APPRECIATION: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e7c'),  // הודיה / הערכה
    MOVING_HOUSE: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e7d'),  // מעבר דירה
    ENGAGEMENT: new mongoose.Types.ObjectId('6ae678f10950a684aeb98e7e')     // אירוסין
};

const RELATIONSHIPS = {
    SPOUSE: new mongoose.Types.ObjectId('6ae675410950a684aeb98e68'),      // בן / בת זוג
    FAMILY: new mongoose.Types.ObjectId('6ae675410950a684aeb98e69'),      // משפחה
    COLLEAGUE: new mongoose.Types.ObjectId('6ae675410950a684aeb98e6b'),   // קולגה לעבודה
    OTHER: new mongoose.Types.ObjectId('6ae675410950a684aeb98e6c'),       // אחר
    FRIEND: new mongoose.Types.ObjectId('6af37e014bcb0368870936ed')       // חבר/ה
};

async function seedGifts() {
    try {
        if (!MONGO_URI) {
            throw new Error('לא נמצאה כתובת חיבור (MONGO_URI) בקובץ .env');
        }

        await mongoose.connect(MONGO_URI);
        console.log('התחברות למסד הנתונים הצליחה.');

        const suppliers = await Supplier.find({});
        if (suppliers.length === 0) {
            throw new Error('לא נמצאו ספקים במסד הנתונים. יש להריץ קודם את סקריפט הספקים.');
        }

        const supplierMap = {};
        suppliers.forEach(s => {
            supplierMap[s.email] = s._id;
        });
        const fallbackSupplier = suppliers[0]._id;

        const giftsData = [
            // --- ספק 1: אברהם כהן (עיצוב אירועים ושמחות בע"מ) ---
            {
                name: 'סט מעמדי נרות קריסטל יוקרתיים',
                forGender: 'בת',
                age1: 20,
                age2: 80,
                styles: ['דקורטיבי', 'יוקרתי'],
                DedicationPersonalization: true,
                category: CATEGORIES.JUDAICA,
                event: EVENTS.WEDDING,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'שקוף / כסף',
                price: 320,
                image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500',
                description: 'זוג פמוטי קריסטל מעוצבים לשולחן שבת וחג, עם אפשרות לחריטת הקדשה אישית.',
                supplier: supplierMap['avraham@simcha-design.co.il'] || fallbackSupplier
            },
            {
                name: 'כלי לדבש מעוצב מזכוכית וזהב עם כפית תואמת',
                forGender: 'לא משנה',
                age1: 20,
                age2: 85,
                styles: ['דקורטיבי', 'שימושי'],
                DedicationPersonalization: false,
                category: CATEGORIES.JUDAICA,
                event: EVENTS.ROSH_HASHANAH,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'שקוף וזהב',
                price: 135,
                image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500',
                description: 'דבשייה מהודרת לשולחן ראש השנה בעיצוב קלאסי.',
                supplier: supplierMap['avraham@simcha-design.co.il'] || fallbackSupplier
            },
            {
                name: 'אגרטל קרמיקה בעבודת יד בגימור מט',
                forGender: 'לא משנה',
                age1: 25,
                age2: 75,
                styles: ['דקורטיבי', 'שימושי'],
                DedicationPersonalization: false,
                category: CATEGORIES.HOME_DESIGN,
                event: EVENTS.MOVING_HOUSE,
                relationship: RELATIONSHIPS.FRIEND,
                color: 'שמנת',
                price: 185,
                image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500',
                description: 'אגרטל מעוצב בקווים נקיים המתאים למרכז שולחן או לסלון בדירה חדשה.',
                supplier: supplierMap['avraham@simcha-design.co.il'] || fallbackSupplier
            },
            {
                name: 'קערת סדר פסח מהודרת מפורצלן ועיטורי כסף',
                forGender: 'לא משנה',
                age1: 22,
                age2: 85,
                styles: ['יוקרתי', 'שימושי'],
                DedicationPersonalization: true,
                category: CATEGORIES.JUDAICA,
                event: EVENTS.PASSOVER,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'לבן וכסף',
                price: 380,
                image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500',
                description: 'קערת ליל הסדר מחולקת ל-6 קעריות עם חריטת שמות הסימנים.',
                supplier: supplierMap['avraham@simcha-design.co.il'] || fallbackSupplier
            },

            // --- ספק 2: יצחק לוי (פרחי המלכות) ---
            {
                name: 'שובר לסדנת שזירת פרחים ועיצוב שולחן',
                forGender: 'בת',
                age1: 12,
                age2: 65,
                styles: ['חווייתי', 'אישי/מרגש'],
                DedicationPersonalization: false,
                category: CATEGORIES.VOUCHERS,
                event: EVENTS.BAT_MITZVAH,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'צבעוני',
                price: 420,
                image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500',
                description: 'שובר מתנה לסדנה מעשית של שעתיים ללימוד טכניקות שזירה ויצירת סידור פרחים לבית.',
                supplier: supplierMap['yitzhak@royal-flowers.co.il'] || fallbackSupplier
            },
            {
                name: 'עציץ סחלב לבן בכלי חרס מעוצב',
                forGender: 'לא משנה',
                age1: 25,
                age2: 80,
                styles: ['דקורטיבי', 'שימושי'],
                DedicationPersonalization: false,
                category: CATEGORIES.HOME_DESIGN,
                event: EVENTS.APPRECIATION,
                relationship: RELATIONSHIPS.COLLEAGUE,
                color: 'לבן',
                price: 160,
                image: 'https://images.unsplash.com/photo-1566908829550-e6551b00979b?w=500',
                description: 'סחלב פלנופסיס מרהיב עם שני ענפי פריחה בכלי קרמיקה יוקרתי להבעת תודה והערכה.',
                supplier: supplierMap['yitzhak@royal-flowers.co.il'] || fallbackSupplier
            },
            {
                name: 'סידור פרחים מיובשים בקופסת קטיפה',
                forGender: 'בת',
                age1: 16,
                age2: 85,
                styles: ['דקורטיבי', 'אישי/מרגש'],
                DedicationPersonalization: true,
                category: CATEGORIES.HOME_DESIGN,
                event: EVENTS.BIRTHDAY,
                relationship: RELATIONSHIPS.SPOUSE,
                color: 'ורוד עתיק',
                price: 240,
                image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500',
                description: 'מארז פרחים משומרים הנשמרים לאורך שנים, כולל כרטיס ברכה מודפס.',
                supplier: supplierMap['yitzhak@royal-flowers.co.il'] || fallbackSupplier
            },
            {
                name: 'שרשרת קישוטים מרהיבה ועמידה לגשם לסוכה',
                forGender: 'לא משנה',
                age1: 18,
                age2: 80,
                styles: ['דקורטיבי', 'שימושי'],
                DedicationPersonalization: false,
                category: CATEGORIES.HOME_DESIGN,
                event: EVENTS.SUKKOT,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'זהב ושמנת',
                price: 130,
                image: 'https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?w=500',
                description: 'קישוטי סוכה מעוצבים עם ברכות אושפיזין ועיטורי רימונים.',
                supplier: supplierMap['yitzhak@royal-flowers.co.il'] || fallbackSupplier
            },

            // --- ספק 3: יעקב מזרחי (אומנות החופה) ---
            {
                name: 'גביע קידוש מכסף טהור בעבודת פיליגרן',
                forGender: 'בן',
                age1: 13,
                age2: 14,
                styles: ['יוקרתי', 'אישי/מרגש'],
                DedicationPersonalization: true,
                category: CATEGORIES.JUDAICA,
                event: EVENTS.BAR_MITZVAH,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'כסף',
                price: 680,
                image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=500',
                description: 'גביע קידוש מסורתי עם תחתית תואמת ואפשרות לחריטת שם חתן בר המצווה ותאריך.',
                supplier: supplierMap['yaakov@chupa-art.co.il'] || fallbackSupplier
            },
            {
                name: 'חנוכייה מעוצבת מנירוסטה מוברשת ואבן ירושלמית',
                forGender: 'לא משנה',
                age1: 18,
                age2: 85,
                styles: ['יוקרתי', 'דקורטיבי'],
                DedicationPersonalization: true,
                category: CATEGORIES.JUDAICA,
                event: EVENTS.HANUKKAH,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'כסף ואבן',
                price: 290,
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
                description: 'חנוכייה מהודרת המתאימה לנרות ולשמן זית, עם אפשרות לחריטת הקדשה.',
                supplier: supplierMap['yaakov@chupa-art.co.il'] || fallbackSupplier
            },
            {
                name: 'בית מזוזה מעוצב מאבן ירושלמית ומתכת',
                forGender: 'לא משנה',
                age1: 20,
                age2: 80,
                styles: ['דקורטיבי', 'שימושי'],
                DedicationPersonalization: false,
                category: CATEGORIES.JUDAICA,
                event: EVENTS.MOVING_HOUSE,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'אבן / זהב',
                price: 145,
                image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=500',
                description: 'בית מזוזה בעיצוב מודרני המשלב אבן טבעית ואות ש׳ מוזהבת (ללא קלף).',
                supplier: supplierMap['yaakov@chupa-art.co.il'] || fallbackSupplier
            },
            {
                name: 'סדר ברכת המזון וזמירות שבת מעור למזכרת',
                forGender: 'לא משנה',
                age1: 18,
                age2: 75,
                styles: ['אישי/מרגש', 'שימושי'],
                DedicationPersonalization: true,
                category: CATEGORIES.JUDAICA,
                event: EVENTS.ENGAGEMENT,
                relationship: RELATIONSHIPS.FRIEND,
                color: 'שמנת וזהב',
                price: 120,
                image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500',
                description: 'מארז זמירונים מהודרים בכריכת דמוי עור עם הטבעת שם החתן והכלה.',
                supplier: supplierMap['yaakov@chupa-art.co.il'] || fallbackSupplier
            },

            // --- ספק 4: משה פרץ (כתר הפקות וציוד) ---
            {
                name: 'משחק קופסה אסטרטגי משפחתי - קטאן',
                forGender: 'לא משנה',
                age1: 10,
                age2: 99,
                styles: ['חווייתי', 'שימושי'],
                DedicationPersonalization: false,
                category: CATEGORIES.GAMES_TOYS,
                event: EVENTS.HOLIDAY,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'צבעוני',
                price: 190,
                image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500',
                description: 'משחק הלוח המפורסם לפיתוח חשיבה אסטרטגית ומסחר, מתאים לשעות פנאי בחג ובשבת.',
                supplier: supplierMap['moshe@keter-events.co.il'] || fallbackSupplier
            },
            {
                name: 'ערכת משחקי דרך מגנטיים לנסיעות וטיולים',
                forGender: 'לא משנה',
                age1: 5,
                age2: 15,
                styles: ['שימושי', 'חווייתי'],
                DedicationPersonalization: false,
                category: CATEGORIES.GAMES_TOYS,
                event: EVENTS.VACATION,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'כחול וצהוב',
                price: 115,
                image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500',
                description: 'מארז קומפקטי הכולל שחמט, דמקה וסולמות וחבלים מגנטיים לנסיעות ארוכות.',
                supplier: supplierMap['moshe@keter-events.co.il'] || fallbackSupplier
            },
            {
                name: 'סט עט יוקרתי ומחברת עור ממותגת למשרד',
                forGender: 'לא משנה',
                age1: 22,
                age2: 65,
                styles: ['שימושי', 'יוקרתי'],
                DedicationPersonalization: true,
                category: CATEGORIES.PAPER_BOOKS,
                event: EVENTS.APPRECIATION,
                relationship: RELATIONSHIPS.COLLEAGUE,
                color: 'שחור וכסף',
                price: 140,
                image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500',
                description: 'מארז מנהלים הכולל מחברת כריכה קשה ועט מתכת עם חריטת שם להבעת הערכה.',
                supplier: supplierMap['moshe@keter-events.co.il'] || fallbackSupplier
            },
            {
                name: 'משחק טריוויה וחידונים משפחתי לחנוכה',
                forGender: 'לא משנה',
                age1: 7,
                age2: 99,
                styles: ['חווייתי', 'מצחיק/מקורית'],
                DedicationPersonalization: false,
                category: CATEGORIES.GAMES_TOYS,
                event: EVENTS.HANUKKAH,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'כחול וזהב',
                price: 95,
                image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500',
                description: 'משחק קלפים ואתגרים מהנה לכל המשפחה סביב נרות החנוכה.',
                supplier: supplierMap['moshe@keter-events.co.il'] || fallbackSupplier
            },

            // --- ספק 5: דוד ביטון (אור ותאורה לאירועים) ---
            {
                name: 'מנורת לילה תלת-ממדית עם חריטת שם והקדשה',
                forGender: 'בת',
                age1: 11,
                age2: 14,
                styles: ['אישי/מרגש', 'דקורטיבי'],
                DedicationPersonalization: true,
                category: CATEGORIES.HOME_DESIGN,
                event: EVENTS.BAT_MITZVAH,
                relationship: RELATIONSHIPS.FRIEND,
                color: 'אור חם',
                price: 150,
                image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
                description: 'מנורת LED על בסיס עץ טבעי עם חריטת לייזר מדויקת.',
                supplier: supplierMap['david@lighting-pro.co.il'] || fallbackSupplier
            },
            {
                name: 'מנורת לילה רכה בצורת ענן לחדר תינוקות',
                forGender: 'לא משנה',
                age1: 0,
                age2: 3,
                styles: ['דקורטיבי', 'שימושי'],
                DedicationPersonalization: false,
                category: CATEGORIES.HOME_DESIGN,
                event: EVENTS.NEW_BABY,
                relationship: RELATIONSHIPS.FRIEND,
                color: 'לבן / שמנת',
                price: 110,
                image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500',
                description: 'תאורה עדינה ונעימה להאכלות לילה בחדר התינוק עם טיימר כיבוי.',
                supplier: supplierMap['david@lighting-pro.co.il'] || fallbackSupplier
            },
            {
                name: 'שרשרת תאורת LED סולארית חמה לקישוט הסוכה',
                forGender: 'לא משנה',
                age1: 20,
                age2: 80,
                styles: ['דקורטיבי', 'שימושי'],
                DedicationPersonalization: false,
                category: CATEGORIES.HOME_DESIGN,
                event: EVENTS.SUKKOT,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'אור זהב חם',
                price: 120,
                image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500',
                description: 'גרלנדת נורות חסכונית ועמידה לתנאי חוץ ליצירת אווירה חגיגית בסוכה.',
                supplier: supplierMap['david@lighting-pro.co.il'] || fallbackSupplier
            },
            {
                name: 'שובר לארוחת בוקר זוגית מפנקת',
                forGender: 'לא משנה',
                age1: 20,
                age2: 75,
                styles: ['חווייתי', 'אישי/מרגש'],
                DedicationPersonalization: false,
                category: CATEGORIES.VOUCHERS,
                event: EVENTS.ENGAGEMENT,
                relationship: RELATIONSHIPS.SPOUSE,
                color: 'זהב',
                price: 220,
                image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500',
                description: 'גיפט קארד לארוחת בוקר עשירה במבחר בתי קפה כשרים למהדרין ברחבי הארץ.',
                supplier: supplierMap['david@lighting-pro.co.il'] || fallbackSupplier
            },

            // --- ספק 6: שלמה פרידמן (אלגנס עיצוב שולחנות) ---
            {
                name: 'מפת שולחן יוקרתית דוחה כתמים + 12 מפיות בד',
                forGender: 'בת',
                age1: 22,
                age2: 80,
                styles: ['שימושי', 'דקורטיבי'],
                DedicationPersonalization: false,
                category: CATEGORIES.TEXTILE,
                event: EVENTS.PASSOVER,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'בז׳ פנינה',
                price: 260,
                image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500',
                description: 'מפה במידות 160x300 ס״מ מבד איכותי וקל לניקוי לשולחן ליל הסדר והחג.',
                supplier: supplierMap['shlomo@table-elegance.co.il'] || fallbackSupplier
            },
            {
                name: 'סט מצעים 100% כותנה סאטן למיטה זוגית',
                forGender: 'לא משנה',
                age1: 20,
                age2: 70,
                styles: ['שימושי', 'יוקרתי'],
                DedicationPersonalization: false,
                category: CATEGORIES.TEXTILE,
                event: EVENTS.WEDDING,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'לבן שלג',
                price: 450,
                image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500',
                description: 'סט מצעים רך ונעים בצפיפות חוטים גבוהה במיוחד באריזת מתנה.',
                supplier: supplierMap['shlomo@table-elegance.co.il'] || fallbackSupplier
            },
            {
                name: 'מארז לידה מפנק: שמיכת טטרה, מגבת קפוצ׳ון ודובי רך',
                forGender: 'לא משנה',
                age1: 0,
                age2: 1,
                styles: ['שימושי', 'אישי/מרגש'],
                DedicationPersonalization: true,
                category: CATEGORIES.TEXTILE,
                event: EVENTS.NEW_BABY,
                relationship: RELATIONSHIPS.COLLEAGUE,
                color: 'תכלת / ורוד פסטל',
                price: 230,
                image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500',
                description: 'מארז טקסטיל 100% כותנה אורגנית לתינוק הרך עם רקמת שם התינוק על המגבת.',
                supplier: supplierMap['shlomo@table-elegance.co.il'] || fallbackSupplier
            },
            {
                name: 'סט מגבות חוף מיקרופייבר מתייבשות במהירות בתיק נשיאה',
                forGender: 'לא משנה',
                age1: 12,
                age2: 65,
                styles: ['שימושי', 'חווייתי'],
                DedicationPersonalization: false,
                category: CATEGORIES.TEXTILE,
                event: EVENTS.VACATION,
                relationship: RELATIONSHIPS.FRIEND,
                color: 'טורקיז ואפור',
                price: 155,
                image: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=500',
                description: 'זוג מגבות קלות משקל וקומפקטיות, מושלמות לטיולים, בריכה וחופשה.',
                supplier: supplierMap['shlomo@table-elegance.co.il'] || fallbackSupplier
            },

            // --- ספק 7: חיים גולדברג (גולד אביזרים לחתונה) ---
            {
                name: 'נרתיק תפילין וטלית מקטיפה עם רקמת שם',
                forGender: 'בן',
                age1: 13,
                age2: 14,
                styles: ['יוקרתי', 'אישי/מרגש'],
                DedicationPersonalization: true,
                category: CATEGORIES.JUDAICA,
                event: EVENTS.BAR_MITZVAH,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'כחול רויאל וכסף',
                price: 350,
                image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=500',
                description: 'סט תיקי טלית ותפילין מהודרים עם רקמה אישית של שם חתן בר המצווה.',
                supplier: supplierMap['chaim@gold-accessories.co.il'] || fallbackSupplier
            },
            {
                name: 'סט כיסוי למצות ומגבת נטילת ידיים רקומים לפסח',
                forGender: 'לא משנה',
                age1: 22,
                age2: 85,
                styles: ['יוקרתי', 'דקורטיבי'],
                DedicationPersonalization: true,
                category: CATEGORIES.JUDAICA,
                event: EVENTS.PASSOVER,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'לבן וזהב',
                price: 195,
                image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=500',
                description: 'כיסוי שלוש מצות מבד קטיפה איכותי עם רקמה מרהיבה ושם המשפחה.',
                supplier: supplierMap['chaim@gold-accessories.co.il'] || fallbackSupplier
            },
            {
                name: 'מארז משלוח מנות יוקרתי במגש עץ מעוצב + בקבוק יין',
                forGender: 'לא משנה',
                age1: 18,
                age2: 85,
                styles: ['יוקרתי', 'אישי/מרגש'],
                DedicationPersonalization: true,
                category: CATEGORIES.HOME_DESIGN,
                event: EVENTS.PURIM,
                relationship: RELATIONSHIPS.COLLEAGUE,
                color: 'בורדו וזהב',
                price: 180,
                image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
                description: 'מארז פורים עשיר עם שוקולדים, אגוזים קלויים ויין בוטיק בכשרות מהודרת.',
                supplier: supplierMap['chaim@gold-accessories.co.il'] || fallbackSupplier
            },
            {
                name: 'שלט לדלת כניסה מעוצב מעץ ופליז עם שם המשפחה',
                forGender: 'לא משנה',
                age1: 22,
                age2: 80,
                styles: ['דקורטיבי', 'אישי/מרגש'],
                DedicationPersonalization: true,
                category: CATEGORIES.HOME_DESIGN,
                event: EVENTS.MOVING_HOUSE,
                relationship: RELATIONSHIPS.FRIEND,
                color: 'עץ אלון וזהב',
                price: 125,
                image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500',
                description: 'שלט מעוצב בהתאמה אישית לכניסה לבית החדש.',
                supplier: supplierMap['chaim@gold-accessories.co.il'] || fallbackSupplier
            },

            // --- ספק 8: יוסף אזולאי (גרנד דקור השכרת ציוד) ---
            {
                name: 'מגילת אסתר מאוירת לילדים עם כריכה קשיחה ורעשן עץ',
                forGender: 'לא משנה',
                age1: 4,
                age2: 12,
                styles: ['שימושי', 'מצחיק/מקורית'],
                DedicationPersonalization: false,
                category: CATEGORIES.PAPER_BOOKS,
                event: EVENTS.PURIM,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'צבעוני',
                price: 85,
                image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
                description: 'מגילה מנוקדת ומאוירת למעקב קל ומהנה בקריאת המגילה בבית הכנסת.',
                supplier: supplierMap['yosef@grand-decor.co.il'] || fallbackSupplier
            },
            {
                name: 'הגדה של פסח מאוירת ומבוארת בכריכת עור מהודרת',
                forGender: 'לא משנה',
                age1: 16,
                age2: 85,
                styles: ['יוקרתי', 'שימושי'],
                DedicationPersonalization: true,
                category: CATEGORIES.PAPER_BOOKS,
                event: EVENTS.PASSOVER,
                relationship: RELATIONSHIPS.OTHER,
                color: 'חום וזהב',
                price: 135,
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
                description: 'הגדה של פסח עם פירושים קצרים וברורים ואפשרות להטבעת שם על הכריכה.',
                supplier: supplierMap['yosef@grand-decor.co.il'] || fallbackSupplier
            },
            {
                name: 'מארז שוקולד גורמה וכרטיס ברכה מעוצב להבעת תודה',
                forGender: 'לא משנה',
                age1: 18,
                age2: 85,
                styles: ['אישי/מרגש', 'יוקרתי'],
                DedicationPersonalization: true,
                category: CATEGORIES.VOUCHERS,
                event: EVENTS.APPRECIATION,
                relationship: RELATIONSHIPS.OTHER,
                color: 'חום וזהב',
                price: 140,
                image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
                description: 'מארז פרלינים מובחרים בכשרות מהודרת עם הקדשה אישית מודפסת.',
                supplier: supplierMap['yosef@grand-decor.co.il'] || fallbackSupplier
            },
            {
                name: 'ערכת יצירה והרכבת דגם סוכה תלת-ממדית מעץ',
                forGender: 'לא משנה',
                age1: 6,
                age2: 14,
                styles: ['חווייתי', 'שימושי'],
                DedicationPersonalization: false,
                category: CATEGORIES.GAMES_TOYS,
                event: EVENTS.SUKKOT,
                relationship: RELATIONSHIPS.FAMILY,
                color: 'עץ טבעי',
                price: 90,
                image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500',
                description: 'ערכה לבנייה וצביעה של דגם סוכה לקישוט הבית בחג הסוכות.',
                supplier: supplierMap['yosef@grand-decor.co.il'] || fallbackSupplier
            }
        ];

        // ניקוי אופציונלי של מתנות קיימות לפני ההכנסה מחדש:
        // await Gift.deleteMany({});

        const insertedGifts = await Gift.insertMany(giftsData);
        console.log(`${insertedGifts.length} מתנות הוכנסו בהצלחה ומכסות את כל 15 האירועים!`);

    } catch (error) {
        console.error('שגיאה בהרצת הסקריפט:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedGifts();