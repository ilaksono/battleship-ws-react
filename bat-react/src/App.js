import React from 'react';
import Board from './components/Board';
import './App.css';
import LoginForm from './components/LoginForm';
import useApplicationData from './helpers/gameHelpers';
import Battle from './components/Battle';



function App() {
  const { state,
    nodeOnClick,
    setTheBoard,
    battleClickHandler,
    setSingleBoard } = useApplicationData();



  return (
    <div className="App">
      <div className='c-error'>{state.errMsg && state.errMsg}</div>
      {state.phase === 'REGISTER' && <LoginForm setTheBoard={setTheBoard} setSingleBoard={setSingleBoard}/>}
      {state.phase === 'SET' && <Board board={state.board} nodeOnClick={nodeOnClick} />}
      {state.phase === 'BATTLE' && <Battle board={state.board} oppo={state.oppo} nodeOnClick={battleClickHandler} />}
    </div>
  );
}

export default App;
