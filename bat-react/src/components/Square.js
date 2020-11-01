import React from 'react';
import './Square.scss';
const Square = p => {
  const className = `${p.val === 'X' && 'hit-square'} ${p.val === 'O' && 'miss-square'} board-node`
  return (
    <div className={className} id={p.id} onClick={event => p.nodeOnClick(event)}>
      {p.val && p.val}
    </div>
  );
}

export default Square;