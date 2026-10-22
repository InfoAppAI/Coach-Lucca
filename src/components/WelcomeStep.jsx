import React from 'react';
import { ArrowRight, ShieldCheck, Star, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import HeaderLogo from './HeaderLogo';
import { ASSETS } from '../data/quizData';
import { copy } from '../utils/variant';

export default function WelcomeStep({ onStart }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FAF0F6] to-[#F5EBF2] py-6 px-3.5 sm:px-5 flex flex-col justify-center items-center font-body text-[#2B0B2E]">
      
      <div className="relative z-10 w-full max-w-lg mx-auto space-y-4">
        
        {/* Header Logo */}
        <HeaderLogo />

        {/* HERO CARD - MOBILE APP MODERN STYLE (LIGHT THEME) */}
        <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_16px_45px_rgba(43,11,46,0.08)] border border-[#F0D2E4] animate-pop space-y-5 text-center quiz-card relative overflow-hidden">
          
          {/* Top Status Header Pill */}
          <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-[#19041C] border-2 border-[#FFE600] px-4 py-1.5 rounded-full text-xs font-black font-heading tracking-wide uppercase shadow-[2px_2px_0px_#FF2A85]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF2A85] fill-[#19041C]" />
            <span>ENTRENAMIENTO FEMENINO ESPECIALIZADO</span>
          </div>

          {/* Headline & Subheadline */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#2B0B2E] uppercase leading-tight tracking-tight font-heading">
              Desarrolla glúteos más firmes, elevados y definidos con el <span className="text-[#FF2A85]">Protocolo Glúteos Brasileños</span>
            </h1>

            <p className="text-sm sm:text-base text-[#6B5469] font-medium leading-relaxed">
              Sigue un plan progresivo de entrenamiento diseñado para activar correctamente tus glúteos, mejorar tu técnica y construir resultados reales desde casa o en el gimnasio.
            </p>
          </div>

          {/* HERO VISUAL BANNER / PREVIEW IMAGE */}
          <div className="relative w-full max-w-[420px] mx-auto rounded-2xl overflow-hidden border border-[#F0D2E4] shadow-sm bg-gradient-to-b from-[#FFF5F9] to-[#FAF0F6] group">
            <img 
              src={ASSETS.hero || ASSETS.gifs.fit1} 
              alt="Protocolo Glúteos Brasileños Preview" 
              className="w-full h-auto aspect-square object-cover object-top group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md text-[#2B0B2E] text-[10px] sm:text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-[#F0D2E4] font-heading">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>Resultados Visibles en 28 Días</span>
            </div>
            <div className="absolute bottom-2.5 right-2.5 bg-[#2B0B2E]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg shadow-sm font-heading">
              8-10 min/día en Casa
            </div>
          </div>


          {/* Quick Benefits Checklist */}
          <div className="grid grid-cols-2 gap-2.5 text-left bg-[#FAF2F7] p-4 rounded-2xl border border-[#F0DCEB] text-xs font-bold text-[#2B0B2E]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Rutinas paso a paso</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Casa o gimnasio</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Vídeos explicativos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Para principiantes</span>
            </div>
          </div>

          {/* Direct Call to Action */}
          <div className="space-y-3 pt-1">
            <p className="text-xs sm:text-sm font-black text-[#D97706] uppercase tracking-wider font-heading flex items-center justify-center gap-1.5">
              <Zap className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
              <span>¡RESPONDE EL TEST RÁPIDO Y OBTÉN TU PROTOCOLO!</span>
            </p>

            {/* CTA Button in Vibrant Hot Pink / Coral */}
            <button
              type="button"
              onClick={onStart}
              className="w-full py-4 sm:py-5 px-6 rounded-[20px] bg-gradient-to-r from-[#FF2A85] via-[#FF007F] to-[#FF3377] hover:brightness-110 text-white font-black text-lg sm:text-xl shadow-[0_12px_28px_rgba(255,42,133,0.35)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer group uppercase tracking-wide font-heading"
            >
              <span>QUIERO EMPEZAR EL PROTOCOLO</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </button>

            {/* Microcopy Security Guarantee */}
            <p className="text-[11px] font-medium text-[#91798E] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Acceso inmediato • Pago seguro • Garantía de 7 días</span>
            </p>
          </div>

          {/* Rating & Social Proof */}
          <div className="pt-3 border-t border-[#F0DCEB] flex items-center justify-center gap-3 text-xs text-[#6B5469]">
            <div className="flex items-center gap-0.5 text-[#FFB800]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={`welcome-star-${i + 1}`} className="w-4 h-4 fill-[#FFB800]" />
              ))}
            </div>
            <span className="font-black text-[#2B0B2E]">4.9/5</span>
            <span className="text-[#91798E]">{copy('| +14,800 alumnas satisfechas', '| +12.000 alumnas')}</span>
          </div>

        </div>

      </div>
    </div>
  );
}


