export interface ISocketUser {
  socketId: string;
  username: string;
  roomId: string;
}

export interface JoinRoomPayload {
  roomId: string;
  username: string;
}

export interface SendMessagePayload {
  roomId: string;
  username: string;
  message: string;
}
