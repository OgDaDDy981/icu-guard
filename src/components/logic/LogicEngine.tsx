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
    <section id="logic-engine" className="relative w-full py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>OPERATIONAL TELEMETRY & HARDWARE SAFETY INTERLOCK</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            SAFETY RELAY & SIGNAL CONDUITS
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
            Continuous physiological telemetry streams are monitored through redundant hardware interlocks.
            All discrete mathematical theory, truth tables, and gate logic are unified inside the dedicated interactive laboratory.
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

      {/* 4 Operational Hardware Signal Conduits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Channel 1: O2 Saturation Conduit */}
        <div className={`p-4 rounded-2xl border transition-all ${
          propositions.A
            ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/40'
            : 'bg-[#090d16] border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> PULSE OXIMETRY
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              propositions.A ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {propositions.A ? 'TRIPPED' : 'NORMAL'}
            </span>
          </div>
          <div className="text-2xl font-mono font-black text-white">
            {vitals.oxygen}% <span className="text-xs font-normal text-slate-400">SpO₂</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            Safety Boundary: &lt; 90% (Hypoxia Rule)
          </div>
        </div>

        {/* Channel 2: Cardiac ECG Conduit */}
        <div className={`p-4 rounded-2xl border transition-all ${
          propositions.B
            ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/40'
            : 'bg-[#090d16] border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> CARDIAC RHYTHM
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              propositions.B ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {propositions.B ? 'TRIPPED' : 'NORMAL'}
            </span>
          </div>
          <div className="text-2xl font-mono font-black text-white">
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
            : 'bg-[#090d16] border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5" /> CORE TEMPERATURE
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              propositions.C ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {propositions.C ? 'TRIPPED' : 'NORMAL'}
            </span>
          </div>
          <div className="text-2xl font-mono font-black text-white">
            {vitals.temperature}°C
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            Safety Boundary: &gt; 39.0°C (Hyperpyrexia)
          </div>
        </div>

        {/* Channel 4: Hardware Interlock Relay State */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isEmergency
            ? 'bg-rose-950/60 border-rose-500 shadow-xl shadow-rose-950/60 animate-pulse'
            : isWarning
            ? 'bg-amber-950/40 border-amber-500/60'
            : 'bg-emerald-950/30 border-emerald-500/40'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> SAFETY INTERLOCK
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
              isEmergency
                ? 'bg-rose-500 text-white'
                : isWarning
                ? 'bg-amber-500 text-slate-950'
                : 'bg-emerald-500 text-slate-950'
            }`}>
              {isEmergency ? 'TRIPPED (HIGH)' : isWarning ? 'WARNING' : 'SECURE'}
            </span>
          </div>
          <div className="text-xl font-mono font-extrabold text-white">
            {isEmergency ? 'CODE RED RELAY' : isWarning ? 'ADVISORY ALERT' : 'NORMAL HOMEOSTASIS'}
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-2">
            {isEmergency ? 'Dual Conjunction Actuated' : 'Continuous Relay Continuity'}
          </div>
        </div>
      </div>

      {/* Hardware Interlock Diagram & Dedicated Math Invitation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0b101d] via-[#090d16] to-[#0d1322] border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>DETERMINISTIC FORMAL MATHEMATICS</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Want to see the mathematical deduction behind this decision?
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            All propositional logic, gate animations, dynamic truth tables, and mathematical proofs have been consolidated
            into <strong>SOLVE THE MATH</strong>. Step inside to watch live patient readings convert into Boolean variables,
            traverse animated logic circuits, and verify De Morgan's laws through hands-on experimentation.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Step 1-5 Interactive Pipeline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Independent Sandbox Mode</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>De Morgan Dual Circuits & 6-Bed Ward</span>
            </div>
          </div>
        </div>

        {/* Big Action Button */}
        <div className="shrink-0 flex flex-col items-center gap-3">
          <button
            onClick={onRevealMath}
            className="px-8 py-4 rounded-2xl font-display font-black text-base tracking-wider uppercase transition-all bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/60 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-3 cursor-pointer group"
          >
            <Zap className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>SOLVE THE MATH</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="text-[11px] font-mono text-slate-400">
            Uses active patient telemetry: {vitals.oxygen}% SpO₂ • {vitals.heartRate} BPM
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogicEngine;
