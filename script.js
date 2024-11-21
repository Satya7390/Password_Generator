const passwordDisplay = document.querySelector("[data-passwordDisaly]");

const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");

const symbols = '~!@#$%^&*()_-+=?/.>,<`';


let password = "";
let passwordLength = 10;
let checkCount = 1;
uppercaseCheck.checked = true;

handleSlider();

setIndicator("#ffff");


// set password lenght 

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
        ((passwordLength - min) * 100) / (max - min) + "%";

}


function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}



function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateRandomUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateRandomLowercase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}



function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}


async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value); // returning promise
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "failed";
    }

    // to make a copy message visible

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(Array) {
    // Fisher-Yates Shuffle Method => algorithm for randomly shuffling OR mix the elements of an array

    for (let i = Array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    }

    let str = "";
    Array.forEach((el) => (str += el));
    return str;
}

//**focus points** 

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // special condition

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

// console.log("Starting the jouney");

generateBtn.addEventListener('click', () => {
    // if none checkboxes are selected
    if (checkCount <= 0) return;


    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    console.log("Starting the jouney");

    // starts the process of GENERATE PASSWOREDS =========

    // remove old password
    password = "";


    let funArr = [];
    if (uppercaseCheck.checked) funArr.push(generateRandomUpperCase);
    if (lowercaseCheck.checked) funArr.push(generateRandomLowercase);
    if (numbersCheck.checked) funArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funArr.push(generateSymbol);

    // compulsory addition or when checboxex are selected
    console.log("compulsory addition");

    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    //** when some checboxex are not  selected

    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randIndex = getRndInteger(0, funArr.length);
        console.log("randIndex" + randIndex);
        password += funArr[randIndex]();
    }

    // shuffle/ mixup the password 

    password = shufflePassword(Array.from(password));

    console.log("shuffling done")
    passwordDisplay.value = password;

    calcStrength();

})



