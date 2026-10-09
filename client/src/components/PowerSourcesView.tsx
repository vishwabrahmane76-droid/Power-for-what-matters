import React from 'react';
import {
  BatteryCharging,
  Zap,
  Flame,
  Sun,
  ShieldCheck,
  Clock,
  Gauge,
  Percent
} from 'lucide-react';
import { PowerSource } from '../types';

interface PowerSourcesViewProps {
  sources: PowerSource[];
}

export const PowerSourcesView: React.FC<PowerSourcesViewProps> = ({ sources }) => {
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'GRID': return Zap;
      case 'GENERATOR': return Flame;
      case 'SOLAR': return Sun;
      case 'BATTERY': return BatteryCharging;
      default: return Zap;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-emerald-950 text-emerald-400 border-emerald-700';
      case 'DISCHARGING': return 'bg-cyan-950 text-cyan-400 border-cyan-700 animate-pulse';
      case 'STANDBY': return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'FAULT':
      case 'OFFLINE': return 'bg-red-950 text-red-400 border-red-700 animate-pulse';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <BatteryCharging className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              FACILITY GENERATION & STORAGE TELEMETRY
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                4 SYNCHRONIZED SOURCES
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Multi-source microgrid bus monitoring grid feeders, diesel gensets, rooftop PV, and BESS batteries
            </p>
          </div>
        </div>
      </div>

      {/* 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map(source => {
          const Icon = getSourceIcon(source.type);
          const percentOfMax = Math.min(
            100,
            Math.round((source.currentOutput / (source.maximumOutput || 1)) * 100)
          );

          return (
            <div
              key={source.id}
              className="p-4 rounded-xl bg-[#0e1626] border border-slate-800 space-y-3 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{source.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{source.type}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadge(source.status)}`}>
                    {source.status}
                  </span>
                </div>

                {/* Primary Wattage Metric */}
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 font-mono mb-3">
                  <span className="text-[10px] text-slate-400 block">Current Bus Delivery:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white">
                      {source.currentOutput.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400">/ {source.maximumOutput.toFixed(0)} kW</span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Inverter Load:</span>
                    <span className="text-cyan-400 font-bold">{percentOfMax}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${percentOfMax}%` }}
                    />
                  </div>
                </div>

                {/* Specific Aux Metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900/50 p-2 rounded-lg border border-slate-800/80 mb-2">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Efficiency:</span>
                    <span className="text-white font-bold">{Math.round(source.efficiency * 100)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Availability:</span>
                    <span className="text-emerald-400 font-bold">{Math.round(source.availability * 100)}%</span>
                  </div>
                </div>

                {source.fuelHoursRemaining !== undefined && (
                  <div className="flex items-center justify-between text-xs font-mono text-amber-300 bg-amber-950/30 p-2 rounded border border-amber-800/40">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Fuel Reserve:
                    </span>
                    <span className="font-bold">{source.fuelHoursRemaining.toFixed(1)} Hours Runtime</span>
                  </div>
                )}

                {source.chargePercentage !== undefined && (
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300 bg-cyan-950/30 p-2 rounded border border-cyan-800/40">
                    <span className="flex items-center gap-1">
                      <BatteryCharging className="w-3.5 h-3.5" />
                      Stored Capacity:
                    </span>
                    <span className="font-bold">{source.chargePercentage.toFixed(0)}% LiFePO4 SOC</span>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-slate-400 italic pt-2 border-t border-slate-800/80">
                {source.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
