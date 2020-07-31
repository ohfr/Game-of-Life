export const galaxyGrid = (gridCopy, mid, midCol) => {
    for (let i= 0;i <6;i++) {
      gridCopy[mid][midCol] = 1;
      gridCopy[mid+1][midCol] = 1;
      midCol++;
      if (i === 5) {
        midCol++;
      }
    }
    for (let i=0;i < 6;i++) {
      gridCopy[mid][midCol] = 1;
      gridCopy[mid][midCol+1] = 1
      mid++;
      if (i === 5) {
        mid++;
        midCol++;
      }
    }
    for (let i=0;i < 6;i++) {
      gridCopy[mid][midCol] = 1;
      gridCopy[mid+1][midCol] = 1
      midCol--;
      if (i === 5) {
        midCol--;
        mid++;
      }
    }

    for (let i=0; i <6;i++) {
      gridCopy[mid][midCol] = 1;
      gridCopy[mid][midCol-1] = 1
      mid--;
    }
  }