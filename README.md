# ICU GUARD — The Science of Every Second
> **Every Signal Matters. Every Decision Counts.**
> 
> *A Computer Engineering Discrete Mathematics (Unit 2: Logic & Propositions) Interactive Simulation System.*

[![Live Website](https://img.shields.io/badge/Live_Website-ICU_GUARD-00f2fe?style=for-the-badge&logo=google-chrome&logoColor=black)](https://ogdaddy981.github.io/icu-guard/)
[![GitHub Repository](https://img.shields.io/badge/GitHub_Repo-OgDaDDy981%2Ficu--guard-030712?style=for-the-badge&logo=github)](https://github.com/OgDaDDy981/icu-guard)
[![Discrete Mathematics](https://img.shields.io/badge/Academic-Unit_2_Propositional_Logic-00d2be?style=for-the-badge&logo=academia)](https://ogdaddy981.github.io/icu-guard/#math-laboratory)

🌐 **Live Demo URL:** [https://ogdaddy981.github.io/icu-guard/](https://ogdaddy981.github.io/icu-guard/)

---

## 🎯 Executive Overview

**ICU GUARD** is a futuristic patient-monitoring and emergency alert simulation engineered to demonstrate how **Discrete Mathematics—specifically Boolean Logic, Propositional Calculus, and First-Order Predicate Quantifiers**—governs safety-critical medical technology.

In modern intensive care units, between **85% and 99% of hospital telemetry alarms are false alarms** caused by motion artifacts, sensor displacement, or isolated transient spikes. This phenomenon—known as **Alarm Fatigue**—desensitizes healthcare workers and endangers lives. 

**ICU GUARD** proves how mathematical logic resolves this crisis by:
1. Transforming noisy, continuous analog biometrics into deterministic Boolean propositions.
2. Formulating multi-sensor conjunction rules ($E = A \land B$) that correlate independent physiological indicators.
3. Modeling sensor failures through three-valued logic rather than treating missing data as false normalcy.
4. Enabling formal verification through truth tables, De Morgan’s laws of logical equivalence, and satisfiability proofs.

---

## 🔬 Core Mathematical Architecture (Unit 2: Discrete Mathematics)

### 1. Relational Predicates to Atomic Propositions
Physical vitals are mapped into truth values $\mathbb{B} \in \{0, 1\}$:
- **Proposition $A$ (Hypoxia)**: $P(\text{SpO}_2) \iff \text{SpO}_2 < 90\%$
- **Proposition $B$ (Cardiac Arrhythmia)**: $Q(\text{HR}) \iff (\text{HR} < 50 \lor \text{HR} > 120)$
- **Proposition $C$ (Pyrexia)**: $R(\text{Temp}) \iff \text{Temp} > 39.0^\circ\text{C}$
- **Proposition $S_{\text{Fault}}$ (Impedance Fault)**: $\text{LeadDisconnected} \lor (\text{SignalQuality} < 40\%)$

### 2. Compound Alert Expressions
- **Combined Emergency Alert (Conjunction)**:
  $$E = A \land B$$
  *(Evaluates to TRUE if and only if both respiratory and cardiac systems fail simultaneously).*
- **General Telemetry Warning (Disjunction)**:
  $$W = A \lor B \lor C$$
- **Safety Invariant Protocol**:
  $$F = \neg(A \land B)$$

### 3. De Morgan's Law of Logical Equivalence
$$\neg(A \land B) \equiv (\neg A \lor \neg B)$$
**Clinical Interpretation**: The code red emergency is suppressed if and only if *at least one* vital parameter remains secure and non-critical.

### 4. First-Order Logic in Hospital Wards
Given a universe of discourse $U = \{\text{Bed}_1, \text{Bed}_2, \text{Bed}_3, \text{Bed}_4\}$ and critical predicate $P(x)$:
- **Universal Quantifier**: $\forall x \in \text{Ward}, \, \neg P(x)$ (*"All patients are stable."*)
- **Existential Quantifier**: $\exists x \in \text{Ward}, \, P(x)$ (*"At least one patient requires emergency intervention."*)
- **Duality / Negation**: $\neg(\forall x \, \neg P(x)) \equiv \exists x \, P(x)$.

---

## ⚡ Key Features

1. **The Opening Cinematic Experience**:
   - Dark midnight navy & electric cyan aesthetic.
   - Canvas-rendered Lead II ECG stream with CRT phosphor sweep.
   - One-click entry into the interactive simulation.

2. **The Live Patient Monitoring Center**:
   - 5 Real-Time Parameters:
     1. Heart Rate (BPM) + Lead II P-Q-R-S-T wave model.
     2. Oxygen Saturation (SpO₂ %) + Photoplethysmograph (PPG) wave.
     3. Core Temperature (°C / °F).
     4. Arterial Blood Pressure (ABP mmHg) + dicrotic notch curve.
     5. Respiratory Rate (RPM) + Capnography CO₂ wave.
   - Interactive manual sliders drawer for custom real-time parameter tweaking.
   - Non-clinical illustrative threshold disclosure.

3. **The Real-Time Logic Engine**:
   - Interactive 4-stage pipeline: **SENSOR READING → PROPOSITION MAPPING → GATE EVALUATION → OUTPUT**.
   - ANSI/IEEE SVG schematics for AND, OR, and NOT gates with glowing electron particle propagation.
   - Dynamic 4-row Truth Table highlighting the active evaluation row in real time.
   - Manual override toggle for classroom viva demonstration.

4. **The Emergency Simulation Suite (6 Scenarios)**:
   - Scenario 1: **Normal Homeostasis** ($A=0, B=0, E=0$).
   - Scenario 2: **Low Oxygen Hypoxia** ($A=1, B=0, E=0$, amber warning).
   - Scenario 3: **Abnormal Heart Rate** ($A=0, B=1, E=0$, arrhythmia warning).
   - Scenario 4: **Combined Emergency** ($A=1, B=1, E=1$, Code Red alarm strobe).
   - Scenario 5: **Sensor Failure** (Impedance disconnect; fault interlock).
   - Scenario 6: **Recovery** ($A \to 0, B \to 0$, return to stable baseline).

5. **The Signature Feature: "Reveal the Math Behind"**:
   - Automated 6-Act Cinematic Mathematical Theater:
     - **Act 1: The Sensor** ($85 < 90 \implies A = \text{TRUE}$)
     - **Act 2: The Second Condition** ($150 > 120 \implies B = \text{TRUE}$)
     - **Act 3: The Boolean Expression** ($E = A \land B$)
     - **Act 4: The Truth Table** (Row 4 $[1, 1] \to 1$ highlighted)
     - **Act 5: The Mathematical Conclusion** ($\text{TRUE} \land \text{TRUE} \equiv \text{TRUE}$)
     - **Act 6: Academic Viva Synthesis** (Engineering determinism & safety)
   - Features scrubber, pause/play, step forward/backward, speed multiplier (1x, 1.5x, 2x), and keyboard controls.

6. **The Discrete Mathematics Laboratory**:
   - Module A: Propositional Connectives (AND, OR, NOT, XOR, NAND, NOR).
   - Module B: Truth Table Synthesizer.
   - Module C: De Morgan’s Laws side-by-side equivalence matrix.
   - Module D: Satisfiability (SAT), Tautology, and Contradiction.
   - Module E: Predicates & Quantifiers with an interactive 4-bed ward simulator.

7. **Faculty Presentation Mode**:
   - 9-step structured milestone walkthrough designed specifically for viva defense.
   - Comprehensive student talking points for every milestone.
   - Direct scenario triggers and slide transitions.

8. **IEC 60601-1-8 Web Audio Synthesizer**:
   - Authentic patient monitor QRS beeps with pitch modulation based on SpO₂.
   - Gentle double-tone warnings and high-priority 3-tone code red sirens.
   - Master mute control to respect classroom environments.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript (strict mode, verbatimModuleSyntax)
- **Styling**: Tailwind CSS v4 + Custom HUD Glassmorphism
- **Icons**: Lucide Icons
- **Graphics**: HTML5 Canvas (high-DPI, 250 Hz continuous sweep, zero CPU lag)
- **Audio**: Web Audio API (zero external audio file dependencies)
- **Build Tool**: Vite 8 (600ms sub-second production bundle)

---

## 🚀 Running the Project Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Or build and preview production distribution
npm run build
npm run preview
```

The application will be accessible at `http://localhost:5173/`.
