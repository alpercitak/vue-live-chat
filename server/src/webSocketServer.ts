import { Server, Socket } from 'socket.io';
import {
  Peer,
  Message,
  SocketMessageGetPeers,
  SocketMessageSetPeers,
  SocketMessageSetName,
  SocketMessageSetId,
  SocketMessageSendMessage,
  SocketMessageGetMessage,
} from 'lib';

interface WebSocketClient extends Socket, Peer {}

const PORT: number = 3001;
const io = new Server(PORT, {
  cors: {
    origin: 'http://localhost:8080',
  },
});

const getUniqueID = (): string => {
  return Array.from(Array(3))
    .map(() => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    })
    .join('-');
};

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
