document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const basicMode = document.querySelector('.basic-mode');
    const scientificMode = document.querySelector('.scientific-mode');
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    // Switch between basic and scientific modes
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.mode === 'basic') {
                basicMode.style.display = 'grid';
                scientificMode.style.display = 'none';
            } else {
                basicMode.style.display = 'none';
                scientificMode.style.display = 'grid';
            }
        });
    });
    
    // Handle button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            const value = e.target.dataset.value;
            
            if (value === 'clear') {
                display.value = '';
            } else if (value === '=') {
                try {
                    // Replace display symbols with math symbols
                    let expr = display.value
                        .replace(/×/g, '*')
                        .replace(/√\(/g, 'sqrt(')
                        .replace(/π/g, 'pi')
                        .replace(/e/g, 'e');
                    
                    // Evaluate using math.js
                    display.value = math.evaluate(expr);
                } catch (error) {
                    display.value = 'Error';
                    console.error(error);
                }
            } else if (value === 'pi') {
                display.value += Math.PI;
            } else if (value === 'e') {
                display.value += Math.E;
            } else {
                display.value += value;
            }
        }
    });
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        const key = e.key;
        
        if (/[0-9()+\-*/.=]/.test(key)) {
            e.preventDefault();
            display.value += key;
        } else if (key === 'Enter') {
            e.preventDefault();
            try {
                display.value = math.evaluate(display.value.replace(/×/g, '*'));
            } catch {
                display.value = 'Error';
            }
        } else if (key === 'Escape') {
            e.preventDefault();
            display.value = '';
        } else if (key === 'Backspace') {
            e.preventDefault();
            display.value = display.value.slice(0, -1);
        }
    });
});