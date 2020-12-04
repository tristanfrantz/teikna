import { Room, Turn, User } from '@teikna/interfaces';
import { TemplateTurnModel } from './turnModel';

abstract class AbstractRoomModel implements Room {
  id!: string;
  users!: Record<string, User>;
  correctGuess!: string;
  drawingUser!: User;
  roundLimit!: number;
  drawTime!: number;
  currentRound!: number;
  adminUserId!: string;
  isGameInLobby!: boolean;
  isUserDrawing!: boolean;
  turn!: Turn;
}

export class RoomModel extends AbstractRoomModel {
  constructor(room: Room) {
    super();
    this.id = room.id;
    this.users = room.users;
    this.correctGuess = room.correctGuess;
    this.drawingUser = room.drawingUser;
    this.roundLimit = room.roundLimit;
    this.drawTime = room.drawTime;
    this.currentRound = room.currentRound;
    this.adminUserId = room.adminUserId;
    this.isGameInLobby = room.isGameInLobby;
    this.isUserDrawing = room.isUserDrawing;
    this.turn = room.turn;
  }
}

export class TemplateRoomModel extends AbstractRoomModel {
  constructor(user: User, id: string) {
    super();
    this.id = id;
    this.users = {};
    this.correctGuess = '';
    this.drawingUser = user;
    this.roundLimit = 3;
    this.drawTime = 50;
    this.currentRound = 1;
    this.adminUserId = user.id;
    this.isGameInLobby = true;
    this.isUserDrawing = false;
    this.turn = new TemplateTurnModel();
  }
}

export class LobbyRoomModel extends AbstractRoomModel {
  constructor(room: Room) {
    super();
    this.id = room.id;
    this.users = room.users;
    this.correctGuess = '';
    this.drawingUser = room.drawingUser;
    this.roundLimit = room.roundLimit;
    this.drawTime = room.drawTime;
    this.currentRound = 1;
    this.adminUserId = room.adminUserId;
    this.isGameInLobby = true;
    this.isUserDrawing = false;
    this.turn = new TemplateTurnModel();
  }
}
