import { row, col, gameOver, wordCount, updateWordCount, updateRow, updateColumn, allowedGuesses, finishGame } from "../start.js";
import {increaseWordCount, decreaseWordCount, getCorrectWord, checkWord } from "../utils.js";


const moreLetterButton = document.querySelector('#more-btn')
const lessLetterButton = document.querySelector('#less-btn')
const errorMessage = document.querySelector('#error-message')

let wordNumber = document.getElementById('word-number')
let currentGuess = ''



export function resetValues(){
  currentGuess = ''
  updateRow(0)
  updateColumn(0)
}


moreLetterButton.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent outside click
  let newValue = increaseWordCount(wordCount)
  updateWordCount(newValue)
  wordNumber.innerHTML = newValue
  resetValues()
});

lessLetterButton.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent outside click
  let newValue = decreaseWordCount(wordCount)
  updateWordCount(newValue)
  wordNumber.innerHTML = newValue
  resetValues()
});

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
  if (gameOver) return
  let key = e.code

  if ('KeyA' <= key && key <= 'KeyZ'){
    if (col < wordCount){
      let currentTile = document.getElementById(row.toString() + '-' + col.toString())
      if (currentTile.innerText == '') {
        let letter = key[3]
        currentTile.innerText = letter 
        currentGuess += letter
        updateColumn(col + 1)
      }
    }
  }
  else if (key == 'Backspace') {
    if (0 < col && col <= wordCount){
      updateColumn(col - 1)}
    let currentTile = document.getElementById(row.toString() + '-' + col.toString())
    currentTile.innerText = ''
    currentGuess = currentGuess.slice(0, -1)
  }
  else if (key == 'Enter' && currentGuess.length === wordCount) {
    applyGuess()
  }
  if (!gameOver && row == allowedGuesses){
    finishGame()
  }
  
  console.log('key pressed: ' + key)
  console.log('wordCount: ' + wordCount)
  console.log('currentGuess: ' + currentGuess)
}

function applyGuess() {

  let isValid = checkWord(currentGuess, wordCount, window.validWords)
  if (!isValid) {
    return
  }
  let correct = 0
  let letterCount = {} //KENNY -> {K:1, E:1, N:2, Y:1}
  currentGuess = ''
  const correctWord = getCorrectWord(wordCount, window.correctWords)

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
  for (let c = 0; c < wordCount; c++) {
    let currentTile = document.getElementById(row.toString() + '-' + c.toString())
    let letter = currentTile.innerText

    if (correctWord[c] == letter) {
      currentTile.classList.add('correct')
      
      let key = document.getElementById('Key' + letter)
      key.classList.remove('present')
      key.classList.add('correct')

      correct += 1
      letterCount[letter] -= 1
    }

    if (correct == wordCount) {
      finishGame()
    }
  }

  // SECOND
  for (let c = 0; c < wordCount; c++) {
    let currentTile = document.getElementById(row.toString() + '-' + c.toString())
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
  updateRow(row + 1)
  updateColumn(0)
}