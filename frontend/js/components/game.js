import { increaseWordCount, decreaseWordCount, getCorrectWord, checkWord } from "../utils.js";
import { getGame } from '../start.js'


const moreLetterButton = document.querySelector('#more-btn')
const lessLetterButton = document.querySelector('#less-btn')
const errorMessage = document.querySelector('#error-modal')
const gameOverMessage = document.querySelector('#game-over-modal')
const resultContainer = document.querySelector('#end-game')
const navContainer = document.querySelector('#navigation-container')
const solutionWord = document.querySelector('#solution')
const nextButton = document.querySelector('#next-button')
let wordNumber = document.getElementById('word-number')
let currentGuess = ''


nextButton.addEventListener('click', () => {
  nextButton.blur()
  increaseLetterCount(true)
  gameOverMessage.style.visibility = 'hidden'
});

moreLetterButton.addEventListener('click', () => {
  moreLetterButton.blur()
  increaseLetterCount(true)
});

lessLetterButton.addEventListener('click', () => {
  lessLetterButton.blur()
  increaseLetterCount(false)
});

function increaseLetterCount(increase){
  const game = getGame()
  let newValue = 0
  if (increase){
    newValue = increaseWordCount(game.wordCount)
  } else {
    newValue = decreaseWordCount(game.wordCount)
  }
  game.updateWordCount(newValue)
  wordNumber.innerHTML = newValue
  currentGuess = ''
  game.resetGame()
}

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener("click", processKey);
  }
)

document.addEventListener('keyup', (e) => {
  processInput(e)
})

function processKey() {
    let e = { "code" : this.id };
    processInput(e);
}

function processInput(e) {
  const game = getGame()
  if (game.gameOver) return
  let key = e.code
  
  if ('KeyA' <= key && key <= 'KeyZ'){
    if (game.col < game.wordCount){
      let currentTile = document.getElementById(game.row.toString() + '-' + game.col.toString())
      if (currentTile.innerText == '') {
        let letter = key[3]
        currentTile.innerText = letter 
        currentGuess += letter
        game.updateColumn(game.col + 1)
      }
    }
  }
  else if (key == 'Backspace') {
    if (0 < game.col && game.col <= game.wordCount){
      game.updateColumn(game.col - 1)}
    let currentTile = document.getElementById(game.row.toString() + '-' + game.col.toString())
    currentTile.innerText = ''
    currentGuess = currentGuess.slice(0, -1)
  }
  else if (key == 'Enter' && currentGuess.length === game.wordCount) {
    navContainer.style.visibility = 'hidden'
    applyGuess()
  }
  if (!game.gameOver && game.row == game.allowedGuesses){
    navContainer.style.visibility = 'visible'
    gameOverMessage.style.visibility = 'visible'

    resultContainer.classList.add('lose')
    resultContainer.innerText = 'Game Over'
    const correctWord = getCorrectWord(game.wordCount, window.correctWords)
    solutionWord.innerText = correctWord

    document.addEventListener('keyup', function(event) {
      if (event.key === 'Escape') {
        gameOverMessage.style.visibility = 'hidden'
      }
    })

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#game-over-modal')) {
          gameOverMessage.style.visibility = 'hidden'
        }
      }
    )
    game.finishGame()
  }
}

function applyGuess() {
  const game = getGame()
  const isValid = checkWord(currentGuess, game.wordCount, window.validWords, errorMessage)
  if (!isValid){
    return
  }
  let correct = 0
  let letterCount = {} //KENNY -> {K:1, E:1, N:2, Y:1}
  currentGuess = ''
  const correctWord = getCorrectWord(game.wordCount, window.correctWords)

  for (let i=0; i < correctWord.length; i++) {
    let letter = correctWord[i]
    if (letterCount[letter]) {
      letterCount[letter] += 1
    }
    else {
      letterCount[letter] = 1
    }
  }

  // FIRST ITERATION
  for (let c = 0; c < game.wordCount; c++) {
    let currentTile = document.getElementById(game.row.toString() + '-' + c.toString())
    let letter = currentTile.innerText

    if (correctWord[c] == letter) {
      currentTile.classList.add('correct')
      
      let key = document.getElementById('Key' + letter)
      key.classList.remove('present')
      key.classList.add('correct')

      correct += 1
      letterCount[letter] -= 1
    }

    if (correct == game.wordCount) {
      navContainer.style.visibility = 'visible'
      gameOverMessage.style.visibility = 'visible'
      resultContainer.classList.remove('lose')
      resultContainer.classList.add('win')
      resultContainer.innerText = 'You Won!'
      
      const correctWord = getCorrectWord(game.wordCount, window.correctWords)
      solutionWord.innerText = correctWord
      
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#game-over-modal')) {
            gameOverMessage.style.visibility = 'hidden'
          }
        }
      )
      game.finishGame()
    }
  }

  // SECOND ITERATION
  for (let c = 0; c < game.wordCount; c++) {
    let currentTile = document.getElementById(game.row.toString() + '-' + c.toString())
    let letter = currentTile.innerText

    if (!currentTile.classList.contains('correct')) {
      // iS IT IN THE WORD?
      if (correctWord.includes(letter) && letterCount[letter] > 0) {
        currentTile.classList.add('present')

        let key = document.getElementById('Key' + letter)
        if (!key.classList.contains('correct')) {
          key.classList.add('present')
        }
        letterCount[letter] -= 1
      }
      // NOT IN THE WORD
      else {
        currentTile.classList.add('absent')
        let key = document.getElementById('Key' + letter)
        key.classList.add('absent')
      }
    }
  }
  game.updateRow(game.row + 1)
  game.updateColumn(0)
}