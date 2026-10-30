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
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
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
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[11px] font-mono font-extrabold animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>CODE RED: E = A ∧ B</span>
          </div>
        );
      case 'WARNING':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[11px] font-mono font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>WARNING ACTIVE</span>
          </div>
        );
      case 'SENSOR_FAULT':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 text-[11px] font-mono font-bold">
            <Radio className="w-3.5 h-3.5 text-yellow-400" />
            <span>TELEMETRY FAULT</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>HOMEOSTASIS</span>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070b14]/90 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="font-display font-extrabold text-base tracking-wider text-white flex items-center gap-1.5">
                <span>ICU GUARD</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-blue-300 border border-slate-700">
                  DISCRETE.MATH
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 tracking-wider">
                PATIENT MONITORING SIMULATION
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
          <a href="#patient-monitor" className="hover:text-blue-300 transition-colors py-1">
            PATIENT MONITOR
          </a>
          <a href="#logic-engine" className="hover:text-blue-300 transition-colors py-1">
            SAFETY RELAY
          </a>
          <a href="#scenarios" className="hover:text-blue-300 transition-colors py-1">
            SCENARIOS
          </a>
          <a href="#alarms" className="hover:text-blue-300 transition-colors py-1 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>ALARMS</span>
            {activeAlarmCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeAlarmCount}
              </span>
            )}
          </a>
          <button
            onClick={onRevealMath}
            className="text-blue-400 hover:text-blue-300 font-bold transition-colors py-1 flex items-center gap-1 cursor-pointer"
          >
            <Zap className="w-3 h-3 fill-blue-400" />
            <span>SOLVE THE MATH</span>
          </button>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {/* Audio Mute / Unmute Button */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Telemetry Audio Active (Click to Mute)' : 'Telemetry Audio Muted (Click to Enable)'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Presentation Mode Button */}
          <button
            onClick={onOpenPresentation}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:border-slate-600 hover:text-white font-mono text-xs font-bold transition-all cursor-pointer"
          >
            <Presentation className="w-3.5 h-3.5 text-indigo-400" />
            <span>PRODUCT DEMO</span>
          </button>

          {/* Signature Feature Button */}
          <button
            onClick={onRevealMath}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span className="hidden md:inline">SOLVE THE MATH</span>
            <span className="md:hidden">SOLVE MATH</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-[#070b14]/98 border-b border-slate-800 space-y-3 font-mono text-xs animate-in slide-in-from-top-2">
          <div className="pb-2 border-b border-slate-800 sm:hidden">
            {getStatusBadge()}
          </div>
          <a
            href="#patient-monitor"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-blue-300"
          >
            PATIENT MONITOR
          </a>
          <a
            href="#logic-engine"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-blue-300"
          >
            SAFETY RELAY
          </a>
          <a
            href="#scenarios"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-blue-300"
          >
            SCENARIOS
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onRevealMath();
            }}
            className="w-full text-left py-2 text-blue-400 font-bold flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-blue-400" />
            <span>SOLVE THE MATH (LABORATORY)</span>
          </button>
          <a
            href="#alarms"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-blue-300 flex items-center gap-2"
          >
            <span>ALARM MANAGEMENT & EVENT AUDIT</span>
            {activeAlarmCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold text-[10px]">
                {activeAlarmCount}
              </span>
            )}
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPresentation();
            }}
            className="w-full text-left py-2 text-indigo-400 font-bold flex items-center gap-2"
          >
            <Presentation className="w-4 h-4" /> PRODUCT DEMONSTRATION MODE
          </button>
        </div>
      )}
    </header>
  );
};
