import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Peer, SocketServerToClientEvents, SocketClientToServerEvents } from '@vue-live-chat/lib';
import { io, type Socket } from 'socket.io-client';

type Connection = Socket<SocketServerToClientEvents, SocketClientToServerEvents>;

export const useLiveChatStore = defineStore('liveChat', () => {
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
