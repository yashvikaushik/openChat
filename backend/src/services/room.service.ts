import RoomModel, { RoomDocument } from '../models/room.model';

export class RoomService {
  static async getAllRooms(): Promise<RoomDocument[]> {
    return RoomModel.find({}).sort({ roomName: 1 });
  }

  static async getRoomById(id: string): Promise<RoomDocument | null> {
    console.log("finding and returning the desired room");
    return RoomModel.findById(id);
  }

  static async getRoomByName(roomName: string): Promise<RoomDocument | null> {
    return RoomModel.findOne({ roomName });
  }

  static async createRoom(roomName: string): Promise<RoomDocument> {
    console.log("Inside create rooom service");
    const newRoom = new RoomModel({ roomName });
    console.log("After saving in service");
    return newRoom.save();

  }

  static async roomExists(roomName: string): Promise<boolean> {
    const count = await RoomModel.countDocuments({ roomName });
    return count > 0;
  }
}
