const { DataTypes } = require('sequelize')
const sequelize = require('./connectDB')

const Student = sequelize.define('Student', {
    studentid: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    fullname: {
        type: DataTypes.STRING
    },
    courses: {
        type: DataTypes.ARRAY(DataTypes.STRING) // courseid;coursename;program
    },
    evals_done: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
})

Student.sync()

module.exports = Student