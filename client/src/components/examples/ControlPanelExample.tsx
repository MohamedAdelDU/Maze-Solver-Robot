import { useState } from 'react';
import { ControlPanel } from '../ControlPanel';
import type { AlgorithmState } from '@/lib/maze-types';

export default function ControlPanelExample() {
  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>('idle');
  const [speed, setSpeed] = useState(300);

  return (
    <div className="w-72">
      <ControlPanel
        algorithmState={algorithmState}
        speed={speed}
        onStart={() => {
          console.log('Start clicked');
          setAlgorithmState('running');
        }}
        onPause={() => {
          console.log('Pause clicked');
          setAlgorithmState('paused');
        }}
        onStepForward={() => console.log('Step forward clicked')}
        onReset={() => {
          console.log('Reset clicked');
          setAlgorithmState('idle');
        }}
        onClear={() => console.log('Clear clicked')}
        onSpeedChange={setSpeed}
      />
    </div>
  );
}
