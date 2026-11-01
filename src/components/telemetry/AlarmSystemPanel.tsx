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
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/50 flex items-center gap-1.5 animate-pulse shadow-sm shadow-rose-500/30">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            WARNING
          </span>
        );
      case 'TECHNICAL':
        return (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-yellow-400" />
            TECHNICAL
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            ADVISORY
          </span>
        );
    }
  };

  return (
    <div className="w-full rounded-3xl bg-[#090e1a]/95 border border-white/10 p-5 sm:p-7 shadow-2xl backdrop-blur-xl transition-all">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/8">
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-2xl border transition-all ${
            criticalCount > 0
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-beacon'
              : warningCount > 0
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              : 'bg-slate-900 border-white/10 text-slate-300'
          }`}>
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-display font-black text-lg text-white tracking-wide">
                ALARM MANAGEMENT & EVENT AUDIT
              </h3>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                {activeAlarms.length} ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              IEC 60601-1-8 condition-based auto-resolution with deterministic Boolean triggers
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
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/15 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <BellOff className="w-3.5 h-3.5 text-amber-400" />
              <span>ACKNOWLEDGE ALL</span>
            </button>
          )}

          {alarms.some((a) => a.resolved) && (
            <button
              onClick={onClearResolved}
              className="px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-900/60 border border-white/8 hover:border-white/20 flex items-center gap-1.5 cursor-pointer"
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
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/8 text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">ACTIVE TOTAL</span>
          <div className="font-mono font-black text-2xl text-white mt-0.5">
            {activeAlarms.length}
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border text-center transition-all ${
          criticalCount > 0 ? 'bg-rose-950/30 border-rose-500/60 text-rose-300' : 'bg-slate-900/70 border-white/8 text-slate-400'
        }`}>
          <span className="text-[10px] font-mono uppercase font-bold">CRITICAL CODE RED</span>
          <div className={`font-mono font-black text-2xl mt-0.5 ${criticalCount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`}>
            {criticalCount}
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border text-center transition-all ${
          warningCount > 0 ? 'bg-amber-950/30 border-amber-500/60 text-amber-300' : 'bg-slate-900/70 border-white/8 text-slate-400'
        }`}>
          <span className="text-[10px] font-mono uppercase font-bold">PHYSIOLOGICAL WARNINGS</span>
          <div className={`font-mono font-black text-2xl mt-0.5 ${warningCount > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
            {warningCount}
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border text-center transition-all ${
          technicalCount > 0 ? 'bg-yellow-950/30 border-yellow-500/60 text-yellow-300' : 'bg-slate-900/70 border-white/8 text-slate-400'
        }`}>
          <span className="text-[10px] font-mono uppercase font-bold">TECHNICAL SENSOR FAULTS</span>
          <div className={`font-mono font-black text-2xl mt-0.5 ${technicalCount > 0 ? 'text-yellow-400' : 'text-slate-500'}`}>
            {technicalCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-white/8 pb-3">
        {(['ALL', 'ACTIVE', 'CRITICAL', 'TECHNICAL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              filter === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-white/8'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alarm Events List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredAlarms.length === 0 ? (
          <div className="py-10 text-center text-xs font-mono text-slate-500 border border-dashed border-white/10 rounded-2xl">
            <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-2 opacity-70" />
            <span className="font-bold text-slate-400">NO ACTIVE ALARMS IN THIS VIEW • SYSTEM HOMEOSTASIS PRESERVED</span>
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
                    ? 'bg-slate-900/30 border-white/5 opacity-60'
                    : alarm.severity === 'CRITICAL'
                    ? 'bg-rose-950/25 border-rose-500/50 shadow-lg shadow-rose-950/40'
                    : alarm.severity === 'WARNING'
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-yellow-950/20 border-yellow-500/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="pt-0.5 shrink-0">
                    {getSeverityBadge(alarm.severity)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-white">
                        {alarm.title}
                      </span>
                      {alarm.propositionTriggered && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                          {alarm.propositionTriggered}
                        </span>
                      )}
                      {isResolved && (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> RESOLVED {alarm.resolvedAt && `(${alarm.resolvedAt})`}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-slate-300 mt-1">
                      {alarm.condition} • Channel: <strong className="text-white">{alarm.parameter}</strong>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Event Logged at {alarm.timestamp}</span>
                      {isAck && !isResolved && (
                        <span className="text-amber-400 font-bold">• Acknowledged (Ongoing Condition)</span>
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
                    className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-mono font-bold border border-white/10 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm hover:scale-[1.02]"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>ACKNOWLEDGE</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Safety Notice Disclaimer */}
      <div className="mt-5 pt-4 border-t border-white/8 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span>Condition-based alarms resolve automatically when underlying physiological parameters recover to safe baseline.</span>
        <span className="hidden sm:inline font-bold text-slate-400">EDUCATIONAL AUDIT ENGINE</span>
      </div>
    </div>
  );
};

export default AlarmSystemPanel;
