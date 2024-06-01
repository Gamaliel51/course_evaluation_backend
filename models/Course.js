const { DataTypes } = require('sequelize')
const sequelize = require('./connectDB')

const Course = sequelize.define('Course', {
    courseid: {
        type: DataTypes.STRING
    },
    coursename: {
        type: DataTypes.STRING
    },
    program: {
        type: DataTypes.STRING
    },
    students: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
})

Course.sync()

module.exports = Course