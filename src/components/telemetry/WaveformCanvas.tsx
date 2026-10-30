import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audio';

interface WaveformCanvasProps {
  type: 'ecg' | 'pleth' | 'abp' | 'resp';
  bpm: number;
  oxygen: number;
  color?: string;
  glowColor?: string;
  label?: string;
  sublabel?: string;
  height?: number;
  isFault?: boolean;
  soundEnabled?: boolean;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  type,
  bpm,
  oxygen,
  color = '#00f2fe',
  glowColor = 'rgba(0, 242, 254, 0.4)',
  label = 'LEAD II',
  sublabel = '1 mV/cm  25 mm/s',
  height = 96,
  isFault = false,
  soundEnabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const sweepXRef = useRef<number>(0);
  const pointsRef = useRef<number[]>([]);
  const lastBeatTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Initialize points buffer
    const bufferLength = Math.ceil(width);
    if (pointsRef.current.length !== bufferLength) {
      pointsRef.current = new Array(bufferLength).fill(height / 2);
    }

    const sweepSpeed = 2.2; // pixels per frame

    const render = (timestamp: number) => {
      // Calculate beat period in frames (assuming 60fps)
      // BPM beats per minute => beats per sec = BPM / 60 => seconds per beat = 60 / BPM
      const safeBpm = Math.max(30, Math.min(220, bpm));
      const beatIntervalMs = (60 / safeBpm) * 1000;

      // Check if a beat should trigger sound for ECG
      if (type === 'ecg' && !isFault && soundEnabled) {
        if (timestamp - lastBeatTimeRef.current >= beatIntervalMs) {
          lastBeatTimeRef.current = timestamp;
          soundEngine.playHeartbeat(safeBpm, oxygen);
        }
      }

      const midY = height / 2;
      const currentX = Math.floor(sweepXRef.current);

      // Generate signal value based on waveform type
      let val = midY;

      if (isFault) {
        // Flatline with small telemetry noise
        val = midY + (Math.random() - 0.5) * 2;
      } else {
        // Phase within current heart beat (0 to 1)
        const timeInBeat = (timestamp % beatIntervalMs) / beatIntervalMs;

        if (type === 'ecg') {
          // Precise Lead II ECG model
          if (timeInBeat < 0.12) {
            // Isoelectric pre-P
            val = midY;
          } else if (timeInBeat < 0.20) {
            // P Wave (atrial depolarization)
            const pPhase = (timeInBeat - 0.12) / 0.08;
            val = midY - Math.sin(pPhase * Math.PI) * 7;
          } else if (timeInBeat < 0.28) {
            // PR segment
            val = midY;
          } else if (timeInBeat < 0.30) {
            // Q wave (downward deflection)
            const qPhase = (timeInBeat - 0.28) / 0.02;
            val = midY + Math.sin(qPhase * Math.PI) * 4;
          } else if (timeInBeat < 0.35) {
            // R wave (sharp ventricular spike)
            const rPhase = (timeInBeat - 0.30) / 0.05;
            if (rPhase < 0.5) {
              val = midY - (rPhase / 0.5) * (height * 0.42);
            } else {
              val = midY - (1 - (rPhase - 0.5) / 0.5) * (height * 0.42);
            }
          } else if (timeInBeat < 0.39) {
            // S wave (downward deflection)
            const sPhase = (timeInBeat - 0.35) / 0.04;
            val = midY + Math.sin(sPhase * Math.PI) * 11;
          } else if (timeInBeat < 0.48) {
            // ST segment
            val = midY;
          } else if (timeInBeat < 0.65) {
            // T wave (ventricular repolarization)
            const tPhase = (timeInBeat - 0.48) / 0.17;
            val = midY - Math.sin(tPhase * Math.PI) * 12;
          } else {
            // Isoelectric baseline
            val = midY;
          }
          // Add subtle micro-jitter for organic realism
          val += (Math.random() - 0.5) * 0.6;
        } else if (type === 'pleth') {
          // Photoplethysmogram (PPG) pulse wave with dicrotic notch
          if (timeInBeat < 0.3) {
            // Systolic upstroke
            const p = timeInBeat / 0.3;
            val = midY + height * 0.32 - Math.sin(p * (Math.PI / 2)) * height * 0.62;
          } else if (timeInBeat < 0.48) {
            // Dicrotic notch valley
            const p = (timeInBeat - 0.3) / 0.18;
            val = midY - height * 0.3 + p * height * 0.2;
          } else if (timeInBeat < 0.6) {
            // Secondary dicrotic wave peak
            const p = (timeInBeat - 0.48) / 0.12;
            val = midY - height * 0.1 - Math.sin(p * Math.PI) * 5;
          } else {
            // Diastolic runoff
            const p = (timeInBeat - 0.6) / 0.4;
            val = midY - height * 0.1 + p * (height * 0.42);
          }
          val += (Math.random() - 0.5) * 0.4;
        } else if (type === 'abp') {
          // Arterial blood pressure waveform
          if (timeInBeat < 0.25) {
            const p = timeInBeat / 0.25;
            val = midY + height * 0.3 - Math.sin(p * (Math.PI / 2)) * height * 0.6;
          } else if (timeInBeat < 0.45) {
            const p = (timeInBeat - 0.25) / 0.2;
            val = midY - height * 0.3 + p * height * 0.25;
          } else if (timeInBeat < 0.55) {
            const p = (timeInBeat - 0.45) / 0.1;
            val = midY - height * 0.05 - Math.sin(p * Math.PI) * 6;
          } else {
            const p = (timeInBeat - 0.55) / 0.45;
            val = midY - height * 0.05 + p * height * 0.35;
          }
        } else if (type === 'resp') {
          // Capnography CO2 waveform (square respiratory curve)
          const respPeriodMs = (60 / 16) * 1000;
          const respPhase = (timestamp % respPeriodMs) / respPeriodMs;
          if (respPhase < 0.4) {
            // Expiratory plateau (high CO2)
            val = midY - height * 0.32 + Math.sin(respPhase * 10) * 1.5;
          } else if (respPhase < 0.48) {
            // Inspiratory downstroke
            const p = (respPhase - 0.4) / 0.08;
            val = midY - height * 0.32 + p * height * 0.64;
          } else if (respPhase < 0.9) {
            // Inspiratory baseline (0 CO2)
            val = midY + height * 0.32;
          } else {
            // Expiratory upstroke
            const p = (respPhase - 0.9) / 0.1;
            val = midY + height * 0.32 - p * height * 0.64;
          }
        }
      }

      // Store in points buffer
      for (let i = 0; i < Math.ceil(sweepSpeed); i++) {
        const targetIdx = (currentX + i) % bufferLength;
        pointsRef.current[targetIdx] = val;
      }

      // Advance sweep cursor
      sweepXRef.current = (sweepXRef.current + sweepSpeed) % bufferLength;

      // Redraw canvas
      ctx.clearRect(0, 0, width, height);

      // Draw faint medical background grid
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw the waveform trace with CRT sweep erase gap
      const cursorX = Math.floor(sweepXRef.current);
      const eraseGap = 28; // gap ahead of sweep cursor

      ctx.save();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Segment 1: from cursor + eraseGap to end of buffer
      const startSeg1 = (cursorX + eraseGap) % bufferLength;
      if (startSeg1 < bufferLength) {
        ctx.beginPath();
        let drawing = false;
        for (let x = startSeg1; x < bufferLength; x++) {
          const y = pointsRef.current[x] ?? midY;
          if (!drawing) {
            ctx.moveTo(x, y);
            drawing = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Segment 2: from 0 up to cursor
      if (cursorX > 0) {
        ctx.beginPath();
        let drawing = false;
        for (let x = 0; x < cursorX; x++) {
          const y = pointsRef.current[x] ?? midY;
          if (!drawing) {
            ctx.moveTo(x, y);
            drawing = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw glowing leading blip at cursor
      const blipY = pointsRef.current[cursorX] ?? midY;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(cursorX, blipY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas) return;
      const newRect = canvas.getBoundingClientRect();
      const newDpr = window.devicePixelRatio || 1;
      canvas.width = newRect.width * newDpr;
      canvas.height = height * newDpr;
      ctx.scale(newDpr, newDpr);
      const newLength = Math.ceil(newRect.width);
      const oldArr = pointsRef.current;
      pointsRef.current = new Array(newLength).fill(height / 2);
      for (let i = 0; i < Math.min(oldArr.length, newLength); i++) {
        pointsRef.current[i] = oldArr[i];
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [type, bpm, oxygen, color, glowColor, height, isFault, soundEnabled]);

  return (
    <div className="relative w-full rounded-md bg-[#040914]/80 border border-slate-800/80 p-2 overflow-hidden">
      {/* Telemetry Header */}
      <div className="flex items-center justify-between mb-1 text-[11px] font-mono tracking-wider">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: isFault ? '#f59e0b' : color }}
          />
          <span className="font-semibold uppercase" style={{ color: isFault ? '#f59e0b' : color }}>
            {label}
          </span>
          <span className="text-slate-500 hidden sm:inline">{sublabel}</span>
        </div>
        <div className="text-slate-400 font-mono text-[10px]">
          {isFault ? (
            <span className="text-amber-400 font-bold animate-pulse">LEAD OFF / IMPEDANCE FAULT</span>
          ) : (
            <span>LIVE SYNC • 250 Hz</span>
          )}
        </div>
      </div>

      {/* HTML5 Canvas */}
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ height: `${height}px` }}
        />
        {/* Subtle Scanline Texture */}
        <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-40" />
      </div>
    </div>
  );
};
