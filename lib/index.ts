export const SocketMessageGetPeers = 'getPeers';
export const SocketMessageSetPeers = 'setPeers';
export const SocketMessageSetName = 'setName';
export const SocketMessageSetId = 'setId';
export const SocketMessageSendMessage = 'sendMessage';
export const SocketMessageGetMessage = 'getMessage';

export interface Peer {
  peerId: string;
  peerName: string;
}

export interface Message {
  messageId: string;
  peerId: string;
  message: string;
}
