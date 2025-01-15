<template>
    <div class="flex flex-col items-center bg-slate-800 min-h-screen">
      <!-- Header -->
        <div class="flex justify-between items-center w-full px-6 py-4 mb-5 bg-rose-800">
            <button @click="goHome">
                <img src="../../assets/Games/home.png" alt="Home" class="w-8 h-8" />
            </button>
            <div class="text-xl font-bold flex items-center space-x-4">
                <!-- Player 1 -->
                <div class="flex items-center space-x-2">
                    <img src="./images/player2.png" alt="Player 1" class="w-6 h-6" />
                    <span class="text-red-500">P1: {{ player1Position }}</span>
                </div>
                <!-- Divider -->
                <span class="text-white">|</span>
                <!-- Player 2 -->
                <div class="flex items-center space-x-2">
                    <img src="./images/player1.png" alt="Player 2" class="w-6 h-6" />
                    <span class="text-green-500">P2: {{ player2Position }}</span>
                </div>
            </div>
        </div>
  
            <!-- Game Board -->
        <div class="grid grid-cols-10 w-full max-w-[400px] h-[400px] aspect-square p-3 rounded-lg bg-cyan-400">
            <!-- w-[355px] -->
            <div v-for="cell in cells" :key="cell"
                class="relative flex justify-center items-center border border-gray-600 text-white text-sm sm:text-base font-bold"
                :class="getCellClass(cell)">
                     {{ cell }}
                <!-- Ladders and Snakes -->
                <img v-if="ladders[cell]" src="./images/ladder5.png" alt="Ladder"
                    :class="['absolute w-10 h-52 ladderImage z-10 opacity-90', getLadderClass(cell)]" />
                <img v-if="snakes[cell]" src="./images/snake6.png" alt="Snake"
                    :class="['absolute w-10 h-52 ladderImage z-10 opacity-90', getSnakeClass(cell)]" />
                <!-- Players -->
                <div v-if="player1Position === cell" class="absolute w-4 h-4 sm:w-5 sm:h-5 bg-red-600 rounded-full shadow-lg animate-bounce"></div>
                <div v-if="player2Position === cell" class="absolute w-4 h-4 sm:w-5 sm:h-5 bg-green-600 rounded-full shadow-lg animate-bounce"></div>
            </div>
        </div>
  
            <!-- Dice and Controls -->
        <div class="flex flex-row justify-evenly w-full px-2 mt-2">
                <!-- Player 1 Dice -->
            <div class="mb-0">
                <button @click="rollDice('player1')" :disabled="currentPlayer !== 1"
                        class="relative flex items-center px-3 pt-2 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 sm:px-4 sm:py-2">
                    <img src="./images/dice1.png" alt="Dice1" class="w-12 h-12 animate-dice-roll" />
                    <span class="ml-2 text-lg font-bold">Roll</span>
                </button>
                <div class="flex items-center justify-center">
                    <p class="mt-2 text-xl text-cyan-500 mr-1">Dice Roll : </p>
                    <span class="mt-2 w-8 h-8 bg-red-500 text-white text-2xl font-bold rounded-full shadow-md text-center">{{ diceRollPlayer1 }}</span>
                </div>
            </div>
            <div class="mr-3">
                <img src="./images/spin.png" alt="Dice2" class="w-14 h-14 animate-spin-slow" />
            </div>
            <!-- Player 2 Dice -->
            <div>
                <button @click="rollDice('player2')"  :disabled="currentPlayer !== 2"
                        class="relative flex items-center px-3 pt-2 bg-pink-600 text-white font-bold rounded-lg shadow-lg hover:bg-pink-700 sm:px-4 sm:py-2">
                    <img src="./images/dice2.png" alt="Dice2" class="w-12 h-12 animate-dice-roll" />
                    <span class="ml-2 text-lg font-bold">Roll</span>
                </button>
                <div class="flex items-center justify-center">
                    <p class="mt-2 text-xl text-cyan-500 mr-1">Dice Roll : </p>
                    <span class="mt-2 w-8 h-8 bg-lime-500 text-white text-2xl font-bold rounded-full shadow-md text-center">{{ diceRollPlayer2 }}</span>
                </div>
            </div>
        </div>
        <div>
            <div v-if="player1Position === 100 || player2Position === 100" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" >
                <div class="w-[90%] bg-white p-8 rounded-lg shadow-lg text-center animate__animated animate__zoomIn" >
                        <!-- Confetti Container -->
                    <div ref="confettiContainer" class="absolute top-0 left-0 w-full h-full z-10"></div>
                    <div class="flex items-center justify-center mb-0">
                        <img src="./images/trophy.png" alt="Winner Trophy" class="w-16 h-16 animate__animated animate__bounce" />
                        <div class="flex items-center justify-center">
                            <img src="./images/firework.png" alt="firework" class="w-6 h-6 animate__animated animate__bounce animate-spin mb-8 mr-3"/>
                            <h2 class="text-blue-700 text-2xl sm:text-2xl font-bold mb-6 mr-3">  Congrats, {{ player1Position === 100 ? 'Player 1' : 'Player 2' }}!</h2>
                            <img src="./images/firework.png" alt="firework" class="w-6 h-6 animate__animated animate__bounce animate-spin mb-8"/>
                        </div>    
                    </div>
                    <p class="mt-0 text-lg">You reached 100 and won the game!</p>
                        <!-- Play Again Button -->
                    <div class="flex items-center justify-between mt-6">
                        <button @click="exitModal" class="flex items-center justify-center px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 shadow-lg transform transition duration-300 hover:scale-105" style="z-index: 110;">
                            <img src="./images/exit2.png" alt="Exit" class="w-6 h-6 mr-3" />
                                Exit
                        </button>
                        <button @click="closeModal" class="flex items-center justify-center px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 shadow-lg transform transition duration-300 hover:scale-105" style="z-index: 110;">
                            <img src="./images/again2.png" alt="Play Again" class="w-6 h-6 mr-3" />
                            Play Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <LoaderData v-if="isLoading" />
        <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
    </div>
