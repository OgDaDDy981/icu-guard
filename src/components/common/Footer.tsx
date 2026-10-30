import React from 'react';
import { Activity, GraduationCap, ShieldCheck, Zap, Presentation } from 'lucide-react';

interface FooterProps {
  onOpenPresentation: () => void;
  onRevealMath: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPresentation, onRevealMath }) => {
  return (
    <footer className="w-full bg-[#060a12] border-t border-slate-800 pt-16 pb-12 px-4 mt-20 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Column 1: Project Identity */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <span className="font-display font-extrabold text-base text-white tracking-wider">
              ICU GUARD
            </span>
          </div>
          <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
            Every Signal Matters. Every Decision Counts. An intelligent patient-monitoring simulation demonstrating formal Discrete Mathematics and deterministic Boolean logic in biomedical systems.
          </p>
          <div className="text-[11px] text-blue-400 font-semibold">
            Computer Engineering • Discrete Mathematics Interactive Simulation
          </div>
        </div>

        {/* Column 2: Discrete Mathematics Syllabus Alignment */}
        <div className="space-y-2.5">
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            DISCRETE MATHEMATICS SYLLABUS
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li>• Propositions & Truth Values (A, B, C ∈ 𝔹)</li>
            <li>• Conjunction (∧), Disjunction (∨), Negation (¬)</li>
            <li>• Dynamic 2² Exhaustive Truth Tables</li>
            <li>• De Morgan's Laws of Logical Equivalence</li>
            <li>• Satisfiability (SAT), Tautology, Contradiction</li>
            <li>• Universal (∀) and Existential (∃) Quantifiers</li>
          </ul>
        </div>

        {/* Column 3: Technical Specifications */}
        <div className="space-y-2.5">
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            TECHNICAL ARCHITECTURE
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li>• Telemetry Sync: 500 Hz HTML5 Canvas Oscilloscope</li>
            <li>• Audio Engine: Web Audio API Oscillator Synthesis</li>
            <li>• Waveform Models: P-Q-R-S-T ECG, PPG, ABP, Capnography</li>
            <li>• Fault Isolation: Independent Multi-Sensor Channels</li>
            <li>• Simulation Engine: Deterministic Time-Interpolated Sequences</li>
          </ul>
        </div>

        {/* Column 4: Quick Launch Tools */}
        <div className="space-y-2.5">
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            SIMULATION TOOLS
          </h4>
          <div className="space-y-2">
            <button
              onClick={onOpenPresentation}
              className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-600 flex items-center justify-between text-left transition-all cursor-pointer"
            >
              <span>Product Demonstration</span>
              <Presentation className="w-3.5 h-3.5 text-indigo-400" />
            </button>
            <button
              onClick={onRevealMath}
              className="w-full p-2 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-300 hover:bg-blue-900/40 flex items-center justify-between text-left transition-all font-bold cursor-pointer"
            >
              <span>SOLVE THE MATH</span>
              <Zap className="w-3.5 h-3.5 fill-blue-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Educational Simulation Disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 font-sans leading-relaxed">
        <p className="font-mono text-amber-400/90 mb-1 font-semibold uppercase tracking-wider">
          EDUCATIONAL SIMULATION NOTICE
        </p>
        <p>
          This application is an educational simulation designed strictly for demonstrating concepts in Discrete Mathematics, Boolean logic, and propositional calculus.
          All biometric readings, physiological waveforms, and alarm thresholds are simulated models and are NOT intended for clinical medical monitoring, diagnosis, triage, or healthcare management.
        </p>
        <p className="mt-3 text-slate-600 font-mono">
          ICU GUARD © 2026 • Discrete Mathematics Patient Monitoring Simulation
        </p>
      </div>
    </footer>
  );
};
