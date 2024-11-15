
const convertToStandard = text => { 
    const data = text.split(' '); 
    data.forEach((word, index) => { 
        Object.keys(wordDict).forEach(key => { 
            if (key === word.toLowerCase()) { 
                data[index] = wordDict[key] 
            }; 
        }); 
    }); 
  
    return data.join(' '); 
}

const convertTolowerCase = text => { 
    return text.toLowerCase(); 
}

const removeNonAlpha = text => { 
  
    // This specific Regex means that replace all 
    //non alphabets with empty string. 
    return text.replace(/[^a-zA-Z\s]+/g, ''); 
}

const wordDict = { 
    "aren't": "are not", 
    "can't": "cannot", 
    "couldn't": "could not", 
    "didn't": "did not", 
    "doesn't": "does not", 
    "don't": "do not", 
    "hadn't": "had not", 
    "hasn't": "has not", 
    "haven't": "have not", 
    "he'd": "he would", 
    "he'll": "he will", 
    "he's": "he is", 
    "i'd": "I would", 
    "i'd": "I had", 
    "i'll": "I will", 
    "i'm": "I am", 
    "isn't": "is not", 
    "it's": "it is", 
    "it'll": "it will", 
    "i've": "I have", 
    "let's": "let us", 
    "mightn't": "might not", 
    "mustn't": "must not", 
    "shan't": "shall not", 
    "she'd": "she would", 
    "she'll": "she will", 
    "she's": "she is", 
    "shouldn't": "should not", 
    "that's": "that is", 
    "there's": "there is", 
    "they'd": "they would", 
    "they'll": "they will", 
    "they're": "they are", 
    "they've": "they have", 
    "we'd": "we would", 
    "we're": "we are", 
    "weren't": "were not", 
    "we've": "we have", 
    "what'll": "what will", 
    "what're": "what are", 
    "what's": "what is", 
    "what've": "what have", 
    "where's": "where is", 
    "who'd": "who would", 
    "who'll": "who will", 
    "who're": "who are", 
    "who's": "who is", 
    "who've": "who have", 
    "won't": "will not", 
    "wouldn't": "would not", 
    "you'd": "you would", 
    "you'll": "you will", 
    "you're": "you are", 
    "you've": "you have", 
    "'re": " are", 
    "wasn't": "was not", 
    "we'll": " will", 
    "didn't": "did not"
}


module.exports = {convertToStandard, convertTolowerCase, removeNonAlpha, wordDict}