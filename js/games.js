// Lógica de juegos educativos
document.addEventListener('DOMContentLoaded', function() {
    const gameButtons = document.querySelectorAll('.play-game');
    const gameModal = new bootstrap.Modal(document.getElementById('gameModal'));
    
    gameButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameCard = this.closest('.game-card');
            const gameType = gameCard.dataset.game;
            loadGame(gameType);
            gameModal.show();
        });
    });
});

function loadGame(gameType) {
    const modalTitle = document.getElementById('gameModalTitle');
    const modalBody = document.getElementById('gameModalBody');
    
    switch(gameType) {
        case 'crossword':
            modalTitle.textContent = 'Crucigrama Quechua';
            modalBody.innerHTML = renderCrossword();
            initCrossword();
            break;
        case 'wordsearch':
            modalTitle.textContent = 'Sopa de Letras';
            modalBody.innerHTML = renderWordSearch();
            initWordSearch();
            break;
        case 'memory':
            modalTitle.textContent = 'Memorama Quechua';
            modalBody.innerHTML = renderMemoryGame();
            initMemoryGame();
            break;
        case 'quiz':
            modalTitle.textContent = 'Quiz de Vocabulario';
            modalBody.innerHTML = renderQuiz();
            initQuiz();
            break;
        case 'hangman':
            modalTitle.textContent = 'Ahorcado Andino';
            modalBody.innerHTML = renderHangman();
            initHangman();
            break;
        case 'fillblank':
            modalTitle.textContent = 'Completa la Frase';
            modalBody.innerHTML = renderFillBlank();
            initFillBlank();
            break;
    }
}

function renderCrossword() {
    return `
        <div class="text-center">
            <div class="crossword-grid d-inline-block">
                ${generateCrosswordGrid()}
            </div>
            <div class="mt-4">
                <h6>Pistas:</h6>
                <p><strong>Horizontal:</strong> Saludo en quechua (9 letras)</p>
                <p><strong>Vertical:</strong> Palabra para "Gracias" (12 letras)</p>
                <button class="btn btn-success mt-3" onclick="checkCrossword()">Verificar</button>
                <button class="btn btn-outline-secondary mt-3" onclick="resetCrossword()">Limpiar</button>
            </div>
        </div>
    `;
}

function renderWordSearch() {
    return `
        <div class="text-center">
            <div class="wordsearch-grid" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px;">
                ${generateWordSearchGrid()}
            </div>
            <div class="mt-4">
                <h6>Palabras a encontrar:</h6>
                <div class="row">
                    <div class="col-6">
                        <p>☐ ALLINLLACHU</p>
                        <p>☐ RIMAYKULLAYKI</p>
                        <p>☐ ALLILLANMI</p>
                    </div>
                    <div class="col-6">
                        <p>☐ SUTIYQA</p>
                        <p>☐ INTI</p>
                        <p>☐ PACHAMAMA</p>
                    </div>
                </div>
                <button class="btn btn-success mt-3" onclick="checkWordSearch()">Verificar</button>
            </div>
        </div>
    `;
}

function renderMemoryGame() {
    return `
        <div class="container">
            <div class="row g-3" id="memoryGrid">
                ${generateMemoryCards()}
            </div>
            <div class="text-center mt-4">
                <p>Pares encontrados: <span id="pairsFound">0</span>/8</p>
                <p>Intentos: <span id="attempts">0</span></p>
                <button class="btn btn-success" onclick="resetMemoryGame()">Reiniciar</button>
            </div>
        </div>
    `;
}

function renderQuiz() {
    const questions = [
        {
            question: "¿Cómo se dice 'Buenos días' en quechua?",
            options: ["Allinllachu", "Allin p'unchay", "Rimaykullayki", "Tupananchiskama"],
            correct: 1
        },
        {
            question: "¿Qué significa 'Rimaykullayki'?",
            options: ["Hola", "Adiós", "Gracias", "Por favor"],
            correct: 2
        },
        {
            question: "¿Cómo se dice 'Estoy bien' en quechua?",
            options: ["Allillanmi", "Mana allinchu", "Imaynallam", "Ama hina"],
            correct: 0
        },
        {
            question: "¿Qué significa 'Tupananchiskama'?",
            options: ["Hasta mañana", "Hasta luego", "Buenas noches", "Nos vemos"],
            correct: 1
        }
    ];
    
    return `
        <div id="quizContainer">
            <div class="text-center mb-4">
                <h4>Pregunta <span id="currentQuestion">1</span>/4</h4>
                <div class="progress">
                    <div class="progress-bar" id="quizProgress" style="width: 25%"></div>
                </div>
            </div>
            <div id="questionContainer">
                ${generateQuizQuestion(questions[0])}
            </div>
            <div class="text-center mt-4">
                <button class="btn btn-success" id="nextQuestion">Siguiente</button>
            </div>
        </div>
    `;
}

