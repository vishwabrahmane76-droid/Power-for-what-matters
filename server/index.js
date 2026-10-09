import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { simulator } from './engine/simulator.js';
import { handleAssistantQuery } from './engine/assistant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(distPath));

// API Status & Full State
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    data: simulator.getState()
  });
});

// Systems endpoint
app.get('/api/systems', (req, res) => {
  res.json({
    success: true,
    data: simulator.systems
  });
});

// Power sources endpoint
app.get('/api/power', (req, res) => {
  res.json({
    success: true,
    data: {
      sources: simulator.powerSources,
      kpis: simulator.getState().kpis
    }
  });
});

// Allocations endpoint
app.get('/api/allocations', (req, res) => {
  const state = simulator.getState();
  res.json({
    success: true,
    data: {
      systems: state.systems,
      totalAllocatedKw: state.kpis.currentConsumptionKw,
      availablePowerKw: state.kpis.availablePowerKw,
      emergencyReserveKw: state.kpis.emergencyReserveKw,
      latestDecision: state.latestDecision
    }
  });
});

// Alerts endpoint
app.get('/api/alerts', (req, res) => {
  res.json({
    success: true,
    data: simulator.alerts
  });
});

// History endpoint
app.get('/api/history', (req, res) => {
  res.json({
    success: true,
    data: simulator.history
  });
});

// Forecast endpoint
app.get('/api/forecast', (req, res) => {
  res.json({
    success: true,
    data: simulator.generateForecast()
  });
});

// POST /api/optimize - manual trigger to recalculate
app.post('/api/optimize', (req, res) => {
  const state = simulator.recalculate('Manual AI Optimization Request', 'Operator invoked direct multi-tier optimization solver.');
  res.json({
    success: true,
    data: state
  });
});

// POST /api/scenario - apply predefined scenario
app.post('/api/scenario', (req, res) => {
  const { scenarioKey } = req.body;
  if (!scenarioKey) {
    return res.status(400).json({ success: false, error: 'Missing scenarioKey' });
  }
  const state = simulator.applyScenario(scenarioKey);
  res.json({
    success: true,
    scenario: scenarioKey,
    data: state
  });
});

// POST /api/custom-scenario - apply custom scenario
app.post('/api/custom-scenario', (req, res) => {
  const state = simulator.applyCustomScenario(req.body);
  res.json({
    success: true,
    data: state
  });
});

// POST /api/emergency - quick event trigger
app.post('/api/emergency', (req, res) => {
  const { eventType } = req.body;
  if (!eventType) {
    return res.status(400).json({ success: false, error: 'Missing eventType' });
  }
  const state = simulator.triggerEmergency(eventType);
  res.json({
    success: true,
    eventType,
    data: state
  });
});

// POST /api/override - manual control with safety logic
app.post('/api/override', (req, res) => {
  const { systemId, targetKw } = req.body;
  if (!systemId || targetKw === undefined) {
    return res.status(400).json({ success: false, error: 'Missing systemId or targetKw' });
  }

  const result = simulator.manualOverride(systemId, targetKw);
  if (result.blocked) {
    return res.status(400).json({
      success: false,
      blocked: true,
      message: result.message
    });
  }

  res.json({
    success: true,
    data: result.state,
    message: result.message
  });
});

// POST /api/override/release - return control to AI
app.post('/api/override/release', (req, res) => {
  const state = simulator.returnControlToAI();
  res.json({
    success: true,
    message: 'Control returned to AI Optimizer.',
    data: state
  });
});

// POST /api/recommendation/apply - apply AI recommendation
app.post('/api/recommendation/apply', (req, res) => {
  const result = simulator.applyRecommendation();
  res.json(result);
});

// Simulation controls
app.post('/api/simulation/start', (req, res) => {
  simulator.startSimulation();
  res.json({ success: true, isSimulating: true, data: simulator.getState() });
});

app.post('/api/simulation/pause', (req, res) => {
  simulator.pauseSimulation();
  res.json({ success: true, isSimulating: false, data: simulator.getState() });
});

app.post('/api/simulation/reset', (req, res) => {
  simulator.reset();
  res.json({ success: true, data: simulator.getState() });
});

// Settings update
app.post('/api/settings', (req, res) => {
  const { facilityName, totalCapacityKw, availablePowerKw, emergencyReservePercent, optimizationMode } = req.body;
  if (facilityName !== undefined) simulator.config.facilityName = facilityName;
  if (totalCapacityKw !== undefined) simulator.config.totalCapacityKw = Number(totalCapacityKw);
  if (availablePowerKw !== undefined) simulator.config.availablePowerKw = Number(availablePowerKw);
  if (emergencyReservePercent !== undefined) simulator.config.emergencyReservePercent = Number(emergencyReservePercent);
  if (optimizationMode !== undefined) simulator.config.optimizationMode = optimizationMode;

  const state = simulator.recalculate('Configuration Updated', `Settings changed: Strategy set to ${simulator.config.optimizationMode}.`);
  res.json({ success: true, data: state });
});

// Alerts management
app.post('/api/alerts/:id/read', (req, res) => {
  simulator.markAlertRead(req.params.id);
  res.json({ success: true, data: simulator.alerts });
});

app.delete('/api/alerts/:id', (req, res) => {
  simulator.dismissAlert(req.params.id);
  res.json({ success: true, data: simulator.alerts });
});

// AI Chat Assistant endpoint (Requirement #25)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, error: 'Empty message' });
  }
  const state = simulator.getState();
  const reply = handleAssistantQuery(message, state);
  res.json({
    success: true,
    data: reply
  });
});

// Client SPA catch-all for Express 5
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Power for What Matters] Backend API & Web App running at http://localhost:${PORT}`);
});

