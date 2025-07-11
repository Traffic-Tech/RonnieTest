import React, { useState, useEffect } from 'react';

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNumber: boolean;
  memory: number;
}

function App() {
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNumber: false,
    memory: 0,
  });

  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const toggleDarkMode = () => setDark(!dark);

  const inputNumber = (num: string) => {
    if (state.waitingForNumber) {
      setState({
        ...state,
        display: num,
        waitingForNumber: false,
      });
    } else {
      setState({
        ...state,
        display: state.display === '0' ? num : state.display + num,
      });
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(state.display);

    if (state.previousValue === null) {
      setState({
        ...state,
        previousValue: inputValue,
        operation: nextOperation,
        waitingForNumber: true,
      });
    } else if (state.operation) {
      const currentValue = state.previousValue || 0;
      const newValue = calculate(currentValue, inputValue, state.operation);

      setState({
        ...state,
        display: String(newValue),
        previousValue: newValue,
        operation: nextOperation,
        waitingForNumber: true,
      });
    }
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(state.display);

    if (state.previousValue !== null && state.operation) {
      const newValue = calculate(state.previousValue, inputValue, state.operation);
      setState({
        ...state,
        display: String(newValue),
        previousValue: null,
        operation: null,
        waitingForNumber: true,
      });
    }
  };

  const clearDisplay = () => {
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForNumber: false,
    });
  };

  const clearEntry = () => {
    setState({
      ...state,
      display: '0',
    });
  };

  const memoryClear = () => {
    setState({
      ...state,
      memory: 0,
    });
  };

  const memoryRecall = () => {
    setState({
      ...state,
      display: String(state.memory),
      waitingForNumber: true,
    });
  };

  const memoryAdd = () => {
    const value = parseFloat(state.display);
    setState({
      ...state,
      memory: state.memory + value,
      waitingForNumber: true,
    });
  };

  const memorySubtract = () => {
    const value = parseFloat(state.display);
    setState({
      ...state,
      memory: state.memory - value,
      waitingForNumber: true,
    });
  };

  const toggleSign = () => {
    if (state.display !== '0') {
      const value = parseFloat(state.display) * -1;
      setState({
        ...state,
        display: String(value),
      });
    }
  };

  const inputDecimal = () => {
    if (state.waitingForNumber) {
      setState({
        ...state,
        display: '0.',
        waitingForNumber: false,
      });
    } else if (state.display.indexOf('.') === -1) {
      setState({
        ...state,
        display: state.display + '.',
      });
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const { key } = event;

    if (key >= '0' && key <= '9') {
      inputNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      inputOperation(key);
    } else if (key === 'Enter' || key === '=') {
      performCalculation();
    } else if (key === 'Escape') {
      clearDisplay();
    } else if (key === 'Backspace') {
      clearEntry();
    } else if (key === '.') {
      inputDecimal();
    } else if (key === 's') {
      toggleSign();
    } else if (key === 'm') {
      memoryAdd();
    } else if (key === 'n') {
      memorySubtract();
    } else if (key === 'r') {
      memoryRecall();
    } else if (key === 'c') {
      memoryClear();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [state]);

  const Button = ({ 
    onClick, 
    className = '', 
    children, 
    variant = 'default' 
  }: { 
    onClick: () => void; 
    className?: string; 
    children: React.ReactNode; 
    variant?: 'default' | 'operation' | 'clear' | 'equals';
  }) => {
    const baseClasses = "h-16 text-xl font-semibold rounded-lg transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantClasses = {
      default:
        "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 focus:ring-gray-300 dark:focus:ring-gray-600",
      operation:
        "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700",
      clear:
        "bg-red-500 hover:bg-red-600 text-white focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700",
      equals:
        "bg-green-500 hover:bg-green-600 text-white focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700"
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-700 flex items-center justify-center p-4 relative">
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 text-2xl focus:outline-none"
        aria-label="Toggle dark mode"
      >
        {dark ? '☀️' : '🌙'}
      </button>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="mb-6">
          <div className="bg-gray-900 dark:bg-gray-700 rounded-lg p-4 mb-2">
            <div className="text-right text-3xl font-mono text-white min-h-[2.5rem] flex items-center justify-end overflow-hidden">
              {state.display}
            </div>
            {state.operation && state.previousValue !== null && (
              <div className="text-right text-sm text-gray-400 mt-1">
                {state.previousValue} {state.operation}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {/* Memory Row */}
          <Button onClick={memoryAdd}>M+</Button>
          <Button onClick={memorySubtract}>M-</Button>
          <Button onClick={memoryRecall}>MR</Button>
          <Button onClick={memoryClear}>MC</Button>

          {/* Row 1 */}
          <Button onClick={clearDisplay} variant="clear">AC</Button>
          <Button onClick={clearEntry} variant="clear">CE</Button>
          <Button onClick={toggleSign}>±</Button>
          <Button onClick={() => inputOperation('/')} variant="operation">÷</Button>

          {/* Row 2 */}
          <Button onClick={() => inputNumber('7')}>7</Button>
          <Button onClick={() => inputNumber('8')}>8</Button>
          <Button onClick={() => inputNumber('9')}>9</Button>
          <Button onClick={() => inputOperation('*')} variant="operation">×</Button>

          {/* Row 3 */}
          <Button onClick={() => inputNumber('4')}>4</Button>
          <Button onClick={() => inputNumber('5')}>5</Button>
          <Button onClick={() => inputNumber('6')}>6</Button>
          <Button onClick={() => inputOperation('-')} variant="operation">−</Button>

          {/* Row 4 */}
          <Button onClick={() => inputNumber('1')}>1</Button>
          <Button onClick={() => inputNumber('2')}>2</Button>
          <Button onClick={() => inputNumber('3')}>3</Button>
          <Button onClick={() => inputOperation('+')} variant="operation">+</Button>

          {/* Row 5 */}
          <Button onClick={() => inputNumber('0')} className="col-span-2">0</Button>
          <Button onClick={inputDecimal}>.</Button>
          <Button onClick={performCalculation} variant="equals">=</Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Use keyboard for faster input
        </div>
      </div>
    </div>
  );
}

export default App;