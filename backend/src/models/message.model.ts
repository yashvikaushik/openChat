import { Schema, model, Document } from 'mongoose';
import { IMessage } from '../types/message.types';

export interface MessageDocument extends Omit<IMessage, '_id'>, Document {}

const messageSchema = new Schema<MessageDocument>({
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const MessageModel = model<MessageDocument>('Message', messageSchema);
export default MessageModel;
