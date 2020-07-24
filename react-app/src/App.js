import React, { useState, useCallback, useRef } from 'react';
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

  const getNeighbors = (grid, x, y) => {
    let sum=0;
    for (let i =-1;i < 2;i++) {
      for (let j=-1;j < 2;j++) {
        let xi=x+i;
        let yj = y+j;
        if (xi >= 0 && xi < rows && yj >= 0 && yj < cols) {
          sum += grid[i+x][j+y];

        }
      }
    }
    sum -= grid[x][y];
    return sum;
  }



  const run = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(cur => {
      return produce(cur, gridCopy => {
        for (let i =0; i < rows;i++) {
          for (let j=0; j < cols;j++) {
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
    <p>{gen}</p>
    <button onClick={() => {
      setGrid(randomGrid());
      console.log(grid)
    }}>Random</button>
    <label style={{ marginTop: '10px'}}htmlFor="Size">Size</label>
    <input onChange={(e) => {
      setRows(e.target.value);
      setCols(e.target.value);
    }} type="range" min="25" max="100" value={rows} step="10"/>
    
    <label style={{ marginTop: '10px'}}htmlFor="speed">Speed</label>
    <input onChange={(e) => {
      setSpeed(e.target.value);
      console.log(speed);
    }} type="range" min="25" max="1000" value={speed} step="10" style={{ direction: 'rtl'}}/>
    </div>
  );
}


// 0: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 1: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 2: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 3: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 4: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 5: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 6: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 7: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 8: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 9: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 10: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 11: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 12: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 13: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 14: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 15: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 16: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 17: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 18: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 19: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 20: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 21: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 22: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 23: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// 24: (25) [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

export default App;
