const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#moneyPlus')
const expenseDisplay = document.querySelector('#moneyMinus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
)
let transactions =
  localStorage.getItem('transaction') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
  transactions = transactions.filter(transaction => transaction.id !== ID)
  updatelocalStorage()
  init()
}

const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? '-' : '+'
  const CSSClass = amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(amount)
  const li = document.createElement('li')

  li.classList.add(CSSClass)
  li.innerHTML = `
		${name} 
		<span>${operator} R$ ${amountWithoutOperator}</span>
		<button class="deleteBtn" onClick="removeTransaction(${id})">X</button>
	`
  transactionsUl.append(li)
}

const getExpenses = transactionsAmounts =>
  Math.abs(
    transactionsAmounts
      .filter(value => value < 0)
      .reduce((accumulator, value) => accumulator + value, 0)
  ).toFixed(2)

const getIncome = transactionsAmounts =>
  transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmounts =>
  transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount)
  const total = getTotal(transactionsAmounts)
  const income = getIncome(transactionsAmounts)
  const expense = getExpenses(transactionsAmounts)

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
  transactionsUl.innerHTML = ''
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()
}

init()

const updatelocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

  if (isSomeInputEmpty) {
    toggleValueError()
    toggleNameError()
    return
  }

  toggleErrorDisplayNone()
  addToTransactionsArray(transactionName, transactionAmount)
  init()
  updatelocalStorage()
  cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)

const toggleNameError = () => {
  const password = document.getElementById('text').value
  if (!password) {
    document.getElementById('nameRequiredError').style.display = 'block'
  } else {
    document.getElementById('nameRequiredError').style.display = 'none'
  }
}

const toggleValueError = () => {
  const password = document.getElementById('amount').value
  if (!password) {
    document.getElementById('amountRequiredError').style.display = 'block'
  } else {
    document.getElementById('amountRequiredError').style.display = 'none'
  }
}

const toggleErrorDisplayNone = () => {
  document.getElementById('nameRequiredError').style.display = 'none'
  document.getElementById('amountRequiredError').style.display = 'none'
}


console.log(updatelocalStorage())