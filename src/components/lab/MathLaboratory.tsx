import React, { useState } from 'react';
import { soundEngine } from '../../utils/audio';
import { 
  GraduationCap, 
  Binary, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Users, 
  Equal, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const MathLaboratory: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'connectives' | 'tables' | 'demorgan' | 'sat' | 'quantifiers'>('connectives');

  // Module A State: Interactive Operators
  const [opA, setOpA] = useState<boolean>(true);
  const [opB, setOpB] = useState<boolean>(false);
  const [selectedOp, setSelectedOp] = useState<'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'IMPLIES' | 'IFF'>('AND');

  // Module B State: Selected Formula
  const [tableFormula, setTableFormula] = useState<'E_AND' | 'W_OR' | 'XOR' | 'IMPLIES'>('E_AND');

  // Module C State: De Morgan's Law verification
  const [dmA, setDmA] = useState<boolean>(true);
  const [dmB, setDmB] = useState<boolean>(false);
  const [selectedDeMorganLaw, setSelectedDeMorganLaw] = useState<'law1' | 'law2'>('law1');

  // Module D State: SAT formula
  const [selectedFormula, setSelectedFormula] = useState<'contingent' | 'tautology' | 'contradiction'>('contingent');

  // Module E State: Multi-Bed Ward Quantifiers (6 beds)
  const [beds, setBeds] = useState([
    { id: 1, name: 'Bed 01 (Post-Op General)', isCritical: false, hr: 72, spo2: 99, temp: 36.8 },
    { id: 2, name: 'Bed 02 (Cardiology Unit)', isCritical: false, hr: 80, spo2: 97, temp: 37.1 },
    { id: 3, name: 'Bed 03 (Pulmonology Care)', isCritical: false, hr: 76, spo2: 98, temp: 36.9 },
    { id: 4, name: 'Bed 04 (Neuro-ICU Trauma)', isCritical: true, hr: 148, spo2: 84, temp: 38.6 },
    { id: 5, name: 'Bed 05 (Surgical Step-Down)', isCritical: false, hr: 68, spo2: 98, temp: 36.7 },
    { id: 6, name: 'Bed 06 (Transplant ICU)', isCritical: false, hr: 74, spo2: 99, temp: 37.0 },
  ]);

  // Compute Module A Output
  const computeOpOutput = () => {
    switch (selectedOp) {
      case 'AND': return opA && opB;
      case 'OR': return opA || opB;
      case 'NOT': return !opA;
      case 'XOR': return (opA && !opB) || (!opA && opB);
      case 'NAND': return !(opA && opB);
      case 'NOR': return !(opA || opB);
      case 'IMPLIES': return !opA || opB; // A → B ≡ ¬A ∨ B
      case 'IFF': return opA === opB; // A ↔ B
    }
  };

  // Compute Module E Quantifiers
  const criticalBeds = beds.filter((b) => b.isCritical);
  const someCritical = criticalBeds.length > 0; // ∃x P(x)
  const allStable = beds.every((b) => !b.isCritical); // ∀x ¬P(x)

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

  const handleResetBeds = () => {
    soundEngine.playGateClick();
    setBeds((prev) => prev.map((b) => ({ ...b, isCritical: false, hr: 74, spo2: 98, temp: 36.8 })));
  };

  return (
    <section id="math-laboratory" className="relative w-full py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-widest mb-2">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>DISCRETE MATHEMATICS SYLLABUS DISCOVERY</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            THE MATHEMATICS LABORATORY
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
            An interactive visual laboratory for Propositional Connectives, Dynamic Truth Tables,
            De Morgan's Laws of Equivalence, Satisfiability (SAT), and Predicate Quantifiers.
          </p>
        </div>
      </div>

      {/* Module Selector Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-8">
        {[
          { id: 'connectives', label: '1. CONNECTIVES', icon: <Binary className="w-4 h-4" /> },
          { id: 'tables', label: '2. TRUTH TABLES', icon: <Layers className="w-4 h-4" /> },
          { id: 'demorgan', label: "3. DE MORGAN'S LAWS", icon: <Equal className="w-4 h-4" /> },
          { id: 'sat', label: '4. SAT & TAUTOLOGY', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'quantifiers', label: '5. WARD QUANTIFIERS (∀, ∃)', icon: <Users className="w-4 h-4" /> },
        ].map((mod) => (
          <button
            key={mod.id}
            onClick={() => {
              soundEngine.playGateClick();
              setActiveModule(mod.id as any);
            }}
            className={`p-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
              activeModule === mod.id
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/25'
                : 'bg-[#090d16] border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {mod.icon}
            <span className="truncate">{mod.label}</span>
          </button>
        ))}
      </div>

      {/* MODULE 1: BOOLEAN LOGIC CONNECTIVES */}
      {activeModule === 'connectives' && (
        <div className="rounded-2xl p-6 sm:p-8 bg-[#0b0f19] border border-slate-800 shadow-xl animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase">MODULE 01</span>
              <h3 className="font-display font-extrabold text-2xl text-white">
                PROPOSITIONAL CONNECTIVES & LOGICAL OPERATORS
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Toggle inputs A and B and select any operator to observe digital logic transformations.
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'IMPLIES', 'IFF'] as const).map((op) => (
                <button
                  key={op}
                  onClick={() => {
                    soundEngine.playGateClick();
                    setSelectedOp(op);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedOp === op
                      ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-600/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Input Switches */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold text-slate-300">PROPOSITION A</span>
                  <button
                    onClick={() => {
                      soundEngine.playGateClick();
                      setOpA(!opA);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                      opA ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {opA ? '1 (TRUE)' : '0 (FALSE)'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">e.g., Oxygen level below 90% (SpO₂ &lt; 90)</p>
              </div>

              {selectedOp !== 'NOT' && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono font-bold text-slate-300">PROPOSITION B</span>
                    <button
                      onClick={() => {
                        soundEngine.playGateClick();
                        setOpB(!opB);
                      }}
                      className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                        opB ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opB ? '1 (TRUE)' : '0 (FALSE)'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">e.g., Heart rate abnormal (HR &lt; 50 ∨ HR &gt; 120)</p>
                </div>
              )}
            </div>

            {/* Logical Evaluation Core */}
            <div className="p-6 rounded-2xl bg-[#060a12] border border-slate-800 text-center flex flex-col items-center justify-center shadow-lg">
              <Cpu className="w-10 h-10 text-blue-400 mb-2 animate-pulse" />
              <span className="text-xs font-mono text-slate-400 uppercase">FORMAL CONNECTIVE</span>
              <div className="font-display text-2xl font-extrabold text-white mt-1">
                {selectedOp === 'NOT' ? `¬A` : selectedOp === 'IMPLIES' ? `A → B` : selectedOp === 'IFF' ? `A ↔ B` : `A ${selectedOp} B`}
              </div>
              <div className="font-mono text-sm text-blue-300 mt-2">
                {selectedOp === 'NOT'
                  ? `¬(${opA ? '1' : '0'}) = ${computeOpOutput() ? '1' : '0'}`
                  : selectedOp === 'IMPLIES'
                  ? `(${opA ? '1' : '0'}) → (${opB ? '1' : '0'}) = ${computeOpOutput() ? '1' : '0'}`
                  : `(${opA ? '1' : '0'}) ${selectedOp} (${opB ? '1' : '0'}) = ${computeOpOutput() ? '1' : '0'}`}
              </div>
            </div>

            {/* Output State Display */}
            <div className={`p-6 rounded-2xl border text-center transition-all shadow-lg ${
              computeOpOutput()
                ? 'bg-emerald-950/30 border-emerald-500'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">OUTPUT TRUTH VALUE</span>
              <div className={`font-display text-4xl sm:text-5xl font-extrabold mt-2 ${
                computeOpOutput() ? 'text-emerald-400' : 'text-slate-500'
              }`}>
                {computeOpOutput() ? 'TRUE (1)' : 'FALSE (0)'}
              </div>
              <span className={`text-xs font-mono mt-2 inline-block font-semibold ${
                computeOpOutput() ? 'text-emerald-300' : 'text-slate-500'
              }`}>
                {computeOpOutput() ? 'SIGNAL ASSERTED: HIGH' : 'SIGNAL INHIBITED: LOW'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: DYNAMIC TRUTH TABLES */}
      {activeModule === 'tables' && (
        <div className="rounded-2xl p-6 sm:p-8 bg-[#0b0f19] border border-slate-800 shadow-xl animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase">MODULE 02</span>
              <h3 className="font-display font-extrabold text-2xl text-white">
                DYNAMIC TRUTH TABLE LABORATORY
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Exhaustive interpretation matrix across all combinations of input truth assignments.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'E_AND', label: 'E = A ∧ B' },
                { id: 'W_OR', label: 'W = A ∨ B' },
                { id: 'XOR', label: 'X = A ⊕ B' },
                { id: 'IMPLIES', label: 'A → B' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    soundEngine.playGateClick();
                    setTableFormula(f.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    tableFormula === f.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#060a12]">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-300">
                  <th className="py-3 px-4">Row #</th>
                  <th className="py-3 px-4 text-blue-400">A (SpO₂ &lt; 90)</th>
                  <th className="py-3 px-4 text-blue-400">B (HR Abnormal)</th>
                  <th className="py-3 px-4 text-emerald-400 font-bold">
                    {tableFormula === 'E_AND' ? 'A ∧ B (Conjunction)' : tableFormula === 'W_OR' ? 'A ∨ B (Disjunction)' : tableFormula === 'XOR' ? 'A ⊕ B (Exclusive OR)' : 'A → B (Material Implication)'}
                  </th>
                  <th className="py-3 px-4 text-slate-400">Clinical Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {[
                  { r: 1, a: 0, b: 0, and: 0, or: 0, xor: 0, imp: 1, desc: 'Homeostasis. Zero alerts activated.' },
                  { r: 2, a: 0, b: 1, and: 0, or: 1, xor: 1, imp: 1, desc: 'Isolated Cardiac Warning. Code red suppressed.' },
                  { r: 3, a: 1, b: 0, and: 0, or: 1, xor: 1, imp: 0, desc: 'Isolated Hypoxia Warning. Code red suppressed.' },
                  { r: 4, a: 1, b: 1, and: 1, or: 1, xor: 0, imp: 1, desc: 'CRITICAL COMBINED EMERGENCY. Dual sensor crisis.' },
                ].map((row) => {
                  const val = tableFormula === 'E_AND' ? row.and : tableFormula === 'W_OR' ? row.or : tableFormula === 'XOR' ? row.xor : row.imp;
                  return (
                    <tr key={row.r} className={val && tableFormula === 'E_AND' ? 'bg-rose-950/20 font-bold' : 'hover:bg-slate-900/40'}>
                      <td className="py-3 px-4 text-slate-400">Row {row.r}</td>
                      <td className="py-3 px-4 text-white font-bold">{row.a}</td>
                      <td className="py-3 px-4 text-white font-bold">{row.b}</td>
                      <td className={`py-3 px-4 font-bold ${val ? (tableFormula === 'E_AND' ? 'text-rose-400' : 'text-emerald-400') : 'text-slate-500'}`}>
                        {val} ({val ? 'TRUE' : 'FALSE'})
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-sans text-xs">{row.desc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 3: DE MORGAN'S LAWS & LOGICAL EQUIVALENCE */}
      {activeModule === 'demorgan' && (
        <div className="rounded-2xl p-6 sm:p-8 bg-[#0b0f19] border border-slate-800 shadow-xl animate-in fade-in duration-300">
          <div className="mb-6 pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase">MODULE 03</span>
              <h3 className="font-display font-extrabold text-2xl text-white">
                DE MORGAN'S LAWS & LOGICAL EQUIVALENCE
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {selectedDeMorganLaw === 'law1'
                  ? 'Law 1: ¬(A ∧ B) ≡ (¬A ∨ ¬B) — "Not both failing is equivalent to at least one safe."'
                  : 'Law 2: ¬(A ∨ B) ≡ (¬A ∧ ¬B) — "Neither failing is equivalent to both safe."'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setSelectedDeMorganLaw('law1')}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                    selectedDeMorganLaw === 'law1' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  LAW 1: ¬(A ∧ B)
                </button>
                <button
                  onClick={() => setSelectedDeMorganLaw('law2')}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                    selectedDeMorganLaw === 'law2' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  LAW 2: ¬(A ∨ B)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setDmA(!dmA);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                    dmA ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  A: {dmA ? '1' : '0'}
                </button>
                <button
                  onClick={() => {
                    soundEngine.playGateClick();
                    setDmB(!dmB);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                    dmB ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  B: {dmB ? '1' : '0'}
                </button>
              </div>
            </div>
          </div>

          {/* Side by side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">LEFT HAND SIDE (LHS)</span>
              <div className="font-display text-xl font-bold text-white mt-1">
                {selectedDeMorganLaw === 'law1' ? '¬(A ∧ B)' : '¬(A ∨ B)'}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedDeMorganLaw === 'law1' ? 'Negation of Conjunction' : 'Negation of Disjunction'}
              </p>
              <div className="mt-4 p-3 rounded-lg bg-[#060a12] font-mono text-xs flex justify-between items-center">
                <span>With A={dmA ? '1' : '0'}, B={dmB ? '1' : '0'}:</span>
                <span className="text-blue-300 font-bold text-sm">
                  {selectedDeMorganLaw === 'law1'
                    ? `¬(${dmA ? '1' : '0'} ∧ ${dmB ? '1' : '0'}) = ${!(dmA && dmB) ? '1 (TRUE)' : '0 (FALSE)'}`
                    : `¬(${dmA ? '1' : '0'} ∨ ${dmB ? '1' : '0'}) = ${!(dmA || dmB) ? '1 (TRUE)' : '0 (FALSE)'}`}
                </span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">RIGHT HAND SIDE (RHS)</span>
              <div className="font-display text-xl font-bold text-white mt-1">
                {selectedDeMorganLaw === 'law1' ? '(¬A ∨ ¬B)' : '(¬A ∧ ¬B)'}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedDeMorganLaw === 'law1' ? 'Disjunction of Negations' : 'Conjunction of Negations'}
              </p>
              <div className="mt-4 p-3 rounded-lg bg-[#060a12] font-mono text-xs flex justify-between items-center">
                <span>With A={dmA ? '1' : '0'}, B={dmB ? '1' : '0'}:</span>
                <span className="text-indigo-300 font-bold text-sm">
                  {selectedDeMorganLaw === 'law1'
                    ? `(${!dmA ? '1' : '0'} ∨ ${!dmB ? '1' : '0'}) = ${!dmA || !dmB ? '1 (TRUE)' : '0 (FALSE)'}`
                    : `(${!dmA ? '1' : '0'} ∧ ${!dmB ? '1' : '0'}) = ${!dmA && !dmB ? '1 (TRUE)' : '0 (FALSE)'}`}
                </span>
              </div>
            </div>
          </div>

          {/* Equivalence Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#060a12]">
            <table className="w-full text-center font-mono text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                  <th className="py-2.5 px-3">A</th>
                  <th className="py-2.5 px-3">B</th>
                  <th className="py-2.5 px-3 bg-blue-950/40 text-blue-400 font-bold">
                    {selectedDeMorganLaw === 'law1' ? '¬(A ∧ B)' : '¬(A ∨ B)'}
                  </th>
                  <th className="py-2.5 px-3 bg-indigo-950/40 text-indigo-300 font-bold">
                    {selectedDeMorganLaw === 'law1' ? '¬A ∨ ¬B' : '¬A ∧ ¬B'}
                  </th>
                  <th className="py-2.5 px-3 text-emerald-400 font-bold">EQUIVALENCE PROOF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { a: 0, b: 0, notAnd: 1, orNot: 1, notOr: 1, andNot: 1 },
                  { a: 0, b: 1, notAnd: 1, orNot: 1, notOr: 0, andNot: 0 },
                  { a: 1, b: 0, notAnd: 1, orNot: 1, notOr: 0, andNot: 0 },
                  { a: 1, b: 1, notAnd: 0, orNot: 0, notOr: 0, andNot: 0 },
                ].map((row, idx) => {
                  const lhs = selectedDeMorganLaw === 'law1' ? row.notAnd : row.notOr;
                  const rhs = selectedDeMorganLaw === 'law1' ? row.orNot : row.andNot;
                  return (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 font-bold text-white">{row.a}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{row.b}</td>
                      <td className="py-2.5 px-3 bg-blue-950/30 text-blue-300 font-extrabold text-sm">{lhs}</td>
                      <td className="py-2.5 px-3 bg-indigo-950/30 text-indigo-300 font-extrabold text-sm">{rhs}</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> IDENTICAL (≡)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 4: SATISFIABILITY, TAUTOLOGY & CONTRADICTION */}
      {activeModule === 'sat' && (
        <div className="rounded-2xl p-6 sm:p-8 bg-[#0b0f19] border border-slate-800 shadow-xl animate-in fade-in duration-300">
          <div className="mb-6 pb-4 border-b border-slate-800">
            <span className="text-xs font-mono text-blue-400 font-bold uppercase">MODULE 04</span>
            <h3 className="font-display font-extrabold text-2xl text-white">
              SATISFIABILITY (SAT), TAUTOLOGY & CONTRADICTION
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              In safety-critical discrete software, a proposition is SATISFIABLE if at least one truth assignment evaluates to 1.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              {
                id: 'contingent',
                title: 'Contingent (Satisfiable)',
                formula: 'E = A ∧ B',
                eval: 'Satisfiable (1 for [1,1], 0 otherwise)',
                type: 'CONTINGENT',
                badgeColor: 'border-blue-500 text-blue-300 bg-blue-950/30',
                clinical: 'Medical alert rule: must be satisfiable so emergency triggers when needed, but not a tautology.',
              },
              {
                id: 'tautology',
                title: 'Tautology (Valid)',
                formula: 'A ∨ ¬A',
                eval: 'Always TRUE (1 for all assignments)',
                type: 'TAUTOLOGY',
                badgeColor: 'border-emerald-500 text-emerald-300 bg-emerald-950/30',
                clinical: 'Law of Excluded Middle: The patient either has hypoxia or does not. True in all worlds.',
              },
              {
                id: 'contradiction',
                title: 'Contradiction (Unsatisfiable)',
                formula: 'A ∧ ¬A',
                eval: 'Always FALSE (0 for all assignments)',
                type: 'UNSATISFIABLE',
                badgeColor: 'border-rose-500 text-rose-300 bg-rose-950/30',
                clinical: 'Impossible condition: A patient cannot simultaneously have SpO₂ < 90% and NOT SpO₂ < 90%.',
              },
            ].map((f) => (
              <div
                key={f.id}
                onClick={() => {
                  soundEngine.playGateClick();
                  setSelectedFormula(f.id as any);
                }}
                className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                  selectedFormula === f.id
                    ? 'border-blue-500 bg-slate-900 shadow-xl'
                    : 'border-slate-800 bg-[#060a12] hover:border-slate-700'
                }`}
              >
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${f.badgeColor}`}>
                  {f.type}
                </span>
                <div className="font-display font-extrabold text-lg text-white mt-2">
                  {f.formula}
                </div>
                <div className="text-xs font-mono text-blue-300 mt-1 font-semibold">{f.eval}</div>
                <p className="text-xs text-slate-400 mt-3 font-sans leading-relaxed">
                  {f.clinical}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 5: WARD PREDICATES & FIRST-ORDER QUANTIFIERS */}
      {activeModule === 'quantifiers' && (
        <div className="rounded-2xl p-6 sm:p-8 bg-[#0b0f19] border border-slate-800 shadow-xl animate-in fade-in duration-300">
          <div className="mb-6 pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold uppercase">MODULE 05</span>
              <h3 className="font-display font-extrabold text-2xl text-white">
                PREDICATES & FIRST-ORDER QUANTIFIERS (∀, ∃)
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Universe of Discourse U = &#123;Bed 1, Bed 2, Bed 3, Bed 4, Bed 5, Bed 6&#125;. Predicate P(x) = "Patient x has critical telemetry".
              </p>
            </div>

            <button
              onClick={handleResetBeds}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>STABILIZE ALL BEDS</span>
            </button>
          </div>

          {/* Quantifier Results Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {/* Universal Quantifier Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              allStable
                ? 'bg-emerald-950/30 border-emerald-500 shadow-lg'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                  UNIVERSAL QUANTIFIER (∀)
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  allStable ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                }`}>
                  {allStable ? 'TRUE (1)' : 'FALSE (0)'}
                </span>
              </div>
              <div className="font-display text-2xl font-extrabold text-white mt-1">
                ∀x ∈ Ward, ¬P(x)
              </div>
              <div className="text-xs font-mono text-blue-300 mt-1">
                "All patients in the ward are stable and safe."
              </div>
              <p className="text-xs text-slate-400 mt-2 font-sans">
                {allStable
                  ? 'Condition satisfied: Every single patient bed is currently non-critical.'
                  : `Falsified: Counter-example found! Patient in Bed 0${criticalBeds[0]?.id} has triggered critical state P(x)=1.`}
              </p>
            </div>

            {/* Existential Quantifier Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              someCritical
                ? 'bg-rose-950/30 border-rose-500 shadow-lg'
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                  EXISTENTIAL QUANTIFIER (∃)
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  someCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-500'
                }`}>
                  {someCritical ? 'TRUE (1)' : 'FALSE (0)'}
                </span>
              </div>
              <div className="font-display text-2xl font-extrabold text-white mt-1">
                ∃x ∈ Ward, P(x)
              </div>
              <div className="text-xs font-mono text-rose-300 mt-1">
                "There exists at least one patient requiring emergency intervention."
              </div>
              <p className="text-xs text-slate-400 mt-2 font-sans">
                {someCritical
                  ? `Verified: Emergency alert triggered for ${criticalBeds.length} bed(s): [${criticalBeds.map((b) => `Bed 0${b.id}`).join(', ')}].`
                  : 'Zero emergencies currently present across the entire ward.'}
              </p>
            </div>
          </div>

          {/* Ward Bed Stations Grid */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 mb-2 flex justify-between items-center">
              <span>WARD BED STATIONS (Click any patient bed to toggle P(x) state):</span>
              <span className="text-blue-400 font-bold">{beds.length} MONITORED BEDS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {beds.map((bed) => (
                <div
                  key={bed.id}
                  onClick={() => toggleBed(bed.id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    bed.isCritical
                      ? 'bg-rose-950/25 border-rose-500 shadow-md shadow-rose-950/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-display font-bold text-xs text-white">
                      BED 0{bed.id}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      bed.isCritical ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {bed.isCritical ? 'CRITICAL P(x)=1' : 'STABLE P(x)=0'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 truncate">{bed.name}</div>
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono flex justify-between text-slate-400">
                    <span>HR: <strong className={bed.isCritical ? 'text-rose-400' : 'text-white'}>{bed.hr}</strong></span>
                    <span>SpO₂: <strong className={bed.isCritical ? 'text-rose-400' : 'text-white'}>{bed.spo2}%</strong></span>
                    <span>Temp: <strong className={bed.isCritical ? 'text-rose-400' : 'text-white'}>{bed.temp}°C</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
