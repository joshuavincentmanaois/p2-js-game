// DOM Variables
const mid = document.querySelector("#mid");
const rightBotContainer = document.querySelector("#right-bot");
const playerContainer = document.querySelector("#player-id");
const leftBotContainer = document.querySelector("#left-bot");
const dealerContainer = document.querySelector("#dealer-id");
const informationButton = document.querySelector("#info");
const instructions = document.querySelector("#instructions");
const overlay = document.querySelector(".overlay");
const stopButton = document.querySelector("#stop");
const hitButton = document.querySelector("#hit");
const standButton = document.querySelector("#stand");
const info = document.querySelector("#info");
const stop = document.querySelector("#stop");
const closeModalBtn = document.querySelector(".closeModalBtn");

// Side Buttons
info.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

function showModal() {
  instructions.classList.toggle("hidden");
  overlay.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

// Points Update
let rightBotPointsUpdate = document.querySelector(".bot-points-1");
let playerPointsUpdate = document.querySelector(".player-points");
let leftBotPointsUpdate = document.querySelector(".bot-points-2");
let dealerPointsUpdate = document.querySelector(".dealer-points");

function pointsUpdate() {
  // VAR UPDATE: Card values
  rightBotSum = rightBotCardValues.reduce((a, b) => a + b, 0);
  playerSum = playerCardValues.reduce((a, b) => a + b, 0);
  leftBotSum = leftBotCardValues.reduce((a, b) => a + b, 0);
  dealerSum = dealerCardValues.reduce((a, b) => a + b, 0);
  // VAR UPDATE: Aces count
  rightBotAceCount = rightBotAceCountArray.reduce((a, b) => a + b, 0);
  playerAceCount = playerAceCountArray.reduce((a, b) => a + b, 0);
  leftBotAceCount = leftBotAceCountArray.reduce((a, b) => a + b, 0);
  dealerAceCount = dealerAceCountArray.reduce((a, b) => a + b, 0);

  if (rightBotSum > 21 && rightBotAceCount > 0) {
    rightBotSum -= 10;
    rightBotAceCount -= 1;
  }
  if (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  if (leftBotSum > 21 && leftBotAceCount > 0) {
    leftBotSum -= 10;
    leftBotAceCount -= 1;
  }
  if (dealerSum > 21 && dealerAceCount > 0) {
    dealerSum -= 10;
    dealerAceCount -= 1;
  }

  rightBotPointsUpdate.innerText = rightBotSum;
  playerPointsUpdate.innerText = playerSum;
  leftBotPointsUpdate.innerText = leftBotSum;
  if (dealerCardValues.length === 2 && dealerTurns === 0) {
    dealerPointsUpdate.innerText =
      dealerCardValues[0] === 11 ? "A + ?" : dealerCardValues[0] + " + ?";
  } else {
    dealerPointsUpdate.innerText = dealerSum;
  }

  if (rightBotSum === 21 && rightBotCards.length === 2) {
    rightBotPointsUpdate.innerText = "BLACKJACK!";
  }
  if (playerSum === 21 && playerCards.length === 2) {
    playerPointsUpdate.innerText = "BLACKJACK!";
  }
  if (leftBotSum === 21 && leftBotCards.length === 2) {
    leftBotPointsUpdate.innerText = "BLACKJACK!";
  }
  if (dealerSum === 21 && dealerCards.length === 2 && dealerTurns === 1) {
    dealerPointsUpdate.innerText = "BLACKJACK!";
  }

  if (rightBotSum > 21 && rightBotAceCount === 0) {
    rightBotTempSum = rightBotSum;
    rightBotPointsUpdate.innerText = "BUST! " + `(${rightBotTempSum})`;
    rightBotSum = 0;
  }
  if (playerSum > 21 && playerAceCount === 0) {
    playerTempSum = playerSum;
    playerPointsUpdate.innerText = "BUST! " + `(${playerTempSum})`;
    playerSum = 0;
  }
  if (leftBotSum > 21 && leftBotAceCount === 0) {
    leftBotTempSum = leftBotSum;
    leftBotPointsUpdate.innerText = "BUST! " + `(${leftBotTempSum})`;
    leftBotSum = 0;
  }
  if (dealerSum > 21 && dealerAceCount === 0) {
    dealerTempSum = dealerSum;
    dealerPointsUpdate.innerText = "BUST! " + `(${dealerTempSum})`;
    dealerSum = 0;
  }
}

// Deck Variables
let unshuffledDeck;
let gameReadyDeck;
let cardPositionCounter = 0;

// Round Variables - Data storage that will be used throughout the round only
// Resets the game per round (with exception of the deck)
// Round Card Counter
let roundCardCounter = 0;
let hiddenCardPosition = null;
let rightBotTurns = 0;
let playerTurns = 0;
let leftBotTurns = 0;
let dealerTurns = 0;
// Array of cards
let rightBotCards = [];
let playerCards = [];
let leftBotCards = [];
let dealerCards = [];
// Array of card values
let rightBotCardValues = [];
let playerCardValues = [];
let leftBotCardValues = [];
let dealerCardValues = [];
// Sum of card values
let rightBotSum = 0;
let playerSum = 0;
let leftBotSum = 0;
let dealerSum = 0;
// Temporary sum of card values (Used if Bust!)
let rightBotTempSum = 0;
let playerTempSum = 0;
let leftBotTempSum = 0;
let dealerTempSum = 0;
// Array of aces count
let rightBotAceCountArray = [];
let playerAceCountArray = [];
let leftBotAceCountArray = [];
let dealerAceCountArray = [];
// Actual aces count
let rightBotAceCount = 0;
let playerAceCount = 0;
let leftBotAceCount = 0;
let dealerAceCount = 0;

//Player and Bot Variables (As gameID)
let rightBotVariables = ["right-bot", rightBotCards, rightBotCardValues];
let playerVariables = ["player-id", playerCards, playerCardValues];
let leftBotVariables = ["left-bot", leftBotCards, leftBotCardValues];
let dealerVariables = ["dealer-id", dealerCards, dealerCardValues];

// gameID Turn Order
let turnOrder = [
  rightBotVariables,
  playerVariables,
  leftBotVariables,
  dealerVariables,
];

// Number of decks to be used
let n = 1;

//Start Function
function start() {
  buildUnshuffledDeck(n);
  buildShuffledDeck(unshuffledDeck);
  mid.removeEventListener("click", start);
  dealCards(cardPositionCounter);
  rightBotStartTurn();
}

// Game Start
mid.addEventListener("click", start);

// Right Bot Start Turn
function rightBotStartTurn() {
  rightBotTurns++;
  pointsUpdate();
  mid.innerText = "Bot 1's Turn";
  rightBotContainer.classList.add("active-player");
  if (rightBotSum < 19) {
    mid.addEventListener("click", botAlgo.rightBot);
  }
  if (rightBotSum >= 19 || rightBotSum === 0) {
    mid.innerText = "Next Turn?";
    mid.addEventListener("click", playerStartTurn);
  }
}

// Player Start Turn
function playerStartTurn() {
  playerTurns++;
  mid.removeEventListener("click", playerStartTurn);
  mid.innerText = "Your Turn";
  rightBotContainer.classList.remove("active-player");
  playerContainer.classList.add("active-player");
  mid.classList.add("hidden");
  hitButton.classList.remove("hidden");
  standButton.classList.remove("hidden");
  hitButton.addEventListener("click", playerOptions.playerHit);
  standButton.addEventListener("click", playerOptions.playerStand);
  if (playerSum == 21 || playerSum == 0) {
    hitButton.classList.add("hidden");
    standButton.classList.remove("player-button");
  }
}

// Left Bot Start Turn
function leftBotStartTurn() {
  leftBotTurns++;
  pointsUpdate();
  mid.innerText = "Bot 2's Turn";
  leftBotContainer.classList.add("active-player");
  if (leftBotSum < 17) {
    mid.addEventListener("click", botAlgo.leftBot);
  }
  if (leftBotSum >= 17 || leftBotSum === 0) {
    mid.innerText = "Next Turn?";
    mid.addEventListener("click", dealerStartTurn);
  }
}

// Dealer Start Turn
function dealerStartTurn() {
  dealerTurns++;
  if (dealerTurns === 1) {
    mid.removeEventListener("click", dealerStartTurn);
    leftBotContainer.classList.remove("active-player");
    dealerContainer.removeChild(dealerContainer.lastChild);
    let card = document.createElement("img");
    card.src =
      "assets/images/cards/" + gameReadyDeck[hiddenCardPosition] + ".png";
    dealerContainer.appendChild(card);
  }
  pointsUpdate();
  mid.removeEventListener("click", dealerStartTurn);
  mid.innerText = "Dealer's Turn";
  dealerContainer.classList.add("active-player");
  if (dealerSum < 17) {
    mid.addEventListener("click", botAlgo.dealer);
  }
  if (dealerSum >= 17 || dealerSum === 0) {
    mid.addEventListener("click", endGame);
  }
}

// End Game
function endGame() {
  mid.removeEventListener("click", endGame);

  if (
    playerSum > dealerSum ||
    (playerSum === dealerSum &&
      playerAceCount > dealerAceCount &&
      playerCards.length === 2)
  ) {
    mid.innerText = "You Win!";
    dealerContainer.classList.remove("active-player");
    playerContainer.classList.add("active-player");
  } else if (
    playerSum === dealerSum &&
    playerSum === dealerSum &&
    playerAceCount === dealerAceCount &&
    playerCards.length === 2 &&
    dealerCards.length === 2
  ) {
    mid.innerText = "Tie!";
    playerContainer.classList.add("active-player");
  } else {
    mid.innerText = "You Lose!";
  }
  mid.addEventListener("click", nextRoundConfirm);
}

// Creating a deck
// Following a pattern of: A-K♠ A-K♦ K-A♣ K-A♥ (Source: https://ambitiouswithcards.com/new-deck-order/)
function buildUnshuffledDeck(n) {
  let suit = ["S", "D", "C", "H"];
  let value = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  unshuffledDeck = [];
  let k = 0;
  do {
    for (let i = 0; i < suit.length; i++) {
      if (suit[i] === "S" || suit[i] === "D") {
        for (let j = 0; j < value.length; j++) {
          unshuffledDeck.push(value[j] + "-" + suit[i]);
        }
      } else if (suit[i] === "C" || suit[i] === "H") {
        for (let j = value.length - 1; j >= 0; j--) {
          unshuffledDeck.push(value[j] + "-" + suit[i]);
        }
      }
    }
    k++;
  } while (k < n);
  return unshuffledDeck;
}

// Shuffle the deck
// Knuth-Durstenfeld Shuffle (Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array)
function buildShuffledDeck(unshuffledDeck) {
  gameReadyDeck = unshuffledDeck;
  for (let i = unshuffledDeck.length - 1; i >= 0; i--) {
    let j = Math.floor(Math.random() * unshuffledDeck.length);
    [gameReadyDeck[i], gameReadyDeck[j]] = [gameReadyDeck[j], gameReadyDeck[i]];
  }
  return gameReadyDeck;
}

// Game card distribution functions
const cardFactory = {
  // Will be also used for hit
  // gameId here refers to the player, bots, and dealer
  giveCards([gameId, cards, cardValues]) {
    function cardValue(card) {
      let rawValuePlaceholder = [];
      let removeSuit = card.split("-");
      rawValuePlaceholder = removeSuit[0];
      if (
        rawValuePlaceholder === "K" ||
        rawValuePlaceholder === "Q" ||
        rawValuePlaceholder === "J"
      ) {
        return 10;
      } else if (rawValuePlaceholder === "A") {
        return 11;
      } else {
        return parseInt(rawValuePlaceholder);
      }
    }
    cards.push(gameReadyDeck[cardPositionCounter]);
    if (cardValue(gameReadyDeck[cardPositionCounter]) === 11) {
      cardValues.push(11);
      if (gameId === "right-bot") {
        rightBotAceCountArray.push(1);
      } else if (gameId === "player-id") {
        playerAceCountArray.push(1);
      } else if (gameId === "left-bot") {
        leftBotAceCountArray.push(1);
      } else if (gameId === "dealer-id") {
        dealerAceCountArray.push(1);
      }
    } else {
      cardValues.push(cardValue(gameReadyDeck[cardPositionCounter]));
    }
    let card = document.createElement("img");
    if (gameId === "dealer-id" && roundCardCounter === 7) {
      card.src = "assets/images/cards/BACK.png";
      hiddenCardPosition = cardPositionCounter;
    } else {
      card.src =
        "assets/images/cards/" + gameReadyDeck[cardPositionCounter] + ".png";
    }
    document.getElementById(gameId).appendChild(card);
    cardPositionCounter++;
    roundCardCounter++;
  },
};

// Start Game Card Distribution
function dealCards(cardPositionCounter) {
  for (let i = 0; i < 2; i++) {
    turnOrder.forEach((player) => {
      cardFactory.giveCards(player);
    });
  }
}

// Bot Algo
const botAlgo = {
  rightBot() {
    pointsUpdate();
    if (rightBotSum < 19 && rightBotTempSum === 0) {
      cardFactory.giveCards(rightBotVariables);
      pointsUpdate();
      rightBotStartTurn();
    } else {
      return;
    }
  },
  leftBot() {
    pointsUpdate();
    if (leftBotSum < 17 && leftBotTempSum === 0) {
      cardFactory.giveCards(leftBotVariables);
      pointsUpdate();
      leftBotStartTurn();
    } else {
      return;
    }
  },
  dealer() {
    pointsUpdate();
    if (dealerSum < 18 && dealerTempSum === 0) {
      cardFactory.giveCards(dealerVariables);
      pointsUpdate();
      dealerStartTurn();
    } else {
      return;
    }
  },
};

// Player Options
const playerOptions = {
  playerHit() {
    pointsUpdate();
    cardFactory.giveCards(playerVariables);
    pointsUpdate();
    playerStartTurn();
  },
  playerStand() {
    pointsUpdate();
    playerContainer.classList.remove("active-player");
    leftBotContainer.classList.add("active-player");
    hitButton.removeEventListener("click", playerOptions.playerHit);
    standButton.removeEventListener("click", playerOptions.playerStand);
    hitButton.classList.add("hidden");
    standButton.classList.add("hidden");
    mid.classList.remove("hidden");
    leftBotStartTurn();
  },
};

function nextRoundConfirm() {
  mid.removeEventListener("click", nextRoundConfirm);
  playerContainer.classList.remove("active-player");
  dealerContainer.classList.remove("active-player");
  mid.innerText = "Next Round?";
  mid.addEventListener("click", nextRound);
  return;
}

function nextRound() {
  window.location.reload();
}
