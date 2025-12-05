import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers } from 'lucide-react';
import type { Position } from '@/lib/maze-types';

type StackVisualizationProps = {
  stack: Position[];
  maxVisible?: number;
};

export function StackVisualization({ stack, maxVisible = 10 }: StackVisualizationProps) {
  const visibleStack = stack.slice(-maxVisible).reverse();
  const hiddenCount = Math.max(0, stack.length - maxVisible);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Stack
          </CardTitle>
          <span className="text-sm text-muted-foreground font-mono">
            {stack.length} items
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[240px]">
          {stack.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
              Stack is empty
            </div>
          ) : (
            <div className="space-y-2">
              {visibleStack.map((pos, index) => {
                const isTop = index === 0;
                const actualIndex = stack.length - 1 - index;
                
                return (
                  <div
                    key={`${pos.x}-${pos.y}-${actualIndex}`}
                    className={`
                      flex items-center justify-between p-3 rounded-md
                      font-mono text-sm
                      ${isTop 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted/50'
                      }
                    `}
                    data-testid={`stack-item-${actualIndex}`}
                  >
                    <span className="text-xs opacity-60">
                      [{actualIndex}]
                    </span>
                    <span className="font-bold">
                      ({pos.x}, {pos.y})
                    </span>
                    {isTop && (
                      <span className="text-xs">TOP</span>
                    )}
                    {!isTop && <span />}
                  </div>
                );
              })}
              {hiddenCount > 0 && (
                <div className="text-center text-sm text-muted-foreground py-2">
                  +{hiddenCount} more items
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
