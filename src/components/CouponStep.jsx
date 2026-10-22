import React, { useState, useEffect, useRef } from 'react';
import { Tag, Clock, Trophy, AlertTriangle, ShieldCheck, ArrowRight, Flame, CheckCircle2 } from 'lucide-react';
import HeaderLogo from './HeaderLogo';
import { ASSETS } from '../data/quizData';
import { copy } from '../utils/variant';

export default function CouponStep({ onClaimCoupon }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(599); // 09:59 countdown
  const scratchCanvasRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const isScratching = useRef(false);

  // SECURE RANDOM HELPER FOR ANIMATIONS & CONFETTI
  const getSecureRandom = () => {
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] / 4294967296;
    }
    return (Date.now() % 1000) / 1000;
  };

  // CONFETTI PARTICLE ENGINE
  useEffect(() => {
    if (!isUnlocked) return;

    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#FF2A85', '#FFE600', '#FFB800', '#2B0B2E', '#FF3377', '#10B981'];

    for (let i = 0; i < 160; i++) {
      particles.push({
        x: getSecureRandom() * canvas.width,
        y: getSecureRandom() * canvas.height - canvas.height,
        size: getSecureRandom() * 10 + 4,
        color: colors[Math.floor(getSecureRandom() * colors.length)],
        vx: (getSecureRandom() - 0.5) * 5,
        vy: getSecureRandom() * 4 + 3,
        rotation: getSecureRandom() * 360,
        rotationSpeed: (getSecureRandom() - 0.5) * 10
      });
    }

    let animationFrameId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = getSecureRandom() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isUnlocked]);

  // REAL INTERACTIVE HTML5 CANVAS SCRATCH CARD
  useEffect(() => {
    if (isUnlocked) return;

    const canvas = scratchCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Draw Gold Metallic Coating
    const goldGrad = ctx.createLinearGradient(0, 0, width, height);
    goldGrad.addColorStop(0, '#FFE600');
    goldGrad.addColorStop(0.3, '#FFFBE6');
    goldGrad.addColorStop(0.5, '#FFF4FA');
    goldGrad.addColorStop(0.7, '#FFB800');
    goldGrad.addColorStop(1, '#B8860B');

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw Scratch Prompt Text
    ctx.fillStyle = '#2B0B2E';
    ctx.font = 'bold 13px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ RASPA AQUÍ CON EL DEDO ✨', width / 2, height / 2 - 10);
    ctx.font = 'bold 11px Montserrat, sans-serif';
    ctx.fillText('👉 Revelar Descuento Secreto Exclusivo 👈', width / 2, height / 2 + 14);

    const checkScratchedPercentage = () => {
      try {
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
          if (pixels[i] === 0) {
            transparentPixels++;
          }
        }

        const pct = Math.round((transparentPixels / (pixels.length / 4)) * 100);
        setScratchProgress(pct);

        if (pct >= 28 && !isUnlocked) {
          setIsUnlocked(true);
        }
      } catch {
        // Fallback
      }
    };

    const scratch = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      checkScratchedPercentage();
    };

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    };

    const handleStart = (e) => {
      isScratching.current = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };

    const handleMove = (e) => {
      if (!isScratching.current) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    };

    const handleEnd = () => {
      isScratching.current = false;
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: true });
    canvas.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);

      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isUnlocked]);

  // Timer Countdown
  useEffect(() => {
    if (!isUnlocked) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isUnlocked]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FAF0F6] to-[#F5EBF2] py-6 px-3.5 sm:px-5 flex flex-col justify-center items-center font-body text-[#2B0B2E]">
      
      {/* CANVAS CONFETTI OVERLAY */}
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed inset-0 pointer-events-none z-50"
      />

      <div className="relative z-10 w-full max-w-lg mx-auto space-y-3.5">
        
        {/* Header Logo */}
        <HeaderLogo />

        {/* URGENCY ALERT BANNER */}
        <div className="bg-[#FFF5F9] text-[#2B0B2E] rounded-2xl p-2.5 px-4 shadow-sm flex items-center justify-between text-xs font-black font-heading border-2 border-[#FF2A85] animate-pulse">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#FF2A85] shrink-0" />
            <span className="text-[11px] text-[#2B0B2E]">{copy('⚠️ ATENCIÓN: SOLO QUEDAN 2 PLAZAS CON ESTA BECA', '⏳ TU BECA ESTÁ RESERVADA POR TIEMPO LIMITADO')}</span>
          </span>
          <span className="font-mono bg-[#FF2A85] px-2 py-0.5 rounded text-white font-black text-xs shadow-2xs">
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[28px] p-5 sm:p-7 shadow-xl border border-[#F0D2E4] animate-pop space-y-5 text-center quiz-card text-[#2B0B2E]">
          
          {/* ANNOUNCEMENT */}
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-[#19041C] border-2 border-[#FFE600] text-[11px] sm:text-xs font-black uppercase tracking-wide px-4 py-1.5 rounded-full shadow-[2px_2px_0px_#FF2A85] mx-auto font-heading">
              <Trophy className="w-4 h-4 text-[#FF2A85]" />
              <span>{copy('🎰 PUNTUACIÓN ELITE: 98.4 / 100 SELECCIONADA', '🎯 PERFIL COMPATIBLE CON EL PROTOCOLO')}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#2B0B2E] leading-tight font-heading">
              {isUnlocked ? (
                <span className="text-[#FF2A85]">
                  🎉 ¡BECA DE DESCUENTO SECRETO DESBLOQUEADA!
                </span>
              ) : (
                <span>¡Raspa la Tarjeta Dorada para Descubrir tu Descuento Especial! 🎁</span>
              )}
            </h2>

            {/* HIGH PERCEIVED VALUE SUMMARY */}
            <div className="bg-[#FAF2F7] rounded-2xl p-4 border border-[#F0DCEB] text-left space-y-3 text-xs">
              
              {/* Optional App Mockup Visual Thumbnail */}
              <div className="w-full h-32 sm:h-36 rounded-xl overflow-hidden bg-white border border-[#F0DCEB] shadow-2xs flex items-center justify-center p-2">
                <img 
                  src={ASSETS.appMockup} 
                  alt="Plataforma Digital Protocolo Glúteos Brasileños" 
                  className="h-full object-contain"
                />
              </div>

              <div className="flex items-center gap-2 text-[#2B0B2E] font-bold font-heading">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Lo que incluye tu Beca Exclusiva hoy:</span>
              </div>
              <ul className="space-y-1.5 text-[#6B5469] font-medium text-[11px]">
                <li className="flex items-center justify-between">
                  <span>📱 Protocolo Glúteos Brasileños (Acceso Digital Completo)</span>
                  <span className="text-[#91798E] line-through">$ 97,00</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>🏋️‍♀️ Entrenamientos progresivos con Coach Luca</span>
                  <span className="text-[#91798E] line-through">$ 67,00</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>🥗 Guía de alimentación y rutina de activación</span>
                  <span className="text-[#91798E] line-through">$ 47,00</span>
                </li>
                <li className="flex items-center justify-between font-black text-[#059669] font-heading">
                  <span>🎁 Bonos Exclusivos Incluidos HOY MISMO</span>
                  <span className="text-[#059669]">GRATIS</span>
                </li>
              </ul>
            </div>
          </div>

          {/* REAL INTERACTIVE GOLD SCRATCH CARD CONTAINER */}
          <div className={`relative rounded-[22px] p-4 sm:p-5 transition-all duration-500 border-2 ${
            isUnlocked 
              ? 'bg-gradient-to-r from-[#2B0B2E] via-[#3E1043] to-[#2B0B2E] text-white border-[#FF2A85] shadow-xl ring-4 ring-[#FF2A85]/20 animate-pop' 
              : 'bg-[#FAF2F7] border-[#FFE600] border-dashed shadow-md'
          }`}>
            
            {/* Cutout edges */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border border-[#F0D2E4] pointer-events-none" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border border-[#F0D2E4] pointer-events-none" />

            {/* UNDERLYING PRIZE TICKET */}
            <div className="space-y-3 py-1 text-center font-heading">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FF2A85] text-white shadow-xl mx-auto border-2 border-white">
                <Trophy className="w-7 h-7 text-[#FFE600]" />
              </div>

              <div className="space-y-1">
                <span className="inline-block bg-[#FF2A85] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                  🎊 ¡DESCUENTO SECRETO LIBERADO! 🎊
                </span>
                
                {/* Mystery Discount Breakdown */}
                <div className="pt-2 flex items-center justify-center gap-3">
                  <span className="text-base sm:text-lg font-bold text-white/60 line-through">
                    $ 97,00
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-3xl sm:text-4xl font-black text-[#FFE600] tracking-tight leading-none drop-shadow-xs">
                      {copy('🎁 80% OFF', '🎁 90% OFF')}
                    </span>
                    <span className="text-[10px] font-bold text-white uppercase pt-0.5">¡Beca de Máximo Descuento!</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-[#FFE4F1] pt-1">🔥 Precio especial exclusivo reservado para tu perfil</p>
              </div>

              {isUnlocked && (
                <div className="bg-white/10 border border-[#FF5EAA]/40 text-white rounded-xl p-2 flex items-center justify-center gap-2 text-xs font-bold animate-pop shadow-2xs">
                  <Clock className="w-4 h-4 text-[#FFE600]" />
                  <span>Tu beca con descuento exclusivo expira en: <span className="font-mono text-sm text-[#FFE600] font-black">{formatTime(timeLeft)}</span></span>
                </div>
              )}
            </div>

            {/* INTERACTIVE GOLD SCRATCH CANVAS OVERLAY */}
            {!isUnlocked && (
              <div className="absolute inset-0 z-30 rounded-[22px] overflow-hidden shadow-inner flex flex-col items-center justify-center">
                <canvas 
                  ref={scratchCanvasRef} 
                  width={340} 
                  height={190} 
                  className="w-full h-full cursor-pointer rounded-[22px] touch-none select-none"
                />
                
                {/* Quick Auto-scratch Fallback Button */}
                <button
                  type="button"
                  onClick={() => setIsUnlocked(true)}
                  className="absolute bottom-2 text-[10px] font-bold bg-white text-[#2B0B2E] border border-[#F0DCEB] px-3.5 py-1 rounded-full cursor-pointer shadow-sm hover:bg-[#FFF5F9] font-heading"
                >
                  ⚡ O haz clic aquí para raspar automáticamente ({scratchProgress}%)
                </button>
              </div>
            )}

          </div>

          {/* Action Button */}
          {isUnlocked ? (
            <button
              type="button"
              onClick={onClaimCoupon}
              className="w-full py-4 sm:py-5 px-6 rounded-[20px] bg-gradient-to-r from-[#FF2A85] via-[#FF007F] to-[#FF3377] hover:brightness-110 text-white font-black text-lg sm:text-xl shadow-[0_12px_28px_rgba(255,42,133,0.35)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer group uppercase tracking-wide font-heading"
            >
              <Flame className="w-6 h-6 text-[#FFE600] fill-[#FFE600] shrink-0 drop-shadow-xs" />
              <span>RECLAMAR MI DESCUENTO Y CONTINUAR</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </button>
          ) : (
            <p className="text-xs font-black text-[#FF2A85] animate-pulse font-heading">
              👉 Mueve el dedo sobre la tarjeta dorada para raspar y descubrir tu descuento secreto
            </p>
          )}

          <div className="flex items-center justify-center gap-3 text-[11px] font-medium text-[#91798E]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Garantía 7 Días
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#FF2A85]" /> Cupón VIP Activado
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}


