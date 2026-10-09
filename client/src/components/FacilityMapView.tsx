import React from 'react';
import {
  MapPin,
  HeartPulse,
  Radio,
  Server,
  Droplets,
  Fan,
  BatteryCharging,
  Zap,
  Shield,
  ExternalLink
} from 'lucide-react';
import { SystemItem } from '../types';
import { sounds } from '../utils/audio';

interface FacilityMapViewProps {
  systems: SystemItem[];
  onSelectSystem: (system: SystemItem) => void;
}

export const FacilityMapView: React.FC<FacilityMapViewProps> = ({
  systems,
  onSelectSystem
}) => {
  const getSystem = (id: string) => systems.find(s => s.id === id) || systems[0];

  const zones = [
    {
      id: 'medical_icu',
      systemId: 'medical',
      title: 'ICU & Trauma Center',
      x: 30,
      y: 30,
      width: 220,
      height: 140,
      icon: HeartPulse,
      color: 'border-red-500/60 bg-red-950/30 text-red-400'
    },
    {
      id: 'emergency_room',
      systemId: 'emergency_support',
      title: 'Emergency Life Support',
      x: 270,
      y: 30,
      width: 200,
      height: 140,
      icon: Shield,
      color: 'border-rose-500/60 bg-rose-950/30 text-rose-400'
    },
    {
      id: 'comms_center',
      systemId: 'communication',
      title: 'Command & Comms Hub',
      x: 490,
      y: 30,
      width: 220,
      height: 140,
      icon: Radio,
      color: 'border-blue-500/60 bg-blue-950/30 text-cyan-400'
    },
    {
      id: 'server_room',
      systemId: 'computing',
      title: 'Data Center & Servers',
      x: 30,
      y: 190,
      width: 220,
      height: 140,
      icon: Server,
      color: 'border-purple-500/60 bg-purple-950/30 text-purple-400'
    },
    {
      id: 'cooling_plant',
      systemId: 'cooling',
      title: 'Central HVAC & Chillers',
      x: 270,
      y: 190,
      width: 200,
      height: 140,
      icon: Fan,
      color: 'border-teal-500/60 bg-teal-950/30 text-teal-400'
    },
    {
      id: 'water_plant',
      systemId: 'water',
      title: 'Water Treatment Plant',
      x: 490,
      y: 190,
      width: 220,
      height: 140,
      icon: Droplets,
      color: 'border-sky-500/60 bg-sky-950/30 text-sky-400'
    },
    {
      id: 'power_room',
      systemId: 'lighting',
      title: 'Power Vault & Corridor Bus',
      x: 30,
      y: 350,
      width: 320,
      height: 120,
      icon: Zap,
      color: 'border-amber-500/60 bg-amber-950/30 text-amber-400'
    },
    {
      id: 'charging_bay',
      systemId: 'charging',
      title: 'EV Transit & Charging Bay',
      x: 370,
      y: 350,
      width: 340,
      height: 120,
      icon: BatteryCharging,
      color: 'border-slate-600 bg-slate-900/50 text-slate-300'
    }
  ];

  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              FACILITY GEOMETRIC BLUEPRINT MAP
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                8 MONITORED ZONES
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive architectural spatial plan with real-time zone heat glow and power draw
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Click any room to open telemetry inspection
        </span>
      </div>

      {/* Interactive Blueprint Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {zones.map(zone => {
          const sys = getSystem(zone.systemId);
          const Icon = zone.icon;
          return (
            <div
              key={zone.id}
              onClick={() => {
                sounds.playClick();
                onSelectSystem(sys);
              }}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:scale-[1.02] shadow-lg group relative ${zone.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-white text-xs">{zone.title}</h4>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Delivered:</span>
                  <span className="font-bold text-white">{sys.allocatedPower.toFixed(1)} kW</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Requested:</span>
                  <span>{sys.currentDemand.toFixed(1)} kW</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
                  <span>Priority: {sys.priority}</span>
                  <span className="font-bold uppercase text-cyan-300">{sys.status}</span>
                </div>
              </div>

              {/* Progress mini indicator */}
              <div className="w-full bg-slate-900 rounded-full h-1 mt-2.5 overflow-hidden">
                <div
                  className="h-1 rounded-full bg-cyan-400"
                  style={{ width: `${Math.min(100, (sys.allocatedPower / sys.maximumPower) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
