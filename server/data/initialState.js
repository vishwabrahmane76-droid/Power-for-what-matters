// Initial data model conforming to Requirement #41 and #30

export const initialPowerSources = [
  {
    id: 'grid',
    name: 'Municipal Grid Feed',
    type: 'GRID',
    currentOutput: 25.0,
    maximumOutput: 40.0,
    status: 'ONLINE',
    availability: 1.0,
    efficiency: 0.98,
    costPerKwh: 0.16,
    carbonGPerKwh: 410,
    description: 'Primary high-voltage sub-station feeder line'
  },
  {
    id: 'generator',
    name: 'Diesel Backup Genset A',
    type: 'GENERATOR',
    currentOutput: 15.0,
    maximumOutput: 30.0,
    status: 'ONLINE',
    availability: 1.0,
    fuelHoursRemaining: 6.4,
    fuelCapacityLiters: 450,
    fuelCurrentLiters: 320,
    efficiency: 0.88,
    costPerKwh: 0.42,
    carbonGPerKwh: 780,
    description: 'Autonomous diesel generator with auto-start transfer switch'
  },
  {
    id: 'solar',
    name: 'Rooftop Solar PV Array',
    type: 'SOLAR',
    currentOutput: 8.0,
    maximumOutput: 12.0,
    status: 'ONLINE',
    availability: 0.85,
    efficiency: 0.95,
    irradianceWsqm: 720,
    costPerKwh: 0.02,
    carbonGPerKwh: 15,
    description: 'Monocrystalline photovoltaic array with dual MPPT inverters'
  },
  {
    id: 'battery',
    name: 'BESS Battery Reserve',
    type: 'BATTERY',
    currentOutput: 0.0, // Idle/Charging or Discharging
    maximumOutput: 10.0,
    status: 'STANDBY',
    availability: 1.0,
    chargePercentage: 68.0, // 68%
    capacityKwh: 40.0,
    currentStoredKwh: 27.2,
    cycleCount: 142,
    temperatureC: 24.5,
    description: 'Lithium iron phosphate (LiFePO4) energy storage system'
  }
];

