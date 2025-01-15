<template>
    <div class="breakOutDiv">
        <div class="flex justify-between items-center w-full px-6 py-4 mb-5 bg-rose-800">
            <button @click="goHome">
                <img src="../../../../assets/Games/home.png" alt="Home" class="w-8 h-8 hover:scale-110 transition-transform duration-300" />
            </button>
            <div class="text-xl font-bold flex items-center space-x-4">
                <h1>Score: <span>{{ score }}</span></h1> 
            </div>
        </div>
        <canvas ref="board" class="board"></canvas>
        <div class="controls">
            <div class="control-btn move-left" @touchstart="moveLeft(true)" @touchend="moveLeft(false)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="control-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </div>
            <div class="control-btn move-right" @touchstart="moveRight(true)" @touchend="moveRight(false)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="control-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </div>
            <!-- <button @touchstart="moveLeft(true)" @touchend="moveLeft(false)" class="buttonLeft">Left</button>
            <button @touchstart="moveRight(true)" @touchend="moveRight(false)" class="buttonLeft">Right</button> -->
        </div>

        <div v-if="gameOver" class="game-over-overlay">
            <p>Game Over</p>
            <button @click="resetGame" class="restart-button">Restart</button>
        </div>
        <LoaderData v-if="isLoading" />
        <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
    </div>
</template>
<script>
 import LoaderData from '../../../LoaderData.vue';
 import ToasterData from '../../../ToasterData.vue';
 import startAudio from '../../sounds/breakoutStart.wav';
 import failAudio from '../../sounds/breakoutFail.wav';
