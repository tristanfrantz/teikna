import { User } from '@teikna/interfaces';

export class LobbyUserModel implements User {
  id!: string;
  name!: string;
  roomId!: string;
  score!: number;
  hasGuessedWord!: boolean;
  hasDrawnInCurrentRound!: boolean;
  img?: string;
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.roomId = user.roomId;
    this.score = 0;
    this.hasGuessedWord = false;
    this.hasDrawnInCurrentRound = false;
    this.img = user.img;
  }
}
