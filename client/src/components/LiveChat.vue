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

<script setup>
import LiveChatPeers from './LiveChatPeers';
import LiveChatName from './LiveChatName';
import LiveChatMessageList from './LiveChatMessageList';
import LiveChatSendMessage from './LiveChatSendMessage';

import {onMounted} from 'vue';
import {useLiveChatStore} from '@/stores/liveChat';
import {io} from "socket.io-client";
import {SocketMessageSetId} from "lib";

const store = useLiveChatStore();

onMounted(() => {
  store.connection = io('ws://localhost:3001/');
  store.connection.on('connect', () => {
    store.isConnectionOpen = true;
  });
  store.connection.on(SocketMessageSetId, (peerId) => {
    store.peerId = peerId;
  })
});
</script>

<style scoped lang="less">
.container() {
  border: 1px solid #DDD;
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
