import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audio';
import { WaveformCanvas } from '../telemetry/WaveformCanvas';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Heart, 
  Activity, 
  Cpu, 
  Radio, 
  Zap, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMathTheater?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

interface DemoScene {
  id: number;
  label: string;
  tagline: string;
  title: string;
  explanation: string;
  durationSec: number;
  vitals: {
    heartRate: number;
    oxygen: number;
    temperature: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    respiratoryRate: number;
  };
  conditionA: boolean; // Oxygen < 90%
  conditionB: boolean; // HR < 50 or > 120
  alertState: 'NORMAL' | 'WARNING' | 'EMERGENCY' | 'RECOVERED';
}

const DEMO_SCENES: DemoScene[] = [
  {
    id: 1,
    label: '01. INTRO',
    tagline: 'WELCOME TO ICU GUARD',
    title: 'How Simple Logic Prevents Dangerous Hospital Alarms',
    explanation: 'In busy intensive care units, false alarms cause acute alarm fatigue. ICU GUARD demonstrates how discrete Boolean logic correlates multiple patient sensors to guarantee safety without false panic.',
    durationSec: 9,
    vitals: {
      heartRate: 74,
      oxygen: 98,
      temperature: 36.8,
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 78,
      respiratoryRate: 16,
    },
    conditionA: false,
    conditionB: false,
    alertState: 'NORMAL',
  },
  {
    id: 2,
    label: '02. NORMAL MONITOR',
    tagline: 'STAGE 1 • STABLE MONITORING',
    title: 'Patient is Stable in Safe Equilibrium',
    explanation: 'Vital signs are measured continuously: Heart Rate (74 BPM) and Oxygen Saturation (98%). Both values reside comfortably within safe clinical boundaries. The logic engine evaluates zero alarms.',
    durationSec: 10,
    vitals: {
      heartRate: 74,
      oxygen: 98,
      temperature: 36.8,
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 78,
      respiratoryRate: 16,
    },
    conditionA: false,
    conditionB: false,
    alertState: 'NORMAL',
  },
  {
    id: 3,
    label: '03. OXYGEN DROP',
    tagline: 'STAGE 2 • SINGLE PARAMETER CHANGE',
    title: 'Oxygen Level is Falling (Low O₂)',
    explanation: 'Capillary oxygen drops to 85% (< 90% threshold). Condition A becomes TRUE (1). Heart rate remains stable at 74 BPM. An isolated advisory warning sounds, but the full emergency siren is suppressed.',
    durationSec: 12,
    vitals: {
      heartRate: 74,
      oxygen: 85,
      temperature: 37.0,
      bloodPressureSystolic: 122,
      bloodPressureDiastolic: 80,
      respiratoryRate: 18,
    },
    conditionA: true,
    conditionB: false,
    alertState: 'WARNING',
  },
  {
    id: 4,
    label: '04. LOGIC ENGINE',
    tagline: 'STAGE 3 • DISCRETE EVALUATION',
    title: 'How the Logic Engine Prevents False Alarms',
    explanation: 'Single-sensor drops happen all the time when a patient moves or a clip loosens. The logic engine requires both respiratory and cardiac signs to fail (A AND B) before declaring a critical Code Red.',
    durationSec: 11,
    vitals: {
      heartRate: 74,
      oxygen: 85,
      temperature: 37.0,
      bloodPressureSystolic: 122,
      bloodPressureDiastolic: 80,
      respiratoryRate: 18,
    },
    conditionA: true,
    conditionB: false,
    alertState: 'WARNING',
  },
  {
    id: 5,
    label: '05. EMERGENCY',
    tagline: 'STAGE 4 • CRITICAL CONJUNCTION',
    title: 'Multiple Conditions Detected: Emergency Alert',
    explanation: 'Both vital signs now cross critical boundaries simultaneously: Oxygen drops to 84% AND Heart Rate surges to 148 BPM. Because Condition A = 1 and Condition B = 1, the AND gate evaluates to 1 and trips the Emergency Alert.',
    durationSec: 13,
    vitals: {
      heartRate: 148,
      oxygen: 84,
      temperature: 38.6,
      bloodPressureSystolic: 154,
      bloodPressureDiastolic: 96,
      respiratoryRate: 28,
    },
    conditionA: true,
    conditionB: true,
    alertState: 'EMERGENCY',
  },
  {
    id: 6,
    label: '06. RECOVERY',
    tagline: 'STAGE 5 • PHYSIOLOGICAL RESTORATION',
    title: 'Patient Readings Returning to Normal',
    explanation: 'Following clinical intervention, oxygen rises back to 98% and heart rate settles to 74 BPM. Both conditions return to FALSE (0). The logic gate unlatches, and alarms automatically resolve.',
    durationSec: 10,
    vitals: {
      heartRate: 74,
      oxygen: 98,
      temperature: 36.8,
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 78,
      respiratoryRate: 16,
    },
    conditionA: false,
    conditionB: false,
    alertState: 'RECOVERED',
  },
  {
    id: 7,
    label: '07. EXPLORE',
    tagline: 'STAGE 6 • READY TO EXPLORE',
    title: 'Explore the Full ICU GUARD Experience',
    explanation: 'Now that you have seen the core simulation in action, dive into the interactive monitor, test custom medical scenarios, test sensor disconnections, or enter the dedicated Solve the Math laboratory.',
    durationSec: 12,
    vitals: {
      heartRate: 74,
      oxygen: 98,
      temperature: 36.8,
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 78,
      respiratoryRate: 16,
    },
    conditionA: false,
    conditionB: false,
    alertState: 'NORMAL',
  },
];

