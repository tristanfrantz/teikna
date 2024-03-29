import { Room, User } from '@teikna/interfaces';
import create from 'zustand';

type State = {
  user?: User;
  room?: Room;
  wordList: string[];
  setUser: (user: User) => void;
  setRoom: (room: Room) => void;
  setWordList: (words: string[]) => void;
};

export const useStore = create<State>((set, get) => ({
  user: undefined,
  room: undefined,
  wordList: [],
  setUser: (user) => set(() => ({ user })),
  setRoom: (room) => set(() => ({ room })),
  setWordList: (wordList) => set(() => ({ wordList })),
}));


// extractors
export const extractIsUserDrawing = (state: State) => {
  const { room, user } = state;
  if (!room || !user) {
    return false
  }
  return room.drawingUser.id === user.id;
}
