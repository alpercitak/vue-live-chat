<template>
  <div class="container">
    <input type="text" v-model="message" v-on:keyup.enter="sendMessage()" />
    <button v-on:click="sendMessage()">Send Message</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLiveChatStore } from '@/stores/liveChat';
import { SocketMessageSendMessage } from '@vue-live-chat/lib';
const store = useLiveChatStore();

const message = ref('');

function sendMessage(): void {
  if (!message.value) {
    return;
  }
  store.connection.emit(SocketMessageSendMessage, message.value);
  message.value = '';
}
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
