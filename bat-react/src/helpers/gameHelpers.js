import { useEffect, useReducer } from 'react';
import { isHorizontalRestricted, isVerticalRestricted } from './helperFunctions';

const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
socket.onopen = () => {
  console.log('we connected fam');
}
const initState = {
  phase: 'REGISTER',
  mode: 'SINGLE',
  ships: [
    {
      name: 'Destroyer',
      size: 2,
      orientation: null,
      code: 'A',
      locked: false,
      spots: []

    },
    {
      name: 'Submarine',
      size: 3,
      orientation: null,
      code: 'B',
      locked: false,
      spots: []
    },
    {
      name: 'Cruiser',
      size: 3,
      orientation: null,
      code: 'C',
      locked: false,
      spots: []
    },
    {
      name: 'Battleship',
      size: 4,
      orientation: null,
      code: 'D',
      locked: false,
      spots: []
    },
    {
      name: 'Carrier',
      size: 5,
      orientation: null,
      code: 'E',
      locked: false,
      spots: []
    }
  ],
  board: [],
  oppo: [],
  errMsg: ''
}
const SET_MULTI = 'SET_MULTI'
const INIT_BOARD = 'INIT_BOARD';
const PLACE_SHIP = 'PLACE_SHIP';
const TOGGLE = 'TOGGLE';
const SET_BATTLE = 'SET_BATTLE';
const SET_ERR = 'SET_ERR';
const RESET_ERR = 'RESET_ERR';
const TAKE_SHOT = 'TAKE_SHOT'
const SET_SINGLE = 'SET_SINGLE';

const reducer = (state, action) => {

  switch (action.type) {
    case SET_MULTI:
      return { ...state, phase: 'SET', mode: 'MULTI' };

    case SET_SINGLE:
      return { ...state, phase: 'SET', mode: 'SINGLE' };
    case INIT_BOARD: {
      const { board } = action;
      return { ...state, board }
    }
    case PLACE_SHIP: {
      // console.log(action.index);
      const { boardCopy, shipsCopy } = action;
      return { ...state, board: boardCopy, ships: shipsCopy };
    }
    case TOGGLE: {
      const { shipsCopy, boardCopy } = action;
      return { ...state, ships: shipsCopy, board: boardCopy };
    }
    case SET_BATTLE:
      return { ...state, phase: 'BATTLE', oppo: action.oppoBoard };

    case SET_ERR:
      return { ...state, errMsg: action.errMsg }
    case RESET_ERR:
      return { ...state, errMsg: '' };
    case TAKE_SHOT: {
      const {coord, hit, copyBoard} = action;
      const boardCopy = copyBoard(state.oppo);
      boardCopy[coord[0]][coord[1]] = hit;
      return { ...state, oppo: boardCopy }
    }

    default:
      throw new Error('invalid type: ', action.type)
  }
}

