import { ISocketUser } from '../types/socket.types';

export class SocketService {
  // Maps socket.id to ISocketUser metadata
  private static usersMap = new Map<string, ISocketUser>();

  static joinUser(socketId: string, username: string, roomId: string): ISocketUser {
    const user: ISocketUser = { socketId, username, roomId };
    this.usersMap.set(socketId, user);
    console.log(`[SocketService] User "${username}" joined socket room "${roomId}" (Socket: ${socketId})`);
    return user;
  }

  static leaveUser(socketId: string): ISocketUser | null {
    const user = this.usersMap.get(socketId);
    if (user) {
      this.usersMap.delete(socketId);
      console.log(`[SocketService] User "${user.username}" disconnected (Socket: ${socketId})`);
      return user;
    }
    return null;
  }

  static getRoomUsers(roomId: string): ISocketUser[] {
    const matchedUsers: ISocketUser[] = [];
    for (const user of this.usersMap.values()) {
      if (user.roomId === roomId) {
        matchedUsers.push(user);
      }
    }
    return matchedUsers;
  }
}
