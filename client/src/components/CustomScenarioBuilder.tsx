import React from 'react';
import {
  Sliders,
  Play,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Zap,
  BatteryCharging,
  Sun,
  Server
} from 'lucide-react';
import { SystemState } from '../types';
import { sounds } from '../utils/audio';

interface CustomScenarioBuilderProps {
  currentState: SystemState;
  onApplyCustom: (payload: any) => void;
  loading: boolean;
}

export const CustomScenarioBuilder: React.FC<CustomScenarioBuilderProps> = ({
  currentState,
  onApplyCustom,
  loading
}) => {
  const [availablePower, setAvailablePower] = React.useState(currentState.kpis.availablePowerKw);
  const [batterySoc, setBatterySoc] = React.useState(currentState.kpis.batterySoc);
  const [solarOutput, setSolarOutput] = React.useState(
    currentState.powerSources.find(s => s.id === 'solar')?.currentOutput || 8
  );
  const [generatorOutput, setGeneratorOutput] = React.useState(
    currentState.powerSources.find(s => s.id === 'generator')?.currentOutput || 15
  );

  const [demands, setDemands] = React.useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    currentState.systems.forEach(s => {
      map[s.id] = s.currentDemand;
    });
    return map;
  });

  const [urgencies, setUrgencies] = React.useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    currentState.systems.forEach(s => {
      map[s.id] = s.urgency;
    });
    return map;
  });

  const handleDemandChange = (sysId: string, val: number) => {
    setDemands(prev => ({ ...prev, [sysId]: val }));
  };

  const handleUrgencyChange = (sysId: string, val: string) => {
    setUrgencies(prev => ({ ...prev, [sysId]: val }));
  };

  const handleOptimize = () => {
    sounds.playOptimize();
    onApplyCustom({
      availablePowerKw: availablePower,
      batterySoc,
      solarOutput,
      generatorOutput,
      demands,
      urgencies
    });
  };

  const handleReset = () => {
    sounds.playClick();
    setAvailablePower(48);
    setBatterySoc(68);
    setSolarOutput(8);
    setGeneratorOutput(15);
    const dMap: Record<string, number> = {
      medical: 14,
      communication: 8,
      lighting: 5,
      cooling: 12,
      computing: 6,
      water: 7,
      charging: 8,
      emergency_support: 4
    };
    const uMap: Record<string, string> = {
      medical: 'HIGH',
      communication: 'NORMAL',
      lighting: 'NORMAL',
      cooling: 'NORMAL',
      computing: 'NORMAL',
      water: 'NORMAL',
      charging: 'LOW',
      emergency_support: 'NORMAL'
    };
    setDemands(dMap);
    setUrgencies(uMap);
  };

  const totalDemandSum = Object.values(demands).reduce((a, b) => a + Number(b), 0);

  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-950 text-purple-300 border border-purple-700/60">
            <Sliders className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              CUSTOM EMERGENCY SCENARIO BUILDER
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700">
                WHAT-IF SIMULATION
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Customize generational capacity, system loads, and urgency stress factors to test AI adaptability
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Visual Pipeline Banner */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono bg-[#0c121e] p-2.5 rounded-xl border border-slate-800">
        <div className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
          <span className="text-slate-500 text-[10px] block">STEP 1</span>
          1. INPUT CONDITIONS
        </div>
        <div className="p-2 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800">
          <span className="text-purple-400 text-[10px] block">STEP 2</span>
          2. AI CONSTRAINT SOLVER
        </div>
        <div className="p-2 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800">
          <span className="text-cyan-400 text-[10px] block">STEP 3</span>
          3. RESULT ALLOCATION
        </div>
        <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800">
          <span className="text-emerald-400 text-[10px] block">STEP 4</span>
          4. CAUSAL EXPLANATION
        </div>
      </div>

      {/* Section 1: Power Generation Inputs */}
      <div>
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          Primary Generation & Storage Inputs
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0e1626] p-4 rounded-xl border border-slate-800">
          {/* Available Total Power */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Total Available Bus</span>
              <span className="text-cyan-400 font-bold">{availablePower.toFixed(1)} kW</span>
            </div>
            <input
              type="range"
              min="15"
              max="70"
              step="0.5"
              value={availablePower}
              onChange={e => setAvailablePower(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>15 kW (Severe)</span>
              <span>70 kW (Surplus)</span>
            </div>
          </div>

          {/* Battery SOC */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">BESS Battery SOC</span>
              <span className="text-emerald-400 font-bold">{batterySoc.toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={batterySoc}
              onChange={e => setBatterySoc(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>10% (Depleted)</span>
              <span>100% (Full)</span>
            </div>
          </div>

          {/* Solar Array Output */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Solar PV Output</span>
              <span className="text-amber-400 font-bold">{solarOutput.toFixed(1)} kW</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={solarOutput}
              onChange={e => setSolarOutput(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0 kW (Night)</span>
              <span>15 kW (Peak Sun)</span>
            </div>
          </div>

          {/* Diesel Genset Output */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Diesel Genset Output</span>
              <span className="text-orange-400 font-bold">{generatorOutput.toFixed(1)} kW</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={generatorOutput}
              onChange={e => setGeneratorOutput(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0 kW (Fault)</span>
              <span>30 kW (Max)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Subsystem Demands & Urgency Levels */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            Subsystem Demands & Urgency Controls
          </h4>
          <span className="text-xs font-mono text-slate-400">
            Total Demanded: <strong className="text-white">{totalDemandSum.toFixed(1)} kW</strong>
            {totalDemandSum > availablePower && (
              <span className="text-red-400 font-bold ml-2">
                (Deficit: -{(totalDemandSum - availablePower).toFixed(1)} kW)
              </span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentState.systems.map(sys => (
            <div
              key={sys.id}
              className="p-3 rounded-xl bg-[#0e1626] border border-slate-800 space-y-2 text-xs font-mono"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-sans text-xs truncate">{sys.name}</span>
                <span className="text-[10px] text-slate-400">Min: {sys.minimumPower}kW</span>
              </div>

              {/* Demand slider */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Demand:</span>
                  <span className="text-white font-bold">{demands[sys.id] ?? sys.currentDemand} kW</span>
                </div>
                <input
                  type="range"
                  min={sys.minimumPower}
                  max={sys.maximumPower}
                  step="0.5"
                  value={demands[sys.id] ?? sys.currentDemand}
                  onChange={e => handleDemandChange(sys.id, parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Urgency dropdown */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Urgency:</span>
                <select
                  value={urgencies[sys.id] ?? sys.urgency}
                  onChange={e => handleUrgencyChange(sys.id, e.target.value)}
                  className="bg-slate-900 text-white rounded px-2 py-0.5 border border-slate-700 text-[11px] focus:outline-none focus:border-cyan-400"
                >
                  <option value="LOW">LOW</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="ELEVATED">ELEVATED</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimize Action Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleOptimize}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-xl shadow-purple-900/40 border border-purple-400/40 transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>OPTIMIZE POWER NOW</span>
        </button>
      </div>
    </div>
  );
};
