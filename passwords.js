const minInput = 273025;
const maxInput = 767253;

function intToDigits (num) {
    const numString = num.toString();
    let result = [];

    for (const digit of numString) {
        result.push(+digit);
    }

    return result;
}

function adjustmentCheck(arr) {

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) return true;
    }

    return false;
}

function enchancedAdjustmentCheck(arr) {
    let length = 1;
    const lengthes = [];

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            length++;
        } else {
            lengthes.push(length);
            length = 1;
        }
    }
    
    lengthes.push(length);
    return lengthes.some(elem => elem === 2);
}

function noDecreaseCheck(arr) {

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return false;
    }

    return true; 
}

function passwordCounter(from = minInput, to = maxInput){
    let counter = 0;

    for (let i = from; i <= to; i++) {
        if (enchancedAdjustmentCheck(intToDigits(i)) && noDecreaseCheck(intToDigits(i))) {
            counter++;
        }
    }

    return counter;
}

console.log(passwordCounter());