// 1. Dicionário de Palavras (Tema: Dezembro Vermelho)
const WORDS = [
    { word: 'PREVENCAO', hint: 'Conjunto de ações para evitar a transmissão do HIV.' },
    { word: 'TESTE', hint: 'É o primeiro passo para saber sua condição sorológica.' },
    { word: 'PREP', hint: 'Uso de remédios antes da exposição para evitar o HIV.' },
    { word: 'PEP', hint: 'Uso de remédios até 72h após exposição de risco.' },
    { word: 'TRATAMENTO', hint: 'Fundamental para reduzir a carga viral e viver com qualidade.' },
    { word: 'INDETECTAVEL', hint: 'Atingir essa condição significa que não há transmissão sexual (U=U).' },
    { word: 'RESPEITO', hint: 'A base para combater a discriminação e o estigma.' },
    { word: 'CAMISINHA', hint: 'Barreira física essencial na prevenção combinada.' },
    { word: 'AIDS', hint: 'Fase avançada da infecção por HIV.' }
];

// 2. Elementos DOM
const wordDisplay = document.getElementById('word-display');
const incorrectLettersDisplay = document.getElementById('incorrect-letters-display');
const letterInput = document.getElementById('letter-input');
const guessButton = document.getElementById('guess-button');
const messageArea = document.getElementById('message-area');
const restartButton = document.getElementById('restart-button');
const bodyParts = document.querySelectorAll('.body-part');
const hintDisplay = document.getElementById('hint-display'); 
const hintButton = document.getElementById('hint-button');

// 3. Variáveis do Jogo
let wordToGuess = '';
let currentWordObject = null;
let guessedLetters = [];
let wrongGuesses = 0;
const MAX_WRONG_GUESSES = bodyParts.length;

// 4. Funções de Utilitário
function pickNewWord() {
    const randomIndex = Math.floor(Math.random() * WORDS.length);
    currentWordObject = WORDS[randomIndex];
    wordToGuess = currentWordObject.word; 
}

function updateWordDisplay() {
    let displayedWord = '';
    let wordIsComplete = true;

    for (const letter of wordToGuess) {
        if (guessedLetters.includes(letter)) {
            displayedWord += letter + ' ';
        } else {
            displayedWord += '_ ';
            wordIsComplete = false;
        }
    }
    wordDisplay.textContent = displayedWord.trim();

    return wordIsComplete;
}

function updateHangmanDrawing() {
    bodyParts.forEach(part => part.style.visibility = 'hidden');

    for (let i = 0; i < wrongGuesses; i++) {
        if (bodyParts[i]) {
            bodyParts[i].style.visibility = 'visible';
        }
    }
}

function updateIncorrectLettersDisplay() {
    const incorrect = guessedLetters.filter(letter => !wordToGuess.includes(letter));
    incorrectLettersDisplay.textContent = incorrect.join(', ');
    wrongGuesses = incorrect.length;
}

function handleGameOver(won) {
    letterInput.disabled = true;
    guessButton.disabled = true;
    restartButton.style.display = 'block';
    hintButton.disabled = true;

    if (won) {
        messageArea.textContent = '🎉 Parabéns, você VENCEU! Palavra: ' + wordToGuess;
        messageArea.style.color = 'green';
    } else {
        updateHangmanDrawing();
        messageArea.textContent = '💀 Você PERDEU! A palavra era: ' + wordToGuess;
        messageArea.style.color = 'red';
    }
}

// 5. Função para Mostrar a Dica
function showHint() {
    hintDisplay.textContent = 'Dica: ' + currentWordObject.hint;
    hintDisplay.style.visibility = 'visible';

    hintButton.disabled = true;
    hintButton.textContent = 'Dica Utilizada';

    messageArea.textContent = 'Dica ativada! Use-a com sabedoria.';
}

// 6. Lógica Principal do Palpite
function handleGuess() {
    const guess = letterInput.value.toUpperCase().trim();
    letterInput.value = '';

    if (!guess.match(/[A-Z]/) || guess.length !== 1) {
        messageArea.textContent = 'Por favor, digite apenas uma letra válida.';
        return;
    }

    if (guessedLetters.includes(guess)) {
        messageArea.textContent = `Você já tentou a letra "${guess}".`;
        return;
    }

    guessedLetters.push(guess);
    messageArea.textContent = '';

    if (wordToGuess.includes(guess)) {
        const wordIsComplete = updateWordDisplay();
        if (wordIsComplete) {
            handleGameOver(true);
        }
    } else {
        updateIncorrectLettersDisplay();
        updateHangmanDrawing();

        if (wrongGuesses >= MAX_WRONG_GUESSES) {
            handleGameOver(false);
        }
    }
}

// 7. Iniciar o Jogo
function initGame() {
    guessedLetters = [];
    wrongGuesses = 0;
    
    pickNewWord();
    
    // REINICIA O ESTADO DA DICA
    hintDisplay.textContent = '';
    hintDisplay.style.visibility = 'hidden';
    hintButton.disabled = false;
    hintButton.textContent = 'Mostrar Dica'; 

    updateWordDisplay();
    updateIncorrectLettersDisplay();
    updateHangmanDrawing();

    letterInput.disabled = false;
    guessButton.disabled = false;
    messageArea.textContent = '';
    messageArea.style.color = 'var(--primary-red)';
    restartButton.style.display = 'none';
    letterInput.focus();
}

// 8. Event Listeners
guessButton.addEventListener('click', handleGuess);
restartButton.addEventListener('click', initGame);
hintButton.addEventListener('click', showHint);

letterInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleGuess();
    }
});

// Inicia o jogo na primeira vez
initGame();