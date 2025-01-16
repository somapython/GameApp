<template>
   <div class="boardImage"> 
        <div class="flex justify-between items-center w-full px-6 py-4 mb-5 bg-rose-800">
            <button @click="goHome">
                <img src="../../../../assets/Games/home.png" alt="Home" class="w-8 h-8 hover:scale-110 transition-transform duration-300" />
            </button>
            <div class="text-xl font-bold flex items-center space-x-4">
                <h1>Score: <span>{{ score }}</span></h1>
            </div>
        </div>
        <div id="board" class="grid grid-cols-9 gap-1 justify-center mx-auto w-[340px] h-[360px] border border-2 border-blue-300 rounded-lg">
            <div v-for="(row, rIndex) in board" :key="`row-${rIndex}`" class="flex flex-wrap">
                <!-- class="grid grid-cols-9 gap-1" -->
                <img v-for="(tile, cIndex) in row" 
                :key="`tile-${rIndex}-${cIndex}`" 
                :id="`${rIndex}-${cIndex}`"
                :src="tile.src" 
                draggable="true"
                @dragstart="dragStart(rIndex, cIndex)"
                @dragover.prevent
                @dragenter.prevent
                @drop="dragDrop(rIndex, cIndex)"
                @dragend="dragEnd"
                @touchstart="onTouchStart(rIndex, cIndex, $event)"
                @touchmove="onTouchMove($event)"
                @touchend="onTouchEnd(rIndex, cIndex, $event)"
                class="w-10 h-10 border-2 border-transparent hover:border-yellow-500 rounded-lg shadow-md transition-all animate__animated animate__zoomIn"
                />
            </div>
        </div>

        <div class="flex justify-between items-center w-full px-4 py-2 mt-24 bg-blue-600">
            <button @click="goBack" class="px-3 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-700 transition-all">
                Back
            </button>
            <button @click="showHelp" class="px-3 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-600 transition-all">
                How to Play
            </button>
        </div>

        <div v-if="winner" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg animate__animated animate__bounceIn w-[90%]">
                <h2 class="text-3xl font-bold mb-4 text-center text-green-600">{{ resultMessage1 }}</h2>
                <p class="text-lg text-center mb-6 text-gray-500">{{ resultMessage }}</p>
                <div class="flex justify-center mb-6">
                    <img src="../../images/prize.png" alt="Winner Icon" class="w-16 h-16 animate__animated animate__spin infinite" />
                </div>
                <button @click="openPrizeClaimForm" v-if="showClaimButton" class="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition-all mr-3" >
                    Claim Prize
                </button>
                <button @click="goBack" class="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-700 transition-all">
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
        
                <div class="space-y-4">
                    <p class="text-lg text-orange-400">Welcome to our Game! Here's how to play:</p>
                    <ul class="text-base text-gray-400">
                        <li>Step 1: Match 3 candies in a row or column to score!</li>
                        <li>Step 2: If you reach a score of <span class="font-bold text-xl text-red-800">10000</span>, you'll receive an exciting bumper prize at your address!</li>
                        <li>Step 3: Enter your details in the prize claim form once you qualify.</li>
                    </ul>
                    
                    <div class="flex justify-center">
                        <div class="w-16 h-16 bg-yellow-400 rounded-full flex justify-center items-center animate__animated animate__bounceIn animate__delay-1s">
                            <i class="fas fa-trophy text-white text-3xl"></i>
                        </div>
                    </div>

                    <div class="flex justify-center space-x-4 mt-4">
                        <button @click="closeShowInstructionModal" class="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-700 transition-all">
                            Close
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
  import LoaderData from '../../../LoaderData.vue';
  import ToasterData from '../../../ToasterData.vue';
  import "animate.css";
  import confetti from 'canvas-confetti';
  import Papa from 'papaparse';
  import startAudio from '../../sounds/candyStart.wav';
  import failAudio from '../../sounds/candyFail.wav';
