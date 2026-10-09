import React from 'react';
import {
  HeartPulse,
  Radio,
  Lightbulb,
  Fan,
  Server,
  Droplets,
  BatteryCharging,
  LifeBuoy,
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SystemItem } from '../types';
import { sounds } from '../utils/audio';

interface SystemCardsProps {
  systems: SystemItem[];
  onSelectSystem: (system: SystemItem) => void;
  onBumpUrgency?: (systemId: string) => void;
}

export const SystemCards: React.FC<SystemCardsProps> = ({
  systems,
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
      default: return HeartPulse;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL': return 'bg-red-950/80 text-red-400 border-red-700/60 animate-pulse';
      case 'HIGH': return 'bg-orange-950/80 text-orange-400 border-orange-700/60';
      case 'ELEVATED': return 'bg-amber-950/80 text-amber-400 border-amber-700/60';
      case 'NORMAL': return 'bg-slate-900 text-slate-300 border-slate-700';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-400 border-red-800/80 bg-red-950/40';
      case 'HIGH': return 'text-orange-400 border-orange-800/80 bg-orange-950/40';
      case 'MEDIUM': return 'text-amber-400 border-amber-800/80 bg-amber-950/40';
      default: return 'text-slate-400 border-slate-700 bg-slate-900';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL': return 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
      case 'BOOSTED': return 'bg-cyan-950 text-cyan-300 border-cyan-700/60';
      case 'THROTTLED': return 'bg-amber-950 text-amber-300 border-amber-700/60';
      case 'DEFICIT_CRITICAL': return 'bg-red-950 text-red-300 border-red-700/80 animate-pulse';
      case 'MANUAL_OVERRIDE': return 'bg-purple-950 text-purple-300 border-purple-700/60';
      default: return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
      {systems.map(system => {
        const Icon = getSystemIcon(system.id);
        const percentOfDemand = Math.min(
          120,
          Math.round((system.allocatedPower / (system.currentDemand || 1)) * 100)
        );

        return (
          <div
            key={system.id}
            onClick={() => {
              sounds.playClick();
              onSelectSystem(system);
            }}
            className="group relative rounded-xl bg-gradient-to-b from-[#131c2e] to-[#0d1424] border border-[#223352] hover:border-cyan-500/60 p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between"
          >
            {/* Top row: Name, icon, badges */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-800/90 text-cyan-400 border border-slate-700 group-hover:border-cyan-500/40 group-hover:scale-105 transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm tracking-tight group-hover:text-cyan-300 transition-colors leading-tight">
                      {system.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">{system.department}</span>
                  </div>
                </div>

                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>

              {/* Status / Urgency / Priority row */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px] font-mono font-medium">
                <span className={`px-2 py-0.5 rounded border ${getStatusBadge(system.status)}`}>
                  {system.status}
                </span>
                <span className={`px-2 py-0.5 rounded border ${getUrgencyBadge(system.urgency)}`}>
                  URGENCY: {system.urgency}
                </span>
                <span className={`px-2 py-0.5 rounded border ${getPriorityBadge(system.priority)}`}>
                  {system.priority}
                </span>
              </div>

              {/* Power numbers */}
              <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800/80 mb-3 space-y-1 font-mono">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Allocated Power:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-white">{system.allocatedPower.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">kW</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Current Demand:</span>
                  <span className="text-slate-200 font-semibold">{system.currentDemand.toFixed(1)} kW</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-1">
                  <span>Safe Min: {system.minimumPower} kW</span>
                  <span>Physical Max: {system.maximumPower} kW</span>
                </div>
              </div>

              {/* Utilization progress bar */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Demand Met:</span>
                  <span
                    className={
                      percentOfDemand >= 100
                        ? 'text-emerald-400 font-bold'
                        : percentOfDemand >= 75
                        ? 'text-amber-400 font-bold'
                        : 'text-red-400 font-bold'
                    }
                  >
                    {percentOfDemand}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      percentOfDemand >= 100
                        ? 'bg-emerald-400'
                        : percentOfDemand >= 75
                        ? 'bg-amber-400'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, percentOfDemand)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom info footer */}
            <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  UPS: {system.backupBatteryMinutes > 0 ? `${system.backupBatteryMinutes} min` : 'Bus Only'}
                </span>
                <span className="text-purple-300 font-semibold flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3" />
                  Score: {system.priorityScore?.toFixed(0) || system.criticality}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1 italic" title={system.patientImpact}>
                {system.patientImpact}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
