<template>
    <div class="appNew">
        <div class="w-[63%] flex flex-col">
            <div>
                <div class="h-[70%] relative">
                    <div class="timer absolute flex items-center justify-center border-solid border-4 border-white rounded-full">
                        <TimerWord :setTimeOut="handleTimeOut" :questionNumber="questionNumber" :timeOut="timeOut" :isGameOver="showWinnerModal" @pauseWarningAudio="pauseWarningAudio" />
                    </div>
                </div>
                <div class="h-[50%]">
                    <TriviaWord
                        :data="data"
                        :questionNumber="questionNumber"
                        @setQuestionNumber="updateQuestionNumber"
                        :setTimeOut="handleTimeOut"
                        @timeOut="handleTimeOut"
                        :isGameOver="isGameOverVariable"
                    />
                </div>
            </div>
        </div>
        <div class="pyramid w-[37%] flex items-center justify-center">
            <div class="flex flex-col w-full">
                <header class="w-full flex items-center justify-between p-2 bg-rose-800 rounded-lg cursor-pointer mb-6"
                @click="closeModal" >
                    <h1 class="text-yellow-500 font-bold text-base">Home</h1>
                    <button class="transition-transform transform hover:scale-110">
                        <i class="fas fa-home text-white text-lg"></i>
                    </button>
                </header>

                <!-- New Buttons Section -->
                <div class="flex justify-around mb-4">
                <!-- Remove Two Options -->
                    <button @click="handleRemoveTwoOptions" class="transition-transform transform hover:scale-110"
                        :class="{ 'cross-bar': isButtonClicked }"
                        title="Remove Two Options" >
                        <i class="fas fa-cut text-blue-500 text-lg"></i>
                    </button>
                    <!-- Hint for Answer -->
                    <button @click="handleShowHint" class="transition-transform transform hover:scale-110"
                        :class="{ 'cross-bar': isHintButtonClicked }"
                        title="Hint for Answer" >
                        <i class="fas fa-lightbulb text-yellow-500 text-lg"></i>
                    </button>
                        <!-- Change Question -->
                    <!-- <button @click="handleChangeQuestion" class="transition-transform transform hover:scale-110"
                        :class="{ 'cross-bar': isNewButtonClicked }"
                        title="Change Question" >
                        <i class="fas fa-sync-alt text-green-500 text-lg"></i>
                    </button> -->
                    <!-- Quit -->
                    <button @click="handleQuit" class="transition-transform transform hover:scale-110"
                      title="Quit" >
                        <i class="fas fa-power-off text-red-500 text-lg"></i>
                    </button>
                </div>
                <ul class="moneyList">
                    <li v-for="m in moneyPyramid" :key="m.id"
                        :class="{ moneyListItem: true, active: questionNumber === m.id,
                        'bg-yellow-400': [10, 12, 14, 16].includes(m.id),
                        }">
                        <span class="moneyListItemNumber">{{ m.id }}</span>
                        <span class="moneyListItemAmount">{{ m.amount }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Timeout/Wrong Answer/Quit Modal -->
        <div v-if="timeOut" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-gradient-to-r from-cyan-500 to-purple-700 rounded-lg shadow-lg p-8 w-11/12 md:w-1/3 relative animate-bounce-in" >
                <h1 class="text-3xl font-extrabold text-red-700 text-center mb-4 tracking-wider animate-pulse" >
                Game Over!
                </h1>
                <p class="text-xl font-bold text-center text-white">
                    <span class="text-fuchsia-950">You earned: </span><strong class="text-yellow-400 animate-pulse">{{ earned }}</strong>
                </p>

                <!-- Animated Icons Section -->
                <div class="flex justify-center my-6 space-x-6">
                    <div class="text-rose-700 text-6xl hover:scale-110 transition-transform animate-spin">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="text-rose-700 text-6xl hover:scale-110 transition-transform animate-spin">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="text-rose-700 text-6xl hover:scale-110 transition-transform animate-spin">
                        <i class="fas fa-star"></i>
                    </div>
                    <!-- <div
                    class="text-yellow-400 text-6xl hover:rotate-45 transition-transform animate-spin-slow"
                    >
                    <i class="fas fa-circle-notch"></i>
                    </div> -->
                    <!-- <div class="text-yellow-300 text-6xl hover:skew-x-12 transition-transform animate-pulse">
                    <i class="fas fa-sun"></i>
                    </div> -->
                </div>

                <!-- Close Button -->
                <div class="flex justify-center">
                    <button
                    @click="closeModal"
                    class="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-orange-500 hover:to-amber-500 hover:scale-105 hover:rotate-1 transition-transform duration-300"
                    >
                    Close
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showQuitModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div class="bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 rounded-lg shadow-2xl p-8 w-11/12 md:w-1/3 relative animate-fadeIn">
                <h1 class="text-2xl font-bold text-green-400 text-center mb-6 tracking-wider">Are you sure you want to quit?</h1>
                <div class="flex justify-around my-8 space-x-8">
                    <button @click="confirmQuit" class="bg-gradient-to-r from-orange-600 to-amber-400 text-white font-semibold px-8 py-4 rounded-lg shadow-xl hover:scale-110 hover:rotate-3 transition-transform duration-300 flex items-center space-x-2" >
                        <img src="./images/yes.png" alt="yesImage" class="w-10 h-10 " />
                        <span>Yes</span>
                    </button>
                    <button @click="cancelQuit" class="bg-gradient-to-r from-green-600 to-lime-400 text-white font-semibold px-8 py-4 rounded-lg shadow-xl hover:scale-110 hover:rotate-3 transition-transform duration-300 flex items-center space-x-2" >
                        <img src="./images/no.png" alt="noImage" class="w-10 h-10 " />
                        <span>No</span>
                    </button>
                </div>
            </div>
        </div>

        <div v-show="showHintModal" class="modal modal-show fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div class="w-[80%] bg-gray-800 text-white p-6 rounded-lg max-w-sm w-full text-center">
            <h2 class="text-xl font-bold mb-4">Correct Answer Hint</h2>
            <p>{{ hintText }}</p>
            <button @click="closeNewModal" class="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Close
            </button>
            </div>
        </div>

        <div v-if="showWinnerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-pink-500 rounded-lg shadow-lg p-8 w-11/12 md:w-1/3 relative animate-bounce-in flex flex-col items-center justify-center" >
            <h1 class="text-2xl font-bold text-green-500 text-center mb-4 tracking-wider ">{{ resultMessage }}</h1>
            <img src="./images/prize.png" alt="winnerImage" class="w-24 h-24 " />
            <p class="text-xl font-bold text-center text-white mt-4">
                <span class="text-violet-950" v-if="showClaimButton">You earned: </span><strong class="text-yellow-400 animate-pulse" v-if="showClaimButton">{{ earned }}</strong>
                <span class="text-violet-950" v-if="!showClaimButton"> You will receive your bumper prize within the next 10 working days.</span>
              </p>
            <!-- Animated Icons Section -->
            <div class="flex justify-center my-4 space-x-6">
                    <div class="text-yellow-700 text-6xl hover:scale-110 transition-transform animate-spin">
                        <i class="fas fa-sun"></i>
                    </div>
                    <div class="text-yellow-700 text-6xl hover:scale-110 transition-transform animate-spin">
                        <i class="fas fa-sun"></i>
                    </div>
                    <div class="text-yellow-700 text-6xl hover:scale-110 transition-transform animate-spin">
                        <i class="fas fa-sun"></i>
                    </div>
                </div>
                <div class="flex justify-center">
                  <button @click="openPrizeClaimForm" v-if="showClaimButton" class="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition-all mr-3" >
                    Claim Prize
                  </button>
                  <button
                    @click="restartGame"
                    class="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:from-orange-500 hover:to-amber-500 hover:scale-105 hover:rotate-1 transition-transform duration-300"
                    >
                    Play Again
                    </button>
                </div>
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

        <!-- Confetti Effect -->
        <div v-if="showConfetti" class="confetti"></div>
        <LoaderData v-if="isLoading" />
        <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
    </div>
</template>

<script>
import TimerWord from "../Games/Quiz/TimerWord.vue";
import TriviaWord from "../Games/Quiz/TriviaWord.vue";
import LoaderData from "../LoaderData.vue";
import ToasterData from "../ToasterData.vue";
import confetti from 'canvas-confetti';
import "../Games/Quiz/NewQuestionData.css";
import Papa from 'papaparse';
// import correctSound from "../../Games/sounds/correct.mp3";
// import wrongSound from "../../Games/sounds/wrong.mp3";
import warningAudioPlay from '../Games/sounds/warning.mp3';

export default {
  name: "NewQuestionData",
  components: { TimerWord, TriviaWord, LoaderData, ToasterData },
  data() {
    return {
      timeOut: false,
      isLoading:false,
      questionNumber: 1,
      earned: "Rs. 0",
      isGameOverVariable:false,
      earnedAmount: 0,
      showQuitModal: false,
      askedQuestions: [],
      currentQuestion: null,
      showWinnerModal: false,
      showConfetti: false,
      resultMessage: '',
      warningAudio: new Audio(warningAudioPlay),
  //     data: [
  //   {
  //     id: 1,
  //     question: "Rolex specializes in what product?",
  //     answers: [
  //       { text: "Phone", correct: false, hint: "" },
  //       { text: "Watches", correct: true, hint: "A luxury brand known for its high-end timepieces." },
  //       { text: "Food", correct: false, hint: "" },
  //       { text: "Cosmetic", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     question: "When did the website `Facebook` launch?",
  //     answers: [
  //       { text: "2004", correct: true, hint: "It was launched by Mark Zuckerberg and his college roommates." },
  //       { text: "2005", correct: false, hint: "" },
  //       { text: "2006", correct: false, hint: "" },
  //       { text: "2007", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     question: "Who played the character of Harry Potter in the movie?",
  //     answers: [
  //       { text: "Johnny Depp", correct: false, hint: "" },
  //       { text: "Leonardo Di Caprio", correct: false, hint: "" },
  //       { text: "Denzel Washington", correct: false, hint: "" },
  //       { text: "Daniel Radcliffe", correct: true, hint: "He is a British actor known for this iconic role." }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     question: "Which city is known as the Pink City in India?",
  //     answers: [
  //       { text: "Bangalore", correct: false, hint: "" },
  //       { text: "Mysore", correct: false, hint: "" },
  //       { text: "Jaipur", correct: true, hint: "This city is famous for its distinct pink-colored buildings." },
  //       { text: "Kochi", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 5,
  //     question: "When is the National Hindi Diwas celebrated?",
  //     answers: [
  //       { text: "13 September", correct: false, hint: "" },
  //       { text: "14 September", correct: true, hint: "It is celebrated annually to promote Hindi as a national language." },
  //       { text: "14 July", correct: false, hint: "" },
  //       { text: "13 July", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 6,
  //     question: "Where is India Gate located?",
  //     answers: [
  //       { text: "Agra", correct: false, hint: "" },
  //       { text: "New Delhi", correct: true, hint: "It is a war memorial located in the capital of India." },
  //       { text: "Mumbai", correct: false, hint: "" },
  //       { text: "Hyderabad", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 7,
  //     question: "Who is the founder of the political party Dravida Munnetra Kazhagam (DMK)?",
  //     answers: [
  //       { text: "C.N. Annadurai", correct: true, hint: "He was the first Chief Minister of Tamil Nadu from the DMK party." },
  //       { text: "B.M. Karunanidhi", correct: false, hint: "" },
  //       { text: "M.G. Ramachandran", correct: false, hint: "" },
  //       { text: "Jayalalitha", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 8,
  //     question: "Who was the first Indian woman to win a medal in the Olympics?",
  //     answers: [
  //       { text: "P.T. Usha", correct: false, hint: "" },
  //       { text: "Kunjarani Devi", correct: false, hint: "" },
  //       { text: "Bachendri Pal", correct: false, hint: "" },
  //       { text: "Karnam Malleswari", correct: true, hint: "She won a bronze medal in weightlifting at the 2000 Olympics." }
  //     ]
  //   },
  //   {
  //     id: 9,
  //     question: "Rolex is a company that specializes in what type of product?",
  //     answers: [
  //       { text: "Phone", correct: false, hint: "" },
  //       { text: "Watches", correct: true, hint: "Known for its precision and luxury timepieces." },
  //       { text: "Food", correct: false, hint: "" },
  //       { text: "Cosmetics", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 10,
  //     question: "When did the website `Facebook` launch?",
  //     answers: [
  //       { text: "2004", correct: true, hint: "The social media platform started from a Harvard dorm room." },
  //       { text: "2005", correct: false, hint: "" },
  //       { text: "2006", correct: false, hint: "" },
  //       { text: "2007", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 11,
  //     question: "Who played the character of Harry Potter in the movie?",
  //     answers: [
  //       { text: "Johnny Depp", correct: false, hint: "" },
  //       { text: "Leonardo Di Caprio", correct: false, hint: "" },
  //       { text: "Denzel Washington", correct: false, hint: "" },
  //       { text: "Daniel Radcliffe", correct: true, hint: "He is an English actor, known for his role as the famous wizard." }
  //     ]
  //   },
  //   {
  //     id: 12,
  //     question: "Which city is known as the Pink City in India?",
  //     answers: [
  //       { text: "Bangalore", correct: false, hint: "" },
  //       { text: "Mysore", correct: false, hint: "" },
  //       { text: "Jaipur", correct: true, hint: "The city was painted pink to welcome the Prince of Wales in 1853." },
  //       { text: "Kochi", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 13,
  //     question: "When is the National Hindi Diwas celebrated?",
  //     answers: [
  //       { text: "13 September", correct: false, hint: "" },
  //       { text: "14 September", correct: true, hint: "This day was chosen because Hindi was adopted as the official language of India." },
  //       { text: "14 July", correct: false, hint: "" },
  //       { text: "13 July", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 14,
  //     question: "Where is India Gate located?",
  //     answers: [
  //       { text: "Agra", correct: false, hint: "" },
  //       { text: "New Delhi", correct: true, hint: "It stands as a symbol of sacrifice for the soldiers of the British Indian Army." },
  //       { text: "Mumbai", correct: false, hint: "" },
  //       { text: "Hyderabad", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 15,
  //     question: "Who is the founder of the political party Dravida Munnetra Kazhagam (DMK)?",
  //     answers: [
  //       { text: "C.N. Annadurai", correct: true, hint: "He was known as the 'Leader of the Tamil Nadu' and founded DMK in 1949." },
  //       { text: "B.M. Karunanidhi", correct: false, hint: "" },
  //       { text: "M.G. Ramachandran", correct: false, hint: "" },
  //       { text: "Jayalalitha", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 16,
  //     question: "Who was the first Indian woman to win a medal in the Olympics?",
  //     answers: [
  //       { text: "P.T. Usha", correct: false, hint: "" },
  //       { text: "Kunjarani Devi", correct: false, hint: "" },
  //       { text: "Bachendri Pal", correct: false, hint: "" },
  //       { text: "Karnam Malleswari", correct: true, hint: "She won a bronze medal in weightlifting at the 2000 Olympics." }
  //     ]
  //   },
  //   {
  //     id: 17,
  //     question: "What is the capital of Australia?",
  //     answers: [
  //       { text: "Sydney", correct: false, hint: "" },
  //       { text: "Melbourne", correct: false, hint: "" },
  //       { text: "Canberra", correct: true, hint: "This city is specifically chosen as the capital of Australia." },
  //       { text: "Brisbane", correct: false, hint: "" }
  //     ]
  //   },
  //   {
  //     id: 18,
  //     question: "What is the chemical symbol for gold?",
  //     answers: [
  //       { text: "Au", correct: true, hint: "The symbol comes from the Latin word 'Aurum'." },
  //       { text: "Ag", correct: false, hint: "" },
  //       { text: "Pb", correct: false, hint: "" },
  //       { text: "Fe", correct: false, hint: "" }
  //     ]
  //   }
  // ],
      moneyPyramid: [
        { id: 1, amount: "Rs 1000" },
        { id: 2, amount: "Rs 2000" },
        { id: 3, amount: "Rs 3000" },
        { id: 4, amount: "Rs 5000" },
        { id: 5, amount: "Rs 10000" },
        { id: 6, amount: "Rs 20000" },
        { id: 7, amount: "Rs 40000" },
        { id: 8, amount: "Rs 80000" },
        { id: 9, amount: "Rs 160000" },
        { id: 10, amount: "Rs 320000" },
        { id: 11, amount: "Rs 640000" },
        { id: 12, amount: "Rs 1250000" },
        { id: 13, amount: "Rs 2500000" },
        { id: 14, amount: "Rs 5000000" },
        { id: 15, amount: "Rs 10000000" },
        { id: 16, amount: "Rs 50000000" },
        // { id: 17, amount: "Rs 70000000"},
      ].reverse(),
      isButtonClicked: false,
      isNewButtonClicked: false,
      isHintButtonClicked: false,
      showHintModal: false,
      hintText: '',
      questionsData: [],
      data : [],
      showClaimForm: false,
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
  created() {
      this.fetchQuestionsData();  
  },
  methods: {
    async fetchQuestionsData(){
        try {
      // const response = await fetch("/questions.txt"); // Path relative to the public folder
      // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      // const textData = await response.text();

     // const response = await fetch("https://res.cloudinary.com/dzoaewmgu/raw/upload/v1736250594/wzv2jocum9iqewt9oxep.txt")
     const response = await fetch("https://res.cloudinary.com/dzoaewmgu/raw/upload/v1736956260/wbcghuithuddrwerrw.txt");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const textData = await response.text();
      this.questionsData = JSON.parse(textData);
      const shuffledQuestions = this.questionsData.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffledQuestions.slice(0, 18);
      this.data = JSON.parse(JSON.stringify(selectedQuestions));
    } catch (error) {
      console.error("Failed to load questions:", error);
      this.error = "Failed to load questions. Please try again later.";
    }
      },
    updateQuestionNumber(nextNumber) {
      if (nextNumber > this.moneyPyramid.length) {
            this.triggerWinnerModal();
        } else {
            this.questionNumber = nextNumber;
        }
    },
    pauseWarningAudio() {
      this.warningAudio.pause();
    // console.log("Audio paused:", this.warningAudio.paused);  // Should log 'true'
      this.warningAudio.currentTime = 0;
    // console.log("Audio currentTime:", this.warningAudio.currentTime);
    },
    triggerWinnerModal() {
        const adjustedIndex = this.questionNumber - 1; 
        this.resultMessage = '🎉 Congratulations! 🎉';
        this.earned = this.moneyPyramid.find(item => item.id === adjustedIndex)?.amount || "Rs. 0";
        this.showWinnerModal = true;     
        this.showConfetti = true;

      setTimeout(() => {
        this.showConfetti = false;
      }, 5000); // Confetti lasts for 5 seconds
    },
    restartGame() {
      this.questionNumber = 1;
      this.showWinnerModal = false;
      this.showConfetti = false;
      setTimeout(() => {
        this.$router.push("/game/quiz/start")
      }, 500);
    },
    handleTimeOut() {
      this.isGameOverVariable = true;
      this.timeOut = true;
      const adjustedIndex = this.questionNumber - 2;
      const reversedPyramid = this.moneyPyramid.slice().reverse();
      if (adjustedIndex >= 0 && adjustedIndex < this.moneyPyramid.length) {
         this.earned = reversedPyramid[adjustedIndex].amount;
          } else {
            this.earned = "Rs. 0";
          }
      const duration = 5 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 5,
          angle: Math.random() * 360,
          spread: 45,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2
          },
          colors: ['#ff0', '#f00', '#00f', '#0f0']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    },
    closeModal() {
      
      // const correctAudio = new Audio(correctSound); 
      // const wrongAudio = new Audio(wrongSound)
      this.timeOut = false;
      this.showWinnerModal = false;
      this.pauseWarningAudio();
      // correctAudio.pause(); // Pause the audio
      // correctAudio.currentTime = 0;
      // wrongAudio.pause(); // Pause the audio
      // wrongAudio.currentTime = 0;
      this.questionNumber = 1;
      this.earned = "Rs. 0";
      setTimeout(() => {
        this.$router.push("/")
      }, 500);
    },
      handleQuit() {
      this.showQuitModal = true; // Show the quit confirmation modal
    },
    confirmQuit() {
      this.showQuitModal = false;
      // warningAudio.pause(); // Pause the audio
      // warningAudio.currentTime = 0;
      this.handleTimeOut();
      // this.$router.push("/quiz/start")
    },
    cancelQuit() {
      this.showQuitModal = false; 
    },
    handleRemoveTwoOptions() {
    if (this.isButtonClicked) return;

    const currentQuestion = this.data[this.questionNumber - 1];
    const falseAnswers = currentQuestion.answers.filter(answer => !answer.correct);
    const randomFalseAnswers = falseAnswers.sort(() => Math.random() - 0.5).slice(0, 2);

    randomFalseAnswers.forEach(answer => {
      answer.text = ''; 
      answer.disabled = true;
    });
    this.isButtonClicked = true;
    },
    // handleChangeQuestion() {
    //   if (this.isNewButtonClicked) return;
      
    //     if (!this.askedQuestions) {
    //       this.askedQuestions = [];
    //     }
    //     const unaskedQuestions = this.data.filter((_, index) => !this.askedQuestions.includes(index));
    //     const unaskedQuestionsData = JSON.parse(JSON.stringify(unaskedQuestions));
  
    //     if (unaskedQuestionsData.length > 0) {
    //       const randomIndex = Math.floor(Math.random() * unaskedQuestionsData.length);
    //       const selectedQuestion = unaskedQuestionsData[randomIndex];
    //       const selectedIndex = this.data.findIndex(question => question.id === selectedQuestion.id);
    
    //       // const selectedIndex = this.data.indexOf(selectedQuestion);
    //       if (selectedIndex !== -1) {
    //           this.questionNumber = selectedIndex + 1; 
    //           // Mark the question as asked
    //           this.askedQuestions.push(selectedIndex);
    //           console.log(this.currentMoneyIndex)

    //           if (this.currentMoneyIndex === undefined) {
    //             this.currentMoneyIndex = 0; // Start at 0
    //           }
    //           this.currentMoneyIndex++; // Increment by 1
    //           console.log("Current Money Level:", this.currentMoneyIndex);

    //           // Use currentMoneyIndex to update the UI related to moneyPyramids
    //           this.moneyPyramidsLevel = this.currentMoneyIndex;

    //           // Disable the button after it's clicked
    //           this.isNewButtonClicked = true;

    //           // Ensure the UI updates by triggering a reactive change
    //           this.$forceUpdate();  // Force a re-render to update the UI
    //   } else {
    //     console.error("Invalid index selected");
    //   }
    //   } else {
    //     console.log('No more unasked questions!');
    //     alert('No more questions available!');
    //   }
    // },
    handleChangeQuestion() {
        if (this.isNewButtonClicked) return; // Prevent multiple clicks

        if (!this.askedQuestions) {
          this.askedQuestions = []; // Initialize skipped questions array
        }

        console.log("Current Question Data:", this.data);
        console.log("Skipped Questions:", this.askedQuestions);

        // Filter out already asked or skipped questions
        const availableQuestions = this.data.filter((_, index) =>
          !this.askedQuestions.includes(index) && !this.askedQuestions.includes(index)
        );
        console.log("Available Questions (Unasked and Unskipped):", availableQuestions);

  if (availableQuestions.length > 0) {
    // Select a random question from the available ones
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    console.log("Selected Question Data:", selectedQuestion);

    // Find the index of the selected question using a unique identifier
    const selectedIndex = this.data.findIndex(question => question.id === selectedQuestion.id);
    console.log("Selected Question Index:", selectedIndex);

    if (selectedIndex !== -1) {
      this.questionNumber = selectedIndex + 1; // Ensure it's 1-based
      console.log("Updated Question Number:", this.questionNumber);

      // Mark the question as skipped
      this.askedQuestions.push(selectedIndex);

      // Keep the money level unchanged
      console.log("Skipping question without affecting money level");

      // Disable the skip button to avoid multiple skips at once
      this.isNewButtonClicked = true;

      // Ensure the UI updates by triggering a reactive change
      this.$forceUpdate(); // Force a re-render to update the UI
    } else {
      console.error("Invalid index selected");
    }
  } else {
    console.log("No more available questions!");
    alert("No more questions available to skip!");
  }
},
    handleShowHint() {
          if (this.isHintButtonClicked) return;

          const currentQuestion = this.data[this.questionNumber - 1];
          const correctAnswer = currentQuestion.answers.find(answer => answer.correct === true);
          this.hintText = correctAnswer.hint;
          this.showHintModal = true;
          this.isHintButtonClicked = true;
          setTimeout(() => {
            this.closeNewModal();
          }, 10000);
        },
    closeNewModal() {
      this.showHintModal = false;
    },
    openPrizeClaimForm() {
      this.showClaimForm = true;
      this.showWinnerModal = false;
    },
    closeClaimForm() {
      this.showClaimForm = false;
       this.closeModal();
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
      this.resultMessage = "🎉 Bumper Prize Confirmed! 🎉";
     // this.resultMessage = "You will receive your bumper prize within the next 10 working days.";
      this.showWinnerModal = true;
      this.showClaimButton = false;
    },
    },
};
</script>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-spin-slow {
  animation: spin 4s linear infinite;
}

@keyframes glow {
  0%, 100% {
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6);
  }
  50% {
    text-shadow: 0 0 12px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 255, 255, 0.8);
  }
}
.animate-glow {
  animation: glow 2s infinite ease-in-out;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
.animate-bounce-in {
  animation: bounce-in 0.8s ease-out;
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out;
}

.bg-yellow-400 {
  background-color: #fbbf24;
}

.cross-bar {
  text-decoration: line-through;
  opacity: 0.6;
}

.answer-box {
  height: 50px; /* Fixed height */
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto; 
}

.answer-box.disabled {
  pointer-events: none; /* Prevent clicking */
  background-color: #f0f0f0;
  color: #999;
}
</style>
