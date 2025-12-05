import { useMazeSolver } from '@/hooks/use-maze-solver';
import { MazeGrid } from './MazeGrid';
import { ControlPanel } from './ControlPanel';
import { StatsDashboard } from './StatsDashboard';
import { StackVisualization } from './StackVisualization';
import { QueueVisualization } from './QueueVisualization';
import { LinkedListVisualization } from './LinkedListVisualization';
import { DataStructureSelector } from './DataStructureSelector';
import { PresetSelector } from './PresetSelector';
import { Legend } from './Legend';
import { ThemeToggle } from './ThemeToggle';
import { Bot, Cpu, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function MazeSolverApp() {
  const {
    cellStates,
    stack,
    queue,
    linkedList,
    dataStructureType,
    setDataStructureType,
    currentDataStructure,
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
  } = useMazeSolver(10);

  const isEditing = algorithmState === 'idle';
  // Get current position based on data structure type
  const currentPosition = (() => {
    if (currentDataStructure.length === 0) return null;
    switch (dataStructureType) {
      case 'stack':
      case 'linkedlist':
        return currentDataStructure[currentDataStructure.length - 1];
      case 'queue':
        return currentDataStructure[0]; // Front of queue
      default:
        return currentDataStructure[currentDataStructure.length - 1];
    }
  })();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Maze Solver Robot</h1>
              <p className="text-xs text-muted-foreground">
                {dataStructureType === 'stack' && 'DFS Pathfinding Visualization'}
                {dataStructureType === 'queue' && 'BFS Pathfinding Visualization'}
                {dataStructureType === 'linkedlist' && 'Linked List Traversal Visualization'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-info">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    How It Works
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="space-y-4 text-left mt-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Data Structures</h4>
                        <p className="text-sm mb-2">
                          Choose between different data structures to see how they affect pathfinding:
                        </p>
                        <ul className="text-sm space-y-1 list-disc list-inside ml-2">
                          <li><strong>Stack (DFS):</strong> Explores deep paths first, uses LIFO</li>
                          <li><strong>Queue (BFS):</strong> Explores level by level, uses FIFO</li>
                          <li><strong>Linked List:</strong> Sequential traversal with node connections</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">How It Works</h4>
                        <p className="text-sm">
                          Each data structure affects how the algorithm explores the maze. 
                          Watch how the visualization changes based on your selection!
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Controls</h4>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                          <li>Click cells to toggle walls</li>
                          <li>Shift+Click to set start position</li>
                          <li>Alt+Click to set end position</li>
                          <li>Use presets for quick demos</li>
                        </ul>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6">
          <aside className="space-y-6 order-2 lg:order-1">
            <DataStructureSelector
              selectedType={dataStructureType}
              onSelectType={setDataStructureType}
              disabled={!isEditing}
            />
            <ControlPanel
              algorithmState={algorithmState}
              speed={speed}
              onStart={startAlgorithm}
              onPause={pauseAlgorithm}
              onStepForward={stepForward}
              onReset={reset}
              onClear={clearMaze}
              onSpeedChange={setSpeed}
            />
            <PresetSelector
              onSelectPreset={loadPreset}
              disabled={!isEditing}
            />
          </aside>

          <div className="space-y-4 order-1 lg:order-2">
            <Card>
              <CardContent className="p-4 md:p-6">
                <MazeGrid
                  cellStates={cellStates}
                  onCellClick={toggleCell}
                  onSetStart={setStartPosition}
                  onSetEnd={setEndPosition}
                  disabled={!isEditing}
                  currentPosition={currentPosition}
                />
              </CardContent>
            </Card>
            <Legend />
          </div>

          <aside className="space-y-6 order-3">
            <StatsDashboard stats={stats} />
            {dataStructureType === 'stack' && (
              <StackVisualization stack={stack} />
            )}
            {dataStructureType === 'queue' && (
              <QueueVisualization queue={queue} />
            )}
            {dataStructureType === 'linkedlist' && (
              <LinkedListVisualization nodes={linkedList} />
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
