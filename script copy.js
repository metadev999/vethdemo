var web3;
var timestamp;
var interval;
var myaddress;
var contract;

const contractAddress = "0xBFd8f18C71044b350cA96A17033dCeBa4711Eb7E";
const contractAbi = [{
        "constant": false,
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "",
            "type": "address"
        }],
        "name": "deposits",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{
            "name": "",
            "type": "address"
        }],
        "name": "times",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

function setTime(time) {
    timestamp = time;

    if (interval) {
        clearInterval(interval);
    }

    interval = setInterval(countdownTimer, 1000);
}

function countdownTimer() {
    const difference = +new Date(timestamp) - +new Date();
    let remaining = "Time's up!";

    if (difference > 0) {
        const clock = document.getElementById("clockdiv");
        const daysSpan = clock.querySelector(".days");
        const hoursSpan = clock.querySelector(".hours");
        const minutesSpan = clock.querySelector(".minutes");
        const secondsSpan = clock.querySelector(".seconds");

        const parts = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };

        // console.log(parts)

        remaining = Object.keys(parts)
            .map(part => {
                if (!parts[part]) return;
                return `${parts[part]} ${part}`;
            })
            .join(" ");

        // daysSpan.innerHTML = parts.days > 10 ? parts.days : "0" + parts.days;
        daysSpan.innerHTML = ("0" + parts.days).slice(-2);
        hoursSpan.innerHTML = ("0" + parts.hours).slice(-2);
        minutesSpan.innerHTML = ("0" + parts.minutes).slice(-2);
        secondsSpan.innerHTML = ("0" + parts.seconds).slice(-2);
    } else {
        clearInterval(interval);
    }

    document.getElementById("countdown").innerHTML = remaining;
}

// console.log(new Date().getTime() + 6000);
// console.log(new Date(new Date().getTime() + 300000));

// setTime(new Date().getTime() + 300000);

// countdownTimer();
// setInterval(countdownTimer, 1000);

let depositButton = document.getElementById("deposit");
let withdrawButton = document.getElementById("withdraw");
let mybalance = document.getElementById("mybalance");
let lockedMoney = document.getElementById("locked-money");

depositButton.addEventListener("click", depositClick);
withdrawButton.addEventListener("click", withdrawClick);

async function depositClick() {
    let value = document.getElementById("amount").value;

    if (!value) {
        alert("you must specify the amount");
        return;
    }

    console.log(value);

    try {



        let tx = await web3.eth.sendTransaction({
            from: web3.givenProvider.selectedAddress,
            to: contractAddress,
            gasLimit: 21000,
            gasPrice: 20000000000,
            value: web3.utils.toWei(value.toString(),
                "ether")
        });


        console.log(tx);

        updateBalances();
    } catch (error) {
        console.log(error);
    }
}

async function withdrawClick() {

    let tx = await contract.methods.withdraw().send({
        from: web3.givenProvider.selectedAddress,
        gasLimit: 21000,
        gasPrice: 20000000000,
    });


    updateBalances();
}


async function myFunction() {



    await window.ethereum.enable();

    web3 = new Web3(window.ethereum);


    let accounts = await web3.eth.getAccounts();
    myaddress = accounts[0];
    console.log(myaddress);
    document.getElementById("myacc").innerHTML = myaddress;
    document.getElementById("con").innerHTML = 'CONNECTED';


    try {
        contract = await new web3.eth.Contract(contractAbi, contractAddress);
    } catch (error) {
        console.log(error);
    }

    updateBalances();
}

async function updateBalances() {
    let value = await web3.eth.getBalance(myaddress);
    mybalance.innerText = web3.utils.fromWei(value, "ether");

    let deposited = await contract.methods.deposits(myaddress).call();
    lockedMoney.innerText = web3.utils.fromWei(deposited, "ether");

    let time = await contract.methods.times(myaddress).call();

    if (time) {
        let milliseconds = time * 1000;
        setTime(milliseconds + 300000);
    }

    if (deposited == 0) {
        clearInterval(interval);
    }
}

myFunction();