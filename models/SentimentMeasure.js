const { DataTypes } = require('sequelize')
const sequelize = require('./connectDB')

const SentimentMeasure = sequelize.define('SentimentMeasure', {
    eval_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    good_count: {
        type: DataTypes.INTEGER,
    },
    bad_count: {
        type: DataTypes.INTEGER
    }
})

SentimentMeasure.sync()

module.exports = SentimentMeasure