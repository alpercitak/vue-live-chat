<template>
  <div class="container" ref="messagesContainer">
    <div class="container-message" v-for="item in messages" :key="item.messageId"
      :set="peerName = getPeerName(item.peerId)" v-bind:class="(item.peerId === store.peerId) ? 'self' : ''">
      <div class="info">
        <div>{{ dateFormat(new Date(item.dateTime)) }}</div>
        <div>
          {{ item.peerId }}
          {{ peerName ? `(${peerName})` : '' }}
        </div>
      </div>
      <div class="message">{{ item.message }}</div>
    </div>
  </div>
</template>

<script setup>
import {watch, nextTick, ref, onMounted} from 'vue';
import {useLiveChatStore} from '@/stores/liveChat';
import {SocketMessageGetMessage} from 'lib';

const store = useLiveChatStore();
const messagesContainer = ref(null);
const messages = ref([]);

function getPeerName(peerId) {
  return store.peers.find(x => x.peerId === peerId)?.peerName;
}

function dateFormat(value) {
  const YYYY = value.getFullYear();
  const MM = (value.getMonth() + 1).toString().padStart(2, '0');
  const DD = value.getDate();
  const HH = value.getHours();
  const mm = value.getMinutes().toString().padStart(2, '0');
  const ss = value.getSeconds().toString().padStart(2, '0');
  return `${DD}-${MM}-${YYYY} ${HH}:${mm}:${ss}`;
}

watch(() => [...messages.value], async () => {
  await nextTick();
  const container = messagesContainer.value;
  container.scrollTop = container.offsetHeight;

  const lastMessages = messages.value.slice(-10);
  localStorage.lastMessages = JSON.stringify(lastMessages);
});

onMounted(() => {
  if (localStorage.lastMessages) {
    try {
      const data = JSON.parse(localStorage.lastMessages);
      messages.value = data;
    } catch (e) {
      console.warn(e);
    }
  }

  store.connection.on(SocketMessageGetMessage, (data) => {
    data.dateTime = new Date();
    messages.value.push(data);
  });
});
</script>

<style scoped lang="less">
.row() {
  border: 1px solid #CCC;
  background-color: #EEE;

  &.self {
    background-color: rgba(0, 255, 0, 0.2);
  }
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;

  .container-message {
    .row;
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    flex-basis: 0;

    .info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
    }

    .message {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>