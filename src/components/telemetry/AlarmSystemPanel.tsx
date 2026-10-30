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
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 animate-pulse">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            WARNING
          </span>
        );
      case 'TECHNICAL':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 flex items-center gap-1">
            <Radio className="w-3 h-3 text-yellow-400" />
            TECHNICAL
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
            <Info className="w-3 h-3 text-blue-400" />
            ADVISORY
          </span>
        );
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#0b0f19] border border-slate-800 p-5 shadow-xl transition-all">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            criticalCount > 0
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
              : warningCount > 0
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
              : 'bg-slate-800 border-slate-700 text-slate-300'
          }`}>
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-white tracking-wide">
                ALARM MANAGEMENT & EVENT AUDIT
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {activeAlarms.length} ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Simulated condition-based alarms with deterministic propositional triggers
            </p>
          </div>
        </div>

        {/* Global Alarm Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeAlarms.length > 0 && (
            <button
              onClick={() => {
                soundEngine.playAcknowledgeBeep();
                onAcknowledgeAll();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
            >
              <BellOff className="w-3.5 h-3.5 text-amber-400" />
              <span>ACKNOWLEDGE ALL</span>
            </button>
          )}

          {alarms.some((a) => a.resolved) && (
            <button
              onClick={onClearResolved}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1"
              title="Clear resolved events from history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CLEAR RESOLVED</span>
            </button>
          )}
        </div>
      </div>

      {/* Alarm Category Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE TOTAL</span>
          <div className="font-display text-xl font-bold text-white mt-0.5">
            {activeAlarms.length}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border text-center transition-all ${
          criticalCount > 0 ? 'bg-rose-950/30 border-rose-500/50 text-rose-300' : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}>
          <span className="text-[10px] font-mono uppercase">CRITICAL CODE RED</span>
          <div className={`font-display text-xl font-bold mt-0.5 ${criticalCount > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
            {criticalCount}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border text-center transition-all ${
          warningCount > 0 ? 'bg-amber-950/30 border-amber-500/50 text-amber-300' : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}>
          <span className="text-[10px] font-mono uppercase">PHYSIOLOGICAL WARNINGS</span>
          <div className={`font-display text-xl font-bold mt-0.5 ${warningCount > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
            {warningCount}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border text-center transition-all ${
          technicalCount > 0 ? 'bg-yellow-950/30 border-yellow-500/50 text-yellow-300' : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}>
          <span className="text-[10px] font-mono uppercase">TECHNICAL SENSOR FAULTS</span>
          <div className={`font-display text-xl font-bold mt-0.5 ${technicalCount > 0 ? 'text-yellow-400' : 'text-slate-500'}`}>
            {technicalCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mb-3 border-b border-slate-800 pb-2">
        {(['ALL', 'ACTIVE', 'CRITICAL', 'TECHNICAL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
              filter === tab
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alarm Events List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {filteredAlarms.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-slate-500 border border-dashed border-slate-800 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5 opacity-60" />
            <span>NO ALARM EVENTS IN THIS VIEW • SYSTEM STEADY</span>
          </div>
        ) : (
          filteredAlarms.map((alarm) => {
            const isResolved = alarm.resolved;
            const isAck = alarm.acknowledged;

            return (
              <div
                key={alarm.id}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isResolved
                    ? 'bg-slate-900/30 border-slate-800/60 opacity-60'
                    : alarm.severity === 'CRITICAL'
                    ? 'bg-rose-950/25 border-rose-500/50 shadow-md shadow-rose-950/30'
                    : alarm.severity === 'WARNING'
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-yellow-950/20 border-yellow-500/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5 shrink-0">
                    {getSeverityBadge(alarm.severity)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-white">
                        {alarm.title}
                      </span>
                      {alarm.propositionTriggered && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-blue-300 border border-slate-700">
                          {alarm.propositionTriggered}
                        </span>
                      )}
                      {isResolved && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> RESOLVED {alarm.resolvedAt && `(${alarm.resolvedAt})`}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-slate-300 mt-0.5">
                      {alarm.condition} • Channel: <strong className="text-slate-200">{alarm.parameter}</strong>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Event Logged at {alarm.timestamp}</span>
                      {isAck && !isResolved && (
                        <span className="text-amber-400/90 font-semibold">• Acknowledged (Ongoing Condition)</span>
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
                    className="self-end sm:self-center px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono font-semibold border border-slate-700 flex items-center gap-1 shrink-0"
                  >
                    <Check className="w-3 h-3" />
                    <span>ACKNOWLEDGE</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Safety Notice Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span>Note: Acknowledging an alarm silences advisory cues but preserves active logical emergency state until physiological criteria are resolved.</span>
        <span className="hidden sm:inline">EDUCATIONAL DEMO</span>
      </div>
    </div>
  );
};
