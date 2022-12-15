import React, { useContext } from 'react';
import { Checkers } from './CheckersContext';
import { Spot } from './Spot';

export function Board() {
  const { boardArray } = useContext(Checkers);

  return (
    <div className="app-board">
      {boardArray.map(num => <Spot key={num} id={num} />)}
    </div>
  )
}
