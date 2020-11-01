import React from 'react';
import Board from './Board';

const Battle = p => {

  return (
    <div className='battle-container'>
      <Board board={p.board}/>
      <Board board={p.oppo} nodeOnClick={p.nodeOnClick}/> 
    </div>
  )

}

export default Battle;