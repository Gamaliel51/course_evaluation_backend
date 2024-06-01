const { DataTypes } = require('sequelize')
const sequelize = require('./connectDB')

const Assessment = sequelize.define('Assessment', {
    question: {
        type: DataTypes.STRING
    },
    score: {
        type: DataTypes.INTEGER
    },
})

Assessment.sync()

module.exports = Assessment