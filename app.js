const buttonContainer = document.querySelector('.button.container');
const display = document.querySelector('.main.display');
const smallDisplay = document.querySelector('.small.display');

const operators = {
    'plus': (a, b) => a + b,
    'minus': (a, b) => a - b,
    'divide': (a, b) => b!== 0 ? a / b : undefined,
    'multiply': (a, b) => a * b
}

let num1;
let num2;
let operate = () => {};
let operatorSymbol = '';
let result = '';
let lastButtonPressWasEqual = false;

function softClear() {
    num1 = undefined;
    num2 = undefined;
    operate = () => {};
    result = '';
}

function hardClear() {
    softClear();
    display.innerText = '';
    smallDisplay.innerText = '';
    lastButtonPressWasEqual = false;
}

function checkIfNumber(input) {
    return input - input === 0;
}

function displayInput(number) {
    if (checkIfNumber(number)) {
        if (!lastButtonPressWasEqual && (display.innerText === '.' || checkIfNumber(display.innerText))) {
            display.innerText += number;                           
        } else {
            display.innerText = number;
            lastButtonPressWasEqual = false;
        }
    } else {
        if (!checkIfNumber(display.innerText)) {
            display.innerText = number;
        } else if (!display.innerText.includes('.')) {
            display.innerText += number;           
        } 
    }
}

function calculate(operator) {
    if (num1 === undefined) {
        num1 = +display.innerText;
        smallDisplay.innerText = num1;
        operate = operators[operator.id];
        operatorSymbol = operator.innerText;
        display.innerText = operatorSymbol;   
    } else {
        if (!checkIfNumber(display.innerText)) {
            operate = operators[operator.id];
            operatorSymbol = operator.innerText;
            display.innerText = operatorSymbol;
        } else {
            num2 = +display.innerText;
            if (result !== '' && result !== undefined) {
                smallDisplay.innerText = `${result} ${operatorSymbol} ${num2} = `;
                result = operate(result, num2);
                smallDisplay.innerText += result;
            } else {
                result = operate(num1, num2);
                smallDisplay.innerText = `${num1} ${operatorSymbol} ${num2} = ${result}`
            }
            operate = operators[operator.id];
            operatorSymbol = operator.innerText;
            display.innerText = operatorSymbol;
        }
    }
}

buttonContainer.addEventListener('click', (e) => {
    if (result === undefined)  softClear();
    switch (e.target.classList[0]) {
        case 'num-button':
            displayInput(e.target.innerText);
            break;
        case 'operator-button':
            calculate(e.target);
            break;
        case 'equal-button':
            if (num1 === undefined) break;
            num2 = +display.innerText;
            if (result !== '') {
                smallDisplay.innerText = `${result} ${operatorSymbol} ${num2} =`; 
                result = operate(result, num2)
            } else {
                smallDisplay.innerText = `${num1} ${operatorSymbol} ${num2} =`; 
                result = operate(num1, num2);
            }
            display.innerText = result;
            lastButtonPressWasEqual = true;
            softClear();
            break;
        case 'clear-button':
            hardClear();
            break;
    }
})
