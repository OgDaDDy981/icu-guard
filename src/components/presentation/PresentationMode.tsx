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
  GraduationCap
} from 'lucide-react';

interface PresentationSlide {
  stepNumber: number;
  title: string;
  category: string;
  focusArea: string;
  talkingPoints: string[];
  visualPrompt: string;
  actionLabel?: string;
  actionTarget?: string;
}

const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    stepNumber: 1,
    title: 'Introduction to ICU GUARD & Engineering Foundation',
    category: 'OVERVIEW',
    focusArea: 'Computer Engineering & Healthcare Systems',
    talkingPoints: [
      'Good morning / afternoon Respected Faculty and Evaluators.',
      'ICU GUARD is a Computer Engineering Discrete Mathematics project that demonstrates how formal Boolean logic and propositional calculus power deterministic patient-monitoring alert systems.',
      'Modern ICUs suffer from "Alert Fatigue" where 85% to 99% of alarms are false alarms caused by noisy single sensors.',
      'Our project models how multi-condition propositional logic eliminates false alarms while preserving life-critical safety invariants.',
    ],
    visualPrompt: 'Hero screen with cinematic ECG Lead II waveform and core system telemetry pacing.',
    actionLabel: 'Enter Patient Monitor',
    actionTarget: 'patient-monitor',
  },
  {
    stepNumber: 2,
    title: 'The Real-Time Telemetry & Patient Monitoring Environment',
    category: 'SENSORY LAYER',
    focusArea: 'Analog to Digital Physiological Signals',
    talkingPoints: [
      'Here you observe Bed 04 in our simulated Neuro-Trauma ICU ward.',
      'Five continuous vital parameters are tracked: Heart Rate (BPM), Oxygen Saturation (SpO₂), Core Body Temperature (°C), Arterial Blood Pressure (mmHg), and Respiratory Rate (RPM).',
      'The HTML5 Canvas draws continuous waveforms: Lead II ECG with authentic P-Q-R-S-T morphology, Photoplethysmography (PPG), and Arterial Line dicrotic notches at 250 Hz.',
    ],
    visualPrompt: 'Live patient monitoring dashboard showing continuous dynamic waveforms and vital cards.',
    actionLabel: 'Inspect Sensor Telemetry',
    actionTarget: 'patient-monitor',
  },
  {
    stepNumber: 3,
    title: 'Baseline Normal Parameters & Physiological Homeostasis',
    category: 'HOMEOSTASIS',
    focusArea: 'Normal Physiological Boundary Set',
    talkingPoints: [
      'In Scenario 1 (Normal Homeostasis), all physical measurements reside strictly within illustrative baseline ranges.',
      'Heart Rate is 74 BPM (normal bounds: 50 to 120 BPM).',
      'Oxygen Saturation is 98% (normal bounds: 95% to 100%).',
      'Core Temperature is 36.8°C (normal bounds: 36.5°C to 37.5°C).',
      'Zero alarms are energized. The interface paces with tranquil electric cyan and emerald indicators.',
    ],
    visualPrompt: 'All 5 vitals highlighted in green/cyan state with normal sinus rhythm.',
  },
  {
    stepNumber: 4,
    title: 'Translating Continuous Signals into Boolean Propositions',
    category: 'DISCRETE LOGIC',
    focusArea: 'Unit 2: Propositions & Truth Values',
    talkingPoints: [
      'This brings us directly to Unit 2 of Discrete Mathematics: Propositional Logic.',
      'A proposition is a declarative statement that is either strictly TRUE (1) or FALSE (0).',
      'We define three fundamental atomic propositions from physical inequality predicates:',
      'Proposition A: "Capillary Oxygen Saturation is critically low" (SpO₂ < 90%).',
      'Proposition B: "Cardiac Rhythm is critically abnormal" (HR < 50 ∨ HR > 120).',
      'Proposition C: "Core Body Temperature is critically high" (Temp > 39.0°C).',
    ],
    visualPrompt: 'Stage 01 to Stage 02 transition banner showing mathematical inequalities mapping to 𝔹 {0, 1}.',
    actionLabel: 'View Logic Engine',
    actionTarget: 'logic-engine',
  },
  {
    stepNumber: 5,
    title: 'Triggering the Combined Emergency Scenario (Hypoxia + Tachycardia)',
    category: 'EMERGENCY SIMULATION',
    focusArea: 'Simultaneous Multi-Sensor Physiological Collapse',
    talkingPoints: [
      'Now, we trigger Scenario 4: The Combined Emergency.',
      'The simulated patient suffers acute respiratory distress with hemodynamic collapse.',
      'Oxygen saturation plummets to 82% → Condition 82 < 90 holds → Proposition A becomes TRUE (1).',
      'Simultaneously, ventricular tachycardia spikes heart rate to 152 BPM → Condition 152 > 120 holds → Proposition B becomes TRUE (1).',
    ],
    visualPrompt: 'Waveforms accelerate to 152 BPM, SpO2 wave amplitude drops, and dual alert badges activate.',
    actionLabel: 'Run Scenario 4',
    actionTarget: 'scenarios',
  },
  {
    stepNumber: 6,
    title: 'Evaluating the Digital Logic Circuit & Conjunction Gate',
    category: 'CIRCUIT SYNTHESIS',
    focusArea: 'Conjunction Operator E = A ∧ B',
    talkingPoints: [
      'In our Logic Engine schematic, both inputs A and B are now energized with logic 1.',
      'Notice the glowing red signal particles propagating along the digital tracks into the ANSI/IEEE AND gate.',
      'The mathematical conjunction operator enforces: E = A ∧ B.',
      'Since A = 1 AND B = 1, the gate evaluates to 1 (HIGH).',
      'The system asserts the Emergency Actuator Relay, triggering the IEC 60601-1-8 high priority auditory and visual alarm.',
    ],
    visualPrompt: 'SVG circuit diagram with illuminated red lines and pulsing conjunction output.',
    actionLabel: 'Inspect Logic Gate',
    actionTarget: 'logic-engine',
  },
  {
    stepNumber: 7,
    title: 'The Signature Feature: "Reveal the Math Behind"',
    category: 'CINEMATIC PROOF',
    focusArea: 'Automated 6-Act Step-by-Step Formal Derivation',
    talkingPoints: [
      'We now launch our signature feature: "Reveal the Math Behind".',
      'This feature takes students and evaluators through a 6-Act cinematic breakdown of how physical telemetry is transformed into a rigorous mathematical deduction.',
      'Act 1 evaluates the oxygen sensor comparison (85 < 90 ⇒ A = 1).',
      'Act 2 evaluates the cardiac frequency comparison (150 > 120 ⇒ B = 1).',
      'Act 3 demonstrates the Boolean expression and signal convergence.',
      'Act 4 projects the complete truth table, dynamically highlighting row 4.',
      'Act 5 resolves TRUE ∧ TRUE ≡ TRUE.',
      'Act 6 contextualizes the engineering significance.',
    ],
    visualPrompt: 'Cinematic 6-Act Theater modal with automated timeline progression.',
  },
  {
    stepNumber: 8,
    title: 'Truth Table Proof & Sensor Failure Distinction',
    category: 'MATHEMATICAL RIGOR',
    focusArea: 'Exhaustive Valuation & Three-Valued Logic in Faults',
    talkingPoints: [
      'In our Dynamic Truth Table, row 4 [1, 1] evaluates to 1, while rows 1, 2, and 3 evaluate to 0.',
      'Crucially, in Scenario 5 (Sensor Failure), when an electrode detaches, our discrete logic does NOT treat the missing sensor as 0 (safe).',
      'Treating missing data as FALSE would cause a fatal false negative!',
      'Instead, the system asserts Proposition S_Fault, entering an explicit hardware interlock state.',
    ],
    visualPrompt: 'Truth table row 4 glowing red and sensor fault interlock display.',
  },
  {
    stepNumber: 9,
    title: 'Conclusion: Discrete Mathematics in Computer Engineering',
    category: 'SYNTHESIS & VIVA',
    focusArea: 'Academic Value & Real-World Engineering Impact',
    talkingPoints: [
      'In conclusion, ICU GUARD demonstrates that Discrete Mathematics is not just abstract theory—it is the foundational bedrock of all computer engineering.',
      'From life-critical biomedical monitors to avionics flight controllers, formal propositions, truth tables, and Boolean logic provide mathematical guarantees of correctness.',
      'We welcome questions from the faculty on propositional connectives, truth tables, De Morgan’s laws, and predicate quantifiers.',
    ],
    visualPrompt: 'Academic synthesis slide with congratulations and faculty Q&A readiness.',
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

  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  // Auto progression timer
  useEffect(() => {
    let timer: number | null = null;
    if (isAutoPlay && isOpen) {
      timer = window.setInterval(() => {
        setCurrentSlideIndex((prev) => {
          if (prev >= PRESENTATION_SLIDES.length - 1) {
            setIsAutoPlay(false);
            return prev;
          }
          return prev + 1;
        });
      }, 7000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlay, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    soundEngine.playGateClick();
    if (currentSlideIndex < PRESENTATION_SLIDES.length - 1) {
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
    if (currentSlide.stepNumber === 5 && onTriggerScenario) {
      onTriggerScenario('combined_emergency');
    }
    if (currentSlide.stepNumber === 7 && onOpenMathTheater) {
      onOpenMathTheater();
    }
    if (currentSlide.actionTarget) {
      const el = document.getElementById(currentSlide.actionTarget);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#02050e]/95 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-[#060c1d] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Presentation Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 text-slate-950 font-bold">
              <Presentation className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  FACULTY PRESENTATION MODE
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                  MILESTONE {currentSlide.stepNumber} OF 9
                </span>
              </div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                ICU GUARD: Discrete Mathematics & Engineering Defense
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
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
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Exit Presentation Mode"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="px-6 py-2.5 bg-[#030712] border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
          {PRESENTATION_SLIDES.map((slide, idx) => (
            <button
              key={slide.stepNumber}
              onClick={() => {
                soundEngine.playGateClick();
                setCurrentSlideIndex(idx);
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all border ${
                idx === currentSlideIndex
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                  : idx < currentSlideIndex
                  ? 'bg-slate-900 border-slate-800 text-slate-400'
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
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  {currentSlide.category} • {currentSlide.focusArea}
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1">
                  {currentSlide.title}
                </h3>
              </div>

              {currentSlide.actionLabel && (
                <button
                  onClick={handleExecuteAction}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 hover:scale-[1.02] shadow-lg shadow-cyan-500/30"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  {currentSlide.actionLabel}
                </button>
              )}
            </div>

            {/* Viva Presenter Speech Script */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase mb-3">
                <GraduationCap className="w-4 h-4" />
                <span>RECOMMENDED VIVA PRESENTATION SCRIPT:</span>
              </div>
              <div className="space-y-3 font-sans text-slate-200 text-sm sm:text-base leading-relaxed">
                {currentSlide.talkingPoints.map((point, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {pIdx + 1}
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Screen Cue */}
            <div className="p-4 rounded-xl bg-[#020510] border border-cyan-500/20 text-xs font-mono text-slate-400 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>VISUAL DEMONSTRATION FOCUS: {currentSlide.visualPrompt}</span>
            </div>
          </div>

          {/* Bottom Slide Navigation Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentSlideIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-bold disabled:opacity-40 hover:text-white flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> PREVIOUS STEP
              </button>

              <button
                onClick={handleNext}
                disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-mono text-xs font-bold disabled:opacity-40 hover:bg-cyan-400 flex items-center gap-1.5 shadow-md shadow-cyan-500/30"
              >
                NEXT STEP <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundEngine.playGateClick();
                  setCurrentSlideIndex(0);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white ml-2"
                title="Restart Presentation from Slide 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-slate-500">
              Slide {currentSlideIndex + 1} of {PRESENTATION_SLIDES.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
