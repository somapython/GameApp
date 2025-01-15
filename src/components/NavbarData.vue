<template>
  <nav class="bg-rose-800 p-2 md:p-4 text-white" @click="closeDropdown">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Left Side: Logo -->
      <div class="text-2xl font-bold" title="Somani Logo">
        <!-- GameApp -->
        <img
          src="../assets/Home/logo2.png"
          alt="Logo"
          class="w-10 h-10"
        />
      </div>

      <!-- Right Side: User Info -->
      <div class="flex items-center space-x-4 relative" title="User" @click.stop>
        <span class="text-base md:text-lg font-medium">
          Welcome, User! <span class="text-yellow-300 bounce">&#128075;</span>
        </span>
        <button
          @click="toggleDropdown"
          class="flex items-center space-x-4 focus:outline-none"
        >
        <img
          :src="userImage || userImageDefault"
          alt="User"
          class="w-10 h-10 rounded-full border-1 border-white"
        />
      </button>
      </div>
      <!-- Dropdown Menu -->
     
      <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-32 w-36 md:w-48 bg-white text-black rounded-lg shadow-lg z-10"
        >
          <ul class="py-2">
            <li>
              <a
                href="#"
                class="block text-sm md:text-lg px-4 py-2 hover:bg-gray-200"
                @click="openUpdateModal"
              >
                Update User
              </a>
            </li>
            <li>
              <a
                href="#"
                class="block  text-sm md:text-lg px-4 py-2 hover:bg-gray-200"
                @click="logout"
              >
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
          <!-- <div class="mb-4">
            <label for="userName" class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="userName" v-model="userName" class="mt-1 block w-full border rounded-md shadow-sm focus:ring focus:ring-blue-500" />
          </div> -->
          <div class="flex justify-end space-x-4">
            <button type="button" @click="closeUpdateModal" class="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">Update</button>
          </div>
        </form>
      </div>
    
    </div>
  </transition>
  </nav>
</template>

<script>
import userImageDefault from '../assets/Home/user.png';
export default {
  data() {
    return {
      isDropdownOpen: false,
      isUpdateModalOpen: false,
      userImage: '',
      previewedImage: null,
      userImageDefault
    };
  },
  methods: {
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
    submitUpdate() {
      alert(`User ${this.userName} updated successfully!`);
      // Update the user image
      this.userImage = this.previewedImage;

      // Close the modal
      this.closeUpdateModal();
    },
    logout() {
      alert('Logout clicked');
    },
  },
  mounted() {
    document.addEventListener("click", this.closeDropdown);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdown);
  },
};
</script>

<style scoped>
/* Add hover effects */
a {
  transition: color 0.3s;
}
a:hover {
  color: #ffeb3b; /* Light yellow */
}

/* Dropdown animation styles */
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

/* Keyframes for bounce animation */
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
