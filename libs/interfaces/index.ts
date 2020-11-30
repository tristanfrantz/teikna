export interface Coordinates {
    x: number;
    y: number;
  }
  
  export interface DrawData {
    start: Coordinates;
    end: Coordinates;
    color: string;
    lineWidth: number;
  }
  
  export interface User {
    id: string;
    name: string;
    room: string;
    score: number;
    hasGuessedWord: boolean;
    img?: string;
  }
  
  export interface Room {
    id: string;
    users: Record<string, User>;
    wordListId: string;
    selectedWord: string;
    selectedUser: User;
    roundCount: number;
    currentRound: number;
  }
  
  export interface Message {
    user: User;
    content: string;
  }
  