export const initialSystems = [
  {
    id: 'medical',
    name: 'Medical Equipment & ICU',
    category: 'CRITICAL_LIFE',
    currentDemand: 14.0,
    allocatedPower: 14.0,
    minimumPower: 10.0,
    maximumPower: 18.0,
    priority: 'CRITICAL',
    urgency: 'HIGH',
    status: 'OPTIMAL',
    criticality: 100,
    efficiency: 0.94,
    trend: 'STABLE',
    location: 'Building A - ICU & Trauma Center',
    department: 'Intensive Care Unit',
    backupBatteryMinutes: 45,
    patientImpact: 'Life support, ventilators, dialysis, cardiac monitors'
  },
  {
    id: 'communication',
    name: 'Communication Systems',
    category: 'CRITICAL_COMMS',
    currentDemand: 8.0,
    allocatedPower: 8.0,
    minimumPower: 3.0,
    maximumPower: 12.0,
    priority: 'HIGH',
    urgency: 'NORMAL',
    status: 'STABLE',
    criticality: 90,
    efficiency: 0.91,
    trend: 'STABLE',
    location: 'Radio Tower & Command Hub',
    department: 'Emergency Telemetry',
    backupBatteryMinutes: 60,
    patientImpact: 'Emergency dispatch radio, satellite uplink, telemetry'
  },
  {
    id: 'lighting',
    name: 'Emergency Lighting',
    category: 'SAFETY',
    currentDemand: 5.0,
    allocatedPower: 5.0,
    minimumPower: 3.0,
    maximumPower: 7.0,
    priority: 'HIGH',
    urgency: 'NORMAL',
    status: 'STABLE',
    criticality: 75,
    efficiency: 0.96,
    trend: 'STABLE',
    location: 'Facility Wide Corridors & Exits',
    department: 'Facility Safety',
    backupBatteryMinutes: 90,
    patientImpact: 'Corridor egress, operating theatre baseline lighting'
  },
  {
    id: 'cooling',
    name: 'Cooling / HVAC System',
    category: 'ENVIRONMENTAL',
    currentDemand: 12.0,
    allocatedPower: 9.0,
    minimumPower: 6.0,
    maximumPower: 15.0,
    priority: 'MEDIUM',
    urgency: 'NORMAL',
    status: 'THROTTLED',
    criticality: 65,
    efficiency: 0.85,
    trend: 'STABLE',
    location: 'Central Plant & Air Handlers',
    department: 'HVAC Facilities',
    backupBatteryMinutes: 0,
    patientImpact: 'OR temperature regulation, vaccine cold storage thermal barrier'
  },
  {
    id: 'computing',
    name: 'Computing & Server Room',
    category: 'INFRASTRUCTURE',
    currentDemand: 6.0,
    allocatedPower: 5.0,
    minimumPower: 2.0,
    maximumPower: 10.0,
    priority: 'MEDIUM',
    urgency: 'NORMAL',
    status: 'STABLE',
    criticality: 55,
    efficiency: 0.92,
    trend: 'STABLE',
    location: 'Level 2 Data Center',
    department: 'Information Technology',
    backupBatteryMinutes: 30,
    patientImpact: 'EHR health records, diagnostic imaging archive'
  },
  {
    id: 'water',
    name: 'Water Treatment & Pumps',
    category: 'LIFE_SUPPORT',
    currentDemand: 7.0,
    allocatedPower: 6.0,
    minimumPower: 4.0,
    maximumPower: 9.0,
    priority: 'HIGH',
    urgency: 'NORMAL',
    status: 'STABLE',
    criticality: 85,
    efficiency: 0.89,
    trend: 'STABLE',
    location: 'Utility Sub-level 1',
    department: 'Sanitation & Water',
    backupBatteryMinutes: 0,
    patientImpact: 'Sterilization steam, dialysis water filtration, fire hydrants'
  },
  {
    id: 'charging',
    name: 'EV & Device Charging Stations',
    category: 'NON_ESSENTIAL',
    currentDemand: 8.0,
    allocatedPower: 1.0,
    minimumPower: 1.0,
    maximumPower: 12.0,
    priority: 'LOW',
    urgency: 'LOW',
    status: 'THROTTLED',
    criticality: 30,
    efficiency: 0.90,
    trend: 'REDUCED',
    location: 'Parking Bay & Public Hub',
    department: 'Ancillary Services',
    backupBatteryMinutes: 0,
    patientImpact: 'Non-emergency staff phones, civilian EV transit'
  },
  {
    id: 'emergency_support',
    name: 'Emergency Support Systems',
    category: 'CRITICAL_SAFETY',
    currentDemand: 4.0,
    allocatedPower: 4.0,
    minimumPower: 3.0,
    maximumPower: 6.0,
    priority: 'CRITICAL',
    urgency: 'NORMAL',
    status: 'OPTIMAL',
    criticality: 95,
    efficiency: 0.97,
    trend: 'STABLE',
    location: 'Security & Fire Command',
    department: 'Life Safety Control',
    backupBatteryMinutes: 120,
    patientImpact: 'Fire suppression pumps, negative pressure quarantine valves'
  }
];

export const initialFacilityConfig = {
  facilityName: 'Saint Jude Regional Emergency Command Facility',
  totalCapacityKw: 60.0,
  availablePowerKw: 48.0,
  emergencyReservePercent: 15.0, // 15% reserved for buffer/surges
  optimizationMode: 'BALANCED', // BALANCED | CRITICAL-FIRST | ENERGY-SAVING | MEDICAL-FIRST
  simulationSpeed: 1, // 1x
  manualOverrideActive: false,
  alertThresholdPercent: 90.0,
};

export const initialDecisionHistory = [
  {
    id: 'dec-init-1',
    timestamp: new Date(Date.now() - 18 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    trigger: 'System Initialization',
    scenario: 'Normal Operation',
    changes: [
      { system: 'Charging Stations', delta: -7.0, from: 8.0, to: 1.0, unit: 'kW' },
      { system: 'Cooling / HVAC', delta: -3.0, from: 12.0, to: 9.0, unit: 'kW' },
      { system: 'Medical Equipment', delta: 0.0, from: 14.0, to: 14.0, unit: 'kW' }
    ],
    reason: 'Initial load balancing aligned available generation (48 kW) with critical demands while reserving 15% emergency buffer.',
    impact: 'Protected 100% of Medical and Emergency Support loads with zero overload risk.',
    riskBefore: 'HIGH',
    riskAfter: 'LOW',
    confidence: 96
  }
];

export const initialAlerts = [
  {
    id: 'alert-1',
    level: 'INFO',
    timestamp: 'Just now',
    title: 'AI Optimizer Operational',
    message: 'Dynamic allocation active under BALANCED strategy. Emergency reserve target maintained at 15%.',
    systemId: 'optimizer',
    isRead: false
  },
  {
    id: 'alert-2',
    level: 'WARNING',
    timestamp: '4m ago',
    title: 'Charging Stations Throttled',
    message: 'Non-essential charging restricted to 1.0 kW base to preserve emergency buffer for Medical & Comms.',
    systemId: 'charging',
    isRead: false
  }
];
