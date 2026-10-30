# ICU GUARD — The Science of Every Second
> **Every Signal Matters. Every Decision Counts.**
> 
> *An Interactive Medical Patient-Monitoring Simulation Powered by Formal Discrete Mathematics (Unit 2: Logic & Propositions).*

[![Live Website](https://img.shields.io/badge/Live_Website-ICU_GUARD-2563eb?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ogdaddy981.github.io/icu-guard/)
[![GitHub Repository](https://img.shields.io/badge/GitHub_Repo-OgDaDDy981%2Ficu--guard-0b0f19?style=for-the-badge&logo=github)](https://github.com/OgDaDDy981/icu-guard)
[![Discrete Mathematics](https://img.shields.io/badge/Academic-Discrete_Mathematics_Unit_2-10b981?style=for-the-badge&logo=academia)](https://ogdaddy981.github.io/icu-guard/#math-laboratory)

🌐 **Live Demo URL:** [https://ogdaddy981.github.io/icu-guard/](https://ogdaddy981.github.io/icu-guard/)

---

## 🎯 Executive Overview

**ICU GUARD** is a sophisticated patient-monitoring and emergency alert simulation engineered to demonstrate how **Discrete Mathematics—specifically Boolean Logic, Propositional Calculus, and First-Order Predicate Quantifiers**—governs safety-critical medical technology.

In modern intensive care units, between **85% and 99% of hospital telemetry alarms are false alarms** caused by motion artifacts, sensor displacement, or isolated transient spikes. This phenomenon—known as **Alarm Fatigue**—desensitizes healthcare workers and endangers lives. 

**ICU GUARD** demonstrates how formal discrete logic resolves this problem by:
1. Transforming continuous physiological telemetry into deterministic Boolean propositions.
2. Formulating multi-sensor conjunction rules ($E = A \land B$) that correlate independent physiological indicators before triggering life-critical alerts.
3. Modeling sensor failures through three-valued logic ($S_{\text{Fault}}$) rather than treating missing data as false normalcy.
4. Enabling formal verification through dynamic truth tables, De Morgan’s laws of logical equivalence, and satisfiability proofs.

---

## 🔬 Core Mathematical Architecture (Unit 2: Propositional Logic)

### 1. Relational Predicates to Atomic Propositions
Physical vitals are mapped into truth values $\mathbb{B} \in \{0, 1\}$:
- **Proposition $A$ (Hypoxia)**: $P(\text{SpO}_2) \iff \text{SpO}_2 < 90\%$
- **Proposition $B$ (Cardiac Arrhythmia)**: $Q(\text{HR}) \iff (\text{HR} < 50 \lor \text{HR} > 120)$
- **Proposition $C$ (Hyperpyrexia)**: $R(\text{Temp}) \iff \text{Temp} > 39.0^\circ\text{C}$
- **Proposition $S_{\text{Fault}}$ (Sensor Hardware Fault)**: $\text{LeadDisconnected} \lor (\text{SignalQuality} < 40\%)$

### 2. Compound Alert Expressions
- **Combined Emergency Alert (Conjunction)**:
  $$E = A \land B$$
  *(Evaluates to TRUE if and only if both respiratory and cardiac systems fail simultaneously).*
- **General Telemetry Warning (Disjunction)**:
  $$W = A \lor B \lor C$$
- **Safety Invariant Protocol**:
  $$F = \neg(A \land B)$$

### 3. De Morgan's Laws of Logical Equivalence
$$\neg(A \land B) \equiv (\neg A \lor \neg B)$$
$$\neg(A \lor B) \equiv (\neg A \land \neg B)$$
**Clinical Interpretation**: The code red emergency is suppressed if and only if *at least one* vital parameter remains secure and non-critical.

### 4. First-Order Predicates & Quantifiers across ICU Wards
Given a universe of discourse $U = \{\text{Bed}_1, \dots, \text{Bed}_6\}$ and critical predicate $P(x)$:
- **Universal Quantifier**: $\forall x \in \text{Ward}, \, \neg P(x)$ (*"All patients in the ward are stable."*)
- **Existential Quantifier**: $\exists x \in \text{Ward}, \, P(x)$ (*"There exists at least one patient requiring emergency intervention."*)
- **Duality / Counter-Example**: $\neg(\forall x \, \neg P(x)) \equiv \exists x \, P(x)$.

---

## ⚡ Key Product Features

1. **Complete Visual & Motion Redesign**:
   - Sophisticated deep graphite (`#070b14`), obsidian, and warm ivory/platinum color palette.
   - Elimination of tacky glowing neon borders and generic glassmorphism in favor of authentic medical telemetry instrument aesthetics.
   - Smooth 60 FPS HTML5 canvas oscilloscope sweeps and real-time animation loops.

2. **Independent Sensor Architecture**:
   - 5 Independent hardware channels:
     1. 3-Lead ECG (Lead II)
     2. Optical Pulse Oximeter (SpO₂)
     3. Radial Arterial Line (NIBP / ABP)
     4. Core Thermistor Probe (Temp)
     5. Transthoracic Cannula (Resp / Capnography)
   - Decoupled fault isolation: Disconnecting an ECG lead triggers a technical alert ($S_{\text{Fault}}$) and displays flatline noise on channel 1, while SpO₂, BP, and Resp continue operating undisturbed.

3. **Deterministic Time-Interpolated Simulation Engine**:
   - 6 Repeatable clinical scenarios:
     1. **Normal Monitoring**: Baseline homeostasis with physiological sinus rhythm.
     2. **Low Oxygen (Hypoxia)**: SpO₂ desaturates below 90% ($A=1, B=0, E=0$).
     3. **Abnormal Heart Rate**: Tachycardia spike to 148 BPM ($A=0, B=1, E=0$).
     4. **Combined Emergency**: Progressive dual-collapse with second-by-second interpolation ($A=1, B=1 \implies E=1$).
     5. **Sensor Failure**: Lead II disconnect with impedance fault interlock.
     6. **Recovery**: Post-intervention stabilization and automatic alarm clearance.
   - Complete timeline controls: Play, Pause, Time Scrubber (0.0s to 15.0s), Keyframe Stepping, and 1x/2x Speed selectors.

4. **Simulated Alarm Management & Event Audit Log**:
   - Prioritized alerts: Critical Code Red, Physiological Warnings, Technical Sensor Faults, Advisory events.
   - Event timestamps, "Acknowledge All" action, and condition-based automatic alarm resolution.
   - Clearly labeled as an educational simulation.

5. **Real-Time Digital Logic Engine**:
   - Silicon PCB breadboard with animated electron pulse propagation.
   - ANSI/IEEE gate symbols: AND, OR, NOT, and NAND gates.
   - Dynamic 4-row Truth Table highlighting the active valuation row in real time.
   - Manual testing override toggle.

6. **Cinematic 6-Act Mathematical Theater ("Reveal the Math Behind")**:
   - Connects live patient telemetry to formal step-by-step deduction:
     - **Act 1: Sensor Acquisition** ($x < 90 \implies A \in \mathbb{B}$)
     - **Act 2: Cardiac Bounds** ($(y < 50) \lor (y > 120) \implies B \in \mathbb{B}$)
     - **Act 3: Conjunction Operator** ($E = A \land B$)
     - **Act 4: Dynamic Truth Table** (Live active row illumination)
     - **Act 5: Deductive Conclusion** ($\text{TRUE} \land \text{TRUE} \equiv \text{TRUE} \implies \text{Relay = HIGH}$)
     - **Act 6: Engineering Determinism** (Safety invariants in biomedical computing)

7. **The Mathematics Laboratory**:
   - 5 Visual exploration modules:
     1. Propositional Connectives ($\land, \lor, \neg, \oplus, \uparrow, \downarrow, \to, \leftrightarrow$)
     2. Truth Table Laboratory
     3. De Morgan's Laws Dual-Circuit Equivalence Verifier
     4. Satisfiability (SAT), Tautology, and Contradiction Analyzer
     5. Ward Predicates & Quantifiers with interactive 6-bed ward simulation and counter-example detection.

8. **Product Demonstration Mode**:
   - Executive product demonstration deck showcasing system capabilities, telemetry channels, mathematical logic, and scenario progressions.
   - Integrated action triggers to execute scenarios directly from slides.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide Icons
- **Graphics**: HTML5 Canvas (high-DPI, 500 Hz telemetry sync, CRT sweep simulation)
- **Audio**: Web Audio API Synthesizer (sine/triangle oscillator modulation, zero audio file dependencies)
- **Build Tool**: Vite 8

---

## 🚀 Running the Project Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build and preview production distribution
npm run build
npm run preview
```

The application will be accessible at `http://localhost:5173/`.

---

## 📜 Educational Simulation Notice

This project is an educational engineering simulation designed strictly for academic demonstration of Discrete Mathematics, Boolean logic, and propositional invariants in biomedical computing. All biometric measurements, waveforms, and thresholds are simulated illustrative models and are NOT intended for clinical medical diagnosis, triage, or patient care.
