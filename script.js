'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} EUR`;
};

// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}.`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}`;
};

// calcDisplaySummary(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsernames(accounts);
console.log(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc.username !== currentAccount.username
  ) {
    console.log(`TRA VALID`);
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////

// Coding Challenge #1
const Julia = [3, 5, 2, 12, 7];
const Kate = [4, 1, 15, 8, 3];
function checkDogs(dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice(1);
  dogsJuliaCorrected.splice(-2, 2);
  // console.log(dogsJuliaCorrected);
  dogsJuliaCorrected.forEach(function (num, i) {
    const check = num >= 3 ? 'adult' : 'puppy';
    console.log(`Dog number ${i + 1} is an ${check}, and is ${num} years old`);
  });
  dogsKate.forEach(function (num, i) {
    const check = num >= 3 ? 'adult' : 'puppy';
    console.log(`Dog number ${i + 1} is an ${check}, and is ${num} years old`);
  });
}
checkDogs(Julia, Kate);

// Coding Challenge #2
const calcAverageHumanAge = ages => {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  // console.log(humanAge);

  const leftOnes = humanAge.filter(age => age >= 18);
  // console.log(leftOnes);

  const averageAge = leftOnes.reduce((acc, a) => acc + a, 0) / leftOnes.length;
  // console.log(averageAge);
  return averageAge;
};
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);

// Coding Challenge #3
const calcAverageHumanAge1 = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const avg11 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg22 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg11, avg22);

// Coding Challenge #4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

// 2
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  }`
);

// 3.
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);
const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4
console.log(`${ownersEatTooMuch.join(' and ')} dogs eat too much`);
console.log(`${ownersEatTooLittle.join(' and ')} dogs eat too little`);

// 5.
console.log(dogs.some(dog => dog.curFood === dog.recFood));

// 6.
const check = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
console.log(dogs.some(check));

// 7.
console.log(dogs.filter(check));

// 8.
const dogsCopy = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsCopy);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // Map Filter Reduce
// // Map
// const eurToUSD = 1.1;
// const movementsToUSD = movements.map(mov => mov * eurToUSD);
// console.log(movements);
// console.log(movementsToUSD);
// const movementsToUSDfor = [];
// for (const mov of movements) {
//   movementsToUSDfor.push(mov * eurToUSD);
// }
// console.log(movementsToUSDfor);
// const movementsDescription = movements.map(
//   (mov, i) =>
//     `Movements ${i + 1} : You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescription);
// // Filter
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements)
//   if (mov > 0) {
//     depositsFor.push(mov);
//   }
// console.log(depositsFor);
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// // REDUCE METHOD
// const max = movements.reduce((acc, mov) => {
//   return acc > mov ? acc : mov;
// }, movements[0]);
// console.log(max);

// // The Magic of Chaining Methods
// // PIPELINE
// const eurToUSD1 = 1.1;
// const totalDepositsInUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUSD)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsInUSD);

// //Find
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// // some: condition
// // every:
// // separate callback
// // flat and flatMap

// // sorting
// // Strings
// const owners = ['Jonas', 'Jack', 'Maratha'];
// console.log(owners.sort());

// // FILL
// const x = new Array(7);
// console.log(x);

// x.fill(1, 3, 5);
// // x.fill(1);
// // console.log(x);

// // ARRAY.FROM
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(el =>
//     Number(el.textContent.replace('EUR', ''))
//   );
//   console.log(movementsUI);
// });

// // 1
// const bankDepositSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(bankDepositSum);

// // 2
// // const numDesposit = accounts.flatMap(acc => acc.movements).filter( mov => mov > 1000).length;
// // console.log(numDesposit);

// const numDesposit = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, cur) => (cur >= 1000 ? acc + 1 : acc), 0);
// console.log(numDesposit);

// // 3
// const { deposit, withdrawal } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (acc, cur) => {
//       acc[cur > 0 ? 'deposit' : 'withdrawal'] += cur;
//       // cur > 0 ? (acc.deposit += cur) : (acc.withdrawal += cur);
//       return acc;
//     },
//     { deposit: 0, withdrawal: 0 }
//   );

// console.log(deposit, withdrawal);
// //4.
// //  this is a nice title => This Is a Nice Tit1
// const convert = function (title) {
//   const capitalise = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'the', 'or', 'on', 'in', 'and', 'with', 'but'];

//   const changeCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalise(word)))
//     .join(' ');
//   return capitalise(changeCase);
// };
// console.log(convert('this is a nice title'));
// console.log(convert('and She LOVES me'));
