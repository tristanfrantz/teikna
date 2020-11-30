import { DrawData, Message, Room, User } from '@teikna/interfaces';
import { Socket, Server } from 'socket.io';
import { MessageService } from './messageService';
import { compareTwoStrings } from 'string-similarity';
import { words } from './words';

export class RoomService {
  private rooms: Record<string, Room> = {};

  public createRoom = (room: Room) => {
    this.rooms[room.id] = room;
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
    const { id, roomId: room } = user;
    const userRoom = this.rooms[room];
    if (userRoom) {
      const users = userRoom.users;
      users[id] = user;
      const updateUserList = Object.values(users).filter((u) => u.roomId === user.roomId);
    } else {
      this.rooms[room] = this.generateTemplateRoom(user);
    }
  };

  public leaveRoom = (user: User) => {
    const room = this.rooms[user.roomId];
    if (room) {
      delete room.users[user.id];
    }
  };

  public getRoom = (roomId: string) => {
    return this.rooms[roomId];
  };

  public updateRoomUserList = (user: User) => {
    if (this.rooms[user.roomId]) {
      this.rooms[user.roomId].users[user.id] = user;
    } else {
      this.rooms[user.roomId] = this.generateTemplateRoom(user);
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

  private generateTemplateRoom = (user: User) => {
    const templateRoom: Room = {
      id: user.roomId,
      users: { [user.id]: user },
      currentRound: 0,
      wordListId: '',
      correctGuess: '',
      roundCount: 1,
      drawingUser: user,
    };
    return templateRoom;
  };
}
