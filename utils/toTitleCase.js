function capitalizeFirstLetterOfEachWord(str) {
    return str
        .split(' ')               // Split the string into an array of words
        .map(word =>               // For each word
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()  // Capitalize the first character and combine it with the rest of the word
        )
        .join(' ');                // Join the words back into a string
}

module.exports = capitalizeFirstLetterOfEachWord;