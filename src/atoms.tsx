import { atom } from 'recoil';

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

export const todoState = atom<IToDoState>({
  key: 'mock',
  default: {
    TO_DO: [
      { id: 1, text: 'hello' },
      { id: 2, text: 'hi' },
      { id: 3, text: 'nice' },
    ],
    IN_PROGRESS: [],
    COMPLETE: [],
  },
});
