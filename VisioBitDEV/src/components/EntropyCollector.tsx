import React, { useRef, useState } from 'react';
import { Fingerprint, ShieldCheck } from 'lucide-react';

interface EntropyCollectorProps {
  onProgress: (level: number) => void;
  onComplete: (pool: number[]) => void;
}

export const EntropyCollector: React.FC<EntropyCollectorProps> = ({ onProgress, onComplete }) => {
  const entropyPool = useRef<number[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });
  
  // WICHTIG: State für das UI-Update nutzen, Ref für die präzise Berechnung im Hintergrund
  const [visualProgress, setVisualProgress] = useState(0);
  const calculatedProgress = useRef(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - lastPos.current.x);
    const dy = Math.abs(e.clientY - lastPos.current.y);
    const movement = Math.sqrt(dx * dx + dy * dy);

    // Nur bei signifikanter Bewegung Daten sammeln
    if (movement > 5) {
      // Echte Rohdaten sammeln: Koordinaten + High-Res Timestamp
      const timeHighRes = performance.now();
      entropyPool.current.push(e.clientX, e.clientY, Math.floor(timeHighRes * 100));

      // Begrenzung um Speicherlecks zu verhindern
      if (entropyPool.current.length > 2048) entropyPool.current.shift();

      // Fortschritt berechnen (Ref für Logik)
      calculatedProgress.current = Math.min(100, calculatedProgress.current + 0.5);
      
      // Update für UI triggern
      setVisualProgress(calculatedProgress.current);
      
      lastPos.current = { x: e.clientX, y: e.clientY };
      onProgress(calculatedProgress.current);

      if (calculatedProgress.current >= 100) {
        onComplete(entropyPool.current);
      }
    }
  };

  return (
    <div 
      className="w-full h-full min-h-[400px] flex flex-col items-center justify-center cursor-crosshair animate-fade-in"
      onMouseMove={handleMouseMove}
    >
       <div className="max-w-2xl w-full bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-cyan-500/30 relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          {/* Scanline Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-scanline pointer-events-none"></div>
          
          <div className="flex flex-col items-center text-center gap-6 relative z-10">
            <div className="relative">
              <Fingerprint className="w-20 h-20 text-cyan-400" />
              <div className="absolute inset-0 animate-ping opacity-20 bg-cyan-400 rounded-full"></div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-2 text-cyan-50 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">ECHTZEIT ENTROPIE</h1>
              <p className="text-cyan-300/70 text-sm max-w-md mx-auto">
                Bewege deine Maus, um Zufallswerte zu generieren. Deine Bewegungen füllen den <span className="text-cyan-100 font-bold">SHA-256 Pool</span>.
              </p>
            </div>

            {/* Visualisierung */}
            <div className="w-full bg-slate-950 h-14 rounded border border-cyan-900/50 relative overflow-hidden flex items-center justify-center group shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-900 via-cyan-600 to-cyan-400 transition-all duration-75 ease-out"
                style={{ width: `${visualProgress}%` }}
              ></div>
              
              {/* Hex Overlay */}
              <div className="absolute inset-0 flex items-center overflow-hidden opacity-30 text-[10px] font-mono text-white mix-blend-overlay select-none">
                 {Array.from({length: 12}).map((_, i) => (
                   <span key={i} className="mx-2">{Math.random().toString(16).substring(2)}</span>
                 ))}
              </div>

              <span className="relative z-10 font-bold tracking-widest text-white text-lg drop-shadow-md flex items-center gap-2">
                {visualProgress >= 100 ? <ShieldCheck className="w-5 h-5 text-emerald-300" /> : null}
                {Math.floor(visualProgress)}% ENTROPIE
              </span>
            </div>
            
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              Standard: AES-256-GCM Preparation
            </div>
          </div>
       </div>
    </div>
  );
};