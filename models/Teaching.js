const { DataTypes } = require('sequelize')
const sequelize = require('./connectDB')

const Teaching = sequelize.define('Teaching', {
    question: {
        type: DataTypes.STRING
    },
    score: {
        type: DataTypes.INTEGER
    },
})

Teaching.sync()

module.exports = Teaching