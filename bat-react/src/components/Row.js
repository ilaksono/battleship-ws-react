import React from 'react';
import Square from './Square.js';
import './Row.scss';
const Row = p => {
  const parsedNodes = p.row.map((node, index) => {
    return (<Square val={p.row[index]} key={p.id * 10 + index} id={p.id * 10 + index} nodeOnClick={p.nodeOnClick}/>)
  })
  
  return (
    <div className='board-row'>
      {parsedNodes}
    </div>
  )
}

export default Row;