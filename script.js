const form = document.getElementById('input-form');
const amount = document.getElementById('amount');
const results = document.getElementById('results');
// buttons
const generateButton = document.getElementById('submit-btn');
const acceptButton = document.getElementById('accept');
const regenButton = document.getElementById('regenerate');


// Event Listeners
generateButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateInput()) {
        let initialAmount = parseFloat(amount.value);
        displayResults(generate(initialAmount));
    }
});

regenButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateInput()) {
        let initialAmount = parseFloat(amount.value);
        displayResults(generate(initialAmount));
    }
});


// Functions

// validate input
function validateInput() {
    if (amount.value === '' || amount.value < 0) {
        alert('Please enter a valid number');
        return false;
    } else {
        return true;
    }
}

function generate(initialAmount) {    

    // price boundries
    const upperBound = 13034.01;
    const lowerBound = 1178.28;

    let remainingAmount = initialAmount;
    let singleItemPrice = [];
    let include200 = false;

    while (remainingAmount > 0) {
        // generate random number
        let randomNum = Math.random() * (upperBound - lowerBound) + lowerBound;        
        let roundedNum = parseFloat(randomNum.toFixed(2));            

        // insure that only one number greater than 200 is included
        if(roundedNum > 7296 && include200) {
            continue;            
        }

        if(roundedNum > 7296) {
            include200 = true;
        }        

        // stop from going to negative
        if (remainingAmount - roundedNum >= 0) {
            singleItemPrice.push(roundedNum);
            remainingAmount -= roundedNum;
        } else {
            break;
        }
    }
    // add the remaining amount to the array
    let sum = singleItemPrice.reduce((total, i) => total + i, 0);

    let difference = parseFloat((initialAmount - sum).toFixed(2));    
    if (difference > 110) {
        singleItemPrice.push(difference);
    } 
    return singleItemPrice;
}

function displayResults(arr) {

    results.innerHTML = '';
    arr.forEach((item, index) => {
        results.innerHTML += `<li>Кулон ${index + 1}: <span class="price">${item}</span> грн.</li>`
    });

    acceptButton.addEventListener('click', () => {
        // html2pdf(results)
        generatePDF(arr)
    });
}

function generatePDF(arr) {

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
        margin: 10,
        filename: `invoice_${today}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    // Use html2pdf.js to generate the PDF
    html2pdf(results, pdfOptions)
        .from(arr)
        .save();
}





