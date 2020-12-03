import { Message, Turn, User } from '@teikna/interfaces';
import { MessageType } from '@teikna/enums';

export class TurnModel implements Turn {
  startDateTime: Date;
  constructor() {
    this.startDateTime = new Date();
  }
}