import { MessageType } from '@teikna/enums';
export interface DrawData {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  color: string;
  lineWidth: number;
}

export interface User {
  id: string;
  name: string;
  roomId: string;
  score: number;
  hasGuessedWord: boolean;
  hasDrawnInCurrentRound: boolean;
  img?: string;
}

export interface Room {
  id: string;
  users: Record<string, User>;
  drawingUser: User;
  adminUserId: string;
  correctGuess: string;
  roundLimit: number;
  currentRound: number;
  drawTime: number;
  isGameInLobby: boolean;
  isUserDrawing: boolean;
  turn: Turn;
}

export interface Turn {
  startDateTime: Date;
  usersGuessedThisTurn: TurnUser[];
  draws: Array<DrawData>;
}

export interface TurnUser {
  id: string;
  name: string;
  dateTimeOfGuess: Date;
  score: number;
}

export interface Message {
  user?: User;
  content: string;
  timestamp: Date;
  type?: MessageType;
}
