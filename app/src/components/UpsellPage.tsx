import React, { useState, useEffect } from 'react';
import { uiAudio } from '../utils/audioEngine';
import { UserSession } from '../types';
import { SoundControl } from './SoundControl';
import { HotmartFunnelWidget, HOTMART_FUNNEL_ID } from './HotmartFunnelWidget';
import { VIP_GROUP_ENABLED } from '../utils/auth';
import { trackUpsellCtaClick, trackUpsellDecline, trackUpsellView } from '../utils/pixel';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Zap,
  ArrowRight,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
  Star,
  Check,
  X,
  Gift,
  Award,
  AlertTriangle,
  Smartphone,
  CheckCheck,
  TrendingUp,
} from 'lucide-react';

interface UpsellPageProps {
  userSession?: UserSession | null;
  onDeclineUpsell?: () => void;
  onGoToApp?: () => void;
}

// "?oferta=especial" is the downsell step of the Hotmart funnel: same product at half price
const IS_DOWNSELL =
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('oferta') === 'especial';
const PRICE = IS_DOWNSELL ? '$9.90' : '$19.90';
const DISCOUNT = IS_DOWNSELL ? '90% OFF' : '80% OFF';
const OFFER = IS_DOWNSELL ? 'downsell' : 'upsell';
const OFFER_VALUE = IS_DOWNSELL ? 9.9 : 19.9;

