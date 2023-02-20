import { Server, Socket } from 'socket.io';

interface Peer {
  peerId: String;
  peerName: String;
}

interface Message {
  messageId: String;
  peerId: String;
  message: String;
}

interface WebSocketClient extends Socket, Peer {}

const PORT: number = 3001;
const io = new Server(PORT, {
  cors: {
    origin: 'http://localhost:8080',
  },
});

const getUniqueID = (): String => {
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
  wsc ? wsc.emit('setPeers', peers) : io.emit('setPeers', peers);
};

io.on('connection', (wsc: Socket): void => {
  const wscExtended = wsc as WebSocketClient;

  wscExtended.peerId = getUniqueID();
  wscExtended.emit('setId', wscExtended.peerId);

  wscExtended.on('getPeers', () => {
    setPeers(wsc);
  });

  wscExtended.on('setName', (name: String) => {
    wscExtended.peerName = name;
    setPeers();
  });

  wscExtended.on('sendMessage', (message: String) => {
    const messageData: Message = {
      messageId: getUniqueID(),
      peerId: wscExtended.peerId,
      message,
    };
    io.emit('getMessage', messageData);
  });

  wscExtended.on('disconnect', () => {
    setPeers();
  });
});

console.log(`websocket server started on: ${PORT}`);

export default io;
