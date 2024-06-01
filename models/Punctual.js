const { DataTypes } = require('sequelize')
const sequelize = require('./connectDB')

const Punctual = sequelize.define('Punctual', {
    question: {
        type: DataTypes.STRING
    },
    score: {
        type: DataTypes.INTEGER
    },
})

Punctual.sync()

module.exports = Punctual