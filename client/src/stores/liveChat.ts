import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Peer, SocketServerToClientEvents, SocketClientToServerEvents } from 'lib';
import { Socket, io } from 'socket.io-client';

export const useLiveChatStore = defineStore('liveChat', () => {
  const socket: Socket<SocketServerToClientEvents, SocketClientToServerEvents> = io('ws://localhost:3001/');

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
