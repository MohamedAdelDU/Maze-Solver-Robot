import { StackVisualization } from '../StackVisualization';

export default function StackVisualizationExample() {
  const mockStack = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 3, y: 3 },
  ];

  return (
    <div className="w-64">
      <StackVisualization stack={mockStack} />
    </div>
  );
}
