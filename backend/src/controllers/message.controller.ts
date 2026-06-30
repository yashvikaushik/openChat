import { Request, Response, NextFunction } from 'express';
import { MessageService } from '../services/message.service';
import { RoomService } from '../services/room.service';

export class MessageController {
  static async getMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roomId } = req.params;
      if (!roomId) {
        res.status(400).json({ message: 'roomId parameter is required' });
        return;
      }

      // Check if room exists
      const room = await RoomService.getRoomById(roomId);
      if (!room) {
        res.status(404).json({ message: 'Room not found' });
        return;
      }

      const messages = await MessageService.getMessagesByRoom(roomId);
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  }

  static async createMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roomId, username, message } = req.body;
      if (!roomId || !username || !message) {
        res.status(400).json({ message: 'roomId, username, and message are required' });
        return;
      }

      // Validate room exists
      const room = await RoomService.getRoomById(roomId);
      if (!room) {
        res.status(404).json({ message: 'Room not found' });
        return;
      }

      const savedMessage = await MessageService.saveMessage(roomId, username, message);
      res.status(201).json(savedMessage);
    } catch (error) {
      next(error);
    }
  }
}
export default MessageController;
