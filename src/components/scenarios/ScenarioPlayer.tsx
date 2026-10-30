import React, { useState, useEffect, useRef } from 'react';
import type { ScenarioDefinition, VitalsState, SystemStatus, SensorChannelsState, AlarmEvent } from '../../types';
import { PRESET_SCENARIOS, DEFAULT_VITALS, DEFAULT_SENSORS } from '../../utils/constants';
import { soundEngine } from '../../utils/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  Activity, 
  Flame, 
  Radio, 
  Zap, 
  ArrowRight,
  Clock,
  FastForward
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
  onRevealMath,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDefinition>(PRESET_SCENARIOS[3]); // Default to Combined Emergency
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x

  const lastKeyframeIndexRef = useRef<number>(-1);
  const tickerRef = useRef<number | null>(null);

  const duration = selectedScenario.durationSec || 12;

  // Linear interpolation utility
  const lerp = (start: number, end: number, t: number) => start + (end - start) * Math.max(0, Math.min(1, t));

  // Compute interpolated vitals at exact timestamp
  const computeStateAtTime = (t: number) => {
    const keyframes = selectedScenario.keyframes;
    if (!keyframes || keyframes.length === 0) return selectedScenario.targetVitals;

    // Find bounding keyframes
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

  // Simulation Ticker
  useEffect(() => {
    if (isPlaying) {
      const stepIntervalMs = 50;
      const stepSec = (stepIntervalMs / 1000) * playbackSpeed;

      tickerRef.current = window.setInterval(() => {
        setCurrentTimeSec((prevTime) => {
          const nextTime = prevTime + stepSec;

          if (nextTime >= duration) {
            setIsPlaying(false);
            // Apply final keyframe state
            const finalState = computeStateAtTime(duration);
            onApplyVitals(finalState, selectedScenario.targetSensors as any);
            return duration;
          }

          // Apply live interpolated vitals to system
          const currentState = computeStateAtTime(nextTime);
          onApplyVitals(currentState);

          // Check if passed a new keyframe with an alarm event
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
                if (kf.alarmEvent.severity === 'CRITICAL') {
                  soundEngine.playEmergencyAlarm();
                } else if (kf.alarmEvent.severity === 'WARNING') {
                  soundEngine.playWarning();
                } else if (kf.alarmEvent.severity === 'TECHNICAL') {
                  soundEngine.playTechnicalAlert();
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
  }, [isPlaying, playbackSpeed, selectedScenario, duration]);

  // Handle Scenario Selection
  const handleSelectScenario = (scenario: ScenarioDefinition) => {
    soundEngine.playGateClick();
    setSelectedScenario(scenario);
    setCurrentTimeSec(0);
    setIsPlaying(false);
    lastKeyframeIndexRef.current = -1;

    // Reset to start of scenario
    const startVitals = scenario.keyframes[0]?.vitals ?? DEFAULT_VITALS;
    onApplyVitals(startVitals, scenario.keyframes[0]?.sensors as any);
  };

  const handleTogglePlay = () => {
    soundEngine.playGateClick();
    if (currentTimeSec >= duration) {
      setCurrentTimeSec(0);
      lastKeyframeIndexRef.current = -1;
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    soundEngine.playGateClick();
    setIsPlaying(false);
    setCurrentTimeSec(0);
    lastKeyframeIndexRef.current = -1;
    onApplyVitals(DEFAULT_VITALS, DEFAULT_SENSORS as any);
  };

  const handleStepForward = () => {
    soundEngine.playGateClick();
    const keyframes = selectedScenario.keyframes;
    const nextKf = keyframes.find((k) => k.timeSec > currentTimeSec + 0.1);
    if (nextKf) {
      setCurrentTimeSec(nextKf.timeSec);
      const state = computeStateAtTime(nextKf.timeSec);
      onApplyVitals(state, nextKf.sensors as any);
    } else {
      setCurrentTimeSec(duration);
    }
  };

  const handleStepBack = () => {
    soundEngine.playGateClick();
    const keyframes = selectedScenario.keyframes;
    const prevKfs = keyframes.filter((k) => k.timeSec < currentTimeSec - 0.1);
    if (prevKfs.length > 0) {
      const prevKf = prevKfs[prevKfs.length - 1];
      setCurrentTimeSec(prevKf.timeSec);
      const state = computeStateAtTime(prevKf.timeSec);
      onApplyVitals(state, prevKf.sensors as any);
    } else {
      setCurrentTimeSec(0);
    }
  };

  const handleScrub = (valSec: number) => {
    setCurrentTimeSec(valSec);
    const state = computeStateAtTime(valSec);
    onApplyVitals(state);
  };

  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'normal':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'hypoxia':
        return <Activity className="w-5 h-5 text-blue-400" />;
      case 'tachycardia':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'combined_emergency':
        return <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />;
      case 'sensor_fault':
        return <Radio className="w-5 h-5 text-yellow-400" />;
      case 'recovery':
        return <CheckCircle2 className="w-5 h-5 text-teal-400" />;
      default:
        return <Activity className="w-5 h-5 text-blue-400" />;
    }
  };

  // Find active narrative milestone for current time
  const currentKeyframe = [...selectedScenario.keyframes]
    .reverse()
    .find((k) => currentTimeSec >= k.timeSec) || selectedScenario.keyframes[0];

  return (
    <section id="scenarios" className="relative w-full py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>DETERMINISTIC SIMULATION ENGINE • 6 CLINICAL SCENARIOS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            THE EMERGENCY SIMULATION SUITE
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
            Experience time-based physiological progression. Watch telemetry degrade second-by-second,
            triggering individual warnings and conjunction emergency alerts in real time.
          </p>
        </div>

        <button
          onClick={onRevealMath}
          className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-white" />
          SOLVE THE MATH
        </button>
      </div>

      {/* 6 Scenario Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {PRESET_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={`p-5 rounded-2xl cursor-pointer transition-all relative overflow-hidden group border ${
                isSelected
                  ? sc.id === 'combined_emergency'
                    ? 'bg-rose-950/30 border-rose-500 shadow-xl shadow-rose-950/40'
                    : 'bg-[#101726] border-blue-500 shadow-xl shadow-blue-950/40'
                  : 'bg-[#090d16] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {isSelected && (
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    sc.id === 'combined_emergency' ? 'bg-rose-500' : 'bg-blue-500'
                  }`}
                />
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    isSelected ? 'bg-blue-500/15 border-blue-500/40' : 'bg-slate-800 border-slate-700'
                  }`}>
                    {getScenarioIcon(sc.id)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                      {sc.badge}
                    </span>
                    <h3 className="font-display font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                      {sc.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-light line-clamp-2 mb-3">
                {sc.description}
              </p>

              {/* Proposition State Badges */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
                <span className={`px-2 py-0.5 rounded ${sc.expectedA ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'}`}>
                  A: {sc.expectedA ? '1' : '0'}
                </span>
                <span className={`px-2 py-0.5 rounded ${sc.expectedB ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'}`}>
                  B: {sc.expectedB ? '1' : '0'}
                </span>
                <span className={`px-2 py-0.5 rounded font-bold ${sc.expectedE ? 'bg-rose-500 text-white font-extrabold' : 'bg-slate-800 text-slate-400'}`}>
                  E = {sc.expectedE ? '1 (EMERGENCY)' : '0 (NORMAL)'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE TIMELINE PLAYOUT STAGE */}
      <div className={`rounded-2xl p-6 relative border transition-all ${
        selectedScenario.id === 'combined_emergency'
          ? 'border-rose-500/40 bg-[#0d0914] shadow-2xl shadow-rose-950/30'
          : 'border-slate-800 bg-[#0b0f19] shadow-xl'
      }`}>
        {/* Playback Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 font-bold">
                TIMELINE ENGINE: {selectedScenario.badge}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {currentTimeSec.toFixed(1)}s / {duration.toFixed(1)}s
              </span>
            </div>
            <h3 className="font-display font-extrabold text-xl text-white mt-1.5">
              {selectedScenario.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Clinical Context: {selectedScenario.clinicalContext}
            </p>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Play/Pause */}
            <button
              onClick={handleTogglePlay}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE TIMELINE' : 'PLAY SIMULATION'}</span>
            </button>

            {/* Step Back */}
            <button
              onClick={handleStepBack}
              disabled={currentTimeSec <= 0}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40"
              title="Previous Keyframe"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Step Forward */}
            <button
              onClick={handleStepForward}
              disabled={currentTimeSec >= duration}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40"
              title="Next Keyframe"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Reset to Baseline Homeostasis"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Playback Speed */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono ml-1">
              <FastForward className="w-3.5 h-3.5 text-slate-500 ml-1" />
              {[1, 2].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setPlaybackSpeed(sp)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    playbackSpeed === sp ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sp}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time Scrubber Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
            <span>SCRUB SIMULATION TIMELINE:</span>
            <span className="text-white font-bold">{currentTimeSec.toFixed(1)}s elapsed</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTimeSec}
            onChange={(e) => handleScrub(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>0.0s (Baseline)</span>
            <span>{(duration / 2).toFixed(1)}s (Transition)</span>
            <span>{duration.toFixed(1)}s (Terminal State)</span>
          </div>
        </div>

        {/* Active Keyframe Callout Banner */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
              ACTIVE STAGE AT {currentTimeSec.toFixed(1)}s: {currentKeyframe.label}
            </div>
            <p className="text-sm font-sans text-slate-200 mt-1 font-medium">
              {currentKeyframe.narrative}
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 shrink-0">
            {isPlaying ? (
              <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold animate-pulse">
                SIMULATING IN REAL-TIME
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400">
                PAUSED AT {currentTimeSec.toFixed(1)}s
              </span>
            )}
          </div>
        </div>

        {/* Chronological Keyframe Steps Progression */}
        <div className="space-y-2.5">
          {selectedScenario.keyframes.map((kf, idx) => {
            const isReached = currentTimeSec >= kf.timeSec;
            const isCurrent = currentKeyframe.timeSec === kf.timeSec;

            return (
              <div
                key={idx}
                onClick={() => {
                  soundEngine.playGateClick();
                  handleScrub(kf.timeSec);
                }}
                className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-4 border ${
                  isCurrent
                    ? selectedScenario.id === 'combined_emergency'
                      ? 'bg-rose-950/40 border-rose-500 text-white font-semibold shadow-md'
                      : 'bg-blue-950/40 border-blue-500 text-white font-semibold shadow-md'
                    : isReached
                    ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                    : 'bg-slate-900/15 border-slate-800/40 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isCurrent
                        ? selectedScenario.id === 'combined_emergency'
                          ? 'bg-rose-500 text-white'
                          : 'bg-blue-600 text-white'
                        : isReached
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    {kf.timeSec}s
                  </span>
                  <div>
                    <div className="font-mono text-xs font-bold text-white">
                      {kf.label}
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">
                      {kf.narrative}
                    </div>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-slate-500 hidden sm:block shrink-0">
                  {isCurrent ? (
                    <span className="text-blue-400 font-bold uppercase animate-pulse">ACTIVE NOW</span>
                  ) : isReached ? (
                    <span className="text-emerald-500 font-bold">COMPLETED ✓</span>
                  ) : (
                    <span>QUEUED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Link to Mathematical Proof */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <span>Continuous data piped live into Patient Telemetry & Logic Engine above.</span>
          <button
            onClick={onRevealMath}
            className="text-blue-400 font-bold hover:underline flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-blue-400" />
            Launch Solve the Math Laboratory for this Scenario
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
