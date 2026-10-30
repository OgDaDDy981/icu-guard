import React, { useState, useEffect } from 'react';
import type { VitalsState, BooleanPropositions, SensorChannelsState } from '../../types';
import { soundEngine } from '../../utils/audio';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  ArrowRight,
  RotateCcw,
  Binary,
  Layers,
  Sparkles,
  Users,
  Equal,
  Heart,
  Activity,
  CheckCircle2,
  Sliders,
  Scale,
  Cpu
} from 'lucide-react';

interface SolveTheMathModalProps {
  isOpen: boolean;
  onClose: () => void;
  vitals: VitalsState;
  propositions: BooleanPropositions;
  sensors?: SensorChannelsState;
}

export const SolveTheMathModal: React.FC<SolveTheMathModalProps> = ({
  isOpen,
  onClose,
  vitals,
  propositions,
  sensors,
}) => {
  // Navigation: Step 1 to 6
  const [activeStep, setActiveStep] = useState<number>(1);

  // Step 5 Sandbox State (Independent manual exploration)
  const [sandboxA, setSandboxA] = useState<boolean>(propositions.A);
  const [sandboxB, setSandboxB] = useState<boolean>(propositions.B);

  // Step 6 Sub-Tab State
  const [subTab, setSubTab] = useState<'connectives' | 'demorgan' | 'sat' | 'quantifiers'>('connectives');

  // Step 6 Sub-Tab 1: Connectives Lab State
  const [connP, setConnP] = useState<boolean>(true);
  const [connQ, setConnQ] = useState<boolean>(false);
  const [selectedConn, setSelectedConn] = useState<'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'IMPLIES' | 'IFF'>('AND');

  // Step 6 Sub-Tab 2: De Morgan Dual Circuit State
  const [dmA, setDmA] = useState<boolean>(true);
  const [dmB, setDmB] = useState<boolean>(false);
  const [selectedDeMorganLaw, setSelectedDeMorganLaw] = useState<'law1' | 'law2'>('law1');

  // Step 6 Sub-Tab 3: SAT / Tautology State
  const [selectedFormula, setSelectedFormula] = useState<'contingent' | 'tautology' | 'contradiction' | 'safety_invariant'>('safety_invariant');

  // Step 6 Sub-Tab 4: 6-Bed Ward Quantifiers State
  const [beds, setBeds] = useState([
    { id: 1, name: 'Bed 01 (Post-Op)', isCritical: false, hr: 72, spo2: 99, temp: 36.8 },
    { id: 2, name: 'Bed 02 (Cardiology)', isCritical: false, hr: 80, spo2: 97, temp: 37.1 },
    { id: 3, name: 'Bed 03 (Pulmonology)', isCritical: false, hr: 76, spo2: 98, temp: 36.9 },
    { id: 4, name: 'Bed 04 (Neuro-ICU)', isCritical: true, hr: 148, spo2: 84, temp: 38.6 },
    { id: 5, name: 'Bed 05 (Surgical)', isCritical: false, hr: 68, spo2: 98, temp: 36.7 },
    { id: 6, name: 'Bed 06 (Transplant)', isCritical: false, hr: 74, spo2: 99, temp: 37.0 },
  ]);

  // Sync sandbox with live props when modal opens
  useEffect(() => {
    if (isOpen) {
      setSandboxA(propositions.A);
      setSandboxB(propositions.B);
    }
  }, [isOpen, propositions.A, propositions.B]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && activeStep < 6) {
        soundEngine.playGateClick();
        setActiveStep((s) => s + 1);
      }
      if (e.key === 'ArrowLeft' && activeStep > 1) {
        soundEngine.playGateClick();
        setActiveStep((s) => s - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeStep, onClose]);

  if (!isOpen) return null;

  const currentOxygen = vitals.oxygen || 98;
  const currentHeartRate = vitals.heartRate || 74;
  const propA = propositions.A;
  const propB = propositions.B;
  const propE = propositions.E_Combined;

  // Step 5 Sandbox Output
  const sandboxOutput = sandboxA && sandboxB;

  // Step 6 Connective Output
  const computeConnOutput = () => {
    switch (selectedConn) {
      case 'AND': return connP && connQ;
      case 'OR': return connP || connQ;
      case 'NOT': return !connP;
      case 'XOR': return (connP && !connQ) || (!connP && connQ);
      case 'NAND': return !(connP && connQ);
      case 'NOR': return !(connP || connQ);
      case 'IMPLIES': return !connP || connQ;
      case 'IFF': return connP === connQ;
    }
  };
  const connOutput = computeConnOutput();

  // Step 6 Ward Quantifiers Output
  const criticalBeds = beds.filter((b) => b.isCritical);
  const someCritical = criticalBeds.length > 0;
  const allStable = beds.every((b) => !b.isCritical);

  const toggleBed = (id: number) => {
    soundEngine.playGateClick();
    setBeds((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              isCritical: !b.isCritical,
              hr: !b.isCritical ? 144 : 72,
              spo2: !b.isCritical ? 85 : 98,
              temp: !b.isCritical ? 38.8 : 36.8,
            }
          : b
      )
    );
  };

  const stepsList = [
    { num: 1, name: '1. Inputs', subtitle: 'Live Telemetry & Thresholds' },
    { num: 2, name: '2. Propositions', subtitle: 'Continuous to Discrete' },
    { num: 3, name: '3. Logic Circuit', subtitle: 'Physical Signal Conjunction' },
    { num: 4, name: '4. Truth Table', subtitle: 'Exhaustive Row Illumination' },
    { num: 5, name: '5. Sandbox', subtitle: 'Independent Experimentation' },
    { num: 6, name: '6. Extended Lab', subtitle: 'De Morgan, SAT & Quantifiers' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#040812]/92 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200">
      {/* Modal Shell */}
      <div className="relative w-full max-w-6xl bg-[#090d16] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 bg-[#0d121f] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-extrabold">
                  SOLVE THE MATH • INTERACTIVE SIMULATION LABORATORY
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-800/60 font-mono font-bold">
                  STEP {activeStep} OF 6
                </span>
              </div>
              <h2 className="font-display font-black text-lg sm:text-xl text-white tracking-tight">
                {stepsList[activeStep - 1].subtitle}
              </h2>
            </div>
          </div>

          {/* Active Patient Telemetry Pill & Back Action */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Live Patient:</span>
              <span className="text-cyan-400 font-bold">SpO₂: {currentOxygen}%</span>
              <span className="text-slate-600">|</span>
              <span className="text-rose-400 font-bold">HR: {currentHeartRate} BPM</span>
              <span className="text-slate-600">|</span>
              <span className={propE ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                E = {propE ? '1 (EMERGENCY)' : '0 (NORMAL)'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
              title="Return to Patient Monitor (Esc)"
            >
              <X className="w-4 h-4" />
              <span>BACK TO PATIENT SIMULATION</span>
            </button>
          </div>
        </div>

        {/* Step Progression Ribbon */}
        <div className="px-4 py-2.5 bg-[#070b14] border-b border-slate-800/80 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
          {stepsList.map((step) => {
            const isActive = activeStep === step.num;
            const isCompleted = activeStep > step.num;

            return (
              <button
                key={step.num}
                onClick={() => {
                  soundEngine.playGateClick();
                  setActiveStep(step.num);
                }}
                className={`flex-1 min-w-[130px] px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-between border cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                    : isCompleted
                    ? 'bg-slate-900/80 text-blue-300 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-900/40 text-slate-400 border-slate-800/60 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="text-left truncate">
                  <div className="truncate">{step.name}</div>
                  <div className={`text-[9px] font-normal truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {step.subtitle}
                  </div>
                </div>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-1 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Dynamic Step Content Area */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
          {/* ============================================================== */}
          {/* STEP 1: UNDERSTAND THE INPUTS (LIVE READINGS & THRESHOLDS) */}
          {/* ============================================================== */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="max-w-3xl">
                <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                  STEP 1 — ANALOG TELEMETRY ACQUISITION
                </div>
                <h3 className="font-display font-black text-2xl text-white mt-1">
                  Inspect Live Patient Readings & Safety Boundaries
                </h3>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                  Before discrete mathematical propositions can be evaluated, the patient monitor continuously digitizes
                  analog voltages from biological sensors. Each vital sign is measured against calibrated medical thresholds.
                </p>
              </div>

              {/* Instruments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SpO2 Instrument */}
                <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-4 h-4" /> PULSE OXIMETER CHANNEL
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      LEAD {sensors?.spo2?.leadAttached ? 'ATTACHED (SNR 98%)' : 'ONLINE'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Live Patient Value</div>
                      <div className="font-mono font-black text-4xl sm:text-5xl text-cyan-400">
                        {currentOxygen}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Critical Threshold</div>
                      <div className="font-mono font-bold text-xl text-rose-400">&lt; 90%</div>
                    </div>
                  </div>

                  {/* Visual Gauge Bar */}
                  <div className="relative w-full h-8 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-1 flex items-center mb-4">
                    {/* Critical Hypoxia Region (< 90%) */}
                    <div className="h-full bg-rose-950/60 border-r-2 border-rose-500 flex items-center justify-center" style={{ width: '90%' }}>
                      <span className="text-[10px] font-mono font-bold text-rose-300">
                        CRITICAL DANGER ZONE (&lt; 90%)
                      </span>
                    </div>
                    {/* Safe Homeostasis Region (>= 90%) */}
                    <div className="h-full bg-emerald-950/50 flex items-center justify-center flex-1">
                      <span className="text-[10px] font-mono font-bold text-emerald-300">SAFE</span>
                    </div>

                    {/* Indicator Needle */}
                    <div
                      className="absolute top-0 bottom-0 w-2 bg-white shadow-lg shadow-cyan-400/80 rounded transition-all duration-300"
                      style={{ left: `${Math.min(100, Math.max(0, currentOxygen))}%`, transform: 'translateX(-50%)' }}
                    />
                  </div>

                  {/* Comparison Evaluation Badge */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between font-mono text-xs ${
                    propA
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                      : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  }`}>
                    <div>
                      <div className="font-bold">INEQUALITY EVALUATION:</div>
                      <div className="text-sm font-extrabold mt-0.5">
                        {currentOxygen}% &lt; 90% ⇒ <span className="underline">{propA ? 'HOLDS (TRUE)' : 'FAILS (FALSE)'}</span>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-black ${propA ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'}`}>
                      A = {propA ? '1 (TRUE)' : '0 (FALSE)'}
                    </div>
                  </div>
                </div>

                {/* Heart Rate Instrument */}
                <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-xl relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Heart className="w-4 h-4" /> ECG TELEMETRY CHANNEL
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      LEAD {sensors?.ecg?.leadAttached ? 'ATTACHED (SNR 99%)' : 'ONLINE'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Live Patient Value</div>
                      <div className="font-mono font-black text-4xl sm:text-5xl text-rose-400">
                        {currentHeartRate} <span className="text-xl font-normal text-slate-400">BPM</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Safe Operational Range</div>
                      <div className="font-mono font-bold text-xl text-emerald-400">[50 — 120] BPM</div>
                    </div>
                  </div>

                  {/* Visual Range Bar (Scale: 30 to 180 BPM) */}
                  <div className="relative w-full h-8 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-1 flex items-center mb-4">
                    {/* Bradycardia Danger (< 50) */}
                    <div className="h-full bg-amber-950/60 border-r-2 border-amber-500 flex items-center justify-center" style={{ width: '20%' }}>
                      <span className="text-[9px] font-mono font-bold text-amber-300">&lt;50</span>
                    </div>
                    {/* Safe Sinus Zone (50 - 120) */}
                    <div className="h-full bg-emerald-950/60 border-r-2 border-rose-500 flex items-center justify-center" style={{ width: '47%' }}>
                      <span className="text-[10px] font-mono font-bold text-emerald-300">SAFE [50 - 120]</span>
                    </div>
                    {/* Tachycardia Danger (> 120) */}
                    <div className="h-full bg-rose-950/60 flex items-center justify-center flex-1">
                      <span className="text-[9px] font-mono font-bold text-rose-300">&gt;120 TACHY</span>
                    </div>

                    {/* Indicator Needle */}
                    {(() => {
                      const pct = Math.min(100, Math.max(0, ((currentHeartRate - 30) / (180 - 30)) * 100));
                      return (
                        <div
                          className="absolute top-0 bottom-0 w-2 bg-white shadow-lg shadow-rose-400/80 rounded transition-all duration-300"
                          style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
                        />
                      );
                    })()}
                  </div>

                  {/* Comparison Evaluation Badge */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between font-mono text-xs ${
                    propB
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                      : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  }`}>
                    <div>
                      <div className="font-bold">BOUNDS EVALUATION:</div>
                      <div className="text-sm font-extrabold mt-0.5">
                        ({currentHeartRate} &lt; 50) ∨ ({currentHeartRate} &gt; 120) ⇒ <span className="underline">{propB ? 'HOLDS (TRUE)' : 'FAILS (FALSE)'}</span>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-black ${propB ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'}`}>
                      B = {propB ? '1 (TRUE)' : '0 (FALSE)'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400 font-mono">
                  Continuous analog variables are now evaluated against thresholds and ready for transformation into discrete propositions.
                </div>
                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setActiveStep(2);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 shrink-0"
                >
                  <span>STEP 2: CONVERT TO PROPOSITIONS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 2: CONVERT READINGS INTO PROPOSITIONS (ANIMATED TRANSFORMATION) */}
          {/* ============================================================== */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="max-w-3xl">
                <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                  STEP 2 — THE PROPOSITIONAL TRANSFORMATION
                </div>
                <h3 className="font-display font-black text-2xl text-white mt-1">
                  Relational Comparators to Discrete Boolean Variables
                </h3>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                  In formal logic, an atomic proposition is a declarative statement that is either strictly True (1) or False (0).
                  Watch the continuous physiological metrics pass through relational comparators into digital switches.
                </p>
              </div>

              {/* Transformation Pipelines */}
              <div className="space-y-4">
                {/* Channel A Pipeline */}
                <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-xl">
                  <div className="text-xs font-mono text-cyan-400 font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    CHANNEL A: OXYGEN DESATURATION PROPOSITION
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-3 font-mono">
                    {/* Stage 1: Analog Sensor Value */}
                    <div className="w-full md:w-1/4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Input Sensor</div>
                      <div className="text-2xl font-black text-cyan-400 mt-1">SpO₂ = {currentOxygen}%</div>
                      <div className="text-[10px] text-slate-500 mt-1">Continuous Domain [0..100]</div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-500 shrink-0 hidden md:block" />

                    {/* Stage 2: Relational Inequality */}
                    <div className="w-full md:w-1/3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Relational Comparator</div>
                      <div className="text-lg font-bold text-white mt-1">
                        P(SpO₂): {currentOxygen} &lt; 90
                      </div>
                      <div className={`text-xs font-bold mt-1 ${propA ? 'text-rose-400' : 'text-emerald-400'}`}>
                        Inequality {propA ? 'HOLDS' : 'DOES NOT HOLD'}
                      </div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-500 shrink-0 hidden md:block" />

                    {/* Stage 3: Digital Boolean Switch */}
                    <div className={`w-full md:flex-1 p-4 rounded-xl border flex items-center justify-between transition-all ${
                      propA
                        ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/50'
                        : 'bg-emerald-950/30 border-emerald-500/50'
                    }`}>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase">Atomic Proposition A</div>
                        <div className="text-2xl font-black text-white mt-0.5">
                          A = {propA ? 'TRUE (1)' : 'FALSE (0)'}
                        </div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          {propA ? 'Critical Hypoxia Alert Energized' : 'Normal Oxygenation Safe'}
                        </div>
                      </div>

                      <div className={`w-14 h-8 rounded-full p-1 transition-all flex items-center ${
                        propA ? 'bg-rose-500 justify-end' : 'bg-slate-700 justify-start'
                      }`}>
                        <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center font-bold text-[10px] text-slate-900">
                          {propA ? '1' : '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Channel B Pipeline */}
                <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-xl">
                  <div className="text-xs font-mono text-rose-400 font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    CHANNEL B: CARDIAC FREQUENCY ABNORMALITY PROPOSITION
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-3 font-mono">
                    {/* Stage 1: Analog Sensor Value */}
                    <div className="w-full md:w-1/4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Input Sensor</div>
                      <div className="text-2xl font-black text-rose-400 mt-1">HR = {currentHeartRate} BPM</div>
                      <div className="text-[10px] text-slate-500 mt-1">Continuous Domain [30..220]</div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-500 shrink-0 hidden md:block" />

                    {/* Stage 2: Relational Inequality */}
                    <div className="w-full md:w-1/3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Relational Comparator</div>
                      <div className="text-lg font-bold text-white mt-1">
                        Q(HR): ({currentHeartRate} &lt; 50) ∨ ({currentHeartRate} &gt; 120)
                      </div>
                      <div className={`text-xs font-bold mt-1 ${propB ? 'text-rose-400' : 'text-emerald-400'}`}>
                        Disjunction {propB ? 'HOLDS' : 'DOES NOT HOLD'}
                      </div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-500 shrink-0 hidden md:block" />

                    {/* Stage 3: Digital Boolean Switch */}
                    <div className={`w-full md:flex-1 p-4 rounded-xl border flex items-center justify-between transition-all ${
                      propB
                        ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/50'
                        : 'bg-emerald-950/30 border-emerald-500/50'
                    }`}>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase">Atomic Proposition B</div>
                        <div className="text-2xl font-black text-white mt-0.5">
                          B = {propB ? 'TRUE (1)' : 'FALSE (0)'}
                        </div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          {propB ? 'Critical Arrhythmia Alert Energized' : 'Normal Sinus Rhythm Safe'}
                        </div>
                      </div>

                      <div className={`w-14 h-8 rounded-full p-1 transition-all flex items-center ${
                        propB ? 'bg-rose-500 justify-end' : 'bg-slate-700 justify-start'
                      }`}>
                        <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center font-bold text-[10px] text-slate-900">
                          {propB ? '1' : '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setActiveStep(1);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>STEP 1</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setActiveStep(3);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  <span>STEP 3: PROCESS THE LOGIC</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 3: PROCESS THE LOGIC (CIRCUIT, SIGNAL PROPAGATION & GATE) */}
          {/* ============================================================== */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="max-w-3xl">
                <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                  STEP 3 — THE CONJUNCTION LOGIC CIRCUIT
                </div>
                <h3 className="font-display font-black text-2xl text-white mt-1">
                  Signal Propagation & Gate Activation (E = A ∧ B)
                </h3>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                  Both proposition signals propagate along independent electrical traces into the physical AND gate.
                  The gate output activates if and only if both input lines are simultaneously HIGH (1).
                </p>
              </div>

              {/* Interactive Circuit Canvas / Schematic Display */}
              <div className="p-6 rounded-2xl bg-[#060a12] border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs text-slate-400 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    DIGITAL CONJUNCTION INTERLOCK (E = A ∧ B)
                  </span>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    propE
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                      : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                  }`}>
                    GATE OUTPUT: {propE ? 'HIGH (+5V) • ENERGIZED' : 'LOW (0V) • DE-ASSERTED'}
                  </span>
                </div>

                {/* SVG Schematic */}
                <div className="w-full h-72 sm:h-80 bg-[#090d16] rounded-xl border border-slate-800/90 flex items-center justify-center p-2 relative">
                  <svg viewBox="0 0 650 280" className="w-full h-full max-w-2xl select-none">
                    <defs>
                      <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Grid lines background */}
                    <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
                    </pattern>
                    <rect width="650" height="280" fill="url(#grid-pattern)" />

                    {/* Wire A (Top input) */}
                    <path
                      d="M 50 80 L 260 80"
                      fill="none"
                      stroke={propA ? '#ef4444' : '#334155'}
                      strokeWidth={propA ? '4' : '2'}
                      strokeLinecap="round"
                      filter={propA ? 'url(#glow-rose)' : undefined}
                    />
                    {/* Animated Pulse on Wire A */}
                    {propA && (
                      <circle cx="150" cy="80" r="5" fill="#fca5a5">
                        <animate attributeName="cx" from="50" to="260" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Wire B (Bottom input) */}
                    <path
                      d="M 50 200 L 260 200"
                      fill="none"
                      stroke={propB ? '#ef4444' : '#334155'}
                      strokeWidth={propB ? '4' : '2'}
                      strokeLinecap="round"
                      filter={propB ? 'url(#glow-rose)' : undefined}
                    />
                    {/* Animated Pulse on Wire B */}
                    {propB && (
                      <circle cx="150" cy="200" r="5" fill="#fca5a5">
                        <animate attributeName="cx" from="50" to="260" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Input Labels & Pins */}
                    <circle cx="50" cy="80" r="6" fill={propA ? '#ef4444' : '#475569'} />
                    <text x="65" y="72" fill="#94a3b8" fontSize="12" fontFamily="monospace" fontWeight="bold">
                      Input A (SpO₂ &lt; 90): {propA ? '1 (HIGH)' : '0 (LOW)'}
                    </text>

                    <circle cx="50" cy="200" r="6" fill={propB ? '#ef4444' : '#475569'} />
                    <text x="65" y="192" fill="#94a3b8" fontSize="12" fontFamily="monospace" fontWeight="bold">
                      Input B (HR Abnormal): {propB ? '1 (HIGH)' : '0 (LOW)'}
                    </text>

                    {/* AND Gate Body (Standard IEEE 91 symbol) */}
                    <g transform="translate(260, 50)">
                      <path
                        d="M 0 0 L 60 0 C 110 0, 110 180, 60 180 L 0 180 Z"
                        fill={propE ? '#7f1d1d' : '#0f172a'}
                        stroke={propE ? '#ef4444' : '#475569'}
                        strokeWidth="3.5"
                        filter={propE ? 'url(#glow-rose)' : undefined}
                      />
                      <text x="45" y="98" fill={propE ? '#fecaca' : '#94a3b8'} fontSize="24" fontFamily="monospace" fontWeight="900" textAnchor="middle">
                        AND
                      </text>
                      <text x="45" y="125" fill={propE ? '#fca5a5' : '#64748b'} fontSize="16" fontFamily="monospace" textAnchor="middle">
                        ∧
                      </text>
                    </g>

                    {/* Output Wire from AND gate to Actuator */}
                    <path
                      d="M 365 140 L 490 140"
                      fill="none"
                      stroke={propE ? '#ef4444' : '#334155'}
                      strokeWidth={propE ? '5' : '2'}
                      strokeLinecap="round"
                      filter={propE ? 'url(#glow-rose)' : undefined}
                    />
                    {/* Animated Pulse on Output Wire */}
                    {propE && (
                      <circle cx="420" cy="140" r="6" fill="#fecaca">
                        <animate attributeName="cx" from="365" to="490" dur="0.8s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Output Actuator / Siren Relay Box */}
                    <g transform="translate(490, 85)">
                      <rect
                        width="140"
                        height="110"
                        rx="12"
                        fill={propE ? '#450a0a' : '#0f172a'}
                        stroke={propE ? '#ef4444' : '#334155'}
                        strokeWidth="2.5"
                        filter={propE ? 'url(#glow-rose)' : undefined}
                      />
                      <circle cx="70" cy="35" r="14" fill={propE ? '#ef4444' : '#1e293b'} />
                      <text x="70" y="39" fill="white" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        {propE ? '!' : 'OK'}
                      </text>
                      <text x="70" y="70" fill={propE ? '#fca5a5' : '#94a3b8'} fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        {propE ? 'RELAY CLOSED' : 'RELAY OPEN'}
                      </text>
                      <text x="70" y="90" fill={propE ? '#f87171' : '#64748b'} fontSize="9" fontFamily="monospace" textAnchor="middle">
                        {propE ? 'CODE RED ACTIVE' : 'QUIESCENT'}
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Tactical Explanation Card */}
                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
                  <div>
                    <span className="text-white font-bold">Formal Gate Truth Condition:</span>
                    <span className="text-slate-300 ml-2">
                      E = A ∧ B = ({propA ? '1' : '0'}) ∧ ({propB ? '1' : '0'}) = <strong className={propE ? 'text-rose-400' : 'text-emerald-400'}>{propE ? '1 (EMERGENCY)' : '0 (NORMAL)'}</strong>
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Single false readings (A=1, B=0) are suppressed; only joint physiological failure triggers the interlock.
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setActiveStep(2);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>STEP 2</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setActiveStep(4);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  <span>STEP 4: REVEAL TRUTH TABLE</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 4: REVEAL THE TRUTH TABLE (DYNAMIC ROW HIGHLIGHTING) */}
          {/* ============================================================== */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="max-w-3xl">
                <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                  STEP 4 — THE EXHAUSTIVE TRUTH TABLE
                </div>
                <h3 className="font-display font-black text-2xl text-white mt-1">
                  Exhaustive Valuation of All 2² = 4 Possible Interpretations
                </h3>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                  A formal truth table maps every conceivable permutation of input premises.
                  The active row corresponding to the current patient telemetry is illuminated dynamically.
                </p>
              </div>

              {/* Truth Table */}
              <div className="rounded-2xl bg-[#0b101c] border border-slate-800 shadow-xl overflow-hidden">
                <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    CONJUNCTION TRUTH TABLE: E = A ∧ B
                  </span>
                  <span className="text-[11px] font-mono text-blue-400">
                    Active State: Row {(!propA && !propB) ? 1 : (!propA && propB) ? 2 : (propA && !propB) ? 3 : 4}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/60 uppercase">
                        <th className="py-3 px-4">Row</th>
                        <th className="py-3 px-4">A (SpO₂ &lt; 90)</th>
                        <th className="py-3 px-4">B (HR Abnormal)</th>
                        <th className="py-3 px-4">A ∧ B</th>
                        <th className="py-3 px-4">Output E</th>
                        <th className="py-3 px-4">Clinical Interpretation</th>
                        <th className="py-3 px-4">Active Telemetry</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {[
                        {
                          row: 1,
                          a: false,
                          b: false,
                          e: false,
                          meaning: 'Normal Homeostasis — No emergency; single-lead transients filtered',
                        },
                        {
                          row: 2,
                          a: false,
                          b: true,
                          e: false,
                          meaning: 'Isolated Cardiac Event — Advisory warning; Code Red interlock suppressed',
                        },
                        {
                          row: 3,
                          a: true,
                          b: false,
                          e: false,
                          meaning: 'Isolated Hypoxia Event — Advisory warning; Code Red interlock suppressed',
                        },
                        {
                          row: 4,
                          a: true,
                          b: true,
                          e: true,
                          meaning: 'COMBINED CRITICAL EMERGENCY — Concurrent failure; Code Red Interlock energized',
                        },
                      ].map((item) => {
                        const isCurrentRow = propA === item.a && propB === item.b;

                        return (
                          <tr
                            key={item.row}
                            className={`transition-all ${
                              isCurrentRow
                                ? 'bg-blue-600/20 font-bold border-l-4 border-l-blue-400 text-white'
                                : 'text-slate-400 hover:bg-slate-900/40'
                            }`}
                          >
                            <td className="py-3.5 px-4 font-bold text-slate-300">Row {item.row}</td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded ${item.a ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'}`}>
                                {item.a ? '1 (TRUE)' : '0 (FALSE)'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded ${item.b ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'}`}>
                                {item.b ? '1 (TRUE)' : '0 (FALSE)'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {item.a ? '1' : '0'} ∧ {item.b ? '1' : '0'} = <strong className={item.e ? 'text-rose-400' : 'text-slate-300'}>{item.e ? '1' : '0'}</strong>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded font-black ${
                                item.e
                                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/50'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}>
                                E = {item.e ? '1 (CRITICAL)' : '0 (QUIESCENT)'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-xs font-normal max-w-xs">{item.meaning}</td>
                            <td className="py-3.5 px-4">
                              {isCurrentRow ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500 text-white text-[10px] font-extrabold animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                  CURRENT PATIENT STATE
                                </span>
                              ) : (
                                <span className="text-slate-600 text-[11px]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400 font-mono flex items-center justify-between">
                  <div>
                    Mathematical Valuation: <code className="text-blue-300">v(A ∧ B) = min(v(A), v(B)) = min({propA ? 1 : 0}, {propB ? 1 : 0}) = {propE ? 1 : 0}</code>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Row 4 is the unique satisfying assignment for E = 1.
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setActiveStep(3);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>STEP 3</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setActiveStep(5);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  <span>STEP 5: INDEPENDENT SANDBOX</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 5: EXPERIMENT INDEPENDENTLY (ISOLATED SANDBOX CONTROLS) */}
          {/* ============================================================== */}
          {activeStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="max-w-3xl">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  STEP 5 — INDEPENDENT EXPERIMENTATION SANDBOX
                </div>
                <h3 className="font-display font-black text-2xl text-white mt-1">
                  Freely Toggle A and B Without Changing Patient Telemetry
                </h3>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                  Test all four combinatorial states manually. This sandbox runs in an isolated software container;
                  mutations here will <strong>never alter</strong> the running patient simulation.
                </p>
              </div>

              {/* Preset Shortcuts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: '[0, 0] Safe Homeostasis', a: false, b: false },
                  { label: '[0, 1] Cardiac Only', a: false, b: true },
                  { label: '[1, 0] Hypoxia Only', a: true, b: false },
                  { label: '[1, 1] Dual Emergency', a: true, b: true },
                ].map((preset, idx) => {
                  const isMatch = sandboxA === preset.a && sandboxB === preset.b;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        soundEngine.playGateClick();
                        setSandboxA(preset.a);
                        setSandboxB(preset.b);
                      }}
                      className={`p-3 rounded-xl font-mono text-xs font-bold transition-all border cursor-pointer ${
                        isMatch
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Manual Switches & Live Interactive Circuit */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Tactile Switches (5 cols) */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-xl space-y-4">
                  <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                    MANUAL PROPOSITION SWITCHES
                  </div>

                  {/* Switch A */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">PROPOSITION A (Hypoxia)</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${sandboxA ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-400'}`}>
                        {sandboxA ? 'ACTIVE (1)' : 'INACTIVE (0)'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        soundEngine.playGateClick();
                        setSandboxA(!sandboxA);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                        sandboxA
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <span>SWITCH A: {sandboxA ? 'ON (1)' : 'OFF (0)'}</span>
                      <span className="text-[10px] underline">Click to Flip</span>
                    </button>
                  </div>

                  {/* Switch B */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-xs font-bold text-rose-400">PROPOSITION B (Arrhythmia)</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${sandboxB ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-400'}`}>
                        {sandboxB ? 'ACTIVE (1)' : 'INACTIVE (0)'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        soundEngine.playGateClick();
                        setSandboxB(!sandboxB);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                        sandboxB
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <span>SWITCH B: {sandboxB ? 'ON (1)' : 'OFF (0)'}</span>
                      <span className="text-[10px] underline">Click to Flip</span>
                    </button>
                  </div>

                  {/* Revert to Live Patient Button */}
                  <button
                    onClick={() => {
                      soundEngine.playGateClick();
                      setSandboxA(propA);
                      setSandboxB(propB);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>RESET SANDBOX TO LIVE PATIENT</span>
                  </button>
                </div>

                {/* Right: Sandbox Result & Circuit (7 cols) */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                        SANDBOX LOGIC GATE EVALUATION
                      </span>
                      <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                        sandboxOutput ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        SANDBOX OUTPUT: {sandboxOutput ? '1 (TRIP ALARM)' : '0 (NORMAL)'}
                      </span>
                    </div>

                    {/* Circuit Diagram preview */}
                    <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 font-mono text-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Wire A:</span>
                        <span className={sandboxA ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                          {sandboxA ? 'HIGH (+5V / Logic 1)' : 'LOW (0V / Logic 0)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Wire B:</span>
                        <span className={sandboxB ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                          {sandboxB ? 'HIGH (+5V / Logic 1)' : 'LOW (0V / Logic 0)'}
                        </span>
                      </div>
                      <div className="h-px bg-slate-800" />
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">AND Gate Equation:</span>
                        <span className="text-blue-300 font-bold">
                          E = {sandboxA ? '1' : '0'} ∧ {sandboxB ? '1' : '0'} = {sandboxOutput ? '1' : '0'}
                        </span>
                      </div>
                    </div>

                    {/* Contextual Visual Explanation */}
                    <div className={`mt-4 p-4 rounded-xl border text-xs font-mono leading-relaxed ${
                      sandboxOutput
                        ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}>
                      <div className="font-bold uppercase text-[11px] mb-1">
                        {sandboxOutput ? '🚨 CRITICAL INTERLOCK ENGAGED' : '🛡️ NORMAL QUIESCENT STATE'}
                      </div>
                      {sandboxA && sandboxB && (
                        <span>Both inputs are TRUE simultaneously ($1 \land 1 = 1$). Both respiratory and circulatory organs have failed. The combined critical emergency interlock triggers instantaneously!</span>
                      )}
                      {!sandboxA && !sandboxB && (
                        <span>Both inputs are FALSE ($0 \land 0 = 0$). The patient is in stable physiological homeostasis. All emergency sirens remain silent.</span>
                      )}
                      {!sandboxA && sandboxB && (
                        <span>Proposition B is TRUE, but A is FALSE ($0 \land 1 = 0$). An arrhythmia is observed, but oxygenation is intact. An advisory warning sounds without triggering the life-critical evacuation relay.</span>
                      )}
                      {sandboxA && !sandboxB && (
                        <span>Proposition A is TRUE, but B is FALSE ($1 \land 0 = 0$). Isolated hypoxia is observed, but heart rate is stable. The patient is flagged for nurse check without false-positive Code Red alarms.</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                    ✓ Verified: Isolated exploration leaves patient telemetry intact.
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setActiveStep(4);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>STEP 4</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setActiveStep(6);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  <span>STEP 6: EXTENDED MATHEMATICS LAB</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* STEP 6: EXPLORE ADDITIONAL MATHEMATICS (CURATED DISCRETE LAB) */}
          {/* ============================================================== */}
          {activeStep === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="max-w-3xl">
                <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  STEP 6 — EXTENDED DISCRETE MATHEMATICS LABORATORY
                </div>
                <h3 className="font-display font-black text-2xl text-white mt-1">
                  Connectives, De Morgan Dual Circuits, SAT & Predicate Quantifiers
                </h3>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                  Every mathematical pillar of Discrete Mathematics applied to critical embedded safety engineering.
                  Select an interactive experiment below to explore formal proofs through visual interaction.
                </p>
              </div>

              {/* Sub-Tab Navigation */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-b border-slate-800 pb-4">
                {[
                  { id: 'connectives', label: '1. Connectives Lab', icon: <Binary className="w-4 h-4" /> },
                  { id: 'demorgan', label: "2. De Morgan's Dual Circuits", icon: <Equal className="w-4 h-4" /> },
                  { id: 'sat', label: '3. SAT & Tautology', icon: <Scale className="w-4 h-4" /> },
                  { id: 'quantifiers', label: '4. Ward Quantifiers (∀, ∃)', icon: <Users className="w-4 h-4" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      soundEngine.playGateClick();
                      setSubTab(tab.id as any);
                    }}
                    className={`p-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                      subTab === tab.id
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* ---------------------------------------------------------- */}
              {/* SUB-TAB 1: CONNECTIVES LAB */}
              {/* ---------------------------------------------------------- */}
              {subTab === 'connectives' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-wrap gap-2">
                    {(['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'IMPLIES', 'IFF'] as const).map((op) => (
                      <button
                        key={op}
                        onClick={() => {
                          soundEngine.playGateClick();
                          setSelectedConn(op);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                          selectedConn === op
                            ? 'bg-blue-600 text-white border-blue-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {op === 'AND' && '∧ AND'}
                        {op === 'OR' && '∨ OR'}
                        {op === 'NOT' && '¬ NOT'}
                        {op === 'XOR' && '⊕ XOR'}
                        {op === 'NAND' && '↑ NAND'}
                        {op === 'NOR' && '↓ NOR'}
                        {op === 'IMPLIES' && '→ IMPLIES'}
                        {op === 'IFF' && '↔ IFF'}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-5 p-5 rounded-2xl bg-[#0b101c] border border-slate-800 space-y-4">
                      <div className="text-xs font-mono text-slate-400 font-bold uppercase">INPUT SIGNALS</div>
                      
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="font-mono text-xs font-bold text-cyan-400">Proposition P</span>
                        <button
                          onClick={() => {
                            soundEngine.playGateClick();
                            setConnP(!connP);
                          }}
                          className={`px-3 py-1 rounded-lg font-mono text-xs font-bold ${
                            connP ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {connP ? 'TRUE (1)' : 'FALSE (0)'}
                        </button>
                      </div>

                      {selectedConn !== 'NOT' && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="font-mono text-xs font-bold text-rose-400">Proposition Q</span>
                          <button
                            onClick={() => {
                              soundEngine.playGateClick();
                              setConnQ(!connQ);
                            }}
                            className={`px-3 py-1 rounded-lg font-mono text-xs font-bold ${
                              connQ ? 'bg-rose-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {connQ ? 'TRUE (1)' : 'FALSE (0)'}
                          </button>
                        </div>
                      )}

                      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300">
                        <div className="font-bold text-white mb-1">Formal Definition:</div>
                        {selectedConn === 'AND' && 'P ∧ Q: True iff both P and Q are True.'}
                        {selectedConn === 'OR' && 'P ∨ Q: True iff at least one of P or Q is True.'}
                        {selectedConn === 'NOT' && '¬P: Inverts truth value: True becomes False.'}
                        {selectedConn === 'XOR' && 'P ⊕ Q: True iff exactly one of P or Q is True.'}
                        {selectedConn === 'NAND' && '¬(P ∧ Q): Universal gate. False only when both inputs True.'}
                        {selectedConn === 'NOR' && '¬(P ∨ Q): False if either input is True.'}
                        {selectedConn === 'IMPLIES' && 'P → Q ≡ ¬P ∨ Q: False only if Premise is True and Conclusion is False.'}
                        {selectedConn === 'IFF' && 'P ↔ Q: True iff P and Q have identical truth values.'}
                      </div>
                    </div>

                    <div className="md:col-span-7 p-6 rounded-2xl bg-[#0b101c] border border-slate-800 flex flex-col items-center justify-center text-center">
                      <div className="text-xs font-mono text-slate-400 mb-2">DYNAMIC LOGICAL OUTPUT</div>
                      <div className="font-mono text-4xl sm:text-5xl font-black text-white">
                        {connOutput ? (
                          <span className="text-emerald-400">1 (TRUE)</span>
                        ) : (
                          <span className="text-rose-400">0 (FALSE)</span>
                        )}
                      </div>
                      <div className="mt-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm text-blue-300">
                        {selectedConn === 'NOT' ? (
                          <span>¬({connP ? '1' : '0'}) = {connOutput ? '1' : '0'}</span>
                        ) : (
                          <span>({connP ? '1' : '0'}) {selectedConn} ({connQ ? '1' : '0'}) = {connOutput ? '1' : '0'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* SUB-TAB 2: DE MORGAN'S LAWS DUAL EQUIVALENT CIRCUITS */}
              {/* ---------------------------------------------------------- */}
              {subTab === 'demorgan' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundEngine.playGateClick();
                          setSelectedDeMorganLaw('law1');
                        }}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                          selectedDeMorganLaw === 'law1'
                            ? 'bg-blue-600 text-white border-blue-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        Law 1: ¬(A ∨ B) ≡ (¬A) ∧ (¬B)
                      </button>

                      <button
                        onClick={() => {
                          soundEngine.playGateClick();
                          setSelectedDeMorganLaw('law2');
                        }}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                          selectedDeMorganLaw === 'law2'
                            ? 'bg-blue-600 text-white border-blue-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        Law 2: ¬(A ∧ B) ≡ (¬A) ∨ (¬B)
                      </button>
                    </div>

                    {/* Input Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundEngine.playGateClick();
                          setDmA(!dmA);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border ${
                          dmA ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        Input A: {dmA ? '1' : '0'}
                      </button>
                      <button
                        onClick={() => {
                          soundEngine.playGateClick();
                          setDmB(!dmB);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border ${
                          dmB ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        Input B: {dmB ? '1' : '0'}
                      </button>
                    </div>
                  </div>

                  {/* Dual Equivalent Circuits Running Side-by-Side */}
                  {(() => {
                    const c1Out = selectedDeMorganLaw === 'law1' ? !(dmA || dmB) : !(dmA && dmB);
                    const c2Out = selectedDeMorganLaw === 'law1' ? (!dmA && !dmB) : (!dmA || !dmB);

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Circuit 1 (LHS) */}
                        <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-xl">
                          <div className="text-xs font-mono font-bold text-blue-400 mb-2">
                            CIRCUIT 1: LEFT-HAND FORMULA
                          </div>
                          <div className="font-mono text-lg font-extrabold text-white mb-4">
                            {selectedDeMorganLaw === 'law1' ? '¬(A ∨ B) [NOR Topology]' : '¬(A ∧ B) [NAND Topology]'}
                          </div>

                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 mb-4">
                            <div>Input A: {dmA ? '1 (HIGH)' : '0 (LOW)'}</div>
                            <div>Input B: {dmB ? '1 (HIGH)' : '0 (LOW)'}</div>
                            <div>
                              Internal Gate: {selectedDeMorganLaw === 'law1' ? `${dmA ? 1 : 0} ∨ ${dmB ? 1 : 0} = ${dmA || dmB ? 1 : 0}` : `${dmA ? 1 : 0} ∧ ${dmB ? 1 : 0} = ${dmA && dmB ? 1 : 0}`}
                            </div>
                            <div className="font-bold text-white">Inverter Output: ¬({selectedDeMorganLaw === 'law1' ? (dmA || dmB ? 1 : 0) : (dmA && dmB ? 1 : 0)}) = {c1Out ? '1' : '0'}</div>
                          </div>

                          <div className={`p-3 rounded-xl border text-center font-mono font-black text-sm ${
                            c1Out ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}>
                            CIRCUIT 1 OUTPUT = {c1Out ? '1 (HIGH)' : '0 (LOW)'}
                          </div>
                        </div>

                        {/* Circuit 2 (RHS) */}
                        <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-xl">
                          <div className="text-xs font-mono font-bold text-indigo-400 mb-2">
                            CIRCUIT 2: RIGHT-HAND FORMULA
                          </div>
                          <div className="font-mono text-lg font-extrabold text-white mb-4">
                            {selectedDeMorganLaw === 'law1' ? '(¬A) ∧ (¬B) [Dual Inverters + AND]' : '(¬A) ∨ (¬B) [Dual Inverters + OR]'}
                          </div>

                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 mb-4">
                            <div>Inverter ¬A: ¬({dmA ? 1 : 0}) = {!dmA ? '1' : '0'}</div>
                            <div>Inverter ¬B: ¬({dmB ? 1 : 0}) = {!dmB ? '1' : '0'}</div>
                            <div>
                              Coupling Gate: {!dmA ? 1 : 0} {selectedDeMorganLaw === 'law1' ? '∧' : '∨'} {!dmB ? 1 : 0} = {c2Out ? '1' : '0'}
                            </div>
                            <div className="font-bold text-white">Coupling Output: = {c2Out ? '1' : '0'}</div>
                          </div>

                          <div className={`p-3 rounded-xl border text-center font-mono font-black text-sm ${
                            c2Out ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}>
                            CIRCUIT 2 OUTPUT = {c2Out ? '1 (HIGH)' : '0 (LOW)'}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Mathematical Equivalence Verification Banner */}
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>
                        <strong>FORMAL EQUIVALENCE VERIFIED:</strong> Circuit 1 ≡ Circuit 2 for all 4 input permutations!
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      Dual topologies produce identical safety actuations with zero deviation.
                    </span>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* SUB-TAB 3: SAT & TAUTOLOGY */}
              {/* ---------------------------------------------------------- */}
              {subTab === 'sat' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'safety_invariant', label: 'Safety Invariant: (A ∧ B) → E' },
                      { id: 'tautology', label: 'Tautology: P ∨ ¬P (Excluded Middle)' },
                      { id: 'contradiction', label: 'Contradiction: P ∧ ¬P (Zero State)' },
                      { id: 'contingent', label: 'Contingency: A ∧ (B ∨ ¬C)' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          soundEngine.playGateClick();
                          setSelectedFormula(f.id as any);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                          selectedFormula === f.id
                            ? 'bg-blue-600 text-white border-blue-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800 shadow-xl font-mono text-xs space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-sm">
                        {selectedFormula === 'safety_invariant' && 'ICU SAFETY INVARIANT: (A ∧ B) → E'}
                        {selectedFormula === 'tautology' && 'LAW OF EXCLUDED MIDDLE: P ∨ ¬P'}
                        {selectedFormula === 'contradiction' && 'LOGICAL IMPOSSIBILITY: P ∧ ¬P'}
                        {selectedFormula === 'contingent' && 'CONTINGENCY: A ∧ (B ∨ ¬C)'}
                      </span>
                      <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                        {selectedFormula === 'safety_invariant' && 'TAUTOLOGY (VALID IN ALL STATES)'}
                        {selectedFormula === 'tautology' && 'TAUTOLOGY (100% TRUE)'}
                        {selectedFormula === 'contradiction' && 'UNSATISFIABLE (100% FALSE)'}
                        {selectedFormula === 'contingent' && 'SATISFIABLE (DEPENDS ON VITALS)'}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed font-sans">
                      {selectedFormula === 'safety_invariant' &&
                        'In life-critical medical equipment, safety rules must be tautologies: under every interpretation of sensor inputs, if the physiological condition is met, the emergency response is guaranteed by formal deduction.'}
                      {selectedFormula === 'tautology' &&
                        'Either proposition P holds or it does not. In classical discrete logic, no intermediate truth value exists (tertium non datur). This guarantees non-ambiguous state evaluation.'}
                      {selectedFormula === 'contradiction' &&
                        'A proposition and its exact negation cannot both be true simultaneously. In clinical engineering, if a sensor asserts P=1 and ¬P=1, a physical hardware failure is immediately flagged.'}
                      {selectedFormula === 'contingent' &&
                        'A contingent formula is satisfiable under some interpretations and false under others. Patient monitoring algorithms evaluate contingent propositions to discriminate normal health from clinical deterioration.'}
                    </p>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* SUB-TAB 4: 6-BED WARD QUANTIFIERS (∀, ∃) */}
              {/* ---------------------------------------------------------- */}
              {subTab === 'quantifiers' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-400 uppercase">
                        PREDICATE LOGIC OVER HOSPITAL WARDS: DOMAIN U = &#123;Bed₁, Bed₂, Bed₃, Bed₄, Bed₅, Bed₆&#125;
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Click any bed to toggle between Stable and Critical state. Watch the quantifiers evaluate!
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundEngine.playGateClick();
                        setBeds((prev) => prev.map((b) => ({ ...b, isCritical: false, hr: 74, spo2: 98, temp: 36.8 })));
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>RESET ALL BEDS TO STABLE</span>
                    </button>
                  </div>

                  {/* 6-Bed Ward Layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {beds.map((bed) => (
                      <button
                        key={bed.id}
                        onClick={() => toggleBed(bed.id)}
                        className={`p-3 rounded-2xl border text-left font-mono transition-all cursor-pointer ${
                          bed.isCritical
                            ? 'bg-rose-950/60 border-rose-500 shadow-lg shadow-rose-950/50'
                            : 'bg-[#0b101c] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[11px] font-bold text-white">{bed.name.split(' ')[0]}</span>
                          <span className={`w-2 h-2 rounded-full ${bed.isCritical ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
                        </div>
                        <div className="text-[10px] text-slate-400 mb-2 truncate">{bed.name}</div>
                        <div className="text-[10px] space-y-0.5">
                          <div>HR: <strong className={bed.isCritical ? 'text-rose-300' : 'text-slate-300'}>{bed.hr}</strong></div>
                          <div>SpO₂: <strong className={bed.isCritical ? 'text-rose-300' : 'text-cyan-300'}>{bed.spo2}%</strong></div>
                        </div>
                        <div className={`mt-2 py-0.5 text-center rounded text-[9px] font-bold ${
                          bed.isCritical ? 'bg-rose-500 text-white' : 'bg-slate-800 text-emerald-400'
                        }`}>
                          {bed.isCritical ? 'CRITICAL (1)' : 'STABLE (0)'}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Quantifier Mathematical Calculations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Universal Quantifier (∀) */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
                      <div className="text-slate-400 uppercase text-[10px] font-bold">UNIVERSAL QUANTIFIER</div>
                      <div className="text-base font-black text-white mt-1">
                        ∀x Stable(x) : Are ALL beds stable?
                      </div>
                      <div className="mt-2 text-slate-300 text-[11px]">
                        Evaluates to TRUE if and only if EVERY bed in the ward is non-critical.
                      </div>
                      <div className={`mt-3 py-1.5 px-3 rounded-lg font-bold text-center ${
                        allStable
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        ∀x Stable(x) = {allStable ? 'TRUE (1) — ALL BEDS SAFE' : 'FALSE (0) — AT LEAST 1 COMPROMISED'}
                      </div>
                    </div>

                    {/* Existential Quantifier (∃) */}
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
                      <div className="text-slate-400 uppercase text-[10px] font-bold">EXISTENTIAL QUANTIFIER</div>
                      <div className="text-base font-black text-white mt-1">
                        ∃x Critical(x) : Does THERE EXIST a critical bed?
                      </div>
                      <div className="mt-2 text-slate-300 text-[11px]">
                        Evaluates to TRUE if AT LEAST ONE bed requires immediate emergency intervention.
                      </div>
                      <div className={`mt-3 py-1.5 px-3 rounded-lg font-bold text-center ${
                        someCritical
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        ∃x Critical(x) = {someCritical ? `TRUE (1) — ${criticalBeds.length} BED(S) REQUIRE RESCUE` : 'FALSE (0) — NO CRITICAL BEDS'}
                      </div>
                    </div>
                  </div>

                  {/* De Morgan for Quantifiers Banner */}
                  <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/60 font-mono text-xs text-blue-300 flex items-center justify-between">
                    <div>
                      <strong>QUANTIFIER DUALITY:</strong> ¬(∀x Stable(x)) ≡ ∃x ¬Stable(x)
                    </div>
                    <div className="text-[11px] text-slate-400 hidden sm:inline">
                      Denying that all beds are stable is logically equivalent to stating at least one bed is unstable.
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setActiveStep(5);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>STEP 5: SANDBOX</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>RETURN TO PATIENT MONITOR</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolveTheMathModal;
