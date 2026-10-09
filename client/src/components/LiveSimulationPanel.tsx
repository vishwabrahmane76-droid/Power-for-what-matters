import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Zap,
  BatteryCharging,
  Clock,
  Sparkles,
  Radio
} from 'lucide-react';
import { SystemState } from '../types';
import { sounds } from '../utils/audio';

interface LiveSimulationPanelProps {
  state: SystemState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  loading: boolean;
}

export const LiveSimulationPanel: React.FC<LiveSimulationPanelProps> = ({
  state,
  onStart,
  onPause,
  onReset,
  loading
}) => {
  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-700/60">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              REAL-TIME SIMULATION RUNTIME
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                  state.isSimulating
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-700 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {state.isSimulating ? 'SIMULATION RUNNING (3s TICK)' : 'PAUSED'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Simulates realistic environmental shifts, solar variance, battery discharge, and continuous AI load balancing
            </p>
          </div>
        </div>

        {/* Action Controls: START, PAUSE, RESET */}
        <div className="flex items-center gap-2">
          {!state.isSimulating ? (
            <button
              onClick={() => {
                sounds.playOptimize();
                onStart();
              }}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-900/30 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START LIVE SIMULATION</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                onPause();
              }}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-900/30 transition-all active:scale-95"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>PAUSE SIMULATION</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              onReset();
            }}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Reset system to default factory state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Real-time telemetry pulse metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-[#0e1626] border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>Cycle State:</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white">
            {state.isSimulating ? 'Active Dynamic Polling' : 'Stationary Baseline'}
          </div>
          <span className="text-[10px] text-slate-500">Recalculation interval: 3000ms</span>
        </div>

        <div className="p-3 rounded-xl bg-[#0e1626] border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>BESS Battery SOC:</span>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white">
            {state.kpis.batterySoc.toFixed(1)}% Capacity
          </div>
          <span className="text-[10px] text-slate-500">Autonomous charge/discharge curve</span>
        </div>

        <div className="p-3 rounded-xl bg-[#0e1626] border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>Emergency Reserve:</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-white">
            {state.kpis.emergencyReserveKw.toFixed(1)} kW ({state.kpis.emergencyReservePercent}%)
          </div>
          <span className="text-[10px] text-slate-500">Target safe envelope: 15.0%</span>
        </div>

        <div className="p-3 rounded-xl bg-[#0e1626] border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>Power Resilience:</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-white">
            {state.resilienceScore} / 100 Index
          </div>
          <span className="text-[10px] text-slate-500">0 Overload incidents detected</span>
        </div>
      </div>
    </div>
  );
};
