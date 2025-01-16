<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 font-sans">
        <div class="w-[90%] md:w-full max-w-sm bg-white shadow-md rounded-lg px-4 md:px-8 pt-4 md:pt-6 pb-16 md:pb-8 mb-3 md:mb-4" >
            <header class="w-full flex items-center justify-between p-2 bg-rose-800">
                <button @click="goBack">
                    <img src="../assets/Games/home.png" alt="Home" class="w-6 h-6"/>
                </button>
                <h1 class="text-xl font-bold text-center">Login</h1>
            </header>
            <form @submit.prevent="login" class="w-full mt-5">
                <div class="mb-6 relative">
                    <label class="block text-blue-700 text-base font-bold mb-2" for="mobile">Mobile Number</label>
                    <input type="tel" id="mobile" v-model="mobile" class="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                        placeholder="Enter your mobile number" pattern="\d{10}" required />
                </div>
                <div class="mb-6 relative">
                    <label class="block text-blue-700 text-base font-bold mb-2">PIN</label>
                    <div class="flex justify-between space-x-2">
                        <input v-for="(digit, index) in pin" :key="index" type="text" v-model="pin[index]"
                            :ref="'pin' + index" maxlength="1" pattern="\d" @input="handlePinInput(index)"
                            class="shadow border rounded w-1/4 py-2 px-3 text-center text-gray-700 leading-tight focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 invalid:ring-red-500" required />
                    </div>
                    <a href="#" @click.prevent="forgotPin" class="inline-block mt-4 float-right align-baseline font-semibold text-base text-blue-700 hover:underline" >
                        Forgot PIN?
                    </a>
                </div>
                <div class="flex items-center justify-between mt-14">
                    <button class="w-full bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded"
                    type="submit" >
                            Login
                    </button>   
                </div>
            </form>
            <p class="text-gray-600 float-right mt-4 text-base">Create an account? <router-link to="/signup" class="font-semibold hover:underline hover:text-blue-600">Sign Up</router-link></p>
        </div>
        <!-- Floating Animation -->
        <div class="absolute inset-x-0 bottom-24 flex justify-center space-x-4 animate-bounce">
            <div class="w-4 h-4 bg-indigo-500 rounded-full"></div>
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
        </div>
        <LoaderData v-if="isLoading" />
        <ToasterData v-if="toastMessage" :message="toastMessage" :type="toastType" />
    </div>
</template>
<script>
import LoaderData from './LoaderData.vue';
import ToasterData from './ToasterData.vue';
import axios from 'axios';
export default {
  components: {
    LoaderData,
    ToasterData
  },
  data() {
    return {
      mobile: '',
      pin: ['', '', '', ''],
      toastMessage: '',
      toastType: '',
      isLoading: false,
      postData: [],
      localStorageData: '',
    };
  },
  mounted() {
    this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
  },
  methods: {
   async login() {
        const pinValue = this.pin.join('');
        const userData = {
            mobile: this.mobile,
            pin: pinValue
        };
        if (this.mobile.length !== 10 || !/\d{10}/.test(this.mobile)) {
            this.showToast('Invalid mobile number', 'danger');
            return;
        }
        if (!/\d{4}/.test(pinValue)) {
            this.showToast('Invalid PIN', 'danger');
            return;
        }
        this.isLoading = true;
        try{
            const response = await axios.get('https://vuelogin-853da-default-rtdb.firebaseio.com/userData.json');
            this.formatPostData(response.data);
            const user = this.postData.find(user => user.mobile === userData.mobile);
            if (user) {
                if (user.pin === userData.pin) {
                    this.localStorageData = JSON.parse(localStorage.getItem('users'));
                    for(var i in this.localStorageData){
                        if(this.localStorageData[i].mobile == userData.mobile ){
                            this.localStorageData[i].isLogged = true;
                            const updatedData = JSON.stringify(this.localStorageData);
                            localStorage.setItem('users', updatedData);
                        }
                    }

                    await axios.patch(`https://vuelogin-853da-default-rtdb.firebaseio.com/userData/${user.id}.json`, {
                        isLogged: true });
                    this.showToast('User Login successful', 'success');
                    this.mobile = '';
                    this.pin = ['', '', '', '']; 
                    this.isLoading = false;
                    this.$router.push('/');
                } else {
                    this.isLoading = false;
                    this.showToast('Invalid PIN', 'danger');
                }
            } else {
                this.isLoading = false;
                this.showToast('User Does not Exist', 'danger');
            } 
        } catch(error){
            this.isLoading = false;
            this.showToast('An error occurred during login', 'danger');
           return;
        }
        finally {
        this.isLoading = false;
        }
    },
    formatPostData(data){
      this.postData=[];
      for(let key in data){
        this.postData.push({...data[key], id:key})
      }
      return this.postData;
    },
    forgotPin() {
        if (this.mobile.length !== 10 || !/\d{10}/.test(this.mobile)) {
            this.showToast('Invalid mobile number', 'danger');
            return;
        }else{
            this.isLoading = true;
            setTimeout(() => {
                this.isLoading = false;
                this.$router.push({ name: 'ForgotPin', params: { mobile: this.mobile }});
            }, 500);
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
    handlePinInput(index) {
        if (this.pin[index] && index < this.pin.length - 1) {
        this.$refs['pin' + (index + 1)][0].focus(); 
        } else if (!this.pin[index] && index > 0) {
        this.$refs['pin' + (index - 1)][0].focus(); 
        }
  },
  }
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

.font-sans {
  font-family: 'Inter', sans-serif;
}
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
