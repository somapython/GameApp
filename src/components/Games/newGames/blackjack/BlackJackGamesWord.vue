<template>
    <div class="min-h-screen flex flex-col items-center bg-gray-500 py-4">
        <div class="flex justify-between items-center w-full px-6 py-4 mb-5 bg-rose-800">
            <button @click="goHome">
                <img src="../../../../assets/Games/home.png" alt="Home" class="w-8 h-8 hover:scale-110 transition-transform duration-300" />
            </button>
            <div class="text-xl font-bold flex items-center space-x-4">
              <h1>Score: <span>{{ score }}</span></h1>
            </div>
        </div>
        <h2 class="text-lg font-bold mb-4">Dealer: <span class="text-blue-500">{{ dealerSumDisplay }}</span></h2>
    <div class="flex justify-center items-center mb-6">
      <img v-if="!revealHiddenCard" class="w-16 h-24 mr-2" src="/images/blackjack/cards/BACK.png" alt="Hidden Card" />
      <img v-else class="w-16 h-24 mr-2" :src="'/images/blackjack/cards/' + hidden + '.png'" alt="Hidden Card" />
      <img
        v-for="(card, index) in dealerCards"
        :key="'dealer-' + index"
        class="w-16 h-24 mr-2"
        :src="'/images/blackjack/cards/' + card + '.png'"
        alt="Dealer Card"
      />
    </div>

    <h2 class="text-lg font-bold mb-4">You: <span class="text-green-500">{{ yourSum }}</span></h2>
    <div class="flex justify-center items-center mb-6">
      <img
        v-for="(card, index) in yourCards"
        :key="'your-' + index"
        class="w-16 h-24 mr-2"
        :src="'/images/blackjack/cards/' + card + '.png'"
        alt="Your Card"
      />
    </div>

    <div class="flex space-x-4 mb-6">
      <button
        @click="hit"
        :disabled="!canHit"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Hit
      </button>
      <button
        @click="stay"
        class="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
      >
        Stay
      </button>
    </div>

    <!-- Bottom Section -->
    <div class="flex justify-between items-center w-full px-4 py-2 mt-10 bg-blue-600">
        <button @click="goBack" class="px-3 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-700 transition-all">
            Back
        </button>
        <button @click="showHelp" class="px-3 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-600 transition-all">
            How to Play
        </button>
    </div>

    <!-- Confetti Winner Modal -->
    <div v-if="winner" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg animate__animated animate__bounceIn w-[90%]">
        <h2 :class="resultClass" class="text-3xl font-bold mb-4 text-center">{{ resultMessage1 }}</h2>
        <p :class="resultClass" class="text-lg text-center mb-6"> {{  resultMessage }}</p>
        <div class="flex justify-center mb-6"  v-if="resultClass === 'text-blue-600'">
            <img src="../../images/prize.png" alt="Winner Icon" class="w-16 h-16 animate__animated animate__spin infinite" />
        </div>
        <button v-if="resultButton && !showClaimForm" @click="openPrizeClaimForm" class="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition-all mr-3" >
            Claim Prize
        </button>
        <button v-if="!resultButton && !showClaimForm && !showButton" @click="resetGame" class="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition-all mr-3">
          Next Stage
        </button>
        <button @click="goBack" class="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-700 transition-all mt-4">
           Close
        </button>
      </div>
    </div>

    <div v-if="showClaimForm" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 border border-blue-300 rounded-lg">
        <div class="bg-blue-400 p-6 rounded-lg shadow-lg animate__animated animate__bounceIn w-[90%] max-w-lg">
            <h2 class="text-3xl font-bold text-center mb-4 animate__animated animate__flipInX">Claim Your Prize</h2>
            <form @submit.prevent="submitClaimForm">
                <div class="space-y-4">
                    <div>
                        <input v-model="formData.name" type="text" id="name" class="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg" placeholder="Enter your Name" required />
                    </div>
                    <div>
                        <input v-model="formData.mobile" type="text" id="mobile" class="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg" placeholder="Enter Mobile No." required />
                    </div>
                    <div>
                        <textarea v-model="formData.address" id="address" rows="4" class="w-full px-4 py-2 border border-gray-300 text-gray-800 text-black-400  rounded-lg resize-none" placeholder="Address" required></textarea>
                    </div>
                    <div>
                        <input v-model="formData.city" type="text" id="city" class="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg" placeholder="City" required />
                    </div>
                    <div>
                        <input v-model="formData.pincode" type="text" id="pincode" class="w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg" placeholder="Pincode" required />
                    </div>
                    <div class="flex justify-center space-x-4 mt-4">
                        <button type="submit" class="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-700">
                            Submit
                        </button>
                        <button @click="closeClaimForm" class="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-700">
                            Close
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div v-if="showInstructionModal" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 border border-blue-300 rounded-lg">
        <div class="bg-blue-700 p-2 rounded-lg shadow-lg w-[95%] max-w-lg animate__animated animate__fadeIn">
            <h2 class="text-3xl text-violet-400 font-bold text-center mb-4 animate__animated animate__flipInX">How to Play</h2>
      
        <!-- Instructional Content -->
            <div class="space-y-4">
                <p class="text-lg text-orange-400">Welcome to our Game! Here's how to play:</p>
                <ul class="text-base text-gray-400">
                    <li>Step 1: Complete each challenge to score points.</li>
                    <li>Step 2: If you reach a score of <span class="font-bold text-xl text-red-800">500</span>, you'll receive an exciting bumper prize at your address!</li>
                    <li>Step 3: Enter your details in the prize claim form once you qualify.</li>
                </ul>
                
                <!-- Icon with Animation -->
                <div class="flex justify-center">
                    <div class="w-16 h-16 bg-yellow-400 rounded-full flex justify-center items-center animate__animated animate__bounceIn animate__delay-1s">
                        <i class="fas fa-trophy text-white text-3xl"></i>
                    </div>
                </div>

            <!-- Buttons for Actions -->
                <div class="flex justify-center space-x-4 mt-4">
                    <button @click="closeShowInstructionModal" class="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-700 transition-all">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
  </div>
  <LoaderData v-if="isLoading" />
  <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
