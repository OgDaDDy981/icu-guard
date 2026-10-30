import { useState, useEffect } from 'react';
import type { VitalsState, ScenarioDefinition } from './types';
import { DEFAULT_VITALS, PRESET_SCENARIOS } from './utils/constants';
import { evaluatePropositions, determineSystemStatus } from './utils/logic';
import { soundEngine } from './utils/audio';

import { Navbar } from './components/common/Navbar';
import { OpeningExperience } from './components/hero/OpeningExperience';
import { PatientMonitor } from './components/telemetry/PatientMonitor';
import { LogicEngine } from './components/logic/LogicEngine';
import { ScenarioPlayer } from './components/scenarios/ScenarioPlayer';
import { MathLaboratory } from './components/lab/MathLaboratory';
import { RevealMathModal } from './components/math/RevealMathModal';
import { PresentationMode } from './components/presentation/PresentationMode';
import { Footer } from './components/common/Footer';

import { AlertOctagon, RotateCcw, Zap } from 'lucide-react';

export function App() {
  const [vitals, setVitals] = useState<VitalsState>(DEFAULT_VITALS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isMathTheaterOpen, setIsMathTheaterOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);

  // Compute live logic propositions and overall system state
  const propositions = evaluatePropositions(vitals);
  const systemStatus = determineSystemStatus(vitals, propositions);

  // Synchronize audio engine mute state
  useEffect(() => {
    soundEngine.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Handle Scenario trigger
  const handleApplyScenario = (scenario: ScenarioDefinition) => {
    setVitals((prev) => ({
      ...prev,
      ...scenario.targetVitals,
      sensorLeadAttached: scenario.targetSensorFault !== true,
      sensorQuality: scenario.targetSensorFault ? 12 : scenario.targetVitals.sensorQuality ?? prev.sensorQuality,
    }));
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setMuted(!next);
    if (next) {
      soundEngine.playGateClick();
    }
  };

  const handleResetHomeostasis = () => {
    soundEngine.playGateClick();
    setVitals(DEFAULT_VITALS);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Emergency Strobe Banner when Critical Emergency is active */}
      {systemStatus === 'CRITICAL_EMERGENCY' && (
        <aside
          role="alert"
          aria-live="assertive"
          className="sticky top-0 z-50 w-full py-2.5 px-4 bg-gradient-to-r from-rose-900 via-rose-600 to-rose-900 text-white font-mono text-xs font-bold flex items-center justify-between gap-4 animate-critical-alarm"
        >
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertOctagon className="w-4 h-4 animate-bounce shrink-0" />
            <span className="tracking-wider">
              CRITICAL CODE RED ALERT: CONJUNCTION SATISFIED (E = A ∧ B = TRUE) • IMMEDIATE CLINICAL INTERVENTION
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsMathTheaterOpen(true)}
              className="px-3 py-1 rounded bg-black/40 hover:bg-black/60 border border-white/30 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              REVEAL THE MATH BEHIND
            </button>

            <button
              onClick={handleResetHomeostasis}
              className="px-3 py-1 rounded bg-white text-rose-950 text-[11px] font-bold flex items-center gap-1 hover:bg-slate-200 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RESET HOMEOSTASIS
            </button>
          </div>
        </aside>
      )}

      {/* Primary Fixed Navigation Bar */}
      <Navbar
        systemStatus={systemStatus}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onRevealMath={() => setIsMathTheaterOpen(true)}
      />

      {/* Main Experience Body */}
      <main className="flex-1">
        {/* Section 3: The Opening Experience */}
        <OpeningExperience
          vitals={vitals}
          onEnterSimulation={() => scrollToSection('patient-monitor')}
          onOpenPresentation={() => setIsPresentationOpen(true)}
          onRevealMath={() => setIsMathTheaterOpen(true)}
        />

        {/* Section 4: The Live Patient Monitoring Experience */}
        <PatientMonitor
          vitals={vitals}
          setVitals={setVitals}
          propositions={propositions}
          systemStatus={systemStatus}
          soundEnabled={soundEnabled}
          onRevealMath={() => setIsMathTheaterOpen(true)}
        />

        {/* Section 5: The Logic Engine */}
        <LogicEngine
          vitals={vitals}
          propositions={propositions}
          systemStatus={systemStatus}
          onRevealMath={() => setIsMathTheaterOpen(true)}
        />

        {/* Section 6: The Emergency Simulation Suite */}
        <ScenarioPlayer
          onApplyScenario={handleApplyScenario}
          currentVitals={vitals}
          systemStatus={systemStatus}
          onRevealMath={() => setIsMathTheaterOpen(true)}
        />

        {/* Section 8: The Mathematics Laboratory */}
        <MathLaboratory />
      </main>

      {/* Section 7: The Signature Feature - Reveal the Math Behind Modal */}
      <RevealMathModal
        isOpen={isMathTheaterOpen}
        onClose={() => setIsMathTheaterOpen(false)}
      />

      {/* Section 10: Faculty Presentation Mode Modal */}
      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        onTriggerScenario={(id) => {
          const match = PRESET_SCENARIOS.find((s) => s.id === id);
          if (match) handleApplyScenario(match);
        }}
        onOpenMathTheater={() => {
          setIsPresentationOpen(false);
          setIsMathTheaterOpen(true);
        }}
      />

      {/* Footer */}
      <Footer
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onRevealMath={() => setIsMathTheaterOpen(true)}
      />
    </div>
  );
}

export default App;
