import React, { useState, useEffect, useRef } from 'react';
import type { VitalsState, BooleanPropositions } from '../../types';
import { soundEngine } from '../../utils/audio';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Binary, 
  Cpu, 
  ArrowRight,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

interface RevealMathModalProps {
  isOpen: boolean;
  onClose: () => void;
  vitals: VitalsState;
  propositions: BooleanPropositions;
}

export const RevealMathModal: React.FC<RevealMathModalProps> = ({
  isOpen,
  onClose,
  vitals,
  propositions,
}) => {
  const [currentActIndex, setCurrentActIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 1.5x, 2x

  const actDurationMs = 6000 / playbackSpeed;
  const progressIntervalRef = useRef<number | null>(null);

  // Auto-play timer effect
  useEffect(() => {
    if (!isOpen) {
      setCurrentActIndex(0);
      setProgress(0);
      return;
    }

    if (isPlaying) {
      const stepMs = 50;
      const progressIncrement = (stepMs / actDurationMs) * 100;

      progressIntervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentActIndex((actIdx) => {
              if (actIdx < 5) {
                soundEngine.playGateClick();
                return actIdx + 1;
              } else {
                setIsPlaying(false);
                return actIdx;
              }
            });
            return 0;
          }
          return prev + progressIncrement;
        });
      }, stepMs);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, isPlaying, currentActIndex, playbackSpeed, actDurationMs]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentActIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    soundEngine.playGateClick();
    setProgress(0);
    if (currentActIndex < 5) {
      setCurrentActIndex(currentActIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    soundEngine.playGateClick();
    setProgress(0);
    if (currentActIndex > 0) {
      setCurrentActIndex(currentActIndex - 1);
    }
  };

  const handleReplay = () => {
    soundEngine.playGateClick();
    setCurrentActIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const selectAct = (index: number) => {
    soundEngine.playGateClick();
    setCurrentActIndex(index);
    setProgress(0);
  };

  const currentOxygen = vitals.oxygen || 98;
  const currentHeartRate = vitals.heartRate || 74;
  const propA = propositions.A;
  const propB = propositions.B;
  const propE = propositions.E_Combined;

  const acts = [
    {
      actNumber: 1,
      title: 'ACT 1 — SENSOR ACQUISITION',
      subtitle: 'From Analog Telemetry to Boolean Proposition',
      formula: `P(SpO₂) : ${currentOxygen} < 90  ⇒  A = ${propA ? '1 (TRUE)' : '0 (FALSE)'}`,
      description: `The physical pulse oximeter probe digitizes oxygen saturation at ${currentOxygen}%. The relational inequality compares this to the 90% critical threshold.`,
      details: [
        `Live Sensor Reading: SpO₂ = ${currentOxygen}%.`,
        `Safety Boundary Rule: Critical when SpO₂ < 90%.`,
        `Relational Test Evaluated: ${currentOxygen} < 90 ⇒ ${propA ? 'HOLDS (TRUE)' : 'FAILS (FALSE)'}.`,
        `Discrete mapping: Atomic Proposition A = ${propA ? '1 (Active)' : '0 (Safe)'}.`,
      ],
    },
    {
      actNumber: 2,
      title: 'ACT 2 — CARDIAC INTERVAL',
      subtitle: 'Heart Rate Bounds & Proposition B',
      formula: `Q(HR) : (${currentHeartRate} < 50) ∨ (${currentHeartRate} > 120)  ⇒  B = ${propB ? '1 (TRUE)' : '0 (FALSE)'}`,
      description: `The ECG telemetry calculates ventricular contraction frequency at ${currentHeartRate} BPM. The disjunction checks both bradycardia (< 50) and tachycardia (> 120).`,
      details: [
        `Live Sensor Reading: Heart Rate = ${currentHeartRate} BPM.`,
        `Normal Bounds: [50 BPM, 120 BPM].`,
        `Relational Test Evaluated: (${currentHeartRate} < 50) ∨ (${currentHeartRate} > 120) ⇒ ${propB ? 'HOLDS (TRUE)' : 'FAILS (FALSE)'}.`,
        `Discrete mapping: Atomic Proposition B = ${propB ? '1 (Active)' : '0 (Safe)'}.`,
      ],
    },
    {
      actNumber: 3,
      title: 'ACT 3 — CONJUNCTION OPERATOR',
      subtitle: 'Signal Flow & Convergence into the AND Gate',
      formula: `E = A ∧ B = (${propA ? '1' : '0'}) ∧ (${propB ? '1' : '0'}) = ${propE ? '1 (TRUE)' : '0 (FALSE)'}`,
      description: 'Single-sensor transients produce false alarms. Conjunction logic correlates two independent physiological failures before triggering Code Red.',
      details: [
        `Proposition A Input Wire: ${propA ? 'HIGH (+5V / Logic 1)' : 'LOW (0V / Logic 0)'}.`,
        `Proposition B Input Wire: ${propB ? 'HIGH (+5V / Logic 1)' : 'LOW (0V / Logic 0)'}.`,
        'Conjunction Operator: Output is TRUE if and only if BOTH inputs are TRUE.',
        `Digital Gate State: ${propE ? 'ENERGIZED (Output High)' : 'DE-ASSERTED (Output Low)'}.`,
      ],
    },
    {
      actNumber: 4,
      title: 'ACT 4 — THE TRUTH TABLE',
      subtitle: 'Exhaustive Valuation of All 2² = 4 Possible Interpretations',
      formula: `v(A ∧ B) = min(v(A), v(B)) = min(${propA ? 1 : 0}, ${propB ? 1 : 0}) = ${propE ? 1 : 0}`,
      description: 'A truth table enumerates every possible interpretation. The active row corresponding to the live telemetry is dynamically illuminated.',
      details: [
        'Row 1: [0, 0] ⇒ 0 (Normal Homeostasis)',
        'Row 2: [0, 1] ⇒ 0 (Isolated Cardiac Warning)',
        'Row 3: [1, 0] ⇒ 0 (Isolated Hypoxia Warning)',
        'Row 4: [1, 1] ⇒ 1 (COMBINED EMERGENCY)',
      ],
    },
    {
      actNumber: 5,
      title: 'ACT 5 — DEDUCTIVE CONCLUSION',
      subtitle: 'Mathematical Guarantee & Actuator Response',
      formula: `${propA ? 'TRUE' : 'FALSE'} ∧ ${propB ? 'TRUE' : 'FALSE'} ≡ ${propE ? 'TRUE' : 'FALSE'}`,
      description: `Formal deductive derivation terminates with mathematical certainty: The emergency output is strictly ${propE ? 'HIGH (1)' : 'LOW (0)'}.`,
      details: [
        `Premise 1: Proposition A is ${propA ? 'TRUE' : 'FALSE'}.`,
        `Premise 2: Proposition B is ${propB ? 'TRUE' : 'FALSE'}.`,
        `Conjunction Rule: E = A ∧ B evaluates deterministically to ${propE ? '1' : '0'}.`,
        `Actuator State: ${propE ? 'Code Red Strobe & High-Priority Audible Tone Triggered' : 'Normal Telemetry Pacing'}.`,
      ],
    },
    {
      actNumber: 6,
      title: 'ACT 6 — ENGINEERING SIGNIFICANCE',
      subtitle: 'Why Formal Logic Governs Life-Critical Software',
      formula: 'Formal Verification: ∀s ∈ States, Safe(s) ∨ HandledEmergency(s)',
      description: 'Medical systems demand deterministic mathematical correctness. Formal propositional logic eliminates alert fatigue while preserving patient safety.',
      details: [
        'Zero Indeterminacy: No undefined states or floating inputs.',
        'Elimination of Alert Fatigue: Combinatorial rules suppress single-sensor noise.',
        'Fault Isolation: Disconnection is treated as a distinct fault state, never a false normal.',
        'Discrete Mathematics: The verifiable foundation of safety-critical embedded engineering.',
      ],
    },
  ];

  const currentAct = acts[currentActIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#040812]/90 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-300">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#0b0f19] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                  MATHEMATICAL THEATER
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-blue-300 border border-slate-700 font-mono">
                  ACT {currentAct.actNumber} OF 6
                </span>
              </div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-white">
                REVEAL THE MATH BEHIND: LIVE DEDUCTION
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Acts Stepper Bar */}
        <div className="px-6 py-3 bg-[#070b14] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          {acts.map((act, idx) => {
            const isActive = idx === currentActIndex;
            const isDone = idx < currentActIndex;

            return (
              <button
                key={idx}
                onClick={() => selectAct(idx)}
                className={`flex-1 min-w-[120px] p-2 rounded-xl text-left transition-all relative overflow-hidden border cursor-pointer ${
                  isActive
                    ? 'bg-blue-950/50 border-blue-500 shadow-md shadow-blue-500/20'
                    : isDone
                    ? 'bg-slate-900/60 border-slate-700 text-slate-300'
                    : 'bg-slate-950 border-slate-800/60 text-slate-500 hover:border-slate-700'
                }`}
              >
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                )}
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                  ACT 0{idx + 1}
                </div>
                <div className="font-display text-xs font-bold text-white truncate">
                  {act.title.split('—')[1] || act.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Central Visual Stage */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col justify-between">
          <div>
            {/* Act Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-blue-400 tracking-wider">
                  {currentAct.title}
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-0.5">
                  {currentAct.subtitle}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-right">
                <div className="text-[10px] font-mono text-slate-400 uppercase">MATHEMATICAL VALUATION</div>
                <div className="font-mono text-sm sm:text-base font-bold text-blue-300 tracking-wider mt-0.5">
                  {currentAct.formula}
                </div>
              </div>
            </div>

            {/* Visual Canvas Stage */}
            <div className="w-full min-h-[220px] bg-[#060a12] border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex items-center justify-center mb-6">
              {/* ACT 1 Visual */}
              {currentAct.actNumber === 1 && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 animate-in zoom-in-95 duration-500">
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-500/40 text-center w-48 shadow-lg">
                    <span className="text-[11px] font-mono text-slate-400">LIVE SENSOR VALUE</span>
                    <div className="font-display text-4xl font-extrabold text-white mt-1">{currentOxygen}%</div>
                    <span className="text-xs font-mono text-blue-400 font-bold">Capillary SpO₂</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-mono text-2xl font-bold text-blue-400">&lt;</span>
                    <span className="text-[10px] font-mono text-slate-400">RELATIONAL TEST</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 text-center w-48">
                    <span className="text-[11px] font-mono text-slate-400">SAFETY BOUNDARY</span>
                    <div className="font-display text-4xl font-extrabold text-slate-300 mt-1">90%</div>
                    <span className="text-xs font-mono text-slate-400">Critical Floor</span>
                  </div>

                  <ArrowRight className="w-8 h-8 text-blue-400 animate-pulse hidden md:block" />

                  <div className={`p-5 rounded-2xl text-center w-48 shadow-lg border ${
                    propA ? 'bg-rose-950/40 border-rose-500 text-rose-300' : 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                  }`}>
                    <span className="text-[11px] font-mono font-bold">BOOLEAN VARIABLE</span>
                    <div className={`font-display text-4xl font-extrabold mt-1 ${propA ? 'text-rose-400' : 'text-emerald-400'}`}>
                      A = {propA ? '1' : '0'}
                    </div>
                    <span className="text-xs font-mono">{propA ? 'VALUE: TRUE' : 'VALUE: FALSE'}</span>
                  </div>
                </div>
              )}

              {/* ACT 2 Visual */}
              {currentAct.actNumber === 2 && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 animate-in zoom-in-95 duration-500">
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/40 text-center w-48 shadow-lg">
                    <span className="text-[11px] font-mono text-slate-400">LIVE R-R TELEMETRY</span>
                    <div className="font-display text-4xl font-extrabold text-white mt-1">{currentHeartRate}</div>
                    <span className="text-xs font-mono text-rose-400 font-bold">Ventricular BPM</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-mono text-lg font-bold text-blue-400">&lt; 50 ∨ &gt; 120</span>
                    <span className="text-[10px] font-mono text-slate-400">DISJUNCT BOUNDS</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 text-center w-48">
                    <span className="text-[11px] font-mono text-slate-400">NORMAL LIMITS</span>
                    <div className="font-display text-4xl font-extrabold text-slate-300 mt-1">50 - 120</div>
                    <span className="text-xs font-mono text-slate-400">Physiological Range</span>
                  </div>

                  <ArrowRight className="w-8 h-8 text-blue-400 animate-pulse hidden md:block" />

                  <div className={`p-5 rounded-2xl text-center w-48 shadow-lg border ${
                    propB ? 'bg-rose-950/40 border-rose-500 text-rose-300' : 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                  }`}>
                    <span className="text-[11px] font-mono font-bold">BOOLEAN VARIABLE</span>
                    <div className={`font-display text-4xl font-extrabold mt-1 ${propB ? 'text-rose-400' : 'text-emerald-400'}`}>
                      B = {propB ? '1' : '0'}
                    </div>
                    <span className="text-xs font-mono">{propB ? 'VALUE: TRUE' : 'VALUE: FALSE'}</span>
                  </div>
                </div>
              )}

              {/* ACT 3 Visual */}
              {currentAct.actNumber === 3 && (
                <div className="flex items-center justify-center gap-4 sm:gap-8 max-w-xl w-full animate-in zoom-in-95 duration-500">
                  <div className="space-y-4">
                    <div className={`p-3 px-5 rounded-xl border text-center ${
                      propA ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}>
                      <span className="text-[10px] font-mono text-slate-400">INPUT WIRE 1</span>
                      <div className="font-mono text-xl font-bold">A = {propA ? '1 (TRUE)' : '0 (FALSE)'}</div>
                    </div>
                    <div className={`p-3 px-5 rounded-xl border text-center ${
                      propB ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}>
                      <span className="text-[10px] font-mono text-slate-400">INPUT WIRE 2</span>
                      <div className="font-mono text-xl font-bold">B = {propB ? '1 (TRUE)' : '0 (FALSE)'}</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center gap-8">
                    <div className={`w-16 h-1 ${propA ? 'bg-rose-500 shadow-md shadow-rose-500/50' : 'bg-slate-700'}`} />
                    <div className={`w-16 h-1 ${propB ? 'bg-rose-500 shadow-md shadow-rose-500/50' : 'bg-slate-700'}`} />
                  </div>

                  <div className={`p-6 rounded-2xl border-2 text-center shadow-xl ${
                    propE ? 'bg-rose-950/50 border-rose-500 shadow-rose-500/30' : 'bg-slate-900 border-blue-500'
                  }`}>
                    <Cpu className={`w-8 h-8 mx-auto mb-2 ${propE ? 'text-rose-400' : 'text-blue-400'}`} />
                    <span className="font-display font-extrabold text-lg text-white">CONJUNCTION (∧)</span>
                    <div className="text-xs font-mono mt-1 font-bold">
                      E = A ∧ B = <span className={propE ? 'text-rose-400' : 'text-emerald-400'}>{propE ? '1' : '0'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ACT 4 Visual */}
              {currentAct.actNumber === 4 && (
                <div className="w-full max-w-lg animate-in zoom-in-95 duration-500">
                  <table className="w-full text-center font-mono text-sm border-collapse rounded-xl overflow-hidden border border-slate-700">
                    <thead>
                      <tr className="bg-slate-900 text-slate-300 border-b border-slate-700">
                        <th className="py-2.5">Row</th>
                        <th className="py-2.5 text-blue-400">A</th>
                        <th className="py-2.5 text-blue-400">B</th>
                        <th className="py-2.5 text-emerald-400 font-bold">E = A ∧ B</th>
                        <th className="py-2.5 text-slate-400">System State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {[
                        { r: 1, a: false, b: false, e: false, label: 'Normal Homeostasis' },
                        { r: 2, a: false, b: true, e: false, label: 'Cardiac Warning' },
                        { r: 3, a: true, b: false, e: false, label: 'Hypoxia Warning' },
                        { r: 4, a: true, b: true, e: true, label: 'COMBINED EMERGENCY' },
                      ].map((row) => {
                        const isLiveMatch = propA === row.a && propB === row.b;
                        return (
                          <tr
                            key={row.r}
                            className={`transition-all ${
                              isLiveMatch
                                ? row.e
                                  ? 'bg-rose-500/25 border-2 border-rose-500 text-white font-extrabold shadow-lg animate-pulse'
                                  : 'bg-blue-500/25 border-2 border-blue-500 text-white font-extrabold shadow-lg'
                                : 'text-slate-500'
                            }`}
                          >
                            <td className="py-2.5">{row.r} {isLiveMatch && '★'}</td>
                            <td>{row.a ? '1' : '0'}</td>
                            <td>{row.b ? '1' : '0'}</td>
                            <td className="font-bold">{row.e ? '1' : '0'}</td>
                            <td className="text-xs uppercase font-semibold">{row.label}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ACT 5 Visual */}
              {currentAct.actNumber === 5 && (
                <div className="flex flex-col items-center justify-center gap-5 text-center animate-in zoom-in-95 duration-500">
                  <div className={`p-5 px-10 rounded-2xl border-2 shadow-2xl ${
                    propE ? 'bg-rose-950/70 border-rose-500 shadow-rose-500/30' : 'bg-slate-900 border-emerald-500 shadow-emerald-500/20'
                  }`}>
                    <span className="text-xs font-mono text-slate-300 tracking-wider">FORMAL DEDUCTION RESOLUTION</span>
                    <div className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
                      {propA ? 'TRUE' : 'FALSE'} ∧ {propB ? 'TRUE' : 'FALSE'} ≡ <span className={propE ? 'text-rose-400' : 'text-emerald-400'}>{propE ? 'TRUE' : 'FALSE'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-mono text-slate-300">
                    <ShieldAlert className={`w-5 h-5 ${propE ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
                    <span>{propE ? 'OUTPUT RELAY ENERGIZED: EMERGENCY STROBE ACTIVATED' : 'OUTPUT RELAY NORMAL: HOMEOSTASIS PACING'}</span>
                  </div>
                </div>
              )}

              {/* ACT 6 Visual */}
              {currentAct.actNumber === 6 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl animate-in zoom-in-95 duration-500 text-left">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs font-mono mb-1">
                      <Binary className="w-4 h-4" /> 1. PROPOSITIONS & DOMAIN
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      A proposition is a declarative statement that is strictly TRUE or FALSE.
                      Relational predicates map physiological variables into formal Boolean logic.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs font-mono mb-1">
                      <Cpu className="w-4 h-4" /> 2. CONJUNCTION OPERATOR (∧)
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      A ∧ B is satisfied only when both conditions hold. In critical systems,
                      conjunction eliminates alert fatigue by filtering out transient single-sensor artifacts.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono mb-1">
                      <GraduationCap className="w-4 h-4" /> 3. TRUTH TABLE COMPLETENESS
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Exhaustive 2² = 4 row coverage guarantees that every possible physical combination
                      has a defined, deterministic response with zero unhandled states.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono mb-1">
                      <ShieldAlert className="w-4 h-4" /> 4. DETERMINISTIC RELAYS
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Unlike stochastic or heuristic models, Boolean logic can be formally verified through
                      mathematical proof, ensuring life-critical software reliability.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description Details */}
            <div className="space-y-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-200 font-medium mb-2 font-sans">
                {currentAct.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                {currentAct.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Controller Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-mono font-bold text-xs flex items-center gap-2 hover:bg-blue-500 transition-all shadow-md cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                {isPlaying ? 'PAUSE AUTO-PLAY' : 'RESUME PLAY'}
              </button>

              <button
                onClick={handlePrev}
                disabled={currentActIndex === 0}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:text-white cursor-pointer"
                title="Previous Act"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentActIndex === 5}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:text-white cursor-pointer"
                title="Next Act"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReplay}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Replay from Act 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="hidden md:inline text-slate-500">PLAYBACK SPEED:</span>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {[1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                      playbackSpeed === speed ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:inline">Space: Pause/Play • Esc: Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
