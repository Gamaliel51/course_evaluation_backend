const { DataTypes } = require('sequelize')
const sequelize = require('./connectDB')

const Evaluation = sequelize.define('Evaluation', {
    eval_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    courseid: {
        type: DataTypes.STRING
    },
    coursename: {
        type: DataTypes.STRING
    },
    assessment: {
        type: DataTypes.INTEGER
    },
    engage: {
        type: DataTypes.INTEGER
    },
    ethics: {
        type: DataTypes.INTEGER
    },
    punctual: {
        type: DataTypes.INTEGER
    },
    teaching: {
        type: DataTypes.INTEGER
    },
    student_sentiment: {
        type: DataTypes.FLOAT
    },
    students_done: {
        type: DataTypes.ARRAY(DataTypes.STRING) // student ids
    },
    date: {
        type: DataTypes.STRING
    },
})

Evaluation.sync()

module.exports = Evaluation