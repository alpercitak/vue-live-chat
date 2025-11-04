<template>
  <div class="main" v-if="isConnectionOpen">
    <div class="container-peers">
      <live-chat-name />
      <live-chat-peers />
    </div>
    <div class="container-chat">
      <live-chat-message-list />
      <live-chat-send-message />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import LiveChatPeers from './live-chat-peers.vue';
import LiveChatName from './live-chat-name.vue';
import LiveChatMessageList from './live-chat-message-list.vue';
import LiveChatSendMessage from './live-chat-send-message.vue';
import { useLiveChatStore } from '@/stores/live-chat';
import { SocketMessageSetId } from '@vue-live-chat/lib';

const store = useLiveChatStore();
const { connection, isConnectionOpen, peerId } = storeToRefs(store);

onMounted(() => {
  connection.value.on('connect', () => {
    isConnectionOpen.value = true;
  });
  connection.value.on(SocketMessageSetId, (newPeerId: string) => {
    peerId.value = newPeerId;
  });
});
</script>

<style scoped lang="less">
.container() {
  border: 1px solid #ddd;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.main {
  height: 100%;
  display: flex;
  flex-direction: row;
}

.container-peers {
  .container;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex-basis: 20%;
  overflow: auto;
}

.container-chat {
  .container;
  flex: 1;
  gap: 8px;
}
</style>
