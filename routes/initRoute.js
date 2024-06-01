const express = require('express')
const questions = require('../models/questions.json')
const Assessment = require('../models/Assessment')
const Engage = require('../models/Engage')
const Ethics = require('../models/Ethics')
const Punctual = require('../models/Punctual')
const Teaching = require('../models/Teaching')
const router = express.Router()

router
.get('/questionbank', async (req, res) => {
    try{
        questions.assessment.map(async (item) => {
            const ques = await Assessment.create({
                question: item.question,
                score: item.score
            })
    
            await ques.save()
        })
        questions.engagement.map(async (item) => {
            const ques = await Engage.create({
                question: item.question,
                score: item.score
            })
    
            await ques.save()
        })
        questions.ethics.map(async (item) => {
            const ques = await Ethics.create({
                question: item.question,
                score: item.score
            })
    
            await ques.save()
        })
        questions.punctuality.map(async (item) => {
            const ques = await Punctual.create({
                question: item.question,
                score: item.score
            })
    
            await ques.save()
        })
        questions['teaching ability'].map(async (item) => {
            const ques = await Teaching.create({
                question: item.question,
                score: item.score
            })
    
            await ques.save()
        })

        return res.json({status: 'ok'})
    }
    catch(e){
        console.error(e)
        return res.json({status: 'fail'})
    }
})

module.exports = router