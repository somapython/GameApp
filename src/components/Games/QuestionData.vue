<template>
  <div class="quiz-questions bg-gradient-to-r from-green-400 to-green-300 text-white min-h-screen flex flex-col items-center p-5">
    <header class="w-full flex items-center justify-between p-4 bg-rose-800">
        <button @click="goBack">
            <img src="../../assets/Games/home.png" alt="Home" class="w-8 h-8"/>
        </button>
      <h1 class="text-2xl font-bold">Quiz Questions</h1>
    </header>

    <section class="question-container mt-10 text-center w-full max-w-xl">
      <div v-if="currentQuestion">
        <p class="text-lg font-semibold">{{ currentQuestion.text }}</p>

        <div class="options mt-5">
          <button 
            v-for="(option, index) in currentQuestion.options" 
            :key="index" 
            @click="selectOption(option)" 
            class="w-full bg-white text-green-500 px-4 py-2 rounded mt-3 hover:bg-green-100 transition">
            {{ option }}
          </button>
        </div>
      </div>

      <div v-else>
        <p class="text-lg font-semibold">Congratulations! You've completed the quiz.</p>
        <button 
          @click="restartQuiz" 
          class="bg-white text-green-500 px-4 py-2 rounded mt-5 hover:bg-green-100 transition">
          Restart Quiz
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "QuizQuestions",
  data() {
    return {
      questions: [
        { text: "What is the capital of France?", options: ["Paris", "Berlin", "Madrid", "Rome"] },
        { text: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Homer", "Dante", "Tolstoy"] },
        { text: "What is 2 + 2?", options: ["4", "3", "5", "6"] }
      ],
      currentQuestionIndex: 0
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null;
    }
  },
  methods: {
    goBack() {
        setTimeout(() => {
        this.$router.push('/');
      }, 500);
    },
    selectOption(option) {
      // Logic to handle answer selection
      console.log(`Selected: ${option}`);
      this.currentQuestionIndex++;
    },
    restartQuiz() {
      this.currentQuestionIndex = 0;
    }
  }
};
</script>

<style scoped>
/* Scoped CSS is unnecessary with Tailwind, so it's removed. */
</style>
