import { Socket, Server as SocketIOServer } from 'socket.io';
import { joinRoom, leaveRoom, handleUserLeave } from './room.handler';
import { sendMessage } from './message.handler';
import { JoinRoomPayload, SendMessagePayload } from '../types/socket.types';

export const handleConnection = (socket: Socket, io: SocketIOServer): void => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Register join-room listener
  socket.on('join-room', (payload: JoinRoomPayload) => {
    joinRoom(socket, io, payload);
  });

  // Register send-message listener
  socket.on('send-message', (payload: SendMessagePayload) => {
    sendMessage(socket, io, payload);
  });

  // Register leave-room listener
  socket.on('leave-room', () => {
    leaveRoom(socket, io);
  });

  // Register disconnect listener (cleanup active session)
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    handleUserLeave(socket, io);
  });
};
