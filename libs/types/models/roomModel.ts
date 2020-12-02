import { Room, User } from '@teikna/interfaces';

abstract class AbstractRoomModel implements Room {
  id!: string;
  users!: Record<string, User>;
  correctGuess!: string;
  drawingUser!: User;
  roundLimit!: number;
  drawTime!: number;
  currentRound!: number;
  adminUserId!: string;
  hasGameStarted!: boolean;
  isUserDrawing!: boolean;
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
    this.hasGameStarted = room.hasGameStarted;
    this.isUserDrawing = room.isUserDrawing;
  }
}

export class TemplateRoomModel extends AbstractRoomModel {
  constructor(user: User, id: string) {
    super();
    this.id = id;
    this.users = { [user.id]: user };
    this.correctGuess = '';
    this.drawingUser = user;
    this.roundLimit = 3;
    this.drawTime = 50;
    this.currentRound = 1;
    this.adminUserId = user.id;
    this.hasGameStarted = false;
    this.isUserDrawing = false;
  }
}
