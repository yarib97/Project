import { loadAllData } from "./dataLoader.js"
import { loadRandomWord } from "./utils.js"
export const allowedGuesses = 6
export let row = 0
export let col = 0
export let gameOver = false
export let wordCount = 3

window.onload = function(){
    
    const data = loadAllData()
        .then(([validWords, guessWords]) => {
        const seed = loadRandomWord()
        
        window.validWords = validWords
        window.correctWords = {}
        for (var i = 3; i < 9; i++) {
            window.correctWords[i] = guessWords[i][seed]
        }
        console.log(window.correctWords)
        let correctWord = window.correctWords[wordCount]
    })
    initialize()
}

function initialize() {
    for (let r = 0; r < allowedGuesses; r++) {

        let guess = document.createElement('div')
        guess.classList.add('guess')
        guess.id = r
        document.getElementById('board').appendChild(guess)

        for (let c = 0; c < wordCount; c++) {
            let tile = document.createElement('div')
            tile.id = r.toString() + '-' + c.toString()
            tile.classList.add('tile')
            guess.appendChild(tile)
        }
    }
}


export function updateWordCount(newValue) {
    wordCount = newValue
    let correctWord = window.correctWords[wordCount]
    console.log('Update Word Count: ' + correctWord)
}

export function updateColumn(newValue) {
    col = newValue
}

export function updateRow(newValue) {
    row = newValue
}

export function finishGame() {
    gameOver = !gameOver
}