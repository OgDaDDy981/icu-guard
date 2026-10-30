// Type definitions for ICU GUARD - Discrete Mathematics Patient Monitoring Simulation

export type SystemStatus = 'NORMAL' | 'WARNING' | 'CRITICAL_EMERGENCY' | 'SENSOR_FAULT';

export type SensorChannelId = 'ecg' | 'spo2' | 'temp' | 'nibp' | 'resp';

export interface SensorChannelStatus {
  id: SensorChannelId;
  name: string;
  leadAttached: boolean;
  signalQuality: number; // 0 - 100%
  impedanceKOhms?: number;
  label: string;
}

export interface SensorChannelsState {
  ecg: SensorChannelStatus;
  spo2: SensorChannelStatus;
  temp: SensorChannelStatus;
  nibp: SensorChannelStatus;
  resp: SensorChannelStatus;
}

export interface VitalsState {
  heartRate: number; // BPM (Normal: 60-100, Abnormal: <50 or >120)
  oxygen: number; // SpO2 % (Normal: 95-100, Critical: <90)
  temperature: number; // Celsius (Normal: 36.5-37.5, High: >39.0)
  bloodPressureSystolic: number; // mmHg (Normal: 100-130)
  bloodPressureDiastolic: number; // mmHg (Normal: 65-85)
  respiratoryRate: number; // Breaths/min (Normal: 12-20, Critical: <8 or >28)
  sensorQuality: number; // Aggregate sensor quality %
  sensorLeadAttached: boolean; // Aggregate status for backwards-compatibility
}

export interface BooleanPropositions {
  A: boolean; // Oxygen is critically low (SpO2 < 90%)
  B: boolean; // Heart rate is critically abnormal (HR < 50 or HR > 120)
  C: boolean; // Temperature is critically high (Temp > 39.0°C)
  S_Fault: boolean; // Sensor failure (!sensorLeadAttached or sensorQuality < 40)
  
  // Logical outputs
  E_Combined: boolean; // A ∧ B (Combined Emergency Alert)
  W_Warning: boolean; // A ∨ B ∨ C (General Warning)
  F_FailSafe: boolean; // ¬(A ∧ B) (Normal/Controllable Protocol)
}

export interface AlarmEvent {
  id: string;
  timestamp: string; // e.g., "14:22:04"
  relativeSec: number;
  severity: 'CRITICAL' | 'WARNING' | 'TECHNICAL' | 'ADVISORY';
  parameter: string;
  title: string;
  condition: string;
  propositionTriggered?: string;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: string;
}

export interface ScenarioKeyframe {
  timeSec: number;
  label: string;
  vitals: Partial<VitalsState>;
  sensors?: Partial<Record<SensorChannelId, Partial<SensorChannelStatus>>>;
  narrative: string;
  alarmEvent?: {
    severity: 'CRITICAL' | 'WARNING' | 'TECHNICAL' | 'ADVISORY';
    parameter: string;
    title: string;
    condition: string;
    propositionTriggered?: string;
  };
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  badge: string;
  category: 'Normal' | 'Warning' | 'Emergency' | 'System' | 'Recovery';
  description: string;
  clinicalContext: string;
  targetVitals: Partial<VitalsState>;
  targetSensorFault?: boolean;
  targetSensors?: Partial<Record<SensorChannelId, Partial<SensorChannelStatus>>>;
  expectedA: boolean;
  expectedB: boolean;
  expectedE: boolean;
  expectedStatus: SystemStatus;
  narrativeSteps: string[];
  keyframes: ScenarioKeyframe[];
  durationSec: number;
}

export type MathActId = 'act1' | 'act2' | 'act3' | 'act4' | 'act5' | 'act6';

export interface MathAct {
  id: MathActId;
  actNumber: number;
  title: string;
  subtitle: string;
  symbol: string;
  formula: string;
  description: string;
  details: string[];
  visualType: 'sensor' | 'heart' | 'gate' | 'truth_table' | 'conclusion' | 'academic';
}

export interface BedPatient {
  id: string;
  bedNumber: number;
  name: string;
  age: number;
  diagnosis: string;
  heartRate: number;
  oxygen: number;
  temperature: number;
  bloodPressureSystolic: number;
  respiratoryRate: number;
  isCritical: boolean; // P(x)
}
