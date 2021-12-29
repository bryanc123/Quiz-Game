let questions = [
    {
        text: "Angular 9 introduced a new rendering engine called ____",
        options: [
            "Canopy",
            "Ivy",
            "View",
            "NgView"
        ],
        correctAnswer: "Ivy",
        hint: "The answer is related to plants"
    },
    {
        text: "8 % 3 = ____",
        options: [
            "0",
            "1",
            "2",
            "4"
        ],
        correctAnswer: "2",
        hint: "The modulo operator is used, not the division operator"
    },
    {
        text: "Which of the following is NOT a compiled language?",
        options: [
            "Java",
            "JavaScript",
            "C++",
            "C#"
        ],
        correctAnswer: "JavaScript",
        hint: "Java transforms source code into bytecode for portability"
    },
    {
        text: "AngularJS became Angular with the release of version ____",
        options: [
            "2",
            "3",
            "4",
            "5"
        ],
        correctAnswer: "2",
        hint: "The change happened early on"
    }
];
let currentQuestion = 0;
let numberOfIncorrectAnswers = 0;

// change screen
const display = screen => {
    const sections = document.querySelector(".main").children;
    for(let i = 0; i < sections.length; i++) {
        sections[i].style.display = "none";
    }
    
    document.querySelector(`.${screen}`).style.display = "block";
}

// HTML Elements
const _questionNumber = document.querySelector(".question-number");
const _question = document.querySelector(".question");
const _options = document.querySelector(".options");
const _overlay = document.querySelector(".overlay");

const setQuestion = () => {
    _questionNumber.innerHTML = `Question ${currentQuestion + 1}`;
    _question.innerHTML = questions[currentQuestion].text;

    let optionsString = "";
    for(let i = 0; i < questions[currentQuestion].options.length; i++) {
        optionsString += "<button class='option' onclick='checkAnswer("  + i + ")'>";
        optionsString += questions[currentQuestion].options[i];
        optionsString += "</button>"
    }
    _options.innerHTML = optionsString;
}

let questionCountdown;
let questionTimerId;
const setQuestionTimer = () => {
    const _questionTimer = document.querySelector(".question-timer");

    questionCountdown = 60;

    _questionTimer.innerHTML = questionCountdown + "s";
    questionTimerId = setInterval(() => {
        questionCountdown--;
        _questionTimer.innerHTML = questionCountdown + "s";
    
        if(questionCountdown === 0) {
            clearInterval(questionTimerId);
            displayOverlay(["Time's Up!"], "red");
            currentQuestion++;
            setQuestion();
        }
    }, 1000);
}

// initialize game
const init = () => {
    setQuestion();
    display("quiz");
    setQuestionTimer();
}

// display functions
const displayOverlay = (text, bgColor) => {
    _overlay.style.display = "flex";
    _overlay.style.backgroundColor = bgColor;

    let timerIndex = 0;
    _overlay.innerHTML = text[timerIndex];
    let timer = setInterval(() => {
        _overlay.innerHTML = text[++timerIndex];
    
        if(timerIndex === text.length) {
            clearInterval(timer);
            _overlay.style.display = "none";

            if(currentQuestion < questions.length - 1) {
                init();
            }
        }
    }, 500);
}

// hint lifeline
const displayHint = button => {
    button.style.display = "none";
    let _hint = document.querySelector(".hint");

    _hint.innerHTML = `<strong>Hint</strong>: ${questions[currentQuestion].hint}`;
    _hint.style.display = "block";
}

const hideHint = () => {
    document.querySelector(".hint").style.display = "none";
}

// 50/50 lifeline
const fiftyFifty = button => {
    button.style.display = "none";

    let options = document.getElementsByClassName("option");

    let removeCount = 0;
    for(let i = 0; i < options.length; i++) {
        if(options[i].textContent !== questions[currentQuestion].correctAnswer) {
            options[i].style.display = "none";
            removeCount++;
            if(removeCount === 2) {
                return;
            }
        }
    }
}

const initCountdown = () => {
    let lifelines = document.getElementsByClassName("lifeline");
    for(let i = 0; i < lifelines.length; i++) {
        lifelines[i].style.display = "inline-block";
    }

    currentQuestion = 0;
    numberOfIncorrectAnswers = 0;

    displayOverlay(["READY?", "3", "2", "1", "GO!"], "#0F56BA");
}

const checkAnswer = answer => {
    if(questions[currentQuestion].options[answer] === questions[currentQuestion].correctAnswer) {
        displayOverlay(["Correct!"], "green")
    } else {
        numberOfIncorrectAnswers++;
        let correctAnswer = questions[currentQuestion].correctAnswer;
        displayOverlay(["Incorrect!", `The correct answer is ${correctAnswer}`], "red");
    }

    clearInterval(questionTimerId);
    if(document.querySelector(".hint").style.display === "block") {
        hideHint();
    }

    if(currentQuestion === questions.length - 1) {
        document.querySelector(".game-over__heading").innerHTML = "Quiz Complete";

        let gameOverBody = `<p>Final score: ${questions.length - numberOfIncorrectAnswers}/${questions.length}</p>`;
        gameOverBody += `<button onclick="display('splash-screen')">Back to Home</button>`;
        document.querySelector(".game-over__body").innerHTML = gameOverBody;
        document.querySelector(".game-over__body").style.textAlign = "center";

        display("game-over");
    } else {
        currentQuestion++;
        setQuestion();
    }
}
