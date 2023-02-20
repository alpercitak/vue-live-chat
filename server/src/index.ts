const serverPort: Number = 3000;
import express from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

interface Peer {
  id: String;
  name: String;
}

interface Message {
  id: String;
  senderId: String;
  message: String;
}

interface WebSocketMessage {
  type: String;
  value: String;
}

interface WebSocketClient extends WebSocket.WebSocket, Peer {}

const getUniqueID = (): String => {
  return Array.from(Array(3))
    .map(() => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    })
    .join('-');
};

const setPeers = (wsc: WebSocketClient = null!): void => {
  const peers: Peer[] = [...wss.clients.values()].map((wsc: WebSocket.WebSocket) => {
    const x = wsc as WebSocketClient;
    return { id: x.id, name: x.name };
  });
  const data = JSON.stringify({ type: 'setPeers', value: peers });

  if (wsc) {
    wsc.send(data);
    return;
  }

  wss.clients.forEach((wsc: WebSocket.WebSocket) => {
    wsc.send(data);
  });
};

wss.on('connection', (wsc: WebSocketClient) => {
  wsc.id = getUniqueID();

  setPeers();
  wsc.send(JSON.stringify({ type: 'setId', value: wsc.id }));

  wsc.on('message', (data: WebSocket.Data, isBinary: Boolean) => {
    const message: WebSocketMessage = isBinary ? data : JSON.parse(data.toString());
    switch (message.type) {
      case 'getPeers':
        setPeers(wsc);
        break;
      case 'sendMessage':
        const messageData: Message = {
          id: getUniqueID(),
          senderId: wsc.id,
          message: message.value,
        };
        const jsonData: String = JSON.stringify({ type: 'sendMessage', ...messageData });
        wss.clients.forEach((wsc) => {
          wsc.send(jsonData);
        });
        break;
      case 'setName':
        wsc.name = message.value;
        setPeers();
        break;
    }
  });

  wsc.on('close', () => {
    setPeers();
  });
});

server.listen(serverPort, () => {
  console.log(`Websocket server started on port ${serverPort}`);
});
