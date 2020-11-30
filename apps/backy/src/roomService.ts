import { DrawData, Message, Room, User } from '@teikna/interfaces';
import { Socket, Server } from 'socket.io';
import { MessageService } from './messageService';
import { compareTwoStrings } from 'string-similarity';
import { words } from './words';

export class RoomService {
  private messageService: MessageService;
  private rooms: Record<string, Room> = {};

  constructor(ioServer: Server) {
    this.messageService = new MessageService(ioServer);
  }

  public createRoom = (room: Room) => {
    this.rooms[room.id] = room;
  };

  public joinRoom = (user: User, socket: Socket) => {
    const { id, room } = user;
    const userRoom = this.rooms[room];
    if (userRoom) {
      const users = userRoom.users;
      users[id] = user;
      this.messageService.emitUserJoined(user, socket, userRoom);
      const updateUserList = Object.values(users).filter((u) => u.room === user.room);
      this.messageService.emitUserList(updateUserList, room);
    } else {
      this.rooms[room] = this.generateTemplateRoom(user);
    }
  };

  public leaveRoom = (user: User, socket: Socket) => {
    const room = this.rooms[user.room];
    if (room) {
      this.messageService.emitUserLeft(user, socket);

      const updateUserList = Object.values(room.users).filter((u) => u.room === user.room);
      this.messageService.emitUserList(updateUserList, user.room);
      delete room.users[socket.id];
    }
  };

  public handleMessage = (message: Message, socket: Socket) => {
    const { user, content } = message;
    const userRoom = this.rooms[user.room];
    if (userRoom) {
      const selectedWord = userRoom.correctGuess;
      const wordSimilarity = compareTwoStrings(selectedWord, content);
      if (wordSimilarity === 1) {
        userRoom.users[user.id].hasGuessedWord = true;
        userRoom.users[user.id].score += 100;
        this.messageService.emitCorrectGuess(user);
      } else if (wordSimilarity >= 0.8) {
        this.messageService.emitCloseGuess(message, socket);
      } else {
        this.messageService.emitMessage(message, socket);
      }
    }
  };

  public handleDraw = (drawData: DrawData, socket: Socket) => {
    this.messageService.emitDrawing(drawData, socket);
  };

  public updateRoomUserList = (user: User) => {
    if (this.rooms[user.room]) {
      this.rooms[user.room].users[user.id] = user;
    } else {
      this.rooms[user.room] = this.generateTemplateRoom(user);
    }
  };

  public handleRoundEnd = (roomId: string) => {
    const room = this.rooms[roomId];
    if (room) {
      const correctguess = room.correctGuess;
      this.messageService.emitRoundEndMessage(roomId, correctguess);

      const updateUserList = Object.values(room.users).filter((u) => u.room === roomId);
      this.messageService.emitUserList(updateUserList, roomId);
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

        const threeRandomWords = this.pickThreeWords();
        this.messageService.emitWordsToUser(threeRandomWords, newDrawer.id);
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

  private pickThreeWords = () => {
    const threeRandomWords = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * Math.floor(words.length));
      threeRandomWords.push(words[randomIndex]);
    }
    return threeRandomWords;
  };

  private generateTemplateRoom = (user: User) => {
    const templateRoom: Room = {
      id: user.room,
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
