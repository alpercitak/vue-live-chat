<template>
  <div class="name">
    <input type="text" v-model="name" placeholder="Name" />
  </div>
</template>

<script setup>
import {onMounted, watch, ref} from 'vue';
import {useLiveChatStore} from '@/stores/liveChat';
const store = useLiveChatStore();

const name = ref('');

function setName() {
  store.connection.emit('setName', name.value);
}

onMounted(() => {
  if (localStorage.name) {
    name.value = localStorage.name;
  }
  setName();
});

watch(() => name.value, (newName) => {
  localStorage.name = newName;
  setName();
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
