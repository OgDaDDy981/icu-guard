import React, { useState } from 'react';
import type { SystemStatus } from '../../types';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  Play, 
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
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#d96347]/20 text-[#d96347] border border-[#d96347]/50 text-[11px] font-mono font-extrabold animate-beacon">
            <span className="w-2 h-2 rounded-full bg-[#d96347] animate-ping" />
            <span>EMERGENCY ALERT ACTIVE</span>
          </div>
        );
      case 'WARNING':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5933a]/20 text-[#e5933a] border border-[#e5933a]/50 text-[11px] font-mono font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-[#e5933a]" />
            <span>WARNING DETECTED</span>
          </div>
        );
      case 'SENSOR_FAULT':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5933a]/20 text-[#e5933a] border border-[#e5933a]/40 text-[11px] font-mono font-bold">
            <Radio className="w-3.5 h-3.5 text-[#e5933a]" />
            <span>SENSOR DISCONNECTED</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#5da283]/15 text-[#5da283] border border-[#5da283]/30 text-[11px] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5da283]" />
            <span>PATIENT STABLE</span>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#111215]/85 border-b border-[#faf6f0]/8 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Brand Group */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#d96347] via-[#e5933a] to-[#5da283] p-[1px] shadow-lg shadow-[#d96347]/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#111215] rounded-[11px] flex items-center justify-center text-[#d96347]">
                <Activity className="w-5 h-5 text-[#d96347] group-hover:text-[#5da283] transition-colors" />
              </div>
            </div>
            <div>
              <div className="font-display font-black text-base sm:text-lg tracking-wider text-[#faf6f0] flex items-center gap-2">
                <span>ICU GUARD</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1e2027] text-[#c5beaf] border border-[#faf6f0]/10 uppercase tracking-widest font-bold">
                  SIMULATION
                </span>
              </div>
              <div className="text-[10px] font-mono text-[#c5beaf] tracking-wider">
                PATIENT MONITORING & BOOLEAN LOGIC
              </div>
            </div>
          </a>

          {/* System Status Pill */}
          <div className="hidden sm:block ml-2">
            {getStatusBadge()}
          </div>
        </div>

        {/* Simplified Desktop Navigation Journey */}
        <nav className="hidden lg:flex items-center gap-6 font-mono text-xs text-[#c5beaf]">
          <a 
            href="#" 
            className="hover:text-[#faf6f0] transition-colors py-1 hover:border-b-2 hover:border-[#d96347]"
          >
            HOME
          </a>
          <a 
            href="#patient-monitor" 
            className="hover:text-[#faf6f0] transition-colors py-1 hover:border-b-2 hover:border-[#5da283]"
          >
            LIVE MONITOR
          </a>
          <a 
            href="#scenarios" 
            className="hover:text-[#faf6f0] transition-colors py-1 hover:border-b-2 hover:border-[#e5933a]"
          >
            SCENARIOS
          </a>
          <a 
            href="#alarms" 
            className="hover:text-[#faf6f0] transition-colors py-1 flex items-center gap-1.5 hover:border-b-2 hover:border-[#d96347]"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>ALARMS</span>
            {activeAlarmCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#d96347] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {activeAlarmCount}
              </span>
            )}
          </a>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#5da283]/20 text-[#5da283] border-[#5da283]/50 shadow-md shadow-[#5da283]/20'
                : 'bg-[#181a20] border-[#faf6f0]/8 text-[#c5beaf] hover:text-[#faf6f0]'
            }`}
            title={soundEnabled ? 'Telemetry Audio Active (Click to Mute)' : 'Telemetry Audio Muted (Click to Enable)'}
          >
            {soundEnabled ? (
              <div className="flex items-center gap-1">
                <Volume2 className="w-4 h-4 text-[#5da283]" />
                <span className="flex gap-0.5 items-end h-3 w-3">
                  <span className="w-0.5 bg-[#5da283] h-2 animate-pulse" />
                  <span className="w-0.5 bg-[#5da283] h-3 animate-pulse delay-75" />
                  <span className="w-0.5 bg-[#5da283] h-1.5 animate-pulse delay-150" />
                </span>
              </div>
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* PRESENTER MODE BUTTON (Automated Tour - HIGHEST PROMINENCE) */}
          <button
            onClick={onOpenPresentation}
            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-[#1e2027] hover:bg-[#282a33] text-[#faf6f0] border border-[#faf6f0]/15 hover:border-[#faf6f0]/30 shadow-sm cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-[#d96347] text-[#d96347]" />
            <span className="hidden sm:inline">PRESENTER MODE</span>
            <span className="sm:hidden">DEMO</span>
          </button>

          {/* SOLVE THE MATH BUTTON (Dedicated Math Experience) */}
          <button
            onClick={onRevealMath}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-[#d96347] to-[#e5933a] hover:from-[#e06d53] hover:to-[#efa347] text-white shadow-lg shadow-[#d96347]/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span className="hidden md:inline">SOLVE THE MATH</span>
            <span className="md:hidden">MATH</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#181a20] border border-[#faf6f0]/10 text-[#c5beaf] hover:text-white lg:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#faf6f0]/8 bg-[#111215] px-4 py-4 space-y-3 font-mono text-sm animate-in fade-in duration-150">
          <div className="pb-2">
            {getStatusBadge()}
          </div>
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#faf6f0] hover:text-[#d96347]"
          >
            HOME
          </a>
          <a
            href="#patient-monitor"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#faf6f0] hover:text-[#5da283]"
          >
            LIVE MONITOR
          </a>
          <a
            href="#scenarios"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#faf6f0] hover:text-[#e5933a]"
          >
            SCENARIOS
          </a>
          <a
            href="#alarms"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[#faf6f0] hover:text-[#d96347]"
          >
            <span>ACTIVE ALARMS</span>
            {activeAlarmCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#d96347] text-white text-xs font-bold">
                {activeAlarmCount}
              </span>
            )}
          </a>
          <div className="pt-2 border-t border-[#faf6f0]/8 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPresentation();
              }}
              className="w-full py-2.5 rounded-xl bg-[#1e2027] text-[#faf6f0] font-bold text-xs flex items-center justify-center gap-2 border border-[#faf6f0]/10"
            >
              <Play className="w-4 h-4 fill-[#d96347] text-[#d96347]" />
              <span>WATCH PRESENTER MODE</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRevealMath();
              }}
              className="w-full py-2.5 rounded-xl bg-[#d96347] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#d96347]/20"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>OPEN SOLVE THE MATH</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
