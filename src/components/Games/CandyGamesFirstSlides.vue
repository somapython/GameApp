<template>
    <div class="bg-gradient-to-r from-cyan-500 to-blue-500 text-white min-h-screen flex flex-col items-center p-5">
      <header class="w-full flex items-center justify-between p-4 bg-cyan-700">
        <button @click="goBack" class="transition-transform transform hover:scale-110">
          <img src="../../assets/Games/home.png" alt="Home" class="w-8 h-8"/>
        </button>
        <h1 class="text-2xl font-bold">Candy Crush</h1>
      </header>
  
      <section class="quiz-content mt-2 text-center">
        <h4 
          class="text-2xl font-bold text-blue-900 mb-2 transition-transform transform hover:scale-105 hover:text-green-600 mt-2" 
          title="Welcome to Candy Crush Game">
          Welcome to Candy Crush
        </h4>
        <p class="text-lg font-semibold text-yellow-800 animate-bounce mt-4"
          title="Play Candy Crush and clear levels!">
          Match candies, clear levels, and score big!
        </p>
        <div class="quiz-actions mt-2 flex items-center justify-center space-x-3" title="Start Game">
          <router-link 
            :to="'/game/candy/start'" 
            class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full flex items-center space-x-1 hover:bg-purple-600 transition-transform transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-6.214 3.745a1 1 0 01-1.514-.857V9.944a1 1 0 011.514-.857l6.214 3.745a1 1 0 010 1.714z" />
          </svg>
          <span>Play Game</span>
          </router-link>
        </div>
  
        <div 
          title="CandyImage" 
          class="h-80 max-h-80 border-2 border-pink-600 rounded-lg mt-3 flex items-center justify-center transition-shadow shadow-md hover:shadow-lg">
          <img 
            src="../Games/images/candies.png" 
            alt="CandyImage" 
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
    name: "CandyCrushGames",
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

  