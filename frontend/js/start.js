import { loadAllData } from "./dataLoader.js"
import { getRandomNumber } from "./utils.js"


class GameState {
  constructor(correctWords) {
    this.correctWords = correctWords
    this.allowedGuesses = 6
    this.row = 0
    this.col = 0
    this.gameOver = false
    this.wordCount = 3
    this.correctWord = this.correctWords[this.wordCount]
  }
  updateWordCount(newValue) {
    this.wordCount = newValue
    this.correctWord = this.correctWords[this.wordCount]
  }
  updateColumn(newValue) {
    this.col = newValue
  }
  updateRow(newValue) {
    this.row = newValue
  }
  resetGame() {
    this.updateRow(0)
    this.updateColumn(0)
    this.gameOver = false
  }
  finishGame() {
    this.gameOver = true
  }
  initialize() {
    for (let r = 0; r < this.allowedGuesses; r++) {

        let guess = document.createElement('div')
        guess.classList.add('guess')
        guess.id = r
        document.getElementById('board').appendChild(guess)

        for (let c = 0; c < this.wordCount; c++) {
            let tile = document.createElement('div')
            tile.id = r.toString() + '-' + c.toString()
            tile.classList.add('tile')
            guess.appendChild(tile)
        }
    }
  }
}

export function getGame() {
    return window.myGame
}

window.onload = function(){
    
    loadAllData()
        .then(([validWords, guessWords]) => {
        const seed = getRandomNumber()
        window.validWords = validWords
        window.correctWords = {}
        for (var i = 3; i < 9; i++) {
            window.correctWords[i] = guessWords[i][seed]
        }
        window.myGame = new GameState(window.correctWords)
        window.myGame.initialize()
    })
}