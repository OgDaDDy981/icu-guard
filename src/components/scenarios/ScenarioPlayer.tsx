import React, { useState, useEffect, useRef } from 'react';
import type { ScenarioDefinition, VitalsState, SystemStatus } from '../../types';
import { PRESET_SCENARIOS } from '../../utils/constants';
import { soundEngine } from '../../utils/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  Activity, 
  Flame, 
  Radio, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface ScenarioPlayerProps {
  onApplyScenario: (scenario: ScenarioDefinition) => void;
  currentVitals: VitalsState;
  systemStatus: SystemStatus;
  onRevealMath: () => void;
}

export const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({
  onApplyScenario,
  onRevealMath,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDefinition>(PRESET_SCENARIOS[0]);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const stepTimerRef = useRef<number | null>(null);

  // Handle Scenario Selection
  const handleSelect = (scenario: ScenarioDefinition) => {
    setSelectedScenario(scenario);
    setCurrentStepIndex(0);
    setIsPlayingAuto(false);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);

    // Apply scenario vitals
    onApplyScenario(scenario);

    // Play appropriate sound
    if (scenario.id === 'combined_emergency') {
      soundEngine.playEmergencyAlarm();
    } else if (scenario.id === 'hypoxia' || scenario.id === 'tachycardia' || scenario.id === 'sensor_fault') {
      soundEngine.playWarning();
    } else {
      soundEngine.playGateClick();
    }
  };

  // Automated Step Progression
  useEffect(() => {
    if (isPlayingAuto) {
      stepTimerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= selectedScenario.narrativeSteps.length - 1) {
            setIsPlayingAuto(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2600);
    } else {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    }

    return () => {
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, [isPlayingAuto, selectedScenario]);

  const toggleAutoPlay = () => {
    if (!isPlayingAuto && currentStepIndex >= selectedScenario.narrativeSteps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlayingAuto(!isPlayingAuto);
  };

  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'normal':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'hypoxia':
        return <Activity className="w-5 h-5 text-cyan-400" />;
      case 'tachycardia':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'combined_emergency':
        return <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />;
      case 'sensor_fault':
        return <Radio className="w-5 h-5 text-amber-400" />;
      case 'recovery':
        return <CheckCircle2 className="w-5 h-5 text-teal-400" />;
      default:
        return <Activity className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="scenarios" className="relative w-full py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>CLINICAL SIMULATION MODULE • 6 VERIFIED CASES</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            THE EMERGENCY SIMULATION SUITE
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
            Select an operational scenario to witness how the Discrete Logic Engine handles homeostasis,
            isolated single-variable anomalies, simultaneous crises, and sensor impedance faults.
          </p>
        </div>

        {/* Global Reveal Math Button */}
        <button
          onClick={onRevealMath}
          className="px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02]"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          REVEAL THE MATH BEHIND
        </button>
      </div>

      {/* 6 Scenario Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {PRESET_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => handleSelect(sc)}
              className={`p-5 rounded-2xl cursor-pointer transition-all relative overflow-hidden group border ${
                isSelected
                  ? sc.id === 'combined_emergency'
                    ? 'bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-500/20'
                    : 'bg-slate-900/90 border-cyan-400 shadow-xl shadow-cyan-500/20'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Active Indicator Bar */}
              {isSelected && (
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    sc.id === 'combined_emergency' ? 'bg-rose-500' : 'bg-cyan-400'
                  }`}
                />
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${
                    isSelected ? 'bg-cyan-500/20 border-cyan-500/40' : 'bg-slate-800/80 border-slate-700'
                  }`}>
                    {getScenarioIcon(sc.id)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                      {sc.badge}
                    </span>
                    <h3 className="font-display font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {sc.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300/90 font-light line-clamp-2 mb-3">
                {sc.description}
              </p>

              {/* Logic State Pills */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
                <span className={`px-2 py-0.5 rounded ${sc.expectedA ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'}`}>
                  A: {sc.expectedA ? '1' : '0'}
                </span>
                <span className={`px-2 py-0.5 rounded ${sc.expectedB ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'}`}>
                  B: {sc.expectedB ? '1' : '0'}
                </span>
                <span className={`px-2 py-0.5 rounded font-bold ${sc.expectedE ? 'bg-rose-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400'}`}>
                  E = {sc.expectedE ? '1 (ALARM)' : '0 (SAFE)'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Scenario Interactive Sequence Walkthrough Stage */}
      <div className={`glass-panel rounded-2xl p-6 relative border transition-all ${
        selectedScenario.id === 'combined_emergency'
          ? 'border-rose-500/50 bg-rose-950/20 shadow-2xl shadow-rose-950/40'
          : 'border-cyan-500/30'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold">
                ACTIVE SCENARIO PLAYOUT: {selectedScenario.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Step {currentStepIndex + 1} of {selectedScenario.narrativeSteps.length}
              </span>
            </div>
            <h3 className="font-display font-extrabold text-xl text-white mt-1">
              {selectedScenario.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Clinical Context: {selectedScenario.clinicalContext}
            </p>
          </div>

          {/* Autoplay & Step Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAutoPlay}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                isPlayingAuto
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/30'
              }`}
            >
              {isPlayingAuto ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
              {isPlayingAuto ? 'PAUSE AUTO-PLAY' : 'AUTO-PLAY SEQUENCE'}
            </button>

            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlayingAuto(false);
              }}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Reset Steps"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Narrative Step Timeline */}
        <div className="space-y-3">
          {selectedScenario.narrativeSteps.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;

            return (
              <div
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-4 border ${
                  isCurrent
                    ? selectedScenario.id === 'combined_emergency'
                      ? 'bg-rose-950/60 border-rose-500 text-white font-semibold shadow-md'
                      : 'bg-cyan-950/50 border-cyan-400 text-white font-semibold shadow-md'
                    : isPast
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                    : 'bg-slate-900/20 border-slate-800/40 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      isCurrent
                        ? selectedScenario.id === 'combined_emergency'
                          ? 'bg-rose-500 text-white'
                          : 'bg-cyan-400 text-slate-950'
                        : isPast
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-mono text-xs sm:text-sm">{step}</span>
                </div>

                <div className="font-mono text-[10px] text-slate-500 hidden sm:block">
                  {isCurrent ? (
                    <span className="text-cyan-400 font-bold uppercase animate-pulse">PROCESSING</span>
                  ) : isPast ? (
                    <span className="text-emerald-500">VERIFIED ✓</span>
                  ) : (
                    <span>QUEUED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <span>
            Telemetry target vitals applied automatically to live patient canvas above.
          </span>
          <button
            onClick={onRevealMath}
            className="text-cyan-400 font-bold hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Launch 6-Act Mathematical Proof for this Scenario
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
