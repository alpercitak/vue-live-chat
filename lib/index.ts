export const SocketMessageGetPeers = 'getPeers';
export const SocketMessageSetPeers = 'setPeers';
export const SocketMessageSetName = 'setName';
export const SocketMessageSetId = 'setId';
export const SocketMessageSendMessage = 'sendMessage';
export const SocketMessageGetMessage = 'getMessage';

export interface Peer {
  peerId: String;
  peerName: String;
}

export interface Message {
  messageId: String;
  peerId: String;
  message: String;
}
