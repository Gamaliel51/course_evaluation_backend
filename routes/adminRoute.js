const express = require('express')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { checkAuth } = require('../controller/authMiddleware')
const Evaluation = require('../models/Evaluation')
const Course = require('../models/Course')
const SentimentMeasure = require('../models/SentimentMeasure')
const router = express.Router()
require('dotenv').config()


router
.post('/login', (req, res) => {
    try{
        const {username, password} = req.body
        if(username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign({username: username}, process.env.ACCESS_KEY, {expiresIn: '1d'})
            return res.json({status: 'ok', accessToken: token})
        }
        res.json({status: 'fail', error: 'wrong username or password'})
    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'server error'})
    }
})
.get('/getallcourses', checkAuth, async (req, res) => {
    try{
        const courses = await Course.findAll()
        res.json({status: 'ok', data: courses})
    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'server error'})
    }
})
.get('/getallevals', checkAuth, async (req, res) => {
    try{
        const evals = await Evaluation.findAll()
        res.json({status: 'ok', data: evals})
    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'server error'})
    }
})
.get('/evaldetails/:id', checkAuth, async (req, res) => {
    try{
        const params = req.params
        const eval  = await Evaluation.findOne({where: {eval_id: params.id}})
        if(eval){
            return res.json({
                status: 'ok',
                eval_id: eval.eval_id,
                courseid: eval.courseid,
                coursename: eval.coursename,
                assessment: eval.assessment,
                engage: eval.engage,
                ethics: eval.ethics,
                punctual: eval.punctual,
                teaching: eval.teaching,
                student_sentiment: eval.student_sentiment,
                students_done: eval.students_done,
                date: eval.date
            })
        }
        res.json({status: 'fail'})
    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'server error'})
    }
})
.get('/evalsentiment/:id', checkAuth, async (req, res) => {
    try{
        const params = req.params
        const eval  = await SentimentMeasure.findOne({where: {eval_id: params.id}})
        if(eval){
            return res.json({
                status: 'ok',
                eval_id: eval.eval_id,
                good: eval.good_count,
                bad: eval.bad_count
            })
        }
        res.json({status: 'fail'})
    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'server error'})
    }
})
.post('/addcourse', checkAuth, async (req, res) => {
    try{
        const {courseid, coursename, program} = req.body
        const find = await Course.findOne({where: {courseid: courseid}})
        if(find){
            return res.json({status: 'fail', error: 'Course already exists'})
        }
        const new_course = await Course.create({
            courseid: courseid,
            coursename: coursename,
            program: program,
            students: []
        })
        await new_course.save()
        res.json({status: 'ok'})
    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'error at server'})
    }
})
.post('/addevaluation', checkAuth, async (req, res) => {
    try{
        const {courseid, coursename} = req.body
        const find = await Course.findOne({where: {courseid: courseid}})
        if(!find){
            return res.json({status: 'fail', error: 'No such course exists'})
        }
        const eval_id = crypto.randomUUID()
        const new_eval = await Evaluation.create({
            eval_id: eval_id,
            courseid: courseid,
            coursename: find.coursename,
            punctual: 0, 
            assessment: 0, 
            engage: 0, 
            teaching: 0, 
            ethics: 0,
            student_sentiment: 0,
            students_done: [],
            date: Date.now().toString()
        })
        const new_sentiment = await SentimentMeasure.create({
            eval_id: eval_id,
            good_count: 0,
            bad_count: 0
        })

        await new_eval.save()
        await new_sentiment.save()
        res.json({status: 'ok'})
    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'server error'})
    }
})
.post('/removecourse', checkAuth, async (req, res) => {
    try{
        const {courseid} = req.body

        const course = await Course.findOne({where: {courseid: courseid}})
        await course.destroy()

        res.json({status: 'ok'})
    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'server error'})
    }
})
.post('/removeevaluation', checkAuth, async (req, res) => {
    try{
        const {eval_id} = req.body
        const eval = await Evaluation.findOne({where: {eval_id: eval_id}})
        await eval.destroy()

        res.json({status: 'ok'})
    }
    catch(e){
        console.error(e)
        res.json({status: 'fail', error: 'server error'})
    }
})



module.exports = router