//select Elements
let count = document.querySelector(".counter .count span");
let bullets = document.querySelector(".bullets");
let question = document.querySelector(".question");
let answers = document.querySelector(".answers");
let submit = document.querySelector(".submit");
let bullet = document.querySelectorAll(".bullets span");
let time = document.querySelector(".time");

//select Elements
let quesIndex = 0;
let rightAnswer = 0;
fetch("quiz.json")
  .then((data) => {
    let result = data.json();
    return result;
  })
  .then((data) => {
    let qCount = data.length;
    setQuestionCountAndBulleets(qCount);
    setDataToContainer(quesIndex, data);
    countdown(15, qCount);
    submit.onclick = function () {
      if (quesIndex < qCount) {
        let rAnswer = data[quesIndex]["right_answer"];
        let allInput = document.querySelectorAll("input[name='question']");
        let chosenAnswer = "";
        for (let i = 0; i < allInput.length; i++) {
          if (allInput[i].checked) {
            chosenAnswer = allInput[i].getAttribute("answer");
          }
        }
        if (rAnswer == chosenAnswer) {
          rightAnswer++;
        }

        hundleBullets(rAnswer, chosenAnswer);
        //==================
        answers.innerHTML = "";
        question.innerHTML = "";
        setDataToContainer(++quesIndex, data);
        clearInterval(interval);
        countdown(15, qCount);
      }
      if (qCount == quesIndex) {
        //(rightAnswer>1)?questions:question
        answers.innerHTML = `You have answered ${rightAnswer} ${rightAnswer > 1 ? "questions" : "question"
          } from ${qCount}`;
        answers.style.fontSize = "20px";
        answers.style.fontWeight = "600";
        answers.style.padding = "30px";
        submit.remove();
        question.remove();
      }
    };
  });

//===============================================
//App functions
function setQuestionCountAndBulleets(num) {
  count.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    bullets.appendChild(span);
  }
}
function setDataToContainer(quesNum, obj) {
  if (quesNum < obj.length) {
    let jsonQuestion = obj[quesNum].title;
    question.appendChild(document.createTextNode(jsonQuestion));
    for (let i = 1; i <= 4; i++) {
      let div = document.createElement("div");
      div.className = "answer";
      let input = document.createElement("input");
      input.setAttribute("type", "radio");
      input.setAttribute("id", `answer${i}`);
      input.setAttribute("name", "question");
      let label = document.createElement("label");
      label.setAttribute("for", `answer${i}`);
      let answer = obj[quesNum][`answer_${i}`];
      let answerNode = document.createTextNode(answer);
      input.setAttribute("answer", `${answer}`);
      label.appendChild(answerNode);
      div.append(input, label);
      answers.append(div);
    }
  }
}
function hundleBullets(rightAnswer, chosen) {
  let bullets = document.querySelectorAll(".bullets span");
  arrOfspan = Array.from(bullets);
  arrOfspan.forEach((span, index) => {
    if (rightAnswer == chosen && index == quesIndex) {
      span.className = "on";
    } else if (rightAnswer != chosen && index == quesIndex) {
      span.className = "off";
    }
  });
}
function checkAnswer() {
  let rAnswer = data[quesIndex]["right_answer"];
  let allInput = document.querySelectorAll("input[name='question']");
  let chosenAnswer = "";
  for (let i = 0; i < allInput.length; i++) {
    if (allInput[i].checked) {
      chosenAnswer = allInput[i].getAttribute("answer");
    }
  }
  if (rAnswer == chosenAnswer) {
    rightAnswer++;
  }
}
let interval;
function countdown(durationInSeconds, quesNum) {
  if (quesIndex < quesNum) {
    let minutes;
    let second;
    interval = setInterval(() => {
      minutes = Math.trunc(durationInSeconds / 60);
      second = durationInSeconds % 60;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      second = second < 10 ? `0${second}` : second;
      time.innerHTML = `${minutes}:${second}`;
      durationInSeconds--;

      if (durationInSeconds < 0) {
        clearInterval(interval);
        submit.click();
      }
    }, 1000);
  }
}
