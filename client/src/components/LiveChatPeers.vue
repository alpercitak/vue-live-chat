<template>
  <div class="container">
    <div
      class="peer"
      v-for="peer in store.peers"
      v-bind:class="peer.peerId === store.peerId ? 'self' : ''"
      v-bind:key="peer.peerId.toString()"
    >
      {{ peer.peerId }}
      {{ peer.peerName ? `(${peer.peerName})` : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLiveChatStore } from '@/stores/liveChat';
import { Peer, SocketMessageSetPeers } from '@vue-live-chat/lib';
import { onMounted } from 'vue';
const store = useLiveChatStore();

onMounted(() => {
  store.connection.on(SocketMessageSetPeers, (data: Peer[]) => {
    store.peers = data;
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
