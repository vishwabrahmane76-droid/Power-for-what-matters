import React from 'react';
import {
  History,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DecisionHistoryEntry } from '../types';
import { sounds } from '../utils/audio';

interface DecisionHistoryViewProps {
  history: DecisionHistoryEntry[];
}

export const DecisionHistoryView: React.FC<DecisionHistoryViewProps> = ({ history }) => {
  const [expandedId, setExpandedId] = React.useState<string | null>(history[0]?.id || null);

  const toggleExpand = (id: string) => {
    sounds.playClick();
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
              AUDITABLE AI DECISION TIMELINE
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {history.length} LOGGED ACTIONS
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Chronological ledger of autonomous load rebalancing events, triggers, power movements, and causal reasons
            </p>
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {history.map((entry, idx) => {
          const isExpanded = expandedId === entry.id;
          return (
            <div
              key={entry.id || idx}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-[#141f34] border-cyan-500/50 shadow-md'
                  : 'bg-[#0d1525] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Header row */}
              <div
                onClick={() => toggleExpand(entry.id)}
                className="p-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{entry.timestamp}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm tracking-tight">{entry.trigger}</h4>
                    <span className="text-[11px] font-mono text-slate-400">Scenario: {entry.scenario}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="text-cyan-400 font-bold">{entry.confidence}%</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {entry.riskBefore}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                      {entry.riskAfter}
                    </span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3 text-xs">
                  {/* Detailed Explanation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400 font-bold block mb-1">
                        Causal Rationale (Why):
                      </span>
                      <p className="text-slate-200">{entry.reason}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold block mb-1">
                        Operational Impact / Risk Avoided:
                      </span>
                      <p className="text-slate-200">{entry.impact}</p>
                    </div>
                  </div>

                  {/* Power Changes Delta Grid */}
                  {entry.changes && entry.changes.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block mb-2">
                        System Power Reallocation Diffs:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {entry.changes.map((chg, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-[11px]"
                          >
                            <span className="text-slate-300 truncate max-w-[140px]">{chg.system}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500">{chg.from.toFixed(1)} → {chg.to.toFixed(1)} kW</span>
                              <span
                                className={`font-bold px-1 rounded ${
                                  chg.delta > 0
                                    ? 'text-cyan-400 bg-cyan-950'
                                    : chg.delta < 0
                                    ? 'text-amber-400 bg-amber-950'
                                    : 'text-slate-400'
                                }`}
                              >
                                {chg.delta > 0 ? `+${chg.delta}` : chg.delta} kW
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
