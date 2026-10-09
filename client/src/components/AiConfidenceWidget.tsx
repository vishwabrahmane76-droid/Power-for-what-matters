import React from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Database,
  TrendingUp,
  Cpu,
  Info
} from 'lucide-react';
import { AIConfidence } from '../types';

interface AiConfidenceWidgetProps {
  confidence: AIConfidence;
}

export const AiConfidenceWidget: React.FC<AiConfidenceWidgetProps> = ({ confidence }) => {
  return (
    <div className="rounded-xl bg-[#111827] border border-[#1f2c42] p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            AI DECISION CONFIDENCE
          </h4>
        </div>
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-xl font-extrabold text-cyan-400">
            {confidence.overallPercentage}%
          </span>
          <span className="text-[10px] text-slate-400">INDEX</span>
        </div>
      </div>

      {/* Progress Bars for 3 Factors */}
      <div className="space-y-2 mb-3">
        {/* Factor 1: Data Quality */}
        <div>
          <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-cyan-400" />
              Telemetry Quality
            </span>
            <span className="text-white font-bold">{confidence.factors.dataQuality}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div
              className="bg-cyan-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${confidence.factors.dataQuality}%` }}
            />
          </div>
        </div>

        {/* Factor 2: Prediction Confidence */}
        <div>
          <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-purple-400" />
              Prediction Confidence
            </span>
            <span className="text-white font-bold">{confidence.factors.predictionConfidence}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div
              className="bg-purple-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${confidence.factors.predictionConfidence}%` }}
            />
          </div>
        </div>

        {/* Factor 3: System Stability */}
        <div>
          <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-blue-400" />
              Grid Stability
            </span>
            <span className="text-white font-bold">{confidence.factors.systemStability}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div
              className="bg-blue-400 h-1 rounded-full transition-all duration-300"
              style={{ width: `${confidence.factors.systemStability}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-1.5 font-mono">
        <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <span>{confidence.message}</span>
      </div>
    </div>
  );
};
