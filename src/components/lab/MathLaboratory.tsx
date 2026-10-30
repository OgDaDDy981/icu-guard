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
  Sparkles
} from 'lucide-react';

export const MathLaboratory: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'connectives' | 'tables' | 'demorgan' | 'sat' | 'quantifiers'>('connectives');

  // Module A State: Interactive Operators
  const [opA, setOpA] = useState<boolean>(true);
  const [opB, setOpB] = useState<boolean>(false);
  const [selectedOp, setSelectedOp] = useState<'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR'>('AND');

  // Module C State: De Morgan's Law verification
  const [dmA, setDmA] = useState<boolean>(true);
  const [dmB, setDmB] = useState<boolean>(false);

  // Module D State: SAT formula
  const [selectedFormula, setSelectedFormula] = useState<'contingent' | 'tautology' | 'contradiction'>('contingent');

  // Module E State: Multi-Bed Ward Quantifiers
  const [beds, setBeds] = useState([
    { id: 1, name: 'Bed 01 (Post-Op A)', isCritical: false, hr: 72, spo2: 99 },
    { id: 2, name: 'Bed 02 (Cardiology B)', isCritical: false, hr: 80, spo2: 97 },
    { id: 3, name: 'Bed 03 (Pulmonology C)', isCritical: false, hr: 76, spo2: 98 },
    { id: 4, name: 'Bed 04 (Neuro-ICU D)', isCritical: true, hr: 148, spo2: 84 },
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
    }
  };

  // Compute Module E Quantifiers
  const someCritical = beds.some((b) => b.isCritical); // ∃x P(x)
  const allStable = beds.every((b) => !b.isCritical); // ∀x ¬P(x)

  const toggleBed = (id: number) => {
    soundEngine.playGateClick();
    setBeds((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              isCritical: !b.isCritical,
              hr: !b.isCritical ? 142 : 72,
              spo2: !b.isCritical ? 85 : 98,
            }
          : b
      )
    );
  };

  return (
    <section id="math-laboratory" className="relative w-full py-16 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>ACADEMIC FOUNDATION • DISCRETE MATHEMATICS UNIT 2</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            THE MATHEMATICS LABORATORY
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
            Interactive exploration of Propositional Connectives, Truth Tables, De Morgan's Laws of Equivalence,
            Satisfiability (SAT), and First-Order Predicate Quantifiers in ICU multi-patient environments.
          </p>
        </div>
      </div>

      {/* Module Selector Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-8">
        {[
          { id: 'connectives', label: 'A. BOOLEAN LOGIC', icon: <Binary className="w-4 h-4" /> },
          { id: 'tables', label: 'B. TRUTH TABLES', icon: <Layers className="w-4 h-4" /> },
          { id: 'demorgan', label: "C. DE MORGAN'S LAWS", icon: <Equal className="w-4 h-4" /> },
          { id: 'sat', label: 'D. SATISFIABILITY', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'quantifiers', label: 'E. QUANTIFIERS (∀, ∃)', icon: <Users className="w-4 h-4" /> },
        ].map((mod) => (
          <button
            key={mod.id}
            onClick={() => {
              soundEngine.playGateClick();
              setActiveModule(mod.id as any);
            }}
            className={`p-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
              activeModule === mod.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {mod.icon}
            <span className="truncate">{mod.label}</span>
          </button>
        ))}
      </div>

      {/* MODULE A: BOOLEAN LOGIC OPERATORS */}
      {activeModule === 'connectives' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/20 animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">MODULE A</span>
              <h3 className="font-display font-extrabold text-2xl text-white">
                PROPOSITIONAL CONNECTIVES & LOGIC GATES
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Toggle inputs A and B and select any operator to observe digital logic transformations.
              </p>
            </div>

            {/* Operator Selection Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR'] as const).map((op) => (
                <button
                  key={op}
                  onClick={() => {
                    soundEngine.playGateClick();
                    setSelectedOp(op);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedOp === op
                      ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/30'
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
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold text-slate-300">PROPOSITION A</span>
                  <button
                    onClick={() => {
                      soundEngine.playGateClick();
                      setOpA(!opA);
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                      opA ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {opA ? '1 (TRUE)' : '0 (FALSE)'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">e.g., Oxygen level below 90%</p>
              </div>

              {selectedOp !== 'NOT' && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono font-bold text-slate-300">PROPOSITION B</span>
                    <button
                      onClick={() => {
                        soundEngine.playGateClick();
                        setOpB(!opB);
                      }}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                        opB ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opB ? '1 (TRUE)' : '0 (FALSE)'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">e.g., Heart rate above 120 BPM</p>
                </div>
              )}
            </div>

            {/* Logical Evaluation Core */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 text-center flex flex-col items-center justify-center">
              <Cpu className="w-10 h-10 text-cyan-400 mb-2 animate-pulse" />
              <span className="text-xs font-mono text-slate-400">LOGICAL OPERATION</span>
              <div className="font-display text-2xl font-extrabold text-white mt-1">
                {selectedOp === 'NOT' ? `¬A` : `A ${selectedOp} B`}
              </div>
              <div className="font-mono text-sm text-cyan-300 mt-2">
                {selectedOp === 'NOT'
                  ? `¬(${opA ? '1' : '0'}) = ${computeOpOutput() ? '1' : '0'}`
                  : `(${opA ? '1' : '0'}) ${selectedOp} (${opB ? '1' : '0'}) = ${computeOpOutput() ? '1' : '0'}`}
              </div>
            </div>

            {/* Output State Display */}
            <div className={`p-6 rounded-2xl border text-center transition-all ${
              computeOpOutput()
                ? 'bg-emerald-950/40 border-emerald-500 shadow-xl shadow-emerald-950/50'
                : 'bg-slate-900/80 border-slate-800'
            }`}>
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">OUTPUT TRUTH VALUE</span>
              <div className={`font-display text-4xl sm:text-5xl font-extrabold mt-2 ${
                computeOpOutput() ? 'text-emerald-400 text-glow-emerald' : 'text-slate-500'
              }`}>
                {computeOpOutput() ? 'TRUE (1)' : 'FALSE (0)'}
              </div>
              <span className={`text-xs font-mono mt-2 inline-block ${
                computeOpOutput() ? 'text-emerald-300 font-bold' : 'text-slate-500'
              }`}>
                {computeOpOutput() ? 'GATE OUTPUT: HIGH' : 'GATE OUTPUT: LOW'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE B: TRUTH TABLES */}
      {activeModule === 'tables' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/20 animate-in fade-in duration-300">
          <div className="mb-6 pb-4 border-b border-slate-800">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">MODULE B</span>
            <h3 className="font-display font-extrabold text-2xl text-white">
              TRUTH TABLE EXHAUSTIVE ENUMERATION
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Comparing primary medical alert functions: Conjunction (E = A ∧ B), Disjunction (W = A ∨ B), and Exclusive OR.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#020510]">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-300">
                  <th className="py-3 px-4">Row #</th>
                  <th className="py-3 px-4 text-cyan-400">A (O₂ &lt; 90)</th>
                  <th className="py-3 px-4 text-cyan-400">B (HR Abnormal)</th>
                  <th className="py-3 px-4 text-rose-400 font-bold">AND: A ∧ B (Code Red)</th>
                  <th className="py-3 px-4 text-amber-400 font-bold">OR: A ∨ B (Warning)</th>
                  <th className="py-3 px-4 text-teal-400 font-bold">XOR: A ⊕ B (Single Anomaly)</th>
                  <th className="py-3 px-4 text-slate-400">Clinical Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {[
                  { r: 1, a: 0, b: 0, and: 0, or: 0, xor: 0, desc: 'Homeostasis. Zero alerts activated.' },
                  { r: 2, a: 0, b: 1, and: 0, or: 1, xor: 1, desc: 'Isolated Cardiac Warning. Code red suppressed.' },
                  { r: 3, a: 1, b: 0, and: 0, or: 1, xor: 1, desc: 'Isolated Hypoxia Warning. Code red suppressed.' },
                  { r: 4, a: 1, b: 1, and: 1, or: 1, xor: 0, desc: 'CRITICAL COMBINED EMERGENCY. Dual sensor crisis.' },
                ].map((row) => (
                  <tr key={row.r} className={row.and ? 'bg-rose-950/20 font-bold' : 'hover:bg-slate-900/30'}>
                    <td className="py-3 px-4 text-slate-400">Row {row.r}</td>
                    <td className="py-3 px-4 text-white font-bold">{row.a}</td>
                    <td className="py-3 px-4 text-white font-bold">{row.b}</td>
                    <td className={`py-3 px-4 font-bold ${row.and ? 'text-rose-400 text-glow-coral' : 'text-slate-500'}`}>
                      {row.and}
                    </td>
                    <td className={`py-3 px-4 font-bold ${row.or ? 'text-amber-400' : 'text-slate-500'}`}>
                      {row.or}
                    </td>
                    <td className={`py-3 px-4 font-bold ${row.xor ? 'text-teal-400' : 'text-slate-500'}`}>
                      {row.xor}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-sans text-xs">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE C: DE MORGAN'S LAWS & EQUIVALENCE */}
      {activeModule === 'demorgan' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/20 animate-in fade-in duration-300">
          <div className="mb-6 pb-4 border-b border-slate-800">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">MODULE C</span>
            <h3 className="font-display font-extrabold text-2xl text-white">
              LOGICAL EQUIVALENCE & DE MORGAN'S LAWS
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Demonstrating formal proof: ¬(A ∧ B) ≡ (¬A ∨ ¬B). In healthcare: "Emergency suppressed if and only if at least one vital is safe."
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs font-mono text-slate-300">Test Live Input Values:</span>
              <button
                onClick={() => {
                  soundEngine.playGateClick();
                  setDmA(!dmA);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  dmA ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                A: {dmA ? '1 (TRUE)' : '0 (FALSE)'}
              </button>
              <button
                onClick={() => {
                  soundEngine.playGateClick();
                  setDmB(!dmB);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                  dmB ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                B: {dmB ? '1 (TRUE)' : '0 (FALSE)'}
              </button>
            </div>
          </div>

          {/* Interactive Formula Proof Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Expression 1 */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-cyan-500/30">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">LEFT EXPRESSION (LHS)</span>
              <div className="font-display text-xl font-bold text-white mt-1">
                ¬(A ∧ B)
              </div>
              <p className="text-xs text-slate-400 mt-1">Negation of Conjunction</p>
              <div className="mt-4 p-3 rounded-lg bg-slate-950 font-mono text-xs flex justify-between items-center">
                <span>With current A={dmA ? '1' : '0'}, B={dmB ? '1' : '0'}:</span>
                <span className="text-cyan-300 font-bold text-sm">
                  ¬({dmA ? '1' : '0'} ∧ {dmB ? '1' : '0'}) = {!(dmA && dmB) ? '1 (TRUE)' : '0 (FALSE)'}
                </span>
              </div>
            </div>

            {/* Expression 2 */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-teal-500/30">
              <span className="text-[10px] font-mono text-teal-400 uppercase font-bold">RIGHT EXPRESSION (RHS)</span>
              <div className="font-display text-xl font-bold text-white mt-1">
                (¬A ∨ ¬B)
              </div>
              <p className="text-xs text-slate-400 mt-1">Disjunction of Negations</p>
              <div className="mt-4 p-3 rounded-lg bg-slate-950 font-mono text-xs flex justify-between items-center">
                <span>With current A={dmA ? '1' : '0'}, B={dmB ? '1' : '0'}:</span>
                <span className="text-teal-300 font-bold text-sm">
                  ({!dmA ? '1' : '0'} ∨ {!dmB ? '1' : '0'}) = {(!dmA || !dmB) ? '1 (TRUE)' : '0 (FALSE)'}
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Equivalence Truth Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#020510]">
            <table className="w-full text-center font-mono text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                  <th className="py-2.5 px-3">A</th>
                  <th className="py-2.5 px-3">B</th>
                  <th className="py-2.5 px-3 text-cyan-300">A ∧ B</th>
                  <th className="py-2.5 px-3 bg-cyan-950/40 text-cyan-400 font-bold">¬(A ∧ B)</th>
                  <th className="py-2.5 px-3 text-slate-400">¬A</th>
                  <th className="py-2.5 px-3 text-slate-400">¬B</th>
                  <th className="py-2.5 px-3 bg-teal-950/40 text-teal-300 font-bold">¬A ∨ ¬B</th>
                  <th className="py-2.5 px-3 text-emerald-400 font-bold">EQUIVALENCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { a: 0, b: 0, and: 0, notAnd: 1, notA: 1, notB: 1, orNot: 1 },
                  { a: 0, b: 1, and: 0, notAnd: 1, notA: 1, notB: 0, orNot: 1 },
                  { a: 1, b: 0, and: 0, notAnd: 1, notA: 0, notB: 1, orNot: 1 },
                  { a: 1, b: 1, and: 1, notAnd: 0, notA: 0, notB: 0, orNot: 0 },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-bold text-white">{row.a}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{row.b}</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.and}</td>
                    <td className="py-2.5 px-3 bg-cyan-950/30 text-cyan-300 font-extrabold text-sm">{row.notAnd}</td>
                    <td className="py-2.5 px-3 text-slate-500">{row.notA}</td>
                    <td className="py-2.5 px-3 text-slate-500">{row.notB}</td>
                    <td className="py-2.5 px-3 bg-teal-950/30 text-teal-300 font-extrabold text-sm">{row.orNot}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> IDENTICAL
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE D: SATISFIABILITY (SAT) */}
      {activeModule === 'sat' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/20 animate-in fade-in duration-300">
          <div className="mb-6 pb-4 border-b border-slate-800">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">MODULE D</span>
            <h3 className="font-display font-extrabold text-2xl text-white">
              SATISFIABILITY, TAUTOLOGY & CONTRADICTION
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              In safety-critical discrete software, a proposition is SATISFIABLE if at least one truth assignment evaluates to 1.
              Distinguishing Tautology (always 1) from Contingent expressions.
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
                badgeColor: 'border-cyan-500 text-cyan-300 bg-cyan-950/30',
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
                clinical: 'Impossible condition: A patient cannot simultaneously have SpO2 < 90% and NOT SpO2 < 90%.',
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
                    ? 'border-cyan-400 bg-slate-900 shadow-xl shadow-cyan-950/40'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${f.badgeColor}`}>
                  {f.type}
                </span>
                <div className="font-display font-extrabold text-lg text-white mt-2">
                  {f.formula}
                </div>
                <div className="text-xs font-mono text-cyan-300 mt-1 font-semibold">{f.eval}</div>
                <p className="text-xs text-slate-400 mt-3 font-sans leading-relaxed">
                  {f.clinical}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE E: PREDICATES & QUANTIFIERS */}
      {activeModule === 'quantifiers' && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/20 animate-in fade-in duration-300">
          <div className="mb-6 pb-4 border-b border-slate-800">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">MODULE E</span>
            <h3 className="font-display font-extrabold text-2xl text-white">
              PREDICATES & FIRST-ORDER QUANTIFIERS (∀, ∃)
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              In a hospital ward with multiple beds, let Universe of Discourse U = &#123;Bed 1, Bed 2, Bed 3, Bed 4&#125;.
              Predicate P(x) = "Patient x has critical telemetry readings".
            </p>
          </div>

          {/* Live Quantifier Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {/* Universal Quantifier Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              allStable
                ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/40'
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
              <div className="text-xs font-mono text-cyan-300 mt-1">
                "All patients in the ward are stable and safe."
              </div>
              <p className="text-xs text-slate-400 mt-2 font-sans">
                {allStable
                  ? 'Condition satisfied: Every single patient bed is currently non-critical.'
                  : 'Falsified: At least one patient bed has triggered a critical telemetry state.'}
              </p>
            </div>

            {/* Existential Quantifier Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              someCritical
                ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/40'
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
                  ? 'Verified: Emergency medical team dispatch triggered to critical bed.'
                  : 'Zero emergencies currently present across the entire ward.'}
              </p>
            </div>
          </div>

          {/* Interactive Multi-Bed Ward Grid */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 mb-2 flex justify-between items-center">
              <span>WARD BED STATIONS (Click any patient bed to toggle P(x) status):</span>
              <span className="text-cyan-400 font-bold">4 MONITORED PATIENTS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {beds.map((bed) => (
                <div
                  key={bed.id}
                  onClick={() => toggleBed(bed.id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    bed.isCritical
                      ? 'bg-rose-950/30 border-rose-500/60 shadow-md shadow-rose-950/40'
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
