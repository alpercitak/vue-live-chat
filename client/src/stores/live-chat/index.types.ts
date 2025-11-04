import type { SocketServerToClientEvents, SocketClientToServerEvents } from '@vue-live-chat/lib';
import type { Socket } from 'socket.io-client';

export type Connection = Socket<SocketServerToClientEvents, SocketClientToServerEvents>;
