import React from 'react';
import {
  Sliders,
  Play,
  HeartPulse,
  Radio,
  ZapOff,
  AlertOctagon,
  Layers,
  Moon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface ScenarioSimulatorProps {
  activeScenario: string;
  onRunScenario: (scenarioKey: string) => void;
  onOpenCustomBuilder: () => void;
  loading: boolean;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  activeScenario,
  onRunScenario,
  onOpenCustomBuilder,
  loading
}) => {
  const [selectedScenarioKey, setSelectedScenarioKey] = React.useState('NORMAL');

  const scenarios = [
    {
      key: 'NORMAL',
      title: 'A. Normal Operation',
      subtitle: 'Baseline 48.0 kW Generation',
      desc: 'Grid (25 kW), Generator (15 kW), Solar (8 kW) synchronized. 15% reserve buffer active.',
      icon: ShieldCheck,
      color: 'border-slate-700 bg-slate-900/80 hover:border-emerald-500/50'
    },
    {
      key: 'MEDICAL_EMERGENCY',
      title: 'B. Mass Casualty Medical Surge',
      subtitle: 'Trauma Code Blue Surge',
      desc: 'Ventilators & life support surge to 17.5 kW. AI must preserve medical power by shedding non-critical loads.',
      icon: HeartPulse,
      color: 'border-red-900/60 bg-red-950/20 hover:border-red-500/80'
    },
    {
      key: 'COMMUNICATION_EMERGENCY',
      title: 'C. Emergency Broadcast Surge',
      subtitle: 'Disaster Coordination Uplink',
      desc: 'Radio tower & telemetry surge to 11.5 kW for citywide evacuation broadcasts.',
      icon: Radio,
      color: 'border-blue-900/60 bg-blue-950/20 hover:border-blue-500/80'
    },
    {
      key: 'POWER_SOURCE_FAILURE',
      title: 'D. Primary Grid Blackout',
      subtitle: 'Municipal Feeder Collapse',
      desc: 'Lose 25 kW municipal feed. Switch to islanded microgrid (Generator + BESS Battery).',
      icon: ZapOff,
      color: 'border-amber-900/60 bg-amber-950/20 hover:border-amber-500/80'
    },
    {
      key: 'EXTREME_SHORTAGE',
      title: 'E. Extreme Power Shortage',
      subtitle: 'Generator Derate + Grid Loss',
      desc: 'Generation drops to 22.0 kW total. Deep load shedding enforced while strictly protecting ICU.',
      icon: AlertOctagon,
      color: 'border-red-800 bg-red-950/40 hover:border-red-400'
    },
    {
      key: 'MULTIPLE_EMERGENCIES',
      title: 'F. Cascading Multi-Fault Crisis',
      subtitle: 'Trauma Inflow + Generator Trip',
      desc: 'Severe simultaneous stress test: life support surge coinciding with loss of prime generator.',
      icon: Layers,
      color: 'border-purple-900/60 bg-purple-950/20 hover:border-purple-500/80'
    },
    {
      key: 'NIGHT_EMERGENCY',
      title: 'G. Night-Time Operation',
      subtitle: 'Zero Solar PV + High Lighting',
      desc: 'Solar generation drops to 0.0 kW. Corridor egress lighting demand escalates to 7.0 kW.',
      icon: Moon,
      color: 'border-indigo-900/60 bg-indigo-950/20 hover:border-indigo-500/80'
    }
  ];

  const handleSelect = (key: string) => {
    setSelectedScenarioKey(key);
    sounds.playClick();
  };

  const handleRun = () => {
    sounds.playOptimize();
    onRunScenario(selectedScenarioKey);
  };

  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-700/50">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              EMERGENCY SCENARIO SIMULATOR
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                ACTIVE: {activeScenario}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Select pre-configured disaster profiles and run deterministic AI reallocation tests
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCustomBuilder}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-300 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Custom Scenario Builder (H)</span>
        </button>
      </div>

      {/* Grid of Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {scenarios.map(sc => {
          const Icon = sc.icon;
          const isSelected = selectedScenarioKey === sc.key;
          return (
            <div
              key={sc.key}
              onClick={() => handleSelect(sc.key)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative shadow-md flex flex-col justify-between ${
                sc.color
              } ${isSelected ? 'ring-2 ring-cyan-400 border-cyan-400 bg-[#16233b]' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-white text-xs mb-0.5">{sc.title}</h4>
                <div className="text-[11px] font-mono text-cyan-400 mb-2">{sc.subtitle}</div>
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-3 mb-3">
                  {sc.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Deterministic Solver</span>
                <span className="text-cyan-400 group-hover:underline">Click to arm</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent Run Scenario Button */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-[#0d1422] p-4 rounded-xl border border-slate-800">
        <div>
          <span className="text-xs text-slate-400 block font-mono">Armed Scenario:</span>
          <span className="text-sm font-bold text-white font-sans">
            {scenarios.find(s => s.key === selectedScenarioKey)?.title}
          </span>
        </div>

        <button
          onClick={handleRun}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/50 shadow-lg shadow-cyan-900/40 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>RUN SCENARIO NOW</span>
        </button>
      </div>
    </div>
  );
};
