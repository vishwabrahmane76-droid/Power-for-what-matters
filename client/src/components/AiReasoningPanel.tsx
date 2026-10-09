import React from 'react';
import {
  Brain,
  HelpCircle,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { AIDecisionExplanation } from '../types';

interface AiReasoningPanelProps {
  decision: AIDecisionExplanation;
}

export const AiReasoningPanel: React.FC<AiReasoningPanelProps> = ({ decision }) => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#121b2d] to-[#0c1322] border-2 border-purple-500/30 p-5 shadow-2xl relative overflow-hidden">
      {/* Background ambient purple glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-800/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-600/50 text-purple-300 shadow-md">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              AI DECISION REASONING ENGINE
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                EXPLAINABLE AI
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic causal attribution behind power redistribution decisions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-purple-300 bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-800/40">
          <Clock className="w-3.5 h-3.5" />
          <span>Last Evaluation: {decision.timestamp || 'Real-time'}</span>
        </div>
      </div>

      {/* 5 Causal Explainability Cards (WHY, WHAT CHANGED, WHAT WAS REDUCED, WHAT WAS INCREASED, WHAT RISK WAS AVOIDED) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        {/* 1. WHY? */}
        <div className="p-3.5 rounded-xl bg-[#152136]/90 border border-purple-500/30 shadow-md">
          <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs uppercase tracking-wider mb-1.5">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>1. Why?</span>
          </div>
          <p className="text-xs text-slate-200 font-sans leading-relaxed">
            {decision.why || 'Multi-tier constraint solver maintained balanced load delivery.'}
          </p>
        </div>

        {/* 2. WHAT CHANGED? */}
        <div className="p-3.5 rounded-xl bg-[#152136]/90 border border-blue-500/30 shadow-md">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-1.5">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>2. What Changed?</span>
          </div>
          <p className="text-xs text-slate-200 font-sans leading-relaxed">
            {decision.whatChanged || 'Allocations stabilized across all active nodes.'}
          </p>
        </div>

        {/* 3. WHAT WAS REDUCED? */}
        <div className="p-3.5 rounded-xl bg-[#152136]/90 border border-amber-500/30 shadow-md">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1.5">
            <TrendingDown className="w-4 h-4 text-amber-400" />
            <span>3. What Was Reduced?</span>
          </div>
          <p className="text-xs text-slate-200 font-sans leading-relaxed">
            {decision.whatReduced || 'No subsystems throttled.'}
          </p>
        </div>

        {/* 4. WHAT WAS INCREASED? */}
        <div className="p-3.5 rounded-xl bg-[#152136]/90 border border-emerald-500/30 shadow-md">
          <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>4. What Was Boosted?</span>
          </div>
          <p className="text-xs text-slate-200 font-sans leading-relaxed">
            {decision.whatIncreased || 'No priority surge required.'}
          </p>
        </div>

        {/* 5. WHAT RISK WAS AVOIDED? */}
        <div className="p-3.5 rounded-xl bg-[#152136]/90 border border-red-500/30 shadow-md">
          <div className="flex items-center gap-1.5 text-red-300 font-bold text-xs uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>5. Risk Avoided</span>
          </div>
          <p className="text-xs text-slate-200 font-sans leading-relaxed">
            {decision.riskAvoided || 'Zero circuit breaker trips and zero life-critical deficit.'}
          </p>
        </div>
      </div>

      {/* Decision Factors Breakdown */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Active Constraint Factors</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Zero-Violation Guarantee
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {decision.factorList?.map((factor, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 truncate">{factor.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-cyan-400">{factor.score}</span>
                <span className="text-[10px] text-purple-300 bg-purple-950 px-1 rounded">{factor.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
