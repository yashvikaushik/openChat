import { Socket, Server as SocketIOServer } from 'socket.io';
import { SocketService } from '../services/socket.service';
import { JoinRoomPayload } from '../types/socket.types';

export const joinRoom = (socket: Socket, io: SocketIOServer, payload: JoinRoomPayload): void => {
  const { roomId, username } = payload;
  if (!roomId || !username) {
    console.error('[RoomHandler] Join Room rejected: missing roomId or username');
    return;
  }

  // Join the Socket.IO virtual room
  socket.join(roomId);

  // Register in memory map
  SocketService.joinUser(socket.id, username, roomId);

  // Broadcast system notice to other room members
  socket.to(roomId).emit('user-joined', {
    username,
    message: `${username} has joined the room`,
    createdAt: new Date()
  });

  // Broadcast updated user list to all room members
  broadcastOnlineUsers(io, roomId);
};

export const leaveRoom = (socket: Socket, io: SocketIOServer): void => {
  handleUserLeave(socket, io);
};

export const handleUserLeave = (socket: Socket, io: SocketIOServer): void => {
  const user = SocketService.leaveUser(socket.id);
  if (user) {
    const { roomId, username } = user;
    socket.leave(roomId);

    // Broadcast system notice to other room members
    socket.to(roomId).emit('user-left', {
      username,
      message: `${username} has left the room`,
      createdAt: new Date()
    });

    // Broadcast updated user list to remaining room members
    broadcastOnlineUsers(io, roomId);
  }
};

export const broadcastOnlineUsers = (io: SocketIOServer, roomId: string): void => {
  const users = SocketService.getRoomUsers(roomId);
  const usernames = users.map(u => u.username);
  io.to(roomId).emit('online-users', usernames);
};
