import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, ArrowRightLeft } from 'lucide-react';
import type { Position } from '@/lib/maze-types';

type QueueVisualizationProps = {
  queue: Position[];
  maxVisible?: number;
};

export function QueueVisualization({ queue, maxVisible = 10 }: QueueVisualizationProps) {
  const visibleQueue = queue.slice(0, maxVisible);
  const hiddenCount = Math.max(0, queue.length - maxVisible);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ArrowRightLeft className="h-5 w-5" />
              Queue
            </div>
          </CardTitle>
          <span className="text-sm text-muted-foreground font-mono">
            {queue.length} items
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[240px]">
          {queue.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
              Queue is empty
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
                <span className="bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                  Front (Dequeue)
                </span>
                <span className="bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                  Rear (Enqueue)
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {visibleQueue.map((pos, index) => {
                  const isFront = index === 0;
                  const isRear = index === visibleQueue.length - 1 && hiddenCount === 0;
                  
                  return (
                    <div
                      key={`${pos.x}-${pos.y}-${index}`}
                      className={`
                        flex items-center gap-2 p-3 rounded-md
                        font-mono text-sm transition-all
                        ${isFront 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : isRear
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-muted/50'
                        }
                      `}
                      data-testid={`queue-item-${index}`}
                    >
                      {isFront && (
                        <span className="text-xs font-bold">FRONT →</span>
                      )}
                      {!isFront && <span className="w-12" />}
                      <span className="flex-1 text-center font-bold">
                        ({pos.x}, {pos.y})
                      </span>
                      {isRear && (
                        <span className="text-xs font-bold">← REAR</span>
                      )}
                      {!isRear && index < visibleQueue.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      {!isRear && index === visibleQueue.length - 1 && <span className="w-12" />}
                    </div>
                  );
                })}
                {hiddenCount > 0 && (
                  <div className="text-center text-sm text-muted-foreground py-2 border-t border-dashed pt-4">
                    +{hiddenCount} more items
                  </div>
                )}
              </div>
              <div className="mt-4 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                <p><strong>FIFO:</strong> First In, First Out</p>
                <p className="mt-1">Items added at rear, removed from front</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

