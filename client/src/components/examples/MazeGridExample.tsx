import { useState } from 'react';
import { MazeGrid } from '../MazeGrid';
import type { CellState } from '@/lib/maze-types';

export default function MazeGridExample() {
  const [cellStates, setCellStates] = useState<CellState[][]>([
    ['start', 'empty', 'wall', 'empty', 'empty'],
    ['empty', 'wall', 'wall', 'empty', 'wall'],
    ['visited', 'visited', 'current', 'empty', 'empty'],
    ['backtracked', 'empty', 'empty', 'wall', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'end'],
  ]);

  const handleCellClick = (x: number, y: number) => {
    console.log(`Cell clicked: (${x}, ${y})`);
    setCellStates(prev => {
      const newStates = prev.map(row => [...row]);
      if (newStates[y][x] === 'empty') {
        newStates[y][x] = 'wall';
      } else if (newStates[y][x] === 'wall') {
        newStates[y][x] = 'empty';
      }
      return newStates;
    });
  };

  return (
    <div className="w-full max-w-md">
      <MazeGrid
        cellStates={cellStates}
        onCellClick={handleCellClick}
        onSetStart={(x, y) => console.log(`Set start: (${x}, ${y})`)}
        onSetEnd={(x, y) => console.log(`Set end: (${x}, ${y})`)}
        currentPosition={{ x: 2, y: 2 }}
      />
    </div>
  );
}
