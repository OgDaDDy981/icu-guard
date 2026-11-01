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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#faf6f0]/8">
        <div>
          <div className="flex items-center gap-2 text-[#d96347] font-mono text-xs uppercase tracking-widest mb-2 font-bold">
            <Cpu className="w-4 h-4 text-[#e5933a]" />
            <span>DISCRETE BOOLEAN LOGIC ARCHITECTURE</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#faf6f0] tracking-tight">
            HOW LOGIC EVALUATES SIGNALS
          </h2>
          <p className="text-[#c5beaf] text-sm sm:text-base mt-2 max-w-2xl font-light">
            Continuous vital readings are compared to safe medical thresholds. When a reading crosses a boundary, its condition turns to True (1). The AND gate correlates both conditions before tripping an emergency alert.
          </p>
        </div>

        <button
          onClick={onRevealMath}
          className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-[#d96347] to-[#e5933a] hover:from-[#e06d53] hover:to-[#efa347] text-white shadow-xl shadow-[#d96347]/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer self-start md:self-auto shrink-0"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>SOLVE THE MATH</span>
        </button>
      </div>

      {/* 4 OPERATIONAL SIGNAL CONDUITS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Channel 1: O2 Saturation Conduit */}
        <div className={`p-4 rounded-2xl border transition-all ${
          propositions.A
            ? 'bg-[#d96347]/15 border-[#d96347]/60 shadow-lg shadow-[#d96347]/10'
            : 'bg-[#181a20]/90 border-[#faf6f0]/10'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#70b896] font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> OXYGEN SENSOR
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              propositions.A ? 'bg-[#d96347] text-white animate-pulse' : 'bg-[#1e2027] text-[#c5beaf]'
            }`}>
              {propositions.A ? 'LOW O₂ (A = 1)' : 'SAFE (A = 0)'}
            </span>
          </div>
          <div className="text-3xl font-mono font-black text-[#faf6f0]">
            {vitals.oxygen}% <span className="text-xs font-normal text-[#c5beaf]">SpO₂</span>
          </div>
          <div className="text-[11px] font-mono text-[#c5beaf] mt-2">
            Safety Boundary: &lt; 90%
          </div>
        </div>

        {/* Channel 2: Cardiac ECG Conduit */}
        <div className={`p-4 rounded-2xl border transition-all ${
          propositions.B
            ? 'bg-[#d96347]/15 border-[#d96347]/60 shadow-lg shadow-[#d96347]/10'
            : 'bg-[#181a20]/90 border-[#faf6f0]/10'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#d96347] font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> HEART RATE
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              propositions.B ? 'bg-[#d96347] text-white animate-pulse' : 'bg-[#1e2027] text-[#c5beaf]'
            }`}>
              {propositions.B ? 'ABNORMAL (B = 1)' : 'NORMAL (B = 0)'}
            </span>
          </div>
          <div className="text-3xl font-mono font-black text-[#faf6f0]">
            {vitals.heartRate} <span className="text-xs font-normal text-[#c5beaf]">BPM</span>
          </div>
          <div className="text-[11px] font-mono text-[#c5beaf] mt-2">
            Safe Bounds: [50 — 120] BPM
          </div>
        </div>

        {/* Channel 3: Core Temperature Conduit */}
        <div className={`p-4 rounded-2xl border transition-all ${
          propositions.C
            ? 'bg-[#d96347]/15 border-[#d96347]/60 shadow-lg shadow-[#d96347]/10'
            : 'bg-[#181a20]/90 border-[#faf6f0]/10'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#e5933a] font-bold flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5" /> TEMPERATURE
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              propositions.C ? 'bg-[#d96347] text-white' : 'bg-[#1e2027] text-[#c5beaf]'
            }`}>
              {propositions.C ? 'FEVER (C = 1)' : 'NORMAL (C = 0)'}
            </span>
          </div>
          <div className="text-3xl font-mono font-black text-[#faf6f0]">
            {vitals.temperature}°C
          </div>
          <div className="text-[11px] font-mono text-[#c5beaf] mt-2">
            Safety Boundary: &gt; 39.0°C
          </div>
        </div>

        {/* Channel 4: Hardware Interlock Relay State */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isEmergency
            ? 'bg-[#d96347]/20 border-[#d96347] shadow-xl shadow-[#d96347]/25 animate-beacon'
            : isWarning
            ? 'bg-[#e5933a]/15 border-[#e5933a]/60'
            : 'bg-[#5da283]/15 border-[#5da283]/40'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#faf6f0] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5da283]" /> LOGIC INTERLOCK
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
              isEmergency
                ? 'bg-[#d96347] text-white'
                : isWarning
                ? 'bg-[#e5933a] text-[#111215]'
                : 'bg-[#5da283] text-[#111215]'
            }`}>
              {isEmergency ? 'TRIPPED' : isWarning ? 'WARNING' : 'SECURE'}
            </span>
          </div>
          <div className="text-xl font-mono font-black text-[#faf6f0]">
            {isEmergency ? 'EMERGENCY ALERT' : isWarning ? 'ADVISORY WARNING' : 'NORMAL MONITORING'}
          </div>
          <div className="text-[11px] font-mono text-[#c5beaf] mt-2">
            {isEmergency ? 'Dual Conjunction (E = A ∧ B = 1)' : 'Alarm Relay Quiescent (E = 0)'}
          </div>
        </div>
      </div>

      {/* HARDWARE INTERLOCK CONTROLLER SHOWCASE */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1b1d24] via-[#15171d] to-[#14151b] border border-[#faf6f0]/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 group">
        
        {/* Subtle Visual Asset */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity pointer-events-none transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}warm-telemetry.jpg')` }}
        />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e2027] border border-[#faf6f0]/10 text-[#e5933a] font-mono text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>DISCRETE PROPOSITIONAL LOGIC</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-[#faf6f0] tracking-tight">
            How does Boolean Logic prevent deadly false alarms?
          </h3>
          <p className="text-[#c5beaf] text-sm sm:text-base leading-relaxed font-light">
            Single-sensor spikes occur frequently when a patient moves or a lead loosens. If every spike sounded an evacuation siren, alarm fatigue would quickly overwhelm nursing staff. ICU GUARD correlates independent vital signs through formal conjunction ($E = A \land B$) — guaranteeing emergency response when needed without sounding false sirens.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-[#c5beaf]">
            <div className="flex items-center gap-1.5 text-[#5da283]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Step-by-Step Logic Pipeline</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#e5933a]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Independent Sandbox Controls</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#faf6f0]">
              <CheckCircle2 className="w-4 h-4 text-[#d96347]" />
              <span>De Morgan Dual Circuits & Truth Tables</span>
            </div>
          </div>
        </div>

        {/* Big Action Button */}
        <div className="relative z-10 shrink-0 flex flex-col items-center gap-3">
          <button
            onClick={onRevealMath}
            className="px-8 py-4 rounded-2xl font-display font-black text-base tracking-wider uppercase transition-all bg-gradient-to-r from-[#d96347] via-[#e26d5c] to-[#e5933a] hover:from-[#e26d5c] hover:to-[#efa347] text-white shadow-2xl shadow-[#d96347]/30 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-3 cursor-pointer group/btn"
          >
            <Zap className="w-5 h-5 fill-white group-hover/btn:scale-110 transition-transform" />
            <span>SOLVE THE MATH</span>
            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
          <div className="text-[11px] font-mono text-[#c5beaf]">
            Synchronized with active vitals: {vitals.oxygen}% SpO₂ • {vitals.heartRate} BPM
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogicEngine;
