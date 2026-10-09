import React from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { KpiCards } from './components/KpiCards';
import { PowerFlowDiagram } from './components/PowerFlowDiagram';
import { SystemCards } from './components/SystemCards';
import { AllocationTable } from './components/AllocationTable';
import { AiReasoningPanel } from './components/AiReasoningPanel';
import { AiRecommendationCard } from './components/AiRecommendationCard';
import { AiConfidenceWidget } from './components/AiConfidenceWidget';
import { EmergencyTriggers } from './components/EmergencyTriggers';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { CustomScenarioBuilder } from './components/CustomScenarioBuilder';
import { LiveSimulationPanel } from './components/LiveSimulationPanel';
import { PowerForecastView } from './components/PowerForecastView';
import { RiskMonitorView } from './components/RiskMonitorView';
import { DecisionHistoryView } from './components/DecisionHistoryView';
import { ManualOverrideView } from './components/ManualOverrideView';
import { FacilityMapView } from './components/FacilityMapView';
import { PowerSourcesView } from './components/PowerSourcesView';
import { AlertCenterModal } from './components/AlertCenterModal';
import { BeforeAfterComparison } from './components/BeforeAfterComparison';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { SettingsView } from './components/SettingsView';
import { HackathonDemoModal } from './components/HackathonDemoModal';
import { JudgeInfoModal } from './components/JudgeInfoModal';
import { SystemDetailModal } from './components/SystemDetailModal';
import { LandingPage } from './components/LandingPage';

