import { useState, useCallback, useRef, useEffect } from 'react';
import type { Position, CellState, AlgorithmState, MazeStats, Direction, MazePreset, DataStructureType } from '@/lib/maze-types';
import { DIRECTIONS } from '@/lib/maze-types';
import { MAZE_PRESETS, createEmptyGrid } from '@/lib/maze-presets';

const DIRECTION_ORDER: Direction[] = ['right', 'down', 'left', 'up'];

export function useMazeSolver(initialSize = 10) {
  const [grid, setGrid] = useState<number[][]>(() => createEmptyGrid(initialSize, initialSize));
  const [cellStates, setCellStates] = useState<CellState[][]>(() => 
    Array(initialSize).fill(null).map(() => Array(initialSize).fill('empty'))
  );
  const [start, setStart] = useState<Position>({ x: 0, y: 0 });
  const [end, setEnd] = useState<Position>({ x: initialSize - 1, y: initialSize - 1 });
  const [dataStructureType, setDataStructureType] = useState<DataStructureType>('stack');
  const [stack, setStack] = useState<Position[]>([]);
  const [queue, setQueue] = useState<Position[]>([]);
  const [linkedList, setLinkedList] = useState<Position[]>([]);
  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>('idle');
  const [speed, setSpeed] = useState(300);
  const [stats, setStats] = useState<MazeStats>({
    stepsTaken: 0,
    backtracks: 0,
    cellsVisited: 0,
    pathLength: 0,
    timeElapsed: 0,
  });
  const [history, setHistory] = useState<{ stack: Position[]; cellStates: CellState[][]; stats: MazeStats }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const visitedRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const posToKey = (pos: Position) => `${pos.x},${pos.y}`;

  const isValid = useCallback((x: number, y: number): boolean => {
    return (
      x >= 0 &&
      x < grid[0].length &&
      y >= 0 &&
      y < grid.length &&
      grid[y][x] === 0 &&
      !visitedRef.current.has(`${x},${y}`)
    );
  }, [grid]);

  const getNeighbors = useCallback((pos: Position): Position[] => {
    const neighbors: Position[] = [];
    for (const dir of DIRECTION_ORDER) {
      const delta = DIRECTIONS[dir];
      const newX = pos.x + delta.x;
      const newY = pos.y + delta.y;
      if (isValid(newX, newY)) {
        neighbors.push({ x: newX, y: newY });
      }
    }
    return neighbors;
  }, [isValid]);

  const updateCellState = useCallback((x: number, y: number, state: CellState) => {
    setCellStates(prev => {
      const newStates = prev.map(row => [...row]);
      newStates[y][x] = state;
      return newStates;
    });
  }, []);

  const resetVisualization = useCallback(() => {
    const newCellStates: CellState[][] = grid.map((row, y) =>
      row.map((cell, x) => {
        if (x === start.x && y === start.y) return 'start';
        if (x === end.x && y === end.y) return 'end';
        if (cell === 1) return 'wall';
        return 'empty';
      })
    );
    setCellStates(newCellStates);
    setStack([]);
    setQueue([]);
    setLinkedList([]);
    visitedRef.current = new Set();
    setStats({
      stepsTaken: 0,
      backtracks: 0,
      cellsVisited: 0,
      pathLength: 0,
      timeElapsed: 0,
    });
    setHistory([]);
    setHistoryIndex(-1);
    setAlgorithmState('idle');
  }, [grid, start, end]);

  // Step function for Stack (DFS)
  const stepStack = useCallback((): boolean => {
    if (stack.length === 0) {
      setAlgorithmState('no-path');
      return false;
    }

    const current = stack[stack.length - 1];
    
    if (current.x === end.x && current.y === end.y) {
      setCellStates(prev => {
        const newStates = prev.map(row => [...row]);
        stack.forEach(pos => {
          if (!(pos.x === start.x && pos.y === start.y) && !(pos.x === end.x && pos.y === end.y)) {
            newStates[pos.y][pos.x] = 'path';
          }
        });
        return newStates;
      });
      setStats(prev => ({ ...prev, pathLength: stack.length }));
      setAlgorithmState('finished');
      return false;
    }

    const neighbors = getNeighbors(current);
    
    if (neighbors.length > 0) {
      const next = neighbors[0];
      visitedRef.current.add(posToKey(next));
      
      const newStack = [...stack, next];
      setStack(newStack);
      
      setCellStates(prev => {
        const newStates = prev.map(row => [...row]);
        if (!(current.x === start.x && current.y === start.y)) {
          newStates[current.y][current.x] = 'visited';
        }
        if (!(next.x === end.x && next.y === end.y)) {
          newStates[next.y][next.x] = 'current';
        }
        return newStates;
      });
      
      setStats(prev => ({
        ...prev,
        stepsTaken: prev.stepsTaken + 1,
        cellsVisited: visitedRef.current.size,
        timeElapsed: Date.now() - startTimeRef.current,
      }));
      
      return true;
    } else {
      const newStack = stack.slice(0, -1);
      setStack(newStack);
      
      setCellStates(prev => {
        const newStates = prev.map(row => [...row]);
        if (!(current.x === start.x && current.y === start.y) && !(current.x === end.x && current.y === end.y)) {
          newStates[current.y][current.x] = 'backtracked';
        }
        if (newStack.length > 0) {
          const prev_pos = newStack[newStack.length - 1];
          if (!(prev_pos.x === start.x && prev_pos.y === start.y) && !(prev_pos.x === end.x && prev_pos.y === end.y)) {
            newStates[prev_pos.y][prev_pos.x] = 'current';
          }
        }
        return newStates;
      });
      
      setStats(prev => ({
        ...prev,
        stepsTaken: prev.stepsTaken + 1,
        backtracks: prev.backtracks + 1,
        timeElapsed: Date.now() - startTimeRef.current,
      }));
      
      return newStack.length > 0;
    }
  }, [stack, end, start, getNeighbors]);

  // Step function for Queue (BFS)
  const stepQueue = useCallback((): boolean => {
    if (queue.length === 0) {
      setAlgorithmState('no-path');
      return false;
    }

    const current = queue[0]; // Dequeue from front
    
    if (current.x === end.x && current.y === end.y) {
      setCellStates(prev => {
        const newStates = prev.map(row => [...row]);
        queue.forEach(pos => {
          if (!(pos.x === start.x && pos.y === start.y) && !(pos.x === end.x && pos.y === end.y)) {
            newStates[pos.y][pos.x] = 'path';
          }
        });
        return newStates;
      });
      setStats(prev => ({ ...prev, pathLength: queue.length }));
      setAlgorithmState('finished');
      return false;
    }

    const neighbors = getNeighbors(current);
    
    // Enqueue all neighbors
    const newQueue = queue.slice(1); // Remove current (dequeue)
    neighbors.forEach(neighbor => {
      if (!visitedRef.current.has(posToKey(neighbor))) {
        visitedRef.current.add(posToKey(neighbor));
        newQueue.push(neighbor); // Enqueue at rear
      }
    });
    
    setQueue(newQueue);
    
    setCellStates(prev => {
      const newStates = prev.map(row => [...row]);
      if (!(current.x === start.x && current.y === start.y)) {
        newStates[current.y][current.x] = 'visited';
      }
      if (newQueue.length > 0) {
        const next = newQueue[0];
        if (!(next.x === end.x && next.y === end.y)) {
          newStates[next.y][next.x] = 'current';
        }
      }
      return newStates;
    });
    
    setStats(prev => ({
      ...prev,
      stepsTaken: prev.stepsTaken + 1,
      cellsVisited: visitedRef.current.size,
      timeElapsed: Date.now() - startTimeRef.current,
    }));
    
    return newQueue.length > 0;
  }, [queue, end, start, getNeighbors]);

  // Step function for Linked List (Sequential traversal)
  const stepLinkedList = useCallback((): boolean => {
    if (linkedList.length === 0) {
      setAlgorithmState('no-path');
      return false;
    }

    const current = linkedList[linkedList.length - 1]; // Last node
    
    if (current.x === end.x && current.y === end.y) {
      setCellStates(prev => {
        const newStates = prev.map(row => [...row]);
        linkedList.forEach(pos => {
          if (!(pos.x === start.x && pos.y === start.y) && !(pos.x === end.x && pos.y === end.y)) {
            newStates[pos.y][pos.x] = 'path';
          }
        });
        return newStates;
      });
      setStats(prev => ({ ...prev, pathLength: linkedList.length }));
      setAlgorithmState('finished');
      return false;
    }

    const neighbors = getNeighbors(current);
    
    if (neighbors.length > 0) {
      const next = neighbors[0];
      visitedRef.current.add(posToKey(next));
      
      const newLinkedList = [...linkedList, next]; // Add to tail
      setLinkedList(newLinkedList);
      
      setCellStates(prev => {
        const newStates = prev.map(row => [...row]);
        if (!(current.x === start.x && current.y === start.y)) {
          newStates[current.y][current.x] = 'visited';
        }
        if (!(next.x === end.x && next.y === end.y)) {
          newStates[next.y][next.x] = 'current';
        }
        return newStates;
      });
      
      setStats(prev => ({
        ...prev,
        stepsTaken: prev.stepsTaken + 1,
        cellsVisited: visitedRef.current.size,
        timeElapsed: Date.now() - startTimeRef.current,
      }));
      
      return true;
    } else {
      // Backtrack by removing last node
      const newLinkedList = linkedList.slice(0, -1);
      setLinkedList(newLinkedList);
      
      setCellStates(prev => {
        const newStates = prev.map(row => [...row]);
        if (!(current.x === start.x && current.y === start.y) && !(current.x === end.x && current.y === end.y)) {
          newStates[current.y][current.x] = 'backtracked';
        }
        if (newLinkedList.length > 0) {
          const prev_pos = newLinkedList[newLinkedList.length - 1];
          if (!(prev_pos.x === start.x && prev_pos.y === start.y) && !(prev_pos.x === end.x && prev_pos.y === end.y)) {
            newStates[prev_pos.y][prev_pos.x] = 'current';
          }
        }
        return newStates;
      });
      
      setStats(prev => ({
        ...prev,
        stepsTaken: prev.stepsTaken + 1,
        backtracks: prev.backtracks + 1,
        timeElapsed: Date.now() - startTimeRef.current,
      }));
      
      return newLinkedList.length > 0;
    }
  }, [linkedList, end, start, getNeighbors]);

  // Main step function that routes to the correct algorithm
  const step = useCallback((): boolean => {
    switch (dataStructureType) {
      case 'stack':
        return stepStack();
      case 'queue':
        return stepQueue();
      case 'linkedlist':
        return stepLinkedList();
      default:
        return stepStack();
    }
  }, [dataStructureType, stepStack, stepQueue, stepLinkedList]);

  const startAlgorithm = useCallback(() => {
    if (algorithmState === 'idle') {
      resetVisualization();
      visitedRef.current.add(posToKey(start));
      startTimeRef.current = Date.now();
      setStats(prev => ({ ...prev, cellsVisited: 1 }));
      
      // Initialize based on data structure type
      switch (dataStructureType) {
        case 'stack':
          setStack([start]);
          break;
        case 'queue':
          setQueue([start]);
          break;
        case 'linkedlist':
          setLinkedList([start]);
          break;
      }
    }
    setAlgorithmState('running');
  }, [algorithmState, start, resetVisualization, dataStructureType]);

  const pauseAlgorithm = useCallback(() => {
    setAlgorithmState('paused');
  }, []);

  const stepForward = useCallback(() => {
    if (algorithmState === 'idle') {
      resetVisualization();
      visitedRef.current.add(posToKey(start));
      startTimeRef.current = Date.now();
      setStats(prev => ({ ...prev, cellsVisited: 1 }));
      
      // Initialize based on data structure type
      switch (dataStructureType) {
        case 'stack':
          setStack([start]);
          break;
        case 'queue':
          setQueue([start]);
          break;
        case 'linkedlist':
          setLinkedList([start]);
          break;
      }
      
      setAlgorithmState('paused');
      return;
    }
    if (algorithmState === 'paused') {
      step();
    }
  }, [algorithmState, start, resetVisualization, step, dataStructureType]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    resetVisualization();
  }, [resetVisualization]);

  const toggleCell = useCallback((x: number, y: number) => {
    if (algorithmState !== 'idle') return;
    if ((x === start.x && y === start.y) || (x === end.x && y === end.y)) return;
    
    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      newGrid[y][x] = newGrid[y][x] === 0 ? 1 : 0;
      return newGrid;
    });
    
    setCellStates(prev => {
      const newStates = prev.map(row => [...row]);
      newStates[y][x] = prev[y][x] === 'wall' ? 'empty' : 'wall';
      return newStates;
    });
  }, [algorithmState, start, end]);

  const setStartPosition = useCallback((x: number, y: number) => {
    if (algorithmState !== 'idle') return;
    if (grid[y][x] === 1) return;
    if (x === end.x && y === end.y) return;
    
    const oldStart = start;
    setStart({ x, y });
    
    setCellStates(prev => {
      const newStates = prev.map(row => [...row]);
      newStates[oldStart.y][oldStart.x] = 'empty';
      newStates[y][x] = 'start';
      return newStates;
    });
  }, [algorithmState, grid, start, end]);

  const setEndPosition = useCallback((x: number, y: number) => {
    if (algorithmState !== 'idle') return;
    if (grid[y][x] === 1) return;
    if (x === start.x && y === start.y) return;
    
    const oldEnd = end;
    setEnd({ x, y });
    
    setCellStates(prev => {
      const newStates = prev.map(row => [...row]);
      newStates[oldEnd.y][oldEnd.x] = 'empty';
      newStates[y][x] = 'end';
      return newStates;
    });
  }, [algorithmState, grid, start, end]);

  const loadPreset = useCallback((preset: MazePreset) => {
    if (algorithmState !== 'idle') {
      reset();
    }
    
    setGrid(preset.grid.map(row => [...row]));
    setStart(preset.start);
    setEnd(preset.end);
    
    const newCellStates: CellState[][] = preset.grid.map((row, y) =>
      row.map((cell, x) => {
        if (x === preset.start.x && y === preset.start.y) return 'start';
        if (x === preset.end.x && y === preset.end.y) return 'end';
        if (cell === 1) return 'wall';
        return 'empty';
      })
    );
    setCellStates(newCellStates);
    visitedRef.current = new Set();
    setStack([]);
    setQueue([]);
    setLinkedList([]);
    setStats({
      stepsTaken: 0,
      backtracks: 0,
      cellsVisited: 0,
      pathLength: 0,
      timeElapsed: 0,
    });
    setAlgorithmState('idle');
  }, [algorithmState, reset]);

  const clearMaze = useCallback(() => {
    if (algorithmState !== 'idle') {
      reset();
    }
    
    const size = grid.length;
    const newGrid = createEmptyGrid(size, size);
    setGrid(newGrid);
    setStart({ x: 0, y: 0 });
    setEnd({ x: size - 1, y: size - 1 });
    
    const newCellStates: CellState[][] = newGrid.map((row, y) =>
      row.map((_, x) => {
        if (x === 0 && y === 0) return 'start';
        if (x === size - 1 && y === size - 1) return 'end';
        return 'empty';
      })
    );
    setCellStates(newCellStates);
    visitedRef.current = new Set();
    setStack([]);
    setQueue([]);
    setLinkedList([]);
    setStats({
      stepsTaken: 0,
      backtracks: 0,
      cellsVisited: 0,
      pathLength: 0,
      timeElapsed: 0,
    });
    setAlgorithmState('idle');
  }, [algorithmState, grid.length, reset]);

  useEffect(() => {
    if (algorithmState === 'running') {
      intervalRef.current = setInterval(() => {
        const canContinue = step();
        if (!canContinue) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [algorithmState, speed, step]);

  useEffect(() => {
    loadPreset(MAZE_PRESETS[0]);
  }, []);

  // Get current data structure based on type
  const getCurrentDataStructure = () => {
    switch (dataStructureType) {
      case 'stack':
        return stack;
      case 'queue':
        return queue;
      case 'linkedlist':
        return linkedList;
      default:
        return stack;
    }
  };

  return {
    grid,
    cellStates,
    start,
    end,
    stack,
    queue,
    linkedList,
    dataStructureType,
    setDataStructureType,
    currentDataStructure: getCurrentDataStructure(),
    algorithmState,
    speed,
    stats,
    setSpeed,
    startAlgorithm,
    pauseAlgorithm,
    stepForward,
    reset,
    toggleCell,
    setStartPosition,
    setEndPosition,
    loadPreset,
    clearMaze,
  };
}
