import React from 'react';
import {
  X,
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
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { SystemItem } from '../types';
import { sounds } from '../utils/audio';

interface SystemDetailModalProps {
  system: SystemItem | null;
  onClose: () => void;
  onSetUrgency: (sysId: string, urgency: string) => void;
}

export const SystemDetailModal: React.FC<SystemDetailModalProps> = ({
  system,
  onClose,
  onSetUrgency
}) => {
  if (!system) return null;

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

  const Icon = getSystemIcon(system.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0f172a] border border-[#233554] shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">{system.name}</h3>
              <p className="text-xs text-slate-400 font-mono">
                {system.department} • {system.location}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Allocated Power:</span>
            <span className="text-xl font-bold text-cyan-400">{system.allocatedPower.toFixed(1)} kW</span>
            <div className="text-[10px] text-slate-500 mt-1">Status: {system.status}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Current Demand:</span>
            <span className="text-xl font-bold text-white">{system.currentDemand.toFixed(1)} kW</span>
            <div className="text-[10px] text-slate-500 mt-1">Delta: {system.delta > 0 ? `+${system.delta}` : system.delta} kW</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Safe Minimum:</span>
            <span className="text-base font-bold text-emerald-400">{system.minimumPower.toFixed(1)} kW</span>
            <div className="text-[10px] text-slate-500 mt-1">Physical Max: {system.maximumPower} kW</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Priority Score:</span>
            <span className="text-base font-bold text-purple-400">{system.priorityScore?.toFixed(0) || system.criticality}</span>
            <div className="text-[10px] text-slate-500 mt-1">Base Criticality: {system.criticality}/100</div>
          </div>
        </div>

        {/* Clinical / Facility Impact */}
        <div className="p-3.5 rounded-xl bg-[#131d33] border border-slate-800 text-xs mb-4 space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 block">
            Operational Clinical Impact:
          </span>
          <p className="text-slate-200">{system.patientImpact}</p>
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              UPS Runtime: {system.backupBatteryMinutes > 0 ? `${system.backupBatteryMinutes} min` : 'None (Direct Bus)'}
            </span>
            <span>Priority: {system.priority}</span>
          </div>
        </div>

        {/* Urgency Tuning Bar */}
        <div className="pt-2 border-t border-slate-800">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-2">
            Test Emergency Urgency State:
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {['LOW', 'NORMAL', 'ELEVATED', 'HIGH', 'CRITICAL'].map(u => (
              <button
                key={u}
                onClick={() => {
                  sounds.playOptimize();
                  onSetUrgency(system.id, u);
                }}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  system.urgency === u
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