export default {
  name:"CandyGamesWord",
  components: {
      LoaderData,
      ToasterData
    },
  data() {
    return {
      candies: ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"],
      board: [],
      rows: 9,
      columns: 9,
      score: 0,
      currTile: null,
      otherTile: null,
      touchStartPos: null,
      toastMessage: '',
      toastType: '',
      isLoading: false,
      winner: false,
      showInstructionModal: false,
      showClaimForm: false,
      resultMessage: '',
      resultMessage1: '',
      startAudioVariable : '',
      failAudioVariable : '',
      showClaimButton: true,
      formData: {
        name: '',
        mobile: '',
        address: '',
        city: '',
        pincode: ''
      },
    };
  },
  mounted() {
    this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
        this.score = 0;
        //this.playStartingAudio();
        this.startGame();

    setInterval(() => {
      this.crushThree();
      this.slideCandy();
      this.generateCandy();
    }, 100);
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
    randomCandy() {
      return this.candies[Math.floor(Math.random() * this.candies.length)];
    },
    startGame() {
      const newBoard = [];
        for (let r = 0; r < this.rows; r++) {
          const row = [];
          for (let c = 0; c < this.columns; c++) {
            row.push({ src: `/images/candy/images/${this.randomCandy()}.png` });
          }
          newBoard.push(row);
        }
        this.board = newBoard;
         console.log("1111",this.board)
        this.score = 0;
    },
    dragStart(r, c) {
      this.currTile = { r, c, src: this.board[r][c].src };
    },
    dragDrop(r, c) {
      this.otherTile = { r, c, src: this.board[r][c].src };
    },
    dragEnd() {
      if (!this.currTile || !this.otherTile) return;

      if (
        this.currTile.src.includes("blank") ||
        this.otherTile.src.includes("blank")
      ) {
        this.resetTiles();
        return;
      }

      const isAdjacent =
        Math.abs(this.currTile.r - this.otherTile.r) +
          Math.abs(this.currTile.c - this.otherTile.c) === 1;

      if (isAdjacent) {
        this.swapTiles();

        if (!this.checkValid()) {
          this.swapTiles();
        } else if (this.score >= 10000) {
          this.triggerWinner();
        }
      }
      this.resetTiles();
    },
    // For touch events on mobile
    onTouchStart(rIndex, cIndex, event) {
      this.currTile = { rIndex, cIndex };
      this.touchStartPos = event.touches[0];
    },
    onTouchMove(event) {
      event.preventDefault(); // Prevent scrolling while dragging
    },
    onTouchEnd(rIndex, cIndex, event) {
      const touchEndPos = event.changedTouches[0];
      const targetElement = document.elementFromPoint(
        touchEndPos.clientX,
        touchEndPos.clientY
      );

      if (targetElement) {
        const [targetRow, targetCol] = targetElement.id.split('-').map(Number);
        if (!isNaN(targetRow) && !isNaN(targetCol)) {
          this.swapTiles(this.currTile.rIndex, this.currTile.cIndex, targetRow, targetCol);
        }
      }
      this.currTile = null;
    },
    swapTiles() {
      const temp = this.board[this.currTile.r][this.currTile.c].src;
      this.board[this.currTile.r][this.currTile.c].src = this.board[this.otherTile.r][this.otherTile.c].src;
      this.board[this.otherTile.r][this.otherTile.c].src = temp;
    },
    resetTiles() {
      this.currTile = null;
      this.otherTile = null;
    },
    checkValid() {
      return this.crushThree(false);
    },
    crushThree(apply = true) {
      let crushed = false;

      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.columns - 2; c++) {
          const tile1 = this.board[r][c];
          const tile2 = this.board[r][c + 1];
          const tile3 = this.board[r][c + 2];

          if (
            tile1.src === tile2.src &&
            tile2.src === tile3.src &&
            !tile1.src.includes("blank")
          ) {
            if (apply) {
              tile1.src = "/images/candy/images/blank.png";
              tile2.src = "/images/candy/images/blank.png";
              tile3.src = "/images/candy/images/blank.png";
              this.score += 10;
            }
            crushed = true;
          }
        }
      }

      for (let c = 0; c < this.columns; c++) {
        for (let r = 0; r < this.rows - 2; r++) {
          const tile1 = this.board[r][c];
          const tile2 = this.board[r + 1][c];
          const tile3 = this.board[r + 2][c];

          if (
            tile1.src === tile2.src &&
            tile2.src === tile3.src &&
            !tile1.src.includes("blank")
          ) {
            if (apply) {
              tile1.src = "/images/candy/images/blank.png";
              tile2.src = "/images/candy/images/blank.png";
              tile3.src = "/images/candy/images/blank.png";
              this.score += 10;
            }
            crushed = true;
          }
        }
      }
      return crushed;
    },
    slideCandy() {
      for (let c = 0; c < this.columns; c++) {
        let ind = this.rows - 1;
        for (let r = this.rows - 1; r >= 0; r--) {
          if (!this.board[r][c].src.includes("blank")) {
            this.board[ind][c].src = this.board[r][c].src;
            ind -= 1;
          }
        }
        for (let r = ind; r >= 0; r--) {
          this.board[r][c].src = "/images/candy/images/blank.png";
        }
      }
    },
    generateCandy() {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[0][c].src.includes("blank")) {
          this.board[0][c].src = `/images/candy/images/${this.randomCandy()}.png`;
        }
      }
    },
    triggerWinner() {
      this.winner = true;
      this.resultMessage1 = "🎉 Congratulations! 🎉";
      this.resultMessage = "You’ve are Winner!";
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });
    },
    closeShowInstructionModal(){
      this.showInstructionModal = false;
    },
    openPrizeClaimForm() {
      this.showClaimForm = true;
      this.winner = false;
    },
    closeClaimForm() {
      this.showClaimForm = false;
       this.goBack();
    },
    submitClaimForm() {
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
      
      this.showClaimForm = false;
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
      this.winner = true;
      this.showClaimButton = false;
    },
    goBack() {
      this.winner = false;
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
        this.$router.push('/game/candy');
      }, 500);
    },
    showHelp() {
      this.showInstructionModal = true;
    },
    goHome() {
      this.isLoading = true;
      this.stopStartingAudio();
    //   this.failAudioVariable = new Audio(failAudio);
    //   this.failAudioVariable.muted = true;
    //   this.failAudioVariable.play()
    //   .then(() => {
    //  this.failAudioVariable.muted = false}
    //   )
    //   .catch((err) => {console.error("Error preloading intro sound:", err)});
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
  },
};
</script>

<style>
 /* body{
  background: url("./background.jpg") no-repeat center center fixed;
    background-size: cover;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    text-align: center;
}  */
.boardImage{
  background: url("./background.jpg") no-repeat center center fixed;
    background-size: cover;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    text-align: center;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate__spin {
  animation: spin 2s linear infinite;
}

@keyframes bounceIn {
  0% { transform: scale(0); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.animate__bounceIn {
  animation: bounceIn 1s ease-out;
}

@keyframes flipInX {
  0% { transform: rotateX(-90deg); opacity: 0; }
  100% { transform: rotateX(0); opacity: 1; }
}

.animate__flipInX {
  animation: flipInX 1s ease-in-out;
}
</style>
