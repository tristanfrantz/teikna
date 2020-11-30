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
  img?: string;
}

export interface Room {
  id: string;
  users: Record<string, User>;
  wordListId: string;
  correctGuess: string;
  drawingUser: User;
  roundCount: number;
  currentRound: number;
}

export interface Message {
  user: User;
  content: string;
  timestamp: Date;
  type?: MessageType;
}
