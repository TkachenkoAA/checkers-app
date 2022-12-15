import React, { useState } from 'react';
import { Board } from './Board';
import { Player } from './Player';
import { Checkers, CheckersDefaultValue, Side, none } from './CheckersContext';

function getMatrixOffset(id, side) {
  if (side === Side.DARK) {
    const offset = Math.floor(id / 5) % 2 === 1 ? 0 : 1;
    const row = Math.floor(id / 5);
    const col = id - (row * 5)
    const matchId = ((row + 1) * 5) + col;
    return [matchId - 1 + offset, matchId + offset];
  } else {
    const offset = Math.floor(id / 5) % 2 === 1 ? 1 : 0;
    const row = Math.floor(id / 5);
    const col = id - (row * 5)
    const matchId = ((row - 1) * 5) + col;
    return [matchId - offset, matchId + 1 - offset];
  }
}

function waitAttack(state, id) {
  let nextSide = state.currentSide;

  if (!state.attackingPieces.some(index => index === id)) {
    return state;
  }

  if (state.currentSide === Side.DARK) {
    nextSide = Side.LIGHT;
  } else {
    nextSide = Side.DARK;
  }
  const [leftTopIndex, rightTopIndex] = getMatrixOffset(state.currentPiece, Side.LIGHT);
  const [leftBottomIndex, rightBottomIndex] = getMatrixOffset(state.currentPiece, Side.DARK);
  const invertedIndexMap = {
    [leftTopIndex]: rightBottomIndex,
    [rightTopIndex]: leftBottomIndex,
    [rightBottomIndex]: leftTopIndex,
    [leftBottomIndex]: rightTopIndex,
  };

  const checkersPieces = state.checkersPieces.reduce((acc, item, index) => {
    if (index === invertedIndexMap[id]) {
      return acc.concat({ ...state.checkersPieces[id], active: false, selected: false })
    }

    if (state.currentPiece === index || id === index) {
      return acc.concat(none);
    }

    return acc.concat({ ...item, active: false, selected: false });
  }, []);

  return {
    checkersPieces,
    currentPiece: id,
    currentSide: nextSide,
    attackingPieces: [],
  };
}

function makeAttack(state, id) {
  let nextSide = state.currentSide;

  if (state.currentSide === Side.DARK) {
    nextSide = Side.LIGHT;
  } else {
    nextSide = Side.DARK;
  }

  const [leftTopIndex, rightTopIndex] = getMatrixOffset(id, Side.LIGHT);
  const [leftBottomIndex, rightBottomIndex] = getMatrixOffset(id, Side.DARK);
  const invertedIndexMap = {
    [leftTopIndex]: rightBottomIndex,
    [rightTopIndex]: leftBottomIndex,
    [rightBottomIndex]: leftTopIndex,
    [leftBottomIndex]: rightTopIndex,
  };

  const checkersPieces = state.checkersPieces.reduce((acc, item, index) => {
    if (index === invertedIndexMap[state.currentPiece]) {
      return acc.concat({ ...state.checkersPieces[state.currentPiece], active: false, selected: false })
    }

    if (state.currentPiece === index || id === index) {
      return acc.concat(none);
    }

    return acc.concat({ ...item, active: false, selected: false });
  }, []);

  return {
    checkersPieces,
    currentPiece: id,
    currentSide: nextSide,
    attackingPieces: [],
  }
}

function makeMove(state, id) {
  const selectedSpot = state.checkersPieces[id];
  let nextSide = state.currentSide;

  if (state.currentSide === Side.DARK) {
    nextSide = Side.LIGHT;
  } else {
    nextSide = Side.DARK;
  }

  const checkersPieces = state.checkersPieces.reduce((acc, item, index) => {
    if (id === index) {
      return acc.concat({ ...state.checkersPieces[state.currentPiece], active: false, selected: false })
    }

    if (state.currentPiece === index) {
      return acc.concat({ ...selectedSpot, active: false, selected: false })
    }

    return acc.concat({ ...item, active: false, selected: false });
  }, []);

  let attackingPieces = [];
  const [leftTopIndex, rightTopIndex] = getMatrixOffset(id, state.currentSide);
  const [leftBottomIndex, rightBottomIndex] = getMatrixOffset(id, nextSide);
  const invertedIndexMap = {
    [leftTopIndex]: rightBottomIndex,
    [rightTopIndex]: leftBottomIndex,
    [rightBottomIndex]: leftTopIndex,
    [leftBottomIndex]: rightTopIndex,
  };

  const checkersPieces2 = checkersPieces.reduce((acc, item, index) => {
    const spotFrontMatchIndex = (index === leftTopIndex) || (index === rightTopIndex)
    const spotBackMatchIndex = (index === leftBottomIndex) || (index === rightBottomIndex);

    if ((spotFrontMatchIndex || spotBackMatchIndex) && (checkersPieces[index].side === nextSide)) {
      if (checkersPieces[invertedIndexMap[index]].side === Side.NONE) {
        attackingPieces.push(index);
        return acc.concat({ ...item, active: true, selected: false });
      }
    }

    return acc.concat(item);
  }, []);

  if (attackingPieces.length) {
    checkersPieces2[id].active = true;
    checkersPieces2[id].selected = true;
  }

  return {
    checkersPieces: checkersPieces2,
    currentPiece: id,
    currentSide: nextSide,
    attackingPieces,
  }
}

