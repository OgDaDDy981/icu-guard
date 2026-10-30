import React from 'react';
import { WaveformCanvas } from '../telemetry/WaveformCanvas';
import type { VitalsState } from '../../types';
import { 
  Activity, 
  ArrowDown, 
  Presentation, 
  Zap, 
  ShieldCheck, 
  CheckCircle2 
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
    <section className="relative w-full min-h-[88vh] flex flex-col justify-between items-center text-center px-4 pt-12 pb-10 overflow-hidden bg-[#070b14]">
      {/* Subtle Depth Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/3 w-[350px] h-[250px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Telemetry Identity & Academic Metadata Badge */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 animate-in fade-in duration-500">
        <div className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-blue-300 text-xs font-mono font-semibold flex items-center gap-2 shadow-md">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>ICU GUARD v3.0</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-200">DISCRETE MATHEMATICS & PATIENT MONITORING</span>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs font-mono hidden sm:flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>DETERMINISTIC SAFETY INVARIANTS</span>
        </div>
      </div>

      {/* Center Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto my-auto py-6">
        {/* Brand Tagline */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs tracking-wider uppercase mb-5">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>EVERY SIGNAL MATTERS. EVERY DECISION COUNTS.</span>
        </div>

        {/* Main Title */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white uppercase">
          THE SCIENCE OF <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
            EVERY SECOND.
          </span>
        </h1>

        {/* Supporting Statement */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          An interactive medical patient-monitoring simulation powered by formal Discrete Mathematics.
          Modeling how propositional logic (E = A ∧ B) eliminates false alarm fatigue while guaranteeing deterministic emergency response.
        </p>

        {/* Live Hero ECG Lead II Waveform Telemetry Preview */}
        <div className="mt-8 max-w-xl mx-auto rounded-2xl bg-[#090d16] p-3 border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between px-3 py-1 text-[11px] font-mono text-slate-400">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY STREAM
            </span>
            <span className="text-slate-300">
              LEAD II • {vitals.heartRate} BPM • SpO₂ {vitals.oxygen}%
            </span>
          </div>
          <WaveformCanvas
            type="ecg"
            bpm={vitals.heartRate}
            oxygen={vitals.oxygen}
            color="#10b981"
            glowColor="rgba(16, 185, 129, 0.4)"
            height={68}
            label="LEAD II"
            sublabel="500 Hz Calibration"
          />
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onEnterSimulation}
            className="px-7 py-3.5 rounded-xl font-display font-extrabold text-sm tracking-wider uppercase transition-all bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5 cursor-pointer"
          >
            <span>ENTER PATIENT SIMULATION</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>

          <button
            onClick={onRevealMath}
            className="px-5 py-3.5 rounded-xl font-mono font-bold text-xs sm:text-sm tracking-wider uppercase transition-all bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/50 text-white hover:border-blue-400 hover:scale-[1.02] flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-900/40"
          >
            <Zap className="w-4 h-4 text-blue-300 fill-blue-300" />
            <span>SOLVE THE MATH</span>
          </button>

          <button
            onClick={onOpenPresentation}
            className="px-5 py-3.5 rounded-xl font-mono font-bold text-xs sm:text-sm tracking-wider uppercase transition-all bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 flex items-center gap-2 cursor-pointer"
          >
            <Presentation className="w-4 h-4 text-indigo-400" />
            <span>PRODUCT DEMONSTRATION</span>
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="relative z-10 w-full max-w-5xl mx-auto pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>SENSORS: 5 CONNECTED CHANNELS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-bold">A = (SpO₂ &lt; 90)</span>
          <span className="text-slate-600">|</span>
          <span className="text-blue-400 font-bold">B = (HR Abnormal)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-semibold">RULE: E = A ∧ B</span>
        </div>
        <div className="text-emerald-400 font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          HOMEOSTASIS: DETERMINISTIC
        </div>
      </div>
    </section>
  );
};
