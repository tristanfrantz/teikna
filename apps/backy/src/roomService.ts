import { Room, TurnUser, User } from '@teikna/interfaces';
import { words } from './words';
import { v4 as uuidv4 } from 'uuid';
import {
  LobbyRoomModel,
  LobbyUserModel,
  RoomModel,
  TemplateRoomModel,
  TemplateTurnModel,
  TurnUserModel,
} from '@teikna/models';
import { differenceInSeconds } from 'date-fns';

export class RoomService {
  private rooms: Record<string, Room> = {};

  public createRoom = (user: User) => {
    const generatedId = uuidv4();
    this.rooms[generatedId] = new TemplateRoomModel(user, generatedId);
    this.rooms[generatedId].users[user.id] = user;
    this.rooms[generatedId].users[user.id].roomId = generatedId;
  };

  public updateRoom = (room: Room) => {
    const existingRoom = this.rooms[room.id];
    if (existingRoom) {
      const updatedRoom = new RoomModel(room);
      this.rooms[room.id] = updatedRoom;
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

  public getRoomList = () => {
    return Object.values(this.rooms);
  };

  public joinRoom = (user: User) => {
    const { id, roomId } = user;
    const userRoom = this.rooms[roomId];
    if (userRoom) {
      const users = userRoom.users;
      users[id] = user;
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

  public handleStartGame = (roomId: string) => {
    const room = this.rooms[roomId];
    if (room) {
      room.isGameInLobby = false;
    }
  };

  public handleTurnEnd = (roomId: string) => {
    const room = this.rooms[roomId];
    if (room) {
      const userList = Object.values(room.users).map((user) => user);
      const currentDrawer = room.drawingUser;
      if (currentDrawer) {
        const indexOfCurrentDrawer = userList.findIndex((user) => user.id === currentDrawer.id);
        const indexOfNewDrawer = indexOfCurrentDrawer === userList.length - 1 ? 0 : indexOfCurrentDrawer + 1;
        const newDrawer = userList[indexOfNewDrawer];
        room.drawingUser = newDrawer;
        room.isUserDrawing = false;

        const shouldIncrementRound = this.hasEveryUserDrawn(room.id);
        if (shouldIncrementRound) {
          if (room.currentRound === room.roundLimit) {
            this.handleGameEnd(roomId);
            return;
          }
          this.handleRoundEnd(roomId);
        }

        Object.keys(room.users).forEach((userId) => {
          room.users[userId].hasGuessedWord = false;
        });

        this.incrementUserScores(roomId);
      }
    }
  };

  public handleSelectWord = (roomId: string, word: string, userId: string) => {
    const room = this.rooms[roomId];
    if (room) {
      room.correctGuess = word;
      room.isUserDrawing = true;
      room.turn = new TemplateTurnModel();
      room.users[userId].hasDrawnInCurrentRound = true;
    }
  };

  public handleCorrectGuess = (roomId: string, userId: string) => {
    const room = this.rooms[roomId];
    const user = room.users[userId];

    user.hasGuessedWord = true;
    const dateNow = new Date();
    const secondsLeftToGuess = room.drawTime - differenceInSeconds(dateNow, new Date(room.turn.startDateTime));
    const calculatedGuessScore = 10 * secondsLeftToGuess;

    const turnUser: TurnUser = new TurnUserModel(user, calculatedGuessScore);
    room.turn.usersGuessedThisTurn.push(turnUser);
  };

  public getThreeRandomWords = () => {
    const threeRandomWords = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * Math.floor(words.length));
      threeRandomWords.push(words[randomIndex]);
    }
    return threeRandomWords;
  };

  public hasEveryUserGuessed = (roomId: string) => {
    const room = this.rooms[roomId];
    const userList = Object.values(room.users);
    return userList.every((user) => user.hasGuessedWord);
  };

  private hasEveryUserDrawn = (roomId: string) => {
    const room = this.rooms[roomId];
    const userList = Object.values(room.users);
    return userList.every((user) => user.hasDrawnInCurrentRound);
  };

  private incrementUserScores = (roomId: string) => {
    const room = this.rooms[roomId];
    const userList = Object.values(room.users);
    userList.forEach((user) => {
      const userInTurn = room.turn.usersGuessedThisTurn.find((u) => u.id === user.id);
      if (userInTurn) {
        room.users[user.id].score += userInTurn.score;
      }
    });
  };

  private handleGameEnd = (roomId: string) => {
    const room = this.getRoom(roomId);

    Object.keys(room.users).forEach((userId) => {
      const user = room.users[userId];
      room.users[userId] = new LobbyUserModel(user);
    });

    const lobbyRoom = new LobbyRoomModel(room);
    this.rooms[roomId] = lobbyRoom;
  };

  private handleRoundEnd = (roomId: string) => {
    const room = this.getRoom(roomId);
    room.currentRound += 1;
    Object.keys(room.users).forEach((userId) => {
      room.users[userId].hasDrawnInCurrentRound = false;
    });
  };

  // private handleDraw = (roomId: string) => {
  //   const room = this.getRoom(roomId);


  // }
}
