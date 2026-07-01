import MessageModel, { MessageDocument } from '../models/message.model';

export class MessageService {
  static async getMessagesByRoom(roomId: string): Promise<MessageDocument[]> {
    console.log("inside message service to get all messages");
    return MessageModel.find({ roomId }).sort({ createdAt: 1 });
  }

  static async saveMessage(roomId: string, username: string, message: string): Promise<MessageDocument> {
    console.log("going inside the message service ");
    const newMessage = new MessageModel({
      roomId,
      username,
      message
    });
    console.log("new message received and saved");
    return newMessage.save();
  }
}
