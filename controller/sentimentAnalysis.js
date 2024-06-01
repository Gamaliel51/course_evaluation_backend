const natural = require('natural')
const stopword = require('stopword')
const { convertToStandard, convertTolowerCase, removeNonAlpha } = require("./utility_functions");


const performSentimentAnalysis = (text) => {

    const lexData = convertToStandard(text)

    const lowerCaseData = convertTolowerCase(lexData)

    const onlyAlpha = removeNonAlpha(lowerCaseData)

    const tokenConstructor = new natural.WordTokenizer(); 
    const tokenizedData = tokenConstructor.tokenize(onlyAlpha)

    const filteredData = stopword.removeStopwords(tokenizedData)

    const Sentianalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn')

    const analysis_score = Sentianalyzer.getSentiment(filteredData)

    return analysis_score
}


module.exports = {performSentimentAnalysis}