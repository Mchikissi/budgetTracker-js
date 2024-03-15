const form = document.querySelector('.add');
let transactions = localStorage.getItem('transactions') !== null ? JSON.parse(localStorage.getItem('transactions')) : [];
const income_li = document.querySelector('.income-list');
const expense_li = document.querySelector('.expense-list');
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const transactionHistory = document.querySelector('.transaction-history');


function updatedStats() {

    const incomeValue = transactions.filter(transaction => transaction.amount > 0).reduce((total, transaction) => total += Number(transaction.amount), 0)

    income.textContent = incomeValue;

    const expenseValue = transactions.filter(transaction => transaction.amount < 0).reduce((total, transaction) => total += Math.abs(Number(transaction.amount)), 0);

    expense.textContent = expenseValue;

    const balanceValue = incomeValue - expenseValue;

    balance.textContent = balanceValue;

}

function generateli(id, source, amount, time) {
    return `<li data-id="${id}">
    <p>
        <span>${source}</span>
        <span id="time">${time}</span>
    </p>
    <span>${Math.abs(amount)}</span>
    <i class="bi bi-trash3-fill delete"></i>
</li>`;
}

function addTransactionDom(id, source, amount, time) {

    if (amount >= 0) {
        income_li.innerHTML += generateli(id, source, amount, time);
    } else {
        expense_li.innerHTML += generateli(id, source, amount, time);
    }

}

function addTransaction(source, amount) {
    let time = new Date();
    let transaction =
    {
        id: Math.floor(Math.random() * 100000),
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    addTransactionDom(transaction.id, source, amount, transaction.time);
}


form.addEventListener('submit', event => {
    event.preventDefault();
    if (form.source.value === '' || form.source.value === '') {
        return alert('Please enter correct values!');
    }

    addTransaction(form.source.value, form.amount.value);
    updatedStats();
    form.reset();
})

function getTransaction() {
    transactions.forEach(transaction => {
        if (transaction.amount >= 0) {
            income_li.innerHTML += generateli(transaction.id, transaction.source, transaction.amount, transaction.time);

        } else {
            expense_li.innerHTML += generateli(transaction.id, transaction.source, transaction.amount, transaction.time);

        }
    })
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => {
        return transaction.id !== Number(id);
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

income_li.addEventListener('click', event => {
    if (event.target.classList.contains('delete')) {
        event.target.parentElement.remove();
        deleteTransaction(event.target.parentElement.dataset.id);
        updatedStats();
    }
})

expense_li.addEventListener('click', event => {
    if (event.target.classList.contains('delete')) {

        event.target.parentElement.remove();

        deleteTransaction(event.target.parentElement.dataset.id);
        updatedStats();
    }
})

function init() {
    getTransaction();
    updatedStats();
}

init();