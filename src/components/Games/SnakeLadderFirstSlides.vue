<template>
    <div class="bg-gradient-to-r from-violet-400 to-violet-300 text-white min-h-screen flex flex-col items-center p-5">
      <header class="w-full flex items-center justify-between p-4 bg-rose-800">
        <button @click="goBack" class="transition-transform transform hover:scale-110">
          <img src="../../assets/Games/home.png" alt="Home" class="w-8 h-8"/>
        </button>
        <h1 class="text-2xl font-bold">Snake Ladder</h1>
      </header>
  
      <section class="quiz-content mt-2 text-center">
        <h4 
          class="text-2xl font-bold text-blue-800 mb-2 transition-transform transform hover:scale-105 hover:text-orange-600 mt-2" 
          title=" Welcome to Snake Ladder ">
          Welcome to Snake Ladder 
        </h4>
        <p class="text-lg font-semibold text-lime-800 animate-bounce mt-4"
          title=" Play Snake Ladder and win champion!">
          Play Snake Ladder and win champion!
        </p>
        <div class="quiz-actions mt-2 flex items-center justify-center space-x-3" title="Start Game">
          <router-link 
            :to="'/game/snake_ladder/start'" 
            class="bg-gradient-to-r from-rose-400 to-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-1 hover:bg-rose-500 transition-transform transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-6.214 3.745a1 1 0 01-1.514-.857V9.944a1 1 0 011.514-.857l6.214 3.745a1 1 0 010 1.714z" />
          </svg>
          <span>Start Game</span>
          </router-link>
        </div>
  
        <div 
          title="SnakeLadderImage" 
          class="h-80 max-h-80 border-2 border-blue-500 rounded-lg mt-3 flex items-center justify-center transition-shadow shadow-md hover:shadow-lg">
          <img 
            src="../Games/images/SnakeLadderImage.png" 
            alt="SnakeLadderImage" 
            class="w-full h-full rounded-lg p-4 object-contain"/>
        </div>
      </section>
    </div>
  
    <LoaderData v-if="isLoading" />
    <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
  </template>
  
  <script>
  import LoaderData from '../LoaderData.vue';
  import ToasterData from '../ToasterData.vue';
  
  export default {
    name: "SnakeLadderGames",
    components: {
      LoaderData,
      ToasterData
    },
    data() {
      return {
        isLoading: false,
      };
    },
    mounted() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },
    methods: {
      goBack() {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.$router.push('/');
        }, 500);
      },
    },
  };
  </script>
  
  <style scoped>
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  </style>
  