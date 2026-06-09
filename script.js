document.addEventListener('DOMContentLoaded', () => {
    const displayTop = document.getElementById('display-top');
    const displayBottom = document.getElementById('display-bottom');
    let currentInput = '';
    let previousInput = '';
    let operator = '';

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;

            if (button.classList.contains('btn-operand')) {
                handleOperand(value);
            } else if (button.classList.contains('btn-operator')) {
                handleOperator(value);
            }
        });
    });

    function handleOperand(value) {
        if (value === '.' && currentInput.includes('.')) return;
        if (value === '0' && currentInput === '0') return;
        if (value !== '.' && currentInput === '0') {
            currentInput = value;
            displayBottom.value = currentInput;
            return;
        }
        currentInput += value;
        displayBottom.value = currentInput;
    }

    function handleOperator(value) {
        if (value === 'AC') {
            resetCalculator();
        } else if (value === 'DEL') {
            currentInput = currentInput.slice(0, -1);
            displayBottom.value = currentInput;
        } else if (value === '%') {
            if (currentInput) {
                currentInput = String(parseFloat(currentInput) / 100);
                displayBottom.value = currentInput;
            }
        } else if (value === '( )') {
            const openCount = (currentInput.match(/\(/g) || []).length;
            const closeCount = (currentInput.match(/\)/g) || []).length;
            if (openCount === closeCount) {
                currentInput += '(';
            } else {
                currentInput += ')';
            }
            displayBottom.value = currentInput;
        } else if (value === '=') {
            if (previousInput && currentInput && operator) {
                const result = calculate(previousInput, operator, currentInput);
                if (result === 'Error') {
                    displayBottom.value = 'Error';
                    resetCalculator();
                    return;
                }
                displayTop.value = `${previousInput} ${operator} ${currentInput} =`;
                displayBottom.value = result;
                currentInput = String(result);
                previousInput = '';
                operator = '';
            }
        } else {
            if (currentInput || previousInput) {
                if (currentInput && previousInput && operator) {
                    const result = calculate(previousInput, operator, currentInput);
                    if (result === 'Error') {
                        displayBottom.value = 'Error';
                        resetCalculator();
                        return;
                    }
                    previousInput = String(result);
                } else if (currentInput) {
                    previousInput = currentInput;
                }
                currentInput = '';
                operator = value;
                displayTop.value = `${previousInput} ${operator}`;
                displayBottom.value = '';
            }
        }
    }

    function calculate(a, operator, b) {
        const num1 = parseFloat(a);
        const num2 = parseFloat(b);
        switch (operator) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '×':
                return num1 * num2;
            case '÷':
                if (num2 === 0) return 'Error';
                return num1 / num2;
            default:
                return 0;
        }
    }
    function resetCalculator() {
        currentInput = '';
        previousInput = '';
        operator = '';
        displayTop.value = '';
        displayBottom.value = '';
    }
});
