import React, { useState, useCallback, useRef, useEffect } from 'react';
import { produce } from "immer";

function App() {

  const [gen, setGen] = useState(0);
  const [rows, setRows] = useState(25);
  const [cols, setCols] = useState(25);

  const [speed, setSpeed] = useState(100);

  const initializeGrid = () => {
    const row = [];
    for (let i =0;i < rows;i++) {
      row.push(Array.from(Array(cols), () => 0));
    }
    return row;
  }

  const [grid, setGrid] = useState(() => {
    return initializeGrid();
  });
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const genRef = useRef(gen);
  genRef.current = gen;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const rowRef = useRef(rows);
  rowRef.current = rows;

  const colRef = useRef(cols);
  colRef.current = cols;

  const getNeighbors = (grid, x, y) => {
    let sum=0;
    for (let i =-1;i < 2;i++) {
      for (let j=-1;j < 2;j++) {
        let xi=x+i;
        let yj = y+j;
        if (xi >= 0 && xi < rowRef.current && yj >= 0 && yj < colRef.current) {
          sum += grid[i+x][j+y];
        }
      }
    }
    sum -= grid[x][y];
    return sum;
  }

  const step = () => {
    setGrid(cur => {
      return produce(cur, gridCopy => {
        for (let i =0; i < rowRef.current;i++) {
          for (let j=0; j < colRef.current;j++) {
            let state = cur[i][j];
            let neighbors = getNeighbors(cur, i, j);

            if (state === 1 && (neighbors < 2 || neighbors > 3)) {
              gridCopy[i][j] = 0;
            } else if (state === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      })
    });
  }

  useEffect(() => {
    rowRef.current = rows
    colRef.current = cols

    setGrid(initializeGrid());
  }, [rows, cols])

  const run = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    step();
    setGen(genRef.current+1);
    setTimeout(run, speedRef.current);
  }, []);

  const randomGrid = () => {
    const row = [];
    for (let i=0;i < rows;i++) {
      row.push(Array.from(Array(cols), () => Math.random() > 0.7 ? 1: 0));
    }
    return row;
  }

  const gridThing = (gridCopy, mid, midCol, step=1) => {
    console.log(mid)
    gridCopy[mid][midCol] = 1;          
    gridCopy[mid][++midCol] = 1;
    gridCopy[mid][++midCol] = 1
    gridCopy[mid][++midCol] = 1;
    gridCopy[mid][++midCol] = 1;
    gridCopy[mid][++midCol] = 1;

    midCol+=step

    gridCopy[mid][++midCol] = 1;
    gridCopy[++mid][midCol] = 1;
    gridCopy[++mid][midCol] = 1;
    gridCopy[++mid][midCol] = 1;
    gridCopy[++mid][midCol] = 1;
    gridCopy[++mid][midCol] = 1;

    mid+=step;
    
    gridCopy[++mid][midCol] = 1;
    gridCopy[mid][--midCol] = 1;
    gridCopy[mid][--midCol] = 1;
    gridCopy[mid][--midCol] = 1;
    gridCopy[mid][--midCol] = 1;
    gridCopy[mid][--midCol] = 1;

    midCol-=step;

    gridCopy[mid][--midCol] = 1;
    gridCopy[--mid][midCol] = 1;
    gridCopy[--mid][midCol] = 1;
    gridCopy[--mid][midCol] = 1;
    gridCopy[--mid][midCol] = 1;
    gridCopy[--mid][midCol] = 1;
    return [mid, midCol]
  }


  return (
    <div style={{ display: 'flex', flexFlow: 'column wrap', alignContent: 'center', justifyContent: 'center', marginTop: '50px'}}>
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 20px)`}}>
    {grid.map((row, i) => row.map((col, j) => {
      return <div key={i+j}
      onClick={() => {
        if (!running) {
          const newGrid = produce(grid, gridCopy => {
            gridCopy[i][j] = grid[i][j] ? 0 : 1
          })
          setGrid(newGrid);
          console.log(grid)
        }
      }}
      style={{ width: 20, height: 20, background: grid[i][j] > 0 ? 'black' : undefined,  border:'solid 1px black'}} />
    }))}
    </div>
    <button onClick={() => {
      setRunning(!running);
      if (!running) {
        runningRef.current = true;
        run();
      }
    }}>{running ? "Stop" : "Start"}</button>
    <button onClick={() => {
      setGrid(initializeGrid())
      setRunning(false);
      setGen(0);
    }}>Clear</button>
    <p>Generation: {gen}</p>
    <button onClick={() => {
      step();
      setGen(gen+1);
    }}>Next Gen</button>
    <button onClick={() => {
      setGrid(randomGrid());
      console.log(grid)
    }}>Random</button>
    <label style={{ marginTop: '10px'}}htmlFor="Size">Size</label>
    <input onChange={(e) => {
      setRows(Number(e.target.value));
      setCols(Number(e.target.value));
    }} type="range" min="25" max="100" value={rows} step="10"/>
    
    <label style={{ marginTop: '10px'}}htmlFor="speed">Speed</label>
    <input onChange={(e) => {
      setSpeed(e.target.value);
      console.log(speed);
    }} type="range" min="10" max="1000" value={speed} step="10" style={{ direction: 'rtl'}}/>
    <button onClick={() => {
      setGen(0);
      setGrid((cur) => {
        return produce(cur, gridCopy => {
          let mid = parseInt(rows / 2);
          let midCol = parseInt(cols/2);
          gridCopy[mid][midCol] = 1;          
          gridCopy[++mid][midCol] = 1;
          gridCopy[++mid][midCol] = 1;
          gridCopy[mid][--midCol] = 1;
          gridCopy[--mid][--midCol] = 1;
          return gridCopy;
        })
      })
    }}>Glider</button>
    <button onClick={() => {
      setGen(0);
      setGrid((cur) => {
        return produce(cur, gridCopy => {
          let mid = parseInt(rows / 2);
          let midCol = parseInt(cols/2);
          gridCopy[mid][midCol] = 1;          
          gridCopy[mid][++midCol] = 1;
          gridCopy[++mid][midCol] = 1;
          gridCopy[++mid][midCol] = 1;
          gridCopy[mid][++midCol] = 1;
          gridCopy[mid][++midCol] = 1;
          gridCopy[++mid][--midCol] = 1;
          return gridCopy;
        })
      });
    }}>H-heptomino</button>
    <button onClick={() => {
      setGen(0);
      setGrid((cur) => {
        return produce(cur, gridCopy => {
          let mid = parseInt(rows / 2);
          let midCol = parseInt(cols/2);
          gridCopy[mid][midCol] = 1;          
          gridCopy[++mid][midCol] = 1;
          gridCopy[mid][++midCol] = 1
          midCol++;
          gridCopy[mid][++midCol] = 1;
          gridCopy[mid][++midCol] = 1;
          gridCopy[--mid][midCol] = 1;
          gridCopy[--mid][--midCol] = 1;
          gridCopy[mid][--midCol] = 1;
          gridCopy[mid][--midCol] = 1;
          return gridCopy;
        })
      });
    } }>House</button>
    <button onClick={() => {
      setGen(0);
      setGrid((cur) => {
        return produce(cur, gridCopy => {
          let mid = parseInt(rows / 2);
          let midCol = parseInt(cols/2);
          let [newMid, newMidCol] = gridThing(gridCopy, mid, midCol)

          mid = newMid-3
          midCol = newMidCol
         
          gridThing(gridCopy, mid, midCol, 2)


          return gridCopy;
        })
      });
    }}>Kok's Galaxy</button>
    {/*   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] */}

    </div>
  );
}

export default App;

