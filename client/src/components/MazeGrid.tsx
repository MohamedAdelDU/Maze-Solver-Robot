import { useCallback } from 'react';
import type { CellState, Position } from '@/lib/maze-types';
import { Bot, Flag, MapPin } from 'lucide-react';

type MazeGridProps = {
  cellStates: CellState[][];
  onCellClick: (x: number, y: number) => void;
  onSetStart: (x: number, y: number) => void;
  onSetEnd: (x: number, y: number) => void;
  disabled?: boolean;
  currentPosition?: Position | null;
};

const cellColors: Record<CellState, string> = {
  empty: 'bg-background border-border',
  wall: 'bg-foreground/80 dark:bg-foreground/60',
  start: 'bg-chart-2',
  end: 'bg-chart-5',
  visited: 'bg-primary/30',
  current: 'bg-primary',
  path: 'bg-chart-2',
  backtracked: 'bg-chart-4/40',
};

export function MazeGrid({ 
  cellStates, 
  onCellClick, 
  onSetStart, 
  onSetEnd, 
  disabled = false,
  currentPosition 
}: MazeGridProps) {
  const handleClick = useCallback((x: number, y: number, e: React.MouseEvent) => {
    if (disabled) return;
    
    if (e.shiftKey) {
      onSetStart(x, y);
    } else if (e.altKey) {
      onSetEnd(x, y);
    } else {
      onCellClick(x, y);
    }
  }, [disabled, onCellClick, onSetStart, onSetEnd]);

  const gridSize = cellStates.length;

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="grid gap-px bg-border p-1 rounded-md"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          aspectRatio: '1/1',
          width: '100%',
          maxWidth: '500px'
        }}
        data-testid="maze-grid"
      >
        {cellStates.map((row, y) =>
          row.map((state, x) => {
            const isCurrent = currentPosition && currentPosition.x === x && currentPosition.y === y;
            
            return (
              <button
                key={`${x}-${y}`}
                className={`
                  aspect-square flex items-center justify-center
                  transition-colors duration-200
                  ${cellColors[state]}
                  ${!disabled ? 'hover-elevate cursor-pointer' : 'cursor-default'}
                  ${isCurrent ? 'ring-2 ring-primary ring-inset' : ''}
                  border border-border/50
                  rounded-sm
                `}
                onClick={(e) => handleClick(x, y, e)}
                disabled={disabled}
                data-testid={`cell-${x}-${y}`}
                title={`(${x}, ${y}) - ${disabled ? 'Running' : 'Click to toggle wall, Shift+Click for start, Alt+Click for end'}`}
              >
                {state === 'start' && (
                  <MapPin className="w-3/5 h-3/5 text-white" />
                )}
                {state === 'end' && (
                  <Flag className="w-3/5 h-3/5 text-white" />
                )}
                {state === 'current' && (
                  <Bot className="w-3/5 h-3/5 text-primary-foreground animate-pulse" />
                )}
              </button>
            );
          })
        )}
      </div>
      {!disabled && (
        <p className="text-xs text-muted-foreground text-center">
          Click to toggle walls | Shift+Click to set start | Alt+Click to set end
        </p>
      )}
    </div>
  );
}
