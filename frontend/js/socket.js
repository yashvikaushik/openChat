/**
 * Client-Side Socket.IO wrapper for OpenChat (Vanilla JavaScript)
 */

let socket = null;

export const connectSocket = () => {
  if (typeof window.io === 'undefined') {
    console.error('[SocketClient] Socket.io client script not loaded.');
    return null;
  }

  if (!socket) {
    socket = window.io();
    console.log('[SocketClient] Connecting to Socket.IO server...');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.emit('leave-room');
    socket.disconnect();
    socket = null;
    console.log('[SocketClient] Disconnected from server.');
  }
};

export const joinRoom = (roomId, username) => {
  if (socket) {
    socket.emit('join-room', { roomId, username });
    console.log(`[SocketClient] Emitted join-room for room: ${roomId}`);
  }
};

export const sendMessage = (roomId, username, message) => {
  if (socket) {
    socket.emit('send-message', { roomId, username, message });
    console.log('[SocketClient] Emitted send-message');
  }
};

export const listenForMessages = (callback) => {
  if (socket) {
    socket.on('receive-message', callback);
  }
};

export const listenForUserJoined = (callback) => {
  if (socket) {
    socket.on('user-joined', callback);
  }
};

export const listenForUserLeft = (callback) => {
  if (socket) {
    socket.on('user-left', callback);
  }
};

export const listenForOnlineUsers = (callback) => {
  if (socket) {
    socket.on('online-users', callback);
  }
};
