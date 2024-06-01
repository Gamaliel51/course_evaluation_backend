const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')

const initRoute = require('./routes/initRoute')
const adminRoute = require('./routes/adminRoute')
const studentRoute = require('./routes/studentRoute')
const authStudentRoute = require('./routes/authStudentRoute')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/init', cors(), initRoute)
app.use('/auth/student', cors(), authStudentRoute)
app.use('/student', cors(), studentRoute)
app.use('/admin', cors(), adminRoute)

app.get('/test', (req, res) => {
    res.send('active')
})

app.get("*", (req, res) => {
    res.send("Error")
})

app.listen(process.env.PORT)
