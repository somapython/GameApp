<template>
  <div v-if="show" :class="toastClass" class="fixed top-4 right-4 px-4 py-2 rounded shadow-md flex items-center space-x-2">
    <span>{{ icon }}</span>
    <span>{{ message }}</span>
    <button @click="close" class="ml-4 text-white font-bold">&times;</button>
  </div>
</template>

<script>
export default {
  name: 'ToasterData',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info', // info, success, warning, danger
    },
  },
  data() {
    return {
      show: true,
    };
  },
  computed: {
    toastClass() {
      switch (this.type) {
        case 'success':
          return 'bg-green-500 text-white';
        case 'danger':
          return 'bg-red-500 text-white';
        case 'warning':
          return 'bg-yellow-500 text-black';
        case 'info':
        default:
          return 'bg-gray-500 text-white';
      }
    },
    icon() {
      switch (this.type) {
        case 'success':
          return '✅';
        case 'danger':
          return '❌';
        case 'warning':
          return '⚠️';
        case 'info':
        default:
          return 'ℹ️';
      }
    }
  },
  methods: {
    close() {
      this.show = false;
    },
  },
  watch: {
    message() {
      this.show = true;
    }
  }
};
</script>

<style scoped>
</style>
