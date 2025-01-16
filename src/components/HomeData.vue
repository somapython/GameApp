<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
        <nav class="bg-rose-800 p-2 md:p-4 text-white" @click="closeDropdown">
            <div class="container mx-auto flex justify-between items-center">
                <!-- Left Side: Logo -->
                <div class="text-2xl font-bold" title="Somani Logo">
                <!-- GameApp -->
                    <img src="../assets/Home/logo2.png" alt="Logo" class="w-10 h-10" />
                </div>
                <!-- Right Side: User Info -->
                <div class="flex items-center space-x-4 relative" @click.stop :title="userName">
                    <span class="text-xs md:text-lg font-medium">
                        Welcome, {{ userName }}! <span class="text-yellow-300 bounce">&#128075;</span>
                    </span>
                    <button @click="toggleDropdown" class="flex items-center space-x-4 focus:outline-none" >
                        <img :src="userImage || userImageDefault" alt="User" class="w-10 h-10 rounded-full border-1 border-white" />
                    </button>
                </div>
                    <!-- Dropdown Menu --> 
                <div v-if="isDropdownOpen && isLoggedIn" class="absolute right-0 mt-32 w-36 md:w-48 bg-white text-black rounded-lg shadow-lg z-10" >
                    <ul class="py-2">
                        <li>
                            <a href="#" class="block text-sm md:text-lg px-4 py-2 hover:bg-gray-200" @click="openUpdateModal" >
                                Update User
                            </a>
                        </li>
                        <li>
                            <a href="#" class="block  text-sm md:text-lg px-4 py-2 hover:bg-gray-200" @click="logout" >
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>  
            </div>

            <!-- Update User Modal -->
            <transition name="dropdown">
                <div v-if="isUpdateModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div class="bg-white p-6 rounded-lg w-[90%] md:w-96">
                        <h2 class="text-xl font-bold mb-4 text-slate-600">Update User</h2>
                        <form @submit.prevent="submitUpdate">
                            <div class="mb-4">
                                <label for="userImage" class="block text-sm font-medium text-gray-700">Upload Profile Picture</label>
                                <input type="file" id="userImage" class="mt-1 block w-full border rounded-md shadow-sm focus:ring focus:ring-blue-500"  @change="previewImage"/>
                                <img v-if="previewedImage" :src="previewedImage" alt="Preview" class="mt-4 w-20 h-20 rounded-full border" />
                            </div>
                            <div class="flex justify-end space-x-4">
                                <button type="button" @click="closeUpdateModal" class="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            </transition>
        </nav>
        <div class="flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 px-0 md:px-4 text-white">
            <div class="text-center py-4 px-3 md:px-6">
                <h1 class="text-2xl sm:text-5xl font-bold text-white mb-2 md:mb-4 animate-fadeInDown" title="Welcome to GameApp!">
                    <span class="spin-icon">🎮</span> Welcome to <span class="text-violet-900">GameApp!</span>
                </h1>
                <p class="text-sm sm:text-lg text-blue-100 mb-4 md:mb-8 animate-fadeInUp">
                    Your ultimate destination for fun and excitement. Play, compete, and win amazing prizes.
                </p>
                <div v-if="!isLoggedIn" class="flex space-x-4 justify-center">
                    <router-link to="/signup"
                    class="px-6 py-2 bg-yellow-400 text-blue-900 rounded-full hover:bg-yellow-500 active:scale-95 transform transition duration-300 block text-center shadow-md"  title="SignUp" >
                        Sign Up 🚀
                    </router-link>
                    <router-link to="/login"
                    class="px-6 py-2 bg-cyan-400 text-white rounded-full hover:bg-blue-900 active:scale-95 transform transition duration-300 block text-center shadow-md"  title="Login">
                        Login 🔒
                    </router-link>
                    <!-- <button class="bg-gray-300" @click="clearStorage"> clear</button> -->
                </div>
                <div v-else class="flex justify-center space-x-4 animate-fadeIn">
                    <div class="bg-gradient-to-br from-yellow-500 to-orange-700 text-cyan-400 rounded-full px-1 py-2 shadow-lg w-[90%] text-center" title="Win an Exciting Prize!">
                        <span class="text-base md:text-2xl font-bold text-center flashAnimate"> <span class="spin-icon"> 🏆 </span>  Win an Exciting Prize!  <span class="spin-icon"> 🎉 </span></span>  
                    </div>
                </div>
            </div>

            <div class="mt-3 md:mt-16 w-full">
                <h2 class="text-2xl md:text-3xl font-bold text-red-700 mb-2 md:mb-6 text-center animate-fadeInUp" title="Explore Our Games">
                    <span class="spin-icon"> 🎲 </span> Explore Our Games <span class="spin-icon">  💰 </span>
                </h2>
                <div class="relative">
                    <div class="carousel-container relative overflow-hidden w-full">
                        <!-- Carousel Container -->
                        <div class="carousel flex transition-transform duration-500 ease-in-out" :style="`transform: translateX(-${currentIndex * 100}%);`" >
                            <div v-for="(game, index) in games" :key="index" class="card w-full p-4" >
                                <div class=" rounded-lg shadow-md p-4 flex flex-col items-center"  :style="{ background: `linear-gradient(to right, ${game.colors[0]}, ${game.colors[1]})` }">
                                    <img :src="game.image" :alt="game.name" :title="game.name" class="w-32 h-32 object-contain mb-4 md:mb-4" />
                                    <h3 class="text-lg font-bold mb-4 text-gray-800" :title="game.name">
                                        <span class="spin-icon"> {{ game.icon }} </span> {{ game.name }}
                                    </h3>
                                    <p class="text-sm text-gray-600 mb-4 text-center" :title="game.description" > {{ game.description }} </p>
                                    <router-link :to="game.link" class="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-95 transform transition duration-300 shadow-md" title="play" >
                                        Play ▶️
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <button class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-1 md:p-2 rounded-full opacity-30 hover:opacity-80 transition duration-300" @click="prevSlide" title="previous">
                            &lt;
                        </button>
                        <button class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-1 md:p-2 rounded-full opacity-30 hover:opacity-80 transition duration-300" @click="nextSlide" title="next">
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
            <LoaderData v-if="isLoading" />
            <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
        </div>
    </div>
