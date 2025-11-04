<template>
  <div class="container" ref="messagesContainer">
    <div
      class="container-message"
      v-for="item in messages"
      :key="item.messageId.toString()"
      :set="(peerName = getPeerName(item.peerId.toString()))"
      v-bind:class="item.peerId === peerId ? 'self' : ''"
    >
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

<script setup lang="ts">
import { watch, nextTick, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useLiveChatStore } from '@/stores/live-chat';
import { SocketMessageGetMessage, type Message, type Peer } from '@vue-live-chat/lib';

interface MessageExtended extends Message {
  dateTime: Date;
}

const store = useLiveChatStore();
const { connection, peerId, peers } = storeToRefs(store);

const messagesContainer = ref<HTMLDivElement | null>(null);
const messages = ref(Array<MessageExtended>());
let peerName = '';

const getPeerName = (peerId: string): string => {
  const peer = peers.value.find((x) => x.peerId === peerId) as Peer;
  return peer ? peer.peerName : '';
};

function dateFormat(value: Date) {
  const YYYY = value.getFullYear();
  const MM = (value.getMonth() + 1).toString().padStart(2, '0');
  const DD = value.getDate();
  const HH = value.getHours();
  const mm = value.getMinutes().toString().padStart(2, '0');
  const ss = value.getSeconds().toString().padStart(2, '0');
  return `${DD}-${MM}-${YYYY} ${HH}:${mm}:${ss}`;
}

watch(
  () => [...messages.value],
  async () => {
    await nextTick();
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.offsetHeight;
    }

    const lastMessages = messages.value.slice(-10);
    localStorage.lastMessages = JSON.stringify(lastMessages);
  }
);

onMounted(() => {
  if (localStorage.lastMessages) {
    try {
      const data = JSON.parse(localStorage.lastMessages);
      messages.value = data;
    } catch (e) {
      console.warn(e);
    }
  }

  connection.value.on(SocketMessageGetMessage, (data: Message) => {
    (data as MessageExtended).dateTime = new Date();
    messages.value.push(data as MessageExtended);
  });
});
</script>

<style scoped lang="less">
.row() {
  border: 1px solid #ccc;
  background-color: #eee;

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
