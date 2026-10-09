import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Radio,
  Fan,
  Droplets,
  BatteryCharging,
  Zap,
  ArrowRight
} from 'lucide-react';
import { RiskItem } from '../types';

interface RiskMonitorViewProps {
  risks: RiskItem[];
}

export const RiskMonitorView: React.FC<RiskMonitorViewProps> = ({ risks }) => {
  const getRiskIcon = (category: string) => {
    switch (category) {
      case 'POWER SHORTAGE': return Zap;
      case 'BATTERY FAILURE': return BatteryCharging;
      case 'MEDICAL RISK': return HeartPulse;
      case 'COMMUNICATION RISK': return Radio;
      case 'COOLING / HVAC RISK': return Fan;
      case 'WATER SYSTEM RISK': return Droplets;
      default: return AlertTriangle;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-950/80 text-red-400 border-red-700/80 animate-pulse';
      case 'HIGH': return 'bg-orange-950/80 text-orange-400 border-orange-700/80';
      case 'MEDIUM': return 'bg-amber-950/80 text-amber-400 border-amber-700/80';
      default: return 'bg-emerald-950/80 text-emerald-400 border-emerald-700/80';
    }
  };

  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-orange-950 text-orange-400 border border-orange-800">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              MULTI-DOMAIN RISK & HAZARD MONITOR
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                PROBABILISTIC VULNERABILITY INDEX
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time threat evaluation assessing power deficit, battery depletion, clinical risk, and infrastructure stability
            </p>
          </div>
        </div>
      </div>

      {/* 6 Risk Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {risks.map((item, idx) => {
          const Icon = getRiskIcon(item.category);
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0e1626] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-xs">{item.category}</h4>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRiskBadge(item.riskLevel)}`}>
                    {item.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900/90 p-2 rounded-lg border border-slate-800 mb-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Probability:</span>
                    <span className="font-bold text-white">{item.probability}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Impact:</span>
                    <span className={item.impact === 'CRITICAL' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>
                      {item.impact}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-snug">
                  <strong className="text-slate-400 block text-[10px] uppercase font-mono mb-0.5">Recommended Action:</strong>
                  {item.recommendedAction}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Autonomous Mitigation</span>
                <span className="text-cyan-400">Active</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
