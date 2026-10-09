import React from 'react';
import {
  AlertTriangle,
  HeartPulse,
  Radio,
  PowerOff,
  BatteryWarning,
  Zap,
  Fan,
  Droplets,
  Flame
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface EmergencyTriggersProps {
  onTriggerEmergency: (eventType: string) => void;
  loading: boolean;
}

export const EmergencyTriggers: React.FC<EmergencyTriggersProps> = ({
  onTriggerEmergency,
  loading
}) => {
  const triggers = [
    {
      id: 'MEDICAL_EMERGENCY',
      label: 'Medical Emergency',
      desc: 'Trauma surge code blue: ICU ICU demand boosts to 18 kW',
      icon: HeartPulse,
      color: 'from-red-600/30 to-rose-700/20 text-red-300 border-red-500/50 hover:border-red-400'
    },
    {
      id: 'EMERGENCY_BROADCAST',
      label: 'Emergency Broadcast',
      desc: 'Satellite & telemetry transmitter surge to 11 kW',
      icon: Radio,
      color: 'from-blue-600/30 to-indigo-700/20 text-cyan-300 border-blue-500/50 hover:border-cyan-400'
    },
    {
      id: 'GENERATOR_FAILURE',
      label: 'Generator Failure',
      desc: 'Backup Genset trip: lose 15 kW bus generation instantly',
      icon: PowerOff,
      color: 'from-amber-600/30 to-orange-700/20 text-amber-300 border-amber-500/50 hover:border-amber-400'
    },
    {
      id: 'BATTERY_CRITICAL',
      label: 'Battery Critical (<20%)',
      desc: 'BESS battery drains below emergency margin',
      icon: BatteryWarning,
      color: 'from-purple-600/30 to-fuchsia-700/20 text-purple-300 border-purple-500/50 hover:border-purple-400'
    },
    {
      id: 'POWER_SURGE',
      label: 'Multi-Zone Power Surge',
      desc: 'Simultaneous 20% demand spike across all systems',
      icon: Zap,
      color: 'from-yellow-600/30 to-amber-700/20 text-yellow-300 border-yellow-500/50 hover:border-yellow-400'
    },
    {
      id: 'COOLING_FAILURE',
      label: 'Server Room Thermal Spike',
      desc: 'Data center overheats: HVAC demand surges to 15 kW',
      icon: Fan,
      color: 'from-teal-600/30 to-emerald-700/20 text-teal-300 border-teal-500/50 hover:border-teal-400'
    },
    {
      id: 'WATER_FAILURE',
      label: 'Water Pressure Loss',
      desc: 'Sterilization & dialysis booster pumps require 9 kW',
      icon: Droplets,
      color: 'from-sky-600/30 to-blue-700/20 text-sky-300 border-sky-500/50 hover:border-sky-400'
    }
  ];

  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-950 text-red-400 border border-red-800">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide">
              INSTANT EMERGENCY EVENT TRIGGERS
            </h3>
            <p className="text-xs text-slate-400">
              1-Click real-time crisis injections to test autonomous AI power reallocation
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          7 Scenarios Ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
        {triggers.map(trigger => {
          const Icon = trigger.icon;
          return (
            <button
              key={trigger.id}
              disabled={loading}
              onClick={() => {
                sounds.playAlert();
                onTriggerEmergency(trigger.id);
              }}
              className={`p-3 rounded-xl bg-gradient-to-b border text-left transition-all hover:scale-[1.02] active:scale-95 shadow-md group ${trigger.color}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-75">
                  Inject
                </span>
              </div>
              <h4 className="font-bold text-xs text-white group-hover:text-cyan-200 transition-colors line-clamp-1 mb-1">
                {trigger.label}
              </h4>
              <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight opacity-90">
                {trigger.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
