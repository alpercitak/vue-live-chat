<template>
  <div class="main" v-if="store.isConnectionOpen">
    <div class="container-peers">
      <LiveChatName />
      <LiveChatPeers />
    </div>
    <div class="container-chat">
      <LiveChatMessageList />
      <LiveChatSendMessage />
    </div>
  </div>
</template>

<script setup lang="ts">
import LiveChatPeers from './LiveChatPeers.vue';
import LiveChatName from './LiveChatName.vue';
import LiveChatMessageList from './LiveChatMessageList.vue';
import LiveChatSendMessage from './LiveChatSendMessage.vue';

import { onMounted } from 'vue';
import { useLiveChatStore } from '@/stores/liveChat';
import { SocketMessageSetId } from '@vue-live-chat/lib';

const store = useLiveChatStore();

onMounted(() => {
  store.connection.on('connect', () => {
    store.isConnectionOpen = true;
  });
  store.connection.on(SocketMessageSetId, (peerId: string) => {
    store.peerId = peerId;
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
