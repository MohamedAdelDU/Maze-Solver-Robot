import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footprints, RotateCcw, Eye, Route, Clock } from 'lucide-react';
import type { MazeStats } from '@/lib/maze-types';

type StatsDashboardProps = {
  stats: MazeStats;
};

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const statItems = [
    { 
      label: 'Steps Taken', 
      value: stats.stepsTaken, 
      icon: Footprints,
      color: 'text-primary'
    },
    { 
      label: 'Backtracks', 
      value: stats.backtracks, 
      icon: RotateCcw,
      color: 'text-chart-4'
    },
    { 
      label: 'Cells Visited', 
      value: stats.cellsVisited, 
      icon: Eye,
      color: 'text-chart-3'
    },
    { 
      label: 'Path Length', 
      value: stats.pathLength || '-', 
      icon: Route,
      color: 'text-chart-2'
    },
    { 
      label: 'Time Elapsed', 
      value: formatTime(stats.timeElapsed), 
      icon: Clock,
      color: 'text-muted-foreground'
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-3 rounded-md bg-muted/50"
            data-testid={`stat-${item.label.toLowerCase().replace(' ', '-')}`}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <span className="text-xl font-bold font-mono">{item.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