export function UpsellPage({
  userSession,
  onDeclineUpsell,
  onGoToApp,
}: UpsellPageProps) {
  // Dynamic 15:00 countdown timer (persists in session storage)
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem('upsell_countdown_seconds');
      if (saved) {
        const parsed = parseInt(saved, 10);
        return parsed > 0 ? parsed : 894; // ~14m 54s
      }
    } catch {
      // ignore
    }
    return 894;
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Shows in Meta Events Manager whether buyers actually reach the offer after paying
  useEffect(() => {
    trackUpsellView(OFFER, OFFER_VALUE);
  }, []);

  // Decrement countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        try {
          sessionStorage.setItem('upsell_countdown_seconds', next.toString());
        } catch {
          // ignore
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  // Format seconds into MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return {
      minutes: mins < 10 ? `0${mins}` : `${mins}`,
      seconds: secs < 10 ? `0${secs}` : `${secs}`,
    };
  };

  const timer = formatTime(secondsLeft);

  const scrollToOffer = () => {
    uiAudio.play('click');
    trackUpsellCtaClick(OFFER, OFFER_VALUE);
    document.getElementById(HOTMART_FUNNEL_ID)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDecline = () => {
    uiAudio.play('back');
    trackUpsellDecline(OFFER);
    if (onDeclineUpsell) {
      onDeclineUpsell();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#2B0B2E] flex flex-col font-body selection:bg-[#FF3377] selection:text-white relative">
      {/* Floating Sound Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <SoundControl />
      </div>

      {/* 1. TOP CRITICAL URGENCY BAR (ORDER CONFIRMATION ALERT) */}
      <section className="sticky top-0 z-40 bg-[#2B0B2E] text-white border-b-3 border-[#FFE600] px-4 py-3 shadow-[0_4px_16px_rgba(43,11,46,0.35)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#A7FF00] animate-ping flex-shrink-0" />
            <span className="text-xs sm:text-sm font-black text-[#FFE600] uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#A7FF00] stroke-[3]" />
              ¡Tu Pedido Principal Está Confirmado!
            </span>
            <span className="hidden md:inline text-xs text-white/80">
              | No cierres ni actualices esta página
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black bg-[#FF3377] text-white px-3.5 py-1 rounded-full border border-white/40 shadow-sm">
              <span>Paso 2 de 2: Oferta VIP de 1 Clic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container - Widened and Optimized for PC & Tablet (max-w-5xl) */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 flex flex-col gap-8">
        {/* 2. PROGRESS STEP BAR */}
        <div className="flex flex-col gap-2 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between text-xs sm:text-sm font-black">
            <span className="text-[#00A859] flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" /> 1. Compra Principal Aprobada
            </span>
            <span className="text-[#FF3377] flex items-center gap-1.5">
              2. Personalización VIP Turbo (Última Etapa)
            </span>
          </div>
          <div className="w-full h-3.5 bg-[#2B0B2E]/10 rounded-full overflow-hidden p-0.5 border-2 border-[#2B0B2E]">
            <div className="h-full bg-gradient-to-r from-[#00A859] via-[#FFE600] to-[#FF3377] rounded-full w-[85%] animate-pulse" />
          </div>
        </div>

        {IS_DOWNSELL && (
          <section className="bg-[#2B0B2E] text-white border-3 border-[#2B0B2E] rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0_#FF3377] text-center flex flex-col gap-2">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#FFE600]">
              🎁 ¡Espera! Una última oportunidad solo para ti
            </span>
            <h2 className="font-display font-black text-xl sm:text-3xl leading-tight">
              El Acelerador 3X completo a <span className="text-[#FFE600]">mitad de precio</span>: solo $9.90 USD
            </h2>
            <p className="text-xs sm:text-sm text-white/85">
              Mismo contenido, mismo acceso inmediato. Antes $19.90 USD. Este precio no volverá a aparecer.
            </p>
          </section>
        )}

        {/* 3. URGENT COUNTDOWN TIMER & SCARCITY BANNER (EXPANDED FOR PC) */}
        <section className="bg-[#FFF9E6] border-3 border-[#2B0B2E] rounded-3xl p-5 sm:p-7 shadow-[6px_6px_0_#2B0B2E,12px_12px_0_#FF3377] flex flex-col lg:flex-row items-center justify-between gap-6 screen-enter">
          <div className="flex items-center gap-4 text-center lg:text-left">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FF3377] text-white flex items-center justify-center border-3 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex-shrink-0 animate-bounce">
              <Clock className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-wider text-[#FF3377] flex items-center justify-center lg:justify-start gap-1.5">
                <Flame className="w-4 h-4 fill-[#FF3377]" />
                Oportunidad Exclusiva para Nuevas Alumnas
              </span>
              <h3 className="font-display font-black text-base sm:text-lg lg:text-xl text-[#2B0B2E] leading-tight mt-0.5">
                Esta oferta única expira y nunca más volverá a ser mostrada:
              </h3>
            </div>
          </div>

          {/* Clock Display */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className="bg-[#2B0B2E] text-[#FFE600] font-mono font-black text-2xl sm:text-4xl px-4 py-2 rounded-xl border-3 border-[#2B0B2E] shadow-[3px_3px_0_#FF3377]">
                {timer.minutes}
              </div>
              <span className="text-[10px] sm:text-xs font-black text-[#6C586B] uppercase mt-1">minutos</span>
            </div>

            <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF3377] animate-pulse">:</span>

            <div className="flex flex-col items-center">
              <div className="bg-[#2B0B2E] text-[#FFE600] font-mono font-black text-2xl sm:text-4xl px-4 py-2 rounded-xl border-3 border-[#2B0B2E] shadow-[3px_3px_0_#FF3377]">
                {timer.seconds}
              </div>
              <span className="text-[10px] sm:text-xs font-black text-[#6C586B] uppercase mt-1">segundos</span>
            </div>
          </div>
        </section>

        {/* 4. HERO SECTION - HIGH IMPACT HEADLINE & PROBLEM CONTRAST */}
        <section className="text-center flex flex-col items-center gap-4 max-w-4xl mx-auto screen-enter">
          <span className="eyebrow-pill px-4 py-1.5 text-xs sm:text-sm">
            <Zap className="w-4 h-4 text-[#FF3377] fill-[#FF3377]" />
            Acelerador de Resultados 3X · Solo {PRICE} USD ({DISCOUNT})
          </span>

          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-[#2B0B2E] leading-[1.14] tracking-tight">
            ¿Quieres <span className="bg-[#FFE600] px-3 py-1 rounded-lg border-3 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] inline-block -rotate-1">Triplicar</span> el Crecimiento de tus Glúteos y Ver Resultados en Solo 7 a 14 Días?
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-[#6C586B] font-medium max-w-3xl leading-relaxed">
            ¡Felicitaciones por unirte al <strong>Desafío Glúteos 28 Días</strong>! El método base funciona, pero si no quieres esperar 4 a 6 semanas para ver los primeros centímetros y buscas <strong>eliminar la celulitis, levantar el glúteo y evitar ensanchar las piernas</strong>, necesitas activar este protocolo biomecánico avanzado hoy mismo.
          </p>
        </section>

        {/* 5. DIRECT-RESPONSE HERO CARD (ZERO LATENCY - NO VIDEO - ADAPTED FOR PC IN 2 COLUMNS) */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#2B0B2E] via-[#3E1343] to-[#1F0721] border-3 border-[#2B0B2E] shadow-[6px_6px_0_#2B0B2E,14px_14px_0_#FF3377] p-6 sm:p-8 lg:p-10 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FFE600_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/15 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FF3377] animate-ping" />
                <span className="text-xs sm:text-sm font-black uppercase text-[#FFE600] tracking-wider">
                  ⚠️ Protocolo de Activación Mecánica Inmediata
                </span>
              </div>
              <span className="text-xs font-black bg-[#A7FF00] text-[#2B0B2E] px-3 py-1 rounded-full border border-[#2B0B2E]">
                Acceso Instantáneo al App
              </span>
            </div>

            {/* 2-Column Responsive Grid on PC */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Problem & Mechanics */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-white leading-snug">
                  El Secreto Biomecánico que el 94% de las Mujeres Ignoran:
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-white/85 leading-relaxed">
                  La mayoría de las mujeres sufren de <em>"Amnesia Glútea"</em>: al hacer sentadillas o estocadas, las piernas y los muslos hacen todo el esfuerzo, dejando el glúteo plano o flácido.
                </p>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  El <strong>Protocolo Acelerador 3X</strong> utiliza micro-rutinas nocturnas de tensión pico en acortamiento, desbloqueando la inervación neuromuscular profunda para que cada ejercicio impacte un 100% en los glúteos.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs text-[#FFE600] font-bold">
                  <Flame className="w-4 h-4 fill-[#FFE600]" />
                  <span>Oferta exclusiva de bienvenida · No disponible en redes ni dentro de la app</span>
                </div>
              </div>

              {/* Right Column: Key Benefits Cards */}
              <div className="lg:col-span-5 flex flex-col gap-3 bg-white/10 p-5 rounded-2xl border border-white/20">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-white">
                  <CheckCheck className="w-5 h-5 text-[#A7FF00] flex-shrink-0 mt-0.5 stroke-[2.5]" />
                  <div>
                    <strong className="text-[#FFE600] block">Desbloquea el Glúteo Máximo:</strong>
                    <span>Estimula fibras profundas que el entrenamiento tradicional no alcanza.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-white">
                  <CheckCheck className="w-5 h-5 text-[#A7FF00] flex-shrink-0 mt-0.5 stroke-[2.5]" />
                  <div>
                    <strong className="text-[#FFE600] block">Efecto Push-Up Anti-Flacidez:</strong>
                    <span>Tensa la piel y estimula la firmeza localizada en solo 14 días.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-white">
                  <CheckCheck className="w-5 h-5 text-[#A7FF00] flex-shrink-0 mt-0.5 stroke-[2.5]" />
                  <div>
                    <strong className="text-[#FFE600] block">Cero Grasa en el Vientre:</strong>
                    <span>Guía nutricional que canaliza la proteína exclusivamente hacia el glúteo.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/15 text-xs text-white/70">
              <span className="font-bold text-[#A7FF00] flex items-center gap-1">
                ✓ Compatible con tu plan actual
              </span>
              <span className="font-mono text-xs bg-white/15 px-3 py-1 rounded-md font-bold text-white">
                Cupos con {DISCOUNT}: 3 restantes
              </span>
            </div>
          </div>
        </section>

        {/* 6. PRIMARY CALL TO ACTION BUTTON (1-CLICK BUY - ADAPTED FOR PC) */}
        <section className="w-full max-w-3xl mx-auto flex flex-col gap-3 p-6 sm:p-8 rounded-3xl bg-[#FFE600] border-3 border-[#2B0B2E] shadow-[6px_6px_0_#2B0B2E,12px_12px_0_#FF3377] text-center">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-[#2B0B2E]">
            <Sparkles className="w-4 h-4 text-[#FF3377]" />
            <span>OFERTA ÚNICA: DE $97.00 USD POR SOLO {PRICE} USD ({DISCOUNT})</span>
            <Sparkles className="w-4 h-4 text-[#FF3377]" />
          </div>

          <button
            type="button"
            onClick={scrollToOffer}
            className="cta-button py-4 sm:py-5 px-6 sm:px-8 text-base sm:text-xl cursor-pointer transition-all hover:scale-[1.02] shadow-[4px_4px_0_#2B0B2E]"
          >
            <div className="flex items-center justify-center gap-3 font-black">
              <span>¡SÍ! QUIERO AGREGAR EL ACELERADOR 3X POR {PRICE} USD</span>
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="button-sheen" />
          </button>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-bold text-[#2B0B2E] pt-1">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#00A859]" /> Cobro seguro en 1 clic
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#FF3377]" /> Activación instantánea
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#00A859]" /> 7 Días de Garantía Total
            </span>
          </div>
        </section>

        {/* 7. WHAT'S IN THE VIP ACCELERATOR (5 PILLARS VALUE STACK - RESPONSIVE PC GRID) */}
        <section className="flex flex-col gap-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow-pill mx-auto">Lo Que Recibes Inmediatamente</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#2B0B2E] mt-2">
              Los 5 Pilares del Protocolo Acelerador 3X
            </h2>
            <p className="text-xs sm:text-sm text-[#6C586B] mt-1">
              Diseñado para desbloquear el crecimiento muscular incluso en mujeres con glúteos planos o caídos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1 */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[4px_4px_0_#2B0B2E] flex flex-col gap-3 hover:translate-y-[-2px] transition-all">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center font-black text-xs sm:text-sm text-[#2B0B2E]">
                  01
                </span>
                <span className="text-[10px] sm:text-xs font-black uppercase text-[#00A859] bg-[#A7FF00]/30 px-2.5 py-1 rounded-md">
                  Entrenamiento Nocturno
                </span>
              </div>
              <h3 className="font-display font-black text-base sm:text-lg text-[#2B0B2E]">
                Rutinas Nocturnas de Activación Neuromuscular 3X
              </h3>
              <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed">
                3 rutinas exprés de 10 minutos, sin material, para hacer en la cama o en la esterilla antes de dormir y activar el glúteo sin sobrecargar los muslos.
              </p>
              <span className="text-xs font-black text-[#FF3377] mt-auto">Valor individual: $27.00 USD</span>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[4px_4px_0_#2B0B2E] flex flex-col gap-3 hover:translate-y-[-2px] transition-all">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center font-black text-xs sm:text-sm text-[#2B0B2E]">
                  02
                </span>
                <span className="text-[10px] sm:text-xs font-black uppercase text-[#FF3377] bg-[#FF3377]/10 px-2.5 py-1 rounded-md">
                  Anti-Flacidez
                </span>
              </div>
              <h3 className="font-display font-black text-base sm:text-lg text-[#2B0B2E]">
                Protocolo Linfático Drenante Anti-Celulitis
              </h3>
              <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed">
                Automasaje guiado de 4 minutos bajo la ducha, con reto de 14 días, para estimular la circulación local y mejorar el aspecto de la piel.
              </p>
              <span className="text-xs font-black text-[#FF3377] mt-auto">Valor individual: $22.00 USD</span>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[4px_4px_0_#2B0B2E] flex flex-col gap-3 hover:translate-y-[-2px] transition-all">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center font-black text-xs sm:text-sm text-[#2B0B2E]">
                  03
                </span>
                <span className="text-[10px] sm:text-xs font-black uppercase text-[#9D1CBB] bg-[#9D1CBB]/10 px-2.5 py-1 rounded-md">
                  Nutrición Focalizada
                </span>
              </div>
              <h3 className="font-display font-black text-base sm:text-lg text-[#2B0B2E]">
                Guía Secreta de Combinación Proteica para Volumen
              </h3>
              <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed">
                Combinaciones prácticas de comidas con su proteína aproximada para alcanzar tu meta diaria y apoyar el crecimiento del glúteo.
              </p>
              <span className="text-xs font-black text-[#FF3377] mt-auto">Valor individual: $25.00 USD</span>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border-2.5 border-[#2B0B2E] shadow-[4px_4px_0_#2B0B2E] flex flex-col gap-3 hover:translate-y-[-2px] transition-all">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-[#FFE600] border-2 border-[#2B0B2E] flex items-center justify-center font-black text-xs sm:text-sm text-[#2B0B2E]">
                  04
                </span>
                <span className="text-[10px] sm:text-xs font-black uppercase text-[#00A859] bg-[#A7FF00]/30 px-2.5 py-1 rounded-md">
                  Recetario VIP
                </span>
              </div>
              <h3 className="font-display font-black text-base sm:text-lg text-[#2B0B2E]">
                Libro Oficial de +50 Recetas Proteicas
              </h3>
              <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed">
                Más de 50 recetas altas en proteína para desayunos, comidas, snacks y postres, con la proteína de cada receta.
              </p>
              <span className="text-xs font-black text-[#FF3377] mt-auto">Valor individual: $35.00 USD</span>
            </div>

            {/* SUPER BONUS CARD (SPANNING BOTH COLUMNS ON DESKTOP) */}
            {VIP_GROUP_ENABLED && (
            <div className="col-span-1 md:col-span-2 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#FFF9E6] via-[#FFF3D1] to-[#FFE600]/40 border-2.5 border-[#FF3377] shadow-[5px_5px_0_#2B0B2E] flex flex-col sm:flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FF3377] text-white flex items-center justify-center font-black border-2 border-[#2B0B2E] flex-shrink-0 shadow-[3px_3px_0_#2B0B2E]">
                <Gift className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] sm:text-xs font-black uppercase bg-[#FF3377] text-white px-2.5 py-0.5 rounded-full">
                    SUPER BONO HOY
                  </span>
                  <span className="text-xs sm:text-sm font-black text-[#00A859]">100% Gratis</span>
                </div>
                <h4 className="font-display font-black text-base sm:text-lg text-[#2B0B2E] leading-tight mt-1">
                  Comunidad Secreta VIP de Alumnas
                </h4>
                <p className="text-xs sm:text-sm text-[#6C586B] mt-0.5">
                  Acceso al grupo exclusivo de alumnas para motivación y fotos de evolución.
                </p>
              </div>
            </div>
            )}
          </div>
        </section>

        {/* 8. COMPARISON TABLE: STANDARD VS ACCELERATED VIP (ADAPTED FOR PC) */}
        <section className="bg-white rounded-3xl border-3 border-[#2B0B2E] shadow-[6px_6px_0_#2B0B2E] p-6 sm:p-8 flex flex-col gap-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#2B0B2E]">
              Compara los Dos Caminos
            </h3>
            <p className="text-xs sm:text-sm text-[#6C586B] mt-1">
              ¿Cuál de las dos experiencias eliges a partir de hoy?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            {/* Standard Plan Column */}
            <div className="p-5 sm:p-6 bg-[#FFFDF8] rounded-2xl border-2 border-[#2B0B2E]/25 flex flex-col gap-3 opacity-90">
              <div className="text-center pb-3 border-b border-[#2B0B2E]/15">
                <span className="text-xs font-bold text-[#6C586B] uppercase block">Tu Plan Actual</span>
                <strong className="text-sm sm:text-base text-[#2B0B2E]">Desafío 28D Estándar</strong>
              </div>

              <div className="flex items-start gap-2.5 text-[#6C586B]">
                <Clock className="w-4 h-4 text-[#6C586B] flex-shrink-0 mt-0.5" />
                <span>Resultados visibles en 4 a 6 semanas</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#6C586B]">
                <Check className="w-4 h-4 text-[#6C586B] flex-shrink-0 mt-0.5" />
                <span>Entrenamientos diarios básicos</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#6C586B]">
                <X className="w-4 h-4 text-[#FF3377] flex-shrink-0 mt-0.5" />
                <span>Sin protocolo rápido anti-celulitis</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#6C586B]">
                <X className="w-4 h-4 text-[#FF3377] flex-shrink-0 mt-0.5" />
                <span>Sin activación neuromuscular nocturna</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#6C586B]">
                <X className="w-4 h-4 text-[#FF3377] flex-shrink-0 mt-0.5" />
                <span>Sin recetario proteico</span>
              </div>
            </div>

            {/* Accelerated VIP Plan Column */}
            <div className="p-5 sm:p-6 bg-[#FFF9E6] rounded-2xl border-3 border-[#FF3377] shadow-[4px_4px_0_#FF3377] flex flex-col gap-3">
              <div className="text-center pb-3 border-b border-[#FF3377]/25">
                <span className="text-xs font-black text-[#FF3377] uppercase block">CON EL ACELERADOR</span>
                <strong className="text-sm sm:text-base text-[#2B0B2E] font-black">Protocolo VIP 3X</strong>
              </div>

              <div className="flex items-start gap-2.5 font-black text-[#00A859]">
                <Zap className="w-4 h-4 text-[#FF3377] flex-shrink-0 mt-0.5 fill-[#FF3377]" />
                <span>Resultados visibles en 7 a 14 días</span>
              </div>
              <div className="flex items-start gap-2.5 font-black text-[#2B0B2E]">
                <Check className="w-4 h-4 text-[#00A859] flex-shrink-0 mt-0.5 stroke-[3]" />
                <span>Entrenamientos base + 10 min nocturnos 3X</span>
              </div>
              <div className="flex items-start gap-2.5 font-black text-[#2B0B2E]">
                <Check className="w-4 h-4 text-[#00A859] flex-shrink-0 mt-0.5 stroke-[3]" />
                <span>Drenaje Linfático Glúteos 14D</span>
              </div>
              <div className="flex items-start gap-2.5 font-black text-[#2B0B2E]">
                <Check className="w-4 h-4 text-[#00A859] flex-shrink-0 mt-0.5 stroke-[3]" />
                <span>Guía de Combinaciones Proteicas</span>
              </div>
              <div className="flex items-start gap-2.5 font-black text-[#2B0B2E]">
                <Check className="w-4 h-4 text-[#00A859] flex-shrink-0 mt-0.5 stroke-[3]" />
                <span>Libro de +50 Recetas Proteicas</span>
              </div>
            </div>
          </div>
        </section>

        {/* 9. SOCIAL PROOF & TESTIMONIALS (RESPONSIVE 3-COLUMN PC GRID) */}
        <section className="flex flex-col gap-5">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow-pill mx-auto">Resultados Reales de Alumnas VIP</span>
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#2B0B2E] mt-1">
              Quienes Agregaron el Acelerador Comentan:
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Testimonial 1 */}
            <div className="bg-white p-5 rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#FFE600] border border-[#2B0B2E] flex items-center justify-center font-black text-xs text-[#2B0B2E]">
                    MR
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2B0B2E]">Mariana R.</h4>
                    <span className="text-[10px] text-[#6C586B] block">Ciudad de México</span>
                  </div>
                </div>
                <div className="flex text-[#FFE600] text-xs">
                  {'★'.repeat(5)}
                </div>
              </div>
              <span className="text-[10px] font-black bg-[#A7FF00]/40 text-[#00A859] px-2 py-0.5 rounded-full border border-[#00A859] self-start">
                +4.2 cm en cadera
              </span>
              <p className="text-xs text-[#6C586B] italic leading-relaxed">
                "Había probado rutinas de gimnasio y solo lograba ensanchar mis muslos mientras el glúteo seguía plano. El Acelerador me enseñó a activar el glúteo de verdad. ¡En apenas 12 días mis pantalones me quedaban completamente diferentes!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-5 rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#FF3377] text-white border border-[#2B0B2E] flex items-center justify-center font-black text-xs">
                    JP
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2B0B2E]">Juliana P.</h4>
                    <span className="text-[10px] text-[#6C586B] block">Bogotá, Colombia</span>
                  </div>
                </div>
                <div className="flex text-[#FFE600] text-xs">
                  {'★'.repeat(5)}
                </div>
              </div>
              <span className="text-[10px] font-black bg-[#A7FF00]/40 text-[#00A859] px-2 py-0.5 rounded-full border border-[#00A859] self-start">
                Menos Celulitis
              </span>
              <p className="text-xs text-[#6C586B] italic leading-relaxed">
                "El drenaje linfático de 4 minutos en la ducha y la rutina nocturna son impresionantes. Eliminé la retención líquida y la piel quedó firme, tersa y con volumen. Vale cada centavo por solo $19.90."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-5 rounded-2xl border-2 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#A7FF00] text-[#2B0B2E] border border-[#2B0B2E] flex items-center justify-center font-black text-xs">
                    SM
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#2B0B2E]">Sofía M.</h4>
                    <span className="text-[10px] text-[#6C586B] block">Madrid, España</span>
                  </div>
                </div>
                <div className="flex text-[#FFE600] text-xs">
                  {'★'.repeat(5)}
                </div>
              </div>
              <span className="text-[10px] font-black bg-[#A7FF00]/40 text-[#00A859] px-2 py-0.5 rounded-full border border-[#00A859] self-start">
                Efecto Push-Up
              </span>
              <p className="text-xs text-[#6C586B] italic leading-relaxed">
                "Increíble cómo cambia la respuesta muscular al aislar el glúteo sin que las rodillas sufran. Por fin veo esa redondez superior que tanto buscaba."
              </p>
            </div>
          </div>
        </section>

        {/* 10. UNCONDITIONAL 30-DAY GUARANTEE (ADAPTED FOR PC) */}
        <section className="bg-[#FFF9E6] p-6 sm:p-8 rounded-3xl border-3 border-[#2B0B2E] shadow-[6px_6px_0_#2B0B2E] flex flex-col sm:flex-row items-center gap-6 max-w-4xl mx-auto w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#00A859] text-white flex items-center justify-center border-3 border-[#2B0B2E] shadow-[3px_3px_0_#2B0B2E] flex-shrink-0">
            <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-center sm:text-left">
            <h3 className="font-display font-black text-lg sm:text-xl text-[#2B0B2E] leading-tight">
              Garantía Incondicional de 7 Días
            </h3>
            <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed mt-1.5">
              Prueba el Acelerador VIP durante 7 días. Si no te gusta por cualquier motivo, pide el reembolso directamente en Hotmart y te devolvemos el 100% de tu dinero. ¡Riesgo cero!
            </p>
          </div>
        </section>

        {/* 11. SECONDARY BUY BUTTON (ACTION AT BOTTOM) */}
        <section className="w-full max-w-3xl mx-auto flex flex-col gap-3 p-6 sm:p-8 rounded-3xl bg-[#FFE600] border-3 border-[#2B0B2E] shadow-[6px_6px_0_#2B0B2E,12px_12px_0_#FF3377] text-center">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-black text-[#2B0B2E]">
            <Flame className="w-4 h-4 text-[#FF3377] fill-[#FF3377]" />
            <span>HAZ CLIC ABAJO PARA AGREGAR A TU PEDIDO CON 80% DE DESCUENTO</span>
          </div>

          <HotmartFunnelWidget />

          <p className="text-xs font-bold text-[#6C586B]">
            *Cobro seguro en 1 clic en el mismo método de pago de tu compra principal.
          </p>
        </section>

        {/* 12. RESPECTFUL NO-THANKS / SKIP LINK */}
        <div className="text-center pt-2 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={handleDecline}
            className="text-xs sm:text-sm font-bold text-[#6C586B] hover:text-[#FF3377] underline decoration-[#2B0B2E]/30 hover:decoration-[#FF3377] transition-all cursor-pointer p-2 leading-relaxed"
          >
            No, gracias. Entiendo que esta es mi única oportunidad de obtener el Acelerador 3X por {PRICE} USD y prefiero continuar solo con el plan básico, asumiendo el riesgo de tardar semanas adicionales en ver resultados y tener que pagar el precio regular de $97 más adelante.
          </button>
        </div>

        {/* 13. FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <section className="flex flex-col gap-4 pt-6 border-t-2 border-[#2B0B2E]/15 max-w-3xl mx-auto w-full">
          <h3 className="font-display font-black text-xl sm:text-2xl text-center text-[#2B0B2E]">
            Preguntas Frecuentes sobre el Acelerador
          </h3>

          <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
            {[
              {
                q: '¿Cómo funciona el pago en 1 clic?',
                a: `Tus datos ya fueron validados de forma segura en la compra de tu programa principal hace unos instantes. Al presionar el botón de confirmación, nuestro procesador seguro solo agrega el valor único de ${PRICE} USD a la misma orden, sin que tengas que volver a escribir los datos de tu tarjeta.`,
              },
              {
                q: '¿Por qué esta oferta tiene un precio tan bajo?',
                a: `Porque acabas de convertirte en nuestra alumna oficial. Como agradecimiento por tu confianza, habilitamos el Acelerador con ${DISCOUNT.replace(' OFF', '')} de descuento exclusivo para nuevas miembros únicamente durante los 15 minutos de esta pantalla.`,
              },
              {
                q: '¿Qué pasa si tengo poco tiempo en mi día a día?',
                a: 'El protocolo nocturno toma solo 10 minutos y el drenaje linfático solo 4 minutos en la ducha. Fue diseñado a la medida de mujeres ocupadas que no disponen de horas para pasar en el gimnasio.',
              },
              {
                q: '¿Cómo recibo el acceso?',
                a: '¡De forma inmediata! En cuanto se aprueba el pago, el Acelerador queda desbloqueado en tu aplicación con el mismo correo de tu compra.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-[#2B0B2E] overflow-hidden shadow-[2px_2px_0_#2B0B2E]"
              >
                <button
                  onClick={() => {
                    uiAudio.play('click');
                    setOpenFaq(openFaq === idx ? null : idx);
                  }}
                  className="w-full p-4 text-left font-display font-bold text-xs sm:text-sm flex items-center justify-between text-[#2B0B2E] cursor-pointer hover:bg-[#FFF9E6] transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#FF3377] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6C586B] flex-shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-[#6C586B] leading-relaxed border-t border-[#2B0B2E]/10 bg-[#FFFDF8]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs font-bold text-[#6C586B] pt-6 border-t border-[#2B0B2E]/10">
          <p>Método Glúteos 28 Días © 2026 · Todos los derechos reservados.</p>
          <p className="text-[11px] text-[#6C586B]/70 mt-1">
            Pago Procesado con Cifrado de Extremo a Extremo · SSL 256-bit
          </p>
        </footer>
      </main>
    </div>
  );
}
