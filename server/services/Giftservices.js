const Gift = require('../models/gift')

const matchGifts = async (answers) => {

    // בדיקת שדות חובה לפי המודל 
  
  // אני רוצה לסננן מתנות על פי מה שקיבלתי
  //קיראה לפונקציה שמביאה את כל המתנות  
  //סינון
  //זה מתנות שזהות בדיוק לבקשה שלי
// מחשבת כמה מתנה מתאימה לתשובות של הלקוח
const calcScore = (gift, answers) => {
    let score = 0

    // התאמה לפי סוג הקשר
    if (
        gift.relationship?.name === answers.relationship ||
        gift.relationship?._id?.toString() === answers.relationship
    ) {
        score += 30
    }

    // התאמה לפי גיל
    if (
        answers.age !== '' &&
        Number.isFinite(Number(answers.age)) &&
        Number(answers.age) >= gift.age1 &&
        Number(answers.age) <= gift.age2
    ) {
        score += 25
    }

    // התאמה לפי סגנון המתנה
    if (
        Array.isArray(answers.styles) &&
        answers.styles.some(style => gift.styles.includes(style))
    ) {
        score += 10
    }

    // התאמה לפי צבע
    if (answers.color && gift.color === answers.color) {
        score += 15
    }

    // התאמה לפי תקציב
    if (
        answers.price !== '' &&
        Number.isFinite(Number(answers.price)) &&
        gift.price <= Number(answers.price)
    ) {
        score += 20
    }

    return score
}
const getMatchingGifts = async (answers) => {
  const gifts = await Gift.find().populate('relationship')
  const scoredGifts = gifts.map(gift => ({
    gift,
    score: calcScore(gift, answers)
  }))
  scoredGifts.sort((a, b) => b.score - a.score)//מיון מהכי מתאים להכי פחות מתאים
  return scoredGifts.filter(g => g.score > 0)
}
  return getMatchingGifts(answers)
//מתנות שזהות על פי אחוזים

}

module.exports = matchGifts