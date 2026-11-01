import React from 'react';
import { Activity, GraduationCap, ShieldCheck, Zap, Presentation } from 'lucide-react';

interface FooterProps {
  onOpenPresentation: () => void;
  onRevealMath: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPresentation, onRevealMath }) => {
  return (
    <footer className="w-full bg-[#03060d] border-t border-white/8 pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-24 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Column 1: Project Identity */}
        <div className="space-y-3.5 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 p-[1px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#03060d] rounded-[11px] flex items-center justify-center text-blue-400">
                <Activity className="w-4 h-4 animate-pulse text-blue-400" />
              </div>
            </div>
            <span className="font-display font-black text-lg text-white tracking-wider">
              ICU GUARD
            </span>
          </div>
          <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
            Every Signal Matters. Every Decision Counts. An interactive medical simulation demonstrating formal Discrete Mathematics, propositional calculus, and deterministic Boolean logic in critical healthcare systems.
          </p>
          <div className="text-[11px] text-blue-400 font-semibold font-mono">
            Computer Engineering • Discrete Mathematics Interactive Simulation
          </div>
        </div>

        {/* Column 2: Discrete Mathematics Syllabus Alignment */}
        <div className="space-y-3">
          <h4 className="font-display font-black text-xs text-white uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>DISCRETE MATHEMATICS SYLLABUS</span>
          </h4>
          <ul className="space-y-2 text-[11px] text-slate-400">
            <li>• Propositions & Truth Values (A, B, C ∈ 𝔹)</li>
            <li>• Conjunction (∧), Disjunction (∨), Negation (¬)</li>
            <li>• Dynamic 2² Exhaustive Truth Tables</li>
            <li>• De Morgan's Laws of Logical Equivalence</li>
            <li>• Satisfiability (SAT), Tautology, Contradiction</li>
            <li>• Universal (∀) and Existential (∃) Quantifiers</li>
          </ul>
        </div>

        {/* Column 3: Technical Specifications */}
        <div className="space-y-3">
          <h4 className="font-display font-black text-xs text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>TECHNICAL ARCHITECTURE</span>
          </h4>
          <ul className="space-y-2 text-[11px] text-slate-400">
            <li>• Telemetry Sync: 500 Hz HTML5 Canvas Oscilloscope</li>
            <li>• Audio Engine: Web Audio API Oscillator Synthesis</li>
            <li>• Waveform Models: P-Q-R-S-T ECG, PPG, ABP, Capnography</li>
            <li>• Fault Isolation: Independent Multi-Sensor Channels</li>
            <li>• Simulation Engine: Deterministic Time-Interpolated Sequences</li>
          </ul>
        </div>

        {/* Column 4: Quick Launch Tools */}
        <div className="space-y-3">
          <h4 className="font-display font-black text-xs text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>SIMULATION SUITE</span>
          </h4>
          <div className="space-y-2.5">
            <button
              onClick={onOpenPresentation}
              className="w-full p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-200 hover:text-white hover:border-white/20 flex items-center justify-between text-left transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <span>Product Demonstration</span>
              <Presentation className="w-4 h-4 text-indigo-400" />
            </button>
            <button
              onClick={onRevealMath}
              className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/40 text-blue-200 hover:text-white hover:border-blue-400 flex items-center justify-between text-left transition-all font-bold cursor-pointer shadow-md shadow-blue-950/50 hover:scale-[1.02]"
            >
              <span>SOLVE THE MATH</span>
              <Zap className="w-4 h-4 fill-blue-300 text-blue-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Educational Simulation Disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/8 text-center text-[11px] text-slate-500 font-sans leading-relaxed">
        <p className="font-mono text-amber-400/90 mb-1.5 font-bold uppercase tracking-wider">
          EDUCATIONAL SIMULATION NOTICE
        </p>
        <p>
          This application is an educational simulation designed strictly for demonstrating concepts in Discrete Mathematics, Boolean logic, and propositional calculus.
          All biometric readings, physiological waveforms, and alarm thresholds are simulated models and are NOT intended for clinical medical monitoring, diagnosis, triage, or healthcare management.
        </p>
        <p className="mt-3 text-slate-600 font-mono flex items-center justify-center gap-1">
          <span>ICU GUARD © 2026 • Discrete Mathematics Patient Monitoring Simulation</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