export default {
  name: "BreakoutGame",
  components: {
      LoaderData,
      ToasterData
    },
  data() {
    return {
      startAudioVariable : '',
      failAudioVariable : '',
      boardWidth: 350,
      boardHeight: 450,
      context: null,
      gameOver: false,
      score: 0,
      toastMessage: '',
      toastType: '',
      isLoading: false,
      movingLeft: false,
      movingRight: false,

      player: {
        width: 50,
        height: 5,
        velocityX: 10,
        x: 0,
        y: 0,
      },

      ball: {
        width: 5,
        height: 5,
        velocityX: 3,
        velocityY: 2,
        x: 0,
        y: 0,
      },

      blockArray: [],
      blockWidth: 20,
      blockHeight: 5,
      blockColumns: 11,
      blockRows: 8,
      blockMaxRows: 15,
      blockCount: 0,
      blockX: 15,
      blockY: 45,
    };
  },
  mounted() {
    this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
        this.score = 0;
        this.playStartingAudio();
        this.startGame();
        this.gameLoop();
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
    startGame(){
        const canvas = this.$refs.board;
        canvas.width = this.boardWidth;
        canvas.height = this.boardHeight;
        this.context = canvas.getContext("2d");

        this.player.x = this.boardWidth / 2 - this.player.width / 2;
        this.player.y = this.boardHeight - this.player.height - 5;

        this.ball.x = this.boardWidth / 2;
        this.ball.y = this.boardHeight / 2;
      
        this.createBlocks();
        this.drawPlayer();

        requestAnimationFrame(this.update);
        // document.addEventListener("keydown", this.movePlayer);
    },
    update() {
      if (this.gameOver) return;

      requestAnimationFrame(this.update);

      this.context.clearRect(0, 0, this.boardWidth, this.boardHeight);
      this.drawPlayer();
      this.updateBall();
      this.drawBlocks();
      this.checkGameOver();
    },
    drawPlayer() {
      this.context.fillStyle = "lightgreen";
      this.context.fillRect(
        this.player.x,
        this.player.y,
        this.player.width,
        this.player.height
      );
    },
    updateBall() {
      this.context.fillStyle = "white";
      this.ball.x += this.ball.velocityX;
      this.ball.y += this.ball.velocityY;
      this.context.fillRect(
        this.ball.x,
        this.ball.y,
        this.ball.width,
        this.ball.height
      );

      if (this.topCollision(this.ball, this.player) || this.bottomCollision(this.ball, this.player)) {
        this.ball.velocityY *= -1;
      } else if (this.leftCollision(this.ball, this.player) || this.rightCollision(this.ball, this.player)) {
        this.ball.velocityX *= -1;
      }

      if (this.ball.y <= 0 || this.ball.x <= 0 || this.ball.x + this.ball.width >= this.boardWidth) {
        this.ball.velocityY *= this.ball.y <= 0 ? -1 : 1;
        this.ball.velocityX *= this.ball.x <= 0 || this.ball.x + this.ball.width >= this.boardWidth ? -1 : 1;
      }
    },
    drawBlocks() {
      this.context.fillStyle = "skyblue";
      for (let block of this.blockArray) {
        if (!block.break) {
          if (this.detectCollision(this.ball, block)) {
            block.break = true;
            this.ball.velocityY *= -1;
            this.score += 10;
            this.blockCount--;
          }
          this.context.fillRect(block.x, block.y, block.width, block.height);
        }
      }

      if (this.blockCount === 0) {
        this.nextLevel();
      }

    //   this.context.font = "20px sans-serif";
    //   this.context.fillText(`Score: ${this.score}`, 10, 25);
    },
    createBlocks() {
      this.blockArray = [];
      for (let c = 0; c < this.blockColumns; c++) {
        for (let r = 0; r < this.blockRows; r++) {
          this.blockArray.push({
            x: this.blockX + c * this.blockWidth + c * 10,
            y: this.blockY + r * this.blockHeight + r * 10,
            width: this.blockWidth,
            height: this.blockHeight,
            break: false,
          });
        }
      }
      this.blockCount = this.blockArray.length;
    },
    detectCollision(a, b) {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    },
    topCollision(a, b) {
      return this.detectCollision(a, b) && a.y + a.height >= b.y;
    },
    bottomCollision(a, b) {
      return this.detectCollision(a, b) && b.y + b.height >= a.y;
    },
    leftCollision(a, b) {
      return this.detectCollision(a, b) && a.x + a.width >= b.x;
    },
    rightCollision(a, b) {
      return this.detectCollision(a, b) && b.x + b.width >= a.x;
    },
    movePlayer() {
    //   if (this.gameOver) {
    //     if (e.code === "Space") this.resetGame();
    //     return;
    //   }

    //   if (e.code === "ArrowLeft") {
    //     this.player.x = Math.max(0, this.player.x - this.player.velocityX);
    //   } else if (e.code === "ArrowRight") {
    //     this.player.x = Math.min(
    //       this.boardWidth - this.player.width,
    //       this.player.x + this.player.velocityX
    //     );
    //   }
            if (this.gameOver) return;

        if (this.movingLeft) {
            this.player.x = Math.max(0, this.player.x - this.player.velocityX);
        }
        if (this.movingRight) {
            this.player.x = Math.min(
                this.boardWidth - this.player.width,
                this.player.x + this.player.velocityX
            );
        }
    },
    nextLevel() {
      this.score += 10 * this.blockRows * this.blockColumns;
      this.blockRows = Math.min(this.blockRows + 1, this.blockMaxRows);
      this.createBlocks();
    },
    checkGameOver() {
        if (this.ball.y + this.ball.height >= this.boardHeight) {
        this.gameOver = true;
        }
    },
    resetGame() {
        this.gameOver = false;
        this.player.x = this.boardWidth / 2 - this.player.width / 2;
        this.ball = {
        x: this.boardWidth / 2,
        y: this.boardHeight / 2,
        width: this.ball.width,
        height: this.ball.height,
        velocityX: this.ball.velocityX,
        velocityY: this.ball.velocityY,
        };
        this.score = 0;
        this.createBlocks();
        this.drawPlayer();
        this.playStartingAudio();
        requestAnimationFrame(this.update);
    },
    moveLeft(active) {
        this.movingLeft = active;
    },
    moveRight(active) {
        this.movingRight = active;
    },
    gameLoop() {
    // Main game update loop...
    this.movePlayer();
    requestAnimationFrame(this.gameLoop);
  },
    // goBack() {
    //   this.winner = false;
    //   setTimeout(() => {
    //     this.isLoading = false;
    //     this.$router.push('/game/breakout');
    //   }, 500);
    // },
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
.breakOutDiv{
  text-align: center;
}
.board {
    background-color: black;
    border-top: 5px solid skyblue;
    border-left: 5px solid skyblue;
    border-right: 5px solid skyblue;
}

canvas {
  border-radius: 20px;
}
.buttonLeft {
  width: 40px;
  height: 40px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 14px;
}
.buttonLeft:active {
  background-color: #666;
}

.controls {
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
}

/* Control Buttons */
.control-btn {
  width: 60px;
  height: 60px;
  background-color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.control-btn:active {
  transform: scale(0.9);
  background-color: #666;
}

.control-icon {
  width: 30px;
  height: 30px;
  stroke: white;
}

/* Game Over Overlay */
.game-over-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  color: white;
  font-family: sans-serif;
}

.restart-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.restart-button:hover {
  background-color: #218838;
}

.restart-button:active {
  transform: scale(0.95);
}


</style>
