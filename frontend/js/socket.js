/**
 * Client-Side Socket.IO wrapper for OpenChat
 */

let socket = null;

export const connectSocket = (): any => {
  // io is declared globally by the script imported in chat.html
  if (typeof (window as any).io === 'undefined') {
    console.error('[SocketClient] Socket.io client script not loaded.');
    return null;
  }

  if (!socket) {
    socket = (window as any).io();
    console.log('[SocketClient] Connecting to Socket.IO server...');
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.emit('leave-room');
    socket.disconnect();
    socket = null;
    console.log('[SocketClient] Disconnected from server.');
  }
};

export const joinRoom = (roomId: string, username: string): void => {
  if (socket) {
    socket.emit('join-room', { roomId, username });
    console.log(`[SocketClient] Emitted join-room for room: ${roomId}`);
  }
};

export const sendMessage = (roomId: string, username: string, message: string): void => {
  if (socket) {
    socket.emit('send-message', { roomId, username, message });
    console.log('[SocketClient] Emitted send-message');
  }
};

export const listenForMessages = (callback: (msg: any) => void): void => {
  if (socket) {
    socket.on('receive-message', callback);
  }
};

export const listenForUserJoined = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('user-joined', callback);
  }
};

export const listenForUserLeft = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('user-left', callback);
  }
};

export const listenForOnlineUsers = (callback: (users: string[]) => void): void => {
  if (socket) {
    socket.on('online-users', callback);
  }
};
