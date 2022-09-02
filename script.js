'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: 'Martin Muthomi',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Derrick Murimi',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Linet Kendi',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Musa Kimaro',
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

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
for (const [i, mov] of movements.entries()) {
    if (mov > 0) {
        console.log(`Transaction${i + 1}:You deposited ${mov}`);
    } else {
        console.log(`Transaction${i + 1}:You withdrew ${Math.abs(mov)}`);
    }
}
console.log('=====for Each=====');
movements.forEach((mov, i, arr) => {
    if (mov > 0) {
        console.log(`Transaction${i + 1}:You deposited ${mov}`);
    } else {
        console.log(`Transaction${i + 1}:You withdrew ${Math.abs(mov)}`);
    }
});
const calcDisplayMovements = function(movements, sort = false) {
    containerMovements.innerHTML = '';
    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
    movs.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type}">
               ${i + 1}${type}</div>
            <div class="movements__value">${mov}₤</div>
         </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);
    labelBalance.textContent = `${acc.balance}₤`;
};

const kesUsd = 119.36;

const movementsKES = movements.map(mov => {
    return mov * kesUsd;
});
console.log(movements);
console.log(movementsKES);

const calcDisplaySummary = function(acc) {
    const totalDeposits = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumIn.textContent = `${totalDeposits}₤`;

    const totalWithdraws = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(totalWithdraws)}₤`;

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = `${interest}₤`;
};
// const user = 'Martin Muthomi Mwenda';
const createUserName = function(accs) {
    accs.forEach(acc => {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
createUserName(accounts);

const updateUI = function(acc) {
    calcDisplayMovements(acc.movements);
    calcDisplayBalance(acc);
    calcDisplaySummary(acc);
};

// Event listeneers
// loginbtn
let currentUser;
btnLogin.addEventListener('click', e => {
    e.preventDefault();
    currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);
    if (currentUser && currentUser.pin === Number(inputLoginPin.value)) {
        labelWelcome.textContent = `Welcome back ${
      currentUser.owner.split(' ')[0]
    }`;
        containerApp.style.opacity = 100;
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        updateUI(currentUser);
    }
});
// transfer btn
btnTransfer.addEventListener('click', function(e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value
    );
    // console.log(amount, receiverAcc);
    // console.log(currentUser);
    inputTransferTo.value = inputTransferAmount.value = '';

    if (
        amount > 0 &&
        receiverAcc &&
        currentUser.balance >= amount &&
        receiverAcc.username !== currentUser.username
    ) {
        currentUser.movements.push(-amount);
        receiverAcc.movements.push(amount);
        updateUI(currentUser);
    }
});
// loan btn
btnLoan.addEventListener('click', function(e) {
    e.preventDefault();
    const loan = Number(inputLoanAmount.value);

    if (loan > 0 && currentUser.movements.some(mov => mov >= loan * 0.1)) {
        currentUser.movements.push(loan);
        updateUI(currentUser);
    }
    inputLoanAmount.value = '';
});

// account close btn
btnClose.addEventListener('click', function(e) {
    e.preventDefault();
    const user = inputCloseUsername.value;
    const pin = Number(inputClosePin.value);
    inputCloseUsername.value = inputClosePin.value = '';
    console.log(currentUser.username);
    console.log(user);

    if (user == currentUser.username && currentUser.pin == pin) {
        const index = accounts.findIndex(acc => acc.username == user);
        console.log(index);
        accounts.splice(index, 1);
        containerApp.style.opacity = 0;
    }
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
    e.preventDefault();
    calcDisplayMovements(currentUser.movements, !sorted);
    sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const deposits1000 = accounts
    .flatMap(acc => acc.movements)
    .reduce((count, mov) => (mov >= 1000 ? ++count : count), 0);

console.log(deposits1000);

const sums = accounts
    .flatMap(acc => acc.movements)
    .reduce(
        (count, mov) => {
            // mov > 0 ? (count.deposits += mov) : (count.withdrawals += mov);
            count[mov > 0 ? 'deposits' : 'withdrawals'] += mov;
            return count;
        }, { deposits: 0, withdrawals: 0 }
    );
console.log(sums);
const x = Array.from({ length: 100 }, (_, i) => i + 1);
// console.log(x);
x.fill(17, 1, 6);
// console.log(x);

const convertTitleCase = function(title) {
    const capitalize = str => str[0].toUpperCase() + str.slice(1);
    const exceptions = [
        'a',
        'an',
        'on',
        'the',
        'with',
        'or',
        'and',
        'in',
        'with',
        'but',
        'or',
        'of',
        'is',
    ];

    const titleCase = title
        .toLowerCase()
        .split(' ')
        .map(word => (exceptions.includes(word) ? word : capitalize(word)))
        .join(' ');
    return capitalize(titleCase);
};
console.log(convertTitleCase('MuTHomi ROcks hE iS THE BesT BiLLioNaIrE'));
console.log(convertTitleCase('StaNford ClASS OF 2027'));

// HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
// HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

// TEST DATA:
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] }
// ];
const dogs = [
    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
    { weight: 8, curFood: 200, owners: ['Matilda'] },
    { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
    { weight: 32, curFood: 340, owners: ['Michael'] },
];
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(sarahDog);
console.log(
    `Sarahs dog is eating too ${
    sarahDog.curFood < sarahDog.recFood ? 'little' : 'much'
  }`
);

const dogFoodMuch = dogs
    .filter(dog => dog.curFood > dog.recFood)
    .flatMap(dog => dog.owners);
console.log(dogFoodMuch);

const dogFoodLittle = dogs
    .filter(dog => dog.curFood < dog.recFood)
    .flatMap(dog => dog.owners);
console.log(dogFoodLittle);

console.log(`${dogFoodMuch.join(' and ')}'s are eating too much`);
console.log(`${dogFoodLittle.join(' and ')}'s are eating too little`);