</template>

<script>
  import LoaderData from '../../../LoaderData.vue';
  import ToasterData from '../../../ToasterData.vue';
  import "animate.css";
  import confetti from 'canvas-confetti';
  import Papa from 'papaparse';
  import startAudio from '../../sounds/blackjackstart.wav';
  import failAudio from '../../sounds/blackjackFail.wav';
export default {
    name:"BlackJackGamesWord",
    components: {
      LoaderData,
      ToasterData
    },
  data() {
    return {
      deck: [],
      hidden: "",
      dealerCards: [],
      yourCards: [],
      dealerSum: 0,
      yourSum: 0,
      score: 0,
      dealerAceCount: 0,
      yourAceCount: 0,
      canHit: true,
      revealHiddenCard: false,
      resultMessage1 : "",
      resultMessage: "",
      toastMessage: '',
      toastType: '',
      isLoading: false,
      winner: false,
      resultClass: "",
      showClaimForm: false,
      resultButton:false,
      showButton: false,
      startAudioVariable : '',
      failAudioVariable : '',
      showInstructionModal: false,
      formData: {
        name: '',
        mobile: '',
        address: '',
        city: '',
        pincode: ''
      },
    };
  },
  computed: {
    dealerSumDisplay() {
      return this.revealHiddenCard ? this.dealerSum : "";
    },
  },
  mounted() {
    this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
    this.score = 0;
    this.playStartingAudio();
    this.buildDeck();
    this.shuffleDeck();
    this.startGame();
  },
  methods: {
      playStartingAudio(){
      this.startAudioVariable = new Audio(startAudio);
      this.startAudioVariable.muted = true;
      this.startAudioVariable.play()
      .then(() => {
     this.startAudioVariable.muted = false}
      )
      .catch((err) => {console.error("Error preloading intro sound:", err)});
    },
    stopStartingAudio() {
    if (this.startAudioVariable) {
      this.startAudioVariable.pause();
      this.startAudioVariable.currentTime = 0;
    }
  },
    buildDeck() {
      const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
      const types = ["C", "D", "H", "S"];
      this.deck = [];

      types.forEach((type) => {
        values.forEach((value) => {
          this.deck.push(`${value}-${type}`);
        });
      });
    },
    shuffleDeck() {
      for (let i = 0; i < this.deck.length; i++) {
        const j = Math.floor(Math.random() * this.deck.length);
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
    },
    startGame() {
      this.hidden = this.deck.pop();
      this.dealerSum += this.getValue(this.hidden);
      this.dealerAceCount += this.checkAce(this.hidden);

      while (this.dealerSum < 17) {
        const card = this.deck.pop();
        this.dealerCards.push(card);
        this.dealerSum += this.getValue(card);
        this.dealerAceCount += this.checkAce(card);
      }

      for (let i = 0; i < 2; i++) {
        const card = this.deck.pop();
        this.yourCards.push(card);
        this.yourSum += this.getValue(card);
        this.yourAceCount += this.checkAce(card);
      }
    },
    hit() {
      if (!this.canHit) return;

      const card = this.deck.pop();
      this.yourCards.push(card);
      this.yourSum += this.getValue(card);
      this.yourAceCount += this.checkAce(card);

      if (this.reduceAce(this.yourSum, this.yourAceCount) > 21) {
        this.canHit = false;
      }
    },
    stay() {
      this.dealerSum = this.reduceAce(this.dealerSum, this.dealerAceCount);
      this.yourSum = this.reduceAce(this.yourSum, this.yourAceCount);
      this.revealHiddenCard = true;
      this.canHit = false;

      if (this.yourSum > 21) {
        this.triggerWinner();
        this.resultMessage1 = "😔 Better luck next time! 😔";
        this.resultMessage = "You Lose!";
        this.score -=10;
        this.resultClass = "text-red-600";
        this.resultButton = false;
      } else if (this.dealerSum > 21) {
        this.triggerWinner();
        this.resultMessage1 = "🎉 Congratulations! 🎉";
        this.resultMessage = "You Win!";
        this.score +=10;
        this.resultClass = "text-green-600";
        this.resultButton = false;
      } else if (this.yourSum === this.dealerSum) {
        this.triggerWinner();
        this.resultMessage1 = "🤝 It's a tie! Good effort! 🤝";
        this.resultMessage = "Tie!";
        this.score +=0;
        this.resultClass = "text-yellow-500";
        this.resultButton = false;
      } else if (this.yourSum > this.dealerSum) {
        this.triggerWinner();
        this.resultMessage1 = "🎉 Congratulations! 🎉";
        this.resultMessage = "You Win!";
        this.score +=10;
        this.resultClass = "text-green-600";
        this.resultButton = false;
      } else {
        this.triggerWinner();
        this.resultMessage1 = "😔 Better luck next time! 😔";
        this.resultMessage = "You Lose!";
        this.score -=10;
        this.resultClass = "text-red-600";
        this.resultButton = false;
      }

      if (this.score >= 500) {
        this.showPrizePopup();
      }
    },
    showPrizePopup() {
      this.resultMessage1 = "🎉 You are Winner! 🎉";
      this.resultMessage = "Claim your prize money!";
      this.resultClass = "text-blue-600";  
      this.resultButton = true;
      this.showButton =true;
      this.winner = true;  // Show the winner modal
  },
    resetGame() {
    this.dealerCards = []; 
    this.yourCards = [];
    this.dealerSum = 0;  
    this.yourSum = 0;    
    this.resultMessage1 = ""; 
    this.resultMessage = "";   
    this.resultClass = "";    
    this.revealHiddenCard = false; 
    this.canHit = true;           
    this.winner = false;         
    this.resultButton = !this.resultButton; 
    // Proceed to the next stage or round
    this.buildDeck();   // Rebuild the deck for the next round
    this.shuffleDeck(); // Shuffle the deck for randomness
    this.startGame();
},
    getValue(card) {
      const value = card.split("-")[0];
      if (isNaN(value)) {
        return value === "A" ? 11 : 10;
      }
      return parseInt(value);
    },
    checkAce(card) {
      return card.startsWith("A") ? 1 : 0;
    },
    reduceAce(sum, aceCount) {
      while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
      }
      return sum;
    },
    triggerWinner() {
      this.winner = true;
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });
    },
    goBack() {
      this.winner = false;
      this.stopStartingAudio();
      this.failAudioVariable = new Audio(failAudio);
      this.failAudioVariable.muted = true;
      this.failAudioVariable.play()
      .then(() => {
     this.failAudioVariable.muted = false}
      )
      .catch((err) => {console.error("Error preloading intro sound:", err)});
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push('/game/jack');
      }, 500);
    },
    showHelp() {
      this.showInstructionModal = true;
    },
    closeShowInstructionModal(){
        this.showInstructionModal = false;
    },
    goHome() {
      this.isLoading = true;
      this.stopStartingAudio();
      this.failAudioVariable = new Audio(failAudio);
      this.failAudioVariable.muted = true;
      this.failAudioVariable.play()
      .then(() => {
     this.failAudioVariable.muted = false}
      )
      .catch((err) => {console.error("Error preloading intro sound:", err)});
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push('/');
      }, 500);
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = '';
      }, 3000);
    },
    openPrizeClaimForm() {
      this.showClaimForm = true;
      this.winner = false;
      this.resultButton = false;
    },
    closeClaimForm() {
      this.showClaimForm = false;
      this.resultButton = false;
       this.goBack();
    },
    submitClaimForm() {
      // Store form data as CSV
      const userData = [
        {
          Name: this.formData.name,
          Mobile: this.formData.mobile,
          Address: this.formData.address,
          City: this.formData.city,
          Pincode: this.formData.pincode
        }
      ];

      const csv = Papa.unparse(userData);
      this.downloadCSV(csv);
      
      // Close form and show confirmation message
      this.showClaimForm = false;
      this.resultButton = false;
      this.showPrizeConfirmation();
    },
    downloadCSV(csv) {
      const blob = new Blob([csv], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
    //   link.download = 'prize_claim.csv';
    //   link.click();
    },
    showPrizeConfirmation() {
      this.resultMessage1 = "🎉 Bumper Prize Confirmed! 🎉";
      this.resultMessage = "You will receive your bumper prize within the next 10 working days.";
      this.resultClass = "text-green-600"; 
      this.resultClass = "text-blue-600";  
       // Green color for confirmation
      this.winner = true;
    },
  },

};
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate__spin {
  animation: spin 2s linear infinite;
}

/* Animation for the bounce effect on modals */
@keyframes bounceIn {
  0% { transform: scale(0); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.animate__bounceIn {
  animation: bounceIn 1s ease-out;
}

/* Animation for form flip */
@keyframes flipInX {
  0% { transform: rotateX(-90deg); opacity: 0; }
  100% { transform: rotateX(0); opacity: 1; }
}

.animate__flipInX {
  animation: flipInX 1s ease-in-out;
}
</style>
