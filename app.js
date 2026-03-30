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

const state = {
    num1: undefined,
    num2: undefined,
    operate: () => {},
    operatorSymbol: '',
    result: '',
    lastBtnPressEqual: false,
}

function softClear() {
    state.num1 = undefined;
    state.num2 = undefined;
    state.operate = () => {};
    state.result = '';
}

function hardClear() {
    softClear();
    display.innerText = '';
    smallDisplay.innerText = '';
    state.lastBtnPressEqual = false;
}

function checkIfNumber(input) {
    return input !== '' ? input - input === 0 : false;
}

function displayInput(input) {
    if (checkIfNumber(input) && display.innerText.length < 20) {
        if (!state.lastBtnPressEqual && (display.innerText === '.' || checkIfNumber(display.innerText))) {
            display.innerText += input;                           
        } else {
            display.innerText = input;
            state.lastBtnPressEqual = false;
        }
    } else {
        if (!checkIfNumber(display.innerText)) display.innerText = input;
        if (!display.innerText.includes('.') && display.innerText.length < 20) display.innerText += input;           
    }
}

function setOperator(operator) {
    state.operate = operators[operator.id || operator];
    state.operatorSymbol = operator.innerText || document.getElementById(`${operator}`).innerText;
    display.innerText = state.operatorSymbol;
}

function calculate() {
    state.num2 = +display.innerText;
    const correctNumber = state.result !== 0 && (state.result || state.num1) || 0;
    state.result = state.operate(correctNumber, state.num2);
    smallDisplay.innerText = `${correctNumber} ${state.operatorSymbol} ${state.num2} =`; 
}

function handleOperator(operator) {
    if (state.num1 === undefined && checkIfNumber(display.innerText)) {
        state.num1 = +display.innerText;
        smallDisplay.innerText = state.num1;
        setOperator(operator);
    } else {
        if (!checkIfNumber(display.innerText)) {
            setOperator(operator);
        } else {
            calculate();
            smallDisplay.innerText += ` ${state.result}`;
            setOperator(operator);
        }
    }
}

function handleEquals() {
    if (state.num1 === undefined || !checkIfNumber(display.innerText)) return;
    calculate();
    display.innerText = state.result;
    state.lastBtnPressEqual = true;
    softClear();
}

function del() {
    display.innerText = display.innerText.slice(0,-1);
    state.lastBtnPressEqual = false;
}

buttonContainer.addEventListener('click', (e) => {

    if (state.result === errorMessage) softClear(); 
    if (display.innerText === errorMessage || smallDisplay.innerText.includes(errorMessage)) hardClear();

    switch (e.target.classList[0]) {
        case 'num-button':
            displayInput(e.target.innerText);
            break;
        case 'operator-button':
            handleOperator(e.target);
            break;
        case 'equal-button':
            handleEquals();
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
            handleOperator(e.key);
            break;
        case 'Enter':
        case '=':
            handleEquals();
            break;
        case 'Backspace':
            del();
            break;
        case 'c':
            hardClear();
            break;
    }
})
