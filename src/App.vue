<template>
  <div id="app">
    <MathModal />
  </div>
</template>

<script>
import MathModal from './components/MathModal.vue'

export default {
  name: 'app',
  components: {
    MathModal
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
