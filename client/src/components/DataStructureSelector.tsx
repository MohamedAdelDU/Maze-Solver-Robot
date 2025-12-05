import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, ArrowRightLeft, Link as LinkIcon } from 'lucide-react';
import type { DataStructureType } from '@/lib/maze-types';
import { cn } from '@/lib/utils';

type DataStructureSelectorProps = {
  selectedType: DataStructureType;
  onSelectType: (type: DataStructureType) => void;
  disabled?: boolean;
};

const dataStructures: {
  type: DataStructureType;
  name: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    type: 'stack',
    name: 'Stack',
    icon: <Layers className="h-5 w-5" />,
    description: 'LIFO - Last In, First Out',
  },
  {
    type: 'queue',
    name: 'Queue',
    icon: <ArrowRightLeft className="h-5 w-5" />,
    description: 'FIFO - First In, First Out',
  },
  {
    type: 'linkedlist',
    name: 'Linked List',
    icon: <LinkIcon className="h-5 w-5" />,
    description: 'Nodes connected sequentially',
  },
];

export function DataStructureSelector({
  selectedType,
  onSelectType,
  disabled = false,
}: DataStructureSelectorProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Data Structure</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {dataStructures.map((ds) => (
          <Button
            key={ds.type}
            variant={selectedType === ds.type ? 'default' : 'outline'}
            className={cn(
              'w-full justify-start gap-3 h-auto py-3',
              selectedType === ds.type && 'bg-primary text-primary-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !disabled && onSelectType(ds.type)}
            disabled={disabled}
          >
            <div className="flex items-center gap-3 flex-1">
              {ds.icon}
              <div className="flex flex-col items-start">
                <span className="font-semibold">{ds.name}</span>
                <span className="text-xs opacity-70">{ds.description}</span>
              </div>
            </div>
            {selectedType === ds.type && (
              <span className="text-xs">✓</span>
            )}
          </Button>
        ))}
        <div className="mt-4 p-3 bg-muted/50 rounded-md text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Algorithm Behavior:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li><strong>Stack:</strong> DFS - Explores deep paths first</li>
            <li><strong>Queue:</strong> BFS - Explores level by level</li>
            <li><strong>Linked List:</strong> Sequential traversal</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

