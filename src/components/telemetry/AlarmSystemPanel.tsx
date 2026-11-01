import React, { useState } from 'react';
import type { AlarmEvent } from '../../types';
import { soundEngine } from '../../utils/audio';
import { 
  Bell, 
  BellOff, 
  AlertOctagon, 
  AlertTriangle, 
  Radio, 
  CheckCircle2, 
  Clock, 
  Check, 
  Trash2,
  Info
} from 'lucide-react';

interface AlarmSystemPanelProps {
  alarms: AlarmEvent[];
  onAcknowledgeAll: () => void;
  onClearResolved: () => void;
  onAcknowledgeAlarm: (id: string) => void;
}

export const AlarmSystemPanel: React.FC<AlarmSystemPanelProps> = ({
  alarms,
  onAcknowledgeAll,
  onClearResolved,
  onAcknowledgeAlarm,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'CRITICAL' | 'TECHNICAL'>('ALL');

  const activeAlarms = alarms.filter((a) => !a.resolved);
  const criticalCount = activeAlarms.filter((a) => a.severity === 'CRITICAL').length;
  const warningCount = activeAlarms.filter((a) => a.severity === 'WARNING').length;
  const technicalCount = activeAlarms.filter((a) => a.severity === 'TECHNICAL').length;

  const filteredAlarms = alarms.filter((a) => {
    if (filter === 'ACTIVE') return !a.resolved;
    if (filter === 'CRITICAL') return a.severity === 'CRITICAL';
    if (filter === 'TECHNICAL') return a.severity === 'TECHNICAL';
    return true;
  });

  const getSeverityBadge = (severity: AlarmEvent['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold bg-[#d96347]/20 text-[#d96347] border border-[#d96347]/50 flex items-center gap-1.5 animate-pulse shadow-sm shadow-[#d96347]/30">
            <AlertOctagon className="w-3.5 h-3.5 text-[#d96347]" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#e5933a]/20 text-[#e5933a] border border-[#e5933a]/40 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-[#e5933a]" />
            WARNING
          </span>
        );
      case 'TECHNICAL':
        return (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#e5933a]/20 text-[#e5933a] border border-[#e5933a]/40 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#e5933a]" />
            SENSOR FAULT
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#5da283]/20 text-[#5da283] border border-[#5da283]/40 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#5da283]" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#171920]/95 border border-[#faf6f0]/10 p-5 sm:p-7 shadow-2xl backdrop-blur-xl transition-all">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#faf6f0]/8">
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-2xl border transition-all ${
            criticalCount > 0
              ? 'bg-[#d96347]/20 border-[#d96347]/50 text-[#d96347] animate-beacon'
              : warningCount > 0
              ? 'bg-[#e5933a]/20 border-[#e5933a]/50 text-[#e5933a]'
              : 'bg-[#1e2027] border-[#faf6f0]/10 text-[#c5beaf]'
          }`}>
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-display font-black text-lg text-[#faf6f0] tracking-wide">
                SIMULATED ALARMS & LOGS
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1e2027] text-[#c5beaf] border border-[#faf6f0]/10">
                {activeAlarms.length} ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#c5beaf] font-mono mt-0.5">
              Alarms resolve automatically as soon as patient vital signs return to safe boundaries.
            </p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {activeAlarms.length > 0 && (
            <button
              onClick={() => {
                soundEngine.playAcknowledgeBeep();
                onAcknowledgeAll();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all bg-[#1e2027] hover:bg-[#282a33] text-[#faf6f0] border border-[#faf6f0]/15 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <BellOff className="w-3.5 h-3.5 text-[#e5933a]" />
              <span>ACKNOWLEDGE ALL</span>
            </button>
          )}

          {alarms.some((a) => a.resolved) && (
            <button
              onClick={onClearResolved}
              className="px-3 py-2 rounded-xl text-xs font-mono text-[#c5beaf] hover:text-white bg-[#1e2027] border border-[#faf6f0]/8 hover:border-[#faf6f0]/20 flex items-center gap-1.5 cursor-pointer"
              title="Clear resolved events from history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CLEAR RESOLVED</span>
            </button>
          )}
        </div>
      </div>

      {/* Alarm Category Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="p-3.5 rounded-2xl bg-[#14161c] border border-[#faf6f0]/8 text-center">
          <span className="text-[10px] font-mono text-[#c5beaf] uppercase font-bold">ACTIVE TOTAL</span>
          <div className="font-mono font-black text-2xl text-[#faf6f0] mt-0.5">
            {activeAlarms.length}
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border text-center transition-all ${
          criticalCount > 0 ? 'bg-[#d96347]/15 border-[#d96347]/60 text-[#d96347]' : 'bg-[#14161c] border-[#faf6f0]/8 text-[#c5beaf]'
        }`}>
          <span className="text-[10px] font-mono uppercase font-bold">CRITICAL CODE RED</span>
          <div className={`font-mono font-black text-2xl mt-0.5 ${criticalCount > 0 ? 'text-[#d96347] animate-pulse' : 'text-[#7a7873]'}`}>
            {criticalCount}
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border text-center transition-all ${
          warningCount > 0 ? 'bg-[#e5933a]/15 border-[#e5933a]/60 text-[#e5933a]' : 'bg-[#14161c] border-[#faf6f0]/8 text-[#c5beaf]'
        }`}>
          <span className="text-[10px] font-mono uppercase font-bold">PHYSIOLOGICAL WARNINGS</span>
          <div className={`font-mono font-black text-2xl mt-0.5 ${warningCount > 0 ? 'text-[#e5933a]' : 'text-[#7a7873]'}`}>
            {warningCount}
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border text-center transition-all ${
          technicalCount > 0 ? 'bg-[#e5933a]/15 border-[#e5933a]/60 text-[#e5933a]' : 'bg-[#14161c] border-[#faf6f0]/8 text-[#c5beaf]'
        }`}>
          <span className="text-[10px] font-mono uppercase font-bold">SENSOR FAULTS</span>
          <div className={`font-mono font-black text-2xl mt-0.5 ${technicalCount > 0 ? 'text-[#e5933a]' : 'text-[#7a7873]'}`}>
            {technicalCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-[#faf6f0]/8 pb-3">
        {(['ALL', 'ACTIVE', 'CRITICAL', 'TECHNICAL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filter === tab
                ? 'bg-[#d96347] text-white shadow-md shadow-[#d96347]/30'
                : 'text-[#c5beaf] hover:text-white bg-[#14161c] border border-[#faf6f0]/8'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alarm Events List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredAlarms.length === 0 ? (
          <div className="py-10 text-center text-xs font-mono text-[#c5beaf] border border-dashed border-[#faf6f0]/10 rounded-2xl">
            <CheckCircle2 className="w-7 h-7 text-[#5da283] mx-auto mb-2 opacity-80" />
            <span className="font-bold text-[#faf6f0]">NO ACTIVE ALARMS IN THIS VIEW • SYSTEM STABLE</span>
          </div>
        ) : (
          filteredAlarms.map((alarm) => {
            const isResolved = alarm.resolved;
            const isAck = alarm.acknowledged;

            return (
              <div
                key={alarm.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isResolved
                    ? 'bg-[#14161c]/40 border-[#faf6f0]/5 opacity-60'
                    : alarm.severity === 'CRITICAL'
                    ? 'bg-[#d96347]/15 border-[#d96347]/50 shadow-lg shadow-[#d96347]/15'
                    : alarm.severity === 'WARNING'
                    ? 'bg-[#e5933a]/15 border-[#e5933a]/40'
                    : 'bg-[#e5933a]/10 border-[#e5933a]/30'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="pt-0.5 shrink-0">
                    {getSeverityBadge(alarm.severity)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-[#faf6f0]">
                        {alarm.title}
                      </span>
                      {alarm.propositionTriggered && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e2027] text-[#c5beaf] border border-[#faf6f0]/10 font-bold">
                          {alarm.propositionTriggered}
                        </span>
                      )}
                      {isResolved && (
                        <span className="text-[10px] font-mono text-[#5da283] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> RESOLVED {alarm.resolvedAt && `(${alarm.resolvedAt})`}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-[#c5beaf] mt-1">
                      {alarm.condition} • Channel: <strong className="text-[#faf6f0]">{alarm.parameter}</strong>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#7a7873] mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Event Logged at {alarm.timestamp}</span>
                      {isAck && !isResolved && (
                        <span className="text-[#e5933a] font-bold">• Acknowledged (Ongoing Condition)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Individual Action */}
                {!isResolved && !isAck && (
                  <button
                    onClick={() => {
                      soundEngine.playAcknowledgeBeep();
                      onAcknowledgeAlarm(alarm.id);
                    }}
                    className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-[#1e2027] hover:bg-[#282a33] text-[#faf6f0] text-[11px] font-mono font-bold border border-[#faf6f0]/10 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm hover:scale-[1.02]"
                  >
                    <Check className="w-3 h-3 text-[#5da283]" />
                    <span>ACKNOWLEDGE</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Safety Notice Disclaimer */}
      <div className="mt-5 pt-4 border-t border-[#faf6f0]/8 text-[10px] font-mono text-[#c5beaf] flex items-center justify-between">
        <span>Alarms resolve automatically when underlying physiological parameters recover to safe baseline.</span>
        <span className="hidden sm:inline font-bold text-[#faf6f0]">EDUCATIONAL SIMULATION</span>
      </div>
    </div>
  );
};

export default AlarmSystemPanel;
