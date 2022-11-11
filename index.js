import chalk from 'chalk';
import readline from 'readline';

let stack = [];

const operations = {
    '+': (a,b) => a+b,
    '-': (a,b) => a-b,
    '*': (a,b) => a*b,
    '/': (a,b) => a/b
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.prompt();

rl.on('line', function (cmd) {

    const cleanedInputs = cleanInput(cmd);
    const errors = processInputs(cleanedInputs);
    showMessages(errors);

    rl.prompt();
});

rl.on('close', triggerClose);

/**
 * Print messages to terminal
 * @param {string} inputs - User input to be cleaned
 * @returns {Array<string>}
 */
function cleanInput(inputs) {
    return inputs.trim().split(' ');
}

/**
 * Process the inputs. Brains of the calculator.
 * @param {Array<string>} inputs - Array of user inputs
 * @returns {Array<string>} - Array of error messages
 */
function processInputs(inputs) {
    const errors = [];
    for (let i = 0; i<inputs.length; i++) {
        const input = inputs[i];

        if (input === 'q') {
            triggerClose();
        } else if (operations.hasOwnProperty(input)) {
            if (stack.length>1) {
                const b = stack.pop();
                const a = stack.pop();

                stack.push(operations[input](a,b));
            } else {
                errors.push('Insufficient numbers provided before an operator');
                break;
            }
        } else if (!Number.isNaN(Number(input))) {
            stack.push(Number(input));
        } else {
            errors.push('Unrecognized input encountered: '+input);
            break;
        }
    }

    return errors;
}

/**
 * Close the program
 * @returns void
 */
function triggerClose() {
    process.exit(0);
}

/**
 * Print messages to terminal
 * @param {Array<string>} errors - Array of error messages
 * @returns void
 */
function showMessages(errors) {
    if (errors.length) {
        errors.forEach(error => console.log(chalk.red(error)));
    } else {
        console.log(chalk.blue(stack[stack.length - 1]));
    }
}