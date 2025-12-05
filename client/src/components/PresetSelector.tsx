import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MAZE_PRESETS } from '@/lib/maze-presets';
import type { MazePreset } from '@/lib/maze-types';

type PresetSelectorProps = {
  onSelectPreset: (preset: MazePreset) => void;
  disabled?: boolean;
};

function MiniMazePreview({ grid, start, end }: { grid: number[][]; start: { x: number; y: number }; end: { x: number; y: number } }) {
  return (
    <div 
      className="grid gap-0.5 p-1 bg-muted rounded"
      style={{ 
        gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
        aspectRatio: '1/1'
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => {
          const isStart = x === start.x && y === start.y;
          const isEnd = x === end.x && y === end.y;
          
          return (
            <div
              key={`${x}-${y}`}
              className={`
                aspect-square rounded-sm
                ${isStart ? 'bg-chart-2' : ''}
                ${isEnd ? 'bg-chart-5' : ''}
                ${!isStart && !isEnd && cell === 1 ? 'bg-foreground/70' : ''}
                ${!isStart && !isEnd && cell === 0 ? 'bg-background' : ''}
              `}
            />
          );
        })
      )}
    </div>
  );
}

export function PresetSelector({ onSelectPreset, disabled = false }: PresetSelectorProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Maze Presets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {MAZE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              disabled={disabled}
              className={`
                p-3 rounded-md border border-border
                hover-elevate active-elevate-2
                transition-colors
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              data-testid={`preset-${preset.id}`}
            >
              <MiniMazePreview 
                grid={preset.grid} 
                start={preset.start} 
                end={preset.end} 
              />
              <p className="text-xs font-medium text-center mt-2">
                {preset.name}
              </p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
