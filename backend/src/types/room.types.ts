export interface IRoom {
  _id?: any;
  roomName: string;
  createdAt: Date;
}

export interface CreateRoomRequest {
  roomName: string;
}