export const PresentationMode: React.FC<PresentationModeProps> = ({
  isOpen,
  onClose,
  onOpenMathTheater,
  onNavigateSection,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [sceneElapsedTime, setSceneElapsedTime] = useState<number>(0);

  const activeScene = DEMO_SCENES[currentSceneIndex];
  const timerRef = useRef<number | null>(null);

  // Auto-play timer loop
  useEffect(() => {
    if (!isOpen) return;

    if (isPlaying) {
      const intervalMs = 100;
      const stepSec = intervalMs / 1000;

      timerRef.current = window.setInterval(() => {
        setSceneElapsedTime((prev) => {
          const next = prev + stepSec;
          if (next >= activeScene.durationSec) {
            // Advance to next scene or loop back at the end
            setCurrentSceneIndex((currIdx) => {
              if (currIdx < DEMO_SCENES.length - 1) {
                return currIdx + 1;
              } else {
                setIsPlaying(false);
                return currIdx;
              }
            });
            return 0;
          }
          return next;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying, activeScene.durationSec]);

  // Reset timer on scene change
  useEffect(() => {
    setSceneElapsedTime(0);
  }, [currentSceneIndex]);

  // Keyboard navigation & accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSceneIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    soundEngine.playGateClick();
    if (currentSceneIndex < DEMO_SCENES.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
      setSceneElapsedTime(0);
    }
  };

  const handlePrev = () => {
    soundEngine.playGateClick();
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
      setSceneElapsedTime(0);
    }
  };

  const handleRestart = () => {
    soundEngine.playGateClick();
    setCurrentSceneIndex(0);
    setSceneElapsedTime(0);
    setIsPlaying(true);
  };

  const handleSelectScene = (idx: number) => {
    soundEngine.playGateClick();
    setCurrentSceneIndex(idx);
    setSceneElapsedTime(0);
  };

  const handleExploreAction = (targetSectionId: string) => {
    onClose();
    if (onNavigateSection) {
      onNavigateSection(targetSectionId);
    } else {
      const el = document.getElementById(targetSectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Waveform styling derived from scene state
  const isEmergency = activeScene.alertState === 'EMERGENCY';
  const isWarning = activeScene.alertState === 'WARNING';

  const waveformColor = isEmergency ? '#d96347' : isWarning ? '#e5933a' : '#5da283';
  const waveformGlow = isEmergency
    ? 'rgba(217, 99, 71, 0.45)'
    : isWarning
    ? 'rgba(229, 147, 58, 0.4)'
    : 'rgba(93, 162, 131, 0.35)';

  const sceneProgressPct = Math.min(
    100,
    Math.max(0, (sceneElapsedTime / activeScene.durationSec) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#0c0d10]/95 backdrop-blur-2xl animate-in fade-in duration-300">
      {/* Main Presentation Container */}
      <div className="relative w-full max-w-5xl bg-[#14161c] border border-[#faf6f0]/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Background Visual Texture */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-12 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}warm-icu-room.jpg')` }}
        />

        {/* Top Header Bar */}
        <div className="relative z-10 px-6 py-4 bg-[#181a20]/90 border-b border-[#faf6f0]/8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#d96347] to-[#e5933a] text-white shadow-md shadow-[#d96347]/20">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#d96347] font-bold">
                  AUTOMATED PRODUCT DEMONSTRATION
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#faf6f0]/5 text-[#c5beaf] border border-[#faf6f0]/10 font-mono">
                  SCENE {currentSceneIndex + 1} OF {DEMO_SCENES.length}
                </span>
              </div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-[#faf6f0]">
                ICU GUARD Interactive Overview
              </h2>
            </div>
          </div>

          {/* Quick Player Status & Exit Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isPlaying
                  ? 'bg-[#e5933a] text-[#111215] shadow-md shadow-[#e5933a]/25'
                  : 'bg-[#1e2027] text-[#faf6f0] hover:bg-[#282a33]'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'RESUME'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-[#1e2027] hover:bg-[#282a33] text-[#c5beaf] hover:text-white border border-[#faf6f0]/10 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Exit Presenter Mode (Esc)"
            >
              <X className="w-4 h-4" />
              <span>EXIT</span>
            </button>
          </div>
        </div>

        {/* Scene Timeline Scrub Bar */}
        <div className="relative z-10 px-4 sm:px-6 py-2.5 bg-[#101217] border-b border-[#faf6f0]/8 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {DEMO_SCENES.map((scene, idx) => {
            const isCurrent = idx === currentSceneIndex;
            const isPassed = idx < currentSceneIndex;

            return (
              <button
                key={scene.id}
                onClick={() => handleSelectScene(idx)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono whitespace-nowrap transition-all border cursor-pointer ${
                  isCurrent
                    ? 'bg-[#d96347] text-white font-bold border-[#d96347] shadow-sm'
                    : isPassed
                    ? 'bg-[#1a1c22] border-[#faf6f0]/10 text-[#faf6f0]'
                    : 'bg-[#14151a] border-transparent text-[#7a7873] hover:text-[#c5beaf]'
                }`}
              >
                {scene.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Scene Content Area */}
        <div className="relative z-10 p-5 sm:p-7 md:p-8 overflow-y-auto flex-1 flex flex-col justify-between">
          <div>
            {/* Top Scene Narration Card */}
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#d96347] font-extrabold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d96347] animate-pulse" />
                {activeScene.tagline}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-[#faf6f0] mt-1 tracking-tight">
                {activeScene.title}
              </h3>
              <p className="text-[#c5beaf] text-sm sm:text-base mt-2 max-w-3xl leading-relaxed font-light">
                {activeScene.explanation}
              </p>
            </div>

            {/* SCENE-SPECIFIC LIVE INTERACTIVE DEMONSTRATION ARENA */}
            {activeScene.id !== 7 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Bedside Live Monitor Canvas (7 cols) */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-[#161820]/95 border border-[#faf6f0]/10 shadow-xl space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#faf6f0] font-bold uppercase flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#5da283]" />
                      BEDSIDE MONITOR • LIVE LEAD II (ECG)
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isEmergency
                        ? 'bg-[#d96347]/20 text-[#d96347] border border-[#d96347]/50 animate-pulse'
                        : isWarning
                        ? 'bg-[#e5933a]/20 text-[#e5933a] border border-[#e5933a]/50'
                        : 'bg-[#5da283]/20 text-[#5da283] border border-[#5da283]/40'
                    }`}>
                      {isEmergency ? 'CODE RED ALERT' : isWarning ? 'SINGLE WARNING' : 'STABLE EQUILIBRIUM'}
                    </span>
                  </div>

                  {/* Real Live Waveform Canvas */}
                  <div className="rounded-xl bg-[#0e1014] p-2 border border-[#faf6f0]/8 overflow-hidden">
                    <WaveformCanvas
                      type="ecg"
                      bpm={activeScene.vitals.heartRate}
                      oxygen={activeScene.vitals.oxygen}
                      color={waveformColor}
                      glowColor={waveformGlow}
                      height={90}
                    />
                  </div>

                  {/* Live Dials */}
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    {/* Oxygen Dial */}
                    <div className={`p-3.5 rounded-xl border transition-all ${
                      activeScene.conditionA
                        ? 'bg-[#d96347]/15 border-[#d96347]/60 shadow-md shadow-[#d96347]/10'
                        : 'bg-[#101217] border-[#faf6f0]/8'
                    }`}>
                      <div className="flex justify-between items-center text-[11px] text-[#c5beaf]">
                        <span>OXYGEN (SpO₂)</span>
                        <span className="text-[10px]">&lt; 90% Threshold</span>
                      </div>
                      <div className={`text-3xl font-black mt-1 ${
                        activeScene.conditionA ? 'text-[#d96347]' : 'text-[#faf6f0]'
                      }`}>
                        {activeScene.vitals.oxygen}%
                      </div>
                      <div className={`text-[10px] mt-1 ${
                        activeScene.conditionA ? 'text-[#d96347] font-bold' : 'text-[#5da283]'
                      }`}>
                        {activeScene.conditionA ? 'Condition A: TRUE (Low)' : 'Condition A: FALSE (Safe)'}
                      </div>
                    </div>

                    {/* Heart Rate Dial */}
                    <div className={`p-3.5 rounded-xl border transition-all ${
                      activeScene.conditionB
                        ? 'bg-[#d96347]/15 border-[#d96347]/60 shadow-md shadow-[#d96347]/10'
                        : 'bg-[#101217] border-[#faf6f0]/8'
                    }`}>
                      <div className="flex justify-between items-center text-[11px] text-[#c5beaf]">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-[#d96347]" /> HEART RATE
                        </span>
                        <span className="text-[10px]">[50-120] BPM</span>
                      </div>
                      <div className={`text-3xl font-black mt-1 ${
                        activeScene.conditionB ? 'text-[#d96347]' : 'text-[#faf6f0]'
                      }`}>
                        {activeScene.vitals.heartRate} <span className="text-xs font-normal text-[#c5beaf]">BPM</span>
                      </div>
                      <div className={`text-[10px] mt-1 ${
                        activeScene.conditionB ? 'text-[#d96347] font-bold' : 'text-[#5da283]'
                      }`}>
                        {activeScene.conditionB ? 'Condition B: TRUE (Abnormal)' : 'Condition B: FALSE (Normal)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Logic Processing Unit (5 cols) */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-[#161820]/95 border border-[#faf6f0]/10 shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#faf6f0] font-bold uppercase flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-[#e5933a]" />
                        LOGIC ENGINE EVALUATOR
                      </span>
                      <span className="text-[10px] text-[#c5beaf]">FORMULA: E = A ∧ B</span>
                    </div>

                    {/* Visual Signal Conduits */}
                    <div className="p-3.5 rounded-xl bg-[#0e1014] border border-[#faf6f0]/8 space-y-3 font-mono text-xs">
                      {/* Wire A */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#c5beaf]">Input A (Oxygen &lt; 90%):</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${
                          activeScene.conditionA ? 'bg-[#d96347] text-white' : 'bg-[#1e2027] text-[#c5beaf]'
                        }`}>
                          {activeScene.conditionA ? '1 (HIGH)' : '0 (LOW)'}
                        </span>
                      </div>

                      {/* Wire B */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#c5beaf]">Input B (HR Abnormal):</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${
                          activeScene.conditionB ? 'bg-[#d96347] text-white' : 'bg-[#1e2027] text-[#c5beaf]'
                        }`}>
                          {activeScene.conditionB ? '1 (HIGH)' : '0 (LOW)'}
                        </span>
                      </div>

                      <div className="h-[1px] bg-[#faf6f0]/8 my-1" />

                      {/* Conjunction Gate Output */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#faf6f0] font-bold">AND Gate Output (E):</span>
                        <span className={`font-black px-2.5 py-0.5 rounded text-xs ${
                          isEmergency
                            ? 'bg-[#d96347] text-white shadow-md shadow-[#d96347]/30 animate-pulse'
                            : 'bg-[#1e2027] text-[#5da283]'
                        }`}>
                          {isEmergency ? '1 (EMERGENCY)' : '0 (QUIESCENT)'}
                        </span>
                      </div>
                    </div>

                    {/* Resulting System Status Banner */}
                    <div className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                      isEmergency
                        ? 'bg-[#d96347]/20 border-[#d96347]/60 text-white animate-beacon'
                        : isWarning
                        ? 'bg-[#e5933a]/15 border-[#e5933a]/50 text-[#e5933a]'
                        : 'bg-[#5da283]/15 border-[#5da283]/40 text-[#5da283]'
                    }`}>
                      {isEmergency ? (
                        <AlertOctagon className="w-6 h-6 shrink-0 text-[#d96347] animate-bounce" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-6 h-6 shrink-0 text-[#e5933a]" />
                      ) : (
                        <ShieldCheck className="w-6 h-6 shrink-0 text-[#5da283]" />
                      )}

                      <div className="font-mono text-xs">
                        <div className="font-extrabold uppercase">
                          {isEmergency
                            ? 'EMERGENCY ALERT ACTIVATED'
                            : isWarning
                            ? 'WARNING DETECTED (EMERGENCY SUPPRESSED)'
                            : 'PATIENT STABLE • NORMAL MONITORING'}
                        </div>
                        <div className="text-[11px] opacity-90 mt-0.5 font-sans">
                          {isEmergency
                            ? 'Both conditions active simultaneously. Conjunction verified.'
                            : isWarning
                            ? 'Single vital sign drop. Conjunction logic filters false code red.'
                            : 'All biometric indicators safely within baseline limits.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Math Deep Dive Invitation */}
                  <div className="pt-3 border-t border-[#faf6f0]/8 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#c5beaf]">Want to verify the truth table?</span>
                    <button
                      onClick={onOpenMathTheater}
                      className="text-[#d96347] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>SOLVE THE MATH</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Scene 7: Interactive Exploration Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-2">
                <div 
                  onClick={() => handleExploreAction('patient-monitor')}
                  className="p-5 rounded-2xl bg-[#161820] border border-[#faf6f0]/10 hover:border-[#5da283] hover:bg-[#1a1d26] transition-all cursor-pointer group space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#5da283]/20 border border-[#5da283]/40 text-[#5da283] flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#faf6f0] group-hover:text-[#5da283]">
                    1. Patient Monitor
                  </h4>
                  <p className="text-xs text-[#c5beaf] leading-relaxed">
                    Explore live waveforms, calibrate vital thresholds manually, and observe real-time signal processing.
                  </p>
                  <span className="text-xs font-mono font-bold text-[#5da283] flex items-center gap-1 pt-1">
                    <span>EXPLORE MONITOR</span> <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div 
                  onClick={() => handleExploreAction('scenarios')}
                  className="p-5 rounded-2xl bg-[#161820] border border-[#faf6f0]/10 hover:border-[#e5933a] hover:bg-[#1a1d26] transition-all cursor-pointer group space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e5933a]/20 border border-[#e5933a]/40 text-[#e5933a] flex items-center justify-center font-bold">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#faf6f0] group-hover:text-[#e5933a]">
                    2. Scenarios
                  </h4>
                  <p className="text-xs text-[#c5beaf] leading-relaxed">
                    Test 3 clear situations: Everything is Normal, Something is Going Wrong, and Emergency Situation.
                  </p>
                  <span className="text-xs font-mono font-bold text-[#e5933a] flex items-center gap-1 pt-1">
                    <span>TRY SCENARIOS</span> <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div 
                  onClick={() => handleExploreAction('patient-monitor')}
                  className="p-5 rounded-2xl bg-[#161820] border border-[#faf6f0]/10 hover:border-[#faf6f0]/40 hover:bg-[#1a1d26] transition-all cursor-pointer group space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#faf6f0]/10 border border-[#faf6f0]/20 text-[#faf6f0] flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#faf6f0] group-hover:text-white">
                    3. Sensor Failure
                  </h4>
                  <p className="text-xs text-[#c5beaf] leading-relaxed">
                    Simulate loose electrode leads to see how hardware fault isolation prevents false cardiac alerts.
                  </p>
                  <span className="text-xs font-mono font-bold text-[#faf6f0] flex items-center gap-1 pt-1">
                    <span>DISCONNECT SENSOR</span> <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div 
                  onClick={() => {
                    onClose();
                    if (onOpenMathTheater) onOpenMathTheater();
                  }}
                  className="p-5 rounded-2xl bg-[#161820] border border-[#d96347]/40 hover:border-[#d96347] hover:bg-[#1a1d26] transition-all cursor-pointer group space-y-3 shadow-lg shadow-[#d96347]/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#d96347]/20 border border-[#d96347]/40 text-[#d96347] flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-[#faf6f0] group-hover:text-[#d96347]">
                    4. Solve the Math
                  </h4>
                  <p className="text-xs text-[#c5beaf] leading-relaxed">
                    Step inside the complete 6-step discrete logic laboratory with interactive gates, truth tables, and De Morgan laws.
                  </p>
                  <span className="text-xs font-mono font-bold text-[#d96347] flex items-center gap-1 pt-1">
                    <span>ENTER LAB</span> <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controller Bar */}
          <div className="mt-6 pt-4 border-t border-[#faf6f0]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Progress indicator */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handlePrev}
                disabled={currentSceneIndex === 0}
                className="p-2.5 rounded-xl bg-[#1e2027] text-[#c5beaf] disabled:opacity-30 hover:text-white transition-all cursor-pointer"
                title="Previous Scene (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentSceneIndex === DEMO_SCENES.length - 1}
                className="px-4 py-2 rounded-xl bg-[#d96347] hover:bg-[#e07055] text-white font-mono text-xs font-bold disabled:opacity-30 flex items-center gap-1.5 shadow-md shadow-[#d96347]/30 transition-all cursor-pointer"
                title="Next Scene (Right Arrow)"
              >
                <span>NEXT SCENE</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleRestart}
                className="p-2.5 rounded-xl bg-[#1e2027] text-[#c5beaf] hover:text-white transition-all cursor-pointer"
                title="Restart Demonstration"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="w-32 sm:w-48 h-1.5 bg-[#101217] rounded-full overflow-hidden border border-[#faf6f0]/8 ml-2">
                <div 
                  className="h-full bg-gradient-to-r from-[#d96347] to-[#e5933a] transition-all duration-100"
                  style={{ width: `${sceneProgressPct}%` }}
                />
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#c5beaf] hidden md:inline">
                Scene {currentSceneIndex + 1} of {DEMO_SCENES.length} • Auto-Running
              </span>

              <button
                onClick={() => handleExploreAction('patient-monitor')}
                className="px-5 py-2 rounded-xl bg-[#faf6f0] text-[#111215] font-display font-extrabold text-xs flex items-center gap-2 hover:bg-[#ece6db] shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#5da283]" />
                <span>START EXPLORING</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationMode;
