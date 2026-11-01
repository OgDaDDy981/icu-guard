import React from 'react';
import { WaveformCanvas } from '../telemetry/WaveformCanvas';
import type { VitalsState } from '../../types';
import { 
  Activity, 
  ArrowDown, 
  Play, 
  Zap, 
  CheckCircle2, 
  Heart, 
  ShieldCheck,
  Radio,
  Sliders
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
    <section className="relative w-full min-h-[90vh] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-10 pb-12 overflow-hidden bg-[#111215]">
      
      {/* Subtle Warm Amber & Terracotta Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#d96347]/12 via-[#e5933a]/6 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-[#5da283]/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[350px] bg-[#e5933a]/8 rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle Warm Grid Texture */}
      <div className="absolute inset-0 warm-grid opacity-35 pointer-events-none" />

      {/* Top Experience Ticker */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181a20]/90 border border-[#faf6f0]/10 text-xs font-mono text-[#c5beaf] shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#5da283] animate-ping" />
          <span className="text-[#faf6f0] font-bold">ICU GUARD</span>
          <span className="text-[#55534f]">|</span>
          <span className="text-[#e5933a]">INTERACTIVE PATIENT MONITORING SIMULATION</span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-[#c5beaf]">
          <span className="flex items-center gap-1.5 text-[#5da283]">
            <CheckCircle2 className="w-4 h-4" />
            <span>DUAL-SENSOR VERIFICATION</span>
          </span>
          <span className="text-[#55534f]">•</span>
          <span className="flex items-center gap-1.5 text-[#faf6f0]">
            <ShieldCheck className="w-4 h-4 text-[#d96347]" />
            <span>ALARM FATIGUE PREVENTION</span>
          </span>
        </div>
      </div>

      {/* Center 2-Column Split: Editorial Storytelling + Live Warm Telemetry Unit */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        
        {/* Left Column: Vision & Human-Centric Communication (7 cols) */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e2027] border border-[#faf6f0]/10 text-[#d96347] font-mono text-xs tracking-wider uppercase font-bold">
            <Activity className="w-3.5 h-3.5 text-[#5da283] animate-pulse" />
            <span>DISCRETE MATHEMATICS IN ACTION</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#faf6f0] leading-[1.06]">
            HOW SIMPLE LOGIC <br />
            <span className="bg-gradient-to-r from-[#d96347] via-[#e5933a] to-[#faf6f0] bg-clip-text text-transparent">
              PREVENTS FALSE ALARMS.
            </span>
          </h1>

          <p className="text-[#c5beaf] text-base sm:text-lg max-w-2xl font-light leading-relaxed">
            In intensive care units, alarms sound constantly — yet up to 80% are false alarms caused by patient movement or loose sensor leads.
            ICU GUARD demonstrates how Boolean logic correlates multiple vital signs to trigger emergency alerts only when genuine danger occurs.
          </p>

          {/* Value Highlights Tiles */}
          <div className="grid grid-cols-3 gap-3 pt-1 max-w-xl">
            <div className="p-3.5 rounded-2xl bg-[#171920]/80 border border-[#faf6f0]/8 backdrop-blur-md">
              <div className="text-[10px] font-mono text-[#c5beaf] uppercase font-bold">Safe Monitoring</div>
              <div className="font-mono font-black text-xl text-[#faf6f0] mt-0.5">5 Vital Signs</div>
              <div className="text-[10px] font-mono text-[#5da283] mt-0.5">Continuous Sync</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#171920]/80 border border-[#faf6f0]/8 backdrop-blur-md">
              <div className="text-[10px] font-mono text-[#c5beaf] uppercase font-bold">Logic Engine</div>
              <div className="font-mono font-black text-xl text-[#faf6f0] mt-0.5">E = A ∧ B</div>
              <div className="text-[10px] font-mono text-[#e5933a] mt-0.5">Conjunction Rule</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#171920]/80 border border-[#faf6f0]/8 backdrop-blur-md">
              <div className="text-[10px] font-mono text-[#c5beaf] uppercase font-bold">Safety Guarantee</div>
              <div className="font-mono font-black text-xl text-[#faf6f0] mt-0.5">Fault Isolated</div>
              <div className="text-[10px] font-mono text-[#d96347] mt-0.5">No False Sirens</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {/* Primary: Watch Automated Product Demonstration */}
            <button
              onClick={onOpenPresentation}
              className="px-6 py-3.5 rounded-2xl font-display font-extrabold text-sm tracking-wider uppercase transition-all bg-gradient-to-r from-[#d96347] via-[#e26d5c] to-[#e5933a] hover:from-[#e26d5c] hover:to-[#efa347] text-white shadow-xl shadow-[#d96347]/25 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>WATCH PRODUCT TOUR</span>
            </button>

            {/* Secondary: Explore Simulation */}
            <button
              onClick={onEnterSimulation}
              className="px-6 py-3.5 rounded-2xl font-mono font-bold text-xs tracking-wider uppercase transition-all bg-[#1b1d24] hover:bg-[#252831] border border-[#faf6f0]/12 text-[#faf6f0] hover:border-[#faf6f0]/25 flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-[#5da283]" />
              <span>EXPLORE SIMULATION</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            {/* Tertiary: Solve the Math */}
            <button
              onClick={onRevealMath}
              className="px-5 py-3.5 rounded-2xl font-mono font-bold text-xs tracking-wider uppercase transition-all bg-[#171920] border border-[#faf6f0]/10 text-[#c5beaf] hover:text-white hover:border-[#e5933a]/50 flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#e5933a] fill-[#e5933a]" />
              <span>SOLVE THE MATH</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Bedside Telemetry Console Preview (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl p-5 bg-gradient-to-b from-[#1b1d24] to-[#14151b] border border-[#faf6f0]/12 shadow-2xl shadow-black/80 overflow-hidden group">
            
            {/* Background Warm Photographic Visual Asset */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${import.meta.env.BASE_URL}warm-telemetry.jpg')` }}
            />

            {/* Warm Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d96347] via-[#e5933a] to-[#5da283]" />

            <div className="relative z-10 space-y-4">
              {/* Telemetry Unit Top Banner */}
              <div className="flex items-center justify-between pb-3 border-b border-[#faf6f0]/8 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5da283] animate-pulse" />
                  <span className="text-[#faf6f0] font-black tracking-wider">BEDSIDE MONITOR</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-[#1e2027] border border-[#faf6f0]/10 text-[#5da283] font-bold">
                  PATIENT STABLE • NORMAL
                </span>
              </div>

              {/* Dynamic Oscilloscope Display */}
              <div className="rounded-2xl bg-[#0e1014]/95 border border-[#faf6f0]/8 p-3.5 shadow-inner">
                <div className="flex justify-between items-center text-[10px] font-mono mb-1 text-[#c5beaf]">
                  <span className="font-bold flex items-center gap-1.5 text-[#5da283]">
                    <Activity className="w-3.5 h-3.5" /> LEAD II (ECG)
                  </span>
                  <span>{vitals.heartRate} BPM • 25 mm/s</span>
                </div>
                <WaveformCanvas
                  type="ecg"
                  bpm={vitals.heartRate}
                  oxygen={vitals.oxygen}
                  color="#5da283"
                  glowColor="rgba(93, 162, 131, 0.4)"
                  height={84}
                  isFault={!vitals.sensorLeadAttached}
                />
              </div>

              {/* Vital Digits Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#111318]/90 border border-[#faf6f0]/8">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#c5beaf]">
                    <span>SpO₂ OXYGEN</span>
                    <span className="text-[#5da283] font-bold">&gt; 90% SAFE</span>
                  </div>
                  <div className="text-3xl font-mono font-black text-[#faf6f0] mt-1">
                    {vitals.oxygen}%
                  </div>
                  <div className="text-[10px] font-mono text-[#5da283] mt-0.5">
                    Condition A: FALSE (Safe)
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#111318]/90 border border-[#faf6f0]/8">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#c5beaf]">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-[#d96347]" /> HEART RATE
                    </span>
                    <span className="text-[#5da283] font-bold">NORMAL</span>
                  </div>
                  <div className="text-3xl font-mono font-black text-[#faf6f0] mt-1">
                    {vitals.heartRate} <span className="text-xs font-normal text-[#c5beaf]">BPM</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#5da283] mt-0.5">
                    Condition B: FALSE (Normal)
                  </div>
                </div>
              </div>

              {/* Real-time Boolean Evaluator Strip */}
              <div className="p-3 rounded-2xl bg-[#111318]/90 border border-[#faf6f0]/8 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#c5beaf]">Alarm Gate:</span>
                  <span className="font-bold text-[#faf6f0]">E = A ∧ B</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#5da283] font-bold">E = 0 (Quiescent)</span>
                  <Radio className="w-3.5 h-3.5 text-[#5da283]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="relative z-10 pt-4 flex flex-col items-center">
        <button
          onClick={onEnterSimulation}
          className="text-[#c5beaf] hover:text-white text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span>EXPLORE LIVE SIMULATION BELOW</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default OpeningExperience;
