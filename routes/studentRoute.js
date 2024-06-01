const express = require('express')
const { checkAuth } = require('../controller/authMiddleware')
const { Sequelize } = require('sequelize')
const Student = require('../models/Student')
const Course = require('../models/Course')
const Evaluation = require('../models/Evaluation')
const Punctual = require('../models/Punctual')
const Assessment = require('../models/Assessment')
const Engage = require('../models/Engage')
const Teaching = require('../models/Teaching')
const Ethics = require('../models/Ethics')
const { performSentimentAnalysis } = require('../controller/sentimentAnalysis')
const SentimentMeasure = require('../models/SentimentMeasure')
const router = express.Router()


router
.get('/name', checkAuth, async (req, res) => {
    const studentid = req.user.username

    const student = await Student.findOne({where: {studentid: studentid}})
    if(student){
        const student_data = {fullname: student.fullname}
        return res.json({status: 'ok', data: student_data})
    }
})
.get('/profile', checkAuth, async (req, res) => {
    const studentid = req.user.username

    const student = await Student.findOne({where: {studentid: studentid}})
    if(student){
        const student_data = {fullname: student.fullname, courses: student.courses, evals_done: student.evals_done}
        return res.json({status: 'ok', data: student_data})
    }
})
.get('/allcourses', checkAuth, async (req, res) => {
    try{
        const courses = await Course.findAll()
        const send_data = courses.map((course) => {
            return {courseid: course.courseid, coursename: course.coursename, program: course.program}
        })
        res.json({status: 'ok', data: send_data})
    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'server error'})
    }
})
.get('/evals/:id', checkAuth, async (req, res) => { // get all course evaluations for course using ID
    try{
        const studentid = req.user.username
        const params = req.params

        const evals = await Evaluation.findAll({where: {courseid: params.id}})
        if(evals){
            const eval_data = evals.map((eval) => {

                // if student has not done evaluation send it.
                if(!evals.includes(studentid)){
                    return {eval_id: eval.eval_id, courseid: eval.courseid, coursename: eval.coursename}
                }
            })
            return res.json({status: 'ok', data:eval_data})
        }
        res.json({status: 'ok', data: []})
    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'server error'})
    }
})
.get('/evalquestions', checkAuth, async (req, res) => {
    try{

        const questions = {
            "punctuality": [],
            "assessment": [],
            "engagement": [],
            "teaching_ability": [],
            "ethics": [],
        }

        // Get questions for each score for every category - 15 points for each
        for(let i=1; i < 6; i++){
            const punc_question = await Punctual.findOne({where: {score: i}, order: Sequelize.literal('RANDOM()')})
            questions.punctuality.push({id: `punctuality_${i}`, question: punc_question.question, score: punc_question.score})

            const assess_question = await Assessment.findOne({where: {score: i}, order: Sequelize.literal('RANDOM()')})
            questions.assessment.push({id: `assessment_${i}`, question: assess_question.question, score: assess_question.score})

            const engage_question = await Engage.findOne({where: {score: i}, order: Sequelize.literal('RANDOM()')})
            questions.engagement.push({id: `engagement_${i}`, question: engage_question.question, score: engage_question.score})

            const teach_question = await Teaching.findOne({where: {score: i}, order: Sequelize.literal('RANDOM()')})
            questions.teaching_ability.push({id: `teaching_${i}`, question: teach_question.question, score: teach_question.score})

            const ethic_question = await Ethics.findOne({where: {score: i}, order: Sequelize.literal('RANDOM()')})
            questions.ethics.push({id: `ethics_${i}`, question: ethic_question.question, score: ethic_question.score})
        }

        res.json({status: 'ok', data: questions})

    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'server error'})
    }
})
.post('/registercourse', checkAuth, async (req, res) => {
    try{
        const { courseid, coursename } = req.body
        const studentid = req.user.username

        const student = await Student.findOne({where: {studentid: studentid}})
        const course = await Course.findOne({where: {courseid: courseid}})
        if(student){
            const temp = Object.assign([], student.courses)
            temp.push(`${courseid};${coursename}`)
            student.courses = temp
            await student.update({courses: temp})

            const tempcourse = Object.assign([], course.students)
            tempcourse.push(`${studentid};${student.fullname}`)
            course.students = tempcourse
            await course.update({students: tempcourse})

            await student.save()
            await course.save()

            return res.json({status: 'ok'})
        }
        res.json({status: 'fail'})
    }
    catch(e){
        console.error(e)
        res.json({status: 'error', error: 'server error'})
    }
})
.post('/unregistercourse', checkAuth, async (req, res) => {
    try{
        const { courseid, coursename } = req.body
        const studentid = req.user.username

        const student = await Student.findOne({where: {studentid: studentid}})
        const course = await Course.findOne({where: {courseid: courseid}})
        if(student){
            const temp = Object.assign([], student.courses)
            temp.splice(temp.indexOf(`${courseid};${coursename}`), 1)
            student.courses = temp
            await student.update({courses: temp})

            const tempcourse = Object.assign([], course.students)
            tempcourse.splice(tempcourse.indexOf(`${studentid};${student.fullname}`), 1)
            course.students = tempcourse
            await course.update({students: tempcourse})

            await student.save()
            await course.save()

            return res.json({status: 'ok'})
        }
        res.json({status: 'fail'})
    }
    catch(e){
        console.error(e)
        res.json({status: 'error', error: 'server error'})
    }
})
.post('/evalquestions/:id', checkAuth, async (req, res) => { // update evaluation record score using evaluation ID
    const result = req.body
    // const result = {
    //     "punctuality": 15,
    //     "assessment": 15,
    //     "engagement": 15,
    //     "teaching_ability": 15,
    //     "ethics": 15,
    //     "student_sentiment": 15
    // }
    const studentid = req.user.username
    const params = req.params
    const sentiment_score = performSentimentAnalysis(result.student_sentiment.replace('\n', ' ').replace('+', ' '))

    const student = await Student.findOne({where: {studentid: studentid}})
    const temp = Object.assign([], student.evals_done)
    temp.push(params.id)


    const eval = await Evaluation.findOne({where: {eval_id: params.id}})
    const punctuality = eval.punctual + result.punctuality
    const assessment = eval.assessment + result.assessment
    const engagement = eval.engage + result.engagement
    const teaching_ability = eval.teaching + result.teaching_ability
    const ethics = eval.ethics + result.ethics
    const sentiment = eval.student_sentiment + sentiment_score


    await student.update({evals_done: temp})
    await student.save()

    const tempList = Object.assign([], eval.students_done)
    tempList.push(studentid)
    eval.students_done = tempList

    await eval.update({
        punctual: punctuality, 
        assessment: assessment, 
        engage: engagement, 
        teaching: teaching_ability, 
        ethics: ethics,
        student_sentiment: sentiment,
        students_done: tempList
    })

    await eval.save()


    const sentiment_obj = await SentimentMeasure.findOne({where: {eval_id: params.id}})
    if(sentiment_score > 0){
        let temp = sentiment_obj.good_count
        temp = temp + 1
        sentiment_obj.good_count = temp
        await sentiment_obj.update({good_count: temp})
    }

    if(sentiment_score < 0){
        let temp = sentiment_obj.bad_count
        temp = temp + 1
        sentiment_obj.bad_count = temp
        await sentiment_obj.update({bad_count: temp})
    }

    await sentiment_obj.save()
    
    res.json({status: 'ok'})

})



module.exports = router