const { DataTypes } = require('sequelize')
const sequelize = require('./connectDB')

const Ethics = sequelize.define('Ethics', {
    question: {
        type: DataTypes.STRING
    },
    score: {
        type: DataTypes.INTEGER
    },
})

Ethics.sync()

module.exports = Ethics