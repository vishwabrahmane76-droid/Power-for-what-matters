export type UrgencyLevel = 'LOW' | 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AllocationStatus = 'OPTIMAL' | 'THROTTLED' | 'BOOSTED' | 'DEFICIT_CRITICAL' | 'MANUAL_OVERRIDE';
export type OptimizationMode = 'BALANCED' | 'CRITICAL-FIRST' | 'ENERGY-SAVING' | 'MEDICAL-FIRST';

export interface SystemItem {
  id: string;
  name: string;
  category: string;
  currentDemand: number;
  allocatedPower: number;
  minimumPower: number;
  maximumPower: number;
  priority: PriorityLevel;
  urgency: UrgencyLevel;
  status: AllocationStatus;
  criticality: number;
  efficiency: number;
  trend: 'STABLE' | 'RISING' | 'FALLING' | 'REDUCED' | 'BOOSTED';
  location: string;
  department: string;
  backupBatteryMinutes: number;
  patientImpact: string;
  delta: number;
  priorityScore?: number;
}

export interface PowerSource {
  id: string;
  name: string;
  type: 'GRID' | 'GENERATOR' | 'SOLAR' | 'BATTERY';
  currentOutput: number;
  maximumOutput: number;
  status: 'ONLINE' | 'STANDBY' | 'DISCHARGING' | 'FAULT' | 'OFFLINE' | 'CRITICAL';
  availability: number;
  efficiency: number;
  costPerKwh?: number;
  carbonGPerKwh?: number;
  fuelHoursRemaining?: number;
  chargePercentage?: number;
  irradianceWsqm?: number;
  description: string;
}

export interface FacilityConfig {
  facilityName: string;
  totalCapacityKw: number;
  availablePowerKw: number;
  emergencyReservePercent: number;
  optimizationMode: OptimizationMode;
  simulationSpeed: number;
  manualOverrideActive: boolean;
  alertThresholdPercent: number;
}

export interface KPIs {
  availablePowerKw: number;
  totalCapacityKw: number;
  currentConsumptionKw: number;
  emergencyReserveKw: number;
  emergencyReservePercent: number;
  systemsOnlineCount: number;
  totalSystemsCount: number;
  optimizationEfficiency: number;
  currentRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  batterySoc: number;
  generatorFuelHours: number;
}

export interface DecisionFactor {
  name: string;
  score: number;
  status: string;
}

export interface AIDecisionExplanation {
  why: string;
  whatChanged: string;
  whatReduced: string;
  whatIncreased: string;
  riskAvoided: string;
  timestamp: string;
  factorList: DecisionFactor[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  action: string;
  reason: string;
  expectedImpact: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  canApply: boolean;
  deltaPayload?: Record<string, number>;
}

export interface AIConfidence {
  overallPercentage: number;
  factors: {
    dataQuality: number;
    predictionConfidence: number;
    systemStability: number;
  };
  message: string;
}

export interface DecisionChange {
  system: string;
  delta: number;
  from: number;
  to: number;
  unit: string;
}

export interface DecisionHistoryEntry {
  id: string;
  timestamp: string;
  trigger: string;
  scenario: string;
  changes: DecisionChange[];
  reason: string;
  impact: string;
  riskBefore: string;
  riskAfter: string;
  confidence: number;
}

export interface AlertItem {
  id: string;
  level: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  title: string;
  message: string;
  systemId: string;
  isRead: boolean;
}

export interface ForecastPoint {
  time: string;
  currentDemand: number;
  predictedDemand: number;
  availablePower: number;
  batteryLevel: number;
  solarGen: number;
}

export interface ForecastData {
  points: ForecastPoint[];
  statements: string[];
  timeHorizon: string;
}

export interface RiskItem {
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  probability: string;
  impact: string;
  recommendedAction: string;
}

export interface SystemState {
  facilityConfig: FacilityConfig;
  powerSources: PowerSource[];
  systems: SystemItem[];
  activeScenario: string;
  isSimulating: boolean;
  alerts: AlertItem[];
  history: DecisionHistoryEntry[];
  latestDecision: AIDecisionExplanation;
  recommendation: AIRecommendation;
  confidence: AIConfidence;
  resilienceScore: number;
  kpis: KPIs;
  forecast: ForecastData;
  riskMatrix: RiskItem[];
}
