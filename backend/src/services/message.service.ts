import MessageModel, { MessageDocument } from '../models/message.model';

export class MessageService {
  static async getMessagesByRoom(roomId: string): Promise<MessageDocument[]> {
    return MessageModel.find({ roomId }).sort({ createdAt: 1 });
  }

  static async saveMessage(roomId: string, username: string, message: string): Promise<MessageDocument> {
    const newMessage = new MessageModel({
      roomId,
      username,
      message
    });
    return newMessage.save();
  }
}
