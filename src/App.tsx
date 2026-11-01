import { useState, useEffect, useCallback } from 'react';
import type { 
  VitalsState, 
  SensorChannelsState, 
  SensorChannelId, 
  AlarmEvent 
} from './types';
import { DEFAULT_VITALS, DEFAULT_SENSORS } from './utils/constants';
import { evaluatePropositions, determineSystemStatus } from './utils/logic';
import { soundEngine } from './utils/audio';

import { Navbar } from './components/common/Navbar';
import { OpeningExperience } from './components/hero/OpeningExperience';
import { PatientMonitor } from './components/telemetry/PatientMonitor';
import { AlarmSystemPanel } from './components/telemetry/AlarmSystemPanel';
import { LogicEngine } from './components/logic/LogicEngine';
import { ScenarioPlayer } from './components/scenarios/ScenarioPlayer';
import { SolveTheMathModal } from './components/math/SolveTheMathModal';
import { PresentationMode } from './components/presentation/PresentationMode';
import { Footer } from './components/common/Footer';

import { AlertOctagon, RotateCcw, Zap, BellOff } from 'lucide-react';

export function App() {
  const [vitals, setVitals] = useState<VitalsState>(DEFAULT_VITALS);
  const [sensors, setSensors] = useState<SensorChannelsState>(DEFAULT_SENSORS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isMathTheaterOpen, setIsMathTheaterOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);

  // Alarms State
  const [alarms, setAlarms] = useState<AlarmEvent[]>([
    {
      id: 'alarm_init',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      relativeSec: 0,
      severity: 'ADVISORY',
      parameter: 'SYSTEM',
      title: 'TELEMETRY CALIBRATION ONLINE',
      condition: 'All 5 sensor channels initialized to homeostasis baseline',
      propositionTriggered: 'E = 0, W = 0',
      acknowledged: true,
      resolved: true,
      resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    },
  ]);

  // Compute live logic propositions and overall system state
  const propositions = evaluatePropositions(vitals, sensors);
  const systemStatus = determineSystemStatus(vitals, propositions);

  // Synchronize audio engine mute state
  useEffect(() => {
    soundEngine.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Automatic condition-based alarm resolution
  useEffect(() => {
    setAlarms((prev) =>
      prev.map((alarm) => {
        if (alarm.resolved) return alarm;

        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        // If Critical Conjunction resolved
        if (alarm.severity === 'CRITICAL' && !propositions.E_Combined) {
          return { ...alarm, resolved: true, resolvedAt: nowTime };
        }
        // If Hypoxia warning resolved
        if (alarm.parameter === 'SpO₂' && !propositions.A) {
          return { ...alarm, resolved: true, resolvedAt: nowTime };
        }
        // If Tachycardia warning resolved
        if (alarm.parameter === 'ECG / HR' && !propositions.B) {
          return { ...alarm, resolved: true, resolvedAt: nowTime };
        }
        // If Technical lead-off fault resolved
        if (alarm.severity === 'TECHNICAL' && !propositions.S_Fault) {
          return { ...alarm, resolved: true, resolvedAt: nowTime };
        }

        return alarm;
      })
    );
  }, [propositions.E_Combined, propositions.A, propositions.B, propositions.S_Fault]);

  // Emit an alarm from scenarios or manual triggers
  const handleEmitAlarm = useCallback(
    (alarmData: Omit<AlarmEvent, 'id' | 'timestamp' | 'relativeSec' | 'acknowledged' | 'resolved'>) => {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newAlarm: AlarmEvent = {
        ...alarmData,
        id: `alarm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: nowTime,
        relativeSec: Math.floor(Date.now() / 1000),
        acknowledged: false,
        resolved: false,
      };

      setAlarms((prev) => {
        // Prevent duplicate spam of same unacknowledged active alarm
        const exists = prev.find(
          (a) => !a.resolved && a.title === newAlarm.title && a.parameter === newAlarm.parameter
        );
        if (exists) return prev;
        return [newAlarm, ...prev];
      });
    },
    []
  );

  // Toggle individual sensor channel
  const handleToggleSensor = (channelId: SensorChannelId) => {
    setSensors((prev) => {
      const current = prev[channelId];
      const nextAttached = !current.leadAttached;
      const nextSensors = {
        ...prev,
        [channelId]: {
          ...current,
          leadAttached: nextAttached,
          signalQuality: nextAttached ? 98 : 0,
          impedanceKOhms: nextAttached ? 2.1 : 99.9,
        },
      };

      // Also sync vitals aggregate flag for backwards compatibility
      setVitals((v) => ({
        ...v,
        sensorLeadAttached: nextSensors.ecg.leadAttached && nextSensors.spo2.leadAttached,
        sensorQuality: nextSensors.ecg.leadAttached ? 98 : 12,
        heartRate: channelId === 'ecg' && !nextAttached ? 0 : v.heartRate,
      }));

      if (!nextAttached) {
        handleEmitAlarm({
          severity: 'TECHNICAL',
          parameter: current.name,
          title: `${current.label} DISCONNECTED`,
          condition: 'Lead impedance exceeded 50 kΩ threshold (Open Circuit)',
          propositionTriggered: 'S_Fault = 1',
        });
        soundEngine.playTechnicalAlert();
      }

      return nextSensors;
    });
  };

  // Handle Scenario trigger
  const handleApplyVitals = (
    targetVitals: Partial<VitalsState>,
    targetSensors?: Partial<SensorChannelsState>
  ) => {
    setVitals((prev) => ({
      ...prev,
      ...targetVitals,
    }));

    if (targetSensors) {
      setSensors((prev) => ({
        ...prev,
        ...targetSensors,
      }));
    }
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
    setSensors(DEFAULT_SENSORS);
    setAlarms((prev) =>
      prev.map((a) => ({
        ...a,
        resolved: true,
        resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }))
    );
  };

  const handleAcknowledgeAllAlarms = () => {
    setAlarms((prev) =>
      prev.map((a) => (a.resolved ? a : { ...a, acknowledged: true }))
    );
  };

  const handleAcknowledgeAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleClearResolvedAlarms = () => {
    setAlarms((prev) => prev.filter((a) => !a.resolved));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeAlarmsCount = alarms.filter((a) => !a.resolved).length;

  return (
    <div className="relative min-h-screen bg-[#111215] text-[#faf6f0] flex flex-col selection:bg-[#d96347]/30 selection:text-[#faf6f0]">
      {/* Top Emergency Strobe Banner when Critical Emergency is active */}
      {systemStatus === 'CRITICAL_EMERGENCY' && (
        <aside
          role="alert"
          aria-live="assertive"
          className="sticky top-0 z-50 w-full py-2.5 px-4 bg-gradient-to-r from-[#8b2b1a] via-[#d96347] to-[#8b2b1a] text-white font-mono text-xs font-bold flex items-center justify-between gap-4 border-b border-[#d96347] shadow-2xl animate-pulse"
        >
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertOctagon className="w-4 h-4 animate-bounce shrink-0 text-white" />
            <span className="tracking-wider">
              CRITICAL EMERGENCY ALERT: BOTH CONDITIONS DETECTED (OXYGEN LOW & HEART RATE ABNORMAL) • CODE RED ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAcknowledgeAllAlarms}
              className="px-3 py-1 rounded-lg bg-black/50 hover:bg-black/70 border border-white/30 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BellOff className="w-3.5 h-3.5" />
              ACKNOWLEDGE
            </button>

            <button
              onClick={() => setIsMathTheaterOpen(true)}
              className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 border border-white/40 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              SOLVE THE MATH
            </button>

            <button
              onClick={handleResetHomeostasis}
              className="px-3 py-1 rounded-lg bg-[#faf6f0] text-[#111215] text-[11px] font-extrabold flex items-center gap-1 hover:bg-white transition-all cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RESET TO NORMAL
            </button>
          </div>
        </aside>
      )}

      {/* Navigation Bar */}
      <Navbar
        systemStatus={systemStatus}
        activeAlarmCount={activeAlarmsCount}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onRevealMath={() => setIsMathTheaterOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Section 1: Opening Experience */}
        <OpeningExperience
          vitals={vitals}
          onEnterSimulation={() => scrollToSection('patient-monitor')}
          onOpenPresentation={() => setIsPresentationOpen(true)}
          onRevealMath={() => setIsMathTheaterOpen(true)}
        />

        {/* Section 2: Patient Monitoring Experience & Sensors */}
        <PatientMonitor
          vitals={vitals}
          setVitals={setVitals}
          sensors={sensors}
          onToggleSensor={handleToggleSensor}
          propositions={propositions}
          systemStatus={systemStatus}
          soundEnabled={soundEnabled}
          onRevealMath={() => setIsMathTheaterOpen(true)}
        />

        {/* Section 3: Simulated Alarm Management Panel */}
        <section id="alarms" className="w-full py-8 px-4 max-w-7xl mx-auto scroll-mt-20">
          <AlarmSystemPanel
            alarms={alarms}
            onAcknowledgeAll={handleAcknowledgeAllAlarms}
            onClearResolved={handleClearResolvedAlarms}
            onAcknowledgeAlarm={handleAcknowledgeAlarm}
          />
        </section>

        {/* Section 4: The Logic Engine */}
        <LogicEngine
          vitals={vitals}
          propositions={propositions}
          systemStatus={systemStatus}
          onRevealMath={() => setIsMathTheaterOpen(true)}
        />

        {/* Section 5: The Emergency Simulation Suite */}
        <ScenarioPlayer
          onApplyVitals={handleApplyVitals}
          onEmitAlarm={handleEmitAlarm}
          currentVitals={vitals}
          systemStatus={systemStatus}
          onRevealMath={() => setIsMathTheaterOpen(true)}
        />
      </main>

      {/* SOLVE THE MATH: Dedicated Full-Featured Simulation Laboratory */}
      <SolveTheMathModal
        isOpen={isMathTheaterOpen}
        onClose={() => setIsMathTheaterOpen(false)}
        vitals={vitals}
        propositions={propositions}
        sensors={sensors}
      />

      {/* Product Demonstration Mode Modal */}
      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        onOpenMathTheater={() => {
          setIsPresentationOpen(false);
          setIsMathTheaterOpen(true);
        }}
        onNavigateSection={(id) => {
          scrollToSection(id);
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
