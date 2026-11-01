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
      return { label: 'LEAD DETACHED', color: 'text-[#e5933a]', border: 'border-[#e5933a]/40', bg: 'bg-[#e5933a]/10' };
    }
    if (vitals.heartRate > THRESHOLDS.HEART_RATE_CRITICAL_MAX) {
      return { label: 'HIGH HEART RATE', color: 'text-[#d96347]', border: 'border-[#d96347]/50', bg: 'bg-[#d96347]/15' };
    }
    if (vitals.heartRate < THRESHOLDS.HEART_RATE_CRITICAL_MIN) {
      return { label: 'LOW HEART RATE', color: 'text-[#d96347]', border: 'border-[#d96347]/50', bg: 'bg-[#d96347]/15' };
    }
    return { label: 'NORMAL HEART RATE', color: 'text-[#5da283]', border: 'border-[#5da283]/30', bg: 'bg-[#5da283]/10' };
  };

  const getSpo2Status = () => {
    if (!sensors.spo2.leadAttached) {
      return { label: 'PROBE DETACHED', color: 'text-[#e5933a]', border: 'border-[#e5933a]/40', bg: 'bg-[#e5933a]/10' };
    }
    if (vitals.oxygen < THRESHOLDS.OXYGEN_CRITICAL_MIN) {
      return { label: 'LOW OXYGEN (< 90%)', color: 'text-[#d96347]', border: 'border-[#d96347]/50', bg: 'bg-[#d96347]/15' };
    }
    if (vitals.oxygen < 94) {
      return { label: 'MILD DROP WARNING', color: 'text-[#e5933a]', border: 'border-[#e5933a]/40', bg: 'bg-[#e5933a]/10' };
    }
    return { label: 'NORMAL OXYGEN LEVEL', color: 'text-[#5da283]', border: 'border-[#5da283]/30', bg: 'bg-[#5da283]/10' };
  };

  const getTempStatus = () => {
    if (!sensors.temp.leadAttached) {
      return { label: 'PROBE DETACHED', color: 'text-[#e5933a]', border: 'border-[#e5933a]/40', bg: 'bg-[#e5933a]/10' };
    }
    if (vitals.temperature > THRESHOLDS.TEMP_CRITICAL_MAX) {
      return { label: 'HIGH FEVER (> 39°C)', color: 'text-[#d96347]', border: 'border-[#d96347]/50', bg: 'bg-[#d96347]/15' };
    }
    if (vitals.temperature > 37.8) {
      return { label: 'ELEVATED TEMP', color: 'text-[#e5933a]', border: 'border-[#e5933a]/40', bg: 'bg-[#e5933a]/10' };
    }
    return { label: 'NORMAL TEMPERATURE', color: 'text-[#5da283]', border: 'border-[#5da283]/30', bg: 'bg-[#5da283]/10' };
  };

  const getBpStatus = () => {
    if (!sensors.nibp.leadAttached) {
      return { label: 'CUFF DETACHED', color: 'text-[#e5933a]', border: 'border-[#e5933a]/40', bg: 'bg-[#e5933a]/10' };
    }
    if (vitals.bloodPressureSystolic > THRESHOLDS.BP_SYSTOLIC_CRITICAL_MAX) {
      return { label: 'HIGH BLOOD PRESSURE', color: 'text-[#e5933a]', border: 'border-[#e5933a]/40', bg: 'bg-[#e5933a]/10' };
    }
    if (vitals.bloodPressureSystolic < THRESHOLDS.BP_SYSTOLIC_CRITICAL_MIN) {
      return { label: 'LOW BLOOD PRESSURE', color: 'text-[#d96347]', border: 'border-[#d96347]/50', bg: 'bg-[#d96347]/15' };
    }
    return { label: 'NORMAL PRESSURE', color: 'text-[#5da283]', border: 'border-[#5da283]/30', bg: 'bg-[#5da283]/10' };
  };

  const getRespStatus = () => {
    if (!sensors.resp.leadAttached) {
      return { label: 'CANNULA DETACHED', color: 'text-[#e5933a]', border: 'border-[#e5933a]/40', bg: 'bg-[#e5933a]/10' };
    }
    if (vitals.respiratoryRate > THRESHOLDS.RESPIRATORY_CRITICAL_MAX) {
      return { label: 'RAPID BREATHING', color: 'text-[#d96347]', border: 'border-[#d96347]/50', bg: 'bg-[#d96347]/15' };
    }
    if (vitals.respiratoryRate < THRESHOLDS.RESPIRATORY_CRITICAL_MIN) {
      return { label: 'SLOW BREATHING', color: 'text-[#d96347]', border: 'border-[#d96347]/50', bg: 'bg-[#d96347]/15' };
    }
    return { label: 'NORMAL BREATHING', color: 'text-[#5da283]', border: 'border-[#5da283]/30', bg: 'bg-[#5da283]/10' };
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#faf6f0]/8">
        <div>
          <div className="flex items-center gap-2 text-[#d96347] font-mono text-xs uppercase tracking-widest mb-2 font-bold">
            <Activity className="w-4 h-4 text-[#5da283] animate-pulse" />
            <span>LIVE PATIENT SIMULATION • MULTI-PARAMETER MONITOR</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#faf6f0] tracking-tight">
            BEDSIDE PATIENT MONITOR
          </h2>
          <p className="text-[#c5beaf] text-sm sm:text-base mt-2 max-w-2xl font-light">
            Continuous physiological signals are sampled in real time. Discrete mathematical checks ensure that emergency alerts trigger only when genuine medical distress occurs.
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
                ? 'bg-[#d96347] text-white shadow-lg shadow-[#d96347]/30 border border-[#d96347]'
                : 'bg-[#181a20] border border-[#faf6f0]/10 text-[#c5beaf] hover:border-[#faf6f0]/25 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{showManualControls ? 'HIDE CALIBRATION SLIDERS' : 'MANUAL SENSOR CALIBRATION'}</span>
          </button>

          <button
            onClick={onRevealMath}
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-[#d96347] to-[#e5933a] hover:from-[#e06d53] hover:to-[#efa347] text-white shadow-lg shadow-[#d96347]/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>SOLVE THE MATH</span>
          </button>
        </div>
      </div>

      {/* PATIENT PROFILE HEADER CARD */}
      <div className="rounded-3xl bg-[#171920]/90 border border-[#faf6f0]/10 p-5 sm:p-6 mb-8 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Patient Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#1e2027] border border-[#faf6f0]/15 flex items-center justify-center text-[#d96347] shadow-xl">
                <Activity className="w-7 h-7 text-[#d96347] animate-pulse" />
              </div>
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#171920] ${
                systemStatus === 'CRITICAL_EMERGENCY'
                  ? 'bg-[#d96347] animate-ping'
                  : systemStatus === 'WARNING' || systemStatus === 'SENSOR_FAULT'
                  ? 'bg-[#e5933a] animate-pulse'
                  : 'bg-[#5da283]'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-display font-black text-xl sm:text-2xl text-[#faf6f0] tracking-wide">
                  PATIENT ID: #ICU-8820
                </h3>
                <span className="text-xs px-3 py-1 rounded-full bg-[#1e2027] border border-[#faf6f0]/10 text-[#5da283] font-mono font-bold">
                  BED 04 • INTENSIVE CARE
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-[#14151b] text-[#c5beaf] font-mono border border-[#faf6f0]/8">
                  5 CONNECTED CHANNELS
                </span>
              </div>
              <p className="text-xs text-[#c5beaf] mt-2 font-mono flex items-center gap-2 flex-wrap">
                <span className="text-[#5da283] flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CONTINUOUS SYNCHRONIZATION
                </span>
                <span className="text-[#55534f]">•</span>
                <span>SAMPLING: 500 Hz</span>
                <span className="text-[#55534f]">•</span>
                <span className="text-[#e5933a] font-bold">LOGIC ENGINE: ACTIVE</span>
              </p>
            </div>
          </div>

          {/* Real-time System Status Callout */}
          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-xs hidden sm:block">
              <div className="text-[#c5beaf] uppercase text-[10px] font-bold">System Status</div>
              <div className="font-black text-sm text-[#faf6f0]">
                {systemStatus === 'CRITICAL_EMERGENCY' ? (
                  <span className="text-[#d96347]">EMERGENCY (CODE RED)</span>
                ) : systemStatus === 'WARNING' ? (
                  <span className="text-[#e5933a]">WARNING (W = 1)</span>
                ) : systemStatus === 'SENSOR_FAULT' ? (
                  <span className="text-[#e5933a]">SENSOR DISCONNECTED</span>
                ) : (
                  <span className="text-[#5da283]">STABLE (NORMAL)</span>
                )}
              </div>
            </div>

            <div className={`p-3 rounded-2xl border ${
              systemStatus === 'CRITICAL_EMERGENCY'
                ? 'bg-[#d96347]/20 border-[#d96347]/60 text-[#d96347] animate-beacon'
                : systemStatus === 'WARNING'
                ? 'bg-[#e5933a]/20 border-[#e5933a]/60 text-[#e5933a]'
                : systemStatus === 'SENSOR_FAULT'
                ? 'bg-[#e5933a]/20 border-[#e5933a]/60 text-[#e5933a]'
                : 'bg-[#5da283]/15 border-[#5da283]/40 text-[#5da283]'
            }`}>
              {systemStatus === 'CRITICAL_EMERGENCY' ? (
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              ) : systemStatus === 'WARNING' ? (
                <AlertTriangle className="w-6 h-6" />
              ) : systemStatus === 'SENSOR_FAULT' ? (
                <Radio className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-[#5da283]" />
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
      <div className="rounded-3xl bg-[#14161c] border border-[#faf6f0]/10 p-5 sm:p-6 mb-8 relative overflow-hidden shadow-2xl group">
        {/* Subtle Clinical Sensor Array Background Asset */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity pointer-events-none transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}warm-telemetry.jpg')` }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#e5933a]" />
            <span className="text-[#faf6f0] font-black tracking-wider uppercase">INDEPENDENT SENSOR CHANNELS</span>
            <span className="text-[#c5beaf] hidden md:inline">• Click to disconnect a sensor and observe fault isolation</span>
          </div>
          <span className="text-[11px] font-bold">
            {sensors.ecg.leadAttached && sensors.spo2.leadAttached ? (
              <span className="text-[#5da283] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ALL 5 SENSORS CONNECTED
              </span>
            ) : (
              <span className="text-[#e5933a] flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" /> SENSOR DISCONNECTED — FAULT ISOLATED
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
                    ? 'bg-[#181a20]/90 border-[#faf6f0]/10 hover:border-[#faf6f0]/20'
                    : 'bg-[#e5933a]/15 border-[#e5933a]/50 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-black uppercase text-[#faf6f0] truncate">
                    {ch.label}
                  </span>
                  <button
                    onClick={() => {
                      soundEngine.playGateClick();
                      onToggleSensor(channelId);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold transition-all flex items-center gap-1 cursor-pointer ${
                      isOnline
                        ? 'bg-[#1e2027] text-[#c5beaf] hover:bg-[#d96347] hover:text-white border border-[#faf6f0]/10'
                        : 'bg-[#e5933a] text-[#111215] shadow-md shadow-[#e5933a]/30'
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
          <div className="rounded-2xl bg-[#14161c] border border-[#faf6f0]/10 p-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between px-2 pb-2 text-xs border-b border-[#faf6f0]/8 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5da283] shadow-sm" />
                <span className="font-mono font-bold text-[#faf6f0] text-[11px]">HEART RHYTHM • LEAD II (ECG)</span>
              </div>
              <span className="font-mono text-[11px]">
                {propositions.B ? (
                  <span className="text-[#d96347] font-extrabold animate-pulse">CONDITION B = 1 (ABNORMAL)</span>
                ) : (
                  <span className="text-[#5da283] font-bold">CONDITION B = 0 (NORMAL)</span>
                )}
              </span>
            </div>
            <WaveformCanvas
              type="ecg"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              color="#5da283"
              glowColor="rgba(93, 162, 131, 0.4)"
              label="LEAD II • ECG"
              sublabel="500 Hz Calibration"
              height={100}
              isFault={!sensors.ecg.leadAttached}
              signalQuality={sensors.ecg.signalQuality}
              soundEnabled={soundEnabled}
            />
          </div>

          {/* Waveform 2: Plethysmogram (SpO2) */}
          <div className="rounded-2xl bg-[#14161c] border border-[#faf6f0]/10 p-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between px-2 pb-2 text-xs border-b border-[#faf6f0]/8 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#70b896] shadow-sm" />
                <span className="font-mono font-bold text-[#faf6f0] text-[11px]">OXYGEN PULSE • PLETH (SpO₂)</span>
              </div>
              <span className="font-mono text-[11px]">
                {propositions.A ? (
                  <span className="text-[#d96347] font-extrabold animate-pulse">CONDITION A = 1 (LOW O₂)</span>
                ) : (
                  <span className="text-[#70b896] font-bold">CONDITION A = 0 (NORMAL)</span>
                )}
              </span>
            </div>
            <WaveformCanvas
              type="pleth"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              color="#70b896"
              glowColor="rgba(112, 184, 150, 0.4)"
              label="PLETH • PPG"
              sublabel="Optical Perfusion"
              height={85}
              isFault={!sensors.spo2.leadAttached}
              signalQuality={sensors.spo2.signalQuality}
              soundEnabled={false}
            />
          </div>

          {/* Waveform 3: Arterial Blood Pressure Line */}
          <div className="rounded-2xl bg-[#14161c] border border-[#faf6f0]/10 p-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between px-2 pb-2 text-xs border-b border-[#faf6f0]/8 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d96347] shadow-sm" />
                <span className="font-mono font-bold text-[#faf6f0] text-[11px]">BLOOD PRESSURE PULSE (ABP)</span>
              </div>
              <span className="font-mono text-[11px] text-[#c5beaf]">
                PULSE PRESSURE: {vitals.bloodPressureSystolic - vitals.bloodPressureDiastolic} mmHg
              </span>
            </div>
            <WaveformCanvas
              type="abp"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              bloodPressureSystolic={vitals.bloodPressureSystolic}
              bloodPressureDiastolic={vitals.bloodPressureDiastolic}
              color="#d96347"
              glowColor="rgba(217, 99, 71, 0.35)"
              label="ABP • ARTERIAL"
              sublabel="Pulse Contour"
              height={75}
              isFault={!sensors.nibp.leadAttached}
              signalQuality={sensors.nibp.signalQuality}
              soundEnabled={false}
            />
          </div>

          {/* Waveform 4: Respiration / Capnography */}
          <div className="rounded-2xl bg-[#14161c] border border-[#faf6f0]/10 p-3.5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between px-2 pb-2 text-xs border-b border-[#faf6f0]/8 mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e5933a] shadow-sm" />
                <span className="font-mono font-bold text-[#faf6f0] text-[11px]">BREATHING CYCLE • RESPIRATION</span>
              </div>
              <span className="font-mono text-[11px] text-[#c5beaf]">
                BREATHING RATE: {vitals.respiratoryRate} RPM
              </span>
            </div>
            <WaveformCanvas
              type="resp"
              bpm={vitals.heartRate}
              oxygen={vitals.oxygen}
              respiratoryRate={vitals.respiratoryRate}
              color="#e5933a"
              glowColor="rgba(229, 147, 58, 0.35)"
              label="RESP • CYCLE"
              sublabel="Ventilation Pacing"
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
                <div className="p-2.5 rounded-2xl bg-[#70b896]/15 text-[#70b896] border border-[#70b896]/30">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[#c5beaf] font-bold">OXYGEN SATURATION</h4>
                  <span className={`text-[11px] font-mono font-extrabold ${spo2Status.color}`}>
                    {spo2Status.label}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-[#c5beaf]">
                <span>LIMIT</span>
                <div>&ge; 90%</div>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-black text-[#faf6f0] tracking-tight">
                  {sensors.spo2.leadAttached ? vitals.oxygen : '--'}
                </span>
                <span className="font-mono text-xs text-[#c5beaf] font-bold">% SpO₂</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#161820] border border-[#faf6f0]/10 text-[#c5beaf] font-bold">
                  CONDITION A
                </span>
                <div className="font-mono text-xs font-black mt-1">
                  {propositions.A ? (
                    <span className="text-[#d96347]">A = 1 (LOW)</span>
                  ) : (
                    <span className="text-[#5da283]">A = 0 (SAFE)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reading 3: Core Temperature */}
          <div className={`p-5 rounded-3xl border transition-all ${tempStatus.bg} ${tempStatus.border} shadow-xl relative overflow-hidden`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#5da283]/15 text-[#5da283] border border-[#5da283]/30">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[#c5beaf] font-bold">BODY TEMPERATURE</h4>
                  <span className={`text-[11px] font-mono font-extrabold ${tempStatus.color}`}>
                    {tempStatus.label}
                  </span>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-[#c5beaf]">
                <span>LIMIT</span>
                <div>&le; 39.0°C</div>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-black text-[#faf6f0] tracking-tight">
                  {sensors.temp.leadAttached ? vitals.temperature.toFixed(1) : '--'}
                </span>
                <span className="font-mono text-xs text-[#c5beaf] font-bold">
                  °C ({sensors.temp.leadAttached ? (vitals.temperature * 1.8 + 32).toFixed(1) : '--'}°F)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#161820] border border-[#faf6f0]/10 text-[#c5beaf] font-bold">
                  CONDITION C
                </span>
                <div className="font-mono text-xs font-black mt-1">
                  {propositions.C ? (
                    <span className="text-[#d96347]">C = 1 (HIGH)</span>
                  ) : (
                    <span className="text-[#5da283]">C = 0 (SAFE)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reading 4 & 5: Arterial BP & Resp Rate (2 cols) */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-2xl border transition-all ${bpStatus.bg} ${bpStatus.border}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Gauge className="w-4 h-4 text-[#e5933a]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#c5beaf] font-bold">BLOOD PRESSURE</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-2xl font-black text-[#faf6f0]">
                  {sensors.nibp.leadAttached ? `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}` : '--/--'}
                </span>
                <span className="font-mono text-[10px] text-[#c5beaf] font-bold">mmHg</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-[#c5beaf]">
                Mean: {sensors.nibp.leadAttached ? `${meanArterialPressure} mmHg` : '--'}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border transition-all ${respStatus.bg} ${respStatus.border}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <Activity className="w-4 h-4 text-[#5da283]" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#c5beaf] font-bold">BREATHING</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display text-2xl font-black text-[#faf6f0]">
                  {sensors.resp.leadAttached ? vitals.respiratoryRate : '--'}
                </span>
                <span className="font-mono text-[10px] text-[#c5beaf] font-bold">RPM</span>
              </div>
              <div className="mt-1 text-[10px] font-mono text-[#c5beaf]">
                Normal: 12-20
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DISCRETE LOGIC FORMULA EVALUATION STRIP */}
      <div className="p-5 rounded-3xl bg-[#171920] border border-[#faf6f0]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#e5933a]/15 text-[#e5933a] border border-[#e5933a]/30">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[#c5beaf] uppercase text-[10px] font-bold">LIVE BOOLEAN CONJUNCTION STATUS:</span>
            <div className="text-[#faf6f0] font-black text-sm tracking-wider mt-0.5">
              E = A ∧ B = ({propositions.A ? '1' : '0'} ∧ {propositions.B ? '1' : '0'}) = <span className={propositions.E_Combined ? 'text-[#d96347] underline font-black' : 'text-[#5da283]'}>{propositions.E_Combined ? '1 (EMERGENCY ACTIVATED)' : '0 (NORMAL)'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRevealMath}
          className="text-[#d96347] hover:text-[#e5933a] font-bold flex items-center gap-1.5 transition-colors cursor-pointer group"
        >
          <span>Examine truth table in Solve the Math</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default PatientMonitor;
