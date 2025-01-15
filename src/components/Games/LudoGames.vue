<template>
    <div class="min-h-screen bg-gray-900 flex flex-col items-center text-white">
      <!-- Header -->
      <!-- <div class="w-full flex justify-between items-center bg-rose-800 px-4 py-2">
          <div class="flex items-center space-x-3">
              <button @click="goBack">
                  <img src="../../assets/Games/home.png" alt="Home" class="w-8 h-8"/>
              </button>
          </div>
          <div class="flex items-center space-x-4">
              <div class="text-yellow-400 font-semibold flex items-center">
                  💰 <span class="ml-1">{{ totalCoins }}</span>
              </div>
              <div class="text-blue-300 font-semibold flex items-center">
                  💎 <span class="ml-1">{{ totalGems }}</span>
              </div>
              <button class="bg-blue-600 px-3 py-1 rounded text-white font-bold">
                  +
              </button>
          </div>
      </div> -->
      <div class="w-full flex justify-between items-center bg-purple-800 px-4 py-2 mt-3 rounded-lg border-1 border-black">
          <div
          v-for="player in players.slice(0, 2)"
          :key="player.id"
          class="flex items-center space-x-3"
           :class="getPlayerClass(player)"
        >
          <img
            :src="player.avatar"
            alt="Player Avatar"
            class="w-12 h-12 rounded-full border-2"
            :class="getPlayerClass(player)"
          />
          <div>
            <div class="font-bold text-sm">{{ player.name }}</div>
            <div class="font-semibold flex items-center" :class="getPlayerClass(player)">
              💰 <span class="ml-1">{{ player.coins }}</span>
            </div>
          </div>
        </div>
        
      </div>
  
      <!-- Game Board -->
      <div class="grid grid-cols-11 gap-0 bg-blue-900 w-11/12 mt-2 rounded-lg">
          <!-- <div v-for="(pawn, index) in players[currentPlayerIndex].pawns" :key="'pawn-' + index" class="flex items-center justify-center">
              <div :class="['w-10 h-10 rounded-full', playerColors[currentPlayerIndex].bgClass, pawn.position === -1 ? 'opacity-50' : '', ]"
              @click="movePawn(currentPlayerIndex, index)" :title="'Pawn ' + (index + 1) + ': Position ' + pawn.position">
              </div>
          </div> -->
        <!-- Blue Home -->
          <div class="col-span-4 bg-blue-500 grid grid-cols-2 grid-rows-2">
              <div v-for="(pawn, index) in players[0].pawns" :key="'blue-pawn-' + index"  class="relative flex items-center justify-center cursor-pointer" >
                  <div class="pawn w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white text-lg shadow-lg hover:scale-110 transition-transform relative" :style="{ zIndex: index + 1 }"></div>
                  <img src="./images/bluePawn.png" alt="Blue Pawn" class="w-6 h-6 object-contain z-20 absolute" @click="movePawn(0, index)"  :style="getPawnStyle(0,pawn.position)"/>
              </div>
          </div>
  
        <!-- Middle Path Top -->
        <div class="col-span-3 grid grid-rows-6 grid-cols-3 h-[135px]">
          <div v-for="(cell, index) in 18"
            :key="'path-cell-' + index"
            :class="{
            'bg-yellow-500': [5,6, 8, 11, 14, 17].includes(index + 1),
            'bg-white': ![5, 6, 8, 11, 14, 17].includes(index + 1)
      }"
            class=" border border-black" >
          <span v-if="[6, 7].includes(index + 1)" class="text-gray-500 text-base flex items-center justify-center">⭐</span>
          <span v-if="[2].includes(index + 1)" class="text-yellow-600 font-bold text-base flex items-center justify-center" style="transform: rotate(90deg);">>></span>
        </div>
        </div>
  
        <!-- Yellow Home -->
          <div class="col-span-4 bg-yellow-500 grid grid-cols-2 grid-rows-2">
              <div v-for="(pawn, index) in players[1].pawns" :key="'yellow-pawn-' + index" class="relative flex items-center justify-center cursor-pointer">
                  <div class="pawn w-10 h-10 bg-yellow-700 rounded-full flex items-center justify-center text-white text-lg shadow-lg hover:scale-110 transition-transform relative" :style="{ zIndex: index + 1 }"></div>
                  <img src="./images/yellowPawn.png" alt="Yellow Pawn" class="w-6 h-6 object-contain z-20 absolute"  @click="movePawn(1, index)" :style="getPawnStyle(1,pawn.position)"/>
              </div>
          </div>
  
        <!-- Middle Path Left -->
        <div class="col-span-4 grid grid-cols-6 grid-rows-3 h-[100px]">
          <div v-for="(cell, index) in 18" :key="'red-path-' + index" 
          :class="{
            'bg-blue-500': [2, 8, 9, 10, 11,12].includes(index + 1),
            'bg-white': ![2, 8, 9, 10, 11,12].includes(index + 1)
      }"
          class="border border-black">
          <span v-if="[2, 15].includes(index + 1)" class="text-blue-900 text-2xl flex items-center justify-center">&#9733;</span>
          <span v-if="[7].includes(index + 1)" class="text-blue-600 font-bold text-base flex items-center justify-center">>></span>
        </div>
        </div>
  
        <!-- Center Area -->
        <div class="col-span-3 bg-white flex items-center justify-center h-[100px]">
          <div class="absolute w-0 h-0 top-[36%] border-l-[54px] border-l-transparent border-r-[54px] border-r-transparent border-t-[68px] border-yellow-500 top-0 left-1/2 transform -translate-x-1/2 z-0"></div>
           <div class="absolute w-0 h-0 left-[49%] border-t-[54px] border-t-transparent border-b-[54px] border-b-transparent border-r-[52px] border-green-500 top-[44%] right-0 transform -translate-y-1/2 z-0"></div>
           <div class="absolute w-0 h-0 bottom-[47%] border-l-[54px] border-l-transparent border-r-[54px] border-r-transparent border-b-[54px] border-red-500 bottom-0 left-1/2 transform -translate-x-1/2 z-0"></div>
           <div class="absolute w-0 h-0 left-[37%] border-t-[54px] border-t-transparent border-b-[54px] border-b-transparent border-l-[52px] border-blue-500 top-[44%] left-0 transform -translate-y-1/2 z-0"></div>
           <div class="absolute w-10 h-10 bg-white border-2 border-black rounded-full z-10"></div>
        </div>
  
        <!-- Middle Path Right -->
        <div class="col-span-4 grid grid-cols-6 grid-rows-3 h-[100px]">
          <div v-for="(cell, index) in 18" :key="'yellow-path-' + index" 
          :class="{
            'bg-green-500': [17, 7, 8, 9, 10, 11].includes(index + 1),
            'bg-white': ![17,7,8, 9, 10, 11].includes(index + 1)
      }"
          class="border border-black">
          <span v-if="[4, 17].includes(index + 1)" class="text-green-800 text-2xl flex items-center justify-center">&#9733;</span>
          <span v-if="[12].includes(index + 1)" class="text-green-600 font-bold text-base flex items-center justify-center" style="transform: rotate(180deg);">>></span>
        </div>
        </div>
  
        <!-- Red Home -->
          <div class="col-span-4 bg-red-500 grid grid-cols-2 grid-rows-2">
              <div v-for="(pawn, index) in players[2].pawns" :key="'red-pawn-' + index" class="relative flex items-center justify-center cursor-pointer" >
                  <div class="pawn w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-white text-lg shadow-lg hover:scale-110 transition-transform relative" :style="{ zIndex: index + 1 }"></div>
                  <img src="./images/redPawn.png" alt="Red Pawn" class="w-6 h-6 object-contain z-20 absolute"  @click="movePawn(2, index)" :style="getPawnStyle(2,pawn.position)"/>
              </div>
          </div>
  
        <!-- Middle Path Bottom -->
        <div class="col-span-3 grid grid-rows-6 grid-cols-3 h-[135px]">
          <div v-for="(row, index) in 18" :key="'green-path-' + index" 
          :class="{
            'bg-red-500': [5,2, 8, 11, 14, 13].includes(index + 1),
            'bg-white': ![5,2, 8, 11, 14, 13].includes(index + 1)
      }"
          class="border border-black">
          <span v-if="[12, 13].includes(index + 1)" class="text-red-900 text-2xl flex items-center justify-center h-[20px]">&#9733;</span>
          <span v-if="[17].includes(index + 1)" class="text-red-600 font-bold text-base flex items-center justify-center" style="transform: rotate(-90deg);">>></span>
        </div>
        </div>
  
        <!-- Green Home -->
          <div class="col-span-4 bg-green-500 grid grid-cols-2 grid-rows-2">
              <div v-for="(pawn, index) in players[3].pawns" :key="'green-pawn-' + index"  class="relative flex items-center justify-center cursor-pointer"  >
                  <div class="pawn w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white text-lg shadow-lg hover:scale-110 transition-transform relative" :style="{ zIndex: index + 1 }"></div>
                  <img src="./images/greenPawn.png" alt="Green Pawn" class="w-6 h-6 object-contain z-20 absolute" @click="movePawn(3, index)" :style="getPawnStyle(3,pawn.position)"/>
              </div>
          </div>
      </div>
  
      <!-- Footer -->
      <div class="w-full flex justify-between items-center bg-purple-800 px-4 py-2 mt-2 rounded-lg border-1 border-black">
        <div
          v-for="player in players.slice(2)"
          :key="player.id"
          class="flex items-center space-x-3"
         :class="getPlayerClass(player)"
        >
          <img
            :src="player.avatar"
            alt="Player Avatar"
            class="w-12 h-12 rounded-full border-2"
            :class="getPlayerClass(player)"
          />
          <div>
            <div class="font-bold text-sm">{{ player.name }}</div>
            <div class="font-semibold flex items-center" :class="getPlayerClass(player)">
              💰 <span class="ml-1">{{ player.coins }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex justify-between items-center bg-rose-800 px-4 py-2 mt-2">
        <div class="flex items-center space-x-3">
              <button @click="goBack">
                  <img src="../../assets/Games/home.png" alt="Home" class="w-8 h-8"/>
              </button>
        </div>
        <div class="flex flex-row items-center">
              <span class="text-lg text-lime-500 font-bold mr-3">Roll Dice : </span>
              <span class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-slate-600 font-bold text-xl"> {{ diceValue }}</span>
        </div>
        <!-- <button
          @click="rollDice"
          class="bg-blue-600 text-lg font-bold px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          🎲 {{ diceValue }}
        </button> -->
        <button @click="rollDice" class="relative flex items-center px-2 py-1 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 sm:px-2 sm:py-1">
                    <img src="./images/dice4.png" alt="Dice" class="w-8 h-8" />
                    <span class="ml-2 text-lg font-bold">{{ diceValue }}</span>
                </button>
      </div>
    </div>
    <div v-if="isMaintenanceMode" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" >
      <div class="bg-white rounded-lg shadow-lg w-3/4 max-w-md p-6 text-center">
        <h2 class="text-2xl font-bold text-red-600 mb-4">Under Maintenance</h2>
        <p class="text-gray-700 mb-6">
          The game is currently under maintenance. Please check back later!
        </p>
        <button @click="closeMaintenanceModal" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" >
          Close
        </button>
      </div>
    </div>
    <LoaderData v-if="isLoading" />
      <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
  </template>
  
  <script>
      import LoaderData from '../LoaderData.vue';
      import ToasterData from '../ToasterData.vue';
      import avatar1Image from './images/boyBlue.png';
      import avatar2Image from './images/boyYellow.png';
      import avatar3Image from './images/boyRed.png';
      import avatar4Image from './images/boyGreen.png';
      import startingLudoAudio from './sounds/ludoStart.mp3';
      import diceAudio from './sounds/dice.mp3';
      export default {
      components: {
          LoaderData,
          ToasterData
          },
      data() {
          return {
            players: [
          {
            id: 1,
            name: "Player 1",
            avatar: avatar1Image,
            coins: "0",
            pawns: [{ position: -1 }, { position: -1 }, { position: -1 }, { position: -1 }],
          },
          {
            id: 2,
            name: "Player 2",
            avatar: avatar2Image,
            coins: "0",
            pawns: [{ position: -1 }, { position: -1 }, { position: -1 }, { position: -1 }],
          },
          {
            id: 3,
            name: "Player 3",
            avatar: avatar3Image,
            coins: "0",
            pawns: [{ position: -1 }, { position: -1 }, { position: -1 }, { position: -1 }],
          },
          {
            id: 4,
            name: "Player 4",
            avatar: avatar4Image,
            coins: "0",
            pawns: [{ position: -1 }, { position: -1 }, { position: -1 }, { position: -1 }],
          },
          // Add other players...
        ],
        basePositions: [
      // Player 0's base (Top-left)
      [
        { top: 50, left: 50 },
        { top: 50, left: 100 },
        { top: 100, left: 50 },
        { top: 100, left: 100 },
      ],
      // Player 1's base (Top-right)
      [
        { top: 50, left: 500 },
        { top: 50, left: 550 },
        { top: 100, left: 500 },
        { top: 100, left: 550 },
      ],
      // Player 2's base (Bottom-right)
      [
        { top: 500, left: 500 },
        { top: 500, left: 550 },
        { top: 550, left: 500 },
        { top: 550, left: 550 },
      ],
      // Player 3's base (Bottom-left)
      [
        { top: 500, left: 50 },
        { top: 500, left: 100 },
        { top: 550, left: 50 },
        { top: 550, left: 100 },
      ],
    ],
    positionMap: {
  0: {
    0: { x: 15, y: 140 },
    1: { x: -40, y: 140 },
    2: { x: 20, y: 70 },
    3: { x: -42, y: 70 },
  },
  1: {
    0: { x: -25, y: 20 },
    1: { x: -85, y: 20 },
    2: { x: -28, y: -47 },
    3: { x: -85, y: -45 },
  },
  2: {
    0: { x: 125, y: 90 },
    1: { x: 63, y: 90 },
    2: { x: 125, y: 20 },
    3: { x: 65, y: 20 },
  },
  3: {
    0: { x: 77, y: -30 },
    1: { x: 19, y: -28 },
    2: { x: 80, y: -100 },
    3: { x: 15, y: -95 },
  },
},
        // playerColors: [],
        playerColors: [
                    { bgClass: "bg-blue-700" },
                    { bgClass: "bg-yellow-700" },
                    { bgClass: "bg-red-700" },
                    { bgClass: "bg-green-700" },
        ],
        startingPositions: [
            // Player 0's starting position (Top-left quadrant)
            { top: 200, left: 50 },
            // Player 1's starting position (Top-right quadrant)
            { top: 50, left: 400 },
            // Player 2's starting position (Bottom-right quadrant)
            { top: 400, left: 550 },
            // Player 3's starting position (Bottom-left quadrant)
            { top: 550, left: 200 },
        ],
        pawnImages: [],
        pathCells: [], // Define board cells
        totalCoins: 0,
        totalGems: 0,
        diceValue: 1,
        currentPlayerIndex: 0,
        isLoading : false,
        toastMessage: '',
        toastType: '',
        pawnIndex: 0,
        isMaintenanceMode: true,
          };
      },
      mounted() {
          this.isLoading = true;
          setTimeout(() => {
              this.isLoading = false;
          }, 500);
          this.playStartingAudio();
      },
      methods: {
        getPlayerClass(player) {
            // Example logic to assign classes
            const playerColors = {
                1: "border-blue-400 text-blue-400",
                2: "border-yellow-400 text-yellow-400",  
                3: "border-red-400 text-red-400", 
                4: "border-green-400 text-green-400", 
            };

            // Return the class based on player ID or a default
            return playerColors[player.id] || "border-gray-500 text-gray-500";
        },
          playStartingAudio(){
              const startingAudioPlay = new Audio(startingLudoAudio);
              startingAudioPlay.muted = true;
              startingAudioPlay.play()
                  .then(() => (startingAudioPlay.muted = false))
                  .catch((err) => console.error("Error preloading intro sound:", err));
          },
          rollDice() {

                const diceAudioPlay = new Audio(diceAudio);
                diceAudioPlay.muted = true;
                diceAudioPlay.play()
                .then(() => (diceAudioPlay.muted = false))
                .catch((err) => console.error("Error preloading intro sound:", err));
        
                this.diceValue = Math.floor(Math.random() * 6) + 1;

                if (this.diceValue === 6) {
                    // Logic for rolling a 6:
                    // - Allow the current player to roll again
                    // - Enable moving a pawn from the base if possible
                    // - Stay on the same player
                    this.canRollAgain = true; // Allow re-roll
                    // this.message = "You rolled a 6! Roll again or move a pawn.";
                    this.showToast(`Player ${this.currentPlayerIndex + 1} rolled a 6! Roll again or move a pawn!`, "success");
                } else {
                    // Move to the next player's turn
                    this.canRollAgain = false;
                    this.showToast(`Player ${this.currentPlayerIndex + 1} rolled ${this.diceValue}`, "info");
                    this.nextPlayer();
                }
      },
      movePawn(playerIndex, pawnIndex) {
// console.log("movePawn clicked")
//         console.log("0000",playerIndex,pawnIndex)
console.log(this.diceValue)

          if(this.diceValue == 0){
            this.showToast("Please roll the dice", "danger");
            return;
          }

        if (playerIndex !== this.currentPlayerIndex) {
                this.showToast("Not your turn!", "danger");
                return;
            }

            
            if (this.diceValue !== 6 && this.players[playerIndex].pawns[pawnIndex].position === -1) {
                this.showToast("You need a 6 to start!", "danger");
                return;
            }
            const player = this.players[playerIndex];
            // console.log("5555",player)
            const pawn = player.pawns[pawnIndex];
            this.pawnIndex = pawnIndex;
            // console.log("1111",pawn)

            // Check if the pawn is at the starting position
            if (pawn.position === -1) {
                if (this.diceValue === 6) {
                  // console.log("3333", pawnIndex)
                   
                // Move the pawn to the first position on the board
                    pawn.position = 0; // Move to the starting position
                    this.showToast(`Pawn ${pawnIndex + 1} moved out of the base!`, "success");
                    this.diceValue = 0;
                    return
                   
                } else {
                  console.log("4444")
                        this.message = "You need a 6 to move a pawn out of the base!";
                        this.showToast(this.message, "info");
                       
                }
            } 
              // Calculate the new position
              else {
              // Move the pawn forward

              console.log("2222")
                const newPosition = pawn.position + this.diceValue;

                 pawn.position += this.diceValue;
                 this.showToast(`Pawn ${pawnIndex + 1} moved to position ${newPosition}!`, "info");
                 this.diceValue = 0;
              }
              this.$forceUpdate();
            // If the dice was not a 6, move to the next player
            if (this.diceValue !== 6) {
                this.nextPlayer();
            }
      },
      closeMaintenanceModal() {
          this.isMaintenanceMode = false;
          this.showToast("This is Sample Ui Prototype", "success");
          return;
    },
      nextPlayer() {
         // Advance the turn to the next player
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

        // Reset messages and dice value for the new player
        // this.diceValue = null;
        this.message = `It's ${this.players[this.currentPlayerIndex].name}'s turn!`;
      },
      getPawnStyle(playerIndex, position) {
        console.log("getPawnStyle function called",playerIndex,position);
        console.log("pawnIndex",this.pawnIndex)
                if (position === -1) {
                  console.log("getPawnStyle function in position as -1",)
                  // return {
                  //     top: `${this.basePositions[playerIndex][0].top}px`,
                  //     left: `${this.basePositions[playerIndex][0].left}px`,
                  // };
                  return this.basePositions[playerIndex][position];
                }

                const cell = this.positionMap[playerIndex] && this.positionMap[playerIndex][this.pawnIndex];
                console.log("7777", this.positionMap[playerIndex]);
                console.log("8888",cell)
                if (cell) {
                  console.log("Position found in positionMap:", cell);
                  return {
                      top: `${cell.y}px`,
                      left: `${cell.x}px`,
                  };
                  } else {
                      // Fallback case if the position is not found (maybe it's out of bounds or an invalid position)
                      return {
                          top: '0px',
                          left: '0px',
                      };
                    }
               
                // const pathCell = this.pathCells[position];
                // if (!pathCell) {
                //     console.warn(`Path cell at position ${position} not found.`);
                //     return { left: "0px", top: "0px" }; // Default fallback
                // }

                // return { top: pathCell.top, left: pathCell.left };
            // const pos = this.positionMap[position] || { x: 0, y: 0 }; // Default to 0,0 if position is undefined
            //     return {
            //         left: `${pos.x}px`,
            //         top: `${pos.y}px`,
            //     };
        
      },
      checkCollision(playerIndex, position) {
        return this.players.some((player, index) => {
            if (index !== playerIndex) {
            return player.pawns.some((pawn) => pawn.position === position);
            }
            return false;
        });
    },
    handleCollision(position) {
        this.players.forEach((player) => {
            player.pawns.forEach((pawn) => {
            if (pawn.position === position) {
                pawn.position = -1; // Send the pawn back to the base
            }
            });
        });
    },
    isPawnInHome(playerIndex, pawn) {
        // const homeStart = this.homePositions[playerIndex];
        // return pawn.position >= homeStart && pawn.position < homeStart + 6;
        const homePosition = this.getHomePosition(playerIndex);
        return pawn.position === homePosition;
    },
    getHomePosition(playerIndex) {
    console.log(playerIndex)
        return this.pathCells.length - 1; // Last cell is the home position for simplicity
    },
    goBack() {
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
},
};
  </script>
  
  <style scoped>
  /* Use TailwindCSS utilities for styling. */
  .pawn:hover {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }
  
  .pawn {
    transition: top 0.5s, left 0.5s;
}
  </style>
  