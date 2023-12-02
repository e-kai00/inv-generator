const form = document.getElementById('input-form');
const amount = document.getElementById('amount');
const results = document.getElementById('results');
const priceContainer = document.querySelector('.price-container');
// buttons
const generateButton = document.getElementById('submit-btn');
const acceptButton = document.getElementById('accept');
const clearButton = document.getElementById('clear');

const items = {    
    "item1": [32.30, 34.30, 42.70, 44.70],    
    "item2": [52.30, 54.30, 72.70, 74.70],    
    "item3": [62.30, 64.30, 82.70, 84.70],  
}


// Event Listeners
generateButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateInput()) {
        let initialAmount = parseFloat(amount.value);
        displayResults(generateRandomPrices(items, initialAmount));      
    }
});

clearButton.addEventListener('click', () => {
    results.innerHTML = '';
    amount.value = '';
});

acceptButton.addEventListener('click', () => {

    if (results.innerHTML === '') {
        alert('Спочатку сформуйте ціни.');
        return;
    } else {
        generatePDF(results);
    }    
});


// validate input
function validateInput() {
    if (amount.value === '' || amount.value < 0) {
        alert('Please enter a valid number');
        return false;
    } else {
        return true;
    }
}


function generateRandomPrices(items, targetAmount) {

    const itemNames = Object.keys(items);
    const randomPrice = [];
    let remainingAmount = targetAmount;
    const include200 = false;

    while (remainingAmount > 0) {
        const randomItem = itemNames[Math.floor(Math.random() * itemNames.length)];        
        const randomItemPrice = items[randomItem][Math.floor(Math.random() * items[randomItem].length)];
        
        // ensure randomItemPrice is less than remainingAmount
        if (randomItemPrice > remainingAmount && remainingAmount >= 32.30) {
            continue;
        }
        // ensure randomItemPrice that the result will include only one price greater than 200
        if (randomItemPrice > 200 && include200) {
            continue;
        }
        if (randomItemPrice > 200) {
            include200 = true;        
        }       
        // ensure price does not go to negative
        if (remainingAmount - randomItemPrice >= 0) {
            randomPrice.push(randomItemPrice);
            remainingAmount -= randomItemPrice;            
        } else {
            break;
        }
    }
    // add remaining amount adds the last item
    if (remainingAmount > 0) {
        randomPrice.push(parseFloat((remainingAmount).toFixed(2)));
    }    
    return randomPrice;
}

function displayResults(arr) {
    
    results.innerHTML = '';
    let htmlString = '<ul class="price-container">';
    arr.forEach((price, index) => {
        htmlString += `<li>Кулон ${index + 1}: <span class="price">${price}</span> $</li>`
    });  
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
    extraInfo.innerHTML = `<p>Сума: ${amount.value} грн.</p>
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





