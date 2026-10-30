import React, { useState } from 'react';
import type { BooleanPropositions, VitalsState, SystemStatus } from '../../types';
import { formatBoolean } from '../../utils/logic';
import { soundEngine } from '../../utils/audio';
import { 
  Zap, 
  Binary, 
  Cpu, 
  Layers, 
  ToggleLeft, 
  ToggleRight, 
  ShieldCheck, 
  AlertTriangle,
  Radio,
  CheckCircle2
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
  onRevealMath,
}) => {
  const [activeTab, setActiveTab] = useState<'and_gate' | 'or_gate' | 'not_gate' | 'nand_gate'>('and_gate');
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [manualA, setManualA] = useState<boolean>(false);
  const [manualB, setManualB] = useState<boolean>(false);

  const currentA = manualMode ? manualA : propositions.A;
  const currentB = manualMode ? manualB : propositions.B;

  const getOutput = () => {
    if (activeTab === 'and_gate') return currentA && currentB;
    if (activeTab === 'or_gate') return currentA || currentB;
    if (activeTab === 'not_gate') return !currentA;
    if (activeTab === 'nand_gate') return !(currentA && currentB);
    return false;
  };

  const outputVal = getOutput();

  const handleToggleManualA = () => {
    soundEngine.playGateClick();
    setManualA(!manualA);
  };

  const handleToggleManualB = () => {
    soundEngine.playGateClick();
    setManualB(!manualB);
  };

  return (
    <section id="logic-engine" className="relative w-full py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>DISCRETE MATHEMATICS & DIGITAL LOGIC ENGINE</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            THE REAL-TIME LOGIC ENGINE
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
            Continuous biometric telemetry is translated into Boolean variables, evaluated across
            formal logic gates, and synthesized into deterministic safety actuations.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => {
              soundEngine.playGateClick();
              setManualMode(!manualMode);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
              manualMode
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
            }`}
          >
            {manualMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            {manualMode ? 'MANUAL INPUT OVERRIDE: ON' : 'SYNCHRONIZED WITH PATIENT TELEMETRY'}
          </button>

          <button
            onClick={onRevealMath}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.02] cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            REVEAL THE MATH BEHIND
          </button>
        </div>
      </div>

      {/* 4-Stage Logical Transformation Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 mb-10">
        {/* Stage 1 */}
        <div className="p-4 rounded-xl bg-[#090d16] border-l-4 border-l-blue-500 border border-slate-800">
          <div className="text-[10px] font-mono text-blue-400 font-bold tracking-wider">STAGE 01</div>
          <div className="font-display text-sm font-bold text-white mt-1">TELEMETRY ACQUISITION</div>
          <div className="text-xs text-slate-300 mt-2 font-mono space-y-1">
            <div>SpO₂: <strong className="text-white">{vitals.oxygen}%</strong></div>
            <div>HR: <strong className="text-white">{vitals.heartRate} BPM</strong></div>
            <div>Temp: <strong className="text-white">{vitals.temperature}°C</strong></div>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">Analog domain inputs</div>
        </div>

        {/* Stage 2 */}
        <div className="p-4 rounded-xl bg-[#090d16] border-l-4 border-l-cyan-500 border border-slate-800">
          <div className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">STAGE 02</div>
          <div className="font-display text-sm font-bold text-white mt-1">PROPOSITION COMPARATORS</div>
          <div className="text-xs text-slate-300 mt-2 font-mono space-y-1">
            <div>A (SpO₂ &lt; 90) → <strong className={currentA ? 'text-rose-400' : 'text-emerald-400'}>{formatBoolean(currentA)}</strong></div>
            <div>B (HR abnormal) → <strong className={currentB ? 'text-rose-400' : 'text-emerald-400'}>{formatBoolean(currentB)}</strong></div>
            <div>C (Temp &gt; 39.0) → <strong className={propositions.C ? 'text-rose-400' : 'text-emerald-400'}>{formatBoolean(propositions.C)}</strong></div>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">Mappings to 𝔹 &#123;0, 1&#125;</div>
        </div>

        {/* Stage 3 */}
        <div className="p-4 rounded-xl bg-[#090d16] border-l-4 border-l-indigo-500 border border-slate-800">
          <div className="text-[10px] font-mono text-indigo-400 font-bold tracking-wider">STAGE 03</div>
          <div className="font-display text-sm font-bold text-white mt-1">GATE EVALUATION</div>
          <div className="text-xs text-slate-300 mt-2 font-mono space-y-1">
            <div>Formula: <strong className="text-white">E = A ∧ B</strong></div>
            <div>Binary: {currentA ? '1' : '0'} ∧ {currentB ? '1' : '0'} = <strong className={outputVal ? 'text-rose-400' : 'text-emerald-400'}>{outputVal ? '1' : '0'}</strong></div>
            <div>Warning: W = A ∨ B = {propositions.W_Warning ? '1' : '0'}</div>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">Conjunction logic</div>
        </div>

        {/* Stage 4 */}
        <div className={`p-4 rounded-xl border-l-4 border transition-all ${
          outputVal
            ? 'border-l-rose-500 border-rose-500/40 bg-rose-950/20'
            : 'border-l-emerald-500 border-slate-800 bg-[#090d16]'
        }`}>
          <div className="text-[10px] font-mono text-slate-400 font-bold tracking-wider">STAGE 04</div>
          <div className="font-display text-sm font-bold text-white mt-1">DETERMINISTIC ACTION</div>
          <div className="text-xs mt-2 font-mono">
            {outputVal ? (
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> CRITICAL CODE RED RELAY
              </span>
            ) : propositions.W_Warning ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" /> SINGLE WARNING (W=1)
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> HOMEOSTASIS PRESERVED
              </span>
            )}
          </div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">Life-critical actuation</div>
        </div>
      </div>

      {/* Gate Tabs Selector */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3 flex-wrap">
        <button
          onClick={() => {
            soundEngine.playGateClick();
            setActiveTab('and_gate');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'and_gate'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Binary className="w-3.5 h-3.5" />
          PRIMARY: AND GATE (E = A ∧ B)
        </button>

        <button
          onClick={() => {
            soundEngine.playGateClick();
            setActiveTab('or_gate');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'or_gate'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          DISJUNCTION: OR GATE (W = A ∨ B)
        </button>

        <button
          onClick={() => {
            soundEngine.playGateClick();
            setActiveTab('not_gate');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'not_gate'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          INVERTER: NOT GATE (S = ¬A)
        </button>

        <button
          onClick={() => {
            soundEngine.playGateClick();
            setActiveTab('nand_gate');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
            activeTab === 'nand_gate'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          UNIVERSAL: NAND GATE (F = ¬(A ∧ B))
        </button>
      </div>

      {/* Main Interactive Circuit and Truth Table Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Circuit Schematic (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0b0f19] border border-slate-800 p-6 relative flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-xs text-slate-400 tracking-wider">
                DIGITAL LOGIC CIRCUIT SCHEMATIC (ANSI/IEEE STD 91-1984)
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-300">
                LOGIC VOLTAGE: {outputVal ? '+5.0V (HIGH)' : '0.0V (LOW)'}
              </span>
            </div>

            {/* Circuit Schematic SVG with Dynamic Signal Lines */}
            <div className="relative w-full h-72 sm:h-80 bg-[#060a12] rounded-xl border border-slate-800/90 p-4 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 600 300" className="w-full h-full max-w-xl">
                <defs>
                  <filter id="circuit-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="circuit-glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Wire A (Input A) */}
                <path
                  d="M 60,90 L 220,90"
                  fill="none"
                  stroke={currentA ? '#ef4444' : '#334155'}
                  strokeWidth={currentA ? '3.5' : '2'}
                  filter={currentA ? 'url(#circuit-glow-rose)' : undefined}
                />
                {currentA && (
                  <circle cx="140" cy="90" r="4" fill="#ffffff" filter="url(#circuit-glow-rose)">
                    <animate attributeName="cx" from="60" to="220" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Wire B (Input B) */}
                {activeTab !== 'not_gate' && (
                  <>
                    <path
                      d="M 60,210 L 220,210"
                      fill="none"
                      stroke={currentB ? '#ef4444' : '#334155'}
                      strokeWidth={currentB ? '3.5' : '2'}
                      filter={currentB ? 'url(#circuit-glow-rose)' : undefined}
                    />
                    {currentB && (
                      <circle cx="140" cy="210" r="4" fill="#ffffff" filter="url(#circuit-glow-rose)">
                        <animate attributeName="cx" from="60" to="220" dur="1s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </>
                )}

                {/* Gate Symbol Rendering */}
                {activeTab === 'and_gate' && (
                  <g transform="translate(220, 75)">
                    {/* ANSI AND Gate Shape */}
                    <path
                      d="M 0,0 L 50,0 C 95,0 95,150 50,150 L 0,150 Z"
                      fill={outputVal ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.85)'}
                      stroke={outputVal ? '#ef4444' : '#3b82f6'}
                      strokeWidth="3"
                      filter={outputVal ? 'url(#circuit-glow-rose)' : 'url(#circuit-glow-blue)'}
                    />
                    <text x="35" y="82" fill="#ffffff" fontFamily="monospace" fontSize="16" fontWeight="bold" textAnchor="middle">
                      AND (∧)
                    </text>
                  </g>
                )}

                {activeTab === 'or_gate' && (
                  <g transform="translate(220, 75)">
                    {/* ANSI OR Gate Shape */}
                    <path
                      d="M 0,0 Q 25,75 0,150 Q 55,145 95,75 Q 55,5 0,0 Z"
                      fill={outputVal ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.85)'}
                      stroke={outputVal ? '#f59e0b' : '#3b82f6'}
                      strokeWidth="3"
                      filter={outputVal ? 'url(#circuit-glow-rose)' : 'url(#circuit-glow-blue)'}
                    />
                    <text x="45" y="82" fill="#ffffff" fontFamily="monospace" fontSize="16" fontWeight="bold" textAnchor="middle">
                      OR (∨)
                    </text>
                  </g>
                )}

                {activeTab === 'not_gate' && (
                  <g transform="translate(220, 65)">
                    {/* ANSI NOT Inverter */}
                    <polygon
                      points="0,15 80,75 0,135"
                      fill={outputVal ? 'rgba(96, 165, 250, 0.15)' : 'rgba(15, 23, 42, 0.85)'}
                      stroke={outputVal ? '#60a5fa' : '#64748b'}
                      strokeWidth="3"
                    />
                    <circle cx="88" cy="75" r="8" fill="#060a12" stroke={outputVal ? '#60a5fa' : '#64748b'} strokeWidth="3" />
                    <text x="35" y="82" fill="#ffffff" fontFamily="monospace" fontSize="16" fontWeight="bold" textAnchor="middle">
                      NOT (¬)
                    </text>
                  </g>
                )}

                {activeTab === 'nand_gate' && (
                  <g transform="translate(220, 75)">
                    {/* ANSI NAND Gate: AND shape + circle */}
                    <path
                      d="M 0,0 L 50,0 C 95,0 95,150 50,150 L 0,150 Z"
                      fill={outputVal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.85)'}
                      stroke={outputVal ? '#10b981' : '#3b82f6'}
                      strokeWidth="3"
                    />
                    <circle cx="103" cy="75" r="8" fill="#060a12" stroke={outputVal ? '#10b981' : '#3b82f6'} strokeWidth="3" />
                    <text x="35" y="82" fill="#ffffff" fontFamily="monospace" fontSize="16" fontWeight="bold" textAnchor="middle">
                      NAND
                    </text>
                  </g>
                )}

                {/* Output Wire */}
                <path
                  d={activeTab === 'not_gate' ? "M 316,140 L 480,140" : activeTab === 'nand_gate' ? "M 331,150 L 480,150" : "M 315,150 L 480,150"}
                  fill="none"
                  stroke={outputVal ? '#ef4444' : '#334155'}
                  strokeWidth={outputVal ? '4' : '2'}
                  filter={outputVal ? 'url(#circuit-glow-rose)' : undefined}
                />
                {outputVal && (
                  <circle cx="400" cy={activeTab === 'not_gate' ? 140 : 150} r="5" fill="#ffffff" filter="url(#circuit-glow-rose)">
                    <animate attributeName="cx" from="315" to="480" dur="0.9s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Nodes & Labels */}
                <circle cx="60" cy="90" r="9" fill={currentA ? '#ef4444' : '#1e293b'} stroke="#ffffff" strokeWidth="2" />
                <text x="25" y="95" fill="#e2e8f0" fontFamily="monospace" fontSize="14" fontWeight="bold">A</text>
                <text x="60" y="65" fill={currentA ? '#ef4444' : '#64748b'} fontFamily="monospace" fontSize="12" textAnchor="middle" fontWeight="bold">
                  {currentA ? '1 (TRUE)' : '0 (FALSE)'}
                </text>

                {activeTab !== 'not_gate' && (
                  <>
                    <circle cx="60" cy="210" r="9" fill={currentB ? '#ef4444' : '#1e293b'} stroke="#ffffff" strokeWidth="2" />
                    <text x="25" y="215" fill="#e2e8f0" fontFamily="monospace" fontSize="14" fontWeight="bold">B</text>
                    <text x="60" y="242" fill={currentB ? '#ef4444' : '#64748b'} fontFamily="monospace" fontSize="12" textAnchor="middle" fontWeight="bold">
                      {currentB ? '1 (TRUE)' : '0 (FALSE)'}
                    </text>
                  </>
                )}

                {/* Output Node */}
                <circle
                  cx="480"
                  cy={activeTab === 'not_gate' ? 140 : 150}
                  r="10"
                  fill={outputVal ? '#ef4444' : '#1e293b'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter={outputVal ? 'url(#circuit-glow-rose)' : undefined}
                />
                <text x="510" y={activeTab === 'not_gate' ? 145 : 155} fill="#ffffff" fontFamily="monospace" fontSize="15" fontWeight="bold">
                  {activeTab === 'and_gate' ? 'E' : activeTab === 'or_gate' ? 'W' : activeTab === 'not_gate' ? 'S' : 'F'}
                </text>
                <text
                  x="480"
                  y={activeTab === 'not_gate' ? 115 : 125}
                  fill={outputVal ? '#ef4444' : '#64748b'}
                  fontFamily="monospace"
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {outputVal ? '1 (TRUE)' : '0 (FALSE)'}
                </text>
              </svg>
            </div>
          </div>

          {/* Manual Input Testing Controls */}
          {manualMode && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between gap-4 flex-wrap">
              <span className="text-xs font-mono text-amber-300 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> MANUAL INPUT TESTING:
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleManualA}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    manualA ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  TOGGLE A: {manualA ? '1 (TRUE)' : '0 (FALSE)'}
                </button>
                {activeTab !== 'not_gate' && (
                  <button
                    onClick={handleToggleManualB}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      manualB ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    TOGGLE B: {manualB ? '1 (TRUE)' : '0 (FALSE)'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Gate Behavioral Summary */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex justify-between items-center flex-wrap gap-2">
            <span>
              {activeTab === 'and_gate' && 'Conjunction: E is TRUE if and only if BOTH A and B are TRUE.'}
              {activeTab === 'or_gate' && 'Disjunction: W is TRUE if AT LEAST ONE of A or B is TRUE.'}
              {activeTab === 'not_gate' && 'Negation: S is TRUE if and only if A is FALSE.'}
              {activeTab === 'nand_gate' && 'Sheffer Stroke / NAND: F is TRUE unless BOTH A and B are TRUE.'}
            </span>
            <span className="font-bold text-white">
              Formula: {activeTab === 'and_gate' ? 'E = A ∧ B' : activeTab === 'or_gate' ? 'W = A ∨ B' : activeTab === 'not_gate' ? 'S = ¬A' : 'F = ¬(A ∧ B)'}
            </span>
          </div>
        </div>

        {/* Right: Real-time Truth Table with Dynamic Row Highlighting (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0b0f19] border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                  <Binary className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-base text-white">
                  DYNAMIC TRUTH TABLE
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                ACTIVE VALUATION MATRIX
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">
              Every combination of input truth values is enumerated below. The highlighted row dynamically corresponds to the live patient state.
            </p>

            {/* Truth Table */}
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#060a12]">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300">
                    <th className="py-2.5 px-3">ROW</th>
                    <th className="py-2.5 px-3 text-blue-300">A (O₂ Critical)</th>
                    {activeTab !== 'not_gate' && (
                      <th className="py-2.5 px-3 text-blue-300">B (HR Abnormal)</th>
                    )}
                    <th className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                      {activeTab === 'and_gate' ? 'E = A ∧ B' : activeTab === 'or_gate' ? 'W = A ∨ B' : activeTab === 'not_gate' ? 'S = ¬A' : 'F = ¬(A ∧ B)'}
                    </th>
                    <th className="py-2.5 px-3 text-center text-slate-400">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeTab === 'not_gate' ? (
                    [
                      { row: 1, a: false, out: true },
                      { row: 2, a: true, out: false },
                    ].map((item) => {
                      const isActive = currentA === item.a;
                      return (
                        <tr
                          key={item.row}
                          className={`transition-all ${
                            isActive
                              ? 'bg-blue-500/15 border-l-4 border-l-blue-400 font-bold'
                              : 'text-slate-400 hover:bg-slate-900/40'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-semibold text-slate-400">{item.row}</td>
                          <td className="py-2.5 px-3 font-bold text-white">{item.a ? '1' : '0'}</td>
                          <td className="py-2.5 px-3 text-right font-bold">
                            <span className={item.out ? 'text-emerald-400' : 'text-slate-500'}>
                              {item.out ? '1 (TRUE)' : '0 (FALSE)'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isActive ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse">
                                ACTIVE NOW
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-600">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    [
                      { row: 1, a: false, b: false, andOut: false, orOut: false, nandOut: true, label: 'Normal Baseline' },
                      { row: 2, a: false, b: true, andOut: false, orOut: true, nandOut: true, label: 'Cardiac Warning' },
                      { row: 3, a: true, b: false, andOut: false, orOut: true, nandOut: true, label: 'Hypoxia Warning' },
                      { row: 4, a: true, b: true, andOut: true, orOut: true, nandOut: false, label: 'COMBINED EMERGENCY' },
                    ].map((item) => {
                      const isActive = currentA === item.a && currentB === item.b;
                      const res = activeTab === 'and_gate' ? item.andOut : activeTab === 'or_gate' ? item.orOut : item.nandOut;
                      return (
                        <tr
                          key={item.row}
                          className={`transition-all ${
                            isActive
                              ? res && activeTab === 'and_gate'
                                ? 'bg-rose-500/20 border-l-4 border-l-rose-500 font-bold'
                                : 'bg-blue-500/15 border-l-4 border-l-blue-400 font-bold'
                              : 'text-slate-400 hover:bg-slate-900/40'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-semibold text-slate-400">R{item.row}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-white">{item.a ? '1' : '0'}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-white">{item.b ? '1' : '0'}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold">
                            <span className={res ? (activeTab === 'and_gate' ? 'text-rose-400' : 'text-amber-400') : 'text-slate-400'}>
                              {res ? '1 (TRUE)' : '0 (FALSE)'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isActive ? (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border animate-pulse ${
                                  res && activeTab === 'and_gate'
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                    : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                }`}
                              >
                                ACTIVE NOW
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-600">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Design Principle Callout */}
          <div className="mt-5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-mono font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>ALARM FATIGUE MITIGATION PRINCIPLE:</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-[11px]">
              Notice how the AND gate filters out isolated transients (Rows 2 and 3 evaluate to 0).
              Only simultaneous physiological failure (Row 4: A=1, B=1) satisfies the conjunction,
              eliminating hospital false alarm fatigue while providing a deterministic guarantee of emergency response.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
