export function increaseWordCount(wordCount, allowedGuesses=6) {
  if (wordCount !== 8) {
  
    resetStyles()

    for (let r = 0; r < allowedGuesses; r++) {
      let guess = document.getElementById(r)

      for (let c = wordCount; c < wordCount+1; c++) {
          let tile = document.createElement('div')
          tile.id = r.toString() + '-' + c.toString()
          tile.classList.add('tile')
          guess.appendChild(tile)
      }
    }
    wordCount += 1
  }
  return wordCount
}

export function decreaseWordCount(wordCount, allowedGuesses=6) {

  if (wordCount !== 3) {
    wordCount -= 1
    resetStyles()

    for (let r = 0; r < allowedGuesses; r++) {
      let guess = document.getElementById(r)
      for (let c = wordCount; c < wordCount+1; c++) {
          let lastTile = document.getElementById(r.toString() + '-' + c.toString())
          guess.removeChild(lastTile)
      }
    }
  }
  return wordCount
}

function resetStyles() {

  let tiles = document.querySelectorAll('.tile')
  let keys = document.querySelectorAll('.key')

  tiles.forEach(tile => {
    tile.setAttribute('class', 'tile')
    tile.innerText = ''
  })

  keys.forEach(tile => {
    tile.setAttribute('class', 'key')
  })
}

export function loadRandomWord(show=false) {
    const number = Math.floor(Math.random() * 6)
    if (show){
      console.log('Random Number: ', number)
    }
    return number
}

export function getCorrectWord(wordCount, correctWords) {
  const correctWord = correctWords[wordCount]
  return correctWord
}

export function checkWord(word, wordCount, validWords) {
  const wordList = validWords[wordCount]
  const isValid = wordList.includes(word)
  if (!isValid) {
    console.log(`${word} is not a valid word`)
  }
  return isValid
}