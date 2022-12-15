import React, { Fragment, memo, useContext } from 'react';
import classNames from 'classnames';
import { Checkers } from '../game/CheckersContext';

function CheckersBackgroundLayout() {
  const { boardArray } = useContext(Checkers);
  return (
    <div className="checkers-layout">
      {boardArray.map(item => (
        <Fragment key={`${item}-even`}>
          <div className={classNames('checkers-bg-spot', {
            'checkers-bg-spot-odd': (((item * 2) + Math.floor((item * 2) / 10)) % 2) === 1
          })} />
          <div className={classNames('checkers-bg-spot', {
            'checkers-bg-spot-odd': ((((item * 2) + 1) + Math.floor(((item * 2) + 1) / 10)) % 2) === 1
          })} />
        </Fragment>
      ))}
    </div>
  )
}

export const Layout = memo(CheckersBackgroundLayout, () => true)
