import { Schema, model, Document } from 'mongoose';
import { IRoom } from '../types/room.types';

export interface RoomDocument extends Omit<IRoom, '_id'>, Document { }

const roomSchema = new Schema<RoomDocument>({
  roomName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

console.log("going for the database now");

export const RoomModel = model<RoomDocument>('Room', roomSchema);
export default RoomModel;
