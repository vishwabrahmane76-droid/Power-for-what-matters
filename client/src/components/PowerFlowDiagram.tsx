import React from 'react';
import {
  Zap,
  Activity,
  Cpu,
  Shield,
  HeartPulse,
  Radio,
  Lightbulb,
  Fan,
  Server,
  Droplets,
  BatteryCharging,
  LifeBuoy
} from 'lucide-react';
import { PowerSource, SystemItem } from '../types';
import { sounds } from '../utils/audio';

interface PowerFlowDiagramProps {
  powerSources: PowerSource[];
  systems: SystemItem[];
  totalAllocatedKw: number;
  availablePowerKw: number;
  onSelectSystem: (system: SystemItem) => void;
}

export const PowerFlowDiagram: React.FC<PowerFlowDiagramProps> = ({
  powerSources,
  systems,
  totalAllocatedKw,
  availablePowerKw,
  onSelectSystem
}) => {
  const getSystemIcon = (id: string) => {
    switch (id) {
      case 'medical': return HeartPulse;
      case 'communication': return Radio;
      case 'lighting': return Lightbulb;
      case 'cooling': return Fan;
      case 'computing': return Server;
      case 'water': return Droplets;
      case 'charging': return BatteryCharging;
      case 'emergency_support': return LifeBuoy;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPTIMAL': return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50';
      case 'BOOSTED': return 'text-cyan-300 bg-cyan-950/60 border-cyan-500/50';
      case 'THROTTLED': return 'text-amber-400 bg-amber-950/60 border-amber-500/50';
      case 'DEFICIT_CRITICAL': return 'text-red-400 bg-red-950/80 border-red-500/60 animate-pulse';
      case 'MANUAL_OVERRIDE': return 'text-purple-400 bg-purple-950/60 border-purple-500/50';
      default: return 'text-slate-300 bg-slate-900 border-slate-700';
    }
  };

  const getSourceColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'border-emerald-500/60 text-emerald-400';
      case 'DISCHARGING': return 'border-cyan-500/60 text-cyan-400';
      case 'FAULT':
      case 'OFFLINE': return 'border-red-500/60 text-red-400 opacity-60';
      default: return 'border-slate-600 text-slate-400';
    }
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#111827] to-[#0c121e] border border-[#1f2c42] p-5 shadow-2xl overflow-hidden">
      {/* Background glow and subtle grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              DYNAMIC POWER FLOW TELEMETRY
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                ACTIVE GRID BUS
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time multi-source generation routed through deterministic AI constraint optimizer
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">
            Total Bus Output: <strong className="text-white">{availablePowerKw.toFixed(1)} kW</strong>
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">
            Delivered Load: <strong className="text-cyan-400">{totalAllocatedKw.toFixed(1)} kW</strong>
          </span>
        </div>
      </div>

      {/* Interactive Diagram Container */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left Column: 4 Power Sources */}
        <div className="lg:col-span-3 space-y-2.5">
          <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Generation Sources (4)
          </div>
          {powerSources.map(source => (
            <div
              key={source.id}
              className={`p-3 rounded-xl bg-[#131d2e]/90 border transition-all hover:translate-x-1 ${getSourceColor(
                source.status
              )} shadow-md`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white text-xs truncate">{source.name}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    source.status === 'ONLINE'
                      ? 'bg-emerald-950 text-emerald-400'
                      : source.status === 'DISCHARGING'
                      ? 'bg-cyan-950 text-cyan-300'
                      : 'bg-red-950 text-red-400'
                  }`}
                >
                  {source.status}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-lg font-mono font-bold text-white">
                  {source.currentOutput.toFixed(1)}{' '}
                  <span className="text-[11px] font-normal text-slate-400">/ {source.maximumOutput} kW</span>
                </div>
                {source.type === 'BATTERY' && (
                  <span className="text-xs font-mono text-cyan-300">
                    {source.chargePercentage?.toFixed(0)}% SOC
                  </span>
                )}
                {source.type === 'GENERATOR' && (
                  <span className="text-xs font-mono text-amber-300">
                    {source.fuelHoursRemaining?.toFixed(1)}h Fuel
                  </span>
                )}
              </div>
              {/* Output bar */}
              <div className="w-full bg-slate-800/80 rounded-full h-1 mt-1.5 overflow-hidden">
                <div
                  className={`h-1 rounded-full ${
                    source.status === 'ONLINE' ? 'bg-cyan-400' : source.status === 'DISCHARGING' ? 'bg-cyan-300' : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(100, (source.currentOutput / source.maximumOutput) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Center Column: Central AI POWER OPTIMIZER NODE */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center my-4 lg:my-0">
          <div className="relative group cursor-pointer" onClick={() => sounds.playOptimize()}>
            {/* Animated Radar Halo Rings */}
            <div className="absolute inset-0 -m-3 rounded-2xl bg-cyan-500/20 blur-xl animate-pulse" />
            <div className="absolute inset-0 -m-6 rounded-full border border-cyan-500/20 animate-ping opacity-30 pointer-events-none" />

            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1a2b47] to-[#101b2d] border-2 border-cyan-400/80 shadow-2xl shadow-cyan-500/25 flex flex-col items-center text-center max-w-[260px] mx-auto transition-transform hover:scale-105">
              <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 mb-3 shadow-inner">
                <Cpu className="w-8 h-8 animate-pulse text-cyan-300" />
              </div>
              <h4 className="font-black text-white text-sm tracking-wider uppercase mb-1">
                AI POWER OPTIMIZER
              </h4>
              <p className="text-[11px] font-mono text-cyan-300 mb-2">
                Dynamic Constraint Engine
              </p>
              <div className="w-full py-1.5 px-3 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-[11px] font-mono space-y-0.5">
                <div className="flex justify-between text-slate-400">
                  <span>Routing Bus:</span>
                  <span className="text-white font-bold">{totalAllocatedKw.toFixed(1)} kW</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Deficit Guard:</span>
                  <span className="text-emerald-400 font-bold">100% Locked</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Continuous Multi-Objective Arbitration
          </div>
        </div>

        {/* Right Column: 8 Facility Connected Subsystems */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="sm:col-span-2 text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Facility Consumers (8)
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Click node to inspect</span>
          </div>

          {systems.map(system => {
            const Icon = getSystemIcon(system.id);
            const statusClass = getStatusColor(system.status);
            const isCritical = system.criticality >= 85;

            return (
              <div
                key={system.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectSystem(system);
                }}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer hover:border-cyan-400/80 hover:bg-[#1a283e] active:scale-[0.98] ${statusClass} shadow-md group`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <Icon className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-white text-xs truncate">{system.name}</span>
                  </div>
                  {isCritical && (
                    <span title="Life Critical System">
                      <Shield className="w-3 h-3 text-red-400 flex-shrink-0" />
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between font-mono">
                  <div className="text-sm font-bold text-white">
                    {system.allocatedPower.toFixed(1)}{' '}
                    <span className="text-[10px] text-slate-400">/ {system.currentDemand} kW</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1 rounded ${
                      system.delta > 0
                        ? 'text-cyan-300 bg-cyan-950'
                        : system.delta < 0
                        ? 'text-amber-300 bg-amber-950'
                        : 'text-slate-400 bg-slate-900'
                    }`}
                  >
                    {system.delta > 0 ? `+${system.delta}` : system.delta} kW
                  </span>
                </div>

                {/* Utilization mini bar */}
                <div className="w-full bg-slate-800/80 rounded-full h-1 mt-1 overflow-hidden">
                  <div
                    className={`h-1 rounded-full ${
                      system.allocatedPower >= system.currentDemand
                        ? 'bg-emerald-400'
                        : system.allocatedPower >= system.minimumPower
                        ? 'bg-amber-400'
                        : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (system.allocatedPower / (system.maximumPower || 1)) * 100)}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
