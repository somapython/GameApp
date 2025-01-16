<template>
  <div class="min-h-screen flex flex-col ">
    <header class="flex items-center justify-between bg-rose-800 p-4 text-white">
      <h1 class="text-2xl font-bold text-center flex-1">Level {{ level }}</h1>
    </header>

    <div class="flex flex-1 flex-col items-center p-2 md:p-4 md:flex-row">
      <div class="w-full md:w-3/4 px-4 py-2 h-[280px]">
        <h2 class="text-2xl font-bold mb-2 text-center">Puzzle for Level {{ level }}</h2>

        <div
          v-if="currentPuzzle.type === 'math'"
          class="text-center p-6 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg shadow-md"
        >
          <p class="text-xl font-bold text-blue-800 mb-4">{{ currentPuzzle.question }}</p>
          <input
            v-model="userAnswer"
            type="text"
            placeholder="Enter your answer"
            class="border p-2 rounded w-64"
          />
          <button
            @click="checkAnswer"
            class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>

        <div
          v-else-if="currentPuzzle.type === 'vocabulary'"
          class="text-center p-6 bg-gradient-to-r from-green-200 to-green-400 rounded-lg shadow-md"
        >
          <p class="text-xl font-bold text-green-800 mb-6">{{ currentPuzzle.question }}</p>
          <div class="grid grid-cols-2 gap-4">
            <button
              v-for="(option, index) in currentPuzzle.options"
              :key="index"
              @click="checkAnswer(option)"
              class="bg-white p-4 border border-green-600 rounded-lg hover:bg-green-300 transition"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <div
          v-else-if="currentPuzzle.type === 'logic'"
          class="text-center p-6 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-lg shadow-md"
        >
          <p class="text-xl font-bold text-yellow-800 mb-4">{{ currentPuzzle.question }}</p>
          <input
            v-model="userAnswer"
            type="text"
            placeholder="Your answer"
            class="border p-2 rounded w-64"
          />
          <button
            @click="checkAnswer"
            class="mt-4 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
          >
            Submit
          </button>
        </div>

        <div
          v-else-if="currentPuzzle.type === 'general knowledge'"
          class="text-center p-6 bg-gradient-to-r from-purple-200 to-purple-400 rounded-lg shadow-md"
        >
          <p class="text-xl font-bold text-purple-800 mb-4">{{ currentPuzzle.question }}</p>
          <input
            v-model="userAnswer"
            type="text"
            placeholder="Enter your answer"
            class="border p-2 rounded w-64"
          />
          <button
            @click="checkAnswer"
            class="mt-4 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition"
          >
            Submit
          </button>
        </div>

        <div v-if="currentPuzzle.type === 'memory'">
        <p class="text-xl font-bold mb-4">{{ currentPuzzle.question }}</p>
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="(card, index) in shuffledPairs"
            :key="index"
            @click="flipCard(index)"
            class="card bg-gray-300 p-2 rounded flex items-center justify-center cursor-pointer"
            :class="{'flipped': flippedCards.includes(index) || matchedPairs.includes(index)}"
          >
            <span v-if="flippedCards.includes(index) || matchedPairs.includes(index)">{{ card }}</span>
          </div>
        </div>
      </div>

      <div v-if="currentPuzzle.type === 'word unscramble'">
        <p class="text-xl font-bold mb-4">{{ currentPuzzle.question }}</p>
        <p class="text-lg mb-4">Scrambled: <strong>{{ currentPuzzle.scrambled }}</strong></p>
        <input
          v-model="userAnswer"
          type="text"
          class="border border-gray-600 rounded p-2 mb-4 mr-4"
          placeholder="Unscramble the word..."
        />
        <button @click="checkAnswer(userAnswer)" class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">
          Submit
        </button>
      </div>

      <div v-if="currentPuzzle.type === 'sequence memory'">
        <p class="text-xl font-bold mb-4">{{ currentPuzzle.question }}</p>
        <p class="text-red-600 font-bold tex-base mt-2">Time Left: {{ timerToShow }} seconds</p>
        <div v-if="!sequenceHidden">
          <p class="text-lg mb-4">
            <strong>{{ currentPuzzle.sequence.join(' ') }}</strong>
          </p>
        </div>
        <div v-if="sequenceHidden">
          <input
            v-model="userAnswer"
            type="text"
            class="border border-gray-500 rounded p-2 mb-4 mr-4"
            placeholder="Enter the sequence..."
          />
          <button @click="checkAnswer1(userAnswer)" class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
            Submit
          </button>
        </div>
    </div>


    <div v-if="currentPuzzle.type === 'word-search'">
      <p class="text-xl font-bold mb-2">Find the hidden words:</p>
      <div class="grid grid-cols-4 gap-2" :style="{ gridTemplateColumns: `repeat(${currentPuzzle.gridSize}, 1fr)` }">
        <span
          v-for="(letter, index) in currentPuzzle.grid"
          :key="index"
          class="border border-gray-300 p-1 text-center cursor-pointer"
          :class="{ 'bg-yellow-300': highlightedIndices.includes(index) }"
          @click="selectLetter(index)"
        >
          {{ letter }}
        </span>
      </div>

      <div class="mt-2">
        <p class="font-bold mb-1">Words to find:<span class="text-xs text-red-500 font-bold">*Select Single Word and Submit</span></p>
        <ul>
          <li
            v-for="(word, wordIndex) in currentPuzzle.words"
            :key="wordIndex"
            :class="{ 'line-through text-gray-500': foundWords.includes(word) }"
          >
            {{ word }}
          </li>
        </ul>
      </div>

    <div class="mt-2">
      <button @click="submitWord" class="bg-blue-500 text-white px-2 py-1 rounded-lg text-base"
        :disabled="selectedIndices.length === 0" >
        Submit Word
      </button>
    </div>
  </div>

    <!-- <div v-if="currentPuzzle.type === 'drag-drop'" class="puzzle-drag-drop">
      <p class="text-xl font-bold mb-4">{{ currentPuzzle.question }}</p>
      <div class="drop-area flex gap-4">
        <div v-for="(piece, index) in shuffledPieces"
          :key="index" draggable="true" @dragstart="onDragStart(index)"
          class="draggable bg-blue-200 p-2 rounded cursor-pointer" >
          {{ piece }}
        </div>
      </div>
      <div class="drop-zone bg-gray-100 border-dashed border-2 border-gray-500 p-4 rounded mt-4"
        @dragover.prevent  @drop="onDrop" >
        <p v-if="!draggedItems.length" class="text-gray-500">Drop letters here</p>
        <div v-else class="flex gap-2">
          <span v-for="(item, idx) in draggedItems" :key="idx" class="bg-green-200 p-2 rounded" >
            {{ item }}
          </span>
        </div>
      </div>
    </div> -->
    <div v-if="currentPuzzle.type === 'drag-drop'" class="puzzle-drag-drop">
        <p class="text-xl font-bold mb-4">{{ currentPuzzle.question }}</p>
        <div class="drop-area flex gap-4">
            <div v-for="(piece, index) in shuffledPieces" :key="index"  draggable="true"
                @dragstart="onDragStart(index)" @touchstart="onTouchStart(index, $event)"
                @touchmove="onTouchMove($event)"  @touchend="onTouchEnd" class="draggable bg-blue-200 p-2 rounded cursor-pointer" >
                    {{ piece }}
            </div>
        </div>
        <div class="drop-zone bg-gray-100 border-dashed border-2 border-gray-500 p-4 rounded mt-4"
            @dragover.prevent  @drop="onDrop" @touchend="onDrop" >
            <p v-if="!draggedItems.length" class="text-gray-500">Drop letters here</p>
            <div v-else class="flex gap-2">
                <span v-for="(item, idx) in draggedItems" :key="idx" class="bg-green-200 p-2 rounded" >
                    {{ item }}
                </span>
            </div>
        </div>
    </div>

        <div v-if="currentPuzzle.type === 'image-match'" class="puzzle-image-match">
          <p class="text-xl font-bold mb-4">{{ currentPuzzle.question }}</p>
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="(image, index) in currentPuzzle.images"
              :key="index"
              class="flex flex-col items-center"
            >
              <img :src="image.src" alt="Puzzle image" class="w-12 h-12 rounded shadow" />
              <select
                v-model="selectedAnswers[index]"
                class="mt-2 border p-1 rounded"
              >
                <option value="" disabled>Choose</option>
                <option
                  v-for="option in options"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
          <button
            @click="checkImageMatchAnswer"
            class="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Submit
          </button>
        </div>
      </div>

      <aside class="w-full md:w-1/4 bg-gray-400 p-3 rounded-lg shadow-lg border border-gray-300" >
        <h2 class="text-xl font-bold mb-2">Game Info</h2>
        <p>Score: <span class="font-semibold">{{ score }}</span></p>
        <p>Level: <span class="font-semibold">{{ level }}</span></p>
        <button @click="useHint" :disabled="hints <= 0" class="mt-4 bg-green-500 text-white py-2 px-4 rounded w-full disabled:opacity-50" >
          Use Hint ({{ hints }})
        </button>
      </aside>
    </div>

    <!-- Footer Section -->
    <footer class="flex justify-between items-center bg-gray-800 text-white p-4">
      <button @click="backButton" class="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition" >
        Back
      </button>
      <button @click="goBack" class="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition" >
        Exit
      </button>
    </footer>
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" >
      <div class="bg-white rounded-lg shadow-lg max-w-md w-[80%] p-6" >
        <div class="flex justify-between items-center border-b pb-3">
          <h3 class="text-lg font-semibold text-Orange-800">Hint : </h3>
          <button class="text-gray-400 hover:text-gray-600" @click="closeModal" >
            &times;
          </button>
        </div>
        <div class="mt-1 text-blue-600 text-lg font-semibold">
          <span class="text-xl text-red-500 font-bold mr-3">The answer is : </span>{{ hint }}
        </div>
        <div class="mt-6 flex justify-end">
          <button class="px-4 py-2 mr-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300" @click="closeModal" >
            Cancel
          </button>
          <button class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"  @click="closeModal" >
            OK
          </button>
        </div>
      </div>
    </div>
    <div v-if="showWinnerModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 text-center relative w-[90%] max-w-lg">
        <div class="winner-animation mb-4">
          🎉🎊 <span class="text-3xl font-bold text-green-600 animate-bounce">Congratulations!</span> 🎊🎉
        </div>
        <p class="text-lg font-semibold mb-4">You have completed all levels! Here's your gift hamper:</p>
        <div class="gift-hamper bg-yellow-200 border-4 border-yellow-500 rounded-lg p-6 inline-block mb-4">
          🎁 A special reward just for you!
        </div>
        <button @click="closeWinnerModal" class="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 hover:bg-blue-700" >
          Claim Your Prize
        </button>
      </div>
    </div>

      <div v-if="showFormModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 relative w-[90%] max-w-lg">
          <div class="flex justify-between items-center pb-2">
              <h2 class="text-2xl font-bold mb-4 text-center">Claim Your Prize</h2>
              <button class="text-3xl text-gray-400 hover:text-gray-600" @click="closeAllModal" >
                  &times;
                </button>
            </div>
            <form @submit.prevent="submitForm">
              <div class="mb-4">
                <label for="name" class="block font-semibold">Name</label>
                <input v-model="formData.name" type="text" id="name" class="border rounded w-full p-2" required />
              </div>
              <div class="mb-4">
                <label for="mobile" class="block font-semibold">Mobile Number</label>
                <input v-model="formData.mobile" type="text" id="mobile" class="border rounded w-full p-2" required />
              </div>
              <div class="mb-4">
                <label for="address" class="block font-semibold">Address</label>
                <textarea v-model="formData.address" id="address" class="border rounded w-full p-2" required ></textarea>
              </div>
              <div class="mb-4">
                <label for="city" class="block font-semibold">City</label>
                <input v-model="formData.city" type="text" id="city" class="border rounded w-full p-2" required />
              </div>
              <div class="mb-4">
                <label for="pincode" class="block font-semibold">Pincode</label>
                <input v-model="formData.pincode" type="text" id="pincode" class="border rounded w-full p-2" required />
              </div>
              <button type="submit" class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700" >
                Submit
              </button>
            </form>
          </div>
        </div>


      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 text-center relative w-[80%] max-w-lg">
          <div class="success-animation mb-4">
            <div class="spinner mb-4 animate-spin"> 🎁 </div>
            <span class="text-2xl font-bold text-green-600">Claim Successful!</span>
          </div>
          <p class="text-lg font-semibold mb-4">
            Your gift hamper has been sent to the lucky person. Expected delivery to your address within 10 working days.
          </p>
          <button @click="closeAllModal" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700" >
            Close
          </button>
        </div>
      </div>
    <LoaderData v-if="isLoading" />
    <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
  </div>
