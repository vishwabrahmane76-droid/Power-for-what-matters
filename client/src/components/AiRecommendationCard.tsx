import React from 'react';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { AIRecommendation } from '../types';
import { sounds } from '../utils/audio';

interface AiRecommendationCardProps {
  recommendation: AIRecommendation;
  onApply: () => void;
  onDismiss: () => void;
  onViewDetails: () => void;
}

export const AiRecommendationCard: React.FC<AiRecommendationCardProps> = ({
  recommendation,
  onApply,
  onDismiss,
  onViewDetails
}) => {
  const [dismissed, setDismissed] = React.useState(false);
  const [applied, setApplied] = React.useState(false);

  // Reset local state if new recommendation arrives
  React.useEffect(() => {
    setDismissed(false);
    setApplied(false);
  }, [recommendation.id]);

  if (dismissed) {
    return (
      <div className="rounded-xl bg-[#111827]/70 border border-slate-800 p-3 text-xs text-slate-400 flex items-center justify-between">
        <span>AI Recommendation dismissed by operator.</span>
        <button
          onClick={() => setDismissed(false)}
          className="text-cyan-400 hover:underline text-[11px]"
        >
          Restore
        </button>
      </div>
    );
  }

  const riskBadgeColor = {
    LOW: 'text-emerald-400 bg-emerald-950 border-emerald-700',
    MEDIUM: 'text-amber-400 bg-amber-950 border-amber-700',
    HIGH: 'text-orange-400 bg-orange-950 border-orange-700',
    CRITICAL: 'text-red-400 bg-red-950 border-red-700 animate-pulse'
  }[recommendation.riskLevel] || 'text-slate-400 bg-slate-900 border-slate-700';

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-[#162138] to-[#0f172a] border border-cyan-500/40 p-5 shadow-xl overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base tracking-tight">
                AI PROACTIVE RECOMMENDATION
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${riskBadgeColor}`}>
                RISK IF IGNORED: {recommendation.riskLevel}
              </span>
            </div>
            <p className="text-xs text-cyan-300 font-medium">
              {recommendation.title}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4 bg-slate-900/80 rounded-xl p-3.5 border border-slate-800/80 text-xs">
        <div>
          <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider block mb-0.5">
            Proposed Action:
          </span>
          <p className="text-white font-medium">{recommendation.action}</p>
        </div>

        <div>
          <span className="font-semibold text-slate-400 uppercase text-[10px] tracking-wider block mb-0.5">
            Underlying Cause:
          </span>
          <p className="text-slate-300">{recommendation.reason}</p>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">Expected Resilience Impact:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {recommendation.expectedImpact}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {recommendation.canApply && (
            <button
              onClick={() => {
                sounds.playOptimize();
                setApplied(true);
                onApply();
              }}
              disabled={applied}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-md active:scale-95 ${
                applied
                  ? 'bg-emerald-600 cursor-default'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/40 shadow-cyan-900/30'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{applied ? 'RECOMMENDATION APPLIED' : 'APPLY RECOMMENDATION'}</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              setDismissed(true);
              onDismiss();
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Dismiss</span>
          </button>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onViewDetails();
          }}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-mono"
        >
          <span>View Telemetry Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
