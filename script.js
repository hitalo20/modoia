// ============================================
// BANCO DE PERGUNTAS - TEMA CAVALO & cowboy
// ============================================
const questions = [
    {
        question: "Qual o nome da famosa raça de cavalo brasileira, conhecida por sua beleza e andamento macio?",
        options: ["Puro Sangue Inglês", "Mangalarga Marchador", "Quarto de Milha", "Árabe"],
        correct: 1
    },
    {
        question: "Quem é considerado o 'Rei da Música Sertaneja' no Brasil?",
        options: ["Chitãozinho", "Zezé Di Camargo", "Tonico (Tonico & Tinoco)", "Milionário"],
        correct: 2
    },
    {
        question: "Qual acessório é INDISPENSÁVEL para um verdadeiro caubói?",
        options: ["Cinto de ouro", "Chapéu de palha", "Bota de cano alto", "Lenço no pescoço"],
        correct: 2
    },
    {
        question: "Qual destes é um cavalo de origem espanhola, muito usado em provas de rédeas?",
        options: ["Crioulo", "Pampa", "Campolina", "Lusitano"],
        correct: 3
    },
    {
        question: "Qual cantor sertanejo famoso interpreta 'Evidências'?",
        options: ["Chitãozinho & Xororó", "Leandro & Leonardo", "Bruno & Marrone", "Jorge & Mateus"],
        correct: 0
    },
    {
        question: "Como se chama a corda usada por caubóis para laçar o gado?",
        options: ["Reata", "Cabo de aço", "Soga", "Látego"],
        correct: 0
    },
    {
        question: "Qual o cavalo mais rápido do mundo em curtas distâncias?",
        options: ["Puro Sangue Inglês", "Quarto de Milha", "Árabe", "Standardbred"],
        correct: 1
    },
    {
        question: "Qual desses artistas é conhecido como 'Embaixador da Sertaneja'?",
        options: ["Sérgio Reis", "Renato Teixeira", "Almir Sater", "Zé Ramalho"],
        correct: 0
    }
];

// ============================================
// VARIÁVEIS DO SISTEMA
// ============================================
let currentQuestion = 0;
let score = 0;
let answered = false;
let timerInterval;
let timeLeft = 3 * 24 * 60 * 60; // 3 dias em segundos (exatamente como o original)
let quizCompleted = false;

// Elementos do DOM
const timerElement = document.getElementById('timer');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay = document.getElementById('score-display');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');

// ============================================
// FUNÇÕES DO TIMER
// ============================================
function updateTimerDisplay() {
    if (!timerElement) return;
    
    const days = Math.floor(timeLeft / (24 * 60 * 60));
    const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
    const seconds = timeLeft % 60;
    
    timerElement.textContent = `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (timeLeft > 0 && !quizCompleted) {
            timeLeft--;
            updateTimerDisplay();
            
            // Se o tempo acabar, finaliza o quiz automaticamente
            if (timeLeft === 0) {
                clearInterval(timerInterval);
                endQuizByTime();
            }
        }
    }, 1000);
}

function endQuizByTime() {
    quizCompleted = true;
    disableAllOptions();
    questionText.textContent = "⏰ TEMPO ESGOTADO! ⏰\nVocê não conseguiu responder todas as perguntas a tempo.";
    optionsContainer.innerHTML = '<button class="option-btn" onclick="location.reload()" style="text-align:center;">🔁 RECOMEÇAR QUIZ</button>';
}

// ============================================
// FUNÇÕES DO QUIZ
// ============================================
function disableAllOptions() {
    const allOptions = document.querySelectorAll('.option-btn');
    allOptions.forEach(btn => {
        btn.disabled = true;
    });
}

function updateScoreAndCounter() {
    scoreDisplay.textContent = `🎯 PONTOS: ${score}`;
    questionCounter.textContent = `QUESTÃO ${currentQuestion + 1}/${questions.length}`;
}

function loadQuestion() {
    answered = false;
    const q = questions[currentQuestion];
    
    questionText.textContent = q.question;
    updateScoreAndCounter();
    
    // Gerar botões das opções
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `${String.fromCharCode(65+index)}. ${opt}`;
        btn.addEventListener('click', () => checkAnswer(index, btn));
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    if (answered || quizCompleted) return;
    
    answered = true;
    const currentQ = questions[currentQuestion];
    const isCorrect = (selectedIndex === currentQ.correct);
    
    // Marcar visualmente todas as opções
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === currentQ.correct) {
            btn.classList.add('correct');
        }
        if (idx === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // Se acertou, aumenta pontuação
    if (isCorrect) {
        score++;
        updateScoreAndCounter();
    }
    
    // Avançar para próxima pergunta após 1 segundo
    setTimeout(() => {
        if (currentQuestion + 1 < questions.length) {
            currentQuestion++;
            loadQuestion();
        } else {
            // Fim do quiz
            finishQuiz();
        }
    }, 1000);
}

function finishQuiz() {
    quizCompleted = true;
    clearInterval(timerInterval);
    
    const totalQuestions = questions.length;
    const percentage = (score / totalQuestions) * 100;
    let message = "";
    
    if (percentage === 100) {
        message = "🏆 PERFEITO! VOCÊ É UM VERDADEIRO CAUBÓI! 🏆";
    } else if (percentage >= 75) {
        message = "🤠 PARABÉNS! SABE MUITO DO MUNDO SERTANEJO! 🤠";
    } else if (percentage >= 50) {
        message = "🐎 BOM! MAS AINDA PODE MELHORAR, GAÚCHO! 🐎";
    } else {
        message = "🌵 ESTUDE MAIS SOBRE A CULTURA CAUBÓI! 🌵";
    }
    
    questionText.innerHTML = `📊 QUIZ FINALIZADO! 📊<br><br>✨ VOCÊ ACERTOU ${score} DE ${totalQuestions} PERGUNTAS ✨<br><br>${message}`;
    optionsContainer.innerHTML = `<button class="option-btn" onclick="location.reload()" style="text-align:center;">🔁 JOGAR NOVAMENTE</button>`;
}

// ============================================
// INICIALIZAÇÃO
// ============================================
function init() {
    updateTimerDisplay();
    startTimer();
    loadQuestion();
}

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', init);
