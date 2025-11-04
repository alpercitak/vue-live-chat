import { ref } from 'vue';
import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import type { Connection } from './index.types';
import type { Peer } from '@vue-live-chat/lib';

export const useLiveChatStore = defineStore('live-chat', () => {
  const socket = io('ws://localhost:4000/', {
    withCredentials: true,
  });

  const connection = ref<Connection>(socket);
  const isConnectionOpen = ref<boolean>(false);
  const peerId = ref<string>('');
  const peers = ref(Array<Peer>());

  return {
    connection,
    peerId,
    peers,
    isConnectionOpen,
  };
});
