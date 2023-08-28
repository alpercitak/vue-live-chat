import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Peer, SocketServerToClientEvents, SocketClientToServerEvents } from '@vue-live-chat/lib';
import { Socket, io } from 'socket.io-client';

export const useLiveChatStore = defineStore('liveChat', () => {
  const socket: Socket<SocketServerToClientEvents, SocketClientToServerEvents> = io('ws://localhost:4000/', {
    withCredentials: true,
  });

  const connection = ref(socket);
  const isConnectionOpen = ref(false);
  const peerId = ref('');
  const peers = ref(Array<Peer>());

  return {
    connection,
    peerId,
    peers,
    isConnectionOpen,
  };
});