const useApplicationData = () => {
  useEffect(() => {
    const bigArray = generateBoard();
    dispatch({ type: INIT_BOARD, board: bigArray });
  }, [])
  const [state, dispatch] = useReducer(reducer, initState);
  const setTheBoard = () => dispatch({ type: SET_MULTI });
  const setSingleBoard = () => {

    socket.send(JSON.stringify('SET_AI'));
    dispatch({ type: SET_SINGLE })
  }

  useEffect(() => {
    socket.addEventListener('message', (data) => {
      const res = JSON.parse(data.data);
      console.log(res);
      if (res.shot) {
        let hit = 'O';
        const coord = getCoordFromNodeId(Number(Object.keys(res)[0]))
        console.log(coord);
        if (Object.values(res)[0])
          hit = 'X';


        dispatch({ type: TAKE_SHOT, coord, hit, copyBoard })

        // dispatch({ type: TAKE_SHOT, res });
      }
    })
    
  }, [])
  const generateBoard = () => {
    const bigArray = [];
    for (let i = 0; i < 10; i++) {
      let tmp = [];
      for (let j = 0; j < 10; j++)
        tmp.push('');
      bigArray.push(tmp);
    }
    return bigArray;
  }

  const nodeOnClick = (event) => {
    dispatch({ type: RESET_ERR })
    const id = event.target.id
    const coord = getCoordFromNodeId(id);
    if (!getCurrentShip()[1] && state.phase === 'SET') {
      const oppoBoard = generateBoard();
      socket.send(JSON.stringify(state.board));
      return dispatch({ type: 'SET_BATTLE', oppoBoard })
    }
    const [index, current] = getCurrentShip();
    console.log([index, current]);
    if (!state.board[coord[0]][coord[1]]) {
      if (!isHorizontalRestricted(state.board, current.size, coord))
        placeShipsHorizontal(coord)
      else if (!isVerticalRestricted(state.board, current.size, coord))
        placeShipsVertical(coord)
      else
        dispatch({ type: SET_ERR, errMsg: 'No Space to Place' })
    }

    else {

      toggleShipOrientation(index - 1);
    }
    return coord;
  };

  const placeShipsVertical = coord => {
    const boardCopy = copyBoard(state.board);
    const shipsCopy = copyShips();
    const [index, current] = getCurrentShip();
    const spots = [];
    for (let row = coord[0]; row < coord[0] + current.size; row++) {
      boardCopy[row][coord[1]] = current.code;
      spots.push([coord[0] + row, coord[1]]);
    }
    shipsCopy[index].orientation = 'V';
    shipsCopy[index].locked = true;
    shipsCopy[index].spots = spots;
    return dispatch({ type: PLACE_SHIP, shipsCopy, boardCopy });
  };

  const getCurrentShip = () => {
    let index;
    const current = state.ships.find((ship, i) => {
      if (!ship.locked) index = i;
      return !ship.locked;
    });
    return [index, current]
  };

  const placeShipsHorizontal = (coord) => {
    const [index, current] = getCurrentShip();
    const { size, code } = current;
    const shipsCopy = copyShips();
    const replacement = Array(size).fill(code);
    const boardCopy = state.board.map(row => [...row]);
    boardCopy[coord[0]].splice(coord[1], size, ...replacement);
    const spots = [];
    for (let i = 0; i < size; i++)
      spots.push([coord[0], coord[1] + i])
    shipsCopy[index].orientation = 'H';
    shipsCopy[index].locked = true;
    shipsCopy[index].spots = spots;

    dispatch({ type: PLACE_SHIP, boardCopy, shipsCopy })
    return;
  };
  const getCoordFromNodeId = id => [Math.floor(id / 10), id % 10];
  const copyBoard = (board) => board.map(row => [...row]);
  const copyShips = () => state.ships.map(ship => ({ ...ship }));

  const toggleShipOrientation = index => {
    let boardCopy = copyBoard(state.board);
    let shipsCopy = copyShips();
    if (state.ships[index].orientation === 'H') {
      for (let i = 1; i < state.ships[index].size; i++) {
        const delta = state.ships[index].spots[i][1] - state.ships[index].spots[0][1];
        boardCopy[state.ships[index].spots[i][0]][state.ships[index].spots[i][1]] = null;
        shipsCopy[index].spots[i][1] = state.ships[index].spots[0][1];
        shipsCopy[index].spots[i][0] += delta;
        boardCopy[state.ships[index].spots[i][0]][state.ships[index].spots[i][1]] =
          boardCopy[state.ships[index].spots[0][0]][state.ships[index].spots[0][1]];
      }
      shipsCopy[index].orientation = 'V';
      return dispatch({ type: TOGGLE, shipsCopy, boardCopy });
    }
    else if (state.ships[index].orientation === 'V') {
      for (let i = 1; i < state.ships[index].size; i++) {
        const delta = state.ships[index].spots[i][0] - state.ships[index].spots[0][0];
        boardCopy[state.ships[index].spots[i][0]][state.ships[index].spots[i][1]] = null;
        shipsCopy[index].spots[i][0] = state.ships[index].spots[0][0];
        shipsCopy[index].spots[i][1] += delta;
        boardCopy[state.ships[index].spots[i][0]][state.ships[index].spots[i][1]] =
          boardCopy[state.ships[index].spots[0][0]][state.ships[index].spots[0][1]];
      }
      shipsCopy[index].orientation = 'H';
      return dispatch({ type: TOGGLE, shipsCopy, boardCopy });;
    }
  };


  const battleClickHandler = event => {
    const coord = getCoordFromNodeId(event.target.id);
    if (!state.oppo[coord[0]][coord[1]]) {
      socket.send(JSON.stringify(`${coord[0]}${coord[1]}`));
    }
  }



  return {
    state,
    nodeOnClick,
    setTheBoard,
    battleClickHandler,
    setSingleBoard
  }

}
export default useApplicationData;