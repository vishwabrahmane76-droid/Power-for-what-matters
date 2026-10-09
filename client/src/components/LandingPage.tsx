import React from 'react';
import {
  Zap,
  Play,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Brain,
  Cpu,
  Layers,
  HeartPulse,
  Radio,
  CheckCircle2,
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface LandingPageProps {
  onEnterCommandCenter: () => void;
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterCommandCenter,
  onLaunchDemo
}) => {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Banner Navigation */}
      <nav className="border-b border-slate-800/80 bg-[#0c121e]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-wider">
                POWER FOR WHAT MATTERS
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                AI RESILIENCE PLATFORM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playOptimize();
                onLaunchDemo();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/40 border border-purple-400/30 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>RUN JURY DEMO</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onEnterCommandCenter();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-900/40 border border-cyan-400/40 transition-all"
            >
              <span>ENTER COMMAND CENTER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 text-center border-b border-slate-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Next-Generation AI Energy Command Architecture
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            POWER FOR WHAT MATTERS
          </h1>

          <p className="text-lg sm:text-2xl text-cyan-300 font-medium tracking-wide">
            "When power is limited, every watt matters."
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            An autonomous, explainable AI emergency energy allocator for disaster hospitals and critical relief facilities. When electrical demand outstrips generation, our constraint engine ensures zero life-support blackouts.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                sounds.playClick();
                onEnterCommandCenter();
              }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-xl shadow-cyan-900/50 border border-cyan-400/40 transition-all hover:scale-105 active:scale-95"
            >
              <span>ENTER COMMAND CENTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sounds.playOptimize();
                onLaunchDemo();
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-600 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>RUN 10-STEP DEMO TOUR</span>
            </button>
          </div>
        </div>
      </section>

      {/* The Core Problem & Why Static Fails */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Box 1: The Problem */}
          <div className="p-8 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-400 w-fit">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">THE CORE PROBLEM</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              In disaster scenarios (hurricanes, grid blackouts, compound trauma surges), emergency relief centers face severe electrical deficits.
              Medical ventilators, telemetry radios, water pumps, HVAC chillers, and computing grids all demand power simultaneously.
              Total electrical demand <strong>far exceeds available capacity</strong>.
            </p>
          </div>

          {/* Box 2: Why Static Fails */}
          <div className="p-8 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-400 w-fit">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">WHY STATIC PRIORITIES FAIL</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional electrical systems rely on rigid, hardcoded priority switches.
              However, in emergencies, <strong>priorities change dynamically every minute</strong>:
              a sudden emergency broadcast requires radio power; an influx of ICU patients requires ventilator surge; battery levels drop.
              Rigid systems trip circuit breakers or starve critical patient systems.
            </p>
          </div>
        </div>

        {/* System Architecture Diagram Section (Requirement #34) */}
        <div className="rounded-2xl bg-[#0f172a] border border-[#223352] p-8 shadow-2xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              End-to-End Cyber-Physical Architecture
            </div>
            <h3 className="text-2xl font-extrabold text-white">SYSTEM ARCHITECTURE PIPELINE</h3>
            <p className="text-xs text-slate-400">
              Closed-loop telemetry telemetry ingestion, deterministic constraint satisfaction, and explainable actuation
            </p>
          </div>

          {/* Interactive Pipeline Stages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#131d33] border border-slate-800 space-y-2">
              <span className="text-[10px] text-cyan-400 font-bold block">STAGE 1</span>
              <h5 className="font-bold text-white">Sensors & Data</h5>
              <p className="text-[11px] text-slate-400 font-sans">
                Bus power meters, battery SOC, medical ICU monitors, emergency broadcast telemetry.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#131d33] border border-slate-800 space-y-2">
              <span className="text-[10px] text-cyan-400 font-bold block">STAGE 2</span>
              <h5 className="font-bold text-white">Data Processing</h5>
              <p className="text-[11px] text-slate-400 font-sans">
                Filtering noise, computing load rate-of-change, time-of-day solar modeling.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-2">
              <span className="text-[10px] text-purple-300 font-bold block">STAGE 3</span>
              <h5 className="font-bold text-white">AI Decision Engine</h5>
              <p className="text-[11px] text-slate-300 font-sans">
                Dynamic urgency scoring + clinical necessity + battery risk penalty computation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-2">
              <span className="text-[10px] text-cyan-300 font-bold block">STAGE 4</span>
              <h5 className="font-bold text-white">Optimization Layer</h5>
              <p className="text-[11px] text-slate-300 font-sans">
                Multi-tier constraint satisfaction guaranteeing zero life-support violations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#131d33] border border-slate-800 space-y-2">
              <span className="text-[10px] text-cyan-400 font-bold block">STAGE 5</span>
              <h5 className="font-bold text-white">Power Actuation</h5>
              <p className="text-[11px] text-slate-400 font-sans">
                Microgrid bus load dispatch, contactor switching, inverter throttling.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-2">
              <span className="text-[10px] text-emerald-300 font-bold block">STAGE 6</span>
              <h5 className="font-bold text-white">XAI Feedback</h5>
              <p className="text-[11px] text-slate-300 font-sans">
                Outputs WHY, WHAT CHANGED, WHAT RISK WAS AVOIDED in human-understandable English.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-extrabold text-white">BUILT FOR MISSION-CRITICAL RELIABILITY</h3>
            <p className="text-xs text-slate-400 mt-1">
              Every watt routed with mathematical precision, constraint verification, and instant auditability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-[#0e1626] border border-slate-800 space-y-3">
              <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 w-fit">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Mathematical Determinism</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Not stochastic hallucinations. Our optimizer calculates Pareto-optimal allocations respecting physical Kirchhoff limits and life-critical constraints.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e1626] border border-slate-800 space-y-3">
              <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Hard Safety Interlocks</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Even authorized operators cannot inadvertently reduce ICU medical power below safe minimum thresholds. The system strictly blocks dangerous inputs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e1626] border border-slate-800 space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 w-fit">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Predictive Trajectory</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Anticipates battery exhaustion 45 minutes in advance, enabling proactive shedding instead of abrupt, catastrophic blackout cascading.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#121c33] via-[#101828] to-[#121c33] border border-cyan-500/40 p-8 text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl font-extrabold text-white">
            Experience the Emergency Operations Center Live
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            Test the live simulator, trigger compound emergency scenarios, inspect explainable causal reasons, and test operator safety blocks.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onEnterCommandCenter();
              }}
              className="px-6 py-3 rounded-xl text-sm font-extrabold text-white bg-cyan-600 hover:bg-cyan-500 shadow-xl shadow-cyan-900/40 transition-all hover:scale-105"
            >
              LAUNCH COMMAND CENTER
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#070b12] py-6 px-6 text-center text-xs font-mono text-slate-500">
        POWER FOR WHAT MATTERS • Emergency Facility Dynamic Energy Allocation System • AI Hackathon Edition
      </footer>
    </div>
  );
};
