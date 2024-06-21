//selecting all required elements
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const loginform  = document.getElementById("loginform");
const number = document.getElementById("otp");
const mainMenu = document.getElementById("main-menu");
const sec = document.querySelector(".sec");
const btn = document.querySelector(".buttons button.quit")


let otp

let isNavigatingAway = false; // Flag to track if the user clicked the "Next" button

// Function to warn the user before reloading or leaving the page
function warnUserBeforeReload(event) {
    if (!isNavigatingAway) {
        const confirmationMessage = "If you reload the page, your score will be deleted.";
        (event || window.event).returnValue = confirmationMessage; // Standard for most browsers
        return confirmationMessage; // Required for some older browsers
    }
}


loginform.addEventListener("submit", async function(event){
  event.preventDefault();
  const temp = number.value;
  otp = temp.toString();
  console.log(otp);

  try {
      const response = await fetch('http://localhost:3003/api/scores', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Quiz_Score  : 0,
              otpcode: otp
          })
      });

      if (response.status === 404) {
          alert("Wrong code Entered, Please try again.");
          location.reload();
          return;
      }

      sec.style.display = "none";
      mainMenu.style.display = "block";
      alert("You are logged in successfully.");
      window.addEventListener("beforeunload", warnUserBeforeReload);
  } catch (err) {
      console.error('Error logging in:', err.message);
      alert("An error occurred. Please try again.");
  }
});


async function getotpFromUser() {
    return otp;
  }

// if startQuiz button clicked                  
start_btn.onclick = ()=>{                     
    quiz_box.classList.add("activeQuiz"); //show quiz box
    showQuetions(0); //calling showQestions function
    queCounter(1); //passing 1 parameter to queCounter
    startTimer(15); //calling startTimer function
    startTimerLine(0); //calling startTimerLine function
}

// if exitQuiz button clicked
// exit_btn.onclick = ()=>{
//     info_box.classList.remove("activeInfo"); //hide info box
// }

// if continueQuiz button clicked
// continue_btn.onclick = ()=>{
//     info_box.classList.remove("activeInfo"); //hide info box
//     quiz_box.classList.add("activeQuiz"); //show quiz box
//     showQuetions(0); //calling showQestions function
//     queCounter(1); //passing 1 parameter to queCounter
//     startTimer(15); //calling startTimer function
//     startTimerLine(0); //calling startTimerLine function
// }

let timeValue =  15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
// const quit_quiz = result_box.querySelector(".buttons .quit");

// // if restartQuiz button clicked
// restart_quiz.onclick = ()=>{
//     quiz_box.classList.add("activeQuiz"); //show quiz box
//     result_box.classList.remove("activeResult"); //hide result box
//     timeValue = 15; 
//     que_count = 0;
//     que_numb = 1;
//     userScore = 0;
//     widthValue = 0;
//     showQuetions(que_count); //calling showQestions function
//     queCounter(que_numb); //passing que_numb value to queCounter
//     clearInterval(counter); //clear counter
//     clearInterval(counterLine); //clear counterLine
//     startTimer(timeValue); //calling startTimer function
//     startTimerLine(widthValue); //calling startTimerLine function
//     timeText.textContent = "Time Left"; //change the text of timeText to Time Left
//     next_btn.classList.remove("show"); //hide the next button
// }

// // if quitQuiz button clicked
// quit_quiz.onclick = ()=>{
//     window.location.reload(); //reload the current window
// }


const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked
next_btn.onclick = ()=>{
    if(que_count < questions.length - 1){ //if question count is less than total question length
        que_count++; //increment the que_count value
        que_numb++; //increment the que_numb value
        showQuetions(que_count); //calling showQestions function
        queCounter(que_numb); //passing que_numb value to queCounter
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        startTimer(timeValue); //calling startTimer function
        startTimerLine(widthValue); //calling startTimerLine function
        timeText.textContent = "Time Left"; //change the timeText to Time Left
        next_btn.classList.remove("show"); //hide the next button
    }else{
        clearInterval(counter); //clear counter
        clearInterval(counterLine); //clear counterLine
        showResult(); //calling showResult function
    }
}

