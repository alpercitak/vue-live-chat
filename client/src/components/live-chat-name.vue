<template>
  <div class="name">
    <input type="text" v-model="chatName" placeholder="Name" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useLiveChatStore } from '@/stores/live-chat';
import { SocketMessageSetName } from '@vue-live-chat/lib';

const store = useLiveChatStore();
const { connection } = storeToRefs(store);

const chatName = ref<string>('');

const setName = (): void => {
  connection.value.emit(SocketMessageSetName, chatName.value);
};

onMounted(() => {
  if (localStorage.name) {
    chatName.value = localStorage.name;
  }
  setName();
});

watch(
  () => chatName.value,
  (newName) => {
    localStorage.name = newName;
    setName();
  }
);
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
