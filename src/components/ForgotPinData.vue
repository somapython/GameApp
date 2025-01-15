<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
        <div class="w-[90%] md:w-full max-w-sm bg-white shadow-md rounded-lg px-4 md:px-8 pt-4 md:pt-6 pb-16 md:pb-8 mb-3 md:mb-4">
            <header class="w-full flex items-center justify-between p-2 bg-rose-800">
                <button @click="goBack">
                    <img src="../assets/Games/home.png" alt="Home" class="w-6 h-6"/>
                </button>
                <h1 class="text-xl font-bold text-center">Forgot PIN</h1>
            </header>
            <form @submit.prevent="resetPin" class="w-full mt-8">
                <div class="mb-6">
                    <label class="block text-blue-700 text-base font-bold mb-2" for="mobile">Mobile Number</label>
                    <input type="tel" id="mobile" v-model="mobile" class="border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:outline-none" placeholder="Enter your mobile number" disabled />
                </div>
                <div class="mb-6">
                    <label class="block text-blue-700 text-base font-bold mb-2">New PIN</label>
                    <div class="flex justify-between space-x-2">
                        <input v-for="(digit, index) in pin" :key="index" type="text" v-model="pin[index]"
                            :ref="'pin' + index" maxlength="1" pattern="\d" class="shadow border rounded w-1/4 py-2 px-3 text-center text-gray-700 leading-tight focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 invalid:ring-red-500"
                            :class="{'border-red-500': errors.pin}"  @input="handlePinInput(index)" @focus="resetError('pin')" required />
                    </div>
                    <p v-if="errors.pin" class="text-red-500 text-xs mt-2">{{ errors.pin }}</p>
                </div>
                <div class="flex items-center justify-between mt-8">
                    <button class="w-full bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" >
                        Reset PIN
                    </button>
                </div>
            </form>
        </div>
        <div class="absolute inset-x-0 bottom-32 flex justify-center space-x-4 animate-bounce">
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
    components: { LoaderData, ToasterData },
     data() {
        return {
        mobile: this.$route.params.mobile || '',
        pin: ['', '', '', ''],
        errors: {},
        toastMessage: '',
        toastType: '',
        isLoading: false,
        postData:[],
        localStorageData: '',
        };
    },
  mounted() {
    if (!this.mobile) {
      this.showToast('Mobile number is required!', 'error');
      return
    }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  },
  methods: {
    async resetPin() {
        if (!this.validateForm()) return;

        const pinValue = this.pin.join('');
        this.isLoading = true;
        try {
            const response = await axios.get('https://vuelogin-853da-default-rtdb.firebaseio.com/userData.json');
            this.formatPostData(response.data);
            const user = this.postData.find(user => user.mobile === this.mobile);
            if (!response.data) {
                this.showToast('User Does not exists.', 'error');
                return;
            }

            this.localStorageData = JSON.parse(localStorage.getItem('users'));
            for(var i in this.localStorageData){
                    if(this.localStorageData[i].mobile == this.mobile){
                        this.localStorageData[i].pin = pinValue;
                        const updatedData = JSON.stringify(this.localStorageData);
                        localStorage.setItem('users', updatedData);
                    } 
            }
            await axios.patch(`https://vuelogin-853da-default-rtdb.firebaseio.com/userData/${user.id}.json`,
                { pin: pinValue }  );
                this.isLoading = false;  
                setTimeout(()=>{
                    this.$router.push('/login');
                },500)
            this.showToast('PIN reset successful', 'success');
        } catch (error) {
            console.error('Error updating PIN:', error);
            this.showToast('Failed to reset PIN. Please try again.', 'error');
        } finally {
            this.isLoading = false;
            this.resetForm();
        }
    },
    formatPostData(data){
      this.postData=[];
      for(let key in data){
        this.postData.push({...data[key], id:key})
      }
      return this.postData;
    },
    resetForm() {
        this.mobile = '';
        this.pin = ['', '', '', ''];
    },
    validateForm() {
      this.errors = {};
      if (this.pin.some((digit) => digit === '')) {
        this.errors.pin = 'Please enter all 4 digits of the new PIN';
      }

      return Object.keys(this.errors).length === 0;
    },
    handlePinInput(index) {
        if (this.pin[index] && index < this.pin.length - 1) {
            this.$refs['pin' + (index + 1)][0].focus(); 
        } else if (!this.pin[index] && index > 0) {
            this.$refs['pin' + (index - 1)][0].focus(); 
        }
    },
    resetError(field) {
      this.errors[field] = '';
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
      setTimeout(() => {
        this.toastMessage = '';
      }, 3000);
    },
    goBack() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.$router.push('/');
      }, 500);
    }
  }
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