function observeMoves(state, id) {
  const selectedSpot = state.checkersPieces[id];
  let nextSide = state.currentSide;

  const otherSide = selectedSpot.side === Side.DARK ? Side.LIGHT : Side.DARK;
  const [leftBottomIndex, rightBottomIndex] = getMatrixOffset(id, otherSide);
  const [leftTopIndex, rightTopIndex] = getMatrixOffset(id, selectedSpot.side);

  const checkersPieces = state.checkersPieces.reduce((acc, item, index) => {
    const currentSpot = (index === id);
    const isAnotherSideSpot = item.side !== state.currentSide;
    const selectedSpotOnSomeSide = selectedSpot.side === state.currentSide;
    const spotFrontMatchIndex = (index === leftTopIndex) || (index === rightTopIndex)
    const spotBackMatchIndex = (index === leftBottomIndex) || (index === rightBottomIndex);

    if (currentSpot || (isAnotherSideSpot && selectedSpotOnSomeSide && (spotFrontMatchIndex || spotBackMatchIndex))) {
      if (spotFrontMatchIndex || spotBackMatchIndex) {
        const [x] = getMatrixOffset(leftTopIndex, state.currentSide);
        const [, y] = getMatrixOffset(rightTopIndex, state.currentSide);

        const [x2] = getMatrixOffset(leftBottomIndex, otherSide);
        const [, y2] = getMatrixOffset(rightBottomIndex, otherSide);

        const frontDirectionIndex = index === leftTopIndex ? x : y;
        const backDirectionIndex = index === leftBottomIndex ? x2 : y2;

        if (spotFrontMatchIndex && state.checkersPieces[index].side === Side.NONE) {
          return acc.concat({ ...item, active: true, selected: false });
        }

        if (
          (state.checkersPieces[index].side === otherSide) && (
          (spotBackMatchIndex && state.checkersPieces[backDirectionIndex].side === Side.NONE) ||
          (spotFrontMatchIndex && state.checkersPieces[frontDirectionIndex].side === Side.NONE)
        )) {
          return acc.concat({ ...item, active: true, selected: true });
        }
        return acc.concat({ ...item, active: false, selected: false });
      }

      return acc.concat({ ...item, active: true, selected: true });
    } else {
      return acc.concat({ ...item, active: false, selected: false });
    }
  }, []);

  return {
    checkersPieces,
    currentPiece: id,
    currentSide: nextSide,
    attackingPieces: [],
  }
}

export function CheckerGame() {
  const [spotState, updateActiveSpot] = useState({
    checkersPieces: CheckersDefaultValue.checkersPieces,
    currentPiece: CheckersDefaultValue.currentPiece,
    currentSide: CheckersDefaultValue.currentSide,
    attackingPieces: [],
  });

  const setActiveSpot = (id) => updateActiveSpot((state) => {
    const selectedSpot = state.checkersPieces[id];

    if (state.attackingPieces.length) {
      return waitAttack(state, id);
    }

    if (id !== state.currentPiece && selectedSpot.side !== state.currentSide && selectedSpot.side !== Side.NONE && selectedSpot.selected) {
      return makeAttack(state, id)
    }

    if (id !== state.currentPiece && selectedSpot.active && selectedSpot.side === Side.NONE) {
      return makeMove(state, id)
    }

    return observeMoves(state, id);
  });

  return (
    <Checkers.Provider value={{
      ...CheckersDefaultValue,
      checkersPieces: spotState.checkersPieces,
      currentPiece: spotState.currentPiece,
      currentSide: spotState.currentSide,
      setActiveSpot
    }}>
      <Board />
      <Player />
    </Checkers.Provider>
  )
}