import { Room, User } from '@teikna/interfaces';
import { words } from './words';
import { v4 as uuidv4 } from 'uuid';
import { RoomModel, TemplateRoomModel } from '@teikna/models';

export class RoomService {
  private rooms: Record<string, Room> = {};

  public createRoom = (user: User) => {
    const generatedId = uuidv4();
    this.rooms[generatedId] = new TemplateRoomModel(user, generatedId);
    this.rooms[generatedId].users[user.id].roomId = generatedId;
    return this.rooms[generatedId];
  };

  public updateRoom = (room: Room) => {
    const existingRoom = this.rooms[room.id];
    if (existingRoom) {
      const updatedRoom = new RoomModel(room);
      this.rooms[room.id] = updatedRoom;
      return updatedRoom;
    }
  };

  public getRoomUsers = (roomId: string) => {
    const room = this.rooms[roomId];
    if (room) {
      const roomUsers = Object.values(room.users).map((user) => user);
      return roomUsers;
    }
    return [];
  };

  public joinRoom = (user: User) => {
    const { id, roomId } = user;
    const userRoom = this.rooms[roomId];
    if (userRoom) {
      const users = userRoom.users;
      users[id] = user;
      return userRoom;
    }
  };

  public leaveRoom = (user: User) => {
    const room = this.rooms[user.roomId];
    if (room) {
      delete room.users[user.id];
      return room;
    }
  };

  public getRoom = (roomId: string) => {
    return this.rooms[roomId];
  };

  public updateRoomUserList = (user: User) => {
    if (this.rooms[user.roomId]) {
      this.rooms[user.roomId].users[user.id] = user;
    }
  };

  public handleRoundStart = (roomId: string) => {
    const room = this.rooms[roomId];
    if (room) {
      const userList = Object.values(room.users).map((user) => user);
      const currentDrawer = room.drawingUser;
      console.log('i found room');
      if (currentDrawer) {
        console.log('i found drawer');
        const indexOfCurrentDrawer = userList.findIndex((user) => user.id === room.drawingUser.id);
        const indexOfNewDrawer = indexOfCurrentDrawer === userList.length - 1 ? 0 : indexOfCurrentDrawer + 1;
        const newDrawer = userList[indexOfNewDrawer];
        room.drawingUser = newDrawer;
        userList.forEach((_, index) => {
          userList[index].hasGuessedWord = false;
        });

        console.log('i finished everything');
      }
    }
  };

  public handleSelectWord = (roomId: string, word: string) => {
    const room = this.rooms[roomId];
    if (room) {
      room.correctGuess = word;
    }
  };

  public getThreeRandomWords = () => {
    const threeRandomWords = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * Math.floor(words.length));
      threeRandomWords.push(words[randomIndex]);
    }
    return threeRandomWords;
  };
}
