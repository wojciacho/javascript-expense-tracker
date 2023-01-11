const balance = document.querySelector("#balance"),
  moneyIncome = document.querySelector("#money-plus"),
  moneyExpense = document.querySelector("#money-minus"),
  list = document.querySelector("#list"),
  form = document.querySelector("#form"),
  text = document.querySelector("#text"),
  amount = document.querySelector("#amount"),
  inputs = document.querySelectorAll(".message");

const transactionsLS = JSON.parse(localStorage.getItem("transactions"));

let transactions =
  localStorage.getItem("transactions") !== null ? transactionsLS : [];

const addTransactions = (item) => {
  const sign = item.amount < 0 ? "-" : "+";
  const element = document.createElement("li");

  element.classList.add(item.amount < 0 ? "minus" : "plus");
  element.innerHTML = `${item.text} <span>${sign}${Math.abs(
    item.amount
  )}</span>`;
  element.addEventListener("click", () => {
    removeTransaction(item.id);
  });
  list.appendChild(element);
};

const updateBalance = () => {
  const amount = transactions.map((item) => item.amount);
  const total = amount
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  const income = amount
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  const expense = (
    amount.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  )
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");

  balance.innerText = `$${total}`;
  moneyIncome.innerHTML = `$${income}`;
  moneyExpense.innerHTML = `$${expense}`;
};

const init = () => {
  list.innerHTML = "";
  transactions.forEach(addTransactions);
  updateBalance();
};

const generateRandomID = () => {
  return Math.floor(Math.random() * 100000);
};

const addTransactionHistory = (e) => {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    inputs.forEach((input) => {
      input.classList.add("empty");
    });
  } else {
    inputs.forEach((input) => {
      input.classList.remove("empty");
    });
    const transaction = {
      id: generateRandomID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);
    addTransactions(transaction);
    updateBalance();

    updateLS();
    text.value = "";
    amount.value = "";
  }
};

const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLS();
  init();
};

const updateLS = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

init();

form.addEventListener("submit", addTransactionHistory);
