import React from 'react';
import { Activity, GraduationCap, ShieldCheck, Zap, Play } from 'lucide-react';

interface FooterProps {
  onOpenPresentation: () => void;
  onRevealMath: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPresentation, onRevealMath }) => {
  return (
    <footer className="w-full bg-[#0e0f13] border-t border-[#faf6f0]/8 pt-16 pb-12 px-4 sm:px-6 lg:px-8 mt-24 text-xs font-mono text-[#c5beaf]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Column 1: Project Identity */}
        <div className="space-y-3.5 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d96347] via-[#e5933a] to-[#5da283] p-[1px] shadow-lg shadow-[#d96347]/20">
              <div className="w-full h-full bg-[#0e0f13] rounded-[11px] flex items-center justify-center text-[#d96347]">
                <Activity className="w-4 h-4 animate-pulse text-[#d96347]" />
              </div>
            </div>
            <span className="font-display font-black text-lg text-[#faf6f0] tracking-wider">
              ICU GUARD
            </span>
          </div>
          <p className="font-sans text-xs text-[#c5beaf] leading-relaxed font-light">
            An interactive educational simulation demonstrating how Discrete Mathematics, Boolean propositional logic, and multi-sensor verification turn raw biometric readings into calm, reliable clinical alerts.
          </p>
          <div className="text-[11px] text-[#e5933a] font-semibold font-mono">
            Computer Engineering • Discrete Mathematics Interactive Simulation
          </div>
        </div>

        {/* Column 2: Discrete Mathematics Syllabus Alignment */}
        <div className="space-y-3">
          <h4 className="font-display font-black text-xs text-[#faf6f0] uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#d96347]" />
            <span>DISCRETE MATHEMATICS CONCEPTS</span>
          </h4>
          <ul className="space-y-2 text-[11px] text-[#c5beaf]">
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
          <h4 className="font-display font-black text-xs text-[#faf6f0] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5da283]" />
            <span>SIMULATION ARCHITECTURE</span>
          </h4>
          <ul className="space-y-2 text-[11px] text-[#c5beaf]">
            <li>• Telemetry Sync: 500 Hz HTML5 Canvas Oscilloscope</li>
            <li>• Audio Engine: Web Audio API Oscillator Synthesis</li>
            <li>• Waveform Models: P-Q-R-S-T ECG, PPG, ABP, Capnography</li>
            <li>• Fault Isolation: Independent Multi-Sensor Channels</li>
            <li>• Simulation Engine: Deterministic Time-Interpolated Sequences</li>
          </ul>
        </div>

        {/* Column 4: Quick Launch Tools */}
        <div className="space-y-3">
          <h4 className="font-display font-black text-xs text-[#faf6f0] uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#e5933a]" />
            <span>SIMULATION EXPERIENCES</span>
          </h4>
          <div className="space-y-2.5">
            <button
              onClick={onOpenPresentation}
              className="w-full p-2.5 rounded-2xl bg-[#171920] border border-[#faf6f0]/10 text-[#faf6f0] hover:text-white hover:border-[#faf6f0]/25 flex items-center justify-between text-left transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <span>Automated Product Tour</span>
              <Play className="w-4 h-4 fill-[#d96347] text-[#d96347]" />
            </button>
            <button
              onClick={onRevealMath}
              className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-[#d96347] to-[#e5933a] hover:from-[#e06d53] hover:to-[#efa347] text-white flex items-center justify-between text-left transition-all font-bold cursor-pointer shadow-md shadow-[#d96347]/20 hover:scale-[1.02]"
            >
              <span>SOLVE THE MATH LAB</span>
              <Zap className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Educational Simulation Disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#faf6f0]/8 text-center text-[11px] text-[#7a7873] font-sans leading-relaxed">
        <p className="font-mono text-[#e5933a] mb-1.5 font-bold uppercase tracking-wider">
          EDUCATIONAL SIMULATION NOTICE
        </p>
        <p>
          This application is an educational simulation designed strictly for demonstrating concepts in Discrete Mathematics, Boolean logic, and propositional calculus.
          All biometric readings, physiological waveforms, and alarm thresholds are simulated models and are not intended for clinical medical monitoring, diagnosis, triage, or healthcare management.
        </p>
        <p className="mt-3 text-[#7a7873] font-mono flex items-center justify-center gap-1">
          <span>ICU GUARD • Discrete Mathematics Patient Monitoring Simulation</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
