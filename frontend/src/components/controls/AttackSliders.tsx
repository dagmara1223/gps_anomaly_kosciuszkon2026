
interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  isWarning?: boolean;
}

const SliderControl = ({ label, min, max, step, value, onChange, isWarning = false }: SliderProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[10px] text-slate-500 uppercase font-bold">{label}</label>
      <span className={`font-mono text-sm ${isWarning ? 'text-red-500' : 'text-emerald-400'}`}>
        {value > 0 && label.includes('Doppler') ? `+${value}` : value}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
    />
  </div>
);

interface AttackSlidersProps {
  params: any;
  onParamChange: (key: string, value: number) => void;
}

export default function AttackSliders({ params, onParamChange }: AttackSlidersProps) {
  return (
    <div className="space-y-6">
      <SliderControl
        label="CN0 Scale"
        min={0.5} max={1.5} step={0.1}
        value={params.cn0_scale}
        onChange={(v) => onParamChange('cn0_scale', v)}
      />
      <SliderControl
        label="Noise Level (dB-Hz)"
        min={0} max={5} step={0.1}
        value={params.noise_level}
        onChange={(v) => onParamChange('noise_level', v)}
      />
      <SliderControl
        label="Doppler Shift (Hz)"
        min={-2000} max={2000} step={10}
        value={params.doppler_shift}
        onChange={(v) => onParamChange('doppler_shift', v)}
        isWarning={Math.abs(params.doppler_shift) > 1000}
      />
      <SliderControl
        label="Pseudorange Bias (m)"
        min={-100} max={100} step={1}
        value={params.pseudorange_bias}
        onChange={(v) => onParamChange('pseudorange_bias', v)}
      />
    </div>
  );
}