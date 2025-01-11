// modo dark
const inputContainer = document.querySelector("input");
const rootElement = document.documentElement;

inputContainer.addEventListener("change", function () {
  const isChecked = inputContainer.checked;
  isChecked ? changeTheme(darkTheme) : changeTheme(lightTheme);
});

const lightTheme = {
  "--background": "#efe9f0",
  "--btnTEXT": "#fff",
  "--btnBACKOpCalc": "#798897",
  "--btnTEXTOpMath": "#fff",
  "--btnBACKOpMath": "#8A5E69",
  "--btnBACKNumbers": "#daaed094",
  "--btnEqual": "#d48d91",
  "--colorPrevious": "#A66476",
  "--textHover": "#fff",
  "--hover": "rgb(56, 56, 56)",
  "--hoverEqual": "#ce3239",
  "--colorAll": "#000",
};

const darkTheme = {
  "--background": "#2F4858",
  "--btnTEXT": "#324e94",
  "--btnBACKOpCalc": "#e0a9bc",
  "--btnTEXTOpMath": "#d82d44",
  "--btnBACKOpMath": "#dacad2",
  "--btnBACKNumbers": "#FFE3E8",
  "--btnEqual": "#d45d65",
  "--colorPrevious": "#BFA5A7",
  "--textHover": "#fff",
  "--hover": "rgb(56, 56, 56)",
  "--hoverEqual": "#e92a37",
  "--colorAll": "#fff",
};

function changeProperty(property, value) {
  rootElement.style.setProperty(property, value);
}

function changeTheme(theme) {
  for (let prop in theme) {
    changeProperty(prop, theme[prop]);
  }
}

const previousOperationText = document.querySelector("#previous-operation");
const currentOperationText = document.querySelector("#current-operation");
const buttons = document.querySelectorAll("#buttons-container button");

class Calculator {
  constructor(previousOperationText, currentOperationText) {
    this.previousOperationText = previousOperationText;
    this.currentOperationText = currentOperationText;
    this.historyList = document.querySelector("#history-list");
    this.currentOperation = "";
    this.isNewCalculation = true;
  }

  updateHistory(previous, operation, current, result) {
    if (
      previous !== 0 &&
      !isNaN(result) &&
      result !== Infinity &&
      result !== -Infinity
    ) {
      const historyItem = document.createElement("li");
      historyItem.textContent = `${previous} ${operation} ${current} = ${result}`;

      this.historyList.insertBefore(historyItem, this.historyList.firstChild);

      if (this.historyList.childNodes.length > 10) {
        this.historyList.removeChild(this.historyList.lastChild);
      }
    }
  }
  addDigit(digit) {
    if (digit === "." && this.currentOperationText.innerText.includes("."))
      return;
    this.currentOperation = digit;
    this.updateScreen();
  }

  processOperation(operation) {
    if (this.currentOperationText.innerText === "" && operation !== "C") {
      if (this.previousOperationText.innerText !== "")
        this.changeOperation(operation);
      return;
    }

    const previous = +this.previousOperationText.innerText.split(" ")[0];
    const current = +this.currentOperationText.innerText;

    if (["+", "-", "*", "/"].includes(operation)) {
      const result = this.calculate(previous, current, operation);
      this.updateScreen(result, operation, current, previous);
    } else {
      this.handleSpecialOperation(operation);
    }
  }

  calculate(previous, current, operation) {
    const operations = {
      "+": (prev, curr) => prev + curr,
      "-": (prev, curr) => prev - curr,
      "*": (prev, curr) => prev * curr,
      "/": (prev, curr) => prev / curr,
    };
    return operations[operation](previous, current);
  }

  handleSpecialOperation(operation) {
    const operations = {
      DEL: () => this.processDelOperation(),
      CE: () => this.processClearCurrentOperation(),
      C: () => this.processClearAll(),
      "=": () => this.processEqualOperation(),
    };

    if (operations[operation]) {
      operations[operation]();
    }
  }

  changeOperation(operation) {
    const validOperations = ["+", "-", "*", "/"];
    if (validOperations.includes(operation)) {
      this.previousOperationText.innerText =
        this.previousOperationText.innerText.slice(0, -1) + operation;
    }
  }

  updateScreen(
    operationValue = null,
    operation = null,
    current = null,
    previous = null
  ) {
    if (operationValue === null) {
      this.currentOperationText.innerText += this.currentOperation;
    } else {
      if (previous === 0 && operation) operationValue = current;

      this.previousOperationText.innerText =
        operationValue !== "Erro"
          ? `${operationValue} ${operation || ""}`
          : "Erro";

      this.currentOperationText.innerText = "";

      if (
        operation &&
        previous !== null &&
        current !== null &&
        operationValue !== "Erro"
      ) {
        this.updateHistory(previous, operation, current, operationValue);
      }
    }
  }

  processDelOperation() {
    this.currentOperationText.innerText =
      this.currentOperationText.innerText.slice(0, -1);
  }

  processClearCurrentOperation() {
    this.currentOperationText.innerText = "";
  }

  processClearAll() {
    this.currentOperationText.innerText = "";
    this.previousOperationText.innerText = "";
  }

  processEqualOperation() {
    const operation = this.previousOperationText.innerText.split(" ")[1];
    this.processOperation(operation);
  }
}

const calc = new Calculator(previousOperationText, currentOperationText);

buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const value = e.target.innerText;

    if (+value >= 0 || value === ".") {
      calc.addDigit(value);
    } else {
      calc.processOperation(value);
    }
  });
});
