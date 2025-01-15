<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-400 to-purple-500 relative">
        <div class="w-[90%] md:w-full max-w-sm bg-white shadow-md rounded-lg px-4 md:px-8 pt-4 md:pt-6 pb-16 md:pb-8 mb-3 md:mb-4" >
            <header class="w-full flex items-center justify-between p-2 bg-rose-800">
                <button @click="goBack">
                    <img src="../assets/Games/home.png" alt="Home" class="w-6 h-6"/>
                </button>
                <h1 class="text-xl font-bold text-center">Sign Up</h1>
            </header>
            <form @submit.prevent="signup" class="w-full mt-2">
                <div class="mb-2 relative">
                    <label class="block text-blue-700 text-base font-bold mb-2" for="name">Name</label>
                    <input type="text" id="name" v-model="name" class=" border rounded w-full py-2 px-2 text-gray-700 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 invalid:ring-red-500"
                    placeholder="Enter your name" required />
                </div>
                <div class="mb-2 relative">
                    <label class="block text-blue-700 text-base font-bold mb-2" for="city">City</label>
                    <input type="text" id="city" v-model="city" class="border rounded w-full py-2 px-2 text-gray-700 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 invalid:ring-red-500"
                        placeholder="Enter your city" required  />
                </div>
                <div class="mb-2 relative">
                    <label class="block text-blue-700 text-base font-bold mb-2" for="mobile">Mobile</label>
                    <input type="tel" id="mobile" v-model="mobile" class="border rounded w-full py-2 px-2 text-gray-700 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 invalid:ring-red-500"
                        placeholder="Enter your mobile number" pattern="\d{10}" required />
                </div>
                <div class="mb-2">
                    <label class="block text-blue-700 text-base font-bold mb-2">PIN</label>
                    <div class="flex justify-between space-x-2">
                        <input type="text" v-model="pin[0]" ref="pin0" maxlength="1"
                            class="shadow appearance-none border rounded w-1/4 py-2 text-center text-gray-700 leading-tight focus:shadow-outline focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 invalid:ring-red-500"
                             @input="handlePinInput(0)" required />
                        <input type="text" v-model="pin[1]" ref="pin1" maxlength="1"
                            class="shadow appearance-none border rounded w-1/4 py-2 text-center text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-600 focus:ring-1 focus:ring-sky-600 invalid:ring-red-500"
                             @input="handlePinInput(1)" required />
                        <input type="text" v-model="pin[2]" ref="pin2" maxlength="1"
                          class="shadow appearance-none border rounded w-1/4 py-2 text-center text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-600 focus:ring-1 focus:ring-sky-600 invalid:ring-red-500"
                            @input="handlePinInput(2)" required />
                        <input type="text" v-model="pin[3]" ref="pin3" maxlength="1"
                            class="shadow appearance-none border rounded w-1/4 py-2 text-center text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-600 focus:ring-1 focus:ring-sky-600 invalid:ring-red-500"
                                @input="handlePinInput(3)" required />
                    </div>
                </div>
                <div class="mb-6">
                    <label class="block text-blue-700 text-base font-bold mb-2" for="profile">Upload Profile</label>
                    <input type="file" id="profile" @change="handleFileUpload" class="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                        accept="image/*" required />
                </div>
                <div class="flex items-center justify-between">
                    <button class="w-full bg-indigo-700 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded" type="submit" >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
        <div class="absolute inset-x-0 bottom-10 flex justify-center space-x-4 animate-bounce">
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
// import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
// import { database } from "./firebase";
export default {
  components: {
    LoaderData,
    ToasterData
  },
  data() {
    return {
      name: '',
      city: '',
      mobile: '',
      pin: ['', '', '', ''],
      profilePicture: null,
      toastMessage: '',
      toastType: '',
      isLoading: false,
      postData: [],
      isUserExists: false,
      isLoggedIn: false,
      tokenId:'',
    };
  },
  mounted() {
    this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    //   const userData = JSON.parse(localStorage.getItem('user'));
    //     if (userData && userData.tokenId) {
    //         this.isLoggedIn = true;
    //     } else {
    //         this.isLoggedIn = false;
    //     }
  },
  methods: {
    async signup() {
        const pinValue = this.pin.join('');
        if (!this.name && !this.city && !this.mobile && !this.pin.some((val) => val) && !this.profilePicture) {
            this.showToast('Please fill the form','danger');
            return;
        }

        if (this.mobile.length !== 10 || !/^\d{10}$/.test(this.mobile)) {
            this.showToast('Invalid mobile number', 'danger');
            return;
        }

        if (!/^\d{4}$/.test(pinValue)) {
            this.showToast('Invalid PIN Format, Only numbers allowed', 'danger');
            return;
        }
      // const fileRef = ref(storage, `profiles/${this.profilePicture.name}`);
      // const snapshot =  await uploadBytes(fileRef, this.profilePicture);
      // console.log("Uploaded a file!", snapshot);
      // const downloadURL = await getDownloadURL(fileRef);
      // console.log("File available at", downloadURL);
      // this.profilePicture = downloadURL;
        this.isLoading = true;
      
        try{
            const tokenId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            this.tokenId =  tokenId;
            const base64Image = await new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = () => resolve(fileReader.result);
                fileReader.onerror = () => reject(new Error('Error reading profile picture'));
                fileReader.readAsDataURL(this.profilePicture);
            });
            const userData = {
                name: this.name,
                city: this.city,
                mobile: this.mobile,
                pin: pinValue,
                profilePicture: base64Image,
                isLogged: false,
                tokenId:  this.tokenId
            }
            const response = await axios.get('https://vuelogin-853da-default-rtdb.firebaseio.com/userData.json');
            const existingUsers = response.data ? this.formatPostData(response.data) : [];

            const userExists = existingUsers.some(user => user.mobile === userData.mobile);
            if (userExists) {
                this.showToast('User Already Exists', 'danger');
                this.isLoading = false;
            return;
            }
            await axios.post('https://vuelogin-853da-default-rtdb.firebaseio.com/userData.json', userData);
            this.showToast('User registered successfully!', 'success');
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
            this.isLoading = false;
            this.$router.push('/login');
        } catch(error){
            const fallbackUserData = {
                name: this.name,
                city: this.city,
                mobile: this.mobile,
                pin: pinValue,
                isLogged: false,
                profilePicture: this.profilePicture ? await new Promise((resolve, reject) => {
                    const fileReader = new FileReader();
                    fileReader.onload = () => resolve(fileReader.result);
                    fileReader.onerror = () => reject(new Error('Error reading profile picture'));
                    fileReader.readAsDataURL(this.profilePicture);
                }) : null,
                tokenId:  this.tokenId,
            };
            localStorage.setItem('user', JSON.stringify(fallbackUserData));
            this.isLoading = false;
            this.showToast('Firebase failed. User registered locally!', 'warning');
            this.$router.push('/');
        }
        finally {
            this.isLoading = false;
            this.resetForm();
        }
    },
      resetForm() {
        this.name = '';
        this.city = '';
        this.mobile = '';
        this.pin = ['', '', '', ''];
        this.profilePicture = null;
    },
    formatPostData(data){
      this.postData=[];
      for(let key in data){
        this.postData.push({...data[key], id:key})
      }
      return this.postData;
    },
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.profilePicture = file;
        }
    },
    handlePinInput(index) {
        if (this.pin[index] && index < 3) {
            this.$refs[`pin${index + 1}`].focus(); 
        } else if (!this.pin[index] && index > 0) {
            this.$refs[`pin${index - 1}`].focus(); 
        }
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
