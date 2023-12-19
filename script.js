const form = document.getElementById('input-form');
const results = document.getElementById('results');
const priceContainer = document.querySelector('.price-container');
const invoiceAmount = document.getElementById('invoice-amount');
const warning = document.getElementsByClassName('warning-msg')[0];
// inputs
const amount = document.getElementById('amount');
const amountUSD = document.getElementById('usd');
const amountRate = document.getElementById('rate');
// buttons
const generateButton = document.getElementById('submit-btn');
const convertButton = document.getElementById('converter-btn');
const downloadButton = document.getElementById('accept');
const clearButton = document.getElementById('clear');

const items = {    
    "Шнурок": [3.47],    
    "Кулон 10": [36.30, 45.30, 37.30, 46.30, 38.70, 47.70],    
    "Кулон 11": [50.30, 65.30, 53.30, 68.30, 55.70, 70.70],  
    "Кулон 12": [55.30, 82.30, 58.30, 85.30, 60.70, 87.70],  
    "Кулон 13": [59.30, 93.30, 62.30, 96.30, 64.70, 98.70],  
    "Кулон 14": [32.30, 35.30, 37.70],  
    "Кулон 15": [57.30, 59.70],  
    "Кулон 16": [159.70, 179.70],  
    "Кулон 17": [357.30],  
    "Кулон 18": [51.30, 76.30],  
    "Кулон 19": [70.30, 142.30, 73.30, 145.30, 75.70, 147.70],  
    "Кулон 20": [85.30, 155.30, 88.30, 158.30, 90.70, 160.70],  
    "Кулон 21": [53.00, 80.00],  
    "Кулон 22": [239.30, 259.30],
    "Кулон 23": [38.70],
    "Кулон 24": [42.70],
    "Кулон 25": [47.30, 50.30],
    "Кулон 26": [122.70],
    "Кулон 27": [58.30, 79.70, 59.00, 81.00],
    "Кулон 28": [73.30, 134.70],
}


// Event Listeners
convertButton.addEventListener('click', () => {
    warning.innerHTML = '';

    if (validateInput()) {  
        const initialAmount= convertCurrency(amountUSD.value, amountRate.value)   
        invoiceAmount.innerHTML = initialAmount

    // generate prices
    const pricesUSD = generateRandomPrices(items, amountUSD.value);
    // convert to uah
    const pricesUAH = pricesUSD.map(obj => {
        for (const item in obj) {
            if (obj.hasOwnProperty(item)) {
                return {[item]: convertCurrency(obj[item], amountRate.value)};
            }
        }
    });
    // display results
    displayResults(pricesUAH);
        
    }
});

clearButton.addEventListener('click', () => {
    results.innerHTML = '';
    amountRate.value = '';
    amountUSD.value = '';
    invoiceAmount.innerHTML = '';
    warning.innerHTML = '';
});

downloadButton.addEventListener('click', () => {

    if (results.innerHTML === '') {
        warning.innerHTML = 'Спочатку сформуйте ціни.'
        return;
    } else {
        generatePDF(results);
    }    
});


// Functions
function validateInput() {
    const regex = /^\d+(\.\d{0,4})?$/;
    // const regex = /^\d+\.\d+$/;

    if (amountUSD.value === '' || parseFloat(amountUSD.value) < 0 || amountRate.value === '' || parseFloat(amountRate.value) < 0) {
        warning.innerHTML = 'Сума має бути більше 0';
        return false;        
    } else if (!regex.test(amountUSD.value) || !regex.test(amountRate.value)) {
        warning.innerHTML = 'Формат суми має бути 750.70 та не перевищувати 4 знаки після десяткової точки, напр.: 750.7024';
        return false; 
    } else {
        return true;
    }
}

function convertCurrency(amountUSD, rate) {
    return parseFloat((amountUSD * rate).toFixed(2));
}

function generateRandomPrices(items, targetAmount) {

    const itemNames = Object.keys(items);
    const randomPrice = [];
    let remainingAmount = targetAmount;
    let include200 = false;

    while (remainingAmount > 0) {
        const randomItem = itemNames[Math.floor(Math.random() * itemNames.length)];        
        const randomItemPrice = items[randomItem][Math.floor(Math.random() * items[randomItem].length)];
        
        // ensure randomItemPrice is less than remainingAmount
        if (randomItemPrice > remainingAmount && remainingAmount >= 32.30) {
            continue;
        }
        // ensure the result will include only one price greater than 200
        if (randomItemPrice > 200 && include200) {
            continue;
        }
        if (randomItemPrice > 200) {
            include200 = true;        
        }       
        // ensure price does not go to negative
        if (remainingAmount - randomItemPrice >= 0) {
            randomPrice.push({[randomItem]: randomItemPrice});
            remainingAmount -= randomItemPrice;            
        } else {
            break;
        }
    }
    // add remaining amount to the list
    if (remainingAmount > 0) {
        randomPrice.push({'Залишок': parseFloat((remainingAmount).toFixed(2))});
    }    
    return randomPrice;
}

function displayResults(arr) {
    
    results.innerHTML = '';
    let htmlString = '<ul class="price-container">';

    arr.forEach(obj => {

        for (const item in obj) {
            if (obj.hasOwnProperty(item)) {
                htmlString += `<li>${item}: <span class="price">${obj[item]}</span> грн</li>`;
            }
        } 
})

    htmlString += '</ul>';
    results.innerHTML = htmlString;
}

function generatePDF(element) {

    // get current date
    const currentDate = new Date(); 
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const today = `${day}.${month}.${year}`;

    const extraInfo = document.createElement('div');
    extraInfo.classList.add('extra-info');
    extraInfo.innerHTML = `<p>Сума: ${invoiceAmount.textContent} грн.</p>
                           <p>Дата: ${today}</p>`;
    results.appendChild(extraInfo);

    const pdfOptions = {
        margin: 1,
        filename: `invoice_${today}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    // Use html2pdf.js to generate the PDF
    html2pdf(element, pdfOptions)
        
}





