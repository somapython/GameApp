<template>
  <div class="flex flex-col min-h-screen">
    <!-- <Navbar /> -->
    <router-view class="flex-1" />
  </div>

</template>

<script>
// import Navbar from './components/NavbarData.vue';

export default {
  name: 'App',
  components: {
    // Navbar,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}
</style>
