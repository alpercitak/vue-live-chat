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

const store = useLiveChatStore();

onMounted(() => {
  store.connection = new WebSocket('ws://localhost:3000/');
  store.connection.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type == 'setPeers') {
      store.peers = data.value;
    }
    if (data.type == 'sendMessage') {
      store.messages.push({
        id: data.id,
        senderId: data.senderId,
        message: data.message,
        dateTime: new Date(),
      });
    }
    if (data.type == 'setId') {
      store.id = data.value;
    }
  }
  store.connection.onopen = function () {
    store.isConnectionOpen = true;
    store.setName();
    store.connection.send(JSON.stringify({type: 'getPeers'}));
  }
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
