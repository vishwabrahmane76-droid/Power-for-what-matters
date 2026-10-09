import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  HeartPulse,
  Radio,
  Flame,
  BatteryWarning,
  Activity,
  Award
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface HackathonDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteDemoStep: (stepNumber: number) => void;
}

interface DemoStep {
  step: number;
  title: string;
  badge: string;
  summary: string;
  actionDetail: string;
  whyJudgesCare: string;
}

export const HackathonDemoModal: React.FC<HackathonDemoModalProps> = ({
  isOpen,
  onClose,
  onExecuteDemoStep
}) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const steps: DemoStep[] = [
    {
      step: 1,
      title: 'Step 1: Normal Operation Baseline',
      badge: 'STABLE BASELINE',
      summary: 'Municipal Grid (25 kW), Generator (15 kW), and Solar Array (8 kW) supply 48.0 kW total bus power.',
      actionDetail: 'AI allocates balanced power to all 8 subsystems while protecting 15% emergency reserve buffer.',
      whyJudgesCare: 'Shows clean baseline operation where all systems meet demands with zero stress.'
    },
    {
      step: 2,
      title: 'Step 2: Communication Emergency Occurs',
      badge: 'EVENT INJECTION',
      summary: 'Regional disaster command initiates emergency broadcast over satellite telemetry.',
      actionDetail: 'Communication urgency escalates to CRITICAL; power demand spikes from 8.0 kW to 11.5 kW.',
      whyJudgesCare: 'Demonstrates real-time urgency detection before systems suffer packet loss or blackout.'
    },
    {
      step: 3,
      title: 'Step 3: AI Reallocates Power Dynamically',
      badge: 'AI OPTIMIZATION',
      summary: 'AI instantly redirects surplus power (+3.5 kW) to Communication Systems.',
      actionDetail: 'To maintain the 15% reserve buffer, non-essential EV charging and auxiliary chillers are throttled.',
      whyJudgesCare: 'Solves the problem without human intervention in milliseconds, avoiding blackouts.'
    },
    {
      step: 4,
      title: 'Step 4: Mass Casualty Medical Emergency Occurs',
      badge: 'CRITICAL INTAKE',
      summary: 'Trauma ward signals Code Blue surge with multiple ventilator and life-support arrivals.',
      actionDetail: 'Medical Equipment & ICU urgency escalates to CRITICAL; demand surges to 17.5 kW.',
      whyJudgesCare: 'Contrasts conventional static priorities that fail when two critical events collide.'
    },
    {
      step: 5,
      title: 'Step 5: AI Reallocates for Medical Protection',
      badge: 'CONSTRAINT SOLVER',
      summary: 'AI prioritizes ICU life-support machines to the maximum safe threshold (17.5 kW).',
      actionDetail: 'Throttles secondary systems down to their safe minimum boundaries, never breaching medical minimum.',
      whyJudgesCare: 'Mathematical guarantees: critical life-safety constraints are 100% satisfied.'
    },
    {
      step: 6,
      title: 'Step 6: Diesel Backup Generator Derates',
      badge: 'SUPPLY SHOCK',
      summary: 'Mechanical fuel line fault derates Generator output from 15.0 kW to 8.0 kW.',
      actionDetail: 'Available generation collapses from 48.0 kW to 41.0 kW.',
      whyJudgesCare: 'Simulates severe multi-fault compound crisis where both supply drops and demand peaks.'
    },
    {
      step: 7,
      title: 'Step 7: AI Protects Critical Core Life Systems',
      badge: 'DYNAMIC TRIAGE',
      summary: 'AI protects ICU and Emergency Support while gracefully degrading secondary IT and lighting.',
      actionDetail: '100% of Medical (17.5 kW) and Comms (10.0 kW) remain uninterrupted.',
      whyJudgesCare: 'Proves Pareto-optimal degradation: lower tiers surrender power so life systems survive.'
    },
    {
      step: 8,
      title: 'Step 8: Battery Energy Storage Approaches Critical Margin',
      badge: 'STORAGE DEPLETION',
      summary: 'BESS Battery state of charge falls to 22.0% during prolonged islanded microgrid operation.',
      actionDetail: 'Battery protection algorithm engages to avert complete blackout.',
      whyJudgesCare: 'Shows forward-looking predictive awareness, not just instantaneous reactive switching.'
    },
    {
      step: 9,
      title: 'Step 9: Deep Load Shedding on Non-Critical Loads',
      badge: 'RESERVE DEFENSE',
      summary: 'EV Charging is throttled to 1.0 kW; Computing and Water treatment operate at safe minimums.',
      actionDetail: 'Facility bus load stabilized; 15% emergency reserve successfully defended.',
      whyJudgesCare: 'Complete explainability: dashboard tells operators exactly WHY and WHAT risk was averted.'
    },
    {
      step: 10,
      title: 'Step 10: Final Power Resilience Score & Audit Summary',
      badge: 'VERIFIED SUCCESS',
      summary: 'Power Resilience Score evaluated at 92/100 despite compound triple-failure crisis.',
      actionDetail: 'Auditable decision log records all 5 rebalancing maneuvers with deterministic causal proofs.',
      whyJudgesCare: 'Delivers conclusive proof of intelligent AI emergency energy management!'
    }
  ];

  // Auto-advance timer
  React.useEffect(() => {
    let timer: any = null;
    if (isPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= 10) {
            setIsPlaying(false);
            return 10;
          }
          const next = prev + 1;
          onExecuteDemoStep(next);
          return next;
        });
      }, 5000); // 5 seconds per step
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, isOpen, onExecuteDemoStep]);

  if (!isOpen) return null;

  const current = steps[currentStep - 1];

  const handleStepClick = (stepNum: number) => {
    sounds.playClick();
    setCurrentStep(stepNum);
    onExecuteDemoStep(stepNum);
  };

  const handleNext = () => {
    if (currentStep < 10) {
      sounds.playOptimize();
      const next = currentStep + 1;
      setCurrentStep(next);
      onExecuteDemoStep(next);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      sounds.playClick();
      const prev = currentStep - 1;
      setCurrentStep(prev);
      onExecuteDemoStep(prev);
    }
  };

  const handleReset = () => {
    sounds.playClick();
    setCurrentStep(1);
    setIsPlaying(false);
    onExecuteDemoStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0f172a] border-2 border-purple-500/50 shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/40 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/50">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-lg tracking-wide">
                  HACKATHON JURY INTERACTIVE DEMO WALKTHROUGH
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900 text-purple-200 border border-purple-700">
                  10-STEP SEQUENCE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                A 2–3 minute scripted simulation showcasing dynamic AI arbitration under compound crises
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setIsPlaying(false);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 10-Step Visual Timeline Selector */}
        <div className="py-4 overflow-x-auto relative z-10">
          <div className="flex items-center justify-between min-w-[650px] relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 9) * 100}%` }}
            />

            {steps.map(s => {
              const isActive = s.step === currentStep;
              const isPast = s.step < currentStep;
              return (
                <button
                  key={s.step}
                  onClick={() => handleStepClick(s.step)}
                  className={`relative z-10 flex flex-col items-center gap-1 focus:outline-none transition-transform hover:scale-110 ${
                    isActive ? 'scale-110' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all shadow-md ${
                      isActive
                        ? 'bg-cyan-500 text-white ring-4 ring-cyan-500/30'
                        : isPast
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {s.step}
                  </div>
                  <span
                    className={`text-[9px] font-mono tracking-tight ${
                      isActive ? 'text-cyan-400 font-bold' : 'text-slate-500'
                    }`}
                  >
                    Step {s.step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Step Showcase Card */}
        <div className="flex-1 bg-[#131d33] border border-purple-500/30 rounded-2xl p-5 shadow-xl space-y-4 relative z-10 overflow-y-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block mb-0.5">
                {current.badge}
              </span>
              <h4 className="text-base font-extrabold text-white">{current.title}</h4>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800">
              Live Synchronized in Background
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider block">
                Operational Scenario Event:
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">{current.summary}</p>
              <div className="pt-2 text-[11px] text-slate-400 font-mono border-t border-slate-800">
                Action: {current.actionDetail}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-purple-300 tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Why This Impresses Judges:
              </span>
              <p className="text-purple-100 leading-relaxed font-medium">{current.whyJudgesCare}</p>
              <div className="pt-2 text-[11px] text-purple-300 font-mono border-t border-purple-900/50">
                Result: Proves adaptive intelligence over static spreadsheets.
              </div>
            </div>
          </div>
        </div>

        {/* Controller Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500'
                  : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/40'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'PAUSE TOUR' : 'AUTO-PLAY TOUR'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Step 1</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === 10}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 shadow-md shadow-cyan-900/40"
            >
              <span>Next Step</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
