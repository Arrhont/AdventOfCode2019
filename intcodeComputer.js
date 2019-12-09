class Program extends Array {
  
    opcode1(instructionPointer) {
        const firstOperandIndex = this[instructionPointer + 1];
        const secondOperandIndex = this[instructionPointer + 2];
        const targetIndex = this[instructionPointer + 3];
        this[targetIndex] = this[firstOperandIndex] + this[secondOperandIndex];
    }

    opcode2(instructionPointer) {
        const firstOperandIndex = this[instructionPointer + 1];
        const secondOperandIndex = this[instructionPointer + 2];
        const targetIndex = this[instructionPointer + 3];
        this[targetIndex] = this[firstOperandIndex] * this[secondOperandIndex];
    }
    
    opcode99() {
        return this;
    }
}

function intcodeComputer(program) {

    let instructionPointer = 0;
    while(program[instructionPointer]) {

        switch (program[instructionPointer]) {
            case 1:
                program.opcode1(instructionPointer);
                break;
            case 2:
                program.opcode2(instructionPointer);
                break;
            case 99:
                return program.opcode99();
            default :
                throw new Error(`smth went wrong, at: ${instructionPointer} opcode value: ${program[instructionPointer]}`);
        }

        instructionPointer = instructionPointer + 4;
    }
    return program;
}

const inputArray = [
    1,
    0,
    0,
    3,
    1,
    1,
    2,
    3,
    1,
    3,
    4,
    3,
    1,
    5,
    0,
    3,
    2,
    1,
    10,
    19,
    1,
    19,
    5,
    23,
    2,
    23,
    9,
    27,
    1,
    5,
    27,
    31,
    1,
    9,
    31,
    35,
    1,
    35,
    10,
    39,
    2,
    13,
    39,
    43,
    1,
    43,
    9,
    47,
    1,
    47,
    9,
    51,
    1,
    6,
    51,
    55,
    1,
    13,
    55,
    59,
    1,
    59,
    13,
    63,
    1,
    13,
    63,
    67,
    1,
    6,
    67,
    71,
    1,
    71,
    13,
    75,
    2,
    10,
    75,
    79,
    1,
    13,
    79,
    83,
    1,
    83,
    10,
    87,
    2,
    9,
    87,
    91,
    1,
    6,
    91,
    95,
    1,
    9,
    95,
    99,
    2,
    99,
    10,
    103,
    1,
    103,
    5,
    107,
    2,
    6,
    107,
    111,
    1,
    111,
    6,
    115,
    1,
    9,
    115,
    119,
    1,
    9,
    119,
    123,
    2,
    10,
    123,
    127,
    1,
    127,
    5,
    131,
    2,
    6,
    131,
    135,
    1,
    135,
    5,
    139,
    1,
    9,
    139,
    143,
    2,
    143,
    13,
    147,
    1,
    9,
    147,
    151,
    1,
    151,
    2,
    155,
    1,
    9,
    155,
    0,
    99,
    2,
    0,
    14,
    0
];
    
const santaSpaceProgram = new Program(...inputArray);

console.log(intcodeComputer(santaSpaceProgram)[0]);

function inputFind(inputArray, findingValue) {

    for (let noun = 0; noun < 100; noun++) {

        for (let verb = 0; verb < 100; verb++) {
            inputArray.splice(1, 2, noun, verb);
            const santaSpaceProgram = new Program(...inputArray);
            intcodeComputer(santaSpaceProgram);
            if (santaSpaceProgram[0] === findingValue) {
                return 100 * noun + verb;
            }
        }
    }
    return 'cant find this';
}

console.log(inputFind(inputArray, 19690720));