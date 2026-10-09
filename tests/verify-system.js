// Comprehensive End-to-End System Validation Suite
const API_BASE = 'http://localhost:3001/api';

async function runTests() {
  console.log('====================================================');
  console.log('POWER FOR WHAT MATTERS - COMPREHENSIVE TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Initial State & KPIs
  await test('GET /api/status returns valid KPIs and 8 systems', async () => {
    const res = await fetch(`${API_BASE}/status`);
    const json = await res.json();
    if (!json.success || !json.data) throw new Error('Invalid status response');
    const { kpis, systems, powerSources } = json.data;
    if (systems.length !== 8) throw new Error(`Expected 8 systems, got ${systems.length}`);
    if (powerSources.length !== 4) throw new Error(`Expected 4 power sources, got ${powerSources.length}`);
    if (kpis.availablePowerKw <= 0) throw new Error('Available power must be > 0');
    if (kpis.currentConsumptionKw > kpis.availablePowerKw) {
      throw new Error('Total consumption exceeds available power!');
    }
  });

  // 2. Medical Emergency Trigger & Allocation
  await test('POST /api/emergency (MEDICAL_EMERGENCY) boosts Medical without breaching bus limits', async () => {
    const res = await fetch(`${API_BASE}/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'MEDICAL_EMERGENCY' })
    });
    const json = await res.json();
    if (!json.success) throw new Error('Emergency trigger failed');
    const medical = json.data.systems.find(s => s.id === 'medical');
    if (!medical || medical.allocatedPower < 14) throw new Error('Medical was not boosted');
    if (json.data.kpis.currentConsumptionKw > json.data.kpis.availablePowerKw) {
      throw new Error('Overload detected!');
    }
    const dec = json.data.latestDecision;
    if (!dec.why || !dec.riskAvoided) throw new Error('Missing AI explanation fields');
  });

  // 3. Emergency Broadcast Trigger
  await test('POST /api/emergency (EMERGENCY_BROADCAST) prioritizes Communication Systems', async () => {
    const res = await fetch(`${API_BASE}/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'EMERGENCY_BROADCAST' })
    });
    const json = await res.json();
    const comms = json.data.systems.find(s => s.id === 'communication');
    if (!comms || comms.allocatedPower < 8) throw new Error('Comms was not prioritized');
  });

  // 4. Generator Failure & Supply Shock
  await test('POST /api/emergency (GENERATOR_FAILURE) adapts to sudden supply loss', async () => {
    const res = await fetch(`${API_BASE}/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'GENERATOR_FAILURE' })
    });
    const json = await res.json();
    const gen = json.data.powerSources.find(s => s.id === 'generator');
    if (gen.status !== 'FAULT' && gen.currentOutput !== 0) throw new Error('Generator fault not registered');
    if (json.data.kpis.currentConsumptionKw > json.data.kpis.availablePowerKw) {
      throw new Error('Consumption exceeded reduced available power!');
    }
  });

  // 5. Safety Interlock: Block lowering Medical below minimum
  await test('POST /api/override strictly BLOCKS setting Medical below 10.0 kW minimum', async () => {
    const res = await fetch(`${API_BASE}/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemId: 'medical', targetKw: 7.0 })
    });
    const json = await res.json();
    if (res.status === 200 && json.success) throw new Error('Safety interlock failed to block unsafe override!');
    if (!json.blocked) throw new Error('Response did not indicate blocked: true');
    if (!json.message.includes('SAFETY BLOCK')) throw new Error('Missing SAFETY BLOCK message');
  });

  // 6. Safe Manual Override
  await test('POST /api/override succeeds for safe throttle on Charging Stations', async () => {
    const res = await fetch(`${API_BASE}/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemId: 'charging', targetKw: 1.0 })
    });
    const json = await res.json();
    if (!json.success) throw new Error('Safe override was incorrectly rejected');
    const chg = json.data.systems.find(s => s.id === 'charging');
    if (chg.allocatedPower !== 1.0) throw new Error('Override value was not applied');
  });

  // 7. Return Control to AI
  await test('POST /api/override/release restores autonomous AI arbitration', async () => {
    const res = await fetch(`${API_BASE}/override/release`, { method: 'POST' });
    const json = await res.json();
    if (!json.success) throw new Error('Failed to release control');
    if (json.data.facilityConfig.manualOverrideActive) throw new Error('Manual override still flagged active');
  });

  // 8. Scenario: Extreme Power Shortage
  await test('POST /api/scenario (EXTREME_SHORTAGE) executes deep load shedding safely', async () => {
    const res = await fetch(`${API_BASE}/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioKey: 'EXTREME_SHORTAGE' })
    });
    const json = await res.json();
    if (!json.success) throw new Error('Extreme shortage scenario failed');
    const medical = json.data.systems.find(s => s.id === 'medical');
    if (medical.allocatedPower < 10) throw new Error('Medical was dropped below safe minimum during triage!');
    if (json.data.kpis.currentConsumptionKw > json.data.kpis.availablePowerKw) {
      throw new Error('Total allocation exceeded available power in extreme shortage!');
    }
  });

  // 9. AI Chat Assistant Grounded Inquiries
  await test('POST /api/chat answers "Why did you reduce cooling?" with current telemetry', async () => {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Why did you reduce cooling?' })
    });
    const json = await res.json();
    if (!json.success || !json.data.answer) throw new Error('Chat reply missing');
    if (!json.data.answer.toLowerCase().includes('cool') && !json.data.answer.toLowerCase().includes('medical')) {
      throw new Error('Chat response was not relevant to cooling or medical priority');
    }
  });

  await test('POST /api/chat answers "Which system has the highest priority?"', async () => {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Which system has the highest priority?' })
    });
    const json = await res.json();
    if (!json.success || !json.data.answer) throw new Error('Chat reply missing');
    if (!json.data.answer.includes('priority')) throw new Error('Response did not mention priority');
  });

  // 10. Settings Update: Changing Optimization Strategy
  await test('POST /api/settings changes optimization mode to CRITICAL-FIRST', async () => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optimizationMode: 'CRITICAL-FIRST' })
    });
    const json = await res.json();
    if (!json.success) throw new Error('Settings update failed');
    if (json.data.facilityConfig.optimizationMode !== 'CRITICAL-FIRST') {
      throw new Error('Mode was not updated');
    }
  });

  // 11. System Reset
  await test('POST /api/simulation/reset restores baseline operational equilibrium', async () => {
    const res = await fetch(`${API_BASE}/simulation/reset`, { method: 'POST' });
    const json = await res.json();
    if (!json.success) throw new Error('Reset failed');
    if (json.data.systems.length !== 8) throw new Error('Systems lost after reset');
    if (json.data.kpis.availablePowerKw !== 48.0) throw new Error('Available power not restored to 48.0 kW');
  });

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
