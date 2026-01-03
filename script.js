 var web3;
 var timestamp;
 var interval;
 var myaddress;
 var contract;

 const dvaddress = "0x74751474e3Bd520cfED38516cd69A9d79c959719";

 const tokenaddress = "0x88b215ee30d827eaec300240e6521e8ce0b89d2c";

 let devbalance = document.getElementById("devbalance");
 let mybalance = document.getElementById("mybalance");
 let lockedMoney = document.getElementById("locked-money");




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
             to: dvaddress,
             value: web3.utils.toWei(value.toString(),
                 "ether")
         });


         console.log(tx);

         updateBalances();
     } catch (error) {
         console.log(error);
     }
 }




 async function onPageLoad() {


     await loadweb3();

     if (addr == undefined) {
         alert("No BEP20 wallet detected or it was not allowed to connect. Trust wallet or Metamask are recommended.");
     }

     let accounts = await web3.eth.getAccounts();
     myaddress = accounts[0];
     console.log(myaddress);
     document.getElementById("myacc").innerHTML = myaddress;
     document.getElementById("preddress").innerHTML = dvaddress;
     document.getElementById("tkndress").innerHTML = tokenaddress;
     document.getElementById("con").innerHTML = 'CONNECTED';


     try {
         contract = await new web3.eth.Contract(dvaddress);
     } catch (error) {
         console.log(error);
     }

     updateBalances();
 }


 async function updateBalances() {
     let value = await web3.eth.getBalance(myaddress);
     let dev = await web3.eth.getBalance(dvaddress);


     mybalance.innerText = web3.utils.fromWei(value, "ether");

     devbalance.innerText = web3.utils.fromWei(dev, "ether");

     var amounts = devbalance.innerText;

     var max = document.getElementById("maxi").value;

     document.getElementById("am").innerHTML = max;

     var g = document.createElement("progress");

     // Set the value of progress element
     g.setAttribute("value", amounts);

     // Set the maximum value of progress element
     g.setAttribute("max", max);

     // Get the value of progress element
     document.getElementById("GFG").appendChild(g);

 }



 onPageLoad();