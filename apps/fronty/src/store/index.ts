import { Room, User } from '@teikna/interfaces';
import create from 'zustand';

type State = {
  user: User | null;
  room: Room | null;
  wordList: string[];
  setUser: (user: User) => void;
  setRoom: (room: Room) => void;
  setWordList: (words: string[]) => void;
};

export const useStore = create<State>((set) => ({
  user: null,
  room: null,
  wordList: [],
  setUser: (user) => set(() => ({ user })),
  setRoom: (room) => set(() => ({ room })),
  setWordList: (wordList) => set(() => ({ wordList })),
}));
