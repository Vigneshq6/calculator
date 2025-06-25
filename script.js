class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.buttons = document.querySelectorAll('.btn');
        this.initialize();
    }

    initialize() {
        // Event delegation for buttons
        document.querySelector('.buttons').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                this.handleButtonClick(e.target.dataset.value);
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            const { key } = e;
            
            if (/[0-9()+\-*/.=]/.test(key)) {
                e.preventDefault();
                this.handleInput(key);
            } else if (key === 'Enter') {
                e.preventDefault();
                this.calculate();
            } else if (key === 'Escape') {
                e.preventDefault();
                this.clearDisplay();
            } else if (key === 'Backspace') {
                e.preventDefault();
                this.backspace();
            }
        });

        // Prevent display overflow
        new ResizeObserver(() => {
            this.display.scrollLeft = this.display.scrollWidth;
        }).observe(this.display);
    }

    handleButtonClick(value) {
        switch(value) {
            case '=':
                this.calculate();
                break;
            case 'clear':
                this.clearDisplay();
                break;
            default:
                this.handleInput(value);
        }
    }

    handleInput(value) {
        // Prevent multiple decimal points in a number
        if (value === '.' && this.display.value.includes('.') && 
            !this.display.value.split(/[\+\-\*\/]/).pop().includes('.')) {
            return;
        }

        // Replace × with * for display while keeping × in UI
        const displayValue = value === '*' ? '×' : value;
        this.display.value += displayValue;
    }

    calculate() {
        try {
            // Replace × with * for evaluation
            const expression = this.display.value.replace(/×/g, '*');
            
            // Validate expression
            if (!this.isValidExpression(expression)) {
                throw new Error('Invalid expression');
            }

            // Use Function constructor for safer eval alternative
            const result = new Function(`return ${expression}`)();
            
            // Handle division by zero
            if (!isFinite(result)) {
                throw new Error('Division by zero');
            }

            this.display.value = this.formatResult(result);
        } catch (error) {
            this.display.value = 'Error';
            console.error('Calculation error:', error);
        }
    }

    isValidExpression(expr) {
        // Basic validation - can be expanded
        return /^[\d+\-*/().\s]+$/.test(expr) && 
               !/\/\s*0(?!\.)/.test(expr) && // Simple division by zero check
               !/[\+\-\*\/]{2,}/.test(expr); // No consecutive operators
    }

    formatResult(num) {
        // Format to display up to 10 decimal places if needed
        const str = num.toString();
        return str.length > 10 ? parseFloat(num.toFixed(10)) : num;
    }

    clearDisplay() {
        this.display.value = '';
    }

    backspace() {
        this.display.value = this.display.value.slice(0, -1);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});