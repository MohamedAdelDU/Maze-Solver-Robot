export type CellState = 
  | 'empty' 
  | 'wall' 
  | 'start' 
  | 'end' 
  | 'visited' 
  | 'current' 
  | 'path' 
  | 'backtracked';

export type Position = {
  x: number;
  y: number;
};

export type MazeCell = {
  state: CellState;
  position: Position;
};

export type Direction = 'right' | 'down' | 'left' | 'up';

export const DIRECTIONS: { [key in Direction]: Position } = {
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  up: { x: 0, y: -1 },
};

export type MazePreset = {
  id: string;
  name: string;
  grid: number[][];
  start: Position;
  end: Position;
};

export type AlgorithmState = 'idle' | 'running' | 'paused' | 'finished' | 'no-path';

export type MazeStats = {
  stepsTaken: number;
  backtracks: number;
  cellsVisited: number;
  pathLength: number;
  timeElapsed: number;
};

// أنواع البنيات البيانات
export type DataStructureType = 'stack' | 'queue' | 'linkedlist';

// عقدة Linked List
export type LinkedListNode = {
  position: Position;
  next: LinkedListNode | null;
  id: string;
};

// Queue structure
export type QueueData = {
  items: Position[];
  front: number; // index of front element
  rear: number;  // index of rear element
};
