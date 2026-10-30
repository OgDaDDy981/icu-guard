import React, { useState } from 'react';
import type { VitalsState, BooleanPropositions, SystemStatus } from '../../types';
import { WaveformCanvas } from './WaveformCanvas';
import { THRESHOLDS } from '../../utils/constants';
import { 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  Gauge, 
  Sliders, 
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Zap
} from 'lucide-react';

interface PatientMonitorProps {
  vitals: VitalsState;
  setVitals: React.Dispatch<React.SetStateAction<VitalsState>>;
  propositions: BooleanPropositions;
  systemStatus: SystemStatus;
  soundEnabled: boolean;
  onRevealMath: () => void;
}

export const PatientMonitor: React.FC<PatientMonitorProps> = ({
  vitals,
  setVitals,
  propositions,
  systemStatus,
  soundEnabled,
  onRevealMath,
}) => {
  const [showManualControls, setShowManualControls] = useState<boolean>(false);

  // Status color calculations
  const getHrStatus = () => {
    if (vitals.heartRate === 0 && !vitals.sensorLeadAttached) return { label: 'LEAD OFF', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    if (vitals.heartRate > THRESHOLDS.HEART_RATE_CRITICAL_MAX) return { label: 'TACHYCARDIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    if (vitals.heartRate < THRESHOLDS.HEART_RATE_CRITICAL_MIN) return { label: 'BRADYCARDIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    return { label: 'NORMAL SINUS', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-950/10' };
  };

  const getSpo2Status = () => {
    if (vitals.oxygen === 0 && !vitals.sensorLeadAttached) return { label: 'DISCONNECTED', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    if (vitals.oxygen < THRESHOLDS.OXYGEN_CRITICAL_MIN) return { label: 'CRITICAL HYPOXIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    if (vitals.oxygen < 94) return { label: 'LOW WARNING', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    return { label: 'OPTIMAL SAT', color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-950/10' };
  };

  const getTempStatus = () => {
    if (vitals.temperature > THRESHOLDS.TEMP_CRITICAL_MAX) return { label: 'HYPERPYREXIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    if (vitals.temperature > 37.8) return { label: 'FEVER', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    return { label: 'NORMOTHERMIC', color: 'text-teal-400', border: 'border-teal-500/20', bg: 'bg-teal-950/10' };
  };

  const getBpStatus = () => {
    if (vitals.bloodPressureSystolic > THRESHOLDS.BP_SYSTOLIC_CRITICAL_MAX) return { label: 'HYPERTENSION', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    if (vitals.bloodPressureSystolic < THRESHOLDS.BP_SYSTOLIC_CRITICAL_MIN) return { label: 'HYPOTENSION', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    return { label: 'NORMOTENSIVE', color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-950/10' };
  };

  const getRespStatus = () => {
    if (vitals.respiratoryRate > THRESHOLDS.RESPIRATORY_CRITICAL_MAX) return { label: 'TACHYPNEA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    if (vitals.respiratoryRate < THRESHOLDS.RESPIRATORY_CRITICAL_MIN) return { label: 'BRADYPNEA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    return { label: 'EUPNEA (NORMAL)', color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-950/10' };
  };

  const hrStatus = getHrStatus();
  const spo2Status = getSpo2Status();
  const tempStatus = getTempStatus();
  const bpStatus = getBpStatus();
  const respStatus = getRespStatus();

  return (
    <section id="patient-monitor" className="relative w-full py-10 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Patient Header Banner */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6 relative overflow-hidden border border-cyan-500/20">
        <div className="absolute top-0 right-0 w-80 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#030712] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-display font-bold text-lg sm:text-xl text-white tracking-wide">
                  PATIENT ID: #ICU-8820-DX
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono font-medium">
                  BED 04 • NEURO-TRAUMA ICU
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  AGE: 46 M • ADMIT: 14h 22m
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono flex items-center gap-2">
                <span>TELEMETRY CHANNEL 02</span>
                <span>•</span>
                <span className="text-cyan-400">SAMPLE FREQ: 500 Hz</span>
                <span>•</span>
                <span className="text-amber-400/90 italic">Demonstration Thresholds (Non-clinical)</span>
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowManualControls(!showManualControls)}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                showManualControls
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              {showManualControls ? 'HIDE LIVE SLIDERS' : 'MANUAL SENSOR SLIDERS'}
            </button>

            {/* Signature Feature Button */}
            <button
              onClick={onRevealMath}
              className="px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              REVEAL THE MATH BEHIND
            </button>
          </div>
        </div>

        {/* Manual Sensor Slider Drawer */}
        {showManualControls && (
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-300">
            {/* Heart Rate Slider */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> HR Slider: {vitals.heartRate} BPM
                </span>
                <span className="text-slate-500">Limits: 50 - 120</span>
              </div>
              <input
                type="range"
                min="35"
                max="180"
                value={vitals.heartRate}
                onChange={(e) => setVitals((prev) => ({ ...prev, heartRate: Number(e.target.value) }))}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>35 (Brady)</span>
                <span>75 (Normal)</span>
                <span>180 (Tachy)</span>
              </div>
            </div>

            {/* Oxygen SpO2 Slider */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" /> SpO₂ Slider: {vitals.oxygen}%
                </span>
                <span className="text-slate-500">Threshold: &lt; 90%</span>
              </div>
              <input
                type="range"
                min="65"
                max="100"
                value={vitals.oxygen}
                onChange={(e) => setVitals((prev) => ({ ...prev, oxygen: Number(e.target.value) }))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>65% (Critical)</span>
                <span>90% (Threshold)</span>
                <span>100% (Normal)</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-teal-400 font-semibold flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5" /> Temp Slider: {vitals.temperature}°C
                </span>
                <span className="text-slate-500">Limit: &gt; 39.0°C</span>
              </div>
              <input
                type="range"
                min="35.0"
                max="41.5"
                step="0.1"
                value={vitals.temperature}
                onChange={(e) => setVitals((prev) => ({ ...prev, temperature: Number(e.target.value) }))}
                className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>35.0°C (Hypo)</span>
                <span>37.0°C (Normal)</span>
                <span>41.5°C (Fever)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Telemetry Grid: 5 Major Readings + Real-time Oscilloscope Waveforms */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        {/* Left Column: Waveforms Oscilloscope (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Waveform 1: ECG Lead II */}
          <div className="glass-panel rounded-xl p-3 border border-cyan-500/30">
            <div className="flex items-center justify-between px-2 pb-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                <span className="font-mono font-bold text-cyan-300">ECG MONITOR (LEAD II)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                PROPOSITION B: {propositions.B ? <strong className="text-rose-400">TRUE (1)</strong> : <span className="text-emerald-400">FALSE (0)</span>}
              </span>
            </div>
            <WaveformCanvas
              type="ecg"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              color="#00f2fe"
              glowColor="rgba(0, 242, 254, 0.45)"
              label="LEAD II • ECG"
              sublabel="R-R Rhythm analysis"
              height={105}
              isFault={!vitals.sensorLeadAttached}
              soundEnabled={soundEnabled}
            />
          </div>

          {/* Waveform 2: Plethysmogram (SpO2) */}
          <div className="glass-panel rounded-xl p-3 border border-teal-500/30">
            <div className="flex items-center justify-between px-2 pb-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-sm shadow-teal-400/50" />
                <span className="font-mono font-bold text-teal-300">PHOTOPLETHYSMOGRAPHY (SpO₂)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                PROPOSITION A: {propositions.A ? <strong className="text-rose-400">TRUE (1)</strong> : <span className="text-emerald-400">FALSE (0)</span>}
              </span>
            </div>
            <WaveformCanvas
              type="pleth"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              color="#00d2be"
              glowColor="rgba(0, 210, 190, 0.45)"
              label="PLETH • PPG"
              sublabel="IR Absorptive Wave"
              height={85}
              isFault={!vitals.sensorLeadAttached}
              soundEnabled={false}
            />
          </div>

          {/* Waveform 3: Capnography / Arterial Pulse Wave */}
          <div className="glass-panel rounded-xl p-3 border border-slate-700/60">
            <div className="flex items-center justify-between px-2 pb-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
                <span className="font-mono font-bold text-amber-300">ARTERIAL PRESSURE LINE (ART)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                PULSE PRESSURE: {vitals.bloodPressureSystolic - vitals.bloodPressureDiastolic} mmHg
              </span>
            </div>
            <WaveformCanvas
              type="abp"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              color="#f59e0b"
              glowColor="rgba(245, 158, 11, 0.4)"
              label="ABP • RADIAL"
              sublabel="Dicrotic Notch Phase"
              height={75}
              isFault={!vitals.sensorLeadAttached}
              soundEnabled={false}
            />
          </div>
        </div>

        {/* Right Column: 5 Major Telemetry Readings (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
          {/* Card 1: Heart Rate (BPM) */}
          <div className={`p-4 rounded-xl border transition-all ${hrStatus.bg} ${hrStatus.border} relative overflow-hidden group`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Heart className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">HEART RATE</h4>
                  <span className={`text-[11px] font-mono font-bold ${hrStatus.color}`}>
                    {hrStatus.label}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-500">
                <span>LIMITS</span>
                <div>50 - 120</div>
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {vitals.sensorLeadAttached ? vitals.heartRate : '--'}
                </span>
                <span className="font-mono text-xs text-slate-400 font-semibold">BPM</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
                  PROPOSITION B
                </span>
                <div className="font-mono text-xs font-bold mt-1">
                  {propositions.B ? (
                    <span className="text-rose-400 text-glow-coral">B = TRUE (1)</span>
                  ) : (
                    <span className="text-emerald-400">B = FALSE (0)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Oxygen Saturation (SpO2) */}
          <div className={`p-4 rounded-xl border transition-all ${spo2Status.bg} ${spo2Status.border} relative overflow-hidden group`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">OXYGEN SATURATION</h4>
                  <span className={`text-[11px] font-mono font-bold ${spo2Status.color}`}>
                    {spo2Status.label}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-500">
                <span>LIMIT</span>
                <div>&ge; 90%</div>
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {vitals.sensorLeadAttached ? vitals.oxygen : '--'}
                </span>
                <span className="font-mono text-xs text-slate-400 font-semibold">% SpO₂</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
                  PROPOSITION A
                </span>
                <div className="font-mono text-xs font-bold mt-1">
                  {propositions.A ? (
                    <span className="text-rose-400 text-glow-coral">A = TRUE (1)</span>
                  ) : (
                    <span className="text-emerald-400">A = FALSE (0)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Body Temperature */}
          <div className={`p-4 rounded-xl border transition-all ${tempStatus.bg} ${tempStatus.border} relative overflow-hidden group`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">CORE TEMPERATURE</h4>
                  <span className={`text-[11px] font-mono font-bold ${tempStatus.color}`}>
                    {tempStatus.label}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-500">
                <span>LIMIT</span>
                <div>&le; 39.0°C</div>
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {vitals.temperature.toFixed(1)}
                </span>
                <span className="font-mono text-xs text-slate-400 font-semibold">°C ({(vitals.temperature * 1.8 + 32).toFixed(1)}°F)</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300">
                  PROPOSITION C
                </span>
                <div className="font-mono text-xs font-bold mt-1">
                  {propositions.C ? (
                    <span className="text-rose-400">C = TRUE (1)</span>
                  ) : (
                    <span className="text-emerald-400">C = FALSE (0)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cards 4 & 5: Blood Pressure & Respiratory Rate (compact 2-col on desktop) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Card 4: Blood Pressure */}
            <div className={`p-3.5 rounded-xl border transition-all ${bpStatus.bg} ${bpStatus.border}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">NIBP / ART</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold text-white">
                  {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}
                </span>
                <span className="font-mono text-[10px] text-slate-500">mmHg</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-slate-400">
                MAP: {Math.round((vitals.bloodPressureSystolic + 2 * vitals.bloodPressureDiastolic) / 3)} mmHg
              </div>
            </div>

            {/* Card 5: Respiratory Rate */}
            <div className={`p-3.5 rounded-xl border transition-all ${respStatus.bg} ${respStatus.border}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">RESP RATE</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold text-white">
                  {vitals.respiratoryRate}
                </span>
                <span className="font-mono text-[10px] text-slate-500">RPM</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-slate-400">
                Range: 12-20
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Health and Telemetry Status Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">ELECTRODE IMPEDANCE:</span>
            {vitals.sensorLeadAttached ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 2.1 kΩ (OPTIMAL)
              </span>
            ) : (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" /> OPEN CIRCUIT / LEAD OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">SIGNAL INTEGRITY:</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden inline-flex">
              <div
                className={`h-full rounded-full transition-all ${
                  vitals.sensorQuality > 70
                    ? 'bg-emerald-400'
                    : vitals.sensorQuality > 40
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${vitals.sensorQuality}%` }}
              />
            </div>
            <span className="text-slate-300 font-bold">{vitals.sensorQuality}%</span>
          </div>
        </div>

        {/* Logic Engine State Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">EVALUATION:</span>
          {systemStatus === 'CRITICAL_EMERGENCY' ? (
            <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse flex items-center gap-1">
              <AlertOctagon className="w-3 h-3 text-rose-400" /> E = A ∧ B = TRUE
            </span>
          ) : systemStatus === 'WARNING' ? (
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" /> W = A ∨ B = TRUE
            </span>
          ) : systemStatus === 'SENSOR_FAULT' ? (
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              FAULT STATE (DISCRETE INTERLOCK)
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              HOMEOSTASIS (E = 0)
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