</template>
  <script>
  import LoaderData from '../LoaderData.vue';
  import ToasterData from '../ToasterData.vue';
  import snakeAudio from './sounds/snakeHissing1.mp3';
  import ladderAudio from './sounds/ladderUp.mp3';
  import victoryAudio from './sounds/winner1.mp3';
  import startingAudio from './sounds/gameStart.mp3';
  import diceAudio from './sounds/dice.mp3';
  import "animate.css";
  import confetti from 'canvas-confetti';
  export default {
    components: {
      LoaderData,
      ToasterData
    },
    data() {
      return {
        toastMessage: '',
        toastType: '',
        isLoading: false,
        cells: this.generateCells(),
        player1Position: 1,
        player2Position: 1,
        diceRollPlayer1: 1,
        diceRollPlayer2: 1,
        currentPlayer: 1,
        isModalVisible: false,
        snakes: {
          32:69,
          38:55,
          54: 34,
          62: 99,
        },
        ladders: {
          34: 35,
          45: 54,
          50:60,
          63: 81,
          68: 90,
        },
        snakesObject: {
          56:20,
          69:9,
          83:26,
          99:39,
        },
        laddersObject: {
          17:75,
          7:67,
          11:71,
          33:93,
          41:85,
        },
      };
    },
    watch: {
    playerPosition(newValue) {
      if (newValue === 100) {
        this.showModal();
      }
    },
  },
    mounted() { 
      this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
        this.playStartingAudio();
    },
    methods: {
    playStartingAudio(){
      const startingAudioPlay = new Audio(startingAudio);
      startingAudioPlay.muted = true;
      startingAudioPlay.play()
        .then(() => (startingAudioPlay.muted = false))
        .catch((err) => console.error("Error preloading intro sound:", err));
    },
    generateCells() {
      const cells = [];
      let reverse = false;
      for (let i = 100; i > 0; i -= 10) {
        const row = Array.from({ length: 10 }, (_, index) => i - index);
        cells.push(...(reverse ? row.reverse() : row));
        reverse = !reverse;
      }
      return cells;
    },
    rollDice(player) {
        if ((player === 'player1' && this.currentPlayer !== 1) || (player === 'player2' && this.currentPlayer !== 2)) {
                return; 
            }
        const diceAudioPlay = new Audio(diceAudio);
        diceAudioPlay.muted = true;
        diceAudioPlay.play()
        .then(() => (diceAudioPlay.muted = false))
        .catch((err) => console.error("Error preloading intro sound:", err));

        const diceRoll = Math.floor(Math.random() * 6) + 1;
        if (player === 'player1') {
                this.diceRollPlayer1 = diceRoll;
                let nextPosition = this.player1Position + diceRoll;

                if (nextPosition > 100) {
                    nextPosition = 100 - (nextPosition - 100);
                    this.showToast(`Oops! You rolled too far and bounced back to ${nextPosition}.`, "warning");
                }

                nextPosition = this.handleSnakesAndLadders(nextPosition);
                this.player1Position = nextPosition;
                if (this.player1Position === 100) {
                    this.launchConfetti();
                    this.showModal();
                } else {
                this.currentPlayer = 2; 
                }
            } else {
            this.diceRollPlayer2 = diceRoll;
            let nextPosition = this.player2Position + diceRoll;

            if (nextPosition > 100) {
                nextPosition = 100 - (nextPosition - 100); 
                this.showToast(`Oops! You rolled too far and bounced back to ${nextPosition}.`, "warning");
            }

            nextPosition = this.handleSnakesAndLadders(nextPosition);
            this.player2Position = nextPosition;

            if (this.player2Position === 100) {
                this.launchConfetti();
                this.showModal();
            } else {
                this.currentPlayer = 1; 
            }
        }

      if (this.player1Position === 100 || this.player2Position === 100) {
        this.launchConfetti();
        this.showModal();
      }
    },
    handleSnakesAndLadders(position) {
    if (this.snakesObject[position]){
        const snakeAudioPlay = new Audio(snakeAudio);
          snakeAudioPlay.muted = true;
          snakeAudioPlay.play()
          .then(() => (snakeAudioPlay.muted = false))
          .catch((err) => console.error("Error preloading intro sound:", err));
          this.showToast( `Oh no! A snake bit you. Moving down to ${this.snakesObject[position]}.`,"danger");
        return this.snakesObject[position];
    } 
    
    if (this.laddersObject[position]) {    
        const ladderAudioPlay = new Audio(ladderAudio);
          ladderAudioPlay.muted = true;
          ladderAudioPlay.play()
        .then(() => (ladderAudioPlay.muted = false))
        .catch((err) => console.error("Error preloading intro sound:", err));
          this.showToast( `Yay! You climbed a ladder to ${this.laddersObject[position]}.`, "success");
          return this.laddersObject[position];
    }
    return position;
  },
    getCellClass(cell) {
      if (Object.keys(this.snakes).includes(cell.toString())) {
        return "bg-red-500";
      } else if (Object.keys(this.ladders).includes(cell.toString())) {
        return "bg-green-500";
      } else if (cell % 2 === 0) {
        return "bg-blue-500";
      } else {
        return "bg-yellow-500";
      }
    },
    getLadderClass(cell) {
      // Add specific classes for ladders
      if (cell === 28 || cell === 39) {
        return "rotate-30";
      } else if (cell === 45) {
        return "rotate-19";
      } else if(cell ===63) {
       return "rotate-45";
      }
      return "";
    },
    getSnakeClass(cell) {
      // Add specific classes for ladders
      if (cell === 38) {
        return "rotate-30";
      } else if (cell === 54 ) {
        return "rotate-12";
      }
      return "";
    },
    goHome() {
      this.isLoading = true;
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
    showModal() {
    this.isModalVisible = true;
    this.playVictoryAudio();
    this.launchConfetti();
   },
    closeModal() {
        this.isModalVisible = false;
        this.resetGame();
    },
    exitModal(){
        this.isModalVisible = false;
        this.resetGame();
        this.goHome();
    },
    playVictoryAudio() {
      const victoryAudioPlay = new Audio(victoryAudio);
      victoryAudioPlay.muted = true;
      victoryAudioPlay.play()
        .then(() => (victoryAudioPlay.muted = false))
        .catch((err) => console.error("Error preloading intro sound:", err));
    },
    resetGame() {
        this.player1Position = 1;
        this.player2Position = 1;
        this.diceRollPlayer1 = 1;
        this.diceRollPlayer2 = 1;
        this.currentPlayer = 1;
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
        this.playStartingAudio();
    },
    launchConfetti() {
      const confettiOptions = {
        particleCount: 1000,
        spread: 90,
        origin: { y: 0.6 },
      };
      confetti.create(this.$refs.confettiContainer, {
        resize: true,
        useWorker: true,
      })(confettiOptions);
    },
  },
};
</script>

<style>
/* Tailwind classes used; additional styling can go here */
.ladderImage {
  max-width: 150%;
  height: auto;
}
.rotate-30 {
  transform: rotate(30deg);
}
.rotate-45 {
  transform: rotate(45deg);
}

.rotate-19 {
  transform: rotate(19deg);
}

.animate-spin-slow {
  animation: spin 2s linear infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 255, 0, 1);
  }
  100% {
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.6);
  }
}

.animate-pulse-button {
  animation: pulse 1.5s infinite;
}

@keyframes diceRoll {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-dice-roll {
  animation: diceRoll 1s ease-in-out;
}
</style>