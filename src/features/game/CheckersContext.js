import { createContext } from 'react';

export const Side = {
  LIGHT: { name: 'Light', value: 1 },
  DARK: { name: 'Dark', value: -1 },
  NONE: { name: 'None', value: 0 },
};

export const Type = {
  MAN: 'MAN',
  KING: 'KING',
};

const ManDark = {
  active: false,
  selected: false,
  type: Type.MAN,
  side: Side.DARK,
  content: '\u{25C9}'
};

const ManLight = {
  active: false,
  selected: false,
  type: Type.MAN,
  side: Side.LIGHT,
  content: '\u{25CE}'
};

export const none = {
  active: false,
  selected: false,
  type: '',
  side: Side.NONE,
  content: '',
};

export const CheckersDefaultValue = {
  boardArray: [...new Array(50).keys()],
  currentPiece: null,
  currentSide: Side.LIGHT,
  setActiveSpot: () => {},
  checkersPieces: [
    ...new Array(20).fill(ManDark),
    ...new Array(10).fill(none),
    ...new Array(20).fill(ManLight),
  ],
}

export const Checkers = createContext(CheckersDefaultValue);