// getting questions and options from array
function showQuetions(index){
    const que_text = document.querySelector(".que_text");
    
    //creating a new span and div tag for question and option and passing the value using array index
    let que_tag = '<span>'+ questions[index].numb + ". " + questions[index].question +'</span>';
    let option_tag = '<div class="option"><span>'+ questions[index].options[0] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[1] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[2] +'</span></div>'
    + '<div class="option"><span>'+ questions[index].options[3] +'</span></div>';
    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag
    
    const option = option_list.querySelectorAll(".option");
    
    // set onclick attribute to all available options
    for(i=0; i < option.length; i++){
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}
// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

//if user clicked on option
function optionSelected(answer){
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    let userAns = answer.textContent; //getting user selected option
    let correcAns = questions[que_count].answer; //getting correct answer from array
    const allOptions = option_list.children.length; //getting all option items
    
    if(userAns == correcAns){ //if user selected option is equal to array's correct answer
        userScore += 1; //upgrading score value with 1
        answer.classList.add("correct"); //adding green color to correct selected option
        answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
        console.log("Correct Answer");
        console.log("Your correct answers = " + userScore);
    }else{
        answer.classList.add("incorrect"); //adding red color to correct selected option
        answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
        console.log("Wrong Answer");
        
        for(i=0; i < allOptions; i++){
            if(option_list.children[i].textContent == correcAns){ //if there is an option which is matched to an array answer 
                option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                console.log("Auto selected correct answer.");
            }
        }
    }
    for(i=0; i < allOptions; i++){
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
    }
    next_btn.classList.add("show"); //show the next button if user selected any option
}


function navigateToNext() {
    isNavigatingAway = true;
    
    window.location.href = "http://localhost:3002/precision"; // Replace with the actual URL of the next page
    
  }

async function showResult(){
    window.removeEventListener("beforeunload",warnUserBeforeReload);
    info_box.classList.remove("activeInfo"); //hide info box
    quiz_box.classList.remove("activeQuiz"); //hide quiz box
    result_box.classList.add("activeResult"); //show result box
    
    const scoreText = result_box.querySelector(".score_text");
    let scoreTag = '<span>and You Scored : </span>';
    scoreText.innerHTML = scoreTag;  //adding new span tag inside score_Text
    restart_quiz.innerHTML = userScore + "/" + questions.length;
  
    
    try {
        const otp = await getotpFromUser();
        const response = await fetch('http://localhost:3003/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Quiz_Score :userScore + "/" + questions.length,
                otpcode: otp
            })
        });
                console.log('Score saved successfully');
        } catch (err) {
            console.error('Error saving score:', err.message);
        }

}

function startTimer(time){
    counter = setInterval(timer, 1000);
    function timer(){
        timeCount.textContent = time; //changing the value of timeCount with time value
        time--; //decrement the time value
        if(time < 9){ //if timer is less than 9
            let addZero = timeCount.textContent; 
            timeCount.textContent = "0" + addZero; //add a 0 before time value
        }
        if(time < 0){ //if timer is less than 0
            clearInterval(counter); //clear counter
            timeText.textContent = "Time Off"; //change the time text to time off
            const allOptions = option_list.children.length; //getting all option items
            let correcAns = questions[que_count].answer; //getting correct answer from array
            for(i=0; i < allOptions; i++){
                if(option_list.children[i].textContent == correcAns){ //if there is an option which is matched to an array answer
                    option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
                    console.log("Time Off: Auto selected correct answer.");
                }
            }
            for(i=0; i < allOptions; i++){
                option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
            }
            next_btn.classList.add("show"); //show the next button if user selected any option
        }
    }
}

function startTimerLine(time){
    counterLine = setInterval(timer, 29);
    function timer(){
        time += 1; //upgrading time value with 1
        time_line.style.width = time + "px"; //increasing width of time_line with px by time value
        if(time > 549){ //if time value is greater than 549
            clearInterval(counterLine); //clear counterLine
        }
    }
}

function queCounter(index){
    //creating a new span tag and passing the question number and total question
    let totalQueCounTag = '<span><p>'+ index +'</p> of <p>'+ questions.length +'</p> Questions</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  //adding new span tag inside bottom_ques_counter
}