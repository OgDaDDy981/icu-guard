import React from 'react';
import type { BooleanPropositions, VitalsState, SystemStatus } from '../../types';
import { 
  Zap, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  Heart, 
  Thermometer, 
  ArrowRight
} from 'lucide-react';

interface LogicEngineProps {
  vitals: VitalsState;
  propositions: BooleanPropositions;
  systemStatus: SystemStatus;
  onRevealMath: () => void;
}

export const LogicEngine: React.FC<LogicEngineProps> = ({
  vitals,
  propositions,
  systemStatus: _systemStatus,
  onRevealMath,
}) => {
  const isEmergency = propositions.E_Combined;
  const isWarning = propositions.W_Warning && !isEmergency;

  return (
    <section id="logic-engine" className="relative w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2 font-bold">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>OPERATIONAL TELEMETRY & HARDWARE SAFETY INTERLOCK</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            SAFETY RELAY & SIGNAL CONDUITS
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
            Continuous physiological streams flow into isolated hardware safety interlocks.
            Every decision follows strict mathematical invariants to protect human life with zero ambiguity.
          </p>
        </div>

        <button
          onClick={onRevealMath}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer self-start md:self-auto shrink-0"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>SOLVE THE MATH</span>
        </button>
      </div>

      {/* 4 OPERATIONAL HARDWARE SIGNAL CONDUITS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Channel 1: O2 Saturation Conduit */}
        <div className={`p-4 rounded-2xl border transition-all ${
          propositions.A
            ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/40'
            : 'bg-[#090e1a]/90 border-white/10'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> PULSE OXIMETRY
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              propositions.A ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}>
              {propositions.A ? 'TRIPPED (A=1)' : 'NORMAL (A=0)'}
            </span>
          </div>
          <div className="text-3xl font-mono font-black text-white">
            {vitals.oxygen}% <span className="text-xs font-normal text-slate-400">SpO₂</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            Threshold: &lt; 90% (Hypoxia Rule)
          </div>
        </div>

        {/* Channel 2: Cardiac ECG Conduit */}
        <div className={`p-4 rounded-2xl border transition-all ${
          propositions.B
            ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/40'
            : 'bg-[#090e1a]/90 border-white/10'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> CARDIAC RHYTHM
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              propositions.B ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}>
              {propositions.B ? 'TRIPPED (B=1)' : 'NORMAL (B=0)'}
            </span>
          </div>
          <div className="text-3xl font-mono font-black text-white">
            {vitals.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            Safe Bounds: [50 — 120] BPM
          </div>
        </div>

        {/* Channel 3: Core Temperature Conduit */}
        <div className={`p-4 rounded-2xl border transition-all ${
          propositions.C
            ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/40'
            : 'bg-[#090e1a]/90 border-white/10'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5" /> CORE TEMPERATURE
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              propositions.C ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {propositions.C ? 'FEVER (C=1)' : 'NORMAL (C=0)'}
            </span>
          </div>
          <div className="text-3xl font-mono font-black text-white">
            {vitals.temperature}°C
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            Safety Boundary: &gt; 39.0°C
          </div>
        </div>

        {/* Channel 4: Hardware Interlock Relay State */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isEmergency
            ? 'bg-rose-950/60 border-rose-500 shadow-xl shadow-rose-950/60 animate-beacon'
            : isWarning
            ? 'bg-amber-950/40 border-amber-500/60'
            : 'bg-emerald-950/30 border-emerald-500/40'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> INTERLOCK RELAY
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
              isEmergency
                ? 'bg-rose-500 text-white'
                : isWarning
                ? 'bg-amber-500 text-slate-950'
                : 'bg-emerald-500 text-slate-950'
            }`}>
              {isEmergency ? 'ACTUATED' : isWarning ? 'WARNING' : 'SECURE'}
            </span>
          </div>
          <div className="text-xl font-mono font-black text-white">
            {isEmergency ? 'CODE RED RELAY' : isWarning ? 'ADVISORY ALERT' : 'NORMAL CONTINUITY'}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            {isEmergency ? 'Dual Conjunction (E = A ∧ B = 1)' : 'Relay Quiescent (E = 0)'}
          </div>
        </div>
      </div>

      {/* HARDWARE INTERLOCK CONTROLLER SHOWCASE */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c1424] via-[#080d19] to-[#0a1120] border border-white/12 shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 group">
        
        {/* Subtle Silicon Microchip Background Visual */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity pointer-events-none transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}logic-core.jpg')` }}
        />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>FORMAL BOOLEAN VERIFICATION ENGINE</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            How does Boolean Logic prevent deadly false alarms?
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            Single-sensor spikes occur frequently due to loose leads or patient motion. If single sensors sounded evacuation sirens,
            alarm fatigue would paralyze clinical staff. ICU GUARD correlates independent organs through formal conjunction ($E = A \land B$)
            and De Morgan equivalent dual circuits — guaranteeing safety without false panic.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Step-by-Step Interactive Pipeline</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Independent Sandbox Experimentation</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>De Morgan Dual Circuits & 6-Bed Ward</span>
            </div>
          </div>
        </div>

        {/* Big Action Button */}
        <div className="relative z-10 shrink-0 flex flex-col items-center gap-3">
          <button
            onClick={onRevealMath}
            className="px-8 py-4 rounded-2xl font-display font-black text-base tracking-wider uppercase transition-all bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/60 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-3 cursor-pointer group/btn"
          >
            <Zap className="w-5 h-5 fill-white group-hover/btn:scale-110 transition-transform" />
            <span>SOLVE THE MATH</span>
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
          <div className="text-[11px] font-mono text-slate-400">
            Synchronized with active vitals: {vitals.oxygen}% SpO₂ • {vitals.heartRate} BPM
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogicEngine;
