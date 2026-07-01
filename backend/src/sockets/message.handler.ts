import { Socket, Server as SocketIOServer } from 'socket.io';
import { MessageService } from '../services/message.service';
import { SendMessagePayload } from '../types/socket.types';

export const sendMessage = async (socket: Socket, io: SocketIOServer, payload: SendMessagePayload): Promise<void> => {
  const { roomId, username, message } = payload;
  if (!roomId || !username || !message) {
    console.error('[MessageHandler] Send message failed: missing required properties');
    return;
  }

  try {
    // Persist message to database via existing service logic
    const savedMsg = await MessageService.saveMessage(roomId, username, message);
    
    // Broadcast message to everyone in the room (including sender to confirm receipt)
    io.to(roomId).emit('receive-message', savedMsg);
  } catch (err) {
    console.error('[MessageHandler] Failed to save/broadcast message:', err);
  }
};
