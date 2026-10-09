import React from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle,
  Building
} from 'lucide-react';
import { FacilityConfig, OptimizationMode } from '../types';
import { sounds } from '../utils/audio';

interface SettingsViewProps {
  config: FacilityConfig;
  onSaveSettings: (newConfig: Partial<FacilityConfig>) => void;
  loading: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  config,
  onSaveSettings,
  loading
}) => {
  const [facilityName, setFacilityName] = React.useState(config.facilityName);
  const [totalCapacityKw, setTotalCapacityKw] = React.useState(config.totalCapacityKw);
  const [availablePowerKw, setAvailablePowerKw] = React.useState(config.availablePowerKw);
  const [emergencyReservePercent, setEmergencyReservePercent] = React.useState(config.emergencyReservePercent);
  const [optimizationMode, setOptimizationMode] = React.useState<OptimizationMode>(config.optimizationMode);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const modes: { id: OptimizationMode; title: string; desc: string; color: string }[] = [
    {
      id: 'BALANCED',
      title: 'Balanced Strategy',
      desc: 'Proportionally balances critical services, environmental cooling, and reserve buffer.',
      color: 'border-cyan-500/50 bg-cyan-950/20'
    },
    {
      id: 'CRITICAL-FIRST',
      title: 'Critical-First Strategy',
      desc: 'Strictly locks 100% of Medical, Comms, and Safety; curtails all non-essential loads.',
      color: 'border-purple-500/50 bg-purple-950/20'
    },
    {
      id: 'MEDICAL-FIRST',
      title: 'Medical-First Emergency',
      desc: 'Maximizes power routing to ICU trauma equipment, life-support ventilators, and surgical suites.',
      color: 'border-red-500/50 bg-red-950/20'
    },
    {
      id: 'ENERGY-SAVING',
      title: 'Energy-Saving / Battery Preservation',
      desc: 'Minimizes power draw across secondary loads to extend generator fuel and battery runtime.',
      color: 'border-emerald-500/50 bg-emerald-950/20'
    }
  ];

  const handleSave = () => {
    sounds.playOptimize();
    onSaveSettings({
      facilityName,
      totalCapacityKw: Number(totalCapacityKw),
      availablePowerKw: Number(availablePowerKw),
      emergencyReservePercent: Number(emergencyReservePercent),
      optimizationMode
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              COMMAND SYSTEM SETTINGS & TUNING
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                ACTIVE MODE: {optimizationMode}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Configure baseline electrical parameters, safety thresholds, and autonomous solver optimization strategy
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/50 shadow-md shadow-cyan-900/30 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>SAVE & RE-OPTIMIZE</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-white flex items-center gap-2 text-xs font-mono">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully. AI recalculated distribution matrix with updated mode constraints.</span>
        </div>
      )}

      {/* AI Strategy Mode Selector */}
      <div>
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
          1. Autonomous AI Optimization Strategy Mode
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {modes.map(mode => {
            const isSelected = optimizationMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => {
                  sounds.playClick();
                  setOptimizationMode(mode.id);
                }}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${mode.color} ${
                  isSelected ? 'ring-2 ring-cyan-400 border-cyan-400 bg-[#16233b]' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h5 className="font-bold text-white text-xs">{mode.title}</h5>
                  {isSelected && (
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">ACTIVE</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">{mode.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Facility Electrical Thresholds */}
      <div>
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
          2. Facility Operational Boundaries & Safety Reserves
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0e1626] p-4 rounded-xl border border-slate-800">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Facility Name</label>
            <input
              type="text"
              value={facilityName}
              onChange={e => setFacilityName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Total Grid Capacity (kW)
            </label>
            <input
              type="number"
              value={totalCapacityKw}
              onChange={e => setTotalCapacityKw(parseFloat(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Available Generation (kW)
            </label>
            <input
              type="number"
              value={availablePowerKw}
              onChange={e => setAvailablePowerKw(parseFloat(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Emergency Reserve Target (%)
            </label>
            <input
              type="number"
              value={emergencyReservePercent}
              onChange={e => setEmergencyReservePercent(parseFloat(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
