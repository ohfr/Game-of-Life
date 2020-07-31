export const getNeighbors = (grid, x, y, row, col) => {
    let sum=0;
    for (let i =-1;i < 2;i++) {
      for (let j=-1;j < 2;j++) {
        let xi=x+i;
        let yj = y+j;
        if (xi >= 0 && xi < row && yj >= 0 && yj < col) {
          sum += grid[i+x][j+y];
        }
      }
    }
    sum -= grid[x][y];
    return sum;
  }