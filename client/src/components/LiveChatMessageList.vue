<template>
  <div class="container" ref="messagesContainer">
    <div class="container-message" v-for="item in store.messages" :key="item.id"
      :set="senderName = getSenderName(item.senderId)" v-bind:class="(item.senderId === store.id) ? 'self' : ''">
      <div class="info">
        <div>{{ dateFormat(new Date(item.dateTime)) }}</div>
        <div>
          {{ item.senderId }}
          {{ senderName ? `(${senderName})` :'' }}
        </div>
      </div>
      <div class="message">{{ item.message }}</div>
    </div>
  </div>
</template>

<script setup>
import {watch, nextTick, ref, onMounted} from 'vue';
import {useLiveChatStore} from '@/stores/liveChat';

const store = useLiveChatStore();
const messagesContainer = ref(null);

function getSenderName(senderId) {
  return store.peers.find(x => x.id === senderId)?.name;
}

function dateFormat(value) {
  const YYYY = value.getFullYear();
  const MM = (value.getMonth() + 1).toString().padStart(2, '0');
  const DD = value.getDate();
  const HH = value.getHours();
  const mm = value.getMinutes();
  const ss = value.getSeconds().toString().padStart(2, '0');
  return `${DD}-${MM}-${YYYY} ${HH}:${mm}:${ss}`;
}

watch(() => [...store.messages], async () => {
  await nextTick();
  const container = messagesContainer.value;
  container.scrollTop = container.offsetHeight;

  const lastMessages = store.messages.slice(Math.max(store.messages.length - 10, 1));
  localStorage.lastMessages = JSON.stringify(lastMessages);
});

onMounted(() => {
  if (localStorage.lastMessages) {
    try {
      const data = JSON.parse(localStorage.lastMessages);
      store.messages = data;
    } catch (e) {
      console.warn(e);
    }
  }
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