import { SystemState, SystemItem } from './types';
import { api } from './services/api';
import { sounds } from './utils/audio';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export function App() {
  const [state, setState] = React.useState<SystemState | null>(null);
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  // Modals & Drawers
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);
  const [alertsModalOpen, setAlertsModalOpen] = React.useState(false);
  const [judgeModalOpen, setJudgeModalOpen] = React.useState(false);
  const [assistantDrawerOpen, setAssistantDrawerOpen] = React.useState(false);
  const [selectedSystem, setSelectedSystem] = React.useState<SystemItem | null>(null);

  // Toast stack
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Poll backend state
  const fetchState = async () => {
    try {
      const data = await api.getStatus();
      setState(data);
    } catch {
      // Keep existing state if brief network poll glitch
    }
  };

  React.useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.soundEnabled = next;
    if (next) sounds.playClick();
  };

  // Quick Action Handlers
  const handleApplyScenario = async (scenarioKey: string) => {
    setLoading(true);
    try {
      const updated = await api.applyScenario(scenarioKey);
      setState(updated);
      showToast(`Scenario Armed: ${updated.activeScenario}`);
    } catch {
      showToast('Failed to apply scenario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerEmergency = async (eventType: string) => {
    setLoading(true);
    try {
      const updated = await api.triggerEmergency(eventType);
      setState(updated);
      showToast(`Emergency Injected: ${eventType.replace(/_/g, ' ')}`, 'warning');
    } catch {
      showToast('Failed to trigger emergency', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleManualOverride = async (systemId: string, kw: number) => {
    try {
      const res = await api.manualOverride(systemId, kw);
      if (res.blocked) {
        showToast(res.message, 'error');
      } else if (res.data) {
        setState(res.data);
        showToast(res.message, 'warning');
      }
      return res;
    } catch {
      return { success: false, message: 'Override request failed' };
    }
  };

  const handleReturnControl = async () => {
    try {
      const updated = await api.returnControlToAI();
      setState(updated);
      showToast('Autonomous control returned to AI Optimizer', 'success');
    } catch {
      showToast('Failed to return control to AI', 'error');
    }
  };

  const handleApplyRecommendation = async () => {
    try {
      const res = await api.applyRecommendation();
      if (res.state) {
        setState(res.state);
        showToast(res.message, 'success');
      }
    } catch {
      showToast('Failed to apply recommendation', 'error');
    }
  };

  const handleStartSimulation = async () => {
    try {
      const updated = await api.startSimulation();
      setState(updated);
      showToast('Live simulation loop started (3s dynamic tick)', 'success');
    } catch {
      showToast('Failed to start simulation', 'error');
    }
  };

  const handlePauseSimulation = async () => {
    try {
      const updated = await api.pauseSimulation();
      setState(updated);
      showToast('Live simulation paused', 'warning');
    } catch {
      showToast('Failed to pause simulation', 'error');
    }
  };

  const handleResetSimulation = async () => {
    try {
      const updated = await api.resetSimulation();
      setState(updated);
      showToast('System reset to default baseline', 'success');
    } catch {
      showToast('Failed to reset system', 'error');
    }
  };

  const handleOptimizeNow = async () => {
    sounds.playOptimize();
    try {
      const updated = await api.optimizeNow();
      setState(updated);
      showToast('Constraint optimization solved successfully', 'success');
    } catch {
      showToast('Optimization failed', 'error');
    }
  };

  const handleApplyCustomScenario = async (payload: any) => {
    setLoading(true);
    try {
      const updated = await api.applyCustomScenario(payload);
      setState(updated);
      showToast('Custom scenario constraints applied & solved', 'success');
    } catch {
      showToast('Failed to apply custom scenario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (settings: any) => {
    setLoading(true);
    try {
      const updated = await api.updateSettings(settings);
      setState(updated);
      showToast('Settings saved & distribution recalculated', 'success');
    } catch {
      showToast('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAlertRead = async (id: string) => {
    await api.markAlertRead(id);
    fetchState();
  };

  const handleDismissAlert = async (id: string) => {
    await api.dismissAlert(id);
    fetchState();
  };

  // Demo step execution mapper for the 10-step tour
  const handleExecuteDemoStep = async (stepNum: number) => {
    switch (stepNum) {
      case 1:
        await handleApplyScenario('NORMAL');
        break;
      case 2:
      case 3:
        await handleTriggerEmergency('EMERGENCY_BROADCAST');
        break;
      case 4:
      case 5:
        await handleTriggerEmergency('MEDICAL_EMERGENCY');
        break;
      case 6:
      case 7:
        await handleTriggerEmergency('GENERATOR_FAILURE');
        break;
      case 8:
      case 9:
        await handleTriggerEmergency('BATTERY_CRITICAL');
        break;
      case 10:
        await handleOptimizeNow();
        break;
      default:
        break;
    }
  };

  // If viewing the Landing Page
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPage
          onEnterCommandCenter={() => setActiveTab('dashboard')}
          onLaunchDemo={() => {
            setActiveTab('dashboard');
            setDemoModalOpen(true);
          }}
        />
        <HackathonDemoModal
          isOpen={demoModalOpen}
          onClose={() => setDemoModalOpen(false)}
          onExecuteDemoStep={handleExecuteDemoStep}
        />
      </>
    );
  }

  // Loading state
  if (!state) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center animate-spin">
          <Sparkles className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="text-sm font-mono text-cyan-300">
          INITIALIZING POWER FOR WHAT MATTERS CORE...
        </div>
        <p className="text-xs text-slate-500 font-mono">
          Synchronizing grid sensors and deterministic optimizer...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        state={state}
        onOpenDemo={() => setDemoModalOpen(true)}
        onOpenAlerts={() => setAlertsModalOpen(true)}
        onOpenJudgeInfo={() => setJudgeModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onNavigateLanding={() => setActiveTab('landing')}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={tab => {
            if (tab === 'ai-assistant') {
              setAssistantDrawerOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Center Main Stage */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Main Command Center Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-[1720px] mx-auto">
              {/* 1. KPI Cards */}
              <KpiCards kpis={state.kpis} />

              {/* 2. Power Flow Diagram */}
              <PowerFlowDiagram
                powerSources={state.powerSources}
                systems={state.systems}
                totalAllocatedKw={state.kpis.currentConsumptionKw}
                availablePowerKw={state.kpis.availablePowerKw}
                onSelectSystem={sys => setSelectedSystem(sys)}
              />

              {/* 3. Emergency Crisis Triggers Action Bar */}
              <EmergencyTriggers
                onTriggerEmergency={handleTriggerEmergency}
                loading={loading}
              />

              {/* 4. AI Recommendation & Confidence Widgets Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <AiRecommendationCard
                    recommendation={state.recommendation}
                    onApply={handleApplyRecommendation}
                    onDismiss={() => {}}
                    onViewDetails={() => setActiveTab('history')}
                  />
                </div>
                <div>
                  <AiConfidenceWidget confidence={state.confidence} />
                </div>
              </div>

              {/* 5. Dedicated Explainable AI Reasoning Panel */}
              <AiReasoningPanel decision={state.latestDecision} />

              {/* 6. Facility Subsystems Grid Cards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    CONNECTED FACILITY SUBSYSTEMS & RUNTIME TELEMETRY
                  </h3>
                  <button
                    onClick={() => setActiveTab('allocation-table')}
                    className="text-xs font-mono text-cyan-400 hover:underline"
                  >
                    View Tabular Matrix →
                  </button>
                </div>
                <SystemCards
                  systems={state.systems}
                  onSelectSystem={sys => setSelectedSystem(sys)}
                />
              </div>

              {/* 7. Allocation Table */}
              <AllocationTable
                systems={state.systems}
                onSelectSystem={sys => setSelectedSystem(sys)}
              />

              {/* 8. Before vs After Comparison Benchmark */}
              <BeforeAfterComparison
                systems={state.systems}
                availablePowerKw={state.kpis.availablePowerKw}
              />
            </div>
          )}

          {/* Standalone Views */}
          {activeTab === 'power-flow' && (
            <div className="max-w-[1720px] mx-auto space-y-5">
              <PowerFlowDiagram
                powerSources={state.powerSources}
                systems={state.systems}
                totalAllocatedKw={state.kpis.currentConsumptionKw}
                availablePowerKw={state.kpis.availablePowerKw}
                onSelectSystem={sys => setSelectedSystem(sys)}
              />
              <SystemCards
                systems={state.systems}
                onSelectSystem={sys => setSelectedSystem(sys)}
              />
            </div>
          )}

          {activeTab === 'systems' && (
            <div className="max-w-[1720px] mx-auto space-y-5">
              <SystemCards
                systems={state.systems}
                onSelectSystem={sys => setSelectedSystem(sys)}
              />
              <AllocationTable
                systems={state.systems}
                onSelectSystem={sys => setSelectedSystem(sys)}
              />
            </div>
          )}

          {activeTab === 'allocation-table' && (
            <div className="max-w-[1720px] mx-auto space-y-5">
              <AllocationTable
                systems={state.systems}
                onSelectSystem={sys => setSelectedSystem(sys)}
              />
              <AiReasoningPanel decision={state.latestDecision} />
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="max-w-[1720px] mx-auto space-y-5">
              <LiveSimulationPanel
                state={state}
                onStart={handleStartSimulation}
                onPause={handlePauseSimulation}
                onReset={handleResetSimulation}
                loading={loading}
              />
              <KpiCards kpis={state.kpis} />
              <PowerForecastView forecast={state.forecast} />
            </div>
          )}

          {activeTab === 'scenarios' && (
            <div className="max-w-[1720px] mx-auto space-y-6">
              <ScenarioSimulator
                activeScenario={state.activeScenario}
                onRunScenario={handleApplyScenario}
                onOpenCustomBuilder={() => {
                  const elem = document.getElementById('custom-builder-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                loading={loading}
              />
              <div id="custom-builder-section">
                <CustomScenarioBuilder
                  currentState={state}
                  onApplyCustom={handleApplyCustomScenario}
                  loading={loading}
                />
              </div>
            </div>
          )}

          {activeTab === 'power-sources' && (
            <div className="max-w-[1720px] mx-auto space-y-5">
              <PowerSourcesView sources={state.powerSources} />
              <KpiCards kpis={state.kpis} />
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="max-w-[1720px] mx-auto">
              <PowerForecastView forecast={state.forecast} />
            </div>
          )}

          {activeTab === 'risk-monitor' && (
            <div className="max-w-[1720px] mx-auto space-y-5">
              <RiskMonitorView risks={state.riskMatrix} />
              <KpiCards kpis={state.kpis} />
            </div>
          )}

          {activeTab === 'facility-map' && (
            <div className="max-w-[1720px] mx-auto space-y-5">
              <FacilityMapView
                systems={state.systems}
                onSelectSystem={sys => setSelectedSystem(sys)}
              />
              <SystemCards
                systems={state.systems}
                onSelectSystem={sys => setSelectedSystem(sys)}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-[1720px] mx-auto space-y-5">
              <DecisionHistoryView history={state.history} />
              <AiReasoningPanel decision={state.latestDecision} />
            </div>
          )}

          {activeTab === 'manual-control' && (
            <div className="max-w-[1720px] mx-auto">
              <ManualOverrideView
                systems={state.systems}
                manualOverrideActive={state.facilityConfig.manualOverrideActive}
                onOverride={handleManualOverride}
                onReturnControl={handleReturnControl}
                loading={loading}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-[1720px] mx-auto">
              <SettingsView
                config={state.facilityConfig}
                onSaveSettings={handleSaveSettings}
                loading={loading}
              />
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button for PowerAI Assistant */}
      <button
        onClick={() => {
          sounds.playClick();
          setAssistantDrawerOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-bold text-xs shadow-2xl shadow-purple-900/60 border border-purple-400/40 hover:scale-105 active:scale-95 transition-all"
      >
        <Sparkles className="w-4 h-4 text-white" />
        <span>PowerAI Assistant</span>
      </button>

      {/* Real-time Toast Notifications */}
      {toast && (
        <div
          className={`fixed bottom-6 left-6 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-fade-in ${
            toast.type === 'error'
              ? 'bg-red-950/95 border-red-500 text-red-200'
              : toast.type === 'warning'
              ? 'bg-amber-950/95 border-amber-500 text-amber-200'
              : 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <HackathonDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onExecuteDemoStep={handleExecuteDemoStep}
      />

      <AlertCenterModal
        isOpen={alertsModalOpen}
        onClose={() => setAlertsModalOpen(false)}
        alerts={state.alerts}
        onMarkRead={handleMarkAlertRead}
        onDismiss={handleDismissAlert}
      />

      <JudgeInfoModal
        isOpen={judgeModalOpen}
        onClose={() => setJudgeModalOpen(false)}
      />

      <SystemDetailModal
        system={selectedSystem}
        onClose={() => setSelectedSystem(null)}
        onSetUrgency={(sysId, urgency) => {
          handleApplyCustomScenario({ urgencies: { [sysId]: urgency } });
          setSelectedSystem(null);
        }}
      />

      <AiAssistantDrawer
        isOpen={assistantDrawerOpen}
        onClose={() => setAssistantDrawerOpen(false)}
      />
    </div>
  );
}

export default App;
