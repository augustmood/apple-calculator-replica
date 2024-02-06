let buffer=[]
let tempNum = 0;
let newInput = false;
let isEq = false;
let eqBuffer = [];
let calcOrder = [];

function runCalculator() {
    document.querySelector('.buttons')
        .addEventListener("click", function(event) {
            let inputVal = event.target.innerText;
            console.log(inputVal);
            action(inputVal);
            displayNum();
    })
    document.querySelector('.buttons')
    .addEventListener("mousedown", (event)=>{
        actionStyleDown(event.target);
    })
    document.querySelector('.buttons')
    .addEventListener("mouseup", (event)=>{
        actionStyleUp(event.target);
    })
    opButtonStyle();
    acButtonStyle();
}

function opButtonStyle() {
    var opButtons = document.querySelectorAll('.primary-op');
    opButtons.forEach(function(button) {
        button.addEventListener("click", function() {
          opButtons.forEach(function(btn) {
            btn.classList.remove("primary-op--selected");
          });
          
          if (this.innerText != "=") {
            this.classList.add("primary-op--selected");
          } 
        });
    });
}

function acButtonStyle() {
    document.querySelector('.ac').addEventListener("click", function(event) {
        event.target.innerText = "AC";
        var opButtons = document.querySelectorAll('.primary-op');
        opButtons.forEach(function(button) {
            button.classList.remove("primary-op--selected");
        });
    })
    document.querySelector('.buttons')
    .addEventListener("click", function(event) {
        var acButton = document.querySelector('.ac');
        let inputVal = event.target.innerText;
        if (inputVal != "AC" && isFinite(inputVal)) {
            acButton.innerText = "C"
        }
        if (inputVal == "C") {
            acButton.innerText = "AC"
        }
    })
}

function actionStyleDown(input) {
    let inputVal = input.innerText;
    if (inputVal == "+/-" || inputVal == "%" || inputVal == "AC" || inputVal == "C") {
        input.classList.add("secondary-op--clicked");
    }
    if (inputVal == "÷" || inputVal == "+" || inputVal == "×" || inputVal == "–" || inputVal == "=") {
        input.classList.add("primary-op--clicked");
    } else {
        input.classList.add("numeric--clicked")
    }
}

function actionStyleUp(input) {
    let inputVal = input.innerText;
    if (inputVal == "+/-" || inputVal == "%" || inputVal == "AC" || inputVal == "C") {
        input.classList.remove("secondary-op--clicked");
    }
    if (inputVal == "÷" || inputVal == "+" || inputVal == "×" || inputVal == "–" || inputVal == "=") {
        input.classList.remove("primary-op--clicked");
    } else {
        input.classList.remove("numeric--clicked");
    }
}

function action(inputVal) {
    if (inputVal == "AC") {
        buffer=[]
        tempNum = 0;
        newInput = false;
        isEq = false;
        eqBuffer = [];
        calcOrder = [];
    } else if (inputVal == "+/-") {
        tempNum = -tempNum;
    } else if (inputVal == "%") {
        tempNum = tempNum / 100;
    } else if (inputVal == ".") {
        if (!newInput & !tempNum.toString().includes(".")) {
            tempNum += inputVal;
        } else {
            tempNum = 0
            tempNum += inputVal; 
            newInput = false;
        }
    } else if (isFinite(inputVal)) {
        console.log("line_109", buffer);
        console.log("line_110", isEq);
        console.log("line_111", newInput)
        if (!newInput & (tempNum != 0 || tempNum.toString().includes("."))) {
            tempNum += inputVal;
        } else {
            tempNum = inputVal;
            newInput = false;
        }
    } else if (inputVal == "=") {
        if (!isEq) {
            buffer.push(Number(tempNum));
        } else {
            buffer = buffer.concat(eqBuffer);
        }
        if (buffer.length > 2) {
            tempNum = calcBuffer(buffer);
            eqBuffer = buffer.slice(-2);
        }
        buffer = [Number(tempNum)];
        isEq = true;
        newInput = true;
        console.log("line 131", buffer);
    } else {
        curr_op = opMapping(inputVal); 
        console.log("line 134", newInput);
        console.log("line 135", buffer);
        console.log("line 136", isEq);

        if (newInput) {
            // If isEq is true, we will only have one element in buffer:
            if (!isEq) {
                buffer.pop();
                calcOrder.pop();
            } else {
                buffer = [];
                buffer.push(Number(tempNum));
                console.log("line 140", buffer);
            }
        } else {
            // Push zero into buffer, if the calculator is just initiated.
            if (isEq) {
                buffer.pop();
            }
            buffer.push(Number(tempNum));
        }
        // Push the operation symbol into buffer
        // console.log(calcOrder);
        if (buffer.length >= 3) {
            if (calcOrder.length == 2) {
                if (calcOrder.toString() !== '-1,1') {
                    tempNum = calcBuffer(buffer);
                    buffer = [Number(tempNum)];
                    calcOrder = calcOrder.slice(1);
                }
            } 
            if (calcOrder.length == 3) {
                if (calcOrder.toString() === '-1,1,-1') {
                    tempNum = calcBuffer(buffer);
                    buffer = [Number(tempNum)];
                    calcOrder = calcOrder.slice(2);
                } else if (calcOrder.toString() === '-1,1,1') {
                    tempBuffer = buffer.slice(-3);
                    // console.log(tempBuffer);
                    tempNum = calcBuffer(tempBuffer);
                    buffer = buffer.slice(0, -3).concat([Number(tempNum)]);
                    calcOrder.splice(2, 1);
                }
            }
        }
        buffer.push(curr_op);
        newInput = true;
        isEq = false;
    }
}

function calcBuffer(bufferArr) {
    if (bufferArr.length == 1) {
        return bufferArr[0];
    }
    curr_num = bufferArr[0];
    curr_ops = bufferArr[1];
    return curr_ops(curr_num, calcBuffer(bufferArr.slice(2)));
}

function opMapping(input) {
    let op;
    if (input == "÷") {
        op = devide;
        calcOrder.push(1);
    } else if (input == "+") {
        op = add;
        calcOrder.push(-1);
    } else if (input == "×") {
        op = multiply;
        calcOrder.push(1);
    } else if (input == "–") {
        op = minus;
        calcOrder.push(-1);
    }
    return op;
}

function displayNum() {
    document.querySelector('.results').innerText = tempNum;
}

function multiply(a, b) {
    return a * b;
}

function add(a, b) {
    return a + b;
}

function minus(a, b) {
    return a - b;
}

function devide(a, b) {
    return a / b;
}

runCalculator();