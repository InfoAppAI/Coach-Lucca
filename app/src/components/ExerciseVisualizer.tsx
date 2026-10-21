import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Maximize2, ShieldCheck, Zap } from 'lucide-react';

interface ExerciseVisualizerProps {
  exerciseId: string;
  exerciseName: string;
  targetMuscle: string;
  primaryImageUrl: string;
  fallbackImageUrl: string;
  isHomeAlternative?: boolean;
}

type CadencePhase = 'subida' | 'pausa' | 'bajada';

export function ExerciseVisualizer({
  exerciseId,
  exerciseName,
  targetMuscle,
  primaryImageUrl,
  fallbackImageUrl,
  isHomeAlternative = false,
}: Readonly<ExerciseVisualizerProps>) {
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false);
  const [cadencePhase, setCadencePhase] = useState<CadencePhase>('subida');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  // Áudio sintético Web Audio API para o metrônomo (bip suave e profissional)
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBip = (freq = 880, duration = 0.08) => {
    if (isMuted || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context não inicializado ou bloqueado por política de autoplay
    }
  };

  // Ciclo do Metrônomo de Cadência Biomecânica (1s subida -> 2s pausa isométrica -> 3s descida excêntrica)
  useEffect(() => {
    if (!isMetronomeActive) return;

    let timer: ReturnType<typeof setTimeout>;

    if (cadencePhase === 'subida') {
      playBip(660, 0.08); // Bip subida
      timer = setTimeout(() => {
        setCadencePhase('pausa');
      }, 1000);
    } else if (cadencePhase === 'pausa') {
      playBip(1100, 0.12); // Bip agudo no pico de contração!
      timer = setTimeout(() => {
        setCadencePhase('bajada');
      }, 2000);
    } else {
      playBip(440, 0.06); // Bip descida
      timer = setTimeout(() => {
        setCadencePhase('subida');
      }, 2500);
    }

    return () => clearTimeout(timer);
  }, [isMetronomeActive, cadencePhase, isMuted]);

  const activeImageSrc = isHomeAlternative
    ? fallbackImageUrl || primaryImageUrl
    : imageError
      ? fallbackImageUrl || `/exercises/${exerciseId}.svg`
      : primaryImageUrl || `/exercises/${exerciseId}.svg`;

  const getPhaseBadge = () => {
    if (cadencePhase === 'pausa') {
      return {
        label: '🛑 APRIETE MÁXIMO (2s)',
        color: 'bg-[#FF3377] text-white animate-pulse',
      };
    }
    if (cadencePhase === 'subida') {
      return {
        label: '⬆️ SUBIDA EXPLOSIVA (1s)',
        color: 'bg-[#A7FF00] text-[#2B0B2E]',
      };
    }
    return {
      label: '⬇️ DESCENSO LENTO CONTROLADO (3s)',
      color: 'bg-[#FFE600] text-[#2B0B2E]',
    };
  };

  const phaseBadge = getPhaseBadge();

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2.5 border-[#2B0B2E] bg-[#1F0822] shadow-[4px_4px_0_#2B0B2E] flex flex-col">
      {/* 1. BARRA SUPERIOR: IDENTIFICAÇÃO FLAT & CONTROLES */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#2B0B2E] border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#FF3377] text-white text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0_#2B0B2E]">
            Ilustración Flat 2D
          </span>
          <span className="text-white/80 text-xs font-bold hidden sm:inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A7FF00]" />
            Postura Biomecánica Exacta
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Botão de Som do Metrônomo */}
          {isMetronomeActive && (
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Activar sonido bip' : 'Silenciar sonido bip'}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#A7FF00]" />}
            </button>
          )}

          {/* Botão de Zoom da Ilustração */}
          <button
            type="button"
            onClick={() => setIsZoomModalOpen(true)}
            title="Ampliar ilustración flat"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ampliar</span>
          </button>
        </div>
      </div>

      {/* 2. ÁREA PRINCIPAL DA ILUSTRAÇÃO FLAT */}
      <div className="relative w-full h-64 sm:h-72 md:h-80 bg-gradient-to-b from-[#18041B] to-[#2B0B2E] flex items-center justify-center overflow-hidden p-2">
        <img
          src={activeImageSrc}
          alt={`Ilustración flat de ${exerciseName}`}
          className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-[1.01]"
          onError={() => setImageError(true)}
          loading="eager"
        />

        {/* Tag de Foco Muscular no Glúteo */}
        <div className="absolute top-3 left-3 bg-[#2B0B2E]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#FF3377] flex items-center gap-2 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3377] animate-pulse" />
          <span className="text-[11px] font-black text-white uppercase tracking-wide">
            Foco: {targetMuscle}
          </span>
        </div>

        {/* Status de Guia do Metrônomo (quando ativo) */}
        {isMetronomeActive && (
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg ${phaseBadge.color}`}>
              {phaseBadge.label}
            </span>
          </div>
        )}
      </div>

      {/* 3. BARRA INFERIOR DE METRÔNOMO DE CADÊNCIA BIOMECÂNICA */}
      <div className="p-3 bg-[#18041B] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              setIsMetronomeActive(!isMetronomeActive);
              if (!isMetronomeActive) {
                setCadencePhase('subida');
              }
            }}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0_#2B0B2E] ${
              isMetronomeActive
                ? 'bg-[#A7FF00] text-[#2B0B2E] ring-2 ring-[#A7FF00]/50'
                : 'bg-[#FFE600] hover:bg-[#FFE600]/90 text-[#2B0B2E]'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isMetronomeActive ? 'fill-[#2B0B2E] animate-bounce' : ''}`} />
            <span>{isMetronomeActive ? 'Metrónomo Activo (Pausar)' : 'Activar Metrónomo Guiado'}</span>
          </button>

          <span className="text-[11px] font-mono text-white/70 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10 hidden sm:inline-block">
            Cadencia: 2-2-1-0
          </span>
        </div>

        <div className="text-[11px] text-white/80 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF3377]" />
          <span>Aprieta 2 segundos en el punto más alto</span>
        </div>
      </div>

      {/* 4. MODAL DE ZOOM EXPANDIDO DA ILUSTRAÇÃO FLAT */}
      {isZoomModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsZoomModalOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsZoomModalOpen(false);
          }}
          tabIndex={-1}
        >
          <div
            className="relative max-w-4xl w-full bg-[#1F0822] border-2 border-[#FF3377] rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#A7FF00] tracking-wider block">
                  Ilustración Flat de Alta Definición
                </span>
                <h3 className="text-base font-black text-white">{exerciseName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl bg-black/40">
              <img
                src={activeImageSrc}
                alt={exerciseName}
                className="w-full h-auto max-h-[72vh] object-contain"
              />
            </div>

            <div className="w-full mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <span>🎯 Músculo Principal: <strong className="text-[#FFE600]">{targetMuscle}</strong></span>
              <button
                type="button"
                onClick={() => setIsZoomModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#FF3377] hover:bg-[#FF3377]/90 text-white font-black text-xs cursor-pointer"
              >
                Cerrar Vista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
