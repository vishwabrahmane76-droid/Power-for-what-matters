import React from 'react';
import {
  Lock,
  Unlock,
  ShieldAlert,
  RotateCcw,
  AlertOctagon,
  CheckCircle,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SystemItem } from '../types';
import { sounds } from '../utils/audio';

interface ManualOverrideViewProps {
  systems: SystemItem[];
  manualOverrideActive: boolean;
  onOverride: (systemId: string, kw: number) => Promise<{ success: boolean; blocked?: boolean; message: string }>;
  onReturnControl: () => void;
  loading: boolean;
}

export const ManualOverrideView: React.FC<ManualOverrideViewProps> = ({
  systems,
  manualOverrideActive,
  onOverride,
  onReturnControl,
  loading
}) => {
  const [safetyMessage, setSafetyMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleSliderChange = async (system: SystemItem, newKw: number) => {
    sounds.playClick();
    setSafetyMessage(null);
    setSuccessMessage(null);

    const res = await onOverride(system.id, newKw);
    if (res.blocked) {
      sounds.playAlert();
      setSafetyMessage(res.message);
    } else {
      setSuccessMessage(res.message);
    }
  };

  const handleReturnToAI = () => {
    sounds.playOptimize();
    setSafetyMessage(null);
    setSuccessMessage('AI Autonomous Control Restored. Balancing constraints across all subsystems.');
    onReturnControl();
  };

  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              AUTHORIZED OPERATOR MANUAL CONTROL CONSOLE
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                  manualOverrideActive
                    ? 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                    : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                }`}
              >
                {manualOverrideActive ? 'MANUAL OVERRIDE ACTIVE' : 'AI SUPERVISORY AUTONOMOUS'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Manual dispatch desk with strict deterministic safety interlocks preventing unsafe medical shed
            </p>
          </div>
        </div>

        {/* Return Control to AI Button */}
        <button
          onClick={handleReturnToAI}
          disabled={loading || !manualOverrideActive}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
            manualOverrideActive
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/50 shadow-cyan-900/30'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>RETURN CONTROL TO AI</span>
        </button>
      </div>

      {/* Safety Interlock Notification Banner */}
      {safetyMessage && (
        <div className="p-4 rounded-xl bg-red-950/80 border-2 border-red-500/80 text-white flex items-start gap-3 shadow-lg shadow-red-950/50 animate-bounce">
          <AlertOctagon className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-red-200">
              SAFETY INTERLOCK TRIGGERED
            </h4>
            <p className="text-xs text-red-300 font-mono mt-0.5">{safetyMessage}</p>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {successMessage && !safetyMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-600/60 text-white flex items-center gap-2.5 shadow-md">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-xs text-emerald-200 font-mono">{successMessage}</p>
        </div>
      )}

      {/* Warning Notice Box */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>HARD SAFETY PROTOCOL:</strong> Critical Medical Equipment is locked to safe minimum 10.0 kW.
          The controller will block any operator command attempting to breach critical life-support limits.
        </span>
      </div>

      {/* Subsystem Manual Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {systems.map(sys => {
          const isMedical = sys.id === 'medical';
          return (
            <div
              key={sys.id}
              className={`p-4 rounded-xl border space-y-3 ${
                sys.status === 'MANUAL_OVERRIDE'
                  ? 'bg-[#181d2e] border-purple-500/80 shadow-md'
                  : 'bg-[#0e1626] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">{sys.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400">{sys.department}</span>
                </div>
                {isMedical && (
                  <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono font-bold">
                    LOCKED MIN
                  </span>
                )}
              </div>

              {/* Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Target Power:</span>
                  <span className="text-cyan-400 font-bold text-sm">
                    {sys.allocatedPower.toFixed(1)} kW
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={sys.maximumPower}
                  step="0.5"
                  value={sys.allocatedPower}
                  onChange={e => handleSliderChange(sys, parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>Safe Min: {sys.minimumPower} kW</span>
                  <span>Max: {sys.maximumPower} kW</span>
                </div>
              </div>

              {/* Quick Min / Max buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                <button
                  onClick={() => handleSliderChange(sys, sys.minimumPower)}
                  className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Set Min ({sys.minimumPower}kW)
                </button>
                <button
                  onClick={() => handleSliderChange(sys, sys.currentDemand)}
                  className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Match Demand
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
