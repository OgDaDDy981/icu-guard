import type { VitalsState, BooleanPropositions, SystemStatus, SensorChannelsState } from '../types';
import { THRESHOLDS } from './constants';

export function evaluatePropositions(
  vitals: VitalsState,
  sensors?: SensorChannelsState
): BooleanPropositions {
  // If sensor channels are supplied, evaluate individual channel health
  const ecgAttached = sensors ? sensors.ecg.leadAttached && sensors.ecg.signalQuality >= THRESHOLDS.SENSOR_QUALITY_MIN : vitals.sensorLeadAttached;
  const spo2Attached = sensors ? sensors.spo2.leadAttached && sensors.spo2.signalQuality >= THRESHOLDS.SENSOR_QUALITY_MIN : vitals.sensorLeadAttached;
  const tempAttached = sensors ? sensors.temp.leadAttached : vitals.sensorLeadAttached;

  const anySensorFault = sensors
    ? !sensors.ecg.leadAttached ||
      !sensors.spo2.leadAttached ||
      sensors.ecg.signalQuality < THRESHOLDS.SENSOR_QUALITY_MIN ||
      sensors.spo2.signalQuality < THRESHOLDS.SENSOR_QUALITY_MIN
    : !vitals.sensorLeadAttached || vitals.sensorQuality < THRESHOLDS.SENSOR_QUALITY_MIN;

  // When a specific sensor is disconnected or faulty, its proposition is held false/inhibited from false-positive
  const A = spo2Attached && vitals.oxygen < THRESHOLDS.OXYGEN_CRITICAL_MIN;
  const B = ecgAttached && (vitals.heartRate < THRESHOLDS.HEART_RATE_CRITICAL_MIN || vitals.heartRate > THRESHOLDS.HEART_RATE_CRITICAL_MAX);
  const C = tempAttached && vitals.temperature > THRESHOLDS.TEMP_CRITICAL_MAX;

  const E_Combined = A && B;
  const W_Warning = A || B || C;
  const F_FailSafe = !(A && B);

  return {
    A,
    B,
    C,
    S_Fault: anySensorFault,
    E_Combined,
    W_Warning,
    F_FailSafe,
  };
}

export function determineSystemStatus(
  _vitals: VitalsState,
  props: BooleanPropositions
): SystemStatus {
  // Conjunction emergency takes precedence if both active
  if (props.E_Combined) {
    return 'CRITICAL_EMERGENCY';
  }
  if (props.S_Fault) {
    return 'SENSOR_FAULT';
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
