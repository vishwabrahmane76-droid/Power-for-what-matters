import React from 'react';
import {
  Zap,
  Gauge,
  ShieldAlert,
  Server,
  Sparkles,
  AlertOctagon,
  BatteryCharging,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { KPIs } from '../types';

interface KpiCardsProps {
  kpis: KPIs;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis }) => {
  const powerUsagePercent = Math.min(
    100,
    Math.round((kpis.currentConsumptionKw / (kpis.availablePowerKw || 1)) * 100)
  );

  const reservePercent = Math.min(
    100,
    Math.round((kpis.emergencyReserveKw / (kpis.availablePowerKw || 1)) * 100)
  );

  const riskBadgeColor = {
    LOW: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-600/40',
      glow: 'shadow-emerald-950/30'
    },
    MEDIUM: {
      text: 'text-amber-400',
      bg: 'bg-amber-950/40',
      border: 'border-amber-600/40',
      glow: 'shadow-amber-950/30'
    },
    HIGH: {
      text: 'text-orange-400',
      bg: 'bg-orange-950/40',
      border: 'border-orange-600/40',
      glow: 'shadow-orange-950/30'
    },
    CRITICAL: {
      text: 'text-red-400',
      bg: 'bg-red-950/60',
      border: 'border-red-600/60',
      glow: 'shadow-red-950/50'
    }
  }[kpis.currentRisk] || {
    text: 'text-slate-400',
    bg: 'bg-slate-900',
    border: 'border-slate-700',
    glow: 'shadow-none'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {/* 1. Available Power */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#131c2e] to-[#0e1626] border border-[#233554] p-3.5 shadow-lg transition-all hover:border-cyan-500/40 group">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-medium tracking-wide">Available Power</span>
          <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
            {kpis.availablePowerKw.toFixed(1)}
          </span>
          <span className="text-xs font-mono text-slate-400">/ {kpis.totalCapacityKw.toFixed(0)} kW</span>
        </div>
        {/* Utilization Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (kpis.availablePowerKw / kpis.totalCapacityKw) * 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>Capacity: {Math.round((kpis.availablePowerKw / kpis.totalCapacityKw) * 100)}%</span>
          <span className="text-cyan-400">Online</span>
        </div>
      </div>

      {/* 2. Current Consumption */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#131c2e] to-[#0e1626] border border-[#233554] p-3.5 shadow-lg transition-all hover:border-blue-500/40 group">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-medium tracking-wide">Consumption</span>
          <Gauge className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
            {kpis.currentConsumptionKw.toFixed(1)}
          </span>
          <span className="text-xs font-mono text-slate-400">kW</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              powerUsagePercent > 95
                ? 'bg-red-500'
                : powerUsagePercent > 85
                ? 'bg-amber-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${powerUsagePercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>Load: {powerUsagePercent}%</span>
          <span className="text-slate-300 flex items-center gap-0.5">
            {powerUsagePercent > 80 ? (
              <TrendingUp className="w-3 h-3 text-amber-400 inline" />
            ) : (
              <TrendingDown className="w-3 h-3 text-emerald-400 inline" />
            )}
            Dynamic
          </span>
        </div>
      </div>

      {/* 3. Emergency Reserve */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#131c2e] to-[#0e1626] border border-[#233554] p-3.5 shadow-lg transition-all hover:border-emerald-500/40 group">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-medium tracking-wide">Emergency Reserve</span>
          <BatteryCharging className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {kpis.emergencyReserveKw.toFixed(1)}
          </span>
          <span className="text-xs font-mono text-slate-400">kW ({reservePercent}%)</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              reservePercent < 5
                ? 'bg-red-500'
                : reservePercent < 12
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min(100, (reservePercent / 20) * 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>Target: 15%</span>
          <span className={reservePercent >= 10 ? 'text-emerald-400' : 'text-amber-400'}>
            {reservePercent >= 10 ? 'Safeguarded' : 'Buffer Narrow'}
          </span>
        </div>
      </div>

      {/* 4. Systems Online */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#131c2e] to-[#0e1626] border border-[#233554] p-3.5 shadow-lg transition-all hover:border-purple-500/40 group">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-medium tracking-wide">Systems Online</span>
          <Server className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
            {kpis.systemsOnlineCount}
          </span>
          <span className="text-xs font-mono text-slate-400">/ {kpis.totalSystemsCount} Active</span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(kpis.systemsOnlineCount / kpis.totalSystemsCount) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span className="text-purple-300">100% Criticality Lock</span>
          <span>Zero Blackout</span>
        </div>
      </div>

      {/* 5. AI Optimization Efficiency */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#131c2e] to-[#0e1626] border border-[#233554] p-3.5 shadow-lg transition-all hover:border-cyan-400/50 group">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-medium tracking-wide">AI Optimization</span>
          <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl font-extrabold text-cyan-300 font-mono tracking-tight">
            {kpis.optimizationEfficiency}%
          </span>
          <span className="text-xs font-mono text-slate-400">Pareto</span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${kpis.optimizationEfficiency}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>Constraint Solver</span>
          <span className="text-cyan-400">Deterministic</span>
        </div>
      </div>

      {/* 6. Current Risk Level */}
      <div
        className={`relative overflow-hidden rounded-xl border p-3.5 shadow-lg transition-all group ${riskBadgeColor.bg} ${riskBadgeColor.border} ${riskBadgeColor.glow}`}
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-medium tracking-wide">Current Risk</span>
          <AlertOctagon className={`w-4 h-4 ${riskBadgeColor.text} group-hover:scale-110 transition-transform`} />
        </div>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className={`text-2xl font-extrabold font-mono tracking-tight ${riskBadgeColor.text}`}>
            {kpis.currentRisk}
          </span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              kpis.currentRisk === 'CRITICAL'
                ? 'bg-red-500 w-full'
                : kpis.currentRisk === 'HIGH'
                ? 'bg-orange-500 w-3/4'
                : kpis.currentRisk === 'MEDIUM'
                ? 'bg-amber-500 w-1/2'
                : 'bg-emerald-500 w-1/4'
            }`}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-300 mt-1 font-mono">
          <span>Battery: {kpis.batterySoc.toFixed(0)}%</span>
          <span className="font-semibold text-slate-200">Genset: {kpis.generatorFuelHours.toFixed(1)}h</span>
        </div>
      </div>
    </div>
  );
};
