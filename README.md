# ICU GUARD — The Science of Every Second
> **Every Signal Matters. Every Decision Counts.**
> 
> *An Interactive ICU Patient-Monitoring Simulation Powered by Formal Discrete Mathematics (Unit 2: Logic & Propositions).*

[![Live Website](https://img.shields.io/badge/Live_Website-ICU_GUARD-d96347?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ogdaddy981.github.io/icu-guard/)
[![GitHub Repository](https://img.shields.io/badge/GitHub_Repo-OgDaDDy981%2Ficu--guard-181a22?style=for-the-badge&logo=github)](https://github.com/OgDaDDy981/icu-guard)
[![Discrete Mathematics](https://img.shields.io/badge/Academic-Discrete_Mathematics_Unit_2-5da283?style=for-the-badge&logo=academia)](https://ogdaddy981.github.io/icu-guard/)

🌐 **Live Website:** [https://ogdaddy981.github.io/icu-guard/](https://ogdaddy981.github.io/icu-guard/)

---

## 🎯 Executive Overview

**ICU GUARD** is a sophisticated patient-monitoring simulation engineered to demonstrate how **Discrete Mathematics—specifically Boolean Logic, Propositional Calculus, and First-Order Predicate Quantifiers**—governs safety-critical medical technology.

In modern intensive care units, between **85% and 99% of hospital telemetry alarms are false alarms** caused by patient movement, sensor artifacts, or isolated transient spikes. This phenomenon—known as **Alarm Fatigue**—desensitizes healthcare workers and endangers lives. 

**ICU GUARD** visually demonstrates how formal discrete logic resolves this problem by:
1. Transforming continuous physiological readings into deterministic Boolean propositions.
2. Formulating multi-sensor conjunction rules ($E = A \land B$) that correlate independent physiological indicators before triggering life-critical alerts.
3. Modeling sensor failures through three-valued logic ($S_{\text{Fault}}$) rather than treating missing data as false normalcy.
4. Enabling formal verification through dynamic truth tables, De Morgan’s laws of logical equivalence, and satisfiability proofs.

---

## 🎨 Design Philosophy & UX Transformation

1. **Warm, Sophisticated Medical Palette**:
   - Deep charcoal and warm graphite surfaces (`#111215`, `#171920`, `#1a1c24`).
   - Warm ivory typography and high-contrast labels (`#faf6f0`, `#c5beaf`).
   - Terracotta and burnt orange for critical alert emphasis (`#d96347`, `#e26d5c`).
   - Muted sage and soft mint for normal physiological homeostasis (`#5da283`, `#70b896`).
   - Warm amber for warnings and advisory telemetry (`#e5933a`).
   - Elimination of generic dark-cyan dashboards, neon borders, and repetitive glass cards.

2. **Human-Readable Clinical Communication**:
   - Replaced dense medical jargon with clear, direct states: *"Patient is stable"*, *"Oxygen level is falling"*, *"Abnormal heart rate"*, *"Warning detected"*, *"Multiple conditions detected"*, *"Emergency alert activated"*.

3. **Streamlined User Journey**:
   - **Home**: Editorial hero introducing the alarm fatigue problem and discrete logic solution.
   - **Live Monitor**: Continuous multi-channel waveforms (ECG, SpO₂, Blood Pressure, Respiration) with lead-fault detection.
   - **Scenarios**: Three primary choices: *Everything is Normal*, *Something is Going Wrong*, and *Emergency Situation*.
   - **Alarms**: Condition-based event log with timestamps and status tracking.
   - **Solve the Math**: Dedicated, isolated interactive mathematics laboratory.
   - **Presenter Mode**: 7-scene scripted, cinematic automated product walkthrough.

---

## 🎬 Automated Presenter Mode (Cinematic Product Tour)

Rather than an academic slide deck with bullet points, **Presenter Mode** is an automated, scripted 60–90 second interactive walkthrough of the actual product:

- **Scene 1 — Welcome & System Purpose**: The alarm fatigue crisis and why logic matters.
- **Scene 2 — Normal Homeostasis**: Continuous physiological sweeps with baseline sinus rhythm and stable oxygen.
- **Scene 3 — Isolated Vital Shift**: Oxygen level drops below 90%; Proposition $A$ evaluates to True ($A=1$), but alarm interlock remains suppressed ($E=0$) to prevent false alarms.
- **Scene 4 — Discrete Logic Core**: Visual demonstration of relational inequalities converted to Boolean switches.
- **Scene 5 — Combined Emergency**: Both oxygen and heart rate deteriorate simultaneously ($A=1, B=1 \implies E=1$), energizing the emergency alert relay.
- **Scene 6 — Clinical Stabilization**: Telemetry recovers to safe thresholds; latching alarms safely resolve.
- **Scene 7 — Further Exploration**: Inviting visitors to test custom scenarios or enter the dedicated **Solve the Math** experience.

*Features*: Auto-play timeline with scrubber, scene quick-jump pills, play/pause controls, mute audio toggle, and automatic restoration of the visitor's original simulation state on exit.

---

## 🔬 Core Mathematical Architecture (Unit 2: Propositional Logic)

### 1. Relational Predicates to Atomic Propositions
Physical vitals are mapped into truth values $\mathbb{B} \in \{0, 1\}$:
- **Proposition $A$ (Low Oxygen / Hypoxia)**: $P(\text{SpO}_2) \iff \text{SpO}_2 < 90\%$
- **Proposition $B$ (Abnormal Heart Rate / Arrhythmia)**: $Q(\text{HR}) \iff (\text{HR} < 50 \lor \text{HR} > 120)$
- **Proposition $C$ (High Body Temperature)**: $R(\text{Temp}) \iff \text{Temp} > 39.0^\circ\text{C}$
- **Proposition $S_{\text{Fault}}$ (Hardware Disconnect)**: $\text{LeadDisconnected} \lor (\text{SignalQuality} < 40\%)$

### 2. Compound Alert Expressions
- **Combined Emergency Alert (Conjunction)**:
  $$E = A \land B$$
  *(Evaluates to TRUE if and only if both respiratory and cardiac systems fail simultaneously).*
- **General Warning (Disjunction)**:
  $$W = A \lor B \lor C$$
- **Safety Invariant Protocol**:
  $$F = \neg(A \land B)$$

### 3. De Morgan's Laws of Logical Equivalence
$$\neg(A \land B) \equiv (\neg A \lor \neg B)$$
$$\neg(A \lor B) \equiv (\neg A \land \neg B)$$
**Clinical Interpretation**: The critical code red emergency is suppressed if and only if *at least one* vital parameter remains secure and non-critical.

### 4. First-Order Predicates & Quantifiers across ICU Wards
Given a universe of discourse $U = \{\text{Bed}_1, \dots, \text{Bed}_6\}$ and critical predicate $P(x)$:
- **Universal Quantifier**: $\forall x \in \text{Ward}, \, \neg P(x)$ (*"All patients in the ward are stable."*)
- **Existential Quantifier**: $\exists x \in \text{Ward}, \, P(x)$ (*"There exists at least one patient requiring emergency intervention."*)
- **Duality / Counter-Example**: $\neg(\forall x \, \neg P(x)) \equiv \exists x \, P(x)$.

---

## 🧮 Dedicated "Solve the Math" Laboratory

All formal discrete mathematics is consolidated inside one dedicated, modal-isolated simulation experience:

1. **Step 1 — Understand the Inputs**: Live pulse oximeter and ECG readings compared against calibrated clinical thresholds.
2. **Step 2 — Convert to Propositions**: Step-by-step animated conversion of continuous physiological numbers into discrete Boolean variables ($0$ or $1$).
3. **Step 3 — Process the Logic Circuit**: Interactive schematic showing electrical pulse propagation into an animated AND gate.
4. **Step 4 — Exhaustive Truth Table**: 4-row truth table dynamically highlighting the active row corresponding to the patient's current telemetry.
5. **Step 5 — Independent Sandbox**: Manual override switches to freely experiment with all 4 combinatorial truth states ($00, 01, 10, 11$) in an isolated sandbox without altering the live patient monitor.
6. **Step 6 — Extended Discrete Mathematics Lab**:
   - **Connectives Lab**: Interactive truth table evaluations for $\land, \lor, \neg, \oplus, \uparrow, \downarrow, \to, \leftrightarrow$.
   - **De Morgan Dual Circuits**: Side-by-side equivalent circuit verifier.
   - **SAT & Tautology Analyzer**: Formal safety invariant proofs ($[A \land B] \to E$).
   - **6-Bed Ward Predicate Quantifiers**: Interactive multi-bed ward testing $\forall x$ and $\exists x$ with instant duality calculations.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (Warm Medical Design System tokens)
- **Icons**: Lucide Icons
- **Oscilloscope Waveforms**: High-DPI HTML5 Canvas (500 Hz sweep rendering)
- **Audio Synthesis**: Web Audio API Sound Synthesizer (harmonic heart blips, alert chime chords, gate clicks)
- **Build Tool**: Vite 8

---

## 🚀 Running the Project Locally

```bash
# Clone the repository
git clone https://github.com/OgDaDDy981/icu-guard.git
cd icu-guard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm run preview
```

The application will be accessible at `http://localhost:5173/`.

---

## 📜 Educational Simulation Notice

This project is an educational engineering simulation designed strictly for academic demonstration of Discrete Mathematics, Boolean logic, and propositional invariants in biomedical computing. All biometric measurements, waveforms, and thresholds are simulated illustrative models and are NOT intended for clinical medical diagnosis, triage, or patient care.