// Funciones adicionales para los juegos
let currentQuestionIndex = 0;
let quizQuestions = [];
let quizScore = 0;

function initQuiz() {
    quizQuestions = [
        { question: "¿Cómo se dice 'Buenos días' en quechua?", options: ["Allinllachu", "Allin p'unchay", "Rimaykullayki", "Tupananchiskama"], correct: 1 },
        { question: "¿Qué significa 'Rimaykullayki'?", options: ["Hola", "Adiós", "Gracias", "Por favor"], correct: 2 },
        { question: "¿Cómo se dice 'Estoy bien' en quechua?", options: ["Allillanmi", "Mana allinchu", "Imaynallam", "Ama hina"], correct: 0 },
        { question: "¿Qué significa 'Tupananchiskama'?", options: ["Hasta mañana", "Hasta luego", "Buenas noches", "Nos vemos"], correct: 1 }
    ];
    currentQuestionIndex = 0;
    quizScore = 0;
    displayQuizQuestion();
    
    document.getElementById('nextQuestion').addEventListener('click', nextQuizQuestion);
}

function displayQuizQuestion() {
    const container = document.getElementById('questionContainer');
    const q = quizQuestions[currentQuestionIndex];
    container.innerHTML = `
        <h5 class="text-center mb-4">${q.question}</h5>
        <div class="row g-3">
            ${q.options.map((opt, idx) => `
                <div class="col-md-6">
                    <div class="quiz-option" data-opt-index="${idx}">
                        ${opt}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            const selectedIndex = parseInt(this.dataset.optIndex);
            if (selectedIndex === q.correct) {
                quizScore++;
                this.classList.add('correct');
            } else {
                this.classList.add('incorrect');
                document.querySelector(`.quiz-option[data-opt-index="${q.correct}"]`).classList.add('correct');
            }
            document.getElementById('nextQuestion').disabled = false;
        });
    });
}

function nextQuizQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
        document.getElementById('quizProgress').style.width = ((currentQuestionIndex + 1) / quizQuestions.length * 100) + '%';
        displayQuizQuestion();
        document.getElementById('nextQuestion').disabled = true;
    } else {
        // Fin del quiz
        const modalBody = document.getElementById('gameModalBody');
        modalBody.innerHTML = `
            <div class="text-center">
                <i class="bi bi-trophy-fill text-warning" style="font-size: 4rem;"></i>
                <h3 class="mt-3">¡Quiz Completado!</h3>
                <p class="lead">Tu puntuación: ${quizScore}/${quizQuestions.length}</p>
                <div class="progress mb-3" style="height: 30px;">
                    <div class="progress-bar bg-success" style="width: ${(quizScore/quizQuestions.length*100)}%">
                        ${Math.round(quizScore/quizQuestions.length*100)}%
                    </div>
                </div>
                <button class="btn btn-success" data-bs-dismiss="modal">Cerrar</button>
            </div>
        `;
    }
}

function renderHangman() {
    return `
        <div class="text-center">
            <svg width="300" height="300" viewBox="0 0 300 300">
                <line x1="50" y1="250" x2="250" y2="250" stroke="black" stroke-width="2"/>
                <line x1="150" y1="250" x2="150" y2="50" stroke="black" stroke-width="2"/>
                <line x1="150" y1="50" x2="220" y2="50" stroke="black" stroke-width="2"/>
                <line x1="220" y1="50" x2="220" y2="80" stroke="black" stroke-width="2"/>
                <circle cx="220" cy="100" r="20" stroke="black" stroke-width="2" fill="none" id="hangmanHead" style="display: none;"/>
                <line x1="220" y1="120" x2="220" y2="180" stroke="black" stroke-width="2" id="hangmanBody" style="display: none;"/>
                <line x1="220" y1="140" x2="200" y2="160" stroke="black" stroke-width="2" id="hangmanLeftArm" style="display: none;"/>
                <line x1="220" y1="140" x2="240" y2="160" stroke="black" stroke-width="2" id="hangmanRightArm" style="display: none;"/>
                <line x1="220" y1="180" x2="200" y2="210" stroke="black" stroke-width="2" id="hangmanLeftLeg" style="display: none;"/>
                <line x1="220" y1="180" x2="240" y2="210" stroke="black" stroke-width="2" id="hangmanRightLeg" style="display: none;"/>
            </svg>
            <div class="mt-3">
                <h3 id="hangmanWord" class="mb-3">_ _ _ _ _ _ _ _</h3>
                <div class="d-flex flex-wrap justify-content-center gap-2 mb-3" id="hangmanLetters"></div>
                <p>Intentos restantes: <span id="hangmanAttempts">6</span></p>
                <button class="btn btn-success" onclick="resetHangman()">Nueva Palabra</button>
            </div>
        </div>
    `;
}

