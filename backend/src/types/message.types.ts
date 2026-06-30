export interface IMessage {
  _id?: any;
  roomId: any;
  username: string;
  message: string;
  createdAt: Date;
}

export interface CreateMessageRequest {
  roomId: string;
  username: string;
  message: string;
}
