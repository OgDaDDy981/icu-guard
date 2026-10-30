import React, { useState, useEffect, useRef } from 'react';
import { MATH_ACTS } from '../../utils/constants';
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
}

export const RevealMathModal: React.FC<RevealMathModalProps> = ({ isOpen, onClose }) => {
  const [currentActIndex, setCurrentActIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 1.5x, 2x

  const actDurationMs = 6000 / playbackSpeed;
  const progressIntervalRef = useRef<number | null>(null);

  const currentAct = MATH_ACTS[currentActIndex];

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
            // Move to next act
            setCurrentActIndex((actIdx) => {
              if (actIdx < MATH_ACTS.length - 1) {
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
    if (currentActIndex < MATH_ACTS.length - 1) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#02050e]/90 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Theater Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#060c1c] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-slate-900/80 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 text-slate-950">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  ICU GUARD SIGNATURE MATHEMATICAL THEATER
                </span>
                <span className="text-xs px-2 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                  ACT {currentAct.actNumber} OF 6
                </span>
              </div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-white">
                REVEAL THE MATH BEHIND: COMBINED EMERGENCY
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Acts Timeline Stepper */}
        <div className="px-6 py-3 bg-[#030712] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          {MATH_ACTS.map((act, idx) => {
            const isActive = idx === currentActIndex;
            const isDone = idx < currentActIndex;

            return (
              <button
                key={act.id}
                onClick={() => selectAct(idx)}
                className={`flex-1 min-w-[120px] p-2 rounded-xl text-left transition-all relative overflow-hidden border ${
                  isActive
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : isDone
                    ? 'bg-slate-900/60 border-slate-700 text-slate-300'
                    : 'bg-slate-950 border-slate-800/60 text-slate-500 hover:border-slate-700'
                }`}
              >
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-teal-300 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                )}
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
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
            {/* Act Title & Mathematical Formula Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                  {currentAct.title}
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-0.5">
                  {currentAct.subtitle}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-right">
                <div className="text-[10px] font-mono text-slate-400">FORMAL PROPOSITION</div>
                <div className="font-mono text-sm sm:text-base font-bold text-cyan-300 tracking-wider">
                  {currentAct.formula}
                </div>
              </div>
            </div>

            {/* Visual Cinematic Canvas / Graphic for Current Act */}
            <div className="w-full min-h-[220px] bg-[#020510] border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-tactical-grid opacity-30 pointer-events-none" />

              {/* ACT 1 Visual: Sensor Comparison 85 < 90 -> A = TRUE */}
              {currentAct.id === 'act1' && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 animate-in zoom-in-95 duration-500">
                  {/* Oxygen Reading */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/40 text-center w-48">
                    <span className="text-[11px] font-mono text-slate-400">SENSOR VALUE</span>
                    <div className="font-display text-4xl font-extrabold text-white mt-1">85%</div>
                    <span className="text-xs font-mono text-rose-400 font-bold">Capillary SpO₂</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-mono text-2xl font-bold text-cyan-400">&lt;</span>
                    <span className="text-[10px] font-mono text-slate-400">INEQUALITY</span>
                  </div>

                  {/* Threshold */}
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700 text-center w-48">
                    <span className="text-[11px] font-mono text-slate-400">THRESHOLD BOUND</span>
                    <div className="font-display text-4xl font-extrabold text-slate-300 mt-1">90%</div>
                    <span className="text-xs font-mono text-slate-400">Critical Boundary</span>
                  </div>

                  <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse hidden md:block" />

                  {/* Derived Proposition */}
                  <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500 text-center w-48 shadow-lg shadow-rose-950/50">
                    <span className="text-[11px] font-mono text-rose-300 font-bold">BOOLEAN PROPOSITION</span>
                    <div className="font-display text-4xl font-extrabold text-rose-400 mt-1 text-glow-coral">A = 1</div>
                    <span className="text-xs font-mono text-rose-300">VALUE: TRUE</span>
                  </div>
                </div>
              )}

              {/* ACT 2 Visual: Heart Rate 150 > 120 -> B = TRUE */}
              {currentAct.id === 'act2' && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 animate-in zoom-in-95 duration-500">
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/40 text-center w-48">
                    <span className="text-[11px] font-mono text-slate-400">R-R COMPUTATION</span>
                    <div className="font-display text-4xl font-extrabold text-white mt-1">150</div>
                    <span className="text-xs font-mono text-rose-400 font-bold">Ventricular BPM</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="font-mono text-2xl font-bold text-cyan-400">&gt;</span>
                    <span className="text-[10px] font-mono text-slate-400">UPPER BOUND</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700 text-center w-48">
                    <span className="text-[11px] font-mono text-slate-400">CEILING THRESHOLD</span>
                    <div className="font-display text-4xl font-extrabold text-slate-300 mt-1">120</div>
                    <span className="text-xs font-mono text-slate-400">Max Normal BPM</span>
                  </div>

                  <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse hidden md:block" />

                  <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500 text-center w-48 shadow-lg shadow-rose-950/50">
                    <span className="text-[11px] font-mono text-rose-300 font-bold">BOOLEAN PROPOSITION</span>
                    <div className="font-display text-4xl font-extrabold text-rose-400 mt-1 text-glow-coral">B = 1</div>
                    <span className="text-xs font-mono text-rose-300">VALUE: TRUE</span>
                  </div>
                </div>
              )}

              {/* ACT 3 Visual: Boolean Expression E = A ∧ B moving to AND Gate */}
              {currentAct.id === 'act3' && (
                <div className="flex items-center justify-center gap-4 sm:gap-8 max-w-xl w-full animate-in zoom-in-95 duration-500">
                  <div className="space-y-4">
                    <div className="p-3 px-5 rounded-xl bg-rose-950/60 border border-rose-500 text-center">
                      <span className="text-[10px] font-mono text-slate-400">INPUT WIRE 1</span>
                      <div className="font-mono text-xl font-bold text-rose-400">A = 1 (TRUE)</div>
                    </div>
                    <div className="p-3 px-5 rounded-xl bg-rose-950/60 border border-rose-500 text-center">
                      <span className="text-[10px] font-mono text-slate-400">INPUT WIRE 2</span>
                      <div className="font-mono text-xl font-bold text-rose-400">B = 1 (TRUE)</div>
                    </div>
                  </div>

                  {/* Flowing Laser Channels */}
                  <div className="flex flex-col items-center justify-center gap-8">
                    <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-cyan-400 shadow-md shadow-cyan-400/50" />
                    <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-cyan-400 shadow-md shadow-cyan-400/50" />
                  </div>

                  {/* AND Gate Block */}
                  <div className="p-6 rounded-2xl bg-slate-900 border-2 border-cyan-400 shadow-xl shadow-cyan-500/20 text-center">
                    <Cpu className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <span className="font-display font-extrabold text-lg text-white">CONJUNCTION (∧)</span>
                    <div className="text-xs font-mono text-cyan-300 mt-1">E = A ∧ B</div>
                  </div>
                </div>
              )}

              {/* ACT 4 Visual: Truth Table with Row (1,1,1) illuminated */}
              {currentAct.id === 'act4' && (
                <div className="w-full max-w-lg animate-in zoom-in-95 duration-500">
                  <table className="w-full text-center font-mono text-sm border-collapse rounded-xl overflow-hidden border border-slate-700">
                    <thead>
                      <tr className="bg-slate-900 text-slate-300 border-b border-slate-700">
                        <th className="py-2.5">Row</th>
                        <th className="py-2.5 text-cyan-400">A</th>
                        <th className="py-2.5 text-cyan-400">B</th>
                        <th className="py-2.5 text-rose-400 font-bold">E = A ∧ B</th>
                        <th className="py-2.5 text-slate-400">ICU Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr className="text-slate-500">
                        <td className="py-2">1</td>
                        <td>0</td>
                        <td>0</td>
                        <td className="font-bold">0</td>
                        <td className="text-xs">Normal</td>
                      </tr>
                      <tr className="text-slate-500">
                        <td className="py-2">2</td>
                        <td>0</td>
                        <td>1</td>
                        <td className="font-bold">0</td>
                        <td className="text-xs">Cardiac Warning</td>
                      </tr>
                      <tr className="text-slate-500">
                        <td className="py-2">3</td>
                        <td>1</td>
                        <td>0</td>
                        <td className="font-bold">0</td>
                        <td className="text-xs">Hypoxia Warning</td>
                      </tr>
                      {/* Highlighted Active Row 4 */}
                      <tr className="bg-rose-500/25 border-2 border-rose-500 text-white font-extrabold shadow-lg shadow-rose-950/80 animate-pulse">
                        <td className="py-3 text-rose-300">4 ★</td>
                        <td className="text-rose-400 text-lg">1</td>
                        <td className="text-rose-400 text-lg">1</td>
                        <td className="text-rose-400 text-xl font-display text-glow-coral">1</td>
                        <td className="text-xs text-rose-300 font-sans uppercase font-bold tracking-wider">
                          COMBINED EMERGENCY
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* ACT 5 Visual: TRUE ∧ TRUE = TRUE actuating alarm */}
              {currentAct.id === 'act5' && (
                <div className="flex flex-col items-center justify-center gap-5 text-center animate-in zoom-in-95 duration-500">
                  <div className="p-4 px-8 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-2 border-rose-500 shadow-2xl shadow-rose-500/30">
                    <span className="text-xs font-mono text-rose-300 tracking-wider">FORMAL DEDUCTION RESOLUTION</span>
                    <div className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
                      TRUE ∧ TRUE ≡ <span className="text-rose-400 text-glow-coral">TRUE</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-mono text-slate-300">
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-bounce" />
                    <span>OUTPUT RELAY ENERGIZED: TRIGGERING EMERGENCY MEDICAL STROBE</span>
                  </div>
                </div>
              )}

              {/* ACT 6 Visual: Academic Viva Synthesis */}
              {currentAct.id === 'act6' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl animate-in zoom-in-95 duration-500 text-left">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono mb-1">
                      <Binary className="w-4 h-4" /> 1. PROPOSITIONS & BOOLEAN DOMAIN
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      A proposition is a declarative statement that is strictly TRUE or FALSE.
                      Variables A and B represent mathematical abstractions of physiological risk states.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-teal-500/30">
                    <div className="flex items-center gap-2 text-teal-400 font-bold text-xs font-mono mb-1">
                      <Cpu className="w-4 h-4" /> 2. CONJUNCTION OPERATOR (∧)
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      A ∧ B is satisfied only when both terms hold. In critical engineering,
                      conjunction prevents false positives by correlating multiple independent sensors.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono mb-1">
                      <GraduationCap className="w-4 h-4" /> 3. TRUTH TABLE EXHAUSTIVENESS
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      With 2 variables, exactly 2² = 4 possible interpretations exist.
                      Mathematical completeness guarantees that no unhandled state can crash the monitor.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono mb-1">
                      <ShieldAlert className="w-4 h-4" /> 4. EMBEDDED DETERMINISM
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Medical algorithms run deterministic state machines. Mathematical logic
                      transforms noisy physical signals into verifiable life-saving decisions.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Narrative Description Points */}
            <div className="space-y-2 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <p className="text-sm text-slate-200 font-medium mb-2">
                {currentAct.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                {currentAct.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Player Controller Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Play / Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/30"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                {isPlaying ? 'PAUSE AUTO-PLAY' : 'RESUME PLAY'}
              </button>

              {/* Prev / Next Step */}
              <button
                onClick={handlePrev}
                disabled={currentActIndex === 0}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:text-white"
                title="Previous Act (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentActIndex === MATH_ACTS.length - 1}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:text-white"
                title="Next Act (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Replay */}
              <button
                onClick={handleReplay}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                title="Replay from Act 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Playback Speed Controls & Keyboard Shortcut Hint */}
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="hidden md:inline text-slate-500">SPEED:</span>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {[1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      playbackSpeed === speed
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
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
