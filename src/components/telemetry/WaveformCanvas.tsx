import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../../utils/audio';

interface WaveformCanvasProps {
  type: 'ecg' | 'pleth' | 'abp' | 'resp';
  bpm: number;
  oxygen: number;
  respiratoryRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  color?: string;
  glowColor?: string;
  label?: string;
  sublabel?: string;
  height?: number;
  isFault?: boolean;
  signalQuality?: number;
  soundEnabled?: boolean;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  type,
  bpm,
  oxygen,
  respiratoryRate = 16,
  bloodPressureSystolic = 118,
  bloodPressureDiastolic = 78,
  color = '#38bdf8',
  glowColor = 'rgba(56, 189, 248, 0.35)',
  label = 'LEAD II',
  sublabel = '1 mV/cm • 25 mm/s',
  height = 96,
  isFault = false,
  signalQuality = 98,
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

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const bufferLength = Math.ceil(width);
    if (pointsRef.current.length !== bufferLength) {
      pointsRef.current = new Array(bufferLength).fill(height / 2);
    }

    const sweepSpeed = 2.4; // pixels per frame

    const render = (timestamp: number) => {
      const safeBpm = Math.max(30, Math.min(220, bpm || 75));
      const beatIntervalMs = (60 / safeBpm) * 1000;

      // Handle sound for ECG channel
      if (type === 'ecg' && !isFault && signalQuality >= 40 && soundEnabled) {
        if (timestamp - lastBeatTimeRef.current >= beatIntervalMs) {
          lastBeatTimeRef.current = timestamp;
          soundEngine.playHeartbeat(safeBpm, oxygen);
        }
      }

      const midY = height / 2;
      const currentX = Math.floor(sweepXRef.current);

      let val = midY;

      // Check if sensor is disconnected or severely degraded
      if (isFault || signalQuality < 40) {
        // Flatline with baseline telemetry drift and minor electrical pickup noise
        const noise = (Math.random() - 0.5) * (signalQuality < 40 ? 6 : 1.8);
        val = midY + noise;
      } else {
        const timeInBeat = (timestamp % beatIntervalMs) / beatIntervalMs;

        if (type === 'ecg') {
          // Precise Lead II P-Q-R-S-T cardiac waveform
          if (timeInBeat < 0.12) {
            val = midY; // isoelectric
          } else if (timeInBeat < 0.20) {
            // P wave
            const pPhase = (timeInBeat - 0.12) / 0.08;
            val = midY - Math.sin(pPhase * Math.PI) * 7.5;
          } else if (timeInBeat < 0.27) {
            // PR segment
            val = midY;
          } else if (timeInBeat < 0.29) {
            // Q wave
            const qPhase = (timeInBeat - 0.27) / 0.02;
            val = midY + Math.sin(qPhase * Math.PI) * 4.5;
          } else if (timeInBeat < 0.34) {
            // R wave spike
            const rPhase = (timeInBeat - 0.29) / 0.05;
            if (rPhase < 0.5) {
              val = midY - (rPhase / 0.5) * (height * 0.44);
            } else {
              val = midY - (1 - (rPhase - 0.5) / 0.5) * (height * 0.44);
            }
          } else if (timeInBeat < 0.38) {
            // S wave
            const sPhase = (timeInBeat - 0.34) / 0.04;
            val = midY + Math.sin(sPhase * Math.PI) * 11;
          } else if (timeInBeat < 0.48) {
            // ST segment
            val = midY;
          } else if (timeInBeat < 0.65) {
            // T wave
            const tPhase = (timeInBeat - 0.48) / 0.17;
            val = midY - Math.sin(tPhase * Math.PI) * 13;
          } else {
            val = midY;
          }

          // Organic biological micro-fluctuation
          val += (Math.random() - 0.5) * 0.8;
        } else if (type === 'pleth') {
          // Photoplethysmography (PPG) waveform
          // Amplitude scales with SpO2 perfusion
          const perfusionFactor = Math.max(0.4, Math.min(1.0, (oxygen - 50) / 50));
          const waveHeight = height * 0.38 * perfusionFactor;

          if (timeInBeat < 0.28) {
            // Systolic upstroke
            const p = timeInBeat / 0.28;
            val = midY + waveHeight * 0.7 - Math.sin(p * (Math.PI / 2)) * waveHeight * 1.5;
          } else if (timeInBeat < 0.44) {
            // Dicrotic notch descent
            const p = (timeInBeat - 0.28) / 0.16;
            val = midY - waveHeight * 0.8 + p * waveHeight * 0.5;
          } else if (timeInBeat < 0.58) {
            // Dicrotic wave peak
            const p = (timeInBeat - 0.44) / 0.14;
            val = midY - waveHeight * 0.3 - Math.sin(p * Math.PI) * waveHeight * 0.22;
          } else {
            // Diastolic runoff
            const p = (timeInBeat - 0.58) / 0.42;
            val = midY - waveHeight * 0.3 + p * waveHeight * 1.0;
          }
          val += (Math.random() - 0.5) * 0.4;
        } else if (type === 'abp') {
          // Arterial Blood Pressure curve
          const pulsePressure = Math.max(20, bloodPressureSystolic - bloodPressureDiastolic);
          const amp = (pulsePressure / 60) * (height * 0.36);

          if (timeInBeat < 0.22) {
            const p = timeInBeat / 0.22;
            val = midY + amp * 0.7 - Math.sin(p * (Math.PI / 2)) * amp * 1.5;
          } else if (timeInBeat < 0.42) {
            const p = (timeInBeat - 0.22) / 0.20;
            val = midY - amp * 0.8 + p * amp * 0.6;
          } else if (timeInBeat < 0.54) {
            const p = (timeInBeat - 0.42) / 0.12;
            val = midY - amp * 0.2 - Math.sin(p * Math.PI) * amp * 0.2;
          } else {
            const p = (timeInBeat - 0.54) / 0.46;
            val = midY - amp * 0.2 + p * amp * 0.9;
          }
        } else if (type === 'resp') {
          // Capnography CO2 square curve reacting dynamically to actual respiratoryRate!
          const safeRespRate = Math.max(6, Math.min(60, respiratoryRate || 16));
          const respPeriodMs = (60 / safeRespRate) * 1000;
          const respPhase = (timestamp % respPeriodMs) / respPeriodMs;

          if (respPhase < 0.42) {
            // Alveolar plateau (expiration)
            val = midY - height * 0.32 + Math.sin(respPhase * 8) * 1.5;
          } else if (respPhase < 0.50) {
            // Inspiratory downstroke
            const p = (respPhase - 0.42) / 0.08;
            val = midY - height * 0.32 + p * height * 0.64;
          } else if (respPhase < 0.90) {
            // Inspiratory baseline (0 mmHg CO2)
            val = midY + height * 0.32;
          } else {
            // Expiratory upstroke
            const p = (respPhase - 0.90) / 0.10;
            val = midY + height * 0.32 - p * height * 0.64;
          }
        }
      }

      // Buffer fill for current sweep position
      for (let i = 0; i < Math.ceil(sweepSpeed); i++) {
        const targetIdx = (currentX + i) % bufferLength;
        pointsRef.current[targetIdx] = val;
      }

      sweepXRef.current = (sweepXRef.current + sweepSpeed) % bufferLength;

      // Draw canvas
      ctx.clearRect(0, 0, width, height);

      // Faint calibrated medical millimeter grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
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

      // Major grid line every 4th division
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize * 4) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize * 4) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // CRT Sweep Waveform rendering with erase gap
      const cursorX = Math.floor(sweepXRef.current);
      const eraseGap = 32;

      ctx.save();
      ctx.shadowColor = isFault ? 'rgba(245, 158, 11, 0.3)' : glowColor;
      ctx.shadowBlur = 6;
      ctx.strokeStyle = isFault ? '#f59e0b' : color;
      ctx.lineWidth = 2.0;
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

      // Leading luminous cursor blip
      const blipY = pointsRef.current[cursorX] ?? midY;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(cursorX, blipY, 2.2, 0, Math.PI * 2);
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
  }, [
    type,
    bpm,
    oxygen,
    respiratoryRate,
    bloodPressureSystolic,
    bloodPressureDiastolic,
    color,
    glowColor,
    height,
    isFault,
    signalQuality,
    soundEnabled,
  ]);

  return (
    <div className="relative w-full rounded-xl bg-[#090d16] border border-slate-800/80 p-2.5 overflow-hidden transition-all">
      {/* Telemetry Channel Header Strip */}
      <div className="flex items-center justify-between mb-1 text-[11px] font-mono tracking-wider">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isFault ? 'bg-amber-400 animate-ping' : ''}`}
            style={{ backgroundColor: isFault ? '#f59e0b' : color }}
          />
          <span className="font-bold text-xs uppercase" style={{ color: isFault ? '#f59e0b' : color }}>
            {label}
          </span>
          <span className="text-slate-500 text-[10px] hidden sm:inline">{sublabel}</span>
        </div>
        <div className="text-[10px] font-mono">
          {isFault ? (
            <span className="text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 animate-pulse">
              LEAD OFF / SENSOR DISCONNECTED
            </span>
          ) : signalQuality < 40 ? (
            <span className="text-rose-400 font-bold px-1.5 py-0.5 rounded bg-rose-950/40 border border-rose-500/30">
              HIGH ARTIFACT NOISE
            </span>
          ) : (
            <span className="text-slate-400">LIVE SYNC • 500 Hz</span>
          )}
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ height: `${height}px` }}
        />
        {/* Disconnection Warning Overlay if disconnected */}
        {isFault && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] pointer-events-none">
            <div className="px-3 py-1 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono text-[11px] font-bold tracking-wider shadow-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>SENSOR DISCONNECTED — IMPEDANCE &gt; 50 kΩ</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
