import React from 'react';
import {
  Zap,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Play,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  Info
} from 'lucide-react';
import { SystemState } from '../types';
import { sounds } from '../utils/audio';

interface NavbarProps {
  state: SystemState;
  onOpenDemo: () => void;
  onOpenAlerts: () => void;
  onOpenJudgeInfo: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigateLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onOpenDemo,
  onOpenAlerts,
  onOpenJudgeInfo,
  soundEnabled,
  onToggleSound,
  onNavigateLanding
}) => {
  const [currentTime, setCurrentTime] = React.useState(new Date().toLocaleTimeString());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAlertsCount = state.alerts.filter(a => !a.isRead).length;

  const riskBadgeColor = {
    LOW: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
    MEDIUM: 'bg-amber-950/80 text-amber-400 border-amber-500/40',
    HIGH: 'bg-orange-950/80 text-orange-400 border-orange-500/40',
    CRITICAL: 'bg-red-950/80 text-red-400 border-red-500/40 animate-pulse'
  }[state.kpis.currentRisk] || 'bg-slate-900 text-slate-300 border-slate-700';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c121e]/95 backdrop-blur-md border-b border-[#1e2c44] px-4 py-2.5 transition-all">
      <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateLanding();
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="Go to Landing Page"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <Zap className="w-5 h-5 text-white" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0c121e]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-wider text-base sm:text-lg group-hover:text-cyan-400 transition-colors">
                  POWER FOR WHAT MATTERS
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  AI CORE v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Autonomous Emergency Power Allocation System
              </p>
            </div>
          </button>
        </div>

        {/* Live Operational Status Pills */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Live Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${state.isSimulating ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${state.isSimulating ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            </span>
            <span className="font-mono font-medium text-slate-200">
              {state.isSimulating ? 'SIM RUNNING' : 'SYSTEM LIVE'}
            </span>
          </div>

          {/* Scenario Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-mono">Scenario:</span>
            <span className="font-semibold text-white max-w-[160px] truncate">{state.activeScenario}</span>
          </div>

          {/* AI Mode Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-[11px]">
              MODE: {state.facilityConfig.optimizationMode}
            </span>
          </div>

          {/* Risk Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono font-bold text-[11px] ${riskBadgeColor}`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>RISK: {state.kpis.currentRisk}</span>
          </div>

          {/* Resilience Score */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-700/60 text-blue-200 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>RESILIENCE:</span>
            <span className="font-bold text-white">{state.resilienceScore}/100</span>
          </div>
        </div>

        {/* Right Actions: Demo Mode, Sound, Alerts, Info */}
        <div className="flex items-center gap-2">
          {/* Hackathon Demo Launcher Button */}
          <button
            onClick={() => {
              sounds.playOptimize();
              onOpenDemo();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-md shadow-purple-900/40 hover:shadow-cyan-500/20 border border-purple-400/30 transition-all active:scale-95"
            title="Launch 10-Step Interactive Judge Demo"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            <span className="tracking-wide">HACKATHON DEMO</span>
          </button>

          {/* Judge Info Modal Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenJudgeInfo();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Why This AI Is Intelligent (Judge Brief)"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Why AI?</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
            title={soundEnabled ? 'Mute Interface Audio' : 'Enable Audio Feedback'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Alert Center Trigger */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenAlerts();
            }}
            className="relative p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Open Alert Center"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white border-2 border-[#0c121e]">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Time display */}
          <div className="hidden xl:flex items-center gap-1.5 pl-2 text-xs font-mono text-slate-400 border-l border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
