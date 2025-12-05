import { PresetSelector } from '../PresetSelector';

export default function PresetSelectorExample() {
  return (
    <div className="w-72">
      <PresetSelector
        onSelectPreset={(preset) => console.log(`Selected preset: ${preset.name}`)}
      />
    </div>
  );
}
