// Simulator Engine for Real-Time & Scenario-based dynamic facility management
import { initialSystems, initialPowerSources, initialFacilityConfig, initialDecisionHistory, initialAlerts } from '../data/initialState.js';
import { optimizePowerAllocation } from './optimizer.js';

export class SimulationManager {
  constructor() {
    this.reset();
  }

  reset() {
    this.systems = JSON.parse(JSON.stringify(initialSystems));
    this.powerSources = JSON.parse(JSON.stringify(initialPowerSources));
    this.config = JSON.parse(JSON.stringify(initialFacilityConfig));
    this.history = JSON.parse(JSON.stringify(initialDecisionHistory));
    this.alerts = JSON.parse(JSON.stringify(initialAlerts));
    this.activeScenario = 'Normal Operation';
    this.isSimulating = false;
    this.simTickCount = 0;
    this.timer = null;

    // Run initial optimization
    this.recalculate('System Reset to Default State', 'Normal baseline restored across all 8 facility subsystems.');
  }

  getState() {
    return {
      facilityConfig: this.config,
      powerSources: this.powerSources,
      systems: this.systems,
      activeScenario: this.activeScenario,
      isSimulating: this.isSimulating,
      alerts: this.alerts,
      history: this.history,
      latestDecision: this.latestDecision,
      recommendation: this.recommendation,
      confidence: this.confidence,
      resilienceScore: this.resilienceScore,
      kpis: {
        availablePowerKw: this.config.availablePowerKw,
        totalCapacityKw: this.config.totalCapacityKw,
        currentConsumptionKw: this.totalAllocatedKw,
        emergencyReserveKw: this.emergencyReserveKw,
        emergencyReservePercent: this.emergencyReservePercent,
        systemsOnlineCount: this.systems.filter(s => s.allocatedPower > 0).length,
        totalSystemsCount: this.systems.length,
        optimizationEfficiency: this.optimizationEfficiency,
        currentRisk: this.currentRisk,
        batterySoc: this.getBatterySoc(),
        generatorFuelHours: this.getGeneratorFuelHours()
      },
      forecast: this.generateForecast(),
      riskMatrix: this.generateRiskMatrix()
    };
  }

  getBatterySoc() {
    const bat = this.powerSources.find(s => s.type === 'BATTERY');
    return bat ? bat.chargePercentage : 68.0;
  }

  getGeneratorFuelHours() {
    const gen = this.powerSources.find(s => s.type === 'GENERATOR');
    return gen ? gen.fuelHoursRemaining : 6.4;
  }

