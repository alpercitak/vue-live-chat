<template>
  <div class="container">
    <div class="peer" v-for="peer in store.peers" v-bind:class="(peer.peerId === store.peerId) ? 'self' : ''"
      :key="peer.peerId">
      {{peer.peerId}}
      {{peer.peerName ? `(${peer.peerName})`: ''}}
    </div>
  </div>
</template>

<script setup>
import {useLiveChatStore} from '@/stores/liveChat';
import {onMounted} from 'vue';
const store = useLiveChatStore();

onMounted(() => {
  store.connection.on('setPeers', (data) => {
    store.peers = data;
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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.peer {
  .row;
  padding: 2px;
  font-size: 12px;
  display: flex;
  align-items: flex-start;
}
</style>
