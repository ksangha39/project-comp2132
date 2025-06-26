// Karnvir Sangha, A01278001


const WordManager = {
  words: [],

  async loadWords() {
    try {
      const response = await fetch("../js/words.json");
      if (!response.ok) throw new Error("Failed to fetch word list");
      this.words = await response.json();
    } catch (error) {
      console.error("Could not load word list:", error);
    }
  },

  getRandomWord() {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }
};

const hangmanImage     = document.querySelector(".hangman-box img");
const wordDisplay      = document.querySelector(".word-display");
const guessesText      = document.querySelector(".guesses-text b");
const keyboardContainer= document.querySelector(".keyboard");
const hintTag          = document.querySelector(".hint-text b");
const modal            = document.querySelector(".game-model");
const playAgainBtn     = document.querySelector(".play-again");
const resultText       = document.querySelector(".game-model .content p b");
const resultTitle      = document.querySelector(".game-model .content h4");
const resultImage      = document.querySelector(".game-model .content img");

let currentWord    = "";
let correctLetters = [];
let wrongGuessCount= 0;
const maxGuesses   = 6;

async function resetGame() {
  correctLetters = [];
  wrongGuessCount = 0;
  hangmanImage.src = `../images/hangman-0.svg`;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
  keyboardContainer.innerHTML = "";
  wordDisplay.innerHTML = "";
  modal.style.display = "none";

  if (WordManager.words.length === 0) {
    await WordManager.loadWords();
  }

  const random = WordManager.getRandomWord();
  if (!random) {
    alert("Unable to load words.");
    return;
  }

  currentWord = random.word.toLowerCase();
  hintTag.innerText = random.hint;


  for (let i = 0; i < currentWord.length; i++) {
    const li = document.createElement("li");
    li.classList.add("letter");
    wordDisplay.appendChild(li);
  }


  for (let charCode = 97; charCode <= 122; charCode++) {
    const btn = document.createElement("button");
    btn.innerText = String.fromCharCode(charCode);
    btn.addEventListener("click", () => handleGuess(btn));
    keyboardContainer.appendChild(btn);
  }
}

function handleGuess(button) {
  const letter = button.innerText;
  button.disabled = true;

  if (currentWord.includes(letter)) {
    [...currentWord].forEach((char, index) => {
      if (char === letter) {
        wordDisplay.querySelectorAll(".letter")[index].innerText = char;
        wordDisplay.querySelectorAll(".letter")[index].classList.add("guessed");
      }
    });
    if (!correctLetters.includes(letter)) {
      correctLetters.push(letter);
    }
  } else {
    wrongGuessCount++;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    hangmanImage.src = `../images/hangman-${wrongGuessCount}.svg`;
  }

  checkGameEnd();
}

function checkGameEnd() {
  const uniqueLetters = [...new Set(currentWord)];

  if (correctLetters.length === uniqueLetters.length) {
    resultTitle.innerText = "You Win!";
    resultText.innerText = currentWord;
    resultImage.src = "../images/yes.jpg";
    fadeIn(modal);
  } else if (wrongGuessCount === maxGuesses) {
    resultTitle.innerText = "Game Over!";
    resultText.innerText = currentWord;
    resultImage.src = "../images/you-lose.jpg";
    fadeIn(modal);
  }
}

function fadeIn(element) {
  element.style.display = "flex";
  element.style.opacity = 0;
  let opacity = 0;
  const interval = setInterval(() => {
    if (opacity >= 1) clearInterval(interval);
    opacity += 0.05;
    element.style.opacity = opacity;
  }, 20);
}

playAgainBtn.addEventListener("click", resetGame);
window.addEventListener("DOMContentLoaded", resetGame);
