const questions = [
    { question: "Is Python a programming language?", answer: "yes" },
    { question: "Is the Earth flat?", answer: "no" },
    { question: "Is JavaScript used for web development?", answer: "yes" },
    { question: "Does water boil at 100°C?", answer: "yes" },
    { question: "Is 2+2 equal to 5?", answer: "no" },
    { question: "Is HTML a programming language?", answer: "no" },
    { question: "Is CSS used for styling web pages?", answer: "yes" },
    { question: "Is the capital of France Paris?", answer: "yes" },
    { question: "Is the Sun a star?", answer: "yes" },
    { question: "Is ice cream hot?", answer: "no" },
    { question: "Is New York the capital of the USA?", answer: "no" },
    { question: "Does the Moon orbit the Earth?", answer: "yes" },
    { question: "Is 10 greater than 5?", answer: "yes" },
    { question: "Is the sky green?", answer: "no" },
    { question: "Is 7 a prime number?", answer: "yes" },
    { question: "Is water made of hydrogen and oxygen?", answer: "yes" },
    { question: "Is fire cold?", answer: "no" },
    { question: "Is 1+1 equal to 2?", answer: "yes" },
    { question: "Is chocolate salty?", answer: "no" },
    { question: "Is the Earth the third planet from the Sun?", answer: "yes" }
];

let correctCount = 0;
let incorrectCount = 0;
let rewardClaimed = false;
let askedQuestions = [];
let startTime;

document.addEventListener("DOMContentLoaded", function () {
    const loadingScreen = document.getElementById('loading-screen');
    const game = document.getElementById('game');
    const progress = document.getElementById('progress');
    const questionContainer = document.getElementById('question-container');
    const feedback = document.getElementById('feedback');
    const video = document.getElementById('video');
    const correctCountElement = document.getElementById('correct-count');
    const incorrectCountElement = document.getElementById('incorrect-count');
    const rewardSection = document.getElementById('reward-section');
    const videoSection = document.getElementById('video-section');
    const rewardMessage = document.getElementById('reward-message');

    let loadInterval = setInterval(() => {
        let currentProgress = parseInt(progress.innerText);
        if (currentProgress < 100) {
            progress.innerText = currentProgress + 10 + '%';
        } else {
            clearInterval(loadInterval);
        }
    }, 400);

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        game.style.display = 'flex';
        startTime = Date.now();
        loadQuestion();
    }, Math.random() * (7000 - 4000) + 4000);

    function loadQuestion() {
        let availableQuestions = questions.filter(q => !askedQuestions.includes(q.question));
        if (availableQuestions.length === 0) {
            askedQuestions = [];
            availableQuestions = questions;
        }

        let question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        askedQuestions.push(question.question);
        questionContainer.innerText = question.question;
        questionContainer.setAttribute('data-answer', question.answer);
    }

    window.answer = function (answer) {
        let correctAnswer = questionContainer.getAttribute('data-answer');

        if (answer === correctAnswer) {
            correctCount++;
            correctCountElement.innerText = correctCount;
            feedback.innerText = 'Correct!';
            feedback.style.color = 'green';
        } else {
            incorrectCount++;
            incorrectCountElement.innerText = incorrectCount;
            feedback.innerText = 'Incorrect!';
            feedback.style.color = 'red';
        }

        feedback.classList.remove('hidden');

        if (correctCount >= 10 && !rewardClaimed) {
            setTimeout(() => {
                game.style.display = 'none';
                rewardSection.style.display = 'flex';
                autoScrollToReward();
            }, 1000);
        } else {
            setTimeout(() => {
                feedback.classList.add('hidden');
                loadQuestion();
            }, 2000);
        }
    }

    function autoScrollToReward() {
        rewardClaimed = true;
        rewardSection.scrollIntoView({ behavior: 'smooth' });
        rewardSection.addEventListener('click', scrollToVideo);
    }

    window.scrollToVideo = function () {
        rewardSection.style.display = 'none';
        videoSection.style.display = 'block';
        video.scrollIntoView({ behavior: 'smooth' });
        video.play();

        video.onended = function () {
            videoSection.style.display = 'none';
            game.style.display = 'flex';
            rewardMessage.classList.remove('hidden');
            rewardMessage.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                rewardMessage.classList.add('hidden');
                resetGame();
            }, 5000);
        };
    }

    function resetGame() {
        correctCount = 0;
        incorrectCount = 0;
        correctCountElement.innerText = correctCount;
        incorrectCountElement.innerText = incorrectCount;
        askedQuestions = [];
        rewardClaimed = false;
        loadQuestion();
    }

    window.restartGame = function () {
        resetGame();
        game.style.display = 'flex';
        videoSection.style.display = 'none';
        rewardMessage.classList.add('hidden');
    }
});


