import React from 'react';
import Board from './components/Board';
import './App.scss';
import LoginForm from './components/LoginForm';
import useApplicationData from './helpers/gameHelpers';
import Battle from './components/Battle';
import End from './components/End';

function App() {
  const { state,
    nodeOnClick,
    setTheBoard,
    battleClickHandler,
    setSingleBoard,
  reset } = useApplicationData();



  return (
    <main className="layout"> 
    <section className='sidebar'>
      <img className='sidebar--centered' src='https://images.launchbox-app.com/31f513df-9f35-4da9-bc3e-513e988a5d82.png' alt='Battleship'/>
      <hr className='sidebar__separator sidebar--centered'/>
    </section>
      
      <div className='c-error'>{state.errMsg && state.errMsg}</div>
      {state.phase === 'REGISTER' && <LoginForm setTheBoard={setTheBoard} setSingleBoard={setSingleBoard}/>}
      {state.phase === 'SET' && <Board board={state.board} nodeOnClick={nodeOnClick} />}
      {state.phase === 'BATTLE' && <Battle board={state.board} oppo={state.oppo} nodeOnClick={battleClickHandler} />}
      {state.phase === 'END' && <End reset={reset} header={`You ${state.hitCount === 17 ? 'Won' : 'Lost'}!`}/>}
    </main>
  );
}

export default App;
