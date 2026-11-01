import React, { useState, useEffect, useRef } from 'react';
import type { ScenarioDefinition, VitalsState, SystemStatus, SensorChannelsState, AlarmEvent } from '../../types';
import { PRESET_SCENARIOS, DEFAULT_VITALS } from '../../utils/constants';
import { evaluatePropositions } from '../../utils/logic';
import { soundEngine } from '../../utils/audio';
import { WaveformCanvas } from '../telemetry/WaveformCanvas';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Activity, 
  Heart, 
  Zap, 
  ArrowRight,
  Volume2,
  VolumeX,
  Wrench,
  CheckCircle2,
  Sparkles,
  Radio,
  Cpu
} from 'lucide-react';

interface ScenarioPlayerProps {
  onApplyVitals: (vitals: Partial<VitalsState>, sensors?: Partial<SensorChannelsState>) => void;
  onEmitAlarm: (alarm: Omit<AlarmEvent, 'id' | 'timestamp' | 'relativeSec' | 'acknowledged' | 'resolved'>) => void;
  currentVitals: VitalsState;
  systemStatus: SystemStatus;
  onRevealMath: () => void;
}

export const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({
  onApplyVitals,
  onEmitAlarm,
  currentVitals,
  systemStatus: _systemStatus,
  onRevealMath,
}) => {
  // Primary selection: 'normal' | 'warning' | 'emergency' | 'sensor_fault' | 'recovery'
  const [activeExperience, setActiveExperience] = useState<'normal' | 'warning' | 'emergency' | 'sensor_fault' | 'recovery'>('emergency');
  
  // For 'warning' experience: allow user to test either Hypoxia or Tachycardia
  const [warningVariant, setWarningVariant] = useState<'hypoxia' | 'tachycardia'>('hypoxia');

  // Map experience to underlying scenario definition
  const getActiveScenarioDefinition = (): ScenarioDefinition => {
    switch (activeExperience) {
      case 'normal':
        return PRESET_SCENARIOS[0]; // Normal Patient Monitoring
      case 'warning':
        return warningVariant === 'hypoxia' ? PRESET_SCENARIOS[1] : PRESET_SCENARIOS[2];
      case 'emergency':
        return PRESET_SCENARIOS[3]; // Combined Critical Emergency
      case 'sensor_fault':
        return PRESET_SCENARIOS[4]; // Sensor Fault Disconnection
      case 'recovery':
        return PRESET_SCENARIOS[5]; // Progressive Recovery
      default:
        return PRESET_SCENARIOS[3];
    }
  };

  const selectedScenario = getActiveScenarioDefinition();

  // Simulation execution state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [soundMuted, setSoundMuted] = useState<boolean>(soundEngine.getMuted());

  const lastKeyframeIndexRef = useRef<number>(-1);
  const tickerRef = useRef<number | null>(null);

  const duration = selectedScenario.durationSec || 12;

  // Linear interpolation utility
  const lerp = (start: number, end: number, t: number) => start + (end - start) * Math.max(0, Math.min(1, t));

  // Compute interpolated vitals at time t
  const computeStateAtTime = (t: number) => {
    const keyframes = selectedScenario.keyframes;
    if (!keyframes || keyframes.length === 0) return selectedScenario.targetVitals;

    let prev = keyframes[0];
    let next = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (t >= keyframes[i].timeSec && t <= keyframes[i + 1].timeSec) {
        prev = keyframes[i];
        next = keyframes[i + 1];
        break;
      }
    }

    if (t <= prev.timeSec) return prev.vitals;
    if (t >= next.timeSec) return next.vitals;

    const span = next.timeSec - prev.timeSec;
    const progress = span > 0 ? (t - prev.timeSec) / span : 1;

    const pV = prev.vitals;
    const nV = next.vitals;

    const interpolatedVitals: Partial<VitalsState> = {
      heartRate: Math.round(lerp(pV.heartRate ?? 74, nV.heartRate ?? 74, progress)),
      oxygen: Math.round(lerp(pV.oxygen ?? 98, nV.oxygen ?? 98, progress)),
      temperature: Number(lerp(pV.temperature ?? 36.8, nV.temperature ?? 36.8, progress).toFixed(1)),
      bloodPressureSystolic: Math.round(lerp(pV.bloodPressureSystolic ?? 118, nV.bloodPressureSystolic ?? 118, progress)),
      bloodPressureDiastolic: Math.round(lerp(pV.bloodPressureDiastolic ?? 78, nV.bloodPressureDiastolic ?? 78, progress)),
      respiratoryRate: Math.round(lerp(pV.respiratoryRate ?? 16, nV.respiratoryRate ?? 16, progress)),
      sensorQuality: Math.round(lerp(pV.sensorQuality ?? 98, nV.sensorQuality ?? 98, progress)),
      sensorLeadAttached: next.vitals.sensorLeadAttached !== undefined ? next.vitals.sensorLeadAttached : true,
    };

    return interpolatedVitals;
  };

  // Simulation Execution Loop
  useEffect(() => {
    if (isPlaying) {
      const stepIntervalMs = 50;
      const stepSec = stepIntervalMs / 1000;

      tickerRef.current = window.setInterval(() => {
        setCurrentTimeSec((prevTime) => {
          const nextTime = prevTime + stepSec;

          if (nextTime >= duration) {
            setIsPlaying(false);
            const finalState = computeStateAtTime(duration);
            onApplyVitals(finalState, selectedScenario.targetSensors as any);
            return duration;
          }

          const currentState = computeStateAtTime(nextTime);
          onApplyVitals(currentState);

          // Check for alarm events passed
          selectedScenario.keyframes.forEach((kf, idx) => {
            if (prevTime < kf.timeSec && nextTime >= kf.timeSec && idx !== lastKeyframeIndexRef.current) {
              lastKeyframeIndexRef.current = idx;
              if (kf.alarmEvent) {
                onEmitAlarm({
                  severity: kf.alarmEvent.severity,
                  parameter: kf.alarmEvent.parameter,
                  title: kf.alarmEvent.title,
                  condition: kf.alarmEvent.condition,
                  propositionTriggered: kf.alarmEvent.propositionTriggered,
                });
                if (!soundMuted) {
                  if (kf.alarmEvent.severity === 'CRITICAL') {
                    soundEngine.playEmergencyAlarm();
                  } else if (kf.alarmEvent.severity === 'WARNING') {
                    soundEngine.playWarning();
                  } else if (kf.alarmEvent.severity === 'TECHNICAL') {
                    soundEngine.playTechnicalAlert();
                  }
                }
              }
            }
          });

          return nextTime;
        });
      }, stepIntervalMs);
    } else {
      if (tickerRef.current) clearInterval(tickerRef.current);
    }

    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, [isPlaying, selectedScenario, duration, soundMuted]);

  // Handle Experience Selection
  const handleSelectExperience = (exp: 'normal' | 'warning' | 'emergency' | 'sensor_fault' | 'recovery') => {
    soundEngine.playGateClick();
    setActiveExperience(exp);
    setCurrentTimeSec(0);
    setIsPlaying(false);
    lastKeyframeIndexRef.current = -1;

    let targetDef = PRESET_SCENARIOS[0];
    if (exp === 'warning') targetDef = warningVariant === 'hypoxia' ? PRESET_SCENARIOS[1] : PRESET_SCENARIOS[2];
    if (exp === 'emergency') targetDef = PRESET_SCENARIOS[3];
    if (exp === 'sensor_fault') targetDef = PRESET_SCENARIOS[4];
    if (exp === 'recovery') targetDef = PRESET_SCENARIOS[5];

    const startVitals = targetDef.keyframes[0]?.vitals ?? DEFAULT_VITALS;
    onApplyVitals(startVitals, targetDef.keyframes[0]?.sensors as any);
  };

  const handleTogglePlay = () => {
    soundEngine.playGateClick();
    if (currentTimeSec >= duration) {
      setCurrentTimeSec(0);
      lastKeyframeIndexRef.current = -1;
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    soundEngine.playGateClick();
    setIsPlaying(false);
    setCurrentTimeSec(0);
    lastKeyframeIndexRef.current = -1;
    const startVitals = selectedScenario.keyframes[0]?.vitals ?? DEFAULT_VITALS;
    onApplyVitals(startVitals, selectedScenario.keyframes[0]?.sensors as any);
  };

  const handleToggleSound = () => {
    const nextMuted = !soundMuted;
    setSoundMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) soundEngine.playGateClick();
  };

  // Evaluate real-time logic propositions based on current interpolated vitals
  const props = evaluatePropositions(currentVitals);
  const isHypoxiaActive = props.A; // SpO2 < 90
  const isCardiacActive = props.B; // HR < 50 or > 120
  const isConjunctionAlert = props.E_Combined; // A and B
  const isWarningAlert = props.W_Warning && !isConjunctionAlert; // single sensor
  const isSensorFault = selectedScenario.id === 'sensor_fault' && currentTimeSec >= 5;

  const progressPct = Math.min(100, Math.max(0, (currentTimeSec / duration) * 100));

  return (
    <section id="scenarios" className="relative w-full py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2 font-bold">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>INTERACTIVE SIMULATION SUITE • CLINICAL CAUSALITY</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            SEE HOW DISCRETE LOGIC SAVES LIVES
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
            Watch how patient condition changes are detected by biological sensors, processed in real time by
            Boolean logic gates, and synthesized into instant deterministic safety alerts.
          </p>
        </div>

        <button
          onClick={onRevealMath}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer self-start md:self-auto shrink-0"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>SOLVE THE MATH</span>
        </button>
      </div>

      {/* THE THREE PRIMARY EXPERIENCES (LARGE, VISUALLY DISTINCT CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Experience 1: EVERYTHING IS NORMAL */}
        <div
          onClick={() => handleSelectExperience('normal')}
          className={`p-6 rounded-3xl cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between border ${
            activeExperience === 'normal'
              ? 'bg-gradient-to-b from-[#05170f] via-[#04100c] to-[#030806] border-emerald-500/80 shadow-2xl shadow-emerald-950/60 ring-1 ring-emerald-500/40'
              : 'bg-[#050811]/90 border-white/[0.08] hover:border-emerald-500/30 hover:bg-[#071018]'
          }`}
        >
          {activeExperience === 'normal' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl border ${
                activeExperience === 'normal'
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-900 border-white/10 text-slate-400'
              }`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                activeExperience === 'normal'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-400 border border-white/8'
              }`}>
                SAFE HOMEOSTASIS
              </span>
            </div>

            <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
              1. EVERYTHING IS NORMAL
            </h3>
            <p className="text-slate-300 text-sm mt-2 font-light leading-relaxed">
              Patient is in steady equilibrium. Oxygen and pulse are within healthy physiological limits.
              The logic engine evaluates zero alarms.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs flex items-center justify-between">
              <span className="text-slate-400">Baseline Readings:</span>
              <span className="text-emerald-400 font-bold">SpO₂ 98% • HR 74 BPM</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Normal Telemetry
            </span>
            <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition-all ${
              activeExperience === 'normal'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 group-hover:text-white'
            }`}>
              {activeExperience === 'normal' ? 'SELECTED' : 'SELECT'}
            </span>
          </div>
        </div>

        {/* Experience 2: SOMETHING IS GOING WRONG */}
        <div
          onClick={() => handleSelectExperience('warning')}
          className={`p-6 rounded-3xl cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between border ${
            activeExperience === 'warning'
              ? 'bg-gradient-to-b from-[#191104] via-[#100a02] to-[#060402] border-amber-500/80 shadow-2xl shadow-amber-950/60 ring-1 ring-amber-500/40'
              : 'bg-[#050811]/90 border-white/[0.08] hover:border-amber-500/30 hover:bg-[#0e0a05]/50'
          }`}
        >
          {activeExperience === 'warning' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400" />
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl border ${
                activeExperience === 'warning'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-900 border-white/10 text-slate-400'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                activeExperience === 'warning'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-400 border border-white/8'
              }`}>
                ISOLATED WARNING
              </span>
            </div>

            <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
              2. SOMETHING IS GOING WRONG
            </h3>
            <p className="text-slate-300 text-sm mt-2 font-light leading-relaxed">
              A single parameter deteriorates while others remain stable. An isolated warning sounds,
              but conjunction logic suppresses a false Code Red alarm.
            </p>

            {/* Sub-variant toggle: Hypoxia vs Tachycardia */}
            <div className="mt-4 grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playGateClick();
                  setWarningVariant('hypoxia');
                  handleSelectExperience('warning');
                }}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                  warningVariant === 'hypoxia'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Low O₂ (Hypoxia)
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playGateClick();
                  setWarningVariant('tachycardia');
                  handleSelectExperience('warning');
                }}
                className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                  warningVariant === 'tachycardia'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                High Pulse (Tachy)
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Single Breach
            </span>
            <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition-all ${
              activeExperience === 'warning'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 group-hover:text-white'
            }`}>
              {activeExperience === 'warning' ? 'SELECTED' : 'SELECT'}
            </span>
          </div>
        </div>

        {/* Experience 3: EMERGENCY SITUATION */}
        <div
          onClick={() => handleSelectExperience('emergency')}
          className={`p-6 rounded-3xl cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between border ${
            activeExperience === 'emergency'
              ? 'bg-gradient-to-b from-[#1e070a] via-[#130406] to-[#080203] border-rose-500/80 shadow-2xl shadow-rose-950/70 ring-1 ring-rose-500/50'
              : 'bg-[#050811]/90 border-white/[0.08] hover:border-rose-500/30 hover:bg-[#15070a]/50'
          }`}
        >
          {activeExperience === 'emergency' && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-rose-400 animate-pulse" />
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl border ${
                activeExperience === 'emergency'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-slate-900 border-white/10 text-slate-400'
              }`}>
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                activeExperience === 'emergency'
                  ? 'bg-rose-500 text-white font-black animate-pulse'
                  : 'bg-slate-900 text-slate-400 border border-white/8'
              }`}>
                CODE RED EMERGENCY
              </span>
            </div>

            <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
              3. EMERGENCY SITUATION
            </h3>
            <p className="text-slate-300 text-sm mt-2 font-light leading-relaxed">
              Concurrent physiological failure. Oxygen drops below 90% AND heart rate spikes over 120 BPM.
              Conjunction ($A \land B$) is satisfied, instantly actuating Code Red.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs flex items-center justify-between">
              <span className="text-slate-400">Critical Conjunction:</span>
              <span className="text-rose-400 font-bold">SpO₂ 84% &lt; 90% ∧ HR 148 BPM</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4" /> Code Red Interlock
            </span>
            <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition-all ${
              activeExperience === 'emergency'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 group-hover:text-white'
            }`}>
              {activeExperience === 'emergency' ? 'SELECTED' : 'SELECT'}
            </span>
          </div>
        </div>
      </div>

      {/* OPTIONAL EXPERIMENTS ROW (Sensor Disconnection & Clinical Recovery) */}
      <div className="mb-10 p-4 rounded-2xl bg-[#080c14] border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Wrench className="w-4 h-4 text-slate-500" />
          <span className="font-bold text-slate-300">OPTIONAL SPECIALIZED EXPERIMENTS:</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => handleSelectExperience('sensor_fault')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              activeExperience === 'sensor_fault'
                ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-md shadow-yellow-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>SENSOR DISCONNECTION FAULT</span>
          </button>

          <button
            onClick={() => handleSelectExperience('recovery')}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              activeExperience === 'recovery'
                ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CLINICAL RECOVERY PROTOCOL</span>
          </button>
        </div>
      </div>

      {/* DEDICATED IMMERSIVE SIMULATION STAGE */}
      <div className={`rounded-3xl p-5 sm:p-7 relative border transition-all shadow-2xl ${
        isConjunctionAlert
          ? 'bg-[#0f070b] border-rose-500/50 shadow-rose-950/40'
          : isWarningAlert
          ? 'bg-[#0e0a05] border-amber-500/50 shadow-amber-950/30'
          : isSensorFault
          ? 'bg-[#0f0f08] border-yellow-500/50 shadow-yellow-950/30'
          : 'bg-[#070b14] border-slate-800 shadow-black/80'
      }`}>
        {/* Stage Header & Minimalistic Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold border ${
                isConjunctionAlert
                  ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                  : isWarningAlert
                  ? 'bg-amber-950 text-amber-300 border-amber-700'
                  : isSensorFault
                  ? 'bg-yellow-950 text-yellow-300 border-yellow-700'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-700'
              }`}>
                {isConjunctionAlert ? 'CRITICAL STATE' : isWarningAlert ? 'WARNING STATE' : isSensorFault ? 'TECHNICAL FAULT' : 'NORMAL EQUILIBRIUM'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {currentTimeSec.toFixed(1)}s / {duration.toFixed(1)}s
              </span>
            </div>

            <h3 className="font-display font-black text-2xl text-white mt-1">
              {selectedScenario.title}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5 font-light">
              {selectedScenario.clinicalContext}
            </p>
          </div>

          {/* Clean 2-Button Operation + Sound Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className={`px-6 py-3 rounded-2xl font-mono text-xs font-black tracking-wider uppercase flex items-center gap-2.5 transition-all shadow-xl cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/40 hover:scale-[1.02]'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE SIMULATION' : currentTimeSec > 0 ? 'RESUME SIMULATION' : 'START SIMULATION'}</span>
            </button>

            <button
              onClick={handleRestart}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Restart Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleSound}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                !soundMuted
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title={soundMuted ? 'Telemetry Audio Muted (Click to Unmute)' : 'Telemetry Audio Active (Click to Mute)'}
            >
              {!soundMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Clean Progress Line */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-6 border border-slate-800">
          <div
            className={`h-full transition-all duration-75 ${
              isConjunctionAlert ? 'bg-rose-500' : isWarningAlert ? 'bg-amber-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* THE VISUAL SIMULATION ARENA (TWO CONNECTED COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ZONE A: THE ICU PATIENT & CLINICAL MONITOR (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#090d16] border border-slate-800 p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Background Image of Modern ICU Room */}
            <div
              className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-luminosity pointer-events-none"
              style={{ backgroundImage: `url('${import.meta.env.BASE_URL}icu-room.jpg')` }}
            />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
                  <Activity className="w-3.5 h-3.5 text-blue-400" /> BEDSIDE PATIENT TELEMETRY MONITOR
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  currentVitals.sensorLeadAttached ? 'bg-emerald-950 text-emerald-400' : 'bg-yellow-950 text-yellow-400'
                }`}>
                  {currentVitals.sensorLeadAttached ? 'LEADS ATTACHED' : 'LEAD FAULT'}
                </span>
              </div>

              {/* Oscilloscope Waveform Display */}
              <div className="rounded-xl bg-[#03060d] border border-slate-800 p-2 mb-4 overflow-hidden relative">
                <div className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-1 flex justify-between">
                  <span>LEAD II (ECG)</span>
                  <span>{currentVitals.heartRate} BPM</span>
                </div>
                <WaveformCanvas
                  type="ecg"
                  bpm={currentVitals.heartRate}
                  oxygen={currentVitals.oxygen}
                  color={isCardiacActive ? '#f43f5e' : '#38bdf8'}
                  glowColor={isCardiacActive ? 'rgba(244, 63, 94, 0.4)' : 'rgba(56, 189, 248, 0.4)'}
                  height={80}
                  isFault={!currentVitals.sensorLeadAttached}
                />
              </div>

              {/* Digital Parameter Displays */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Oxygen Saturation */}
                <div className={`p-3.5 rounded-xl border transition-all ${
                  isHypoxiaActive
                    ? 'bg-rose-950/40 border-rose-500/80 shadow-md shadow-rose-950/40'
                    : 'bg-slate-900/90 border-slate-800'
                }`}>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span className="font-bold uppercase">SpO₂ OXYGEN</span>
                    <span className="text-slate-500">&lt; 90%</span>
                  </div>
                  <div className={`text-3xl font-mono font-black mt-1 ${
                    isHypoxiaActive ? 'text-rose-400 animate-pulse' : 'text-cyan-400'
                  }`}>
                    {currentVitals.oxygen}%
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${isHypoxiaActive ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                    {isHypoxiaActive ? 'CRITICAL HYPOXIA' : 'NORMAL RANGE'}
                  </div>
                </div>

                {/* Heart Rate */}
                <div className={`p-3.5 rounded-xl border transition-all ${
                  isCardiacActive
                    ? 'bg-rose-950/40 border-rose-500/80 shadow-md shadow-rose-950/40'
                    : 'bg-slate-900/90 border-slate-800'
                }`}>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span className="font-bold uppercase flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" /> HEART RATE
                    </span>
                    <span className="text-slate-500">[50-120]</span>
                  </div>
                  <div className={`text-3xl font-mono font-black mt-1 ${
                    isCardiacActive ? 'text-rose-400 animate-pulse' : 'text-white'
                  }`}>
                    {currentVitals.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${isCardiacActive ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                    {isCardiacActive ? (currentVitals.heartRate > 120 ? 'TACHYCARDIA' : 'BRADYCARDIA') : 'SINUS RHYTHM'}
                  </div>
                </div>
              </div>

              {/* Secondary Vitals */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">NIBP:</span>
                  <span className="text-slate-300 font-bold">{currentVitals.bloodPressureSystolic}/{currentVitals.bloodPressureDiastolic}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resp Rate:</span>
                  <span className="text-slate-300 font-bold">{currentVitals.respiratoryRate} RPM</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Patient Sensor Channels: Active</span>
              <span className="text-blue-400 font-bold">500 Hz Sampling</span>
            </div>
          </div>

          {/* ZONE B: REAL-TIME SIGNAL CONDUIT & LOGIC GATE (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#090d16] border border-slate-800 p-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  REAL-TIME SIGNAL EVALUATION & LOGIC ENGINE
                </span>
                <span className="text-[10px] font-mono text-blue-400">
                  SEQUENCE: SENSOR → COMPARATOR → GATE → ALARM
                </span>
              </div>

              {/* VISUAL SIGNAL CONDUITS & AND GATE DIAGRAM */}
              <div className="p-4 rounded-xl bg-[#050810] border border-slate-800/90 relative overflow-hidden">
                <div className="space-y-4">
                  {/* Channel A Signal Wire */}
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="w-28 text-slate-400 shrink-0">
                      <div className="text-[10px] uppercase text-cyan-400 font-bold">O₂ Channel</div>
                      <div className="text-white font-bold">{currentVitals.oxygen}% &lt; 90</div>
                    </div>

                    {/* Animated Wire A */}
                    <div className="flex-1 h-3 rounded-full bg-slate-900 border border-slate-800 relative overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isHypoxiaActive
                            ? 'bg-rose-500 shadow-md shadow-rose-500/80 w-full animate-pulse'
                            : 'bg-slate-800 w-full'
                        }`}
                      />
                    </div>

                    <div className={`w-28 text-right font-bold text-xs shrink-0 ${
                      isHypoxiaActive ? 'text-rose-400 font-black' : 'text-slate-500'
                    }`}>
                      A = {isHypoxiaActive ? '1 (HIGH)' : '0 (LOW)'}
                    </div>
                  </div>

                  {/* Channel B Signal Wire */}
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="w-28 text-slate-400 shrink-0">
                      <div className="text-[10px] uppercase text-rose-400 font-bold">ECG Channel</div>
                      <div className="text-white font-bold">{currentVitals.heartRate} BPM</div>
                    </div>

                    {/* Animated Wire B */}
                    <div className="flex-1 h-3 rounded-full bg-slate-900 border border-slate-800 relative overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isCardiacActive
                            ? 'bg-rose-500 shadow-md shadow-rose-500/80 w-full animate-pulse'
                            : 'bg-slate-800 w-full'
                        }`}
                      />
                    </div>

                    <div className={`w-28 text-right font-bold text-xs shrink-0 ${
                      isCardiacActive ? 'text-rose-400 font-black' : 'text-slate-500'
                    }`}>
                      B = {isCardiacActive ? '1 (HIGH)' : '0 (LOW)'}
                    </div>
                  </div>

                  {/* Central AND Gate Evaluator Box */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between font-mono transition-all ${
                    isConjunctionAlert
                      ? 'bg-rose-950/60 border-rose-500 text-white shadow-xl shadow-rose-950/60 animate-pulse'
                      : isWarningAlert
                      ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        CONJUNCTION GATE: E = A ∧ B
                      </div>
                      <div className="text-lg font-black mt-0.5">
                        {isHypoxiaActive ? '1' : '0'} ∧ {isCardiacActive ? '1' : '0'} = {isConjunctionAlert ? '1 (EMERGENCY)' : '0 (QUIESCENT)'}
                      </div>
                    </div>

                    <div className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                      isConjunctionAlert
                        ? 'bg-rose-500 text-white shadow-lg'
                        : isWarningAlert
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      GATE OUTPUT: {isConjunctionAlert ? 'HIGH (1)' : 'LOW (0)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* RESULTING ALERT ACTUATION BANNER */}
              <div className={`mt-4 p-4 rounded-xl border flex items-center gap-3 transition-all ${
                isConjunctionAlert
                  ? 'bg-rose-600 text-white border-rose-400 shadow-xl shadow-rose-600/40 animate-pulse'
                  : isWarningAlert
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : isSensorFault
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                  : 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
              }`}>
                {isConjunctionAlert ? (
                  <AlertOctagon className="w-6 h-6 shrink-0 animate-bounce" />
                ) : isWarningAlert ? (
                  <AlertTriangle className="w-6 h-6 shrink-0" />
                ) : isSensorFault ? (
                  <Radio className="w-6 h-6 shrink-0" />
                ) : (
                  <ShieldCheck className="w-6 h-6 shrink-0" />
                )}

                <div className="flex-1 font-mono text-xs">
                  <div className="font-extrabold uppercase">
                    {isConjunctionAlert
                      ? 'CODE RED EMERGENCY INTERLOCK TRIPPED'
                      : isWarningAlert
                      ? 'ISOLATED ADVISORY WARNING (CODE RED SUPPRESSED)'
                      : isSensorFault
                      ? 'TECHNICAL SENSOR FAULT DETECTED (NOT CARDIAC EMERGENCY)'
                      : 'NORMAL HOMEOSTASIS PRESERVED'}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5 font-sans">
                    {isConjunctionAlert
                      ? 'Simultaneous respiratory and circulatory failure detected. Both premises verified true.'
                      : isWarningAlert
                      ? 'Single vital deviation. The AND gate suppresses false Code Red alarms.'
                      : isSensorFault
                      ? 'Electrode impedance exceeded limits. System flags lead-off without triggering false resuscitation.'
                      : 'All vital signs safely within calibrated physiological boundaries.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Explanatory Footer with SOLVE THE MATH Action */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <span className="text-slate-400">
                Want to examine the mathematical proof for this scenario?
              </span>
              <button
                onClick={onRevealMath}
                className="text-blue-400 font-bold hover:text-blue-300 hover:underline flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-blue-400" />
                <span>OPEN IN SOLVE THE MATH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScenarioPlayer;
