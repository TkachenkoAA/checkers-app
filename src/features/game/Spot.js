import React, { useContext } from 'react';
import classNames from 'classnames';
import { Checkers } from './CheckersContext';

export function Spot({ id }) {
  const { checkersPieces, setActiveSpot } = useContext(Checkers);
  
  const setNewActiveSpot = () => setActiveSpot(id);

  return (
    <button
      onClick={setNewActiveSpot}
      className={classNames('checkers-piece', {
        'checkers-piece-odd': ((id / 5) % 2) === 1,
        'checkers-piece-active': checkersPieces[id].active,
        'checkers-piece-selected': checkersPieces[id].selected,
        'checkers-piece-light': (checkersPieces[id].side.value === 1),
        'checkers-piece-dark': (checkersPieces[id].side.value === -1),
      })}
    >
      {/* {checkersPieces[id].content} */}
      {id}
    </button>
  )
}
