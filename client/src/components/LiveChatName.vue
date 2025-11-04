<template>
  <div class="name">
    <input type="text" v-model="name" placeholder="Name" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useLiveChatStore } from '@/stores/live-chat';
import { SocketMessageSetName } from '@vue-live-chat/lib';

const store = useLiveChatStore();
const { connection } = storeToRefs(store);

const name = ref('');

const setName = (): void => {
  connection.value.emit(SocketMessageSetName, name.value);
};

onMounted((): void => {
  if (localStorage.name) {
    name.value = localStorage.name;
  }
  setName();
});

watch(
  () => name.value,
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