</template>
<script>
import LoaderData from '../LoaderData.vue';
import ToasterData from '../ToasterData.vue';
import puzzleAudio from './sounds/puzzleStart.mp3';
import puzzleAudioFail from './sounds/puzzleGameOver.mp3';
import catImages from './images/puzzleImage/cat.png';
import dogImages from './images/puzzleImage/dog.png';
import lionImages from './images/puzzleImage/lion.png';
import hatImages from './images/puzzleImage/hat.png';
import batImages from './images/puzzleImage/bat.png';
import bagImages from './images/puzzleImage/bag.png';
import mobileImages from './images/puzzleImage/smartphone.png';
import swatchesImages from './images/puzzleImage/smartwatch.png';
import ipadImages from './images/puzzleImage/ipad.png';
export default {
    components: {
        LoaderData,
        ToasterData,
    },
  data() {
    return {
      toastMessage: '',
      toastType: '',
      isLoading: false,
      pieces: [], 
      time: "00:00",
      score: 0,
      hints: 3,
      level: null,
      flippedCards: [],
      matchedPairs: [],
      shuffledPairs: [],
      highlightedIndices: [], 
      selectedIndices: [], 
      foundWords: [],
      shuffledPieces: [], 
      draggedItems: [],
      draggedIndex: null,
      touchStartPos: null,
      selectedAnswers: [], 
      options: [], 
      currentPuzzle: {}, 
      userAnswer: '',
      isModalOpen: false,
      showWinnerModal: false,
      hint: '',
      timerToShow: '',
      showFormModal: false,
      showSuccessModal: false,
      formData: {
        name: '',
        mobile: '',
        address: '',
        city: '',
        pincode: ''
      },
      wrongAttempts: 0,
      puzzles: {
       1: { type: 'memory', question: 'Match the pairs.', pairs: ['A', 'B', 'C', 'A', 'B', 'C'], answer: ['A', 'B', 'C'] },
      2: { type: 'word unscramble', question: 'Unscramble the word: "LUETBAIUF"', answer: 'BEAUTIFUL' },   
      3: { type: 'sequence memory', question: 'Memorize this sequence:', sequence: ['3', '7', '1', '9', '4'], timeToShow: 5000,answer:'37194' },    
        4: { type: 'word-search', question: 'Find these words: [BOLT, HAT, FISH]', grid: [
          'B', 'O', 'L', 'T',
          'H', 'A', 'T', 'Y',
          'F', 'I', 'S', 'H',
        ], answer: ['BOLT', 'HAT', 'FISH'] },
        5: { type: 'logic', question: 'What has to be broken before you can use it?', answer: 'egg' },
        // 6: { type: 'drag-drop', question: 'Rearrange the letters to form the word.', pieces: ['L', 'P', 'A', 'E', 'P'], answer: 'APPLE'},
        6: { type: 'image-match', question: 'Match the animals to their names.',images: [
            { src: catImages, name: 'Cat' },
            { src: dogImages, name: 'Dog' },
            { src: lionImages, name: 'Lion' }],
            answer: ['Cat', 'Dog', 'Lion']},
         7: { type: 'word unscramble', question: 'Unscramble the word: "ETUSTITNI"', answer: 'INSTITUTE' },
         8: { type: 'sequence memory', question: 'Memorize this sequence:', sequence: ['5', '9', '2', '4', '4'], timeToShow: 5000,answer:'59244' },
         9: { type: 'memory', question: 'Match the pairs.', pairs: ['GG', 'HH', 'II', 'GG', 'HH', 'II'], answer: ['GG', 'HH', 'II'] },
         //11: { type: 'drag-drop', question: 'Rearrange the letters to form the word.', pieces: ['S', 'C', 'H', 'S','E'], answer: 'CHESS'},
        10: { type: 'sequence memory', question: 'Memorize this sequence:', sequence: ['8', '7', '7', '4', '1'], timeToShow: 5000,answer:'87741' },
        11: { type: 'word unscramble', question: 'Unscramble the word: "ESATOFWR"', answer: 'SOFTWARE' },
        12: { type: 'image-match', question: 'Match the animals to their names.',images: [
            { src: hatImages, name: 'Hat' },
            { src: batImages, name: 'Bat' },
            { src: bagImages, name: 'Bag' }],
            answer: ['Hat', 'Bat', 'Bag']},
        13: { type: 'general knowledge', question: 'What is the largest planet in our solar system?', answer: 'Jupiter' },
        14: { type: 'vocabulary', question: 'What is the antonym of "Ancient"?', options: ['Modern', 'Old'], answer: 'Modern' },
        15: { type: 'logic', question: 'I am not alive, but I can grow. I don’t have lungs, but I need air. What am I?', answer: 'Fire' },
        16: { type: 'word-search', question: 'Find the hidden words:', grid: [
          'B', 'L', 'U', 'E', 
         'W', 'O', 'R', 'D', 
         'S', 'I', 'T', 'C'],
        answer: ['BLUE', 'WORD','SIT']},    
        17: { type: 'vocabulary', question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?', options: ['Echo', 'Shadow'], answer: 'Echo'}, 
        18: { type: 'general knowledge', question: 'What is the capital city of France?', answer: 'Paris' },  
        19: { type: 'memory', question: 'Match the pairs.', pairs: ['7', '8', '9', '7', '8', '9'], answer: ['7', '8', '9'] },
        20: { type: 'word unscramble', question: 'Unscramble the word: "AVOTEDAC"', answer: 'ADVOCATE' },
        21: { type: 'sequence memory', question: 'Memorize this sequence:', sequence: ['2', '7', '3', '4', '7'], timeToShow: 5000,answer:'27347' },
        22: { type: 'image-match', question: 'Match the animals to their names.',images: [
            { src: mobileImages, name: 'Mobile' },
            { src: swatchesImages, name: 'Watch' },
            { src: ipadImages, name: 'Ipad' },],
            answer: ['Mobile', 'Watch', 'Ipad'],},
        23: { type: 'word-search', question: 'Find these words: [DISH, RICE, DAL]', grid: [
          'D', 'I', 'S', 'H',
          'R', 'I', 'C', 'E',
          'F', 'D', 'A', 'L',
        ], answer: ['DISH', 'RICE', 'DAL'] }, 
        24: { type: 'vocabulary', question: 'What is the synonym of "Obscure"?', options: ['Clear', 'Unclear'], answer: 'Unclear' },
        25: { type: 'general knowledge', question: 'What is the smallest unit of life?', answer: 'Cell' },
        //24: { type: 'drag-drop', question: 'Rearrange the letters to form the word.', pieces: ['R', 'S', 'E', 'H', 'O'], answer: 'HORSE'}, 
       // 25: { type: 'drag-drop', question: 'Rearrange the letters to form the word.', pieces: ['O', 'N', 'G', 'M','A'], answer: 'MANGO',},
        26: { type: 'word-search', question: 'Find these words: [BIG, CUTE, LEG]', grid: [
          'C', 'B', 'I', 'G',
          'C', 'U', 'T', 'E',
          'L', 'E', 'G', 'H',
        ], answer: ['BIG', 'CUTE', 'LEG'] },
       27: { type: 'memory', question: 'Match the pairs.', pairs: ['BAT', 'CAT', 'ICE', 'BAT', 'CAT', 'ICE'], answer: ['BAT', 'CAT', 'ICE'] },
       28: { type: 'general knowledge', question: 'Who developed the theory of relativity?', answer: 'Einstein' },
       29: { type: 'vocabulary', question: 'Select the synonym of "Happy"', options: ['Sad', 'Joyful'], answer: 'Joyful' }, 
       30: { type: 'logic', question: 'The more you take, the more you leave behind. What am I?', answer: 'Footsteps' },
       31: { type: 'vocabulary', question: 'You are in a dark room with a single match. What do you light first?', options: ['Candle', 'The Match'], answer: 'The Match' },
        // 31: { type: 'drag-drop', question: 'Rearrange the letters to form the word.', pieces: ['F', 'O', 'L', 'G'], answer: 'GOLF'},  
        32: {type: 'word-search', question: 'Find these words: [APPLE, ORANGE, BANANA]',grid: [
        'B', 'E', 'A', 'R',
        'L', 'I', 'M', 'E',
        'P', 'E', 'A', 'R',
      ],answer: ['BEAR', 'LIME', 'PEAR']},
        // 32: { type: 'vocabulary', question: 'What is the synonym of "Obscure"?', options: ['Clear', 'Unclear'], answer: 'Unclear' },
        // 33: { type: 'math', question: 'What is 5 + 3?', answer: '8' },
        // 34: { type: 'math', question: 'What is 15% of 200?', answer: '30' },
        // 35: { type: 'general knowledge', question: 'What is the smallest unit of life?', answer: 'Cell' },
        // 36: { type: 'logic', question: 'I am heavy forward, but backward I’m not. What am I?', answer: 'A ton' },
        // 37: { type: 'math', question: 'Complete the sequence: A, B, D, G, K, ?', answer: 'P' },
        // 38: { type: 'vocabulary', question: 'What does "ubiquitous" mean?', options: ['Rare', 'Present everywhere'], answer: 'Present everywhere' },
        // 39: { type: 'math', question: 'Solve: (8 + 2) × 3 - 4', answer: '26' },
        // 40: { type: 'logic', question: 'What comes once in a minute, twice in a moment, but never in a thousand years?', answer: 'The letter "M"' },
        // 41: { type: 'general knowledge', question: 'Who wrote "Hamlet"?', answer: 'William Shakespeare' }, 
        // 42: { type: 'general knowledge', question: 'What is the capital city of France?', answer: 'Paris' },
      }
    };
  },
  mounted() {
    this.loadProgress();
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
    this.level = Number(this.$route.params.levelNo); 
    this.currentPuzzle = this.puzzles[this.level] || {};
    this.score = 0;
  
  },
  methods: {
    checkAnswer1(selectedOption) {
      console.log(selectedOption)
      const trimmedUserAnswer = this.userAnswer?.trim() || ''; 
      const correctAnswer = this.currentPuzzle.type === 'vocabulary' || this.currentPuzzle.type === 'word unscramble'
      ? this.currentPuzzle.answer : trimmedUserAnswer;

        if (!trimmedUserAnswer && this.currentPuzzle.type !== 'vocabulary' && this.currentPuzzle.type !== 'word unscramble') {
          this.showToast('Answer cannot be empty. Please try again.', 'warning');
          return;
        }

      if (correctAnswer === this.currentPuzzle.answer) {
            this.showToast('Correct answer!.', 'success');
            this.score += 10;
            this.saveProgress(this.level + 1);
            this.currentPuzzle.solved = true;
            this.level++;
            this.currentPuzzle = this.puzzles[this.level]; 
            this.$router.push({ name: 'LevelView', params: { levelNo: this.level } });
      } else {
            this.showToast('The Given answer isIncorrect. Try again...', 'danger');
            const puzzleGameOverAudio = new Audio(puzzleAudioFail);
            puzzleGameOverAudio.play();
            this.isLoading = true;
            setTimeout(() => {
              this.isLoading = false;
              this.$router.push('/game/puzzle/start');
            }, 500);
      }

      this.userAnswer = ''; 
    },
    checkAnswer(selectedOption) {
      console.log(selectedOption)
      const trimmedUserAnswer = this.userAnswer?.trim() || selectedOption.trim();
      const isSpecialType  = this.currentPuzzle.type === 'word unscramble';

      const correctAnswer = this.currentPuzzle.answer;
      if (trimmedUserAnswer === "" && isSpecialType && this.currentPuzzle.type !== 'vocabulary') {
        this.showToast('Answer cannot be empty. Please try again.', 'warning');
        return;
      }
  
      if (trimmedUserAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            this.showToast('Correct answer!.', 'success');
            this.score += 10;
            this.saveProgress(this.level + 1);
            this.currentPuzzle.solved = true;
            this.level++;
            this.currentPuzzle = this.puzzles[this.level]; 
            this.$router.push({ name: 'LevelView', params: { levelNo: this.level } });
      } else {
          this.showToast('The Given answer isIncorrect. Try again...', 'danger');
          const puzzleGameOverAudio = new Audio(puzzleAudioFail);
          puzzleGameOverAudio.play();
          this.isLoading = true;
          setTimeout(() => {
            this.isLoading = false;
            this.$router.push('/game/puzzle/start');
          }, 500);

      }

      this.userAnswer = ''; 
    },
    saveProgress(nextLevel) {
      const progress = JSON.parse(localStorage.getItem('gameProgress')) || {
        unlockedLevels: [],
        score: 0,
      };

      if (!progress.unlockedLevels.includes(nextLevel)) {
        progress.unlockedLevels.push(nextLevel);
      }

      progress.score = this.score;
      localStorage.setItem('gameProgress', JSON.stringify(progress));
    },
    loadProgress() {
      const progress = JSON.parse(localStorage.getItem('gameProgress')) || {
        unlockedLevels: [1],
        score: 0,
      };

      this.unlockedLevels = progress.unlockedLevels;
      this.score = progress.score;
      const puzzleStartAudio = new Audio(puzzleAudio);
      puzzleStartAudio.play();
    },
    flipCard(index) {
      if (this.flippedCards.length < 2 && !this.flippedCards.includes(index) && !this.matchedPairs.includes(index)) {
        this.flippedCards.push(index);

        if (this.flippedCards.length === 2) {
          const [firstIndex, secondIndex] = this.flippedCards;
          if (this.shuffledPairs[firstIndex] === this.shuffledPairs[secondIndex]) {
            this.matchedPairs.push(firstIndex, secondIndex);
            this.showToast('Match found!', 'success');

            // Check if all pairs are matched
            if (this.matchedPairs.length === this.shuffledPairs.length) {
              this.showToast('All pairs matched! Level complete.', 'success');
              this.saveProgress(this.level + 1);
              this.score += 10;
              this.currentPuzzle.solved = true;
              this.level++;
              this.shuffledPairs = [];
              this.flippedCards = [];
              this.matchedPairs = [];
              this.wrongAttempts = 0;
              this.currentPuzzle = this.puzzles[this.level]; 
              this.$router.push({ name: 'LevelView', params: { levelNo: this.level } });
            }
          } else {
            this.showToast('No match, try again.', 'danger');
            this.wrongAttempts++;
            if (this.wrongAttempts >= 7) {
              this.showToast('Too many wrong attempts. Restarting from Level 0.', 'danger');
              const puzzleGameOverAudio = new Audio(puzzleAudioFail);
            puzzleGameOverAudio.play();
            this.isLoading = true;
            setTimeout(() => {
              this.isLoading = false;
              this.$router.push('/game/puzzle/start');
            }, 500);
        }
          }
          setTimeout(() => {
            this.flippedCards = [];
          }, 1000);
        }
      }
    },
    startSequenceTimer() {
      this.sequenceHidden = false; 
      this.timerToShow = this.currentPuzzle.timeToShow/1000;
      const interval = setInterval(() => {
    if (this.timerToShow > 1) {
      this.timerToShow -= 1; 
    } else {
      clearInterval(interval); 
      this.timerToShow = 0; 
    }
  }, 1000); 
     setTimeout(() => { 
        this.sequenceHidden = true; 
        this.$forceUpdate();
      }, this.currentPuzzle.timeToShow);
  },
    loadMemoryPuzzle() {
      const pairs = this.currentPuzzle.pairs;
      this.shuffledPairs = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
    },
    selectLetter(index) {
    if (!this.selectedIndices.includes(index)) {
      this.selectedIndices.push(index);
      this.highlightedIndices.push(index);
    }
  },
  submitWord() {
    const selectedWord = this.selectedIndices.map((index) => this.currentPuzzle.grid[index]).join('');
   
    if (this.currentPuzzle.answer.includes(selectedWord)) {
      this.foundWords.push(selectedWord);
      this.showToast(`${selectedWord} found!`, 'success');
      this.clearSelection();
    } else {
      this.showToast('Incorrect word. Try again.', 'danger');
      this.clearSelection();
      const puzzleGameOverAudio = new Audio(puzzleAudioFail);
        puzzleGameOverAudio.play();
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.$router.push('/game/puzzle/start');
        }, 500);
    }

    if (this.foundWords.length === this.currentPuzzle.answer.length) {
      this.showToast('All words found! Level complete.', 'success');
      this.saveProgress(this.level + 1);
      this.level++;
      this.foundWords = [];
      this.score += 10;
      this.currentPuzzle.solved = true;

      if (this.level === 33) {
            this.showWinnerModal = true; // Open modal
        } else {
            this.currentPuzzle = this.puzzles[this.level];
            this.$router.push({ name: 'LevelView', params: { levelNo: this.level } });
        }
      // this.currentPuzzle = this.puzzles[this.level]; 
      // this.$router.push({ name: 'LevelView', params: { levelNo: this.level } });
    }
  },
  clearSelection() {
    this.selectedIndices = [];
    this.highlightedIndices = [];
  },
  loadDragDropPuzzle() {
    this.shuffledPieces = [...this.currentPuzzle.pieces].sort(() => Math.random() - 0.5);
    this.draggedItems = [];
  },
  onDragStart(index) {
    this.draggedIndex = index;
  },
  onDrop() {
    if (this.draggedIndex !== null) {
      const draggedPiece = this.shuffledPieces[this.draggedIndex];
      this.draggedItems.push(draggedPiece);
      this.shuffledPieces.splice(this.draggedIndex, 1);
      this.draggedIndex = null;
      if(this.shuffledPieces.length == 0)
      { 
        if (this.draggedItems.join('') === this.currentPuzzle.answer) {
          this.showToast('Correct! You formed the word!', 'success');
          this.saveProgress(this.level + 1);
          this.level++;
          this.score += 10;
          this.currentPuzzle.solved = true;
          this.currentPuzzle = this.puzzles[this.level]; 
          this.$router.push({ name: 'LevelView', params: { levelNo: this.level } });
        }
        else{
          this.showToast('Incorrect! You formed the Incorrect word!, try again', 'danger');
          setTimeout(()=>{
            this.resetDragDropPuzzle();
          })
          const puzzleGameOverAudio = new Audio(puzzleAudioFail);
        puzzleGameOverAudio.play();
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.$router.push('/game/puzzle/start');
        }, 500);
          return
        }
      }
    }
  },
  onTouchStart(index, event) {
      this.draggedIndex = index;
      this.touchStartPos = event.touches[0];
    },
    onTouchMove(event) {
      event.preventDefault(); // Prevent scrolling while dragging
    },
    onTouchEnd(event) {
      const touchEndPos = event.changedTouches[0];
      const dropZone = document.querySelector('.drop-zone');
      const dropZoneRect = dropZone.getBoundingClientRect();

      // Check if touch ended inside the drop zone
      if (
        touchEndPos.clientX >= dropZoneRect.left &&
        touchEndPos.clientX <= dropZoneRect.right &&
        touchEndPos.clientY >= dropZoneRect.top &&
        touchEndPos.clientY <= dropZoneRect.bottom
      ) {
        this.onDrop();
      } else {
        this.draggedIndex = null; // Reset if not dropped in the zone
      }
    },
  resetDragDropPuzzle() {
    this.shuffledPieces = [...this.currentPuzzle.pieces];
    this.draggedItems = [];
    this.draggedIndex = null;
  },
  loadImageMatchPuzzle() {
    this.options = this.currentPuzzle.images.map((image) => image.name);
    this.selectedAnswers = Array(this.currentPuzzle.images.length).fill('');
  },

  checkImageMatchAnswer() {
    const isCorrect = this.selectedAnswers.every((answer, index) => answer === this.currentPuzzle.answer[index]);

    if (isCorrect) {
      this.showToast('Correct! All images matched successfully.', 'success');
      this.saveProgress(this.level + 1);
      this.level++;
      this.score += 10;
      this.currentPuzzle.solved = true;
      this.currentPuzzle = this.puzzles[this.level]; 
      this.$router.push({ name: 'LevelView', params: { levelNo: this.level } });
    } else {
      this.showToast('Incorrect. Try again!', 'danger');
      const puzzleGameOverAudio = new Audio(puzzleAudioFail);
        puzzleGameOverAudio.play();
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
          this.$router.push('/game/puzzle/start');
        }, 500);
    }
  },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = '';
      }, 3000);
    },
    useHint() {
      this.hint = '';
      if (this.hints > 0) {
        this.hints--;
        this.hint = this.currentPuzzle.answer;
        this.isModalOpen = true;
      }
    },
    closeModal() {
      this.isModalOpen = false;
    },
    closeWinnerModal(){
      this.showWinnerModal = false;
      this.showFormModal = true;
    },
    submitForm() {
      this.showFormModal = false;
      this.showSuccessModal = true;
            // Save data to CSV
      const data = [
        this.formData.name,
        this.formData.mobile,
        this.formData.address,
        this.formData.city,
        this.formData.pincode
      ].join(",");

      const blob = new Blob([data + "\n"], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // a.download = "formData.csv";
      // a.click();
      URL.revokeObjectURL(url);
    },
    closeAllModal() {
      this.showSuccessModal = false;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push('/game/puzzle');
      }, 500);
    },
    backButton() {
      this.saveProgress(this.level);
        this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push('/game/puzzle/start');
      }, 500);
        
    },
    goBack() {
      this.saveProgress(this.level);
        this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push('/');
      }, 500);
    },
  },
  watch: {
    currentPuzzle: {
      immediate: true,
      handler(newPuzzle) {
        if (newPuzzle.type === 'memory') {
        this.loadMemoryPuzzle();
      } else if (newPuzzle.type === 'sequence memory') {
        this.startSequenceTimer();
      } else if (newPuzzle.type === 'drag-drop') {
        this.loadDragDropPuzzle();
      } else if (newPuzzle.type === 'image-match') {
        this.loadImageMatchPuzzle();
      }
      },
    },
  },
};
</script>
<style scoped>
.grid {
  display: grid;
  gap: 8px;
}

.cursor-pointer {
  cursor: pointer;
}

.bg-yellow-300 {
  background-color: #fde68a;
}

.line-through {
  text-decoration: line-through;
}

.draggable {
  cursor: grab;
  background-color: #bfdbfe;
  text-align: center;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  user-select: none;
}

.drop-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  background-color: #f3f4f6;
  border: 2px dashed #9ca3af;
  transition: background-color 0.2s;
}

.drop-zone:hover {
  background-color: #e5e7eb;
}

.bg-green-200 {
  background-color: #bbf7d0;
}

/* <!--puzzle image--> */
.puzzle-image-match img {
  object-fit: cover;
  transition: transform 0.2s;
}

.puzzle-image-match img:hover {
  transform: scale(1.1);
}

.puzzle-image-match select {
  background-color: #f3f4f6;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
}

.puzzle-image-match button {
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}

.puzzle-image-match button:hover {
  background-color: #059669;
}

.winner-animation {
  animation: bounce 2s infinite;
}

.spinner {
  font-size: 2rem;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

button {
  transition: transform 0.3s;
}

button:hover {
  transform: scale(1.1);
}
</style>
