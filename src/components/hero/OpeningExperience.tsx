import React from 'react';
import { WaveformCanvas } from '../telemetry/WaveformCanvas';
import type { VitalsState } from '../../types';
import { 
  Activity, 
  ArrowDown, 
  Cpu, 
  Presentation, 
  Zap
} from 'lucide-react';

interface OpeningExperienceProps {
  vitals: VitalsState;
  onEnterSimulation: () => void;
  onOpenPresentation: () => void;
  onRevealMath: () => void;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({
  vitals,
  onEnterSimulation,
  onOpenPresentation,
  onRevealMath,
}) => {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between items-center text-center px-4 pt-16 pb-10 overflow-hidden bg-radial-vignette">
      {/* Background Interactive Radar Grid & Cinematic Glows */}
      <div className="absolute inset-0 bg-tactical-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/4 w-[400px] h-[300px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Telemetry Identity & Academic Metadata Badge */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-2 shadow-lg shadow-cyan-950/40">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>ICU GUARD v2.4</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">DISCRETE MATHEMATICS (UNIT 2)</span>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-xs font-mono hidden sm:flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-teal-400" />
          <span>SAFETY INTEGRITY: DETERMINISTIC SIL-3 SIM</span>
        </div>
      </div>

      {/* Center Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto my-auto py-8">
        {/* Main Logo & Brand Wordmark */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-6">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>EVERY SIGNAL MATTERS. EVERY DECISION COUNTS.</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase text-glow-cyan">
          THE SCIENCE OF <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent">
            EVERY SECOND.
          </span>
        </h1>

        {/* Supporting Statement */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          An intelligent patient monitoring simulation powered by mathematical logic.
        </p>

        {/* Live Hero ECG Lead II Waveform Teaser */}
        <div className="mt-8 max-w-xl mx-auto glass-panel rounded-2xl p-3 border border-cyan-500/30 shadow-2xl shadow-cyan-950/60">
          <div className="flex items-center justify-between px-3 py-1 text-[11px] font-mono text-slate-400">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              LIVE TELEMETRY STREAM
            </span>
            <span className="text-slate-300">
              P-Q-R-S-T CONDUIT • {vitals.heartRate} BPM
            </span>
          </div>
          <WaveformCanvas
            type="ecg"
            bpm={vitals.heartRate}
            oxygen={vitals.oxygen}
            color="#00f2fe"
            glowColor="rgba(0, 242, 254, 0.45)"
            height={70}
            label="LEAD II"
            sublabel="25 mm/s"
          />
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onEnterSimulation}
            className="px-8 py-4 rounded-2xl font-display font-extrabold text-sm sm:text-base tracking-wider uppercase transition-all bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-400 text-slate-950 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-3 cursor-pointer"
          >
            <span>ENTER THE SIMULATION</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>

          <button
            onClick={onRevealMath}
            className="px-6 py-4 rounded-2xl font-mono font-bold text-xs sm:text-sm tracking-wider uppercase transition-all glass-panel text-white border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-950/40 flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span>REVEAL THE MATH BEHIND</span>
          </button>

          <button
            onClick={onOpenPresentation}
            className="px-6 py-4 rounded-2xl font-mono font-bold text-xs sm:text-sm tracking-wider uppercase transition-all bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-teal-400/50 flex items-center gap-2 cursor-pointer"
          >
            <Presentation className="w-4 h-4 text-teal-400" />
            <span>FACULTY PRESENTATION MODE</span>
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Ticker Ribbon */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>VIRTUAL SENSORS: 5 CONNECTED</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">A = (SpO₂ &lt; 90)</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-bold">B = (HR Abnormal)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-semibold">FORMAL RULE: E = A ∧ B</span>
        </div>
        <div className="text-emerald-400 font-bold">
          HOMEOSTASIS: DETERMINISTIC
        </div>
      </div>
    </section>
  );
};
