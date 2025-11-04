import { Server, type Socket } from 'socket.io';
import {
  SocketMessageGetPeers,
  SocketMessageSetPeers,
  SocketMessageSetName,
  SocketMessageSetId,
  SocketMessageSendMessage,
  SocketMessageGetMessage,
  type Peer,
  type Message,
  type SocketServerToClientEvents,
  type SocketClientToServerEvents,
} from '@vue-live-chat/lib';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

interface WebSocketClient extends Socket, Peer {}

const PORT: number = 4000;
const io = new Server<SocketClientToServerEvents, SocketServerToClientEvents>({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

if (process.env.APP_REDIS) {
  const pubClient = createClient({ url: 'redis://host.docker.internal:6379' });
  const subClient = pubClient.duplicate();
  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    console.log('connected to redis');
    io.adapter(createAdapter(pubClient, subClient));
    io.listen(PORT);
  });
} else {
  io.listen(PORT);
}

const getUniqueID = (): string =>
  Array.from(Array(3))
    .map(() =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    )
    .join('-');

const setPeers = (wsc: Socket = null!): void => {
  const peers: Peer[] = [...io.sockets.sockets.values()].map((wsc: Socket) => {
    const x = wsc as WebSocketClient;
    return { peerId: x.peerId, peerName: x.peerName };
  });
  wsc ? wsc.emit(SocketMessageSetPeers, peers) : io.emit(SocketMessageSetPeers, peers);
};

io.on('connection', (wsc: Socket): void => {
  const wscExtended = wsc as WebSocketClient;

  wscExtended.peerId = getUniqueID();
  wscExtended.emit(SocketMessageSetId, wscExtended.peerId);

  wscExtended.on(SocketMessageGetPeers, () => {
    setPeers(wsc);
  });

  wscExtended.on(SocketMessageSetName, (name: string) => {
    wscExtended.peerName = name;
    setPeers();
  });

  wscExtended.on(SocketMessageSendMessage, (message: string) => {
    const messageData: Message = {
      messageId: getUniqueID(),
      peerId: wscExtended.peerId,
      message,
    };
    io.emit(SocketMessageGetMessage, messageData);
  });

  wscExtended.on('disconnect', () => {
    setPeers();
  });
});

console.log(`websocket server started on: ${PORT}`);

export default io;
