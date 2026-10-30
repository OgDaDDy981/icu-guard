import React, { useState } from 'react';
import type { VitalsState, BooleanPropositions, SystemStatus, SensorChannelsState, SensorChannelId } from '../../types';
import { WaveformCanvas } from './WaveformCanvas';
import { THRESHOLDS } from '../../utils/constants';
import { soundEngine } from '../../utils/audio';
import { 
  Heart, 
  Wind, 
  Thermometer, 
  Activity, 
  Gauge, 
  Sliders, 
  Zap, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Power,
  Cpu
} from 'lucide-react';

interface PatientMonitorProps {
  vitals: VitalsState;
  setVitals: React.Dispatch<React.SetStateAction<VitalsState>>;
  sensors: SensorChannelsState;
  onToggleSensor: (channelId: SensorChannelId) => void;
  propositions: BooleanPropositions;
  systemStatus: SystemStatus;
  soundEnabled: boolean;
  onRevealMath: () => void;
}

export const PatientMonitor: React.FC<PatientMonitorProps> = ({
  vitals,
  setVitals,
  sensors,
  onToggleSensor,
  propositions,
  systemStatus,
  soundEnabled,
  onRevealMath,
}) => {
  const [showManualControls, setShowManualControls] = useState<boolean>(false);

  // Status calculations
  const getHrStatus = () => {
    if (!sensors.ecg.leadAttached) {
      return { label: 'LEAD OFF', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.heartRate > THRESHOLDS.HEART_RATE_CRITICAL_MAX) {
      return { label: 'TACHYCARDIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    }
    if (vitals.heartRate < THRESHOLDS.HEART_RATE_CRITICAL_MIN) {
      return { label: 'BRADYCARDIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    }
    return { label: 'NORMAL SINUS', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/15' };
  };

  const getSpo2Status = () => {
    if (!sensors.spo2.leadAttached) {
      return { label: 'PROBE DETACHED', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.oxygen < THRESHOLDS.OXYGEN_CRITICAL_MIN) {
      return { label: 'CRITICAL HYPOXIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    }
    if (vitals.oxygen < 94) {
      return { label: 'LOW WARNING', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    return { label: 'OPTIMAL SAT', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-950/15' };
  };

  const getTempStatus = () => {
    if (!sensors.temp.leadAttached) {
      return { label: 'PROBE OFF', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.temperature > THRESHOLDS.TEMP_CRITICAL_MAX) {
      return { label: 'HYPERPYREXIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    }
    if (vitals.temperature > 37.8) {
      return { label: 'ELEVATED (FEVER)', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    return { label: 'NORMOTHERMIC', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/15' };
  };

  const getBpStatus = () => {
    if (!sensors.nibp.leadAttached) {
      return { label: 'CUFF OFF', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.bloodPressureSystolic > THRESHOLDS.BP_SYSTOLIC_CRITICAL_MAX) {
      return { label: 'HYPERTENSION', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.bloodPressureSystolic < THRESHOLDS.BP_SYSTOLIC_CRITICAL_MIN) {
      return { label: 'HYPOTENSION', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    }
    return { label: 'NORMOTENSIVE', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-950/15' };
  };

  const getRespStatus = () => {
    if (!sensors.resp.leadAttached) {
      return { label: 'CANNULA OFF', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.respiratoryRate > THRESHOLDS.RESPIRATORY_CRITICAL_MAX) {
      return { label: 'TACHYPNEA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    }
    if (vitals.respiratoryRate < THRESHOLDS.RESPIRATORY_CRITICAL_MIN) {
      return { label: 'BRADYPNEA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/30' };
    }
    return { label: 'EUPNEA (NORMAL)', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/15' };
  };

  const hrStatus = getHrStatus();
  const spo2Status = getSpo2Status();
  const tempStatus = getTempStatus();
  const bpStatus = getBpStatus();
  const respStatus = getRespStatus();

  const meanArterialPressure = Math.round(
    (vitals.bloodPressureSystolic + 2 * vitals.bloodPressureDiastolic) / 3
  );

  return (
    <section id="patient-monitor" className="relative w-full py-12 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Patient Information & Clinical Header */}
      <div className="rounded-2xl bg-[#0b0f19] border border-slate-800 p-5 mb-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Patient Metadata */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-blue-950/50 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0b0f19] ${
                systemStatus === 'CRITICAL_EMERGENCY'
                  ? 'bg-rose-500 animate-ping'
                  : systemStatus === 'WARNING' || systemStatus === 'SENSOR_FAULT'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-display font-extrabold text-xl text-white tracking-wide">
                  PATIENT ID: #ICU-8820-DX
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-blue-300 font-mono font-medium">
                  BED 04 • NEURO-TRAUMA
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 font-mono">
                  AGE: 46 M • INVASIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono flex items-center gap-2 flex-wrap">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 5-CHANNEL MULTI-PROBE ARRAY
                </span>
                <span>•</span>
                <span>CALIBRATION: 500 Hz REAL-TIME</span>
                <span>•</span>
                <span className="text-amber-400/90 italic">Educational Demonstration Model</span>
              </p>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                soundEngine.playGateClick();
                setShowManualControls(!showManualControls);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                showManualControls
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              {showManualControls ? 'HIDE LIVE ADJUSTERS' : 'MANUAL SENSOR ADJUSTERS'}
            </button>

            <button
              onClick={onRevealMath}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              SOLVE THE MATH
            </button>
          </div>
        </div>

        {/* Manual Sensor Drawer */}
        {showManualControls && (
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
            {/* Heart Rate Slider */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Heart Rate: {sensors.ecg.leadAttached ? `${vitals.heartRate} BPM` : 'DISCONNECTED'}
                </span>
                <span className="text-slate-500">Limits: 50 - 120</span>
              </div>
              <input
                type="range"
                min="35"
                max="180"
                disabled={!sensors.ecg.leadAttached}
                value={vitals.heartRate}
                onChange={(e) => setVitals((prev) => ({ ...prev, heartRate: Number(e.target.value) }))}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>35 (Brady)</span>
                <span>74 (Normal)</span>
                <span>180 (Tachy)</span>
              </div>
            </div>

            {/* Oxygen SpO2 Slider */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-blue-400 font-bold flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" /> SpO₂ Saturation: {sensors.spo2.leadAttached ? `${vitals.oxygen}%` : 'DISCONNECTED'}
                </span>
                <span className="text-slate-500">Threshold: &lt; 90%</span>
              </div>
              <input
                type="range"
                min="65"
                max="100"
                disabled={!sensors.spo2.leadAttached}
                value={vitals.oxygen}
                onChange={(e) => setVitals((prev) => ({ ...prev, oxygen: Number(e.target.value) }))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>65% (Critical)</span>
                <span>90% (Threshold)</span>
                <span>100% (Air)</span>
              </div>
            </div>

            {/* Core Temperature Slider */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5" /> Temperature: {vitals.temperature}°C
                </span>
                <span className="text-slate-500">Limit: &gt; 39.0°C</span>
              </div>
              <input
                type="range"
                min="35.0"
                max="41.5"
                step="0.1"
                disabled={!sensors.temp.leadAttached}
                value={vitals.temperature}
                onChange={(e) => setVitals((prev) => ({ ...prev, temperature: Number(e.target.value) }))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>35.0°C</span>
                <span>36.8°C</span>
                <span>41.5°C</span>
              </div>
            </div>

            {/* Systolic Blood Pressure */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5" /> Systolic BP: {vitals.bloodPressureSystolic} mmHg
                </span>
                <span className="text-slate-500">Range: 90 - 160</span>
              </div>
              <input
                type="range"
                min="70"
                max="190"
                disabled={!sensors.nibp.leadAttached}
                value={vitals.bloodPressureSystolic}
                onChange={(e) => setVitals((prev) => ({ ...prev, bloodPressureSystolic: Number(e.target.value) }))}
                className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>70 (Hypo)</span>
                <span>120 (Norm)</span>
                <span>190 (Hyper)</span>
              </div>
            </div>

            {/* Respiratory Rate Slider */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-teal-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Respiratory Rate: {vitals.respiratoryRate} RPM
                </span>
                <span className="text-slate-500">Normal: 12 - 20</span>
              </div>
              <input
                type="range"
                min="6"
                max="45"
                disabled={!sensors.resp.leadAttached}
                value={vitals.respiratoryRate}
                onChange={(e) => setVitals((prev) => ({ ...prev, respiratoryRate: Number(e.target.value) }))}
                className="w-full accent-teal-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>6 (Bradypnea)</span>
                <span>16 (Normal)</span>
                <span>45 (Tachypnea)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INDEPENDENT SENSOR HARNESS STATUS DOCK */}
      <div className="rounded-2xl bg-[#090d16] border border-slate-800/90 p-4 mb-6">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-400" />
            <span className="text-white font-bold tracking-wide">INDEPENDENT SENSOR CHANNEL INTERFACE</span>
            <span className="text-slate-500 hidden sm:inline">• Test Channel Detachment Independently</span>
          </div>
          <span className="text-slate-400 text-[11px]">
            {sensors.ecg.leadAttached && sensors.spo2.leadAttached ? (
              <span className="text-emerald-400 font-bold">ALL CHANNELS SYNCHRONIZED</span>
            ) : (
              <span className="text-amber-400 font-bold animate-pulse">FAULT INGESTION ACTIVE</span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {(Object.keys(sensors) as SensorChannelId[]).map((channelId) => {
            const ch = sensors[channelId];
            const isOnline = ch.leadAttached;

            return (
              <div
                key={channelId}
                className={`p-3 rounded-xl border transition-all ${
                  isOnline
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    : 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                    {ch.label}
                  </span>
                  <button
                    onClick={() => {
                      soundEngine.playGateClick();
                      onToggleSensor(channelId);
                    }}
                    className={`p-1 rounded-md text-[10px] font-mono transition-colors flex items-center gap-1 ${
                      isOnline
                        ? 'bg-slate-800 text-slate-300 hover:bg-rose-900/50 hover:text-rose-300'
                        : 'bg-amber-500 text-slate-950 font-bold'
                    }`}
                    title={isOnline ? 'Simulate Disconnect' : 'Reconnect Sensor'}
                  >
                    <Power className="w-3 h-3" />
                    <span>{isOnline ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                <div className="flex items-baseline justify-between text-xs font-mono">
                  <span className={isOnline ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {isOnline ? 'ONLINE' : 'LEAD OFF'}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {isOnline ? `${ch.impedanceKOhms} kΩ` : 'OPEN'}
                  </span>
                </div>

                <div className="mt-2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isOnline ? (ch.signalQuality > 70 ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-slate-700'
                    }`}
                    style={{ width: `${isOnline ? ch.signalQuality : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Telemetry Stage: Left Oscilloscopes (7 cols) + Right Numerical Dials (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        {/* Left Column: 4 Real-time Oscilloscope Waveforms (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3.5">
          {/* Waveform 1: Lead II ECG */}
          <div className="rounded-xl bg-[#090d16] border border-slate-800 p-2.5">
            <div className="flex items-center justify-between px-2 pb-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                <span className="font-mono font-bold text-white text-[11px]">ELECTROCARDIOGRAM (LEAD II)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                PROPOSITION B: {propositions.B ? <strong className="text-rose-400">TRUE (1)</strong> : <span className="text-emerald-400">FALSE (0)</span>}
              </span>
            </div>
            <WaveformCanvas
              type="ecg"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              color="#10b981"
              glowColor="rgba(16, 185, 129, 0.4)"
              label="LEAD II • ECG"
              sublabel="R-R Rhythm Pacing"
              height={100}
              isFault={!sensors.ecg.leadAttached}
              signalQuality={sensors.ecg.signalQuality}
              soundEnabled={soundEnabled}
            />
          </div>

          {/* Waveform 2: Plethysmogram (SpO2) */}
          <div className="rounded-xl bg-[#090d16] border border-slate-800 p-2.5">
            <div className="flex items-center justify-between px-2 pb-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm" />
                <span className="font-mono font-bold text-white text-[11px]">PHOTOPLETHYSMOGRAPHY (SpO₂)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                PROPOSITION A: {propositions.A ? <strong className="text-rose-400">TRUE (1)</strong> : <span className="text-emerald-400">FALSE (0)</span>}
              </span>
            </div>
            <WaveformCanvas
              type="pleth"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              color="#38bdf8"
              glowColor="rgba(56, 189, 248, 0.4)"
              label="PLETH • PPG"
              sublabel="Optical Perfusion"
              height={85}
              isFault={!sensors.spo2.leadAttached}
              signalQuality={sensors.spo2.signalQuality}
              soundEnabled={false}
            />
          </div>

          {/* Waveform 3: Arterial Blood Pressure Line */}
          <div className="rounded-xl bg-[#090d16] border border-slate-800 p-2.5">
            <div className="flex items-center justify-between px-2 pb-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                <span className="font-mono font-bold text-white text-[11px]">ARTERIAL LINE (ART PULSE)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                PULSE PRESSURE: {vitals.bloodPressureSystolic - vitals.bloodPressureDiastolic} mmHg
              </span>
            </div>
            <WaveformCanvas
              type="abp"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              bloodPressureSystolic={vitals.bloodPressureSystolic}
              bloodPressureDiastolic={vitals.bloodPressureDiastolic}
              color="#f59e0b"
              glowColor="rgba(245, 158, 11, 0.35)"
              label="ABP • RADIAL"
              sublabel="Dicrotic Notch Trace"
              height={75}
              isFault={!sensors.nibp.leadAttached}
              signalQuality={sensors.nibp.signalQuality}
              soundEnabled={false}
            />
          </div>

          {/* Waveform 4: Respiration / Capnography */}
          <div className="rounded-xl bg-[#090d16] border border-slate-800 p-2.5">
            <div className="flex items-center justify-between px-2 pb-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-sm" />
                <span className="font-mono font-bold text-white text-[11px]">CAPNOGRAPHY (RESP CO₂)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                RATE: {vitals.respiratoryRate} RPM
              </span>
            </div>
            <WaveformCanvas
              type="resp"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              respiratoryRate={vitals.respiratoryRate}
              color="#2dd4bf"
              glowColor="rgba(45, 212, 191, 0.35)"
              label="RESP • CO₂"
              sublabel="Alveolar Ventilation"
              height={75}
              isFault={!sensors.resp.leadAttached}
              signalQuality={sensors.resp.signalQuality}
              soundEnabled={false}
            />
          </div>
        </div>

        {/* Right Column: 5 Major Physiological Readouts (5 cols) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
          {/* Reading 1: Heart Rate (BPM) */}
          <div className={`p-4 rounded-xl border transition-all ${hrStatus.bg} ${hrStatus.border} relative overflow-hidden group`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
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
                  {sensors.ecg.leadAttached ? vitals.heartRate : '--'}
                </span>
                <span className="font-mono text-xs text-slate-400 font-semibold">BPM</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  PROPOSITION B
                </span>
                <div className="font-mono text-xs font-bold mt-1">
                  {propositions.B ? (
                    <span className="text-rose-400 font-extrabold">B = TRUE (1)</span>
                  ) : (
                    <span className="text-emerald-400">B = FALSE (0)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reading 2: Oxygen Saturation (SpO2) */}
          <div className={`p-4 rounded-xl border transition-all ${spo2Status.bg} ${spo2Status.border} relative overflow-hidden group`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
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
                  {sensors.spo2.leadAttached ? vitals.oxygen : '--'}
                </span>
                <span className="font-mono text-xs text-slate-400 font-semibold">% SpO₂</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  PROPOSITION A
                </span>
                <div className="font-mono text-xs font-bold mt-1">
                  {propositions.A ? (
                    <span className="text-rose-400 font-extrabold">A = TRUE (1)</span>
                  ) : (
                    <span className="text-emerald-400">A = FALSE (0)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reading 3: Core Temperature */}
          <div className={`p-4 rounded-xl border transition-all ${tempStatus.bg} ${tempStatus.border} relative overflow-hidden group`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
                  {sensors.temp.leadAttached ? vitals.temperature.toFixed(1) : '--'}
                </span>
                <span className="font-mono text-xs text-slate-400 font-semibold">
                  °C ({sensors.temp.leadAttached ? (vitals.temperature * 1.8 + 32).toFixed(1) : '--'}°F)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  PROPOSITION C
                </span>
                <div className="font-mono text-xs font-bold mt-1">
                  {propositions.C ? (
                    <span className="text-rose-400 font-bold">C = TRUE (1)</span>
                  ) : (
                    <span className="text-emerald-400">C = FALSE (0)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Readings 4 & 5: Arterial BP & Respiratory Rate (compact 2-col) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Reading 4: Blood Pressure */}
            <div className={`p-3.5 rounded-xl border transition-all ${bpStatus.bg} ${bpStatus.border}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">NIBP / ART</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold text-white">
                  {sensors.nibp.leadAttached ? `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}` : '--/--'}
                </span>
                <span className="font-mono text-[10px] text-slate-500">mmHg</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-slate-400">
                MAP: {sensors.nibp.leadAttached ? `${meanArterialPressure} mmHg` : '--'}
              </div>
            </div>

            {/* Reading 5: Respiratory Rate */}
            <div className={`p-3.5 rounded-xl border transition-all ${respStatus.bg} ${respStatus.border}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Activity className="w-4 h-4 text-teal-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">RESP RATE</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-bold text-white">
                  {sensors.resp.leadAttached ? vitals.respiratoryRate : '--'}
                </span>
                <span className="font-mono text-[10px] text-slate-500">RPM</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-slate-400">
                Limits: 12-20
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discrete Logic Evaluation Summary Banner */}
      <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400">LOGICAL FORMULA SYNTHESIS:</span>
            <div className="text-white font-bold tracking-wider mt-0.5">
              E = A ∧ B = ({propositions.A ? '1' : '0'}) ∧ ({propositions.B ? '1' : '0'}) = <span className={propositions.E_Combined ? 'text-rose-400' : 'text-emerald-400'}>{propositions.E_Combined ? '1 (TRUE)' : '0 (FALSE)'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">ACTIVE SYSTEM STATE:</span>
          {systemStatus === 'CRITICAL_EMERGENCY' ? (
            <span className="px-3 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 font-extrabold animate-pulse flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" /> CODE RED CRITICAL
            </span>
          ) : systemStatus === 'WARNING' ? (
            <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> WARNING (W = 1)
            </span>
          ) : systemStatus === 'SENSOR_FAULT' ? (
            <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400" /> SENSOR FAULT INTERLOCK
            </span>
          ) : (
            <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> HOMEOSTASIS STABLE
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
