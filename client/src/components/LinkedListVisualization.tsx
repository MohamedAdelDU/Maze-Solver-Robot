import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';
import type { Position } from '@/lib/maze-types';

type LinkedListNode = {
  position: Position;
  id: string;
};

type LinkedListVisualizationProps = {
  nodes: Position[];
  maxVisible?: number;
};

export function LinkedListVisualization({ nodes, maxVisible = 10 }: LinkedListVisualizationProps) {
  const visibleNodes = nodes.slice(0, maxVisible);
  const hiddenCount = Math.max(0, nodes.length - maxVisible);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Linked List
          </CardTitle>
          <span className="text-sm text-muted-foreground font-mono">
            {nodes.length} nodes
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[240px]">
          {nodes.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
              Linked List is empty
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
                <span className="bg-purple-500/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">
                  Head
                </span>
                <span className="bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded">
                  Tail
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {visibleNodes.map((pos, index) => {
                  const isHead = index === 0;
                  const isTail = index === visibleNodes.length - 1 && hiddenCount === 0;
                  
                  return (
                    <div
                      key={`${pos.x}-${pos.y}-${index}`}
                      className="flex items-center gap-1"
                    >
                      <div
                        className={`
                          flex flex-col items-center p-3 rounded-md
                          font-mono text-sm transition-all min-w-[80px]
                          ${isHead 
                            ? 'bg-purple-500 text-white shadow-md ring-2 ring-purple-300' 
                            : isTail
                            ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-300'
                            : 'bg-muted/50'
                          }
                        `}
                        data-testid={`linkedlist-node-${index}`}
                      >
                        <div className="text-xs opacity-70 mb-1">
                          Node {index}
                        </div>
                        <div className="font-bold text-center">
                          ({pos.x}, {pos.y})
                        </div>
                        {isHead && (
                          <div className="text-xs mt-1 opacity-80">HEAD</div>
                        )}
                        {isTail && (
                          <div className="text-xs mt-1 opacity-80">TAIL</div>
                        )}
                      </div>
                      {!isTail && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground mx-1" />
                      )}
                    </div>
                  );
                })}
                {hiddenCount > 0 && (
                  <div className="flex items-center gap-1">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground px-3 py-2 bg-muted/30 rounded">
                      +{hiddenCount} more
                    </div>
                  </div>
                )}
              </div>
              {nodes.length > 0 && (
                <div className="mt-4 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                  <p><strong>Structure:</strong> Each node points to the next</p>
                  <p className="mt-1">Head → Node → Node → ... → Tail → null</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

