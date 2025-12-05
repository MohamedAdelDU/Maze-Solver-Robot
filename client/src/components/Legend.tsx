import { MapPin, Flag, Bot } from 'lucide-react';

type LegendItem = {
  label: string;
  color: string;
  icon?: typeof MapPin;
};

const legendItems: LegendItem[] = [
  { label: 'Empty', color: 'bg-background border border-border' },
  { label: 'Wall', color: 'bg-foreground/80' },
  { label: 'Start', color: 'bg-chart-2', icon: MapPin },
  { label: 'End', color: 'bg-chart-5', icon: Flag },
  { label: 'Visited', color: 'bg-primary/30' },
  { label: 'Current', color: 'bg-primary', icon: Bot },
  { label: 'Path', color: 'bg-chart-2' },
  { label: 'Backtracked', color: 'bg-chart-4/40' },
];

export function Legend() {
  return (
    <div className="flex flex-wrap gap-3 justify-center" data-testid="legend">
      {legendItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2"
        >
          <div 
            className={`w-4 h-4 rounded-sm ${item.color} flex items-center justify-center`}
          >
            {item.icon && (
              <item.icon className="w-2.5 h-2.5 text-white" />
            )}
          </div>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
