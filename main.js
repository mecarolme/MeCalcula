// modo dark
const inputContainer = document.querySelector("input")
const rootElement = document.documentElement

inputContainer.addEventListener('change', function () {
    const isChecked = inputContainer.checked
    isChecked ? changeTheme(darkTheme) : changeTheme(lightTheme);    
})

const lightTheme = {
    '--background' : '#efe9f0',

    '--btnTEXT' : '#fff',
    '--btnBACKOpCalc' : '#798897',

    '--btnTEXTOpMath' : '#fff',
    '--btnBACKOpMath' : '#8A5E69',

    '--btnBACKNumbers' : '#daaed094',
    '--btnEqual' : '#d48d91',
    '--colorPrevious' : '#A66476',

    '--textHover' : '#fff',
    '--hover' : 'rgb(56, 56, 56)',
    '--hoverEqual' : '#ce3239',

    '--colorAll' : '#000'
}

const darkTheme = {
    '--background' : '#2F4858',

    '--btnTEXT' : '#324e94',
    '--btnBACKOpCalc' : '#e0a9bc',

    '--btnTEXTOpMath' : '#d82d44',
    '--btnBACKOpMath' : '#dacad2',

    '--btnBACKNumbers' : '#FFE3E8',
    '--btnEqual' : '#d45d65',
    '--colorPrevious' : '#BFA5A7',

    '--textHover' : '#fff',
    '--hover' : 'rgb(56, 56, 56)',
    '--hoverEqual' : '#e92a37',

    '--colorAll' : '#fff'
}

function changeProperty(property, value) {
    rootElement.style.setProperty(property, value)
}

function changeTheme(theme) {
    // alteração
    for (let prop in theme) {
        changeProperty(prop, theme[prop])
    }
}

// calculadora
const previousOperationText = document.querySelector("#previous-operation")
const currentOperationText = document.querySelector("#current-operation")
const buttons = document.querySelectorAll("#buttons-container button")
const calc = new Calculator(previousOperationText, currentOperationText);

// lógica da aplicação
class Calculator {
    constructor(previousOperationText, currentOperationText) {
        this.previousOperationText = previousOperationText
        this.currentOperationText = currentOperationText

        this.currentOperation = ""
    }

    // add digito na tela da calc
    addDigit(digit) {
        // checa se a operação atual tem um ponto
        if(digit === "." && this.currentOperationText.innerText.includes(".")) {
            return;
        }

        this.currentOperation = digit
        this.updateScreen()
    }

    // operações básicas e sua lógica
    processOperation(operation) {
        // checar se o valor atual está vazio
        if(this.currentOperationText.innerText === "" && operation !== "C") {
            // mudar o sinal da operação
            if(this.previousOperationText.innerText !== "") {
                this.changeOperation(operation);

            }
            return; // valor atual vazio não da pra iniciar a operação com algum sinal, como negativo ou positivo
        }

        // pegar valor atual e anterior digitado
        let operationValue
        const previous = +this.previousOperationText.innerText.split(" ")[0]
        const current = +this.currentOperationText.innerText

        switch(operation) {
            // 4 operações básicas
            case "+":
                operationValue = previous + current
                this.updateScreen(operationValue, operation, current, previous);
                break

            case "-":
                operationValue = previous - current
                this.updateScreen(operationValue, operation, current, previous);
                break

            case "/":
                operationValue = previous / current
                this.updateScreen(operationValue, operation, current, previous);
                break

            case "*":
                operationValue = previous * current
                this.updateScreen(operationValue, operation, current, previous);
                break

            // funções da calc
            case "DEL":
                operationValue = previous * current
                this.processDelOperation();
                break

            case "CE":
                operationValue = previous * current
                this.processClearCurrentOperation();
                break

            case "C":
                operationValue = previous * current
                this.processClearAll();
                break

            case "=":
                operationValue = previous * current
                this.processEqualOperation();
                break
            default:
                    return;
        }
    }

    // mudar operação matematica, complementar de processOperation
    changeOperation(operation) {
        const mathOperations = ["+", "-", "*", "/"];

        if(!mathOperations.includes(operation)) {
            return; // quebra a lógica se o usuário fugir das 4 operações 
                    // sinal de igual, DEL, C, CE - não entram na lógica daqui e esse if garante isso
        }

        this.previousOperationText.innerText = this.previousOperationText.innerText.slice(0, -1) + operation;
    }

    // mudar valores na tela
    updateScreen(operationValue = null, operation = null, current = null, previous = null) {
        console.log(operationValue, operation, current, previous)

        if(operationValue === null) {
            this.currentOperationText.innerText += this.currentOperation;
        } else {
            // checar se o valor é 0, se é apenas adiciona o valor
            if(previous === 0) {
                operationValue = current
            }

            // add valor atual como digitado "anteriormente"
            this.previousOperationText.innerText = `${operationValue} ${operation}`
            this.currentOperationText.innerText = "";
        }
    }

    // exclui um unico digito, função do DEL
    processDelOperation() {
        this.currentOperationText.innerText = this.currentOperationText.innerText.slice(0, -1);
    }

    // exclui o número atual digitado INTEIRO, função do CE
    processClearCurrentOperation() {
        this.currentOperationText.innerText = "";
    }

    // exclui tudo, valor atual e anterior
    processClearAll() {
        this.currentOperationText.innerText = "";
        this.previousOperationText.innerText = "";
    }

    // lógica do sinal de igual =
    processEqualOperation() {
        // pega o sinal referenciado antes do segundo numero ser definido,
        // e retorna de novo para devolver o resul
        const operation = previousOperationText.innerText.split(" ")[1]

        this.processOperation(operation);
    }
    
}

// eventos onde vão fazer a calc funfa
buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const value = e.target.innerText;

        if(+value >= 0 || value === ".") {
            calc.addDigit(value)
        } else {
            calc.processOperation(value);
        }
    })
}) 














