import React, { useState } from 'react';
import type { SystemStatus } from '../../types';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  Presentation, 
  Zap, 
  Menu, 
  X,
  AlertTriangle,
  Radio,
  Bell
} from 'lucide-react';

interface NavbarProps {
  systemStatus: SystemStatus;
  activeAlarmCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenPresentation: () => void;
  onRevealMath: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  systemStatus,
  activeAlarmCount,
  soundEnabled,
  onToggleSound,
  onOpenPresentation,
  onRevealMath,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const getStatusBadge = () => {
    switch (systemStatus) {
      case 'CRITICAL_EMERGENCY':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40 text-[11px] font-mono font-extrabold animate-beacon">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>CODE RED • CONJUNCTION SATISFIED</span>
          </div>
        );
      case 'WARNING':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>ADVISORY WARNING</span>
          </div>
        );
      case 'SENSOR_FAULT':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/40 text-[11px] font-mono font-bold">
            <Radio className="w-3.5 h-3.5 text-yellow-400" />
            <span>LEAD DISCONNECTED</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[11px] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            <span>NORMAL HOMEOSTASIS</span>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#050811]/85 border-b border-white/8 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Group */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 p-[1px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#050811] rounded-[11px] flex items-center justify-center text-blue-400">
                <Activity className="w-5 h-5 text-blue-400 group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="font-display font-black text-base sm:text-lg tracking-wider text-white flex items-center gap-2">
                <span>ICU GUARD</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30 uppercase tracking-widest font-bold">
                  SIMULATION
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 tracking-wider">
                DISCRETE MATHEMATICS & TELEMETRY
              </div>
            </div>
          </a>

          {/* System Status Pill */}
          <div className="hidden sm:block ml-2">
            {getStatusBadge()}
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-6 font-mono text-xs text-slate-300">
          <a 
            href="#patient-monitor" 
            className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-blue-400"
          >
            PATIENT MONITOR
          </a>
          <a 
            href="#logic-engine" 
            className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-blue-400"
          >
            SAFETY RELAY
          </a>
          <a 
            href="#scenarios" 
            className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-blue-400"
          >
            SIMULATION SUITE
          </a>
          <a 
            href="#alarms" 
            className="hover:text-white transition-colors py-1 flex items-center gap-1.5 hover:border-b-2 hover:border-blue-400"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>ALARMS</span>
            {activeAlarmCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {activeAlarmCount}
              </span>
            )}
          </a>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Audio Synthesizer Mute / Unmute Button */}
          <button
            onClick={onToggleSound}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-md shadow-blue-500/20'
                : 'bg-slate-900/60 border-white/8 text-slate-400 hover:text-white hover:border-white/20'
            }`}
            title={soundEnabled ? 'Telemetry Audio Active (Click to Mute)' : 'Telemetry Audio Muted (Click to Enable)'}
          >
            {soundEnabled ? (
              <div className="flex items-center gap-1">
                <Volume2 className="w-4 h-4 text-blue-400" />
                <span className="flex gap-0.5 items-end h-3 w-3">
                  <span className="w-0.5 bg-blue-400 h-2 animate-pulse" />
                  <span className="w-0.5 bg-blue-400 h-3 animate-pulse delay-75" />
                  <span className="w-0.5 bg-blue-400 h-1.5 animate-pulse delay-150" />
                </span>
              </div>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Presentation Mode Button */}
          <button
            onClick={onOpenPresentation}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-200 hover:border-white/20 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <Presentation className="w-3.5 h-3.5 text-indigo-400" />
            <span>PRODUCT DEMO</span>
          </button>

          {/* Signature Feature Button: SOLVE THE MATH */}
          <button
            onClick={onRevealMath}
            className="relative group overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white font-mono text-xs font-extrabold tracking-wider uppercase flex items-center gap-2 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Zap className="w-3.5 h-3.5 fill-white group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">SOLVE THE MATH</span>
            <span className="sm:hidden">MATH</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-5 pt-3 pb-6 bg-[#050811]/98 border-b border-white/10 space-y-3 font-mono text-xs animate-in slide-in-from-top-3">
          <div className="pb-3 border-b border-white/8 sm:hidden">
            {getStatusBadge()}
          </div>
          <a
            href="#patient-monitor"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            PATIENT MONITOR
          </a>
          <a
            href="#logic-engine"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            SAFETY RELAY
          </a>
          <a
            href="#scenarios"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            SIMULATION SUITE
          </a>
          <a
            href="#alarms"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white flex items-center justify-between"
          >
            <span>ALARM MANAGEMENT & EVENT AUDIT</span>
            {activeAlarmCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px]">
                {activeAlarmCount} ACTIVE
              </span>
            )}
          </a>
          <div className="pt-2 border-t border-white/8 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPresentation();
              }}
              className="w-full text-left py-2 text-indigo-400 font-bold flex items-center gap-2 cursor-pointer"
            >
              <Presentation className="w-4 h-4" /> PRODUCT DEMONSTRATION MODE
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRevealMath();
              }}
              className="w-full text-left py-2 text-blue-400 font-bold flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-blue-400" /> SOLVE THE MATH EXPERIENCE
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
