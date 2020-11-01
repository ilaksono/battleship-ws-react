import React from 'react';
import './Square.scss';
const Square = p => {
  return (
    <div className='board-node' id={p.id} onClick={event => p.nodeOnClick(event)}>
      {p.val && p.val}
    </div>
  );
}

export default Square;