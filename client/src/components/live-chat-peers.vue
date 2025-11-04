<template>
  <div class="container">
    <div
      class="peer"
      v-for="peer in peers"
      v-bind:class="peer.peerId === peerId ? 'self' : ''"
      v-bind:key="String(peer.peerId)"
    >
      {{ peer.peerId }}
      {{ peer.peerName ? `(${peer.peerName})` : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useLiveChatStore } from '@/stores/live-chat';
import { SocketMessageSetPeers, type Peer } from '@vue-live-chat/lib';
import { storeToRefs } from 'pinia';

const store = useLiveChatStore();
const { connection, peerId, peers } = storeToRefs(store);

onMounted(() => {
  connection.value.on(SocketMessageSetPeers, (data: Peer[]) => {
    peers.value = data;
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
