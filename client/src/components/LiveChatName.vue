<template>
  <div class="name">
    <input type="text" v-model="store.name" placeholder="Name" />
  </div>
</template>

<script setup>
import {onMounted, watch} from 'vue';
import {useLiveChatStore} from '@/stores/liveChat';
const store = useLiveChatStore();

onMounted(() => {
  if (localStorage.name) {
    store.name = localStorage.name;
  }
});

watch(() => store.name, (newName) => {
  localStorage.name = newName;
  store.setName();
});

</script>

<style scoped lang="less">
.name {
  display: flex;
  width: 100%;

  input {
    width: 100%;
  }
}
</style>
