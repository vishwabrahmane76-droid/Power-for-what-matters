import React from 'react';
import {
  TableProperties,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Shield,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { SystemItem } from '../types';
import { sounds } from '../utils/audio';

interface AllocationTableProps {
  systems: SystemItem[];
  onSelectSystem: (system: SystemItem) => void;
}

export const AllocationTable: React.FC<AllocationTableProps> = ({
  systems,
  onSelectSystem
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPTIMAL': return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'BOOSTED': return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'THROTTLED': return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'DEFICIT_CRITICAL': return 'bg-red-950 text-red-400 border-red-800 animate-pulse';
      case 'MANUAL_OVERRIDE': return 'bg-purple-950 text-purple-300 border-purple-800';
      default: return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-400 font-bold';
      case 'HIGH': return 'text-orange-400 font-semibold';
      case 'MEDIUM': return 'text-amber-400';
      default: return 'text-slate-400';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL': return 'bg-red-900/60 text-red-300 border border-red-700 font-bold';
      case 'HIGH': return 'bg-orange-900/50 text-orange-300 border border-orange-700';
      case 'ELEVATED': return 'bg-amber-900/50 text-amber-300 border border-amber-700';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="rounded-xl bg-[#111827] border border-[#1f2c42] shadow-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TableProperties className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-white text-sm tracking-wide">
            AI POWER ALLOCATION MATRIX
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Deterministic Priority & Constraints Grid
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0e1626] text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Subsystem</th>
              <th className="py-3 px-3">Demand</th>
              <th className="py-3 px-3">AI Allocation</th>
              <th className="py-3 px-3">Safe Min</th>
              <th className="py-3 px-3">Max Cap</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Urgency</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {systems.map(system => {
              const delta = system.delta || 0;
              return (
                <tr
                  key={system.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectSystem(system);
                  }}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-sans font-medium text-white flex items-center gap-2">
                    <span className="text-slate-300 group-hover:text-cyan-400 transition-colors">
                      {system.name}
                    </span>
                    {system.criticality >= 85 && (
                      <span title="Life Safety Critical">
                        <Shield className="w-3.5 h-3.5 text-red-400 inline" />
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-slate-300">
                    {system.currentDemand.toFixed(1)} kW
                  </td>

                  <td className="py-3 px-3 font-bold text-white">
                    <span className="text-cyan-400 text-sm">
                      {system.allocatedPower.toFixed(1)} kW
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-400">
                    {system.minimumPower.toFixed(1)} kW
                  </td>

                  <td className="py-3 px-3 text-slate-400">
                    {system.maximumPower.toFixed(1)} kW
                  </td>

                  <td className="py-3 px-3">
                    <span className={getPriorityColor(system.priority)}>
                      {system.priority}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${getUrgencyColor(system.urgency)}`}>
                      {system.urgency}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusColor(system.status)}`}>
                      {system.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-bold">
                    {delta > 0 ? (
                      <span className="text-emerald-400 inline-flex items-center gap-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        +{delta.toFixed(1)} kW
                      </span>
                    ) : delta < 0 ? (
                      <span className="text-amber-400 inline-flex items-center gap-0.5">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        {delta.toFixed(1)} kW
                      </span>
                    ) : (
                      <span className="text-slate-500 inline-flex items-center gap-0.5">
                        <Minus className="w-3.5 h-3.5" />
                        0.0 kW
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
