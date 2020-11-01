
module.exports = (AI) => {
  const generateBoard = () => {
    let temp = [];

    for (let i = 0; i < 10; i++) {
      let tmp = [];
      for (let j = 0; j < 10; j++)
        tmp.push('');
      temp.push(tmp);
    }
    return temp;
  }
  const initAIProps = {
    id: 'AI',
    board: generateBoard(),
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

  }
 

  const setBoard = () => {
    AI = initAIProps;
    for (const ship of AI.ships) {
      setShip(ship);
    }
    console.log(AI);
    return AI;
  };

  const setShip = (ship) => {
    let can = Math.floor(Math.random() * 100);
    let orient = Math.floor(Math.random() * 2);
    const coord = [Math.floor(can / 10), can % 10];
    if (isHorizontalRestricted(ship, coord) &&
      isVerticalRestricted(ship, coord))
      return setShip(ship);

    if (orient === 0) {
      if (!isHorizontalRestricted(ship, coord))
        return placeShipsHorizontal(ship, coord);
    } else if (orient === 1) {
      if (!isVerticalRestricted(ship, coord))
        return placeShipsVertical(ship, coord);
    }
    return setShip(ship);
  };

  const placeShipsHorizontal = (ship, coord) => {
    let tmp = Array(ship.size).fill(ship.code);
    AI.board[coord[0]].splice(coord[1], ship.size, ...tmp);
    for (let i = 0; i < ship.size; i++)
      ship.spots.push([coord[0], coord[1] + i]);
    ship.orientation = 'H';

    return ship.orientation;

  };

  const isVerticalRestricted = (ship, coord) => {
    if (coord[0] + ship.size > 10) return true;
    for (let i = 1; i < ship.size; i++)
      if (AI.board[coord[0] + i][coord[1]]) return true;

    return false;

  };

  const placeShipsVertical = (ship, coord) => {
    for (let row = coord[0]; row < coord[0] + ship.size; row++) {
      AI.board[row][coord[1]] = ship.code;
      ship.spots.push([coord[0] + row, coord[1]]);
    }
    ship.orientation = 'V';
    return ship.orientation;
  };
  const isHorizontalRestricted = (ship, coord) => {
    if (coord[1] + ship.size > 10) return true;
    for (let i = 1; i < ship.size; i++)
      if (AI.board[coord[0]][coord[1] + i]) return true;

    return false;

  };

  return {
    setBoard
  }
}