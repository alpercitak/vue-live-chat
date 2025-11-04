<template>
  <div class="container">
    <input type="text" v-model="message" v-on:keyup.enter="sendMessage" />
    <button v-on:click="sendMessage">Send Message</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useLiveChatStore } from '@/stores/live-chat';
import { SocketMessageSendMessage } from '@vue-live-chat/lib';

const store = useLiveChatStore();
const { connection } = storeToRefs(store);

const message = ref<string>('');

const sendMessage = (): void => {
  if (!message.value) {
    return;
  }
  connection.value.emit(SocketMessageSendMessage, message.value);
  message.value = '';
};
</script>

<style scoped lang="less">
.container {
  align-self: flex-end;
  display: flex;
  width: 100%;
  gap: 8px;

  input {
    flex: 1;
  }
}
</style>
