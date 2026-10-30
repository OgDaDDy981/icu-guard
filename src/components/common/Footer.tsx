import React from 'react';
import { Activity, GraduationCap, ShieldCheck, Zap, Presentation } from 'lucide-react';

interface FooterProps {
  onOpenPresentation: () => void;
  onRevealMath: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPresentation, onRevealMath }) => {
  return (
    <footer className="w-full bg-[#02050e] border-t border-cyan-500/20 pt-16 pb-12 px-4 mt-20 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Column 1: Project Identity */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <span className="font-display font-extrabold text-base text-white tracking-wider">
              ICU GUARD
            </span>
          </div>
          <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
            Every Signal Matters. Every Decision Counts. An intelligent patient monitoring simulation demonstrating formal Discrete Mathematics in biomedical computing.
          </p>
          <div className="text-[11px] text-cyan-400">
            Computer Engineering Department • Semester Evaluation
          </div>
        </div>

        {/* Column 2: Discrete Mathematics Syllabus (Unit 2) */}
        <div className="space-y-2.5">
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            UNIT 2 SYLLABUS ALIGNMENT
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li>• Propositions & Truth Values (A, B, C ∈ 𝔹)</li>
            <li>• Conjunction (∧), Disjunction (∨), Negation (¬)</li>
            <li>• Dynamic 2² Exhaustive Truth Tables</li>
            <li>• De Morgan's Laws of Equivalence</li>
            <li>• Satisfiability (SAT), Tautology, Contradiction</li>
            <li>• Universal (∀) and Existential (∃) Quantifiers</li>
          </ul>
        </div>

        {/* Column 3: Engineering Safety Guarantees */}
        <div className="space-y-2.5">
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            SYSTEM SPECIFICATION
          </h4>
          <ul className="space-y-1.5 text-[11px] text-slate-400">
            <li>• Telemetry Sync: 250 Hz HTML5 Canvas</li>
            <li>• Audio Engine: Web Audio API (IEC 60601-1-8)</li>
            <li>• Lead II ECG: Physiological P-Q-R-S-T Model</li>
            <li>• Fault Handling: Three-valued Logic (Lead-off ≠ 0)</li>
            <li>• Architecture: Zero Server Latency Client-side</li>
          </ul>
        </div>

        {/* Column 4: Presentation & Defense Quick Links */}
        <div className="space-y-2.5">
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            EVALUATION TOOLS
          </h4>
          <div className="space-y-2">
            <button
              onClick={onOpenPresentation}
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-cyan-500/50 flex items-center justify-between text-left transition-all"
            >
              <span>Faculty Presentation Mode</span>
              <Presentation className="w-3.5 h-3.5 text-teal-400" />
            </button>
            <button
              onClick={onRevealMath}
              className="w-full p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40 flex items-center justify-between text-left transition-all font-bold"
            >
              <span>Reveal the Math Behind</span>
              <Zap className="w-3.5 h-3.5 fill-cyan-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Illustrative Clinical Disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 text-center text-[11px] text-slate-500 font-sans leading-relaxed">
        <p className="font-mono text-amber-400/80 mb-1 font-semibold">
          ACADEMIC SIMULATION DISCLAIMER
        </p>
        <p>
          This website is an educational engineering simulation designed strictly for academic evaluation in Discrete Mathematics (Propositional Logic).
          All biometric readings, physiological waveforms, and alarm thresholds are illustrative demonstrations and are NOT intended for clinical medical diagnosis, triage, or healthcare management.
        </p>
        <p className="mt-3 text-slate-600 font-mono">
          ICU GUARD © 2026 • Computer Engineering Discrete Mathematics Project
        </p>
      </div>
    </footer>
  );
};
