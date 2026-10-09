// Context-Aware Intelligent Assistant (PowerAI Assistant)
// Answers inquiries with live, grounded metrics from the current simulation state

export function handleAssistantQuery(query, state) {
  const q = (query || '').toLowerCase().trim();
  const { kpis, systems, powerSources, facilityConfig, latestDecision, riskMatrix } = state;

  const cooling = systems.find(s => s.id === 'cooling');
  const medical = systems.find(s => s.id === 'medical');
  const comms = systems.find(s => s.id === 'communication');
  const charging = systems.find(s => s.id === 'charging');
  const water = systems.find(s => s.id === 'water');
  const battery = powerSources.find(s => s.type === 'BATTERY');
  const generator = powerSources.find(s => s.type === 'GENERATOR');

  // Question: "Why did you reduce cooling?"
  if (q.includes('why') && (q.includes('cool') || q.includes('hvac'))) {
    if (cooling.allocatedPower < cooling.currentDemand) {
      const throttledKw = (cooling.currentDemand - cooling.allocatedPower).toFixed(1);
      return {
        answer: `Cooling / HVAC is currently throttled by ${throttledKw} kW (operating at ${cooling.allocatedPower} kW vs ${cooling.currentDemand} kW requested). The AI prioritized Medical Equipment (${medical.allocatedPower} kW) and Emergency Support, preserving a ${kpis.emergencyReserveKw} kW emergency reserve. Cooling minimum requirement of ${cooling.minimumPower} kW is fully respected to safeguard critical server and medical cooling zones.`,
        relevantSystem: 'cooling',
        confidence: 96
      };
    } else {
      return {
        answer: `Cooling / HVAC is not currently reduced. It is operating at ${cooling.allocatedPower} kW, satisfying 100% of its current demand (${cooling.currentDemand} kW).`,
        relevantSystem: 'cooling',
        confidence: 98
      };
    }
  }

  // Question: "Which system has the highest priority?"
  if (q.includes('highest priority') || q.includes('top priority') || (q.includes('priority') && q.includes('which'))) {
    const sorted = [...systems].sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0));
    const top = sorted[0];
    return {
      answer: `Currently, **${top.name}** holds the highest priority with a dynamic Priority Score of ${top.priorityScore} (Criticality: ${top.criticality}/100, Urgency: ${top.urgency}). It is currently receiving ${top.allocatedPower} kW out of ${top.currentDemand} kW demanded. Following closely is ${sorted[1].name} with score ${sorted[1].priorityScore}.`,
      relevantSystem: top.id,
      confidence: 99
    };
  }

  // Question: "What happens if the generator fails?"
  if (q.includes('generator fail') || (q.includes('generator') && q.includes('what happens'))) {
    const genOutput = generator ? generator.currentOutput : 15.0;
    return {
      answer: `If Diesel Backup Genset A fails right now, the facility will immediately lose ${genOutput} kW of generation. The BESS Battery Reserve (currently at ${battery.chargePercentage}%) would immediately step in, discharging up to 10 kW. The AI will instantly shed non-essential loads (EV Charging at ${charging.allocatedPower} kW, Computing at ${systems.find(s=>s.id==='computing').allocatedPower} kW, and auxiliary HVAC) to protect Medical Equipment (${medical.allocatedPower} kW) without breaching minimum safe operating thresholds.`,
      relevantSystem: 'generator',
      confidence: 95
    };
  }

  // Question: "How much reserve power do we have?"
  if (q.includes('reserve') || q.includes('how much power') || q.includes('available power')) {
    return {
      answer: `We currently have **${kpis.emergencyReserveKw} kW** in emergency reserve buffer (${kpis.emergencyReservePercent}% of available generation). Total available power is **${kpis.availablePowerKw} kW** across active sources, and current facility consumption is **${kpis.currentConsumptionKw} kW**. BESS battery stores an additional ${battery ? (battery.chargePercentage).toFixed(0) : 68}% of emergency backup.`,
      relevantSystem: 'kpis',
      confidence: 99
    };
  }

  // Question: "What should we shut down first?"
  if (q.includes('shut down first') || q.includes('cut first') || q.includes('shed first') || q.includes('turn off')) {
    const lowPriority = [...systems].sort((a, b) => a.criticality - b.criticality);
    return {
      answer: `The first recommended loads for curtailment are:\n1. **${lowPriority[0].name}** (Criticality: ${lowPriority[0].criticality}, current alloc: ${lowPriority[0].allocatedPower} kW, can shed down to ${lowPriority[0].minimumPower} kW)\n2. **${lowPriority[1].name}** (Criticality: ${lowPriority[1].criticality}, current alloc: ${lowPriority[1].allocatedPower} kW)\n3. Secondary HVAC chillers.\n\nMedical Equipment and Life Safety systems are strictly locked and will NEVER be shut down.`,
      relevantSystem: lowPriority[0].id,
      confidence: 98
    };
  }

  // Question: "Medical status"
  if (q.includes('medical') || q.includes('icu') || q.includes('patient')) {
    return {
      answer: `Medical Equipment & ICU is currently allocated **${medical.allocatedPower} kW** against a demand of ${medical.currentDemand} kW (Urgency: ${medical.urgency}, Status: ${medical.status}). Safe minimum threshold is ${medical.minimumPower} kW. Battery backup provides an additional ${medical.backupBatteryMinutes} minutes of isolated UPS runtime in the event of total bus failure.`,
      relevantSystem: 'medical',
      confidence: 99
    };
  }

  // Question: "Communication status"
  if (q.includes('comm') || q.includes('broadcast') || q.includes('radio')) {
    return {
      answer: `Communication Systems are allocated **${comms.allocatedPower} kW** (Demand: ${comms.currentDemand} kW, Status: ${comms.status}). Priority score is ${comms.priorityScore}. The system guarantees emergency satellite links, disaster telemetry, and municipal dispatch frequencies.`,
      relevantSystem: 'communication',
      confidence: 98
    };
  }

  // General fallback context-aware response
  return {
    answer: `Currently, the facility is operating in **${facilityConfig.optimizationMode}** mode under the "${state.activeScenario}" scenario. Total consumption is **${kpis.currentConsumptionKw} kW** / **${kpis.availablePowerKw} kW** available. Power Resilience Score stands at **${state.resilienceScore}/100** with overall risk evaluated as **${kpis.currentRisk}**. The AI engine is actively maintaining constraints across all 8 subsystems.`,
    relevantSystem: 'general',
    confidence: 92
  };
}
