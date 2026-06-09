/* ===========================
   CALCULATOR APPLICATION
   =========================== */

class Calculator {
    constructor() {
        // Display Elements
        this.displayTop = document.getElementById('display-top');
        this.displayBottom = document.getElementById('display-bottom');

        // State Variables
        this.currentInput = '';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;

        // Initialize event listeners
        this.initializeEventListeners();
    }

    /* ===========================
       EVENT LISTENERS
       =========================== */

    initializeEventListeners() {
        // Number Buttons
        document.querySelectorAll('.btn-number').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNumber(e));
        });

        // Operator Buttons
        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleOperator(e));
        });

        // Function Button (AC)
        document.querySelectorAll('.btn-function').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFunction(e));
        });

        // Equal Button
        document.getElementById('btn-equal').addEventListener('click', () => this.calculate());

        // Keyboard Support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /* ===========================
       NUMBER HANDLING
       =========================== */

    handleNumber(event) {
        const btn = event.target.closest('.btn-number');
        const value = btn.innerText.trim();

        // Handle decimal point
        if (value === '.') {
            if (this.currentInput.includes('.')) return;
            if (this.currentInput === '') this.currentInput = '0';
        }

        // Handle backspace
        if (value === '⌫') {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            // Reset display on new input after calculation
            if (this.shouldResetDisplay) {
                this.currentInput = value;
                this.shouldResetDisplay = false;
            } else {
                this.currentInput += value;
            }
        }

        this.updateDisplay();
    }

    /* ===========================
       OPERATOR HANDLING
       =========================== */

    handleOperator(event) {
        const btn = event.target.closest('.btn-operator');
        let operatorValue = btn.innerText.trim();

        // Map operator symbols to actual operators
        const operatorMap = {
            '÷': '/',
            '×': '*',
            '−': '-',
            '+': '+',
            '%': '%',
            '( )': 'parentheses'
        };

        operatorValue = operatorMap[operatorValue] || operatorValue;

        // Handle parentheses
        if (operatorValue === 'parentheses') {
            this.handleParentheses();
            return;
        }

        // Handle percentage
        if (operatorValue === '%') {
            this.handlePercentage();
            return;
        }

        // Prevent operator if no input
        if (this.currentInput === '') return;

        // If there's already an operator, calculate first
        if (this.operator !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousInput = this.currentInput;
        this.operator = operatorValue;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    /* ===========================
       FUNCTION HANDLING (AC)
       =========================== */

    handleFunction(event) {
        const btn = event.target.closest('.btn-function');
        const value = btn.innerText.trim();

        if (value === 'AC') {
            this.reset();
        }
    }

    /* ===========================
       CALCULATION LOGIC
       =========================== */

    calculate() {
        // Prevent calculation without complete expression
        if (this.previousInput === '' || this.currentInput === '' || this.operator === null) {
            return;
        }

        let result;
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);

        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current !== 0 ? prev / current : 0;
                if (current === 0) {
                    alert('Cannot divide by zero');
                    this.reset();
                    return;
                }
                break;
            default:
                return;
        }

        // Format result to avoid floating point issues
        result = Math.round(result * 100000000) / 100000000;

        // Update display with calculation history
        this.displayTop.value = `${this.previousInput} ${this.operator} ${this.currentInput} =`;
        this.displayBottom.value = result.toString();

        // Reset for next calculation
        this.currentInput = result.toString();
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = true;
    }

    /* ===========================
       PERCENTAGE HANDLING
       =========================== */

    handlePercentage() {
        if (this.currentInput === '') return;

        const currentNum = parseFloat(this.currentInput);
        let percentageResult;

        if (this.operator && this.previousInput !== '') {
            // Calculate percentage of previous number
            const previousNum = parseFloat(this.previousInput);
            percentageResult = (previousNum * currentNum) / 100;
        } else {
            // Calculate percentage of current number
            percentageResult = currentNum / 100;
        }

        this.currentInput = percentageResult.toString();
        this.updateDisplay();
    }

    /* ===========================
       PARENTHESES HANDLING
       =========================== */

    handleParentheses() {
        // Toggle parentheses in current input
        if (this.currentInput.includes('(')) {
            this.currentInput = this.currentInput.replace('(', '').replace(')', '');
        } else {
            this.currentInput = `(${this.currentInput})`;
        }
        this.updateDisplay();
    }

    /* ===========================
       KEYBOARD SUPPORT
       =========================== */

    handleKeyboard(event) {
        const key = event.key;

        // Number keys (0-9)
        if (key >= '0' && key <= '9') {
            event.preventDefault();
            this.currentInput += key;
            this.updateDisplay();
        }

        // Decimal point
        if (key === '.') {
            event.preventDefault();
            if (!this.currentInput.includes('.')) {
                if (this.currentInput === '') this.currentInput = '0';
                this.currentInput += key;
                this.updateDisplay();
            }
        }

        // Operators
        if (key === '+' || key === '-' || key === '*' || key === '/') {
            event.preventDefault();
            if (this.currentInput !== '') {
                this.previousInput = this.currentInput;
                this.operator = key;
                this.shouldResetDisplay = true;
                this.updateDisplay();
            }
        }

        // Enter or = for calculation
        if (key === 'Enter' || key === '=') {
            event.preventDefault();
            this.calculate();
        }

        // Backspace
        if (key === 'Backspace') {
            event.preventDefault();
            this.currentInput = this.currentInput.slice(0, -1);
            this.updateDisplay();
        }

        // Escape for AC (Clear All)
        if (key === 'Escape') {
            event.preventDefault();
            this.reset();
        }
    }

    /* ===========================
       DISPLAY MANAGEMENT
       =========================== */

    updateDisplay() {
        this.displayBottom.value = this.currentInput || '0';

        // Update top display with operation
        if (this.operator !== null) {
            this.displayTop.value = `${this.previousInput} ${this.formatOperator(this.operator)}`;
        } else {
            this.displayTop.value = '';
        }
    }

    formatOperator(op) {
        const operatorMap = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
            '%': '%'
        };
        return operatorMap[op] || op;
    }

    /* ===========================
       RESET CALCULATOR
       =========================== */

    reset() {
        this.currentInput = '';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.displayTop.value = '';
        this.displayBottom.value = '0';
    }
}

/* ===========================
   INITIALIZE CALCULATOR
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
