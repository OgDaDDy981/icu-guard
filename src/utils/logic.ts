import type { VitalsState, BooleanPropositions, SystemStatus } from '../types';
import { THRESHOLDS } from './constants';

export function evaluatePropositions(vitals: VitalsState): BooleanPropositions {
  const isSensorFault = !vitals.sensorLeadAttached || vitals.sensorQuality < THRESHOLDS.SENSOR_QUALITY_MIN;

  // When sensor is disconnected/faulty, propositions should not be falsely evaluated as normal 0
  const A = !isSensorFault && vitals.oxygen < THRESHOLDS.OXYGEN_CRITICAL_MIN;
  const B = !isSensorFault && (vitals.heartRate < THRESHOLDS.HEART_RATE_CRITICAL_MIN || vitals.heartRate > THRESHOLDS.HEART_RATE_CRITICAL_MAX);
  const C = !isSensorFault && vitals.temperature > THRESHOLDS.TEMP_CRITICAL_MAX;

  const E_Combined = A && B;
  const W_Warning = A || B || C;
  const F_FailSafe = !(A && B);

  return {
    A,
    B,
    C,
    S_Fault: isSensorFault,
    E_Combined,
    W_Warning,
    F_FailSafe,
  };
}

export function determineSystemStatus(_vitals: VitalsState, props: BooleanPropositions): SystemStatus {
  if (props.S_Fault) {
    return 'SENSOR_FAULT';
  }
  if (props.E_Combined) {
    return 'CRITICAL_EMERGENCY';
  }
  if (props.W_Warning) {
    return 'WARNING';
  }
  return 'NORMAL';
}

export function formatBinary(val: boolean): string {
  return val ? '1' : '0';
}

export function formatBoolean(val: boolean): string {
  return val ? 'TRUE' : 'FALSE';
}
