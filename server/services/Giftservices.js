const Gift = require('../models/gift')

/* ===== התאמת מתנות לתשובות השאלון =====
   שלב 1 – סינון: מתנות שלא עומדות בדרישה מפורשת של הלקוח לא מוצגות בכלל
            (מעל התקציב, לא בטווח הגיל, מגדר אחר, אין הקדשה כשביקשו).
   שלב 2 – ניקוד: לכל קריטריון שהלקוח ענה עליו יש משקל. אחוז ההתאמה מחושב
            רק מתוך מה שהלקוח באמת ענה, כך שדילוג על שאלה לא "מוריד" אחוזים.
   שלב 3 – מיון מהמתאימה ביותר, והצגת מתנות שעוברות סף התאמה מינימלי. */

// משקל כל קריטריון (כמה הוא חשוב בהתאמה)
const WEIGHTS = {
    event: 30,        // לאיזה אירוע
    relationship: 25, // מה הקשר
    category: 25,     // תחום
    styles: 15,       // סגנון
    color: 5,         // צבע
}

// אחוז התאמה מינימלי כדי שמתנה תוצג
const MIN_SCORE = 40

// ---------- עזרים ----------
const isFilled = (value) => value !== undefined && value !== null && String(value).trim() !== ''

const toNumber = (value) => (isFilled(value) && Number.isFinite(Number(value)) ? Number(value) : null)

// מזהה של שדה שיכול להיות id, אובייקט מאוכלס (populate), או שם
const idOf = (field) => (field && typeof field === 'object' ? String(field._id ?? '') : String(field ?? ''))

// בדיקת התאמה לפריט בודד (לפי id או לפי שם)
const isSingleOptionMatch = (item, answerId, answerName) => {
    if (!item) return false
    const itemId = idOf(item)
    const itemName = typeof item === 'object' ? item.name : null
    return (isFilled(answerId) && itemId === String(answerId)) ||
           (isFilled(answerName) && itemName === answerName) ||
           (isFilled(answerId) && itemName === answerId) // אם נשלח שם במקום id
}

// בדיקת התאמה מול מערך במתנה (או מול שדה בודד לתאימות לאחור)
const matchesOption = (giftFieldOrArray, answerId, answerName) => {
    if (!giftFieldOrArray) return false
    if (Array.isArray(giftFieldOrArray)) {
        return giftFieldOrArray.some((item) => isSingleOptionMatch(item, answerId, answerName))
    }
    return isSingleOptionMatch(giftFieldOrArray, answerId, answerName)
}

// "זהב, כחול" → ['זהב', 'כחול']
const splitList = (text) => String(text ?? '')
    .split(/[,،/]+/)
    .map((part) => part.trim())
    .filter(Boolean)

// ---------- שלב 1: סינון לפי דרישות מפורשות ----------
const passesRequirements = (gift, answers) => {
    // תקציב: מתנה מעל התקציב לא מוצגת
    const budget = toNumber(answers.price)
    if (budget !== null && Number(gift.price) > budget) return false

    // גיל: חייב להיות בטווח של המתנה (אם הלקוח ציין גיל)
    const age = toNumber(answers.age)
    if (age !== null) {
        const min = toNumber(gift.age1)
        const max = toNumber(gift.age2)
        if ((min !== null && age < min) || (max !== null && age > max)) return false
    }

    // מגדר: "בן" לא יקבל מתנה שמיועדת רק ל"בת" (ולהפך)
    const wanted = answers.forGender
    const giftGender = gift.forGender || 'לא משנה'
    if (isFilled(wanted) && wanted !== 'לא משנה' && giftGender !== 'לא משנה' && giftGender !== wanted) {
        return false
    }

    // הקדשה: אם הלקוח ביקש אפשרות הקדשה – רק מתנות שמאפשרות
    if (answers.DedicationPersonalization === true || answers.DedicationPersonalization === 'true') {
        if (!(gift.DedicationPersonalization === true || gift.DedicationPersonalization === 'true')) return false
    }

    return true
}

// ---------- שלב 2: ניקוד ----------
const calcScore = (gift, answers) => {
    let earned = 0
    let possible = 0 // כמה נקודות אפשר היה לקבל לפי מה שהלקוח ענה

    // אירוע (בודק במערך events)
    if (isFilled(answers.event) || isFilled(answers.eventName)) {
        possible += WEIGHTS.event
        if (matchesOption(gift.events || gift.event, answers.event, answers.eventName)) {
            earned += WEIGHTS.event
        }
    }

    // קשר (בודק במערך relationships)
    if (isFilled(answers.relationship) || isFilled(answers.relationshipName)) {
        possible += WEIGHTS.relationship
        if (matchesOption(gift.relationships || gift.relationship, answers.relationship, answers.relationshipName)) {
            earned += WEIGHTS.relationship
        }
    }

    // קטגוריה (בודק במערך categories)
    if (isFilled(answers.category) || isFilled(answers.categoryName)) {
        possible += WEIGHTS.category
        if (matchesOption(gift.categories || gift.category, answers.category, answers.categoryName)) {
            earned += WEIGHTS.category
        }
    }

    // סגנון: לפי כמה מהסגנונות שהלקוח בחר יש במתנה
    const wantedStyles = Array.isArray(answers.styles) ? answers.styles : []
    if (wantedStyles.length > 0) {
        possible += WEIGHTS.styles
        const giftStyles = Array.isArray(gift.styles) ? gift.styles : []
        const matched = wantedStyles.filter((style) => giftStyles.includes(style)).length
        earned += WEIGHTS.styles * (matched / wantedStyles.length)
    }

    // צבע: מספיק שאחד הצבעים שהלקוח בחר מופיע במתנה ("לא משנה" לא נספר)
    const wantedColors = splitList(answers.color).filter((c) => c !== 'לא משנה')
    if (wantedColors.length > 0) {
        possible += WEIGHTS.color
        const giftColors = splitList(gift.color)
        if (wantedColors.some((color) => giftColors.includes(color))) earned += WEIGHTS.color
    }

    // הלקוח לא ענה על אף קריטריון של ניקוד – כל מה שעבר את הסינון מתאים
    if (possible === 0) return 100

    return Math.round((earned / possible) * 100)
}

// ---------- שלב 3: הפונקציה הראשית ----------
const matchGifts = async (answers = {}) => {
    const gifts = await Gift.find()
        .populate('relationships')
        .populate('events')
        .populate('categories')

    return gifts
        .filter((gift) => passesRequirements(gift, answers))
        .map((gift) => ({ gift, score: calcScore(gift, answers) }))
        .filter((result) => result.score >= MIN_SCORE)
        // מיון: קודם לפי אחוז התאמה, ובשוויון – הזולה יותר קודם
        .sort((a, b) => b.score - a.score || Number(a.gift.price) - Number(b.gift.price))
}

module.exports = matchGifts