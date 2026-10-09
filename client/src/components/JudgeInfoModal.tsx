import React from 'react';
import {
  Info,
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  Brain,
  Shield,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface JudgeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeInfoModal: React.FC<JudgeInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const points = [
    {
      title: '1. Dynamic Multi-Factor Prioritization',
      desc: 'Instead of rigid priority ranks, priorities are scored mathematically: Criticality + Emergency Urgency + Medical Necessity + Comms Traffic + Battery Risk - Curtailment Margin.',
      icon: Brain
    },
    {
      title: '2. Constraint-Aware Multi-Tier Optimization',
      desc: 'Total allocation NEVER exceeds available generation. Critical Medical Equipment is locked to its safe minimum with zero-violation mathematical proofs.',
      icon: Shield
    },
    {
      title: '3. Predictive Load & Storage Trajectory',
      desc: 'Forecasting algorithms model demand 15m, 30m, 1h, and 4h ahead, warning operators before batteries deplete or solar irradiance drops.',
      icon: TrendingUp
    },
    {
      title: '4. Complete Explainability (XAI)',
      desc: 'Every allocation decision outputs WHY, WHAT CHANGED, WHAT WAS REDUCED, WHAT WAS INCREASED, and WHAT RISK WAS AVOIDED. No black-box guesswork.',
      icon: Sparkles
    },
    {
      title: '5. Autonomous Real-Time Closed-Loop Adaptation',
      desc: 'Compensates immediately for generation shocks (generator fault, solar cloud cover) and medical surges without manual operator delay.',
      icon: Cpu
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0f172a] border border-[#233554] shadow-2xl p-6 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-wide">
                WHY THIS IS INTELLIGENT (JURY BRIEFING)
              </h3>
              <p className="text-xs text-slate-400">
                Core technological differentiators behind Power for What Matters
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 text-xs">
          {/* Section 1: 5 Pillars of Intelligence */}
          <div>
            <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-3">
              5 Core Algorithmic Pillars
            </h4>
            <div className="space-y-2.5">
              {points.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#131d33] border border-slate-800 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800 flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-xs mb-1">{p.title}</h5>
                      <p className="text-slate-300 leading-relaxed font-sans">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: What Makes it Different Comparison */}
          <div>
            <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-3">
              What Makes It Different?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Conventional */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/50 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono">
                  <XCircle className="w-4 h-4" />
                  <span>Conventional Systems</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 font-mono text-[11px]">
                  <li>• Fixed hardcoded priority lists</li>
                  <li>• Reactive triage only after breakers trip</li>
                  <li>• Blind to predictive demand and solar curves</li>
                  <li>• Manual manual switching delays</li>
                  <li>• Zero explainability or causal context</li>
                </ul>
              </div>

              {/* Power for What Matters */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/50 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase font-mono">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Power for What Matters</span>
                </div>
                <ul className="space-y-1.5 text-slate-200 font-mono text-[11px]">
                  <li>• Dynamic multi-objective priority scoring</li>
                  <li>• Predictive prevention 15m to 4h ahead</li>
                  <li>• Strict hard mathematical constraint locks</li>
                  <li>• Autonomous millisecond load rebalancing</li>
                  <li>• Transparent explainability for every decision</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
