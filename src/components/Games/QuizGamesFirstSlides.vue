  <template>
    <div class="bg-gradient-to-r from-orange-400 to-orange-300 text-white min-h-screen flex flex-col items-center p-5">
      <header class="w-full flex items-center justify-between p-4 bg-rose-800">
        <button @click="goBack" class="transition-transform transform hover:scale-110">
          <img src="../../assets/Games/home.png" alt="Home" class="w-8 h-8"/>
        </button>
        <h1 class="text-2xl font-bold">KBC Quiz</h1>
      </header>
  
      <section class="mt-1 text-center">
        <h4 class="text-xl font-bold text-blue-800 mb-2 transition-transform transform hover:scale-105 hover:text-orange-600 mt-2" 
          title="Welcome to Quiz Champion">
          Welcome to Quiz Champion
        </h4>
        <p class="text-base font-semibold text-lime-800 animate-bounce mt-4"
          title="Test your knowledge and become a quiz champion!">
          Test your knowledge to be a champion!
        </p>
  
        <div class="quiz-actions mt-1 flex items-center justify-center space-x-3" title="Start Quiz">
          <!-- <router-link 
            :to="'/game/quiz/start2'" 
            class="bg-white text-orange-500 px-4 py-2 rounded hover:bg-orange-100 transition">
            Start Quiz
          </router-link> -->
          <router-link 
            :to="'/game/quiz/start'" 
            class="bg-gradient-to-r from-green-400 to-lime-500 text-white px-4 py-2 rounded-full flex items-center space-x-1 hover:bg-orange-500 transition-transform transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-6.214 3.745a1 1 0 01-1.514-.857V9.944a1 1 0 011.514-.857l6.214 3.745a1 1 0 010 1.714z" />
          </svg>
          <span> Start Quiz</span>
          </router-link>
        </div>
  
        <div 
          title="QuizImage" 
          class="h-40 max-h-40 border-2 border-blue-500 rounded-lg mt-1 flex items-center justify-center transition-shadow shadow-md hover:shadow-lg">
          <img 
            src="../Games/images/QuizImage.png" 
            alt="QuizImage" 
            class="w-full h-full rounded-lg p-4 object-contain"/>
        </div>

        <!-- Instructions Section -->
      <div class="instructions mt-1 bg-cyan-700 text-white px-5 py-1 rounded-lg shadow-lg transition-shadow text-left">
        <h3 class="text-lg font-bold mb-1">Instructions</h3>
        <ul class="list-inside list-disc text-xs ">
          <li>Each question has a time limit.Answer before time runs out !</li>
          <li>You have 4 possible answers.</li>
          <li>After every correct answer, you move to the next question.</li>
          <li>If you answer incorrectly, the game ends. Try your best !</li>
          <li>if you Earn <span class="text-rose-800 text-base font-bold mr-1">50000000</span> then the claim form for bumper prizes win.</li>
          <li>Good luck and have fun !</li>
        </ul>
      </div>
      </section>
    </div>
    <!-- <NewQuestionData :data1="questions" /> -->
    <!-- <ThirdComponent v-if="questions && questions.length" :questions="questions" /> -->
    <LoaderData v-if="isLoading" />
    <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
  </template>
  
  <script>
  import LoaderData from '../LoaderData.vue';
  import ToasterData from '../ToasterData.vue';
  // import ThirdComponent from '../Games/Quiz/ThirdComponents.vue';
  // import NewQuestionData from '../Games/QuizGames.vue';
  
  export default {
    name: "QuizGames",
    components: {
      LoaderData,
      ToasterData,
      // ThirdComponent
      // NewQuestionData
    },
    data() {
      return {
        isLoading: false,
        questions: [],
        error: null,
      };
    },
    async mounted() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },
    created() {
      // this.fetchQuestions();  
  },
    methods: {
      async fetchQuestions(){
        try {
      // const response = await fetch("/questions.txt"); // Path relative to the public folder
      // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // const textData = await response.text();

      const response = await fetch("https://res.cloudinary.com/dzoaewmgu/raw/upload/v1736250594/wzv2jocum9iqewt9oxep.txt")
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const textData = await response.text();
      this.questions = JSON.parse(textData);
      console.log(this.questions)
    } catch (error) {
      console.error("Failed to load questions:", error);
      this.error = "Failed to load questions. Please try again later.";
    }
      },
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
  