import React from 'react';
import Row from './Row.js'
import './Board.scss'

const Board = p => {
  
  const parsedRows = p.board.map((val, index) => {
    return (
      <Row key={index} id={index} row={val} nodeOnClick={p.nodeOnClick}/>
    )
  })
  return (
    <div className='board-container'>
      {parsedRows}
    </div>
  )
}

export default Board;