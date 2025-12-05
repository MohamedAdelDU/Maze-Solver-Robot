import { Play, Pause, SkipForward, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AlgorithmState } from '@/lib/maze-types';

type ControlPanelProps = {
  algorithmState: AlgorithmState;
  speed: number;
  onStart: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onClear: () => void;
  onSpeedChange: (speed: number) => void;
};

export function ControlPanel({
  algorithmState,
  speed,
  onStart,
  onPause,
  onStepForward,
  onReset,
  onClear,
  onSpeedChange,
}: ControlPanelProps) {
  const isRunning = algorithmState === 'running';
  const isFinished = algorithmState === 'finished' || algorithmState === 'no-path';
  const canPlay = algorithmState === 'idle' || algorithmState === 'paused';

  const speedLabels = ['Fast', 'Normal', 'Slow'];
  const speedIndex = speed <= 150 ? 0 : speed <= 350 ? 1 : 2;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-3">
          <Button
            size="icon"
            variant={isRunning ? 'secondary' : 'default'}
            className="h-12 w-12 rounded-full"
            onClick={isRunning ? onPause : onStart}
            disabled={isFinished}
            data-testid="button-play-pause"
          >
            {isRunning ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full"
            onClick={onStepForward}
            disabled={isRunning || isFinished}
            data-testid="button-step-forward"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Speed</span>
            <span className="text-sm text-muted-foreground">{speedLabels[speedIndex]}</span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={([value]) => onSpeedChange(value)}
            min={50}
            max={500}
            step={50}
            className="w-full"
            disabled={isRunning}
            data-testid="slider-speed"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Fast</span>
            <span>Slow</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full gap-2"
            data-testid="button-reset"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            variant="outline"
            onClick={onClear}
            disabled={algorithmState !== 'idle'}
            className="w-full gap-2"
            data-testid="button-clear"
          >
            <Trash2 className="h-4 w-4" />
            Clear Maze
          </Button>
        </div>

        {isFinished && (
          <div className={`text-center p-3 rounded-md ${
            algorithmState === 'finished' 
              ? 'bg-chart-2/20 text-chart-2' 
              : 'bg-destructive/20 text-destructive'
          }`}>
            <p className="text-sm font-medium">
              {algorithmState === 'finished' ? 'Path Found!' : 'No Path Found'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
