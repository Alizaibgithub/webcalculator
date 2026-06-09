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
        } else if (value === '=') {
            if (previousInput && currentInput && operator) {
                const result = calculate(previousInput, operator, currentInput);
                displayTop.value = `${previousInput} ${operator} ${currentInput} =`;
                displayBottom.value = result;
                currentInput = result;
                previousInput = '';
                operator = '';
            }
        } else {
            if (currentInput) {
                if (previousInput) {
                    previousInput = calculate(previousInput, operator, currentInput);
                } else {
                    previousInput = currentInput;
                }
                currentInput = '';
                operator = value;
                displayTop.value = `${previousInput} ${operator}`;
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