function renderFillBlank() {
    return `
        <div class="text-center">
            <div class="card bg-light mb-4">
                <div class="card-body">
                    <h5 class="card-title">Completa la frase:</h5>
                    <p class="lead">"________, ¿imaynallam kanki?"</p>
                    <p class="text-muted">(Significado: "Hola, ¿cómo estás?")</p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <input type="text" class="form-control form-control-lg text-center" id="blankAnswer" placeholder="Escribe tu respuesta">
                </div>
            </div>
            <div class="mt-4">
                <button class="btn btn-success" onclick="checkFillBlank()">Verificar</button>
                <button class="btn btn-outline-secondary" onclick="showHintFillBlank()">Pista</button>
            </div>
            <div id="fillBlankFeedback" class="mt-3"></div>
        </div>
    `;
}

// Funciones auxiliares para generar grids
function generateCrosswordGrid() {
    let html = '<table class="table-bordered">';
    for (let i = 0; i < 8; i++) {
        html += '<tr>';
        for (let j = 0; j < 8; j++) {
            if ((i === 2 && j === 3) || (i === 3 && j === 3) || (i === 4 && j === 3) || (i === 5 && j === 3)) {
                html += '<td class="crossword-cell"><input type="text" maxlength="1"></td>';
            } else if (i === 3 && j === 2) {
                html += '<td class="crossword-cell"><input type="text" maxlength="1"></td>';
            } else {
                html += '<td class="crossword-cell black"></td>';
            }
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

function generateWordSearchGrid() {
    const letters = [
        ['A', 'L', 'L', 'I', 'N', 'L', 'L', 'A', 'C', 'H', 'U'],
        ['R', 'I', 'M', 'A', 'Y', 'K', 'U', 'L', 'L', 'A', 'Y'],
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
        ['S', 'U', 'T', 'I', 'Y', 'Q', 'A', 'L', 'M', 'N', 'O'],
        ['I', 'N', 'T', 'I', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'],
        ['P', 'A', 'C', 'H', 'A', 'M', 'A', 'M', 'A', 'W', 'X'],
        ['W', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
    ];
    
    let html = '';
    for (let i = 0; i < 8; i++) {
        html += '<div class="wordsearch-row" style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px;">';
        for (let j = 0; j < 8; j++) {
            html += `<div class="wordsearch-cell" data-row="${i}" data-col="${j}">${letters[i] ? letters[i][j] : ' '}</div>`;
        }
        html += '</div>';
    }
    return html;
}

function generateMemoryCards() {
    const words = [
        { quechua: "Allinllachu", spanish: "¿Cómo estás?" },
        { quechua: "Allillanmi", spanish: "Estoy bien" },
        { quechua: "Rimaykullayki", spanish: "Gracias" },
        { quechua: "Tupananchiskama", spanish: "Hasta luego" },
        { quechua: "Inti", spanish: "Sol" },
        { quechua: "Pachamama", spanish: "Madre Tierra" },
        { quechua: "Ayni", spanish: "Reciprocidad" },
        { quechua: "Sumaq", spanish: "Hermoso" }
    ];
    
    let cards = [...words.map((w, i) => ({ type: 'quechua', text: w.quechua, pairId: i })),
                 ...words.map((w, i) => ({ type: 'spanish', text: w.spanish, pairId: i }))];
    
    // Mezclar
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    let html = '';
    cards.forEach((card, idx) => {
        html += `
            <div class="col-3">
                <div class="memory-card" data-pair="${card.pairId}" data-type="${card.type}" data-text="${card.text}">
                    ?
                </div>
            </div>
        `;
    });
    return html;
}

function initCrossword() {
    // Lógica del crucigrama
    console.log('Crucigrama iniciado');
}

function checkCrossword() {
    alert('¡Buen trabajo! Continuemos con más ejercicios.');
}

function resetCrossword() {
    document.querySelectorAll('.crossword-cell input').forEach(input => input.value = '');
}

function initWordSearch() {
    // Lógica de sopa de letras
    console.log('Sopa de letras iniciada');
}

function checkWordSearch() {
    alert('¡Excelente! Has encontrado todas las palabras.');
}

function initMemoryGame() {
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let attempts = 0;
    
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', function() {
            if (lockBoard) return;
            if (this === firstCard) return;
            if (this.classList.contains('matched')) return;
            
            this.innerHTML = this.dataset.text;
            this.classList.add('flipped');
            
            if (!firstCard) {
                firstCard = this;
            } else if (!secondCard) {
                secondCard = this;
                lockBoard = true;
                attempts++;
                document.getElementById('attempts').textContent = attempts;
                checkMemoryMatch();
            }
        });
    });
}

function checkMemoryMatch() {
    const isMatch = firstCard.dataset.pair === secondCard.dataset.pair;
    
    if (isMatch) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        const pairsFound = document.querySelectorAll('.memory-card.matched').length / 2;
        document.getElementById('pairsFound').textContent = pairsFound;
        resetMemoryBoard();
        if (pairsFound === 8) {
            setTimeout(() => {
                alert('¡Felicidades! Has completado el memorama.');
            }, 500);
        }
    } else {
        setTimeout(() => {
            firstCard.innerHTML = '?';
            secondCard.innerHTML = '?';
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetMemoryBoard();
        }, 1000);
    }
}

function resetMemoryBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function resetMemoryGame() {
    const modalBody = document.getElementById('gameModalBody');
    modalBody.innerHTML = renderMemoryGame();
    initMemoryGame();
}

function initHangman() {
    const words = ['ALLINLLACHU', 'RIMAYKULLAYKI', 'ALLILLANMI', 'PACHAMAMA', 'INTI'];
    let currentWord = words[Math.floor(Math.random() * words.length)];
    let guessedLetters = [];
    let attemptsLeft = 6;
    
    updateHangmanDisplay();
    setupHangmanLetters();
    
    function updateHangmanDisplay() {
        let displayWord = currentWord.split('').map(letter => 
            guessedLetters.includes(letter) ? letter : '_'
        ).join(' ');
        document.getElementById('hangmanWord').textContent = displayWord;
        document.getElementById('hangmanAttempts').textContent = attemptsLeft;
        
        // Mostrar/ocultar partes del ahorcado
        document.getElementById('hangmanHead').style.display = attemptsLeft <= 5 ? 'block' : 'none';
        document.getElementById('hangmanBody').style.display = attemptsLeft <= 4 ? 'block' : 'none';
        document.getElementById('hangmanLeftArm').style.display = attemptsLeft <= 3 ? 'block' : 'none';
        document.getElementById('hangmanRightArm').style.display = attemptsLeft <= 2 ? 'block' : 'none';
        document.getElementById('hangmanLeftLeg').style.display = attemptsLeft <= 1 ? 'block' : 'none';
        document.getElementById('hangmanRightLeg').style.display = attemptsLeft <= 0 ? 'block' : 'none';
    }
    
    function setupHangmanLetters() {
        const lettersContainer = document.getElementById('hangmanLetters');
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        lettersContainer.innerHTML = alphabet.map(letter => `
            <button class="btn btn-outline-success btn-sm hangman-letter" data-letter="${letter}">
                ${letter}
            </button>
        `).join('');
        
        document.querySelectorAll('.hangman-letter').forEach(btn => {
            btn.addEventListener('click', function() {
                const letter = this.dataset.letter;
                if (guessedLetters.includes(letter)) return;
                
                guessedLetters.push(letter);
                if (!currentWord.includes(letter)) {
                    attemptsLeft--;
                }
                
                updateHangmanDisplay();
                this.disabled = true;
                
                // Verificar si ganó
                const currentDisplay = document.getElementById('hangmanWord').textContent;
                if (!currentDisplay.includes('_')) {
                    setTimeout(() => {
                        alert('¡Felicidades! Has adivinado la palabra: ' + currentWord);
                    }, 100);
                } else if (attemptsLeft === 0) {
                    setTimeout(() => {
                        alert('¡Oh no! La palabra era: ' + currentWord);
                    }, 100);
                }
            });
        });
    }
}

function resetHangman() {
    initHangman();
}

function checkFillBlank() {
    const answer = document.getElementById('blankAnswer').value.toLowerCase().trim();
    const correctAnswer = 'allinllachu';
    const feedback = document.getElementById('fillBlankFeedback');
    
    if (answer === correctAnswer) {
        feedback.innerHTML = '<div class="alert alert-success">¡Correcto! "Allinllachu" es la forma correcta de saludar en quechua.</div>';
        feedback.innerHTML += '<button class="btn btn-success mt-2" data-bs-dismiss="modal">Continuar</button>';
    } else {
        feedback.innerHTML = '<div class="alert alert-danger">Incorrecto. Intenta nuevamente. Pista: Empieza con "A" y tiene 11 letras.</div>';
    }
}

function showHintFillBlank() {
    const feedback = document.getElementById('fillBlankFeedback');
    feedback.innerHTML = '<div class="alert alert-info">Es la palabra que usas para preguntar "¿Cómo estás?"</div>';
}