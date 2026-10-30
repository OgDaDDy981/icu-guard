import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../utils/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Presentation, 
  Sparkles, 
  CheckCircle2,
  Zap
} from 'lucide-react';

interface ProductDemoSlide {
  stepNumber: number;
  title: string;
  category: string;
  demonstrationGoal: string;
  keyProductFeatures: string[];
  interactiveActionLabel?: string;
  interactiveScenarioId?: string;
  scrollTargetId?: string;
}

const PRODUCT_DEMO_SLIDES: ProductDemoSlide[] = [
  {
    stepNumber: 1,
    title: 'ICU GUARD Product Vision & Architecture',
    category: 'SYSTEM OVERVIEW',
    demonstrationGoal: 'Demonstrate how formal discrete mathematics prevents hospital alarm fatigue while preserving critical safety guarantees.',
    keyProductFeatures: [
      'ICU GUARD is an interactive medical patient-monitoring simulation that models how formal Boolean logic and propositional calculus govern life-critical alarm systems.',
      'Modern hospital ICUs face acute alarm fatigue where single-sensor spikes cause high rates of non-actionable alarms.',
      'The platform models multi-parameter propositional conjunction (E = A ∧ B) to filter isolated sensor transients while guaranteeing instant emergency detection.',
      'Operates entirely client-side with 500 Hz telemetry canvas synchronization and real-time discrete state machines.',
    ],
    interactiveActionLabel: 'Inspect Patient Monitor',
    scrollTargetId: 'patient-monitor',
  },
  {
    stepNumber: 2,
    title: 'Multi-Parameter Sensory Telemetry Acquisition',
    category: 'SENSORY LAYER',
    demonstrationGoal: 'Demonstrate independent 5-channel physiological signal acquisition with responsive HTML5 canvas waveforms.',
    keyProductFeatures: [
      'Five continuous vital parameters are tracked: Heart Rate (BPM), Oxygen Saturation (SpO₂), Core Body Temperature (°C), Arterial Blood Pressure (mmHg), and Respiratory Rate (RPM).',
      'The system features independent sensor hardware channels: 3-Lead ECG, Optical Pulse Oximeter, Core Thermistor, Radial Arterial Transducer, and Transthoracic Cannula.',
      'Four calibrated medical waveforms render in real-time with authentic P-Q-R-S-T morphology, PPG pulsatile curves, arterial pressure dicrotic notches, and dynamic capnography.',
    ],
    interactiveActionLabel: 'View Live Waveforms',
    scrollTargetId: 'patient-monitor',
  },
  {
    stepNumber: 3,
    title: 'Physiological Homeostasis & Stable Telemetry Pacing',
    category: 'HOMEOSTASIS',
    demonstrationGoal: 'Demonstrate the baseline steady state where all biometric parameters reside securely within normal bounds.',
    keyProductFeatures: [
      'Scenario 1 simulates a stable post-operative adult patient with normal sinus rhythm (74 BPM) and room air oxygenation (98% SpO₂).',
      'Evaluating Proposition A: 98 < 90 → FALSE (0).',
      'Evaluating Proposition B: (74 < 50) ∨ (74 > 120) → FALSE (0).',
      'Conjunction Gate E = A ∧ B = 0 ∧ 0 = 0 (FALSE). Zero emergency alarms are energized.',
      'The interface paces with tranquil indicators, confirming stable physiological equilibrium.',
    ],
    interactiveActionLabel: 'Set Homeostasis State',
    interactiveScenarioId: 'normal',
    scrollTargetId: 'patient-monitor',
  },
  {
    stepNumber: 4,
    title: 'Analog Telemetry to Boolean Proposition Translation',
    category: 'DISCRETE ENGINE',
    demonstrationGoal: 'Demonstrate the exact mapping of continuous physical domain inequalities into formal Boolean variables.',
    keyProductFeatures: [
      'Continuous telemetry signals are fed directly into relational inequality comparators.',
      'Proposition A: "Capillary Oxygen Saturation is critically low" (SpO₂ < 90%).',
      'Proposition B: "Cardiac Rhythm is critically abnormal" (HR < 50 ∨ HR > 120).',
      'Proposition C: "Core Body Temperature is critically high" (Temp > 39.0°C).',
      'Relational inequalities deterministically map the physical continuum into truth values 𝔹 {0, 1}.',
    ],
    interactiveActionLabel: 'Inspect Logic Comparators',
    scrollTargetId: 'logic-engine',
  },
  {
    stepNumber: 5,
    title: 'Combined Emergency: Progressive Dual Collapse',
    category: 'EMERGENCY SIMULATION',
    demonstrationGoal: 'Demonstrate deterministic time-based deterioration where Hypoxia and Tachycardia satisfy the AND gate.',
    keyProductFeatures: [
      'The simulation engine triggers time-based deterioration: SpO₂ falls toward 82%, and Heart Rate climbs toward 152 BPM.',
      'When SpO₂ breaches 90%, Proposition A activates (0 → 1), posting an isolated warning (W = 1) while Code Red remains suppressed.',
      'When HR exceeds 120 BPM, Proposition B activates (0 → 1). Both input wires now energize the AND gate.',
      'Formula E = A ∧ B evaluates to 1 ∧ 1 = 1 (TRUE). The Code Red relay energizes the emergency strobe and audible alert.',
    ],
    interactiveActionLabel: 'Trigger Combined Emergency',
    interactiveScenarioId: 'combined_emergency',
    scrollTargetId: 'scenarios',
  },
  {
    stepNumber: 6,
    title: 'Independent Sensor Architecture & Fault Interlock',
    category: 'FAULT TOLERANCE',
    demonstrationGoal: 'Demonstrate independent sensor channel decoupling when an electrode detaches without interrupting unaffected telemetry.',
    keyProductFeatures: [
      'When ECG Lead II detaches, its impedance spikes to open circuit (> 50 kΩ) and the ECG waveform displays a flatline with disconnection noise.',
      'Crucially, pulse oximetry, blood pressure, and respiratory channels continue operating and transmitting online.',
      'Core Discrete Safety Rule: Missing telemetry data is NOT evaluated as 0 (safe) to prevent fatal false negatives.',
      'Proposition S_Fault triggers a technical hardware interlock, ensuring reliable fault isolation.',
    ],
    interactiveActionLabel: 'Simulate Sensor Lead-Off',
    interactiveScenarioId: 'sensor_fault',
    scrollTargetId: 'patient-monitor',
  },
  {
    stepNumber: 7,
    title: 'Physiological Stabilization & Alarm Clearance',
    category: 'RECOVERY',
    demonstrationGoal: 'Demonstrate post-intervention stabilization as parameters normalize and alarms resolve condition-based.',
    keyProductFeatures: [
      'Scenario 6 models therapeutic stabilization: oxygen therapy resaturates capillary SpO₂ back to 99%, and cardiac rate normalizes to 72 BPM.',
      'Proposition A clears (1 → 0), de-latching the conjunction gate (E = 0 ∧ 0 = 0).',
      'The simulated Alarm Management log automatically updates ongoing emergency events to "RESOLVED" with timestamps.',
      'Waveforms smoothly return to baseline sinus morphology, confirming complete recovery.',
    ],
    interactiveActionLabel: 'Run Recovery Sequence',
    interactiveScenarioId: 'recovery',
    scrollTargetId: 'scenarios',
  },
  {
    stepNumber: 8,
    title: 'Multi-Patient Ward Predicate Quantification',
    category: 'ACADEMIC LABORATORY',
    demonstrationGoal: 'Demonstrate first-order logic predicates and quantifiers (∀, ∃) across a multi-bed hospital ward.',
    keyProductFeatures: [
      'The Mathematics Laboratory extends propositional logic to First-Order Predicate Calculus over Universe of Discourse U = {Bed 1, ..., Bed 6}.',
      'Universal Quantifier ∀x ∈ Ward, ¬P(x) tests whether all ward beds are safe and non-critical.',
      'Existential Quantifier ∃x ∈ Ward, P(x) tests whether any bed requires clinical intervention, identifying exact counter-examples in real-time.',
      'Provides interactive modules for Truth Tables, De Morgan’s Laws, and SAT analysis.',
    ],
    interactiveActionLabel: 'Open Math Laboratory',
    scrollTargetId: 'math-laboratory',
  },
];

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerScenario?: (id: string) => void;
  onOpenMathTheater?: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  isOpen,
  onClose,
  onTriggerScenario,
  onOpenMathTheater,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);

  const currentSlide = PRODUCT_DEMO_SLIDES[currentSlideIndex];

  // Auto-advance timer
  useEffect(() => {
    let timer: number | null = null;
    if (isAutoPlay && isOpen) {
      timer = window.setInterval(() => {
        setCurrentSlideIndex((prev) => {
          if (prev >= PRODUCT_DEMO_SLIDES.length - 1) {
            setIsAutoPlay(false);
            return prev;
          }
          return prev + 1;
        });
      }, 8000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlay, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlay((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    soundEngine.playGateClick();
    if (currentSlideIndex < PRODUCT_DEMO_SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    soundEngine.playGateClick();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleExecuteAction = () => {
    soundEngine.playGateClick();
    if (currentSlide.interactiveScenarioId && onTriggerScenario) {
      onTriggerScenario(currentSlide.interactiveScenarioId);
    }
    if (currentSlide.scrollTargetId) {
      const el = document.getElementById(currentSlide.scrollTargetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#040812]/95 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-[#0b0f19] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold shadow-md">
              <Presentation className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold">
                  PRODUCT DEMONSTRATION MODE
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-blue-300 border border-slate-700 font-mono">
                  DEMO STEP {currentSlide.stepNumber} OF {PRODUCT_DEMO_SLIDES.length}
                </span>
              </div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                ICU GUARD: Patient Monitoring & Discrete Logic Platform
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAutoPlay
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
              {isAutoPlay ? 'PAUSE TIMER' : 'AUTO-ADVANCE'}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Exit Product Demo (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="px-6 py-2.5 bg-[#070b14] border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
          {PRODUCT_DEMO_SLIDES.map((slide, idx) => (
            <button
              key={slide.stepNumber}
              onClick={() => {
                soundEngine.playGateClick();
                setCurrentSlideIndex(idx);
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all border cursor-pointer ${
                idx === currentSlideIndex
                  ? 'bg-blue-600 text-white font-bold border-blue-500 shadow-sm'
                  : idx < currentSlideIndex
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-slate-950 border-slate-900 text-slate-600'
              }`}
            >
              0{slide.stepNumber}. {slide.category}
            </button>
          ))}
        </div>

        {/* Slide Stage Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                  {currentSlide.category}
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1">
                  {currentSlide.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {onOpenMathTheater && (
                  <button
                    onClick={onOpenMathTheater}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-blue-300 font-mono font-bold text-xs flex items-center gap-1.5 hover:text-white hover:border-slate-600 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-blue-300" />
                    <span>SOLVE THE MATH</span>
                  </button>
                )}

                {currentSlide.interactiveActionLabel && (
                  <button
                    onClick={handleExecuteAction}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono font-bold text-xs flex items-center gap-2 hover:scale-[1.02] shadow-lg shadow-blue-600/30 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 fill-white" />
                    {currentSlide.interactiveActionLabel}
                  </button>
                )}
              </div>
            </div>

            {/* Demonstration Goal Box */}
            <div className="p-4 rounded-xl bg-[#060a12] border border-blue-500/30 text-xs font-mono text-slate-300 flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span><strong>DEMONSTRATION OBJECTIVE:</strong> {currentSlide.demonstrationGoal}</span>
            </div>

            {/* Core Product Features */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3.5">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                PRODUCT ARCHITECTURE & SPECIFICATIONS:
              </span>
              <div className="space-y-3 font-sans text-slate-200 text-sm sm:text-base leading-relaxed">
                {currentSlide.keyProductFeatures.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {fIdx + 1}
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Controller Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentSlideIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-bold disabled:opacity-40 hover:text-white flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> PREVIOUS
              </button>

              <button
                onClick={handleNext}
                disabled={currentSlideIndex === PRODUCT_DEMO_SLIDES.length - 1}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold disabled:opacity-40 hover:bg-blue-500 flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                NEXT DEMO STEP <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundEngine.playGateClick();
                  setCurrentSlideIndex(0);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white ml-2 cursor-pointer"
                title="Restart Presentation from Slide 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Slide {currentSlideIndex + 1} of {PRODUCT_DEMO_SLIDES.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
