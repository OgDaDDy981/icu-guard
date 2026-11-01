import React from 'react';
import { WaveformCanvas } from '../telemetry/WaveformCanvas';
import type { VitalsState } from '../../types';
import { 
  Activity, 
  ArrowDown, 
  Presentation, 
  Zap, 
  ShieldCheck, 
  CheckCircle2,
  Heart,
  Cpu
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
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-12 pb-12 overflow-hidden bg-[#050811]">
      {/* Cinematic Ambient Lighting Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[400px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Background Subtle Oscilloscope Grid */}
      <div className="absolute inset-0 oscilloscope-grid opacity-40 pointer-events-none" />

      {/* Top Academic & System Status Ticker */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white font-bold">ICU GUARD v3.2</span>
          <span className="text-slate-600">|</span>
          <span className="text-blue-400">DISCRETE MATHEMATICS & BIOMEDICAL LOGIC</span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>IEC 60601-1-8 ALARM LOGIC</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1.5 text-blue-400">
            <Cpu className="w-4 h-4" />
            <span>&lt;2ms DETERMINISTIC EVALUATION</span>
          </span>
        </div>
      </div>

      {/* Center 2-Column Split: Editorial Hero + Interactive 3D Telemetry Unit */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        
        {/* Left Column: Vision & Value Proposition (7 cols) */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 font-mono text-xs tracking-wider uppercase font-bold">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>EVERY SIGNAL MATTERS. EVERY DECISION COUNTS.</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.05]">
            THE SCIENCE OF <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              EVERY SECOND.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            In intensive care units, human organ systems do not fail in isolation.
            ICU GUARD demonstrates how formal Discrete Mathematics and Boolean propositional logic translate
            continuous multi-channel biometric signals into deterministic, life-saving safety interlocks — eliminating
            false alarm fatigue while ensuring zero-latency response during genuine cardiac and respiratory arrest.
          </p>

          {/* Clinical Specifications Micro-Tiles */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-xl">
            <div className="p-3.5 rounded-2xl bg-[#090e1a]/80 border border-white/8 backdrop-blur-md">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Sensors</div>
              <div className="font-mono font-black text-xl text-white mt-0.5">5 Channels</div>
              <div className="text-[10px] font-mono text-emerald-400 mt-0.5">Decoupled Isolation</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090e1a]/80 border border-white/8 backdrop-blur-md">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Logic Engine</div>
              <div className="font-mono font-black text-xl text-white mt-0.5">E = A ∧ B</div>
              <div className="text-[10px] font-mono text-blue-400 mt-0.5">Formal Conjunction</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#090e1a]/80 border border-white/8 backdrop-blur-md">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Sampling</div>
              <div className="font-mono font-black text-xl text-white mt-0.5">500 Hz</div>
              <div className="text-[10px] font-mono text-teal-400 mt-0.5">Real-time Canvas</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <button
              onClick={onEnterSimulation}
              className="px-7 py-3.5 rounded-2xl font-display font-black text-sm tracking-wider uppercase transition-all bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 cursor-pointer group"
            >
              <span>ENTER PATIENT SIMULATION</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>

            <button
              onClick={onRevealMath}
              className="px-6 py-3.5 rounded-2xl font-mono font-bold text-xs tracking-wider uppercase transition-all bg-slate-900/90 border border-blue-500/40 text-blue-200 hover:text-white hover:border-blue-400 hover:scale-[1.02] flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-950/50"
            >
              <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
              <span>SOLVE THE MATH</span>
            </button>

            <button
              onClick={onOpenPresentation}
              className="px-5 py-3.5 rounded-2xl font-mono font-bold text-xs tracking-wider uppercase transition-all bg-slate-900/70 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <Presentation className="w-4 h-4 text-indigo-400" />
              <span>PRODUCT DEMO</span>
            </button>
          </div>
        </div>

        {/* Right Column: 3D Telemetry Unit Console Preview (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl p-5 bg-gradient-to-b from-[#0e1628] to-[#080d19] border border-white/12 shadow-2xl shadow-black/80 overflow-hidden group">
            
            {/* Background Cinematic Visual Asset */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${import.meta.env.BASE_URL}hero-telemetry.jpg')` }}
            />

            {/* Glowing Accent Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />

            <div className="relative z-10 space-y-4">
              {/* Telemetry Unit Top Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-black tracking-wider">BEDSIDE TELEMETRY UNIT</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-300 font-bold">
                  BAY 04 • LIVE
                </span>
              </div>

              {/* Dynamic Oscilloscope Display */}
              <div className="rounded-2xl bg-[#040710]/95 border border-white/10 p-3.5 shadow-inner">
                <div className="flex justify-between items-center text-[10px] font-mono mb-1 text-slate-400">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> LEAD II (ECG)
                  </span>
                  <span className="text-slate-300 font-bold">
                    {vitals.heartRate} BPM • 1 mV/cm
                  </span>
                </div>

                <WaveformCanvas
                  type="ecg"
                  bpm={vitals.heartRate}
                  oxygen={vitals.oxygen}
                  color="#10b981"
                  glowColor="rgba(16, 185, 129, 0.45)"
                  height={80}
                  label="LEAD II"
                  sublabel="500 Hz Calibration"
                />
              </div>

              {/* Vital Digits Dials */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/8">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span className="font-bold uppercase flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" /> HEART RATE
                    </span>
                    <span className="text-slate-500">[50 - 120]</span>
                  </div>
                  <div className="font-mono font-black text-3xl text-white mt-1">
                    {vitals.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1">Normal Sinus Rhythm</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/8">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span className="font-bold uppercase flex items-center gap-1">
                      <Activity className="w-3 h-3 text-cyan-400" /> OXYGEN SpO₂
                    </span>
                    <span className="text-slate-500">&lt; 90%</span>
                  </div>
                  <div className="font-mono font-black text-3xl text-cyan-400 mt-1">
                    {vitals.oxygen}%
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300 mt-1">Capillary Saturation</div>
                </div>
              </div>

              {/* Mathematical Conjunction Micro-Card */}
              <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 font-mono text-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-blue-300 uppercase font-bold">Active Proposition Logic</div>
                  <div className="text-white font-extrabold mt-0.5">
                    E = A ∧ B = ({vitals.oxygen < 90 ? '1' : '0'} ∧ {vitals.heartRate > 120 || vitals.heartRate < 50 ? '1' : '0'}) = 0
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black">
                  QUIESCENT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Ticker & Proof Points */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-8 border-t border-white/8 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>SENSORS: 5 ISOLATED BIOMEDICAL CHANNELS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-bold">A = (SpO₂ &lt; 90)</span>
          <span className="text-slate-600">•</span>
          <span className="text-rose-400 font-bold">B = (HR Abnormal)</span>
          <span className="text-slate-600">•</span>
          <span className="text-white font-bold">E = A ∧ B</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>ZERO ALERT FATIGUE GUARANTEE</span>
        </div>
      </div>
    </section>
  );
};

export default OpeningExperience;
