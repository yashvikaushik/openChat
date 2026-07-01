import { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/room.service';

export class RoomController {
  static async getRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rooms = await RoomService.getAllRooms();
      res.status(200).json(rooms);
    } catch (error) {
      next(error);
    }
  }

  static async getRoomById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const room = await RoomService.getRoomById(id);
      if (!room) {
        res.status(404).json({ message: 'Room not found' });
        return;
      }
      res.status(200).json(room);
    } catch (error) {
      next(error);
    }
  }

  static async createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("Controller create room ke andar ")
      const { roomName } = req.body;
      if (!roomName || typeof roomName !== 'string') {
        res.status(400).json({ message: 'roomName is required' });
        return;
      }

      const trimmedName = roomName.trim();
      if (trimmedName.length < 3 || trimmedName.length > 30) {
        res.status(400).json({ message: 'roomName must be between 3 and 30 characters' });
        return;
      }
      console.log("going to check duplicate room by calling function of srvive layer")
      // Check duplicate
      const exists = await RoomService.roomExists(trimmedName);
      if (exists) {
        res.status(400).json({ message: 'Room already exists' });
        return;
      }
      console.log("no duplicate room exists");
      console.log("now going inside service create room");
      const room = await RoomService.createRoom(trimmedName);
      console.log("after creating room in service")
      res.status(201).json(room);
    } catch (error) {
      next(error);
    }
  }
}
export default RoomController;
