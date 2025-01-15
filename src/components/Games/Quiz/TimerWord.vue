<template>
  <div>{{ timer }}</div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted, computed} from "vue";
import warningAudioPlay from '../../Games/sounds/warning.mp3';
import failAudioPlay from '../../Games/sounds/fail.mp3';

export default {
  name: "TimerWord",
  props: {
    setTimeOut: Function,
    questionNumber: Number,
    timeOut: Boolean,
    isGameOver: Boolean,
    warningAudio: Object,
    
  },
  setup(props) {
    const timer = ref(30);
    var isAudioPlay = false;
    let interval = null;

    // const warningAudio = new Audio(warningAudioPlay); // Plays when < 10 seconds
    const failAudio = new Audio(failAudioPlay); 

    const timerDuration = computed(() => {
      if (props.questionNumber <= 10) {
        return 30;
      } else if (props.questionNumber <= 12) {
        return 45; 
      } else if (props.questionNumber <= 14) {
        return 60; 
      } else {
        return 90;
      }
    });

    const startTimer = () => {
      timer.value = timerDuration.value;
      const warningAudio = new Audio(warningAudioPlay);
      const failAudio = new Audio(failAudioPlay); 
      interval = setInterval(() => {
        if (props.timeOut) {
        timer.value = 0; // Set timer to 0 immediately when timeout is true
        clearInterval(interval);
        failAudio.play();
        return;
      }
      if (props.isGameOver) {  // If the game is over, stop the timer
          warningAudio.pause(); // Pause the audio
          warningAudio.currentTime = 0;
          clearInterval(interval);
          timer.value = 0;
          return;
        }
        if (timer.value === 0) {
          props.setTimeOut();
          failAudio.play();
          clearInterval(interval);
        } else {
          if(isAudioPlay == true){   
            if(timer.value === timerDuration.value){
              isAudioPlay = false;
            warningAudio.pause();
            warningAudio.currentTime = 0;
          }
          }
          timer.value -= 1;

          // Play warning audio when timer is less than 9 seconds
          if (timer.value === 8) {
            warningAudio.play();
            isAudioPlay = true;
          }
        }
      }, 1000);
    };

    onMounted(() => {
      startTimer();
    });

    onUnmounted(() => {
      clearInterval(interval);
    });

    watch(
      () => props.questionNumber,
      () => {
        clearInterval(interval);
        timer.value = 30;
        startTimer();
      }
    );
    watch(
    () => props.timeOut,
    (newVal) => {
      if (newVal) {
        timer.value = 0; // Ensure the timer shows 0 on timeout
        clearInterval(interval);
        failAudio.play();
      }
    }
  );

    return {
      timer,
    };
  },
};
</script>

<style scoped>

</style>
