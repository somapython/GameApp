<template>
    <div class="min-h-screen flex flex-col items-center bg-teal-500 py-4">
        <div class="flex justify-between items-center w-full px-6 py-4 mb-5 bg-rose-800">
            <button @click="goHome">
                <img src="../../../../assets/Games/home.png" alt="Home" class="w-8 h-8 hover:scale-110 transition-transform duration-300" />
            </button>
            <div class="text-xl font-bold flex items-center space-x-4">
              <h1>Score: <span>{{ score }}</span></h1>
            </div>
        </div>
        <canvas id="board" ref="board" class="border border-2 border-gray-800 rounded-lg"></canvas>
        <div class="flex justify-between items-center mt-2 w-full px-4">
            <button class="bg-blue-600 text-white font-bold rounded-full hover:bg-blue-800 px-2 py-1"
              @touchstart="moveLeft"  @touchend="stopMovement" >
                <!-- Left -->
                &larr;
            </button>
            <button class="bg-blue-600 text-white font-bold  rounded-full hover:bg-blue-800 px-2 py-1"
               @touchstart="moveRight"  @touchend="stopMovement" >
              <!-- Right -->
              &rarr;
            </button>
        </div>  
      
        <div class="flex justify-between items-center w-full px-4 py-2 mt-4 bg-blue-600">
            <button @click="goBack" class="px-3 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-700 transition-all">
                Back
            </button>
            <button class="bg-red-600 text-white font-bold px-3 py-2 rounded-lg hover:bg-red-800 transition-all"
              v-if="gameOver" @click="resetGame" >
                Restart
            </button>
            <button @click="showHelp" class="px-3 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-600 transition-all">
                How to Play
            </button>
        </div>
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
                <ul class="text-sm text-gray-400">
                    <li>Step 1: Use the <span class="font-bold text-xl text-yellow-600">left</span> and <span class="font-bold text-xl text-yellow-600">right</span> buttons or arrow keys to move your doodler.</li>
                    <li>Step 2: Jump on platforms to avoid falling off the screen. You can land on moving platforms as well!</li>
                    <li>Step 3: Collect points by performing longer jumps and avoiding obstacles, and keep an eye out for disappearing platforms.</li>
                    <li>Step 4: If you reach a score of <span class="font-bold text-xl text-red-800">50000</span>, you'll receive an exciting bumper prize at your address!</li>
                    <li>Step 5: Enter your details in the prize claim form once you qualify.</li>
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
  </template>
  
  <script>
  import LoaderData from '../../../LoaderData.vue';
  import ToasterData from '../../../ToasterData.vue';
  import "animate.css";
  import confetti from 'canvas-confetti';
  import Papa from 'papaparse';
  import startAudio from '../../sounds/doodleStart.wav';
  import failAudio from '../../sounds/doodleFail.wav';
  export default {
    name: "DoodleJump",
    components: {
      LoaderData,
      ToasterData
    },
    data() {
      return {
        boardWidth: 340,
        boardHeight: 375,
        context: null,
  
        doodler: {
          img: null,
          x: 0,
          y: 0,
          width: 46,
          height: 46,
        },
        doodlerRightImg: null,
        doodlerLeftImg: null,

        velocityX: 0,
        velocityY: 0,
        initialVelocityY: -8,
        gravity: 0.4,

        platformArray: [],
        platformWidth: 60,
        platformHeight: 18,
        platformImg: null,
  
        score: 0,
        maxScore: 0,
        gameOver: false,
        startAudioVariable : '',
        failAudioVariable : '',
        toastMessage: '',
        toastType: '',
        isLoading: false,
        winner: false,
        showInstructionModal: false,
        showClaimForm: false,
        resultMessage: '',
        resultMessage1: '',
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
          }, 500);
      this.score = 0;
      this.playStartingAudio();
      this.startingGame();
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
  startingGame(){
      const board = this.$refs.board;
      board.height = this.boardHeight;
      board.width = this.boardWidth;
      this.context = board.getContext("2d");
  
      this.doodlerRightImg = new Image();
      this.doodlerRightImg.src = "/images/doodle/image/doodler-right.png";
      this.doodler.img = this.doodlerRightImg;
      this.doodler.x = this.boardWidth / 2 - this.doodler.width / 2;
      this.doodler.y = (this.boardHeight * 7) / 8 - this.doodler.height;
  
      this.doodlerLeftImg = new Image();
      this.doodlerLeftImg.src = "/images/doodle/image/doodler-left.png";
  
      this.platformImg = new Image();
      this.platformImg.src = "/images/doodle/image/platform.png";
  
      this.velocityY = this.initialVelocityY;
      this.placePlatforms();
      requestAnimationFrame(this.update);
  
    //   document.addEventListener("keydown", this.moveDoodler);
  },
  update() {
        if (this.gameOver) {
          return;
        }
        requestAnimationFrame(this.update);
        this.context.clearRect(0, 0, this.boardWidth, this.boardHeight);
  
        this.doodler.x += this.velocityX;
        if (this.doodler.x > this.boardWidth) {
          this.doodler.x = 0;
        } else if (this.doodler.x + this.doodler.width < 0) {
          this.doodler.x = this.boardWidth;
        }
  
        this.velocityY += this.gravity;
        this.doodler.y += this.velocityY;
        if (this.doodler.y > this.boardHeight) {
          this.gameOver = true;
        }
        this.context.drawImage(
          this.doodler.img,
          this.doodler.x,
          this.doodler.y,
          this.doodler.width,
          this.doodler.height
        );
  
        for (let i = 0; i < this.platformArray.length; i++) {
          const platform = this.platformArray[i];
          if (this.velocityY < 0 && this.doodler.y < (this.boardHeight * 3) / 4) {
            platform.y -= this.initialVelocityY; 
          }
          if (this.detectCollision(this.doodler, platform) && this.velocityY >= 0) {
            this.velocityY = this.initialVelocityY; 
          }
          this.context.drawImage(
            platform.img,
            platform.x,
            platform.y,
            platform.width,
            platform.height
          );
        }
  
        while (
          this.platformArray.length > 0 &&
          this.platformArray[0].y >= this.boardHeight
        ) {
          this.platformArray.shift();
          this.newPlatform();
        }
  
        this.updateScore();
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
      moveDoodler(e) {
        if (e.code === "ArrowRight" || e.code === "KeyD") {
          this.velocityX = 4;
          this.doodler.img = this.doodlerRightImg;
        } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
          this.velocityX = -4;
          this.doodler.img = this.doodlerLeftImg;
        } else if (e.code === "Space" && this.gameOver) {
          this.resetGame();
        }
      },
      moveLeft() {
        this.velocityX = -4;
        this.doodler.img = this.doodlerLeftImg;
    },
    moveRight() {
        this.velocityX = 4;
        this.doodler.img = this.doodlerRightImg;
    },
    stopMovement() {
        this.velocityX = 0;
    },
    resetGame() {
        this.doodler = {
          img: this.doodlerRightImg,
          x: this.boardWidth / 2 - this.doodler.width / 2,
          y: (this.boardHeight * 7) / 8 - this.doodler.height,
          width: 46,
          height: 46,
        };
        this.velocityX = 0;
        this.velocityY = this.initialVelocityY;
        this.score = 0;
        this.maxScore = 0;
        this.gameOver = false;
        // this.placePlatforms();
        this.startingGame();
      },
      placePlatforms() {
        this.platformArray = [];
  
        const startPlatform = {
          img: this.platformImg,
          x: this.boardWidth / 2,
          y: this.boardHeight - 50,
          width: this.platformWidth,
          height: this.platformHeight,
        };
        this.platformArray.push(startPlatform);
  
        for (let i = 0; i < 6; i++) {
          const randomX = Math.floor(Math.random() * (this.boardWidth * 3) / 4);
          const platform = {
            img: this.platformImg,
            x: randomX,
            y: this.boardHeight - 75 * i - 150,
            width: this.platformWidth,
            height: this.platformHeight,
          };
          this.platformArray.push(platform);
        }
      },
  
      newPlatform() {
        const randomX = Math.floor(Math.random() * (this.boardWidth * 3) / 4);
        const platform = {
          img: this.platformImg,
          x: randomX,
          y: -this.platformHeight,
          width: this.platformWidth,
          height: this.platformHeight,
        };
        this.platformArray.push(platform);
      },
  
      detectCollision(a, b) {
        return ( a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y );
      },
  
      updateScore() {
        const points = Math.floor(50 * Math.random());
        if (this.velocityY < 0) {
          this.maxScore += points;
          if (this.score < this.maxScore) {
            this.score = this.maxScore;
          }
        } else if (this.velocityY >= 0) {
          this.maxScore -= points;
        }
       
        if (this.gameOver) {
            if(this.score >= 50000){
                this.triggerWinner();
            }
        }
      },
      showHelp() {
      this.showInstructionModal = true;
    },
      closeShowInstructionModal(){
      this.showInstructionModal = false;
    },
    goBack() {
      this.isLoading = true;
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
        this.$router.push('/game/doodle');
      }, 500);
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
    },
  };
  </script>
  
  <style scoped>
body {
    text-align: center;
}

#board {
    background-image: url("./doodlejumpbg.png");
    background-color: #f0f0f0;
    display: block;
}
  </style>
  