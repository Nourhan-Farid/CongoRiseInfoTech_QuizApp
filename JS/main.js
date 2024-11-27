const categoryMenu = document.querySelector("#categoryMenu");
const difficultyOptions = document.querySelector("#difficultyOptions");
const questionsNumber = document.querySelector("#questionsNumber");
const btn = document.querySelector("#startQuiz");
const myRow = document.querySelector(".row");
const form = document.querySelector("#form");

let allQuestions;
let myQuiz;

btn.addEventListener("click", async function () {
  let category = categoryMenu.value;
  let difficulty = difficultyOptions.value;
  let number = questionsNumber.value;

  myQuiz = new Quiz(category, difficulty, number);

  allQuestions = await myQuiz.getAllQuestion();
  let myfirstQuestion = new Question(0);

  form.classList.replace("d-flex", "d-none");
  myfirstQuestion.display();

  console.log(myQuiz.getApi());
  console.log(myfirstQuestion);
  console.log(allQuestions);
});

// =====================================================

class Quiz {
  constructor(category, difficulty, number) {
    this.category = category;
    this.difficulty = difficulty;
    this.number = number;
    this.score = 0;
  }

  getApi() {
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`;
  }

  async getAllQuestion() {
    let request = await fetch(this.getApi());
    let response = await request.json();

    return response.results;
  }

  showResult() {
    return `
          <div
            class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
          >
            <h2 class="mb-0"> ${
              this.score == questionsNumber
                ? "Full grade"
                : `Your score: ${this.score}`
            } </h2>
            <div class="d-flex justify-center items-center">
                <button class="again btn btn-outline-info border-3 rounded-pill me-1"><i class="bi bi-arrow-repeat"></i> Try Again</button>
                
            </div>
            
          </div>
        `;
  }
}
// ======================================================

class Question {
  constructor(index) {
    this.index = index;
    this.category = allQuestions[index].category;
    this.question = allQuestions[index].question;
    this.correct_answer = allQuestions[index].correct_answer;
    this.incorrect_answers = allQuestions[index].incorrect_answers;
    this.difficulty = allQuestions[index].difficulty;
    this.answers = this.getAllAnswers();
    this.flag = false;
  }

  getAllAnswers() {
    let allAnswers = [...this.incorrect_answers, this.correct_answer];
    allAnswers.sort();
    return allAnswers;
  }

  display() {
    const cartona = `
    <div
      class="question shadow-lg col-lg-6 p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn"
    >
      <div class="w-100 d-flex justify-content-between">
        <span class="btn btn-category">${this.category}</span>
        <span class="fs-6 btn btn-questions"> ${this.index + 1} of 
        ${allQuestions.length} </span>
      </div>
      <h2 class="text-capitalize h4 text-center text-main">${
        this.question
      }</h2>  
      <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
        ${this.answers
          .map((choice) => `<li>${choice}</li>`)
          .toString()
          .replaceAll(",", "")}
      </ul>
        <h2 class="text-capitalize text-center text-green h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${
          myQuiz.score
        } /  ${allQuestions.length}  </h2>       
    </div>
  `;
    myRow.innerHTML = cartona;
    let allChoices = document.querySelectorAll(".choices li");
    allChoices.forEach((elem) => {
      elem.addEventListener("click", () => {
        // console.log(elem);
        this.checkAnswer(elem);
        this.nextQuestion();
      });
    });
  }

  checkAnswer(choice) {
    if (!this.flag) {
      this.flag = true;
      if (choice.innerHTML == this.correct_answer) {
        // console.log("Correct");
        myQuiz.score++;
        choice.classList.add("correct", "animate__animated", "animate__pulse");
      } else {
        // console.log("Wrong");
        choice.classList.add("wrong", "animate__animated", "animate__shakeX");
      }
    }
  }

  nextQuestion() {
    this.index++;
    setTimeout(() => {
      if (this.index < allQuestions.length) {
        let newQuestion = new Question(this.index);
        newQuestion.display();
      } else {
        myRow.innerHTML = myQuiz.showResult();
        document.querySelector(".again").addEventListener("click", function () {
          window.location.reload();
        });
      }
    }, 2000);
  }
}
