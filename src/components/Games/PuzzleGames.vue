<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-teal-500">
    <!-- Header -->
    <header class="flex items-center justify-between bg-rose-800 p-4 text-white">
      <button @click="goBack">
        <img src="../../assets/Games/home.png" alt="Home" class="w-8 h-8"/>
      </button>
      <h1 class="text-lg font-bold text-center flex-1">Puzzle Game</h1>
    </header>
      <!-- Puzzle Grid -->
      <div class="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-1 md:gap-2 flex-1 p-4">
        <div
          v-for="piece in pieces"
          :key="piece.id"
          :class="[
            'relative border p-2 md:p-4 cursor-pointer text-center font-bold transition-all duration-300',
            piece.solved ? 'bg-gradient-to-r from-green-400 to-teal-500' : 'bg-gray-400 opacity-100 cursor-not-allowed',
          ]"
          @click="handlePieceClick(piece)"
        >
          <span class="text-xs md:text-lg">{{ piece.label }}</span>
          <div v-if="!piece.solved" class="absolute inset-0 flex items-center justify-center">
            <!-- Locked -->
            <LockIcon class="w-6 h-6 mx-auto text-gray-500" />
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <!-- <aside class="bg-gradient-to-b from-purple-600 to-pink-60 w-full md:w-1/4 p-4 border border-2 border-orange-800 rounded-lg md:border-t-0 md:border-l">
          <h3 class="text-lg font-semibold">Leaderboard</h3>
          <ul class="mt-2 space-y-2">
            <li class="flex justify-between">
              <span>Score</span>
              <span>{{ score }}</span>
            </li>
          </ul>
      </aside> -->

       <!-- Instructions Section -->
    <aside class="bg-gradient-to-b from-purple-600 to-pink-600 w-full md:w-1/4 px-2 py-1 border border-2 border-orange-800 rounded-lg md:border-t-0 md:border-l">
      <h3 class="text-sm font-semibold text-white">Instructions</h3>
      <ul class="mt-1 space-y-1 text-white text-xs">
        <li>
          <p class="p-0">🎯 Solve all the questions correctly to win an exciting gift hamper!</p>
        </li>
        <li>
          <p class="p-0">⚠️ If any question is answered incorrectly, you will start from Level 0 again.</p>
        </li>
        <li>
          <p class="p-0">🔑 Read each question carefully before answering.</p>
        </li>
      </ul>
    </aside>

  </div>
  <LoaderData v-if="isLoading" />
  <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
</template>

<script>
import LoaderData from '../LoaderData.vue';
import ToasterData from '../ToasterData.vue';
import { LockClosedIcon } from '@heroicons/vue/solid';
export default {
  components: {
  LoaderData,
  ToasterData,
  LockIcon: LockClosedIcon,
},
  data() {
    return {
      pieces: [], // Dynamic puzzle pieces
      time: "00:00",
      score: 0,
      toastMessage: '',
      toastType: '',
      isLoading: false,
    };
  },
  mounted() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
//Initialize the game board
    this.pieces = Array.from({ length: 32 }, (_, i) => ({
      id: i + 1,
      label: `Level ${i + 1}`,
      solved: false,
    }));
    this.pieces[0].solved = true;
  },
  methods: {
    handlePieceClick(piece) {
      // Logic to handle puzzle piece clicks
      if (piece.solved) {
          piece.solved = true;
          this.score += 10;
          this.$router.push({ name: 'LevelView', params: { levelNo: piece.id } });
      } else {
        // alert("This level is locked until the previous level is completed.");
        this.showToast('This level is locked until the previous level is completed.', 'danger');
      }
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

<style>
/* Add your Tailwind CSS overrides or additional styles here */
</style>
