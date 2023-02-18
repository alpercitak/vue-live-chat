<template>
  <div id="app">
    <LiveChat />
  </div>
</template>

<script>

import LiveChat from './components/LiveChat.vue'

export default {
  name: 'App',
  components: {
    LiveChat,
  }
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: calc(100vh - 16px);
  padding: 8px;
}
</style>
