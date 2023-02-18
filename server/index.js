'use strict';

const serverPort = 3000;
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4();
};

const setPeers = (wsc) => {
  const peers = [...wss.clients].map((x) => x.id);
  const data = JSON.stringify({ type: 'setPeers', value: peers });

  if (wsc) {
    wsc.send(data);
    return;
  }

  wss.clients.forEach((wsc) => {
    wsc.send(data);
  });
};

wss.on('connection', (wsc) => {
  wsc.id = wss.getUniqueID();

  setPeers();

  wsc.on('message', (data, isBinary) => {
    const message = isBinary ? data : JSON.parse(data.toString());
    switch (message.type) {
      case 'getPeers':
        setPeers(wsc);
        break;
      case 'sendMessage':
        const data = JSON.stringify({
          type: 'sendMessage',
          id: wss.getUniqueID(),
          senderId: wsc.id,
          message: message.value,
        });
        wss.clients.forEach((wsc) => {
          wsc.send(data);
        });
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
