import { Room, User } from '@teikna/interfaces';

abstract class AbstractRoomModel implements Room {
  id!: string;
  users!: Record<string, User>;
  correctGuess!: string;
  drawingUser!: User;
  roundCount!: number;
  drawingTime!: number;
  currentRound!: number;
  adminUserId?: string;
  hasGameStarted!: boolean;
}

export class RoomModel extends AbstractRoomModel {
  constructor(room: Room) {
    super();
    this.id = room.id;
    this.users = room.users;
    this.correctGuess = room.correctGuess;
    this.drawingUser = room.drawingUser;
    this.roundCount = room.roundCount;
    this.drawingTime = room.drawingTime;
    this.currentRound = room.currentRound;
    this.adminUserId = room.adminUserId;
    this.hasGameStarted = room.hasGameStarted;
  }
}

export class TemplateRoomModel extends AbstractRoomModel {
  constructor(user: User, id: string) {
    super();
    this.id = id;
    this.users = { [user.id]: user };
    this.correctGuess = '';
    this.drawingUser = user;
    this.roundCount = 3;
    this.drawingTime = 50;
    this.currentRound = 1;
    this.adminUserId = user.id;
    this.hasGameStarted = false;
  }
}
