// Get elements from the DOM
const moneyDisplay = document.getElementById("moneyCounter");
const easterEgg = document.getElementById("easterEgg");
const upgradesDisplay = document.getElementById("upgrades");
const gambleInput = document.getElementById("gambleInput");
const gambleSection = document.getElementById("gambleSection");
const toggleGambleButton = document.getElementById("toggleGambleButton");
const gambleButton = document.getElementById("gambleButton");
const gambleResults = document.getElementById("gambleResults");
const gambleResultText = document.getElementById("gambleResultText");

// Initialize variables
let money = 0;
let earningsMultiplier = 1;
let earningsMultiplierUpgradeCost = 50;
let easterEggActive = false;
let easterEggExpirationTime;

// Function to update the money display and save the state to local storage
function updateMoney() {
  moneyDisplay.textContent = `Money: £${money}`;
  localStorage.setItem("money", money);
  localStorage.setItem("earningsMultiplier", earningsMultiplier);
  localStorage.setItem("earningsMultiplierUpgradeCost", earningsMultiplierUpgradeCost);
}

// Function to handle button clicks and update the money
function clickButton() {
  money += easterEggActive? 100 : 1 * earningsMultiplier;
  updateMoney();
}

// Function to show the Easter egg
function showEasterEgg() {
  const randomEasterEgg = Math.random();
  if (randomEasterEgg < 0.01) {
    easterEggActive = true;
    easterEgg.textContent = "You found a hidden treasure! You get an extra £100 per click for 3 minutes!";
    easterEggExpirationTime = Date.now() + 180000;
    setTimeout(() => {
      easterEggActive = false;
      easterEgg.textContent = "";
    }, 180000);
  } else {
    easterEgg.textContent = "";
  }
}

// Function to buy an earnings multiplier upgrade
function buyEarningsMultiplierUpgrade() {
  if (money >= earningsMultiplierUpgradeCost) {
    money -= earningsMultiplierUpgradeCost;
    earningsMultiplier *= 2;
    earningsMultiplierUpgradeCost *= 2;
    updateMoney();
    upgradesDisplay.textContent = `Earnings Multiplier Upgrade: x${earningsMultiplier} (Cost: £${earningsMultiplierUpgradeCost})`;
  }
}

// Function to handle gambling
function gamble() {
  const bet = parseInt(gambleInput.value);
  if (isNaN(bet) || bet <= 0) {
    alert("Please enter a valid amount.");
    return;
  }
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  let resultText = "";
  switch (randomNumber) {
    case 1:
      money -= bet;
      resultText = "You lost the gamble. Better luck next time!";
      break;
    case 2:
      money += bet;
      resultText = "You won back the amount you bet.";
      break;
    case 3:
      money += bet * 5;
      resultText = "You won big! You got 5 times the amount you bet!";
      break;
    default:
      break;
  }
  updateMoney();
  gambleInput.value = "";
  gambleResultText.textContent = resultText;
  gambleResults.style.display = "block";
  window.onclick = function(event) {
    if (event.target == gambleResults) {
      gambleResults.style.display = "none";
    }
  };
}

// Function to load the state from local storage
function loadState() {
  money = parseInt(localStorage.getItem("money")) || 0;
  earningsMultiplier = parseInt(localStorage.getItem("earningsMultiplier")) || 1;
  earningsMultiplierUpgradeCost = parseInt(localStorage.getItem("earningsMultiplierUpgradeCost")) || 50;
  try {
    updateMoney();
  } catch (error) {
    console.error(error);
  }
}

// Load the state from local storage
loadState();

// Set the initial text for the upgrades display
upgradesDisplay.textContent = `Earnings Multiplier Upgrade: x${earningsMultiplier} (Cost: £${earningsMultiplierUpgradeCost})`;

// Add event listeners for button clicks
document.getElementById("earnButton").addEventListener("click", clickButton);
document.getElementById("upgradeButton").addEventListener("click", buyEarningsMultiplierUpgrade);
document.getElementById("resetButton").addEventListener("click", function() {
  money = 0;
  earningsMultiplier = 1;
  earningsMultiplierUpgradeCost = 50;
  easterEggActive = false;
  updateMoney();
  upgradesDisplay.textContent = `Earnings Multiplier Upgrade: x${earningsMultiplier} (Cost: £${earningsMultiplierUpgradeCost})`;
  localStorage.removeItem("money");
  localStorage.removeItem("earningsMultiplier");
  localStorage.removeItem("earningsMultiplierUpgradeCost");
});

// Add event listener for the "Toggle Gamble" button
toggleGambleButton.addEventListener("click", function() {
  if (gambleSection.style.display == "none") {
    gambleSection.style.display = "block";
  } else {
    gambleSection.style.display = "none";
  }
});

// Add event listener for the "Gamble!" button
gambleButton.addEventListener("click", gamble);

// Add event listener for the "Gamble Results" modal dialog
// We don't need an explicit event listener for this anymore, because we're using the `window.onclick`
// event listener to handle both the clicks outside the modal dialog and the clicks inside the modal dialog.