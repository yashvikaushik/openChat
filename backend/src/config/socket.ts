import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { handleConnection } from '../sockets/socket.handler';

let io: SocketIOServer | null = null;

export const initializeSocket = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // Adjust matching CORS configuration in app.ts
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log("connecting the client");
    handleConnection(socket, io!);
    console.log("somebody entered the server with id: ",socket.id);
  });

  console.log('[Socket.IO] Server initialized successfully.');
  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('[Socket.IO] Server has not been initialized. Call initializeSocket first.');
  }
  return io;
};