console.log(dogs.some(dog => dog.curFood == dog.recFood));

const okayAmount = dog =>
    dog.curFood > dog.recFood * 0.9 && dog.curFood > dog.recFood * 1.1;

console.log(dogs.some(okayAmount));
console.log(dogs.filter(okayAmount));

const dogsSorted = dogs.slice().sort((a, b) => b.recFood - a.recFood);
console.log(dogsSorted);
// exercise
// // console.log(accounts);
// const withdrawals = movements.filter(wd => {
//     return wd < 0;
// });
// console.log(withdrawals);

// const max = movements.reduce(
//     (acc, mov) => (acc > mov ? acc : mov),
//     movements[0]
// );

// console.log(max);

// const calcAverageHumanAge = function(ages) {
//     const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//     console.log(humanAge);
//     const adult = humanAge.filter(age => age >= 18);
//     console.log(adult);
//     // const average = adult.reduce((acc, age) => acc + age, 0) / adult.length;
//     const average = adult.reduce((acc, age, i, arr) => acc + age / arr.length, 0);
//     return average;
// };
// const avg1 = calcAverageHumanAge(Julia);
// console.log(avg1);
// calcAverageHumanAge(Julia2);

// exercise2
// let Julia = [3, 5, 2, 12, 7];
// let Kate = [4, 1, 15, 8, 3];
// let Julia2 = [9, 16, 6, 8, 3];
// let Kate2 = [10, 5, 6, 1, 4];
// const checkDogs = function(julia, kate) {
//     let juliaDogs = julia.slice(1, -2);
//     console.log(juliaDogs);
//     const JKdogs = juliaDogs.concat(kate);
//     console.log(JKdogs);
//     JKdogs.forEach((dog, i) => {
//         dog > 3 ?
//             console.log(`Dog number${i + 1} is an adult, and is ${dog} years old`) :
//             console.log(`Dog number${i + 1} is still a puppy`);
//     });
// };
// checkDogs(Julia, Kate);
// checkDogs(Julia2, Kate2);