const { DataTypes } = require('sequelize')
const sequelize = require('./connectDB')

const Engage = sequelize.define('Engage', {
    question: {
        type: DataTypes.STRING
    },
    score: {
        type: DataTypes.INTEGER
    },
})

Engage.sync()

module.exports = Engage