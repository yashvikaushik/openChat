import { Server as SocketIOServer } from 'socket.io';
import { SocketService } from '../services/socket.service';
import { ISocketUser } from '../types/socket.types';

export const addUser = (socketId: string, username: string, roomId: string): ISocketUser => {
  return SocketService.joinUser(socketId, username, roomId);
};

export const removeUser = (socketId: string): ISocketUser | null => {
  return SocketService.leaveUser(socketId);
};

export const getOnlineUsers = (roomId: string): string[] => {
  const users = SocketService.getRoomUsers(roomId);
  return users.map(u => u.username);
};

export const broadcastOnlineUsersList = (io: SocketIOServer, roomId: string): void => {
  const usernames = getOnlineUsers(roomId);
  io.to(roomId).emit('online-users', usernames);
};
