const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Student = require('../models/Student')
const { checkAuth } = require('../controller/authMiddleware')
const router = express.Router()

router
.post('/signup', async (req, res) => {
    const  { studentid, password, fullname } = req.body

    const in_use = await Student.findOne({where: {studentid: studentid.toLowerCase()}})
    if(in_use){
        return res.json({status: 'fail', error: 'username already in use'})
    }

    const hashedPass = await bcrypt.hash(password, 10)

    const user = await Student.create({
        studentid: studentid.toLowerCase(),
        password: hashedPass,
        fullname: fullname,
        courses: [],
        evals_done: [],
    })

    await user.save()

    res.json({status: 'ok'})
})
.post('/login', async (req, res) => {
    const { studentid, password } = req.body

    if(req.user){
        return res.json({status: 'ok', message: 'loggedin'})
    }

    const user = await Student.findOne({where: {studentid: studentid.toLowerCase()}})

    if(user){
        const passcheck  = await bcrypt.compare(password, user.password)
        if(passcheck){
            const token = jwt.sign({username: user.studentid}, process.env.ACCESS_KEY, {expiresIn: '1d'})
            return res.json({status: 'ok', accessToken: token})
        }
        return res.json({status: 'fail', error: 'wrong username or password'})
    }
    else{
        res.json({status: 'fail', error: 'wrong username or password'})
    }
})


module.exports = router