  recalculate(triggerTitle, reasonNote) {
    const prevSystems = JSON.parse(JSON.stringify(this.systems));
    
    // Sum active power sources to determine available power
    const activeAvailable = this.powerSources
      .filter(s => s.status !== 'OFFLINE')
      .reduce((sum, s) => sum + s.currentOutput, 0);
    
    // If not manually locked, update availablePowerKw to match power sources
    this.config.availablePowerKw = Math.round(activeAvailable * 10) / 10;

    const result = optimizePowerAllocation(this.systems, this.powerSources, this.config, prevSystems);

    this.systems = result.systems;
    this.totalAllocatedKw = result.totalAllocatedKw;
    this.emergencyReserveKw = result.emergencyReserveKw;
    this.emergencyReservePercent = result.emergencyReservePercent;
    this.optimizationEfficiency = result.optimizationEfficiency;
    this.currentRisk = result.currentRisk;
    this.latestDecision = result.explanation;
    this.recommendation = result.recommendation;
    this.confidence = result.confidence;
    this.resilienceScore = result.resilienceScore;

    // Check if meaningful change occurred to log in history
    const significantChanges = result.systems
      .filter(s => Math.abs(s.delta) >= 0.2)
      .map(s => ({
        system: s.name,
        delta: s.delta,
        from: Math.round((s.allocatedPower - s.delta) * 10) / 10,
        to: s.allocatedPower,
        unit: 'kW'
      }));

    if (significantChanges.length > 0 || triggerTitle.includes('Emergency') || triggerTitle.includes('Scenario')) {
      const decisionEntry = {
        id: `dec-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        trigger: triggerTitle,
        scenario: this.activeScenario,
        changes: significantChanges,
        reason: reasonNote || result.explanation.why,
        impact: result.explanation.riskAvoided,
        riskBefore: this.currentRisk === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        riskAfter: this.currentRisk,
        confidence: result.confidence.overallPercentage
      };

      this.history.unshift(decisionEntry);
      if (this.history.length > 25) this.history.pop();
    }

    return this.getState();
  }

  // Predefined scenarios (Requirement #10)
  applyScenario(scenarioKey) {
    this.config.manualOverrideActive = false;

    switch (scenarioKey) {
      case 'NORMAL':
        this.activeScenario = 'Normal Operation';
        this.powerSources.forEach(s => {
          if (s.id === 'grid') { s.status = 'ONLINE'; s.currentOutput = 25.0; }
          if (s.id === 'generator') { s.status = 'ONLINE'; s.currentOutput = 15.0; }
          if (s.id === 'solar') { s.status = 'ONLINE'; s.currentOutput = 8.0; }
          if (s.id === 'battery') { s.status = 'STANDBY'; s.currentOutput = 0.0; s.chargePercentage = 68.0; }
        });
        this.systems.forEach(s => {
          s.urgency = 'NORMAL';
          if (s.id === 'medical') { s.currentDemand = 14.0; s.urgency = 'HIGH'; }
          if (s.id === 'communication') s.currentDemand = 8.0;
          if (s.id === 'cooling') s.currentDemand = 12.0;
          if (s.id === 'charging') s.currentDemand = 8.0;
          if (s.id === 'water') s.currentDemand = 7.0;
          if (s.id === 'computing') s.currentDemand = 6.0;
          if (s.id === 'lighting') s.currentDemand = 5.0;
          if (s.id === 'emergency_support') s.currentDemand = 4.0;
        });
        this.addAlert('INFO', 'Normal Scenario Loaded', 'System operating under standard emergency reserve parameters.');
        this.recalculate('Scenario: Normal Operation', 'Baseline operating state with grid, generator, and solar fully synchronized.');
        break;

      case 'MEDICAL_EMERGENCY':
        this.activeScenario = 'Mass Casualty Medical Surge';
        const medSys = this.systems.find(s => s.id === 'medical');
        if (medSys) {
          medSys.urgency = 'CRITICAL';
          medSys.currentDemand = 17.5; // High demand surge
        }
        const suppSys = this.systems.find(s => s.id === 'emergency_support');
        if (suppSys) suppSys.urgency = 'HIGH';

        this.addAlert('CRITICAL', 'Medical Urgency: CRITICAL', 'Mass casualty incident reported. ICU ventilator surge requires immediate power prioritization.');
        this.recalculate('Scenario: Medical Surge Emergency', 'Prioritized Medical and Support Systems to maximum safe power; shed non-critical cooling and charging.');
        break;

      case 'COMMUNICATION_EMERGENCY':
        this.activeScenario = 'Communication Blackout / Broadcast Surge';
        const commSys = this.systems.find(s => s.id === 'communication');
        if (commSys) {
          commSys.urgency = 'CRITICAL';
          commSys.currentDemand = 11.5;
        }
        this.addAlert('HIGH', 'Emergency Telemetry Uplink Activated', 'High-priority regional emergency broadcast in progress. Comm bandwidth power boosted.');
        this.recalculate('Scenario: Emergency Broadcast Surge', 'Boosted Communication subsystem to 11.5 kW to guarantee continuous disaster radio and telemetry.');
        break;

      case 'POWER_SOURCE_FAILURE':
        this.activeScenario = 'Primary Grid Blackout';
        const grid = this.powerSources.find(s => s.id === 'grid');
        if (grid) {
          grid.status = 'OFFLINE';
          grid.currentOutput = 0.0;
        }
        // Battery and generator step up
        const gen = this.powerSources.find(s => s.id === 'generator');
        if (gen) gen.currentOutput = 24.0;
        const bat = this.powerSources.find(s => s.id === 'battery');
        if (bat) {
          bat.status = 'DISCHARGING';
          bat.currentOutput = 8.0;
        }
        this.addAlert('CRITICAL', 'Grid Sub-Station Offline', 'Primary municipal grid severed. Generator and BESS battery engaged in islanded microgrid mode.');
        this.recalculate('Scenario: Grid Feeder Collapse', 'Switched to microgrid islanding. Total generation constrained; throttled EV charging and ancillary HVAC.');
        break;

      case 'EXTREME_SHORTAGE':
        this.activeScenario = 'Extreme Power Shortage (Generator + Grid Loss)';
        this.powerSources.forEach(s => {
          if (s.id === 'grid') { s.status = 'OFFLINE'; s.currentOutput = 0.0; }
          if (s.id === 'generator') { s.status = 'FAULT'; s.currentOutput = 10.0; }
          if (s.id === 'solar') { s.status = 'ONLINE'; s.currentOutput = 4.0; }
          if (s.id === 'battery') { s.status = 'DISCHARGING'; s.currentOutput = 8.0; s.chargePercentage = 24.0; }
        });
        this.addAlert('CRITICAL', 'CRITICAL POWER DEFICIT IMMINENT', 'Total generation restricted to 22.0 kW. Non-essential infrastructure strictly curtailed.');
        this.recalculate('Scenario: Extreme Power Shortage', 'Executed emergency load shedding. Medical ICU and life safety guaranteed; secondary loads placed into deep throttle.');
        break;

      case 'MULTIPLE_EMERGENCIES':
        this.activeScenario = 'Compound Emergency: Trauma Surge + Generator Derate';
        const mSys = this.systems.find(s => s.id === 'medical');
        if (mSys) { mSys.urgency = 'CRITICAL'; mSys.currentDemand = 17.0; }
        const cSys = this.systems.find(s => s.id === 'communication');
        if (cSys) { cSys.urgency = 'HIGH'; cSys.currentDemand = 10.0; }
        const genDerate = this.powerSources.find(s => s.id === 'generator');
        if (genDerate) genDerate.currentOutput = 8.0;
        this.addAlert('CRITICAL', 'Multiple Cascading Emergencies', 'High medical intake combined with partial generator derating. AI autonomous arbitration engaged.');
        this.recalculate('Scenario: Compound Trauma Surge', 'Arbitrated multi-fault condition: life support locked at 17 kW; cooling halved; charging zeroed.');
        break;

      case 'NIGHT_EMERGENCY':
        this.activeScenario = 'Night-Time Emergency (Zero Solar PV)';
        const solar = this.powerSources.find(s => s.id === 'solar');
        if (solar) { solar.currentOutput = 0.0; solar.irradianceWsqm = 0; }
        const lightSys = this.systems.find(s => s.id === 'lighting');
        if (lightSys) { lightSys.currentDemand = 7.0; lightSys.urgency = 'HIGH'; }
        this.addAlert('WARNING', 'Night Operations Active', 'Solar PV generation dropped to zero. Facility perimeter and corridor lighting demand increased to 7 kW.');
        this.recalculate('Scenario: Night-Time Shift', 'Compensated solar absence using generator baseline; emergency lighting elevated.');
        break;

      default:
        break;
    }

    return this.getState();
  }

  // Quick emergency event triggers (Requirement #12)
  triggerEmergency(eventType) {
    switch (eventType) {
      case 'MEDICAL_EMERGENCY': {
        const sys = this.systems.find(s => s.id === 'medical');
        if (sys) {
          sys.urgency = 'CRITICAL';
          sys.currentDemand = 18.0;
        }
        this.addAlert('CRITICAL', 'Critical Trauma Inflow', 'Emergency medical team signaled code blue in trauma bay.');
        return this.recalculate('Medical Emergency Triggered', 'Elevated ICU power to maximum capacity to protect cardiac life support.');
      }

      case 'EMERGENCY_BROADCAST': {
        const sys = this.systems.find(s => s.id === 'communication');
        if (sys) {
          sys.urgency = 'CRITICAL';
          sys.currentDemand = 11.0;
        }
        this.addAlert('HIGH', 'Emergency Broadcast Initiated', 'Regional disaster coordination network requires full transmitter power.');
        return this.recalculate('Emergency Broadcast Activated', 'Communication infrastructure prioritized with +3.0 kW allocated from lower-tier buffers.');
      }

      case 'GENERATOR_FAILURE': {
        const gen = this.powerSources.find(s => s.id === 'generator');
        if (gen) {
          gen.status = 'FAULT';
          gen.currentOutput = 0.0;
        }
        // Battery responds
        const bat = this.powerSources.find(s => s.id === 'battery');
        if (bat) {
          bat.status = 'DISCHARGING';
          bat.currentOutput = 9.0;
        }
        this.addAlert('CRITICAL', 'Backup Generator 1 Failed', 'Mechanical fuel pump trip detected. Battery energy storage compensating instantly.');
        return this.recalculate('Generator Failure Detected', 'Compensated generation loss; shedding charging stations and secondary cooling.');
      }

      case 'BATTERY_CRITICAL': {
        const bat = this.powerSources.find(s => s.id === 'battery');
        if (bat) {
          bat.chargePercentage = 18.0;
          bat.status = 'CRITICAL';
        }
        this.addAlert('CRITICAL', 'Battery Reserve Below 20%', 'BESS state of charge is dangerously low. Deep load shedding activated.');
        return this.recalculate('Battery Critical Alarm', 'Severely reduced non-essential systems to protect the remaining emergency battery margin.');
      }

      case 'POWER_SURGE': {
        this.systems.forEach(s => {
          if (s.id !== 'charging') {
            s.currentDemand = Math.min(s.maximumPower, s.currentDemand * 1.2);
          }
        });
        this.addAlert('WARNING', 'Simultaneous Load Surge', 'Multi-zone spike in auxiliary power draw detected across facility.');
        return this.recalculate('Facility Load Surge', 'AI re-optimized distribution to absorb surge within total generation capacity.');
      }

      case 'COOLING_FAILURE': {
        const cool = this.systems.find(s => s.id === 'cooling');
        if (cool) {
          cool.urgency = 'CRITICAL';
          cool.currentDemand = 15.0;
        }
        this.addAlert('HIGH', 'Thermal Overheating in Server Room', 'Data center and vaccine storage temperature rising rapidly. Chillers set to max.');
        return this.recalculate('Cooling Surge Alarm', 'Redirected power to HVAC chillers to prevent server room thermal shutdown.');
      }

      case 'WATER_FAILURE': {
        const water = this.systems.find(s => s.id === 'water');
        if (water) {
          water.urgency = 'CRITICAL';
          water.currentDemand = 9.0;
        }
        this.addAlert('HIGH', 'Water Purification Pressure Drop', 'Sterilization autoclaves and dialysis water loops requiring full boost pump pressure.');
        return this.recalculate('Water System Emergency', 'Allocated maximum required power to water filtration pumps.');
      }

      default:
        return this.getState();
    }
  }

  // Custom scenario builder (Requirement #22)
  applyCustomScenario(customInput) {
    this.activeScenario = 'Custom User Scenario';

    if (customInput.availablePowerKw !== undefined) {
      this.config.availablePowerKw = Number(customInput.availablePowerKw);
    }

    if (customInput.batterySoc !== undefined) {
      const bat = this.powerSources.find(s => s.id === 'battery');
      if (bat) bat.chargePercentage = Number(customInput.batterySoc);
    }

    if (customInput.solarOutput !== undefined) {
      const sol = this.powerSources.find(s => s.id === 'solar');
      if (sol) sol.currentOutput = Number(customInput.solarOutput);
    }

    if (customInput.generatorOutput !== undefined) {
      const gen = this.powerSources.find(s => s.id === 'generator');
      if (gen) gen.currentOutput = Number(customInput.generatorOutput);
    }

    // Demands
    const demands = customInput.demands || {};
    this.systems.forEach(s => {
      if (demands[s.id] !== undefined) {
        s.currentDemand = Number(demands[s.id]);
      }
    });

    // Urgencies
    const urgencies = customInput.urgencies || {};
    this.systems.forEach(s => {
      if (urgencies[s.id] !== undefined) {
        s.urgency = urgencies[s.id];
      }
    });

    this.addAlert('INFO', 'Custom Scenario Applied', 'Simulating user-defined parameters with autonomous AI solver.');
    return this.recalculate('Custom Scenario Optimization', 'Evaluated user constraints, system boundaries, and priority matrices.');
  }

  // Manual override with safety validation (Requirement #18)
  manualOverride(systemId, targetKw) {
    const sys = this.systems.find(s => s.id === systemId);
    if (!sys) throw new Error('System not found');

    const kw = Number(targetKw);

    // Hard Safety Rule: Medical cannot be reduced below minimum safe power
    if (sys.id === 'medical' && kw < sys.minimumPower) {
      return {
        success: false,
        blocked: true,
        message: `SAFETY BLOCK: Medical Equipment cannot be reduced below its critical minimum requirement of ${sys.minimumPower} kW.`
      };
    }

    if (kw < 0) {
      return {
        success: false,
        blocked: true,
        message: 'SAFETY BLOCK: Power allocation cannot be negative.'
      };
    }

    if (kw > sys.maximumPower) {
      return {
        success: false,
        blocked: true,
        message: `SAFETY BLOCK: Cannot allocate ${kw} kW. System physical maximum is ${sys.maximumPower} kW.`
      };
    }

    // Set manual override active
    this.config.manualOverrideActive = true;
    const oldAlloc = sys.allocatedPower;
    sys.allocatedPower = kw;
    sys.status = 'MANUAL_OVERRIDE';
    sys.delta = Math.round((kw - oldAlloc) * 10) / 10;

    // Recalculate totals
    this.totalAllocatedKw = Math.round(this.systems.reduce((acc, s) => acc + s.allocatedPower, 0) * 10) / 10;
    this.emergencyReserveKw = Math.max(0, Math.round((this.config.availablePowerKw - this.totalAllocatedKw) * 10) / 10);

    this.addAlert('WARNING', `Manual Override: ${sys.name}`, `Operator set allocation to ${kw} kW. AI optimization paused for this node.`);

    return {
      success: true,
      blocked: false,
      message: `Override accepted for ${sys.name}: ${kw} kW set.`,
      state: this.getState()
    };
  }

  returnControlToAI() {
    this.config.manualOverrideActive = false;
    this.systems.forEach(s => {
      if (s.status === 'MANUAL_OVERRIDE') s.status = 'OPTIMAL';
    });
    this.addAlert('INFO', 'AI Autonomous Control Restored', 'Operator returned full optimization authority to AI Engine.');
    return this.recalculate('Returned Control to AI', 'AI resumed active constraint balancing across all facility systems.');
  }

  applyRecommendation() {
    if (!this.recommendation || !this.recommendation.canApply) {
      return { success: false, message: 'No applicable recommendation.' };
    }

    const rec = this.recommendation;
    if (rec.deltaPayload) {
      Object.entries(rec.deltaPayload).forEach(([sysId, val]) => {
        const sys = this.systems.find(s => s.id === sysId);
        if (sys) sys.allocatedPower = Number(val);
      });
    }

    this.addAlert('INFO', 'Recommendation Applied', `Executed AI action: "${rec.title}"`);
    this.recalculate(`AI Recommendation Applied: ${rec.title}`, rec.action);
    return { success: true, message: `Applied: ${rec.title}`, state: this.getState() };
  }

  // Live simulation tick (Requirement #11)
  startSimulation() {
    if (this.isSimulating) return;
    this.isSimulating = true;
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.tick();
    }, 3000); // 3-second tick for realistic gradual progression
  }

  pauseSimulation() {
    this.isSimulating = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  tick() {
    this.simTickCount++;

    // Gradual battery change
    const bat = this.powerSources.find(s => s.id === 'battery');
    if (bat) {
      if (bat.status === 'DISCHARGING') {
        bat.chargePercentage = Math.max(5, Math.round((bat.chargePercentage - 0.4) * 10) / 10);
      } else if (this.emergencyReserveKw > 4.0 && bat.chargePercentage < 98) {
        bat.chargePercentage = Math.min(100, Math.round((bat.chargePercentage + 0.2) * 10) / 10);
      }
    }

    // Solar slight fluctuation (cloud passing / time shift)
    const solar = this.powerSources.find(s => s.id === 'solar');
    if (solar && solar.status === 'ONLINE') {
      const wobble = (Math.sin(this.simTickCount * 0.4) * 0.4);
      solar.currentOutput = Math.max(2.0, Math.min(12.0, Math.round((solar.currentOutput + wobble) * 10) / 10));
    }

    // Minor demand drift (+-0.2 kW) on secondary loads
    this.systems.forEach(s => {
      if (s.id !== 'medical' && s.id !== 'emergency_support') {
        const drift = (Math.random() - 0.5) * 0.3;
        s.currentDemand = Math.max(s.minimumPower, Math.min(s.maximumPower, Math.round((s.currentDemand + drift) * 10) / 10));
      }
    });

    // Auto recalculate without spamming history unless significant
    if (this.simTickCount % 2 === 0) {
      this.recalculate('Live Simulation Adaptive Recalculation', 'Real-time telemetry drift compensated autonomously.');
    }
  }

  addAlert(level, title, message, systemId = 'general') {
    const newAlert = {
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      level,
      timestamp: 'Just now',
      title,
      message,
      systemId,
      isRead: false
    };
    this.alerts.unshift(newAlert);
    if (this.alerts.length > 20) this.alerts.pop();
  }

  markAlertRead(alertId) {
    const a = this.alerts.find(item => item.id === alertId);
    if (a) a.isRead = true;
  }

  dismissAlert(alertId) {
    this.alerts = this.alerts.filter(item => item.id !== alertId);
  }

  // Predictive forecast for Requirement #15
  generateForecast() {
    const baseDemand = this.totalAllocatedKw;
    const baseAvailable = this.config.availablePowerKw;
    const battery = this.getBatterySoc();

    const points = [
      {
        time: 'Now',
        currentDemand: baseDemand,
        predictedDemand: baseDemand,
        availablePower: baseAvailable,
        batteryLevel: battery,
        solarGen: this.powerSources.find(s => s.id === 'solar')?.currentOutput || 8.0
      },
      {
        time: '+15 min',
        currentDemand: baseDemand,
        predictedDemand: Math.round((baseDemand + 1.8) * 10) / 10,
        availablePower: baseAvailable,
        batteryLevel: Math.max(10, Math.round((battery - 3) * 10) / 10),
        solarGen: Math.max(0, Math.round(((this.powerSources.find(s => s.id === 'solar')?.currentOutput || 8) - 0.8) * 10) / 10)
      },
      {
        time: '+30 min',
        currentDemand: baseDemand,
        predictedDemand: Math.round((baseDemand + 3.4) * 10) / 10,
        availablePower: Math.round((baseAvailable - 1.2) * 10) / 10,
        batteryLevel: Math.max(10, Math.round((battery - 7) * 10) / 10),
        solarGen: Math.max(0, Math.round(((this.powerSources.find(s => s.id === 'solar')?.currentOutput || 8) - 1.6) * 10) / 10)
      },
      {
        time: '+1 hr',
        currentDemand: baseDemand,
        predictedDemand: Math.round((baseDemand + 2.1) * 10) / 10,
        availablePower: Math.round((baseAvailable - 2.0) * 10) / 10,
        batteryLevel: Math.max(10, Math.round((battery - 14) * 10) / 10),
        solarGen: Math.max(0, Math.round(((this.powerSources.find(s => s.id === 'solar')?.currentOutput || 8) - 3.2) * 10) / 10)
      },
      {
        time: '+4 hr',
        currentDemand: baseDemand,
        predictedDemand: Math.round((baseDemand - 1.5) * 10) / 10,
        availablePower: Math.round((baseAvailable - 4.0) * 10) / 10,
        batteryLevel: Math.max(10, Math.round((battery - 28) * 10) / 10),
        solarGen: 0.0 // Night
      }
    ];

    const statements = [
      battery < 40 
        ? `Battery reserve projected to fall below emergency threshold in 38 minutes at current draw.`
        : `Power demand is expected to remain within available generation threshold over the next 45 minutes.`,
      `Solar generation will taper off in 1.8 hours; backup generator fuel sufficient for ${this.getGeneratorFuelHours().toFixed(1)} hours.`
    ];

    return {
      points,
      statements,
      timeHorizon: '4 Hours Ahead'
    };
  }

  // Risk monitor for Requirement #16
  generateRiskMatrix() {
    const batterySoc = this.getBatterySoc();
    const reserveKw = this.emergencyReserveKw;
    const medSys = this.systems.find(s => s.id === 'medical');
    const commSys = this.systems.find(s => s.id === 'communication');
    const coolSys = this.systems.find(s => s.id === 'cooling');
    const waterSys = this.systems.find(s => s.id === 'water');

    return [
      {
        category: 'POWER SHORTAGE',
        riskLevel: reserveKw < 2.0 ? 'CRITICAL' : reserveKw < 5.0 ? 'HIGH' : 'LOW',
        probability: reserveKw < 2.0 ? '78%' : reserveKw < 5.0 ? '42%' : '14%',
        impact: 'CRITICAL',
        recommendedAction: 'Maintain minimum 15% emergency reserve; throttle auxiliary EV charging.'
      },
      {
        category: 'BATTERY FAILURE',
        riskLevel: batterySoc < 25 ? 'CRITICAL' : batterySoc < 45 ? 'HIGH' : batterySoc < 60 ? 'MEDIUM' : 'LOW',
        probability: batterySoc < 25 ? '84%' : batterySoc < 45 ? '56%' : '18%',
        impact: 'HIGH',
        recommendedAction: 'Engage microgrid generator throttling; switch BESS to standby preservation.'
      },
      {
        category: 'MEDICAL RISK',
        riskLevel: medSys.allocatedPower < medSys.minimumPower ? 'CRITICAL' : medSys.urgency === 'CRITICAL' ? 'HIGH' : 'LOW',
        probability: medSys.urgency === 'CRITICAL' ? '65%' : '8%',
        impact: 'CRITICAL',
        recommendedAction: 'Enforce absolute priority lock on ICU life-support feed.'
      },
      {
        category: 'COMMUNICATION RISK',
        riskLevel: commSys.allocatedPower < commSys.minimumPower ? 'HIGH' : commSys.urgency === 'CRITICAL' ? 'MEDIUM' : 'LOW',
        probability: commSys.urgency === 'CRITICAL' ? '52%' : '12%',
        impact: 'HIGH',
        recommendedAction: 'Safeguard satellite telemetry uplink transmitter power.'
      },
      {
        category: 'COOLING / HVAC RISK',
        riskLevel: coolSys.allocatedPower < coolSys.minimumPower ? 'HIGH' : coolSys.allocatedPower < 8.0 ? 'MEDIUM' : 'LOW',
        probability: coolSys.allocatedPower < 8.0 ? '48%' : '20%',
        impact: 'MEDIUM',
        recommendedAction: 'Cycle secondary zone dampers while protecting vaccine cold room.'
      },
      {
        category: 'WATER SYSTEM RISK',
        riskLevel: waterSys.allocatedPower < waterSys.minimumPower ? 'HIGH' : 'LOW',
        probability: '15%',
        impact: 'HIGH',
        recommendedAction: 'Verify minimum 4.0 kW continuous pressure for sterile surgical washing.'
      }
    ];
  }
}

export const simulator = new SimulationManager();
