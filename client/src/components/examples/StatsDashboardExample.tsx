import { StatsDashboard } from '../StatsDashboard';

export default function StatsDashboardExample() {
  return (
    <div className="w-72">
      <StatsDashboard
        stats={{
          stepsTaken: 42,
          backtracks: 8,
          cellsVisited: 35,
          pathLength: 18,
          timeElapsed: 2340,
        }}
      />
    </div>
  );
}
