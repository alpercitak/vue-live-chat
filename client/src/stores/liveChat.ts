import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  Message,
  Peer,
  SocketMessageSetId,
  SocketMessageGetMessage,
  SocketMessageSetName,
  SocketMessageSetPeers,
  SocketMessageSendMessage,
} from 'lib';
import { Socket, io } from 'socket.io-client';
import {} from 'lib';

interface ServerToClientEvents {
  [SocketMessageSetName]: (name: string) => void;
  [SocketMessageSendMessage]: (message: string) => void;
}

interface ClientToServerEvents {
  [SocketMessageSetId]: (peerId: string) => void;
  [SocketMessageGetMessage]: (data: Message) => void;
  [SocketMessageSetPeers]: (data: Peer[]) => void;
}

export const useLiveChatStore = defineStore('liveChat', () => {
  const socket: Socket<ClientToServerEvents, ServerToClientEvents> = io('ws://localhost:3001/');

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
