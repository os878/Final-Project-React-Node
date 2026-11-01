const Gift = require('../models/gift')
const mongoose = require('mongoose')

const matchGifts = async (req, res) => {
    const { forGender, age, category, event, relationship, color, price } = req.body

    // בדיקת שדות חובה לפי המודל 
  
  // אני רוצה לסננן מתנות על פי מה שקיבלתי
  //קיראה לפונקציה שמביאה את כל המתנות  
  //סינון
  //זה מתנות שזהות בדיוק לבקשה שלי
// מחשבת כמה מתנה מתאימה לתשובות של הלקוח
const calcScore = (gift, answers) => {
    let score = 0

    // התאמה לפי סוג הקשר
    if (gift.relationship.toString() === answers.relationship) {
        score += 30
    }

    // התאמה לפי גיל
    if (answers.age >= gift.age1 && answers.age <= gift.age2) {
        score += 25
    }

    // התאמה לפי סגנון המתנה
    if (gift.styles.includes(answers.style)) {
        score += 10
    }

    // התאמה לפי צבע
    if (gift.color === answers.favoriteColor) {
        score += 15
    }

    // התאמה לפי תקציב
    if (gift.price <= answers.budget) {
        score += 20
    }

    return score
}
const getMatchingGifts = async (answers) => {
  const gifts = await Gift.find()
  const scoredGifts = gifts.map(gift => ({
    gift,
    score: calcScore(gift, answers)
  }))
  scoredGifts.sort((a, b) => b.score - a.score)//מיון מהכי מתאים להכי פחות מתאים
  return scoredGifts.filter(g => g.score > 0)
}
//מתנות שזהות על פי אחוזים

}