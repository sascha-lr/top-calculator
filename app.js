const buttonContainer = document.querySelector('.button.container');
const display = document.querySelector('.main.display');
const smallDisplay = document.querySelector('.small.display');

const errorMessage = 'ERROR';

const operators = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '/': (a, b) => b!== 0 ? a / b : errorMessage,
    '*': (a, b) => a * b
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
    return input !== '' ? input - input === 0 : false;
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
        if (!checkIfNumber(display.innerText)) display.innerText = number;
        if (!display.innerText.includes('.')) display.innerText += number;           
    }
}

function calculateIntermediary(operator) {
    if (num1 === undefined && checkIfNumber(display.innerText)) {
        num1 = +display.innerText;
        smallDisplay.innerText = num1;
        operate = operators[operator.id || operator];
        operatorSymbol = operator.innerText || document.getElementById(`${operator}`).innerText;
        display.innerText = operatorSymbol;
    } else {
        if (!checkIfNumber(display.innerText)) {
            operate = operators[operator.id || operator];
            operatorSymbol = operator.innerText || document.getElementById(`${operator}`).innerText;
            display.innerText = operatorSymbol;
        } else {
            num2 = +display.innerText;
            const correctNumber = result !== 0 && (result || num1) || 0;
            result = operate(correctNumber, num2);
            smallDisplay.innerText = `${correctNumber} ${operatorSymbol} ${num2} = ${result}`;
            operate = operators[operator.id || operator];
            operatorSymbol = operator.innerText || document.getElementById(`${operator}`).innerText;
            display.innerText = operatorSymbol;
        }
    }
}

function calculateFinal() {
    num2 = +display.innerText;
    const correctNumber = result !== 0 && (result || num1) || 0;
    result = operate(correctNumber, num2);
    smallDisplay.innerText = `${correctNumber} ${operatorSymbol} ${num2} =`; 
    display.innerText = result;
    lastButtonPressWasEqual = true;
    softClear();
}

function del() {
    display.innerText = display.innerText.slice(0,-1);
}

buttonContainer.addEventListener('click', (e) => {

    if (result === errorMessage) softClear(); 
    if (display.innerText === errorMessage || smallDisplay.innerText.includes(errorMessage)) hardClear();

    switch (e.target.classList[0]) {
        case 'num-button':
            displayInput(e.target.innerText);
            break;
        case 'operator-button':
            calculateIntermediary(e.target);
            break;
        case 'equal-button':
            if (num1 === undefined || !checkIfNumber(display.innerText)) break;
            calculateFinal();
            break;
        case 'clear-button':
            hardClear();
            break;
        case 'delete-button':
            del();
            break;
    }
})

document.addEventListener('keydown', (e) => {
    if (checkIfNumber(e.key) || e.key === '.') displayInput(e.key);
    switch (e.key) {
        case '*':
        case '-':
        case '/':
        case '+':
            calculateIntermediary(e.key);
            break;
        case 'Enter':
            if (num1 === undefined || !checkIfNumber(display.innerText)) break;
            calculateFinal();
            break;
        case 'Backspace':
            del();
            break;
    }
})