</template>
<script>
import LoaderData from './LoaderData.vue';
import ToasterData from './ToasterData.vue';
import axios from 'axios';
import userImageDefault from '../assets/Home/user.png';
import quizImage from '../assets/Home/quiz.png';
import puzzleImage from '../assets/Home/puzzle.png';
import ludoImage from '../assets/Home/ludo.png';
import snakeImage from '../assets/Home/snake.png';
import candyImage from '../assets/Home/candy.png';
import doodleImage from '../assets/Home/doodle.png';
import blackjackImage from '../assets/Home/blackjack.png';
import breakoutImage from '../assets/Home/breakout.png';
export default {
  name: "HomeData",
  components: {
    LoaderData,
    ToasterData
  },
  data() {
    return {
      games: [
        {
          name: "KBC Quiz",
          icon: "❓",
          description: "Test your knowledge and become a champion!",
          image: quizImage,
          link: "/game/quiz",
          colors: ["#ff9a9e", "#fad0c4"],
        },
        {
          name: "Ludo",
          icon: "🎲",
          description: "Play the classic Ludo with friends!",
          image: ludoImage,
          link: "/game/ludo",
          colors: ["#a1c4fd", "#c2e9fb"],
        },
        {
          name: "Snake Ladder",
          icon: "🐍",
          description: "Roll the dice and race to the finish!",
          image: snakeImage,
          link: "/game/snake_ladder",
          colors: ["#fbc2eb", "#a6c1ee"],
        },
        {
          name: "Puzzle Game",
          icon: "🧩",
          description: "Challenge yourself with fun puzzles!",
          image: puzzleImage,
          link: "/game/puzzle",
          colors: ["#ff9a8b", "#ff6a88"],
        },
        // {
        //   name: "Candy Crush",
        //   icon: "🍬",
        //   description: "Match candies to clear levels!",
        //   image: candyImage,
        //   link: "/game/candy",
        //   colors: ["#00c6ff", "#0072ff"],
        // },
        {
          name: "Doodle Jump",
          icon: "🎨",
          description: "Jump higher and set records!",
          image: doodleImage,
          link: "/game/doodle",
          colors: ["#c6ffdd", "#fbd786"],
        },
        {
          name: "Black Jack",
          icon: "🃏",
          description: "Try your luck and win big in Black Jack!",
          image: blackjackImage,
          link: "/game/jack",
          colors: ["#f4d03f", "#16a085"],
        },
        // {
        //   name: "Pong Master",
        //   icon: "🏓",
        //   description: "Master the art of Pong!",
        //   image: puzzleImage,
        //   link: "/game/pong",
        //   colors: ["#8e44ad", "#3498db"],
        // },
        // {
        //   name: "MineSweeper",
        //   icon: "💣",
        //   description: "Uncover tiles and avoid the mines!",
        //   image: puzzleImage,
        //   link: "/game/minesweeper",
        //   // colors: ["#ff6e7f", "#bfe9ff"],
        //   colors: ["#6a11cb", "#2575fc"],
        // },
        {
          name: "Breakout",
          icon: "🧱",
          description: "Break the bricks and clear the stage!",
          image: breakoutImage,
          link: "/game/breakout",
          colors: ["#ff6e7f", "#bfe9ff"],
        },
      ],
      currentIndex: 0,
      isDropdownOpen: false,
      isUpdateModalOpen: false,
      userImage: '',
      previewedImage: null,
      userImageDefault,
      toastMessage: '',
      toastType: '',
      isLoading: false,
      postData: [],
      userId: '',
      localStorageData: '',
      isLoggedIn : false,
      userName: 'User',
    };
  },
  computed: {
    totalSlides() {
      return this.games.length;
    },
  },
  mounted() {
    document.addEventListener("click", this.closeDropdown);
    this.isLoading = true;
    this.fetchUserData();
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdown);
  },
  methods: {
    // clearStorage(){
    //   localStorage.clear();
    //   this.showToast('localStorage cleared successfully', 'success');
    // },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeDropdown() {
      if (this.isDropdownOpen) {
        this.isDropdownOpen = false;
      }
    },
    openUpdateModal() {
      this.isUpdateModalOpen = true;
      this.isDropdownOpen = false;
    },
    closeUpdateModal() {
      this.isUpdateModalOpen = false;
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.previewedImage = URL.createObjectURL(file);
      }
    },
    async fetchUserData() {
        try {
            const responseNew = await axios.get('https://vuelogin-853da-default-rtdb.firebaseio.com/userData.json');
            this.formatPostData(responseNew.data);
            this.localStorageData = JSON.parse(localStorage.getItem('users')) || [];

            if(this.localStorageData.length > 0)
            {
              for(var i in this.postData){
                for(var j in this.localStorageData){
                    if(this.postData[i].tokenId == this.localStorageData[j].tokenId){
                        this.isLoggedIn =  this.localStorageData[j].isLogged;
                    }

                    if(this.isLoggedIn){
                        this.userId = this.postData[i].id; 
                        this.userName = this.postData[i].name || 'User';
                        const response = await axios.get(`https://vuelogin-853da-default-rtdb.firebaseio.com/userData/${this.userId}.json`);
                        if (response.data && response.data.profilePicture) {
                            this.userImage = response.data.profilePicture;
                        } else {
                            console.warn('No profile image found, using default image.');
                            this.userImage = this.userImageDefault;
                        }
                    }
                }
            }
            }
           
        }catch(err){
            console.warn(err);
        } 
    },
    async submitUpdate() {
        const responseNew = await axios.get('https://vuelogin-853da-default-rtdb.firebaseio.com/userData.json');
            this.formatPostData(responseNew.data);
            this.localStorageData = JSON.parse(localStorage.getItem('users'));
            for(var i in this.localStorageData){
                for(var j in this.postData){
                    if(this.localStorageData[i].tokenId == this.postData[j].tokenId){
                        this.localStorageData[i].profilePicture = this.previewedImage;
                        this.userId = this.postData[i].id; 
                        const updatedData = JSON.stringify(this.localStorageData);
                        localStorage.setItem('users', updatedData);
                        this.userImage = this.previewedImage;
                    }
                }   
            }
          const response =   await axios.patch(`https://vuelogin-853da-default-rtdb.firebaseio.com/userData/${this.userId}.json`,
            { profilePicture: this.previewedImage } );

            if (response.data && response.data.profilePicture) {
                this.userImage = response.data.profilePicture;
                this.showToast(`User ${response.data.name} updated successfully!`,'success');
            } else {
                console.warn('No profile image found, using default image.');
                this.userImage = this.userImageDefault;
            }
        this.closeUpdateModal();
    },

    formatPostData(data){
      this.postData = [];
      for(let key in data){
        this.postData.push({...data[key], id:key})
      }
      return this.postData;
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = '';
      }, 3000);
    },
    async logout() {
        this.isLoading = true;
        try {
            const responseNew = await axios.get('https://vuelogin-853da-default-rtdb.firebaseio.com/userData.json');
            this.formatPostData(responseNew.data);
            this.localStorageData = JSON.parse(localStorage.getItem('users'));
            for(var i in this.localStorageData){
                for(var j in this.postData){
                    if(this.localStorageData[i].tokenId == this.postData[j].tokenId){
                        this.localStorageData[i].isLogged = false;
                        this.userId = this.postData[i].id; 
                        this.userName = 'User';
                        const updatedData = JSON.stringify(this.localStorageData);
                        localStorage.setItem('users', updatedData);
                        this.isLoggedIn = false;
                    }
                }   
            }
            const response =   await axios.patch(`https://vuelogin-853da-default-rtdb.firebaseio.com/userData/${this.userId}.json`,
                { isLogged: false });
              if (response.data && response.data.profilePicture) {
                  this.userImage = this.userImageDefault;
                } else {
                  console.warn('No profile image found, using default image.');
                  this.userImage = this.userImageDefault;
                }
            this.isLoading = false;
            this.$router.push('/'); 
        } catch (error) {
            console.error('Error logging out:', error);
            this.showToast('Logout failed. Please try again.', 'error');
        }
    },
  },
};
</script>
<style scoped>
.carousel-container {
  width: 100%;
  max-width: 600px;
  margin: auto;
}
.carousel {
  display: flex;
  width: 100%;
}
.card {
  flex: 0 0 100%;
  transition: background 0.5s ease-in-out;
}
button {
  backdrop-filter: blur(5px);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spin-icon {
  display: inline-block;
  animation: spin-slow 2s linear infinite, colorChange 4s ease infinite;
}

@keyframes wiggle{
    0% {
        transform: rotate(-5deg);
    }
    50%{
        transform: rotate(5deg);
    }
    100%{
        transform: rotate(-5deg);
    }
}
@keyframes flash{
    0% {
        opacity: 1;
    }
    50%{
        opacity: 0.5;
    }
    100%{
        opacity: 1;
    }
}

.widdleAnimate{
    animation: wiggle 1s ease-in-out infinite;
}

.flashAnimate{
    animation: flash 2s infinite;
}
     
.animate-fadeInDown {
  animation: fadeInDown 1s ease-out;
}

.animate-fadeInUp {
  animation: fadeInUp 1s ease-out;
}

a {
  transition: color 0.3s;
}
a:hover {
  color: #ffeb3b; 
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.dropdown-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
.dropdown-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.dropdown-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.dropdown-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-10px);
  }
}

.bounce {
  display: inline-block;
  animation: bounce 1s infinite;
}


</style>
