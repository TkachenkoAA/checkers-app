import React, { useContext } from 'react';
import { Checkers } from './CheckersContext';

export function Player() {
  const { currentSide } = useContext(Checkers);
  
  return (
    <div className="app-player">
      {currentSide.name}
    </div>
  )
}
