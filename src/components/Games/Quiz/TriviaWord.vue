<template>
    <div class="trivia h-full flex flex-col items-center justify-around">
        <div class="question w-4/5 text-center text-white p-4 rounded-lg border-2 border-white text-lg shadow-md mb-5">{{ question?.question }}</div>
        <div class="answers w-full flex flex-wrap justify-center">
            <div v-for="answer in question?.answers" :key="answer.text"
                :class="[
                    selectedAnswer === answer
                    ? className
                    : answer.disabled
                    ? 'answer disabled'
                    : 'answer',
                    ]"
                @click="!selectedAnswer && !answer.disabled && handleClick(answer)" >
                {{ answer.text || ' ' }}
            </div>
        </div>
    </div>
    <LoaderData v-if="isLoading" />
</template>

<script>
import playSound from "../../Games/sounds/play.mp3";
import correctSound from "../../Games/sounds/correct.mp3";
import wrongSound from "../../Games/sounds/wrong.mp3";
import LoaderData from "../../LoaderData.vue";
// import warningAudioPlay from '../../Games/sounds/warning.mp3';

export default {
  name: "TriviaWord",
  components: { LoaderData },
  props: {
    data: Array,
    questionNumber: Number,
    setTimeOut: Function,
    isGameOverVariable: Boolean,
  },
  data() {
    return {
      question: null,
      selectedAnswer: null,
      className: "answer",
      timerID: null,
      isLoading:false,
      // earnedAmount: 0,
    };
  },
  mounted() {
    this.playAudio();
    this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.question = this.data[this.questionNumber - 1];
      }, 1000); 
    
  },
  methods: {
    delay(duration, callback) {
      this.timerID = setTimeout(callback, duration);
    },
    handleClick(answer) {
      this.selectedAnswer = answer;
      this.className = "answer active";
      // const warningAudio = new Audio(warningAudioPlay);

      this.delay(1000, () => {
        this.className = answer.correct ? "answer correct" : "answer wrong";
      });

      this.delay(2000, () => {
        console.log(this.isGameOverVariable)
        if (answer.correct) {
          // warningAudio.pause(); // Pause the audio
          // warningAudio.currentTime = 0;
          this.playCorrect();
          this.delay(500, () => {
            this.setQuestionNumber();
            this.selectedAnswer = null;
          });
        } else {
          // warningAudio.pause(); // Pause the audio
          // warningAudio.currentTime = 0;
          this.playWrong();
          this.$emit("timeOut"); 
        }
      });
    },
    setQuestionNumber() {
      console.log("setQuestionNumber",this.questionNumber)
      // this.$emit("setQuestionNumber", this.questionNumber + 1);
      if (this.questionNumber < this.$props.data.length) {
            this.$emit("setQuestionNumber", this.questionNumber + 1);
        } else {
            this.$emit("timeOut"); // Emits a timeout event for consistency
        }
    },
    playAudio() {
      const audio = new Audio(playSound);
      audio.muted = true;
      audio.play()
        .then(() => (audio.muted = false))
        .catch((err) => console.error("Error preloading intro sound:", err));
    },
    playCorrect() {
      const audio = new Audio(correctSound);
      audio.play();
    },
    playWrong() {
      const audio = new Audio(wrongSound);
      audio.play();
    },
    stopTimer() {
      if (this.timerID) {
        clearTimeout(this.timerID);
      }
    },
  },
  watch: {
    questionNumber() {
      this.question = this.data[this.questionNumber - 1];
    },
  },
};
</script>

<style scoped>
.question {
  background: linear-gradient(#100241, black);
}

.answer {
  width: 45%;
  padding: 10px;
  margin: 0 5px 10px 5px;
  text-align: center;
  background: linear-gradient(#0e0124, #22074d);
  border: 1px solid white;
  border-radius: 15px;
  font-weight: 200;
  font-size: 14px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
}

.answer:hover,
.answer.active {
  background: mediumblue;
}

.answer.correct {
  animation: correct 3s ease forwards;
}

@keyframes correct {
  0%,
  22%,
  42% {
    background: mediumblue;
  }
  20%,
  40%,
  60% {
    background: linear-gradient(#0e0124, #22074d);
  }
  62%,
  100% {
    background: green;
  }
}

.answer.wrong {
  animation: wrong 3s ease forwards;
}

@keyframes wrong {
  0%,
  22%,
  42% {
    background: mediumblue;
  }
  20%,
  40%,
  60% {
    background: linear-gradient(#0e0124, #22074d);
  }
  62%,
  100% {
    background: crimson;
  }
}

.answer.disabled {
  pointer-events: none;
  background-color: #f0f0f0;
  color: #999;
  cursor: not-allowed;
}

</style>
