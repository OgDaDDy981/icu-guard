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
  Cpu,
  ArrowRight
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

  // Status evaluations
  const getHrStatus = () => {
    if (!sensors.ecg.leadAttached) {
      return { label: 'LEAD OFF', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.heartRate > THRESHOLDS.HEART_RATE_CRITICAL_MAX) {
      return { label: 'TACHYCARDIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/40' };
    }
    if (vitals.heartRate < THRESHOLDS.HEART_RATE_CRITICAL_MIN) {
      return { label: 'BRADYCARDIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/40' };
    }
    return { label: 'NORMAL SINUS', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/20' };
  };

  const getSpo2Status = () => {
    if (!sensors.spo2.leadAttached) {
      return { label: 'PROBE DETACHED', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.oxygen < THRESHOLDS.OXYGEN_CRITICAL_MIN) {
      return { label: 'CRITICAL HYPOXIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/40' };
    }
    if (vitals.oxygen < 94) {
      return { label: 'LOW WARNING', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    return { label: 'OPTIMAL SAT', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-950/20' };
  };

  const getTempStatus = () => {
    if (!sensors.temp.leadAttached) {
      return { label: 'PROBE OFF', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.temperature > THRESHOLDS.TEMP_CRITICAL_MAX) {
      return { label: 'HYPERPYREXIA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/40' };
    }
    if (vitals.temperature > 37.8) {
      return { label: 'ELEVATED FEVER', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    return { label: 'NORMOTHERMIC', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/20' };
  };

  const getBpStatus = () => {
    if (!sensors.nibp.leadAttached) {
      return { label: 'CUFF OFF', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.bloodPressureSystolic > THRESHOLDS.BP_SYSTOLIC_CRITICAL_MAX) {
      return { label: 'HYPERTENSION', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.bloodPressureSystolic < THRESHOLDS.BP_SYSTOLIC_CRITICAL_MIN) {
      return { label: 'HYPOTENSION', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/40' };
    }
    return { label: 'NORMOTENSIVE', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-950/20' };
  };

  const getRespStatus = () => {
    if (!sensors.resp.leadAttached) {
      return { label: 'CANNULA OFF', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/20' };
    }
    if (vitals.respiratoryRate > THRESHOLDS.RESPIRATORY_CRITICAL_MAX) {
      return { label: 'TACHYPNEA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/40' };
    }
    if (vitals.respiratoryRate < THRESHOLDS.RESPIRATORY_CRITICAL_MIN) {
      return { label: 'BRADYPNEA', color: 'text-rose-400', border: 'border-rose-500/50', bg: 'bg-rose-950/40' };
    }
    return { label: 'EUPNEA NORMAL', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/20' };
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
    <section id="patient-monitor" className="relative w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      
      {/* SECTION TITLE & CLINICAL CONTEXT */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2 font-bold">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>CLINICAL MONITORING ENGINE • MULTI-PARAMETER TELEMETRY</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            PATIENT TELEMETRY HARNESS
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
            Continuous analog biological voltages are sampled at 500 Hz, conditioned, and digitized into
            relational inequalities before discrete Boolean evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap self-start md:self-auto">
          <button
            onClick={() => {
              soundEngine.playGateClick();
              setShowManualControls(!showManualControls);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              showManualControls
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400'
                : 'bg-slate-900/80 border border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{showManualControls ? 'HIDE CALIBRATION SLIDERS' : 'MANUAL SENSOR CALIBRATION'}</span>
          </button>

          <button
            onClick={onRevealMath}
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>SOLVE THE MATH</span>
          </button>
        </div>
      </div>

      {/* PATIENT PROFILE HEADER CARD */}
      <div className="rounded-3xl bg-[#090e1a]/90 border border-white/10 p-5 sm:p-6 mb-8 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Patient Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900/60 to-indigo-900/60 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl">
                <Activity className="w-7 h-7 text-blue-400 animate-pulse" />
              </div>
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#090e1a] ${
                systemStatus === 'CRITICAL_EMERGENCY'
                  ? 'bg-rose-500 animate-ping'
                  : systemStatus === 'WARNING' || systemStatus === 'SENSOR_FAULT'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide">
                  PATIENT ID: #ICU-8820-DX
                </h3>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 font-mono font-bold">
                  BAY 04 • NEURO-TRAUMA ICU
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-900/90 text-slate-300 font-mono border border-white/8">
                  46 M • INVASIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-2 flex-wrap">
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 5-CHANNEL DECOUPLED HARNESS
                </span>
                <span className="text-slate-600">•</span>
                <span>SAMPLING: 500 Hz SYNCHRONOUS</span>
                <span className="text-slate-600">•</span>
                <span className="text-blue-400 font-bold">SAFETY INTERLOCK: ARMED</span>
              </p>
            </div>
          </div>

          {/* Real-time System Status Callout */}
          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-xs hidden sm:block">
              <div className="text-slate-400 uppercase text-[10px] font-bold">Current Interlock State</div>
              <div className="font-black text-sm text-white">
                {systemStatus === 'CRITICAL_EMERGENCY' ? (
                  <span className="text-rose-400">TRIPPED (CODE RED)</span>
                ) : systemStatus === 'WARNING' ? (
                  <span className="text-amber-400">ADVISORY (W=1)</span>
                ) : systemStatus === 'SENSOR_FAULT' ? (
                  <span className="text-yellow-400">LEAD FAULT ISOLATED</span>
                ) : (
                  <span className="text-emerald-400">SECURE (HOMEOSTASIS)</span>
                )}
              </div>
            </div>

            <div className={`p-3 rounded-2xl border ${
              systemStatus === 'CRITICAL_EMERGENCY'
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 animate-beacon'
                : systemStatus === 'WARNING'
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : systemStatus === 'SENSOR_FAULT'
                ? 'bg-yellow-500/20 border-yellow-500/60 text-yellow-300'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
            }`}>
              {systemStatus === 'CRITICAL_EMERGENCY' ? (
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              ) : systemStatus === 'WARNING' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : systemStatus === 'SENSOR_FAULT' ? (
                <Radio className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Manual Calibration Adjusters Drawer */}
        {showManualControls && (
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
            {/* Heart Rate Slider */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
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
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                <span>35 (Brady)</span>
                <span>74 (Normal)</span>
                <span>180 (Tachy)</span>
              </div>
            </div>

            {/* Oxygen SpO2 Slider */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
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
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                <span>65% (Critical)</span>
                <span>90% (Boundary)</span>
                <span>100% (Air)</span>
              </div>
            </div>

            {/* Core Temperature Slider */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
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
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                <span>35.0°C</span>
                <span>36.8°C</span>
                <span>41.5°C</span>
              </div>
            </div>

            {/* Blood Pressure Slider */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
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
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                <span>70 (Hypo)</span>
                <span>120 (Norm)</span>
                <span>190 (Hyper)</span>
              </div>
            </div>

            {/* Respiratory Rate Slider */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-sm">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-teal-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Resp Rate: {vitals.respiratoryRate} RPM
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
                className="w-full accent-teal-500 cursor-pointer h-2 bg-slate-800 rounded-lg disabled:opacity-30"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                <span>6 (Bradypnea)</span>
                <span>16 (Normal)</span>
                <span>45 (Tachypnea)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INDEPENDENT SENSOR HARDWARE HARNESS DOCK */}
      <div className="rounded-3xl bg-[#070b14] border border-white/10 p-5 sm:p-6 mb-8 relative overflow-hidden shadow-2xl group">
        {/* Subtle Clinical Sensor Array Background Asset */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity pointer-events-none transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}sensors-array.jpg')` }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-400" />
            <span className="text-white font-black tracking-wider uppercase">INDEPENDENT SENSOR CHANNEL HARNESS</span>
            <span className="text-slate-500 hidden md:inline">• Click ON/OFF to test physical open-circuit fault isolation</span>
          </div>
          <span className="text-[11px] font-bold">
            {sensors.ecg.leadAttached && sensors.spo2.leadAttached ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ALL 5 LEADS ATTACHED
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> LEAD DETACHED — FAULT ISOLATED
              </span>
            )}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {(Object.keys(sensors) as SensorChannelId[]).map((channelId) => {
            const ch = sensors[channelId];
            const isOnline = ch.leadAttached;

            return (
              <div
                key={channelId}
                className={`p-4 rounded-2xl border transition-all ${
                  isOnline
                    ? 'bg-[#0d1424]/90 border-white/10 hover:border-white/20'
                    : 'bg-amber-950/20 border-amber-500/50 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-black uppercase text-slate-300 truncate">
                    {ch.label}
                  </span>
                  <button
                    onClick={() => {
                      soundEngine.playGateClick();
                      onToggleSensor(channelId);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                      isOnline
                        ? 'bg-slate-800/90 text-slate-300 hover:bg-rose-900/60 hover:text-white border border-white/10'
                        : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    }`}
                    title={isOnline ? 'Disconnect Lead' : 'Reconnect Lead'}
                  >
                    <Power className="w-3 h-3" />
                    <span>{isOnline ? 'ATTACHED' : 'DETACHED'}</span>
                  </button>
                </div>

                <div className="flex items-baseline justify-between text-xs font-mono mt-1">
                  <span className={isOnline ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {isOnline ? 'ONLINE' : 'OPEN CIRCUIT'}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {isOnline ? `${ch.impedanceKOhms} kΩ` : '&gt;50 kΩ'}
                  </span>
                </div>

                <div className="mt-2.5 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full transition-all ${
                      isOnline ? (ch.signalQuality > 70 ? 'bg-emerald-400' : 'bg-amber-400') : 'bg-slate-700'
                    }`}
                    style={{ width: `${isOnline ? ch.signalQuality : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN TELEMETRY STAGE: LEFT OSCILLOSCOPES (7 COLS) + RIGHT NUMERICAL TILES (5 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left Column: 4 Real-time Oscilloscope Waveforms (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Waveform 1: Lead II ECG */}
          <div className="rounded-2xl bg-[#050811] border border-white/10 p-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between px-2 pb-2 text-xs border-b border-white/5 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                <span className="font-mono font-bold text-white text-[11px]">ELECTROCARDIOGRAM (LEAD II)</span>
              </div>
              <span className="font-mono text-[11px]">
                {propositions.B ? (
                  <span className="text-rose-400 font-extrabold animate-pulse">PROPOSITION B = 1 (ABNORMAL)</span>
                ) : (
                  <span className="text-emerald-400 font-bold">PROPOSITION B = 0 (NORMAL)</span>
                )}
              </span>
            </div>
            <WaveformCanvas
              type="ecg"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              color="#10b981"
              glowColor="rgba(16, 185, 129, 0.4)"
              label="LEAD II • ECG"
              sublabel="500 Hz Calibration"
              height={100}
              isFault={!sensors.ecg.leadAttached}
              signalQuality={sensors.ecg.signalQuality}
              soundEnabled={soundEnabled}
            />
          </div>

          {/* Waveform 2: Plethysmogram (SpO2) */}
          <div className="rounded-2xl bg-[#050811] border border-white/10 p-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between px-2 pb-2 text-xs border-b border-white/5 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm" />
                <span className="font-mono font-bold text-white text-[11px]">PHOTOPLETHYSMOGRAPHY (SpO₂)</span>
              </div>
              <span className="font-mono text-[11px]">
                {propositions.A ? (
                  <span className="text-rose-400 font-extrabold animate-pulse">PROPOSITION A = 1 (HYPOXIA)</span>
                ) : (
                  <span className="text-cyan-400 font-bold">PROPOSITION A = 0 (OPTIMAL)</span>
                )}
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
          <div className="rounded-2xl bg-[#050811] border border-white/10 p-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between px-2 pb-2 text-xs border-b border-white/5 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                <span className="font-mono font-bold text-white text-[11px]">ARTERIAL PULSE (ABP)</span>
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
          <div className="rounded-2xl bg-[#050811] border border-white/10 p-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between px-2 pb-2 text-xs border-b border-white/5 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-sm" />
                <span className="font-mono font-bold text-white text-[11px]">CAPNOGRAPHY (RESP CO₂)</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                VENTILATION RATE: {vitals.respiratoryRate} RPM
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
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Reading 1: Heart Rate */}
          <div className={`p-5 rounded-3xl border transition-all ${hrStatus.bg} ${hrStatus.border} shadow-xl relative overflow-hidden`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <Heart className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">HEART RATE</h4>
                  <span className={`text-[11px] font-mono font-extrabold ${hrStatus.color}`}>
                    {hrStatus.label}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-500">
                <span>LIMITS</span>
                <div>50 - 120</div>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-black text-white tracking-tight">
                  {sensors.ecg.leadAttached ? vitals.heartRate : '--'}
                </span>
                <span className="font-mono text-xs text-slate-400 font-bold">BPM</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/10 text-slate-300 font-bold">
                  PROPOSITION B
                </span>
                <div className="font-mono text-xs font-black mt-1">
                  {propositions.B ? (
                    <span className="text-rose-400">B = 1 (ACTIVE)</span>
                  ) : (
                    <span className="text-emerald-400">B = 0 (SAFE)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reading 2: Oxygen SpO2 */}
          <div className={`p-5 rounded-3xl border transition-all ${spo2Status.bg} ${spo2Status.border} shadow-xl relative overflow-hidden`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">OXYGEN SATURATION</h4>
                  <span className={`text-[11px] font-mono font-extrabold ${spo2Status.color}`}>
                    {spo2Status.label}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-500">
                <span>LIMIT</span>
                <div>&ge; 90%</div>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-black text-cyan-400 tracking-tight">
                  {sensors.spo2.leadAttached ? vitals.oxygen : '--'}
                </span>
                <span className="font-mono text-xs text-slate-400 font-bold">% SpO₂</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/10 text-slate-300 font-bold">
                  PROPOSITION A
                </span>
                <div className="font-mono text-xs font-black mt-1">
                  {propositions.A ? (
                    <span className="text-rose-400">A = 1 (ACTIVE)</span>
                  ) : (
                    <span className="text-cyan-400">A = 0 (SAFE)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reading 3: Core Temperature */}
          <div className={`p-5 rounded-3xl border transition-all ${tempStatus.bg} ${tempStatus.border} shadow-xl relative overflow-hidden`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">CORE TEMPERATURE</h4>
                  <span className={`text-[11px] font-mono font-extrabold ${tempStatus.color}`}>
                    {tempStatus.label}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-500">
                <span>LIMIT</span>
                <div>&le; 39.0°C</div>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-black text-white tracking-tight">
                  {sensors.temp.leadAttached ? vitals.temperature.toFixed(1) : '--'}
                </span>
                <span className="font-mono text-xs text-slate-400 font-bold">
                  °C ({sensors.temp.leadAttached ? (vitals.temperature * 1.8 + 32).toFixed(1) : '--'}°F)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/10 text-slate-300 font-bold">
                  PROPOSITION C
                </span>
                <div className="font-mono text-xs font-black mt-1">
                  {propositions.C ? (
                    <span className="text-rose-400">C = 1 (ACTIVE)</span>
                  ) : (
                    <span className="text-emerald-400">C = 0 (SAFE)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reading 4 & 5: Arterial BP & Resp Rate (2 cols) */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border transition-all ${bpStatus.bg} ${bpStatus.border}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Gauge className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-bold">NIBP / ART</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-2xl font-black text-white">
                  {sensors.nibp.leadAttached ? `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}` : '--/--'}
                </span>
                <span className="font-mono text-[10px] text-slate-500 font-bold">mmHg</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-slate-400">
                MAP: {sensors.nibp.leadAttached ? `${meanArterialPressure} mmHg` : '--'}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${respStatus.bg} ${respStatus.border}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Activity className="w-4 h-4 text-teal-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-bold">RESP RATE</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-2xl font-black text-white">
                  {sensors.resp.leadAttached ? vitals.respiratoryRate : '--'}
                </span>
                <span className="font-mono text-[10px] text-slate-500 font-bold">RPM</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-slate-400">
                Normal Limits: 12-20
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DISCRETE LOGIC FORMULA EVALUATION STRIP */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#090e1a] to-[#0d1424] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] font-bold">REAL-TIME CONJUNCTION SYNTHESIS:</span>
            <div className="text-white font-black text-sm tracking-wider mt-0.5">
              E = A ∧ B = ({propositions.A ? '1' : '0'} ∧ {propositions.B ? '1' : '0'}) = <span className={propositions.E_Combined ? 'text-rose-400 underline font-black' : 'text-emerald-400'}>{propositions.E_Combined ? '1 (TRIPPED)' : '0 (QUIESCENT)'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRevealMath}
          className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer group"
        >
          <span>Trace this deduction in Solve the Math</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default PatientMonitor;
