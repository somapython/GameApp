<template>
  <div class="bg-gradient-to-r from-violet-500 to-violet-400 text-white min-h-screen flex flex-col items-center p-5">
    <header class="w-full flex items-center justify-between p-4 bg-rose-800">
      <button @click="goBack" class="transition-transform transform hover:scale-110">
        <img src="../../assets/Games/home.png" alt="Home" class="w-8 h-8"/>
      </button>
      <h1 class="text-2xl font-bold">Doodle Jump</h1>
    </header>

    <section class="quiz-content mt-4 text-center">
      <h4 
        class="text-2xl font-bold text-blue-800 mb-2 transition-transform transform hover:scale-105 hover:text-orange-600" 
        title="Welcome to Doodle Jump">
        Welcome to Doodle Jump 
      </h4>
      <p class="text-lg font-semibold text-lime-800 animate-bounce mt-2"
        title="Jump higher and win!">
        Jump higher and set records!
      </p>

      <div class="quiz-actions mt-4 flex items-center justify-center space-x-3" title="Start Game">
        <button 
          @click="startGame" 
          class="bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-cyan-500 transition-transform transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-6.214 3.745a1 1 0 01-1.514-.857V9.944a1 1 0 011.514-.857l6.214 3.745a1 1 0 010 1.714z" />
          </svg>
          <span>Play Game</span>
        </button>
      </div>

      <div 
        title="DoodleJumpImage" 
        class="h-80 max-h-80 border-2 border-red-800 rounded-lg mt-5 flex items-center justify-center transition-shadow shadow-md hover:shadow-lg">
        <img 
          src="../Games/images/DoodleImage.png" 
          alt="DoodleJumpImage" 
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
  name: "DoodleJump",
  components: {
    LoaderData,
    ToasterData
  },
  data() {
    return {
      isLoading: false,
      toastMessage: '',
      toastType: '',
    };
  },
  mounted() {
    this.showLoading();
  },
  methods: {
    showLoading() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },
    goBack() {
      this.showLoading();
      setTimeout(() => {
        this.$router.push('/');
      }, 500);
    },
    startGame() {
      setTimeout(() => {
        this.$router.push('/game/doodle/start');
      }, 1000);
    }
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

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
