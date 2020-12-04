import { MessageType } from '@teikna/enums';

export interface Coordinates {
  x: number;
  y: number;
}

export interface DrawData {
  start: Coordinates;
  end: Coordinates;
  color: string;
  lineWidth: number;
  room: string;
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
  hasGameStarted: boolean;
  isUserDrawing: boolean;
  turn: Turn;
}

export interface Turn {
  startDateTime: Date;
  usersGuessedThisTurn: TurnUser[];
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
