import { DrawData, Message, Turn, TurnUser, User } from '@teikna/interfaces';
import { MessageType } from '@teikna/enums';

export class TemplateTurnModel implements Turn {
  startDateTime: Date;
  usersGuessedThisTurn: TurnUser[];
  draws: Array<DrawData>
  constructor() {
    this.startDateTime = new Date();
    this.usersGuessedThisTurn = [];
    this.draws = [];
  }
}

export class TurnUserModel implements TurnUser {
  id: string;
  name: string;
  dateTimeOfGuess: Date;
  score: number;

  constructor(user: User, calculatedScore: number) {
    this.id = user.id;
    this.name = user.name;
    this.dateTimeOfGuess = new Date();
    this.score = calculatedScore;
  }
}
