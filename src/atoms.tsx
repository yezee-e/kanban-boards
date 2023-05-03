import { atom } from 'recoil';

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue: ITodo) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const todoState = atom<IToDoState>({
  key: 'mock',
  default: {
    할일: [],
    하는중: [],
    끝: [],
  },
  effects: [localStorageEffect('kanban-board')],
});

export const isDarkAtom = atom({
  key: 'isDark',
  default: false,
});
