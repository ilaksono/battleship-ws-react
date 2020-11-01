export const isHorizontalRestricted = (board, size, coord) => {
  if (coord[1] + size > 10) return true;
  for (let i = 1; i < size; i++)
    if (board[coord[0]][coord[1] + i]) return true;

  return false;
};
export const isVerticalRestricted = (board, size, coord) => {
  if (coord[0] + size > 10) return true;
  for (let i = 1; i < size; i++)
    if (board[coord[0] + i][coord[1]]) return true;

  return false;

};