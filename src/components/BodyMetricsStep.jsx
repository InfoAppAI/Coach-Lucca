import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Ruler, Weight, Activity, CheckCircle2, ArrowRight, Minus, Plus, Zap, Bookmark } from 'lucide-react';
import HeaderLogo from './HeaderLogo';

export default function BodyMetricsStep({ stepData, onNext, onPrevStep, currentStep, totalSteps, initialMetrics }) {
  const [height, setHeight] = useState(initialMetrics?.height || 165);
  const [weight, setWeight] = useState(initialMetrics?.weight || 62);
  const percentage = Math.round((currentStep / totalSteps) * 100);

  // Real-time BMI Calculation
  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);
  const numericBmi = Number.parseFloat(bmi);

  const getBmiDetails = (val) => {
    if (val < 18.5) {
      return { 
        label: "IMC Bajo • Alta Respuesta a Volumen Glúteo", 
        color: "text-[#D97706]", 
        bg: "bg-[#FFF9EB] border-[#FFB800]/40", 
        meterPercent: 25,
        badge: "⚡ Máxima Capacidad de Aumento"
      };
    }
    if (val <= 24.9) {
      return { 
        label: "IMC Saludable • Metabolismo Glúteo Óptimo", 
        color: "text-[#059669]", 
        bg: "bg-[#ECFDF5] border-[#10B981]/40", 
        meterPercent: 55,
        badge: "🏆 Relación Estructura-Músculo Ideal"
      };
    }
    if (val <= 29.9) {
      return { 
        label: "IMC Curva Fuerte • Potencial Anti-Flacidez Máximo", 
        color: "text-[#D81B60]", 
        bg: "bg-[#FDF2F8] border-[#FF2A85]/40", 
        meterPercent: 80,
        badge: "🔥 Quema de Grasa & Elevación Simultánea"
      };
    }
    return { 
      label: "IMC Reestructuración • Estímulo Neuromuscular Profundo", 
      color: "text-[#2B0B2E]", 
      bg: "bg-[#FAF2F7] border-[#F0DCEB]", 
      meterPercent: 95,
      badge: "🚀 Reducción de Impacto Articular"
    };
  };

  const bmiDetails = getBmiDetails(numericBmi);

  const handleHeightStep = (delta) => {
    setHeight((prev) => Math.min(210, Math.max(140, prev + delta)));
  };

  const handleWeightStep = (delta) => {
    setWeight((prev) => Math.min(140, Math.max(40, prev + delta)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ height, weight, bmi: numericBmi });
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FAF0F6] to-[#F5EBF2] py-5 px-3.5 sm:px-5 flex flex-col justify-center items-center font-body text-[#2B0B2E]">
      
      <div className="relative z-10 w-full max-w-lg mx-auto space-y-3.5">
        
        {/* Header Logo */}
        <HeaderLogo />

        {/* QUIZ TOP BAR */}
        <div className="flex items-center justify-between px-1">
          {onPrevStep ? (
            <button
              type="button"
              onClick={onPrevStep}
              className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#F0DCEB] text-[#2B0B2E] flex items-center justify-center transition-all hover:bg-[#FFF5F9] hover:border-[#FF2A85] hover:scale-105 active:scale-95 cursor-pointer"
              title="Volver a la pregunta anterior"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <div className="w-10 h-10" />
          )}

          <div className="text-center">
            <span className="font-heading font-black text-sm sm:text-base text-[#2B0B2E] tracking-tight">
              Paso {currentStep}/{totalSteps}
            </span>
          </div>

          <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#F0DCEB] text-[#FF2A85] flex items-center justify-center">
            <Bookmark className="w-4 h-4 fill-[#FF2A85]/20 stroke-[2.2]" />
          </div>
        </div>

        {/* MAIN QUESTION CARD */}
        <div className="relative rounded-[26px] p-6 text-center text-white shadow-[0_14px_32px_-6px_rgba(255,20,147,0.35)] quiz-question-banner overflow-hidden animate-pop">
          <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-[#19041C] border-2 border-[#FFE600] text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full mb-2.5 shadow-[2px_2px_0px_#FF2A85] font-heading">
            <Zap className="w-3 h-3 text-[#FF2A85] fill-[#19041C]" />
            <span>Calibración Biomecánica Interactiva</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight font-heading drop-shadow-xs">
            Ingresa tu Estatura y Peso 📏
          </h2>

          <p className="text-xs sm:text-sm text-[#FFF4FA] leading-relaxed max-w-md mx-auto font-medium pt-1 font-body">
            Ajusta los medidores interactivos para calcular tu IMC y fuerza neuromuscular.
          </p>
        </div>

        {/* MAIN WHITE CARD CONTAINER */}
        <div className="bg-white rounded-[26px] p-5 sm:p-6 shadow-xl border border-[#F0D2E4] space-y-4 quiz-card animate-pop text-[#2B0B2E]">
          
          {/* PROGRESS BAR */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black text-[#6B5469] uppercase tracking-wider font-heading shrink-0">
              Progreso
            </span>
            <div className="flex-1 h-2.5 bg-[#FAF0F6] rounded-full overflow-hidden p-0.5 border border-[#F0DCEB]">
              <div 
                className="h-full bg-gradient-to-r from-[#FF2A85] via-[#FFE600] to-[#10B981] transition-all duration-300 rounded-full shadow-xs"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-black text-[#FF2A85] font-mono shrink-0">
              {percentage}%
            </span>
          </div>

          {/* GAMIFIED CONTROLS GRID */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left pt-1">
            
            {/* HEIGHT CONTROL */}
            <div className="bg-[#FAF2F7] rounded-[20px] p-4 border border-[#F0DCEB] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#2B0B2E] uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Ruler className="w-4 h-4 text-[#FF2A85]" />
                  Estatura
                </span>
                <span className="text-xl font-black text-[#2B0B2E] font-heading tracking-tight bg-white px-3.5 py-0.5 rounded-xl border border-[#F0DCEB] shadow-2xs">
                  {height} <span className="text-xs font-bold text-[#91798E]">cm</span>
                </span>
              </div>

              {/* STEPPER CONTROLS & SLIDER */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleHeightStep(-1)}
                  className="w-10 h-10 rounded-xl bg-white border-2 border-[#EED4E4] hover:border-[#FF2A85] active:scale-95 text-[#2B0B2E] font-black text-xl flex items-center justify-center transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex-1 space-y-1">
                  <input
                    type="range"
                    min="140"
                    max="210"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#EED4E4] rounded-lg appearance-none cursor-pointer accent-[#FF2A85]"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-[#91798E] px-1 font-heading">
                    <span>140 cm</span>
                    <span>170 cm</span>
                    <span>200 cm</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleHeightStep(1)}
                  className="w-10 h-10 rounded-xl bg-[#FF2A85] text-white hover:bg-[#D60A66] active:scale-95 font-black text-xl flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* QUICK CHIPS */}
              <div className="flex items-center justify-between gap-1.5 pt-1">
                {[155, 160, 165, 170, 175].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setHeight(val)}
                    className={`flex-1 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer font-heading ${
                      height === val
                        ? 'bg-[#FF2A85] text-white border-[#FF2A85] shadow-xs'
                        : 'bg-white text-[#2B0B2E] border-[#EED4E4] hover:border-[#FF2A85]/50'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* WEIGHT CONTROL */}
            <div className="bg-[#FAF2F7] rounded-[20px] p-4 border border-[#F0DCEB] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#2B0B2E] uppercase tracking-wider flex items-center gap-2 font-heading">
                  <Weight className="w-4 h-4 text-[#FF2A85]" />
                  Peso Actual
                </span>
                <span className="text-xl font-black text-[#2B0B2E] font-heading tracking-tight bg-white px-3.5 py-0.5 rounded-xl border border-[#F0DCEB] shadow-2xs">
                  {weight} <span className="text-xs font-bold text-[#91798E]">kg</span>
                </span>
              </div>

              {/* STEPPER CONTROLS & SLIDER */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleWeightStep(-1)}
                  className="w-10 h-10 rounded-xl bg-white border-2 border-[#EED4E4] hover:border-[#FF2A85] active:scale-95 text-[#2B0B2E] font-black text-xl flex items-center justify-center transition-all shadow-2xs shrink-0 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex-1 space-y-1">
                  <input
                    type="range"
                    min="40"
                    max="140"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#EED4E4] rounded-lg appearance-none cursor-pointer accent-[#FF2A85]"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-[#91798E] px-1 font-heading">
                    <span>40 kg</span>
                    <span>75 kg</span>
                    <span>120 kg</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleWeightStep(1)}
                  className="w-10 h-10 rounded-xl bg-[#FF2A85] text-white hover:bg-[#D60A66] active:scale-95 font-black text-xl flex items-center justify-center transition-all shadow-md shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* QUICK CHIPS */}
              <div className="flex items-center justify-between gap-1.5 pt-1">
                {[50, 58, 64, 70, 78].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setWeight(val)}
                    className={`flex-1 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer font-heading ${
                      weight === val
                        ? 'bg-[#FF2A85] text-white border-[#FF2A85] shadow-xs'
                        : 'bg-white text-[#2B0B2E] border-[#EED4E4] hover:border-[#FF2A85]/50'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* REAL-TIME BMI SPEEDOMETER / METRIC CARD */}
            <div className="p-4 rounded-[20px] border border-[#F0DCEB] bg-[#FAF2F7] space-y-2.5 shadow-sm transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#2B0B2E] flex items-center gap-1.5 font-heading">
                  <Activity className="w-4 h-4 text-[#FF2A85] animate-pulse" />
                  IMC Biométrico:
                </span>
                <span className="text-lg font-black text-[#D97706] bg-white px-3 py-0.5 rounded-xl border border-[#F0DCEB] font-heading shadow-2xs">
                  {bmi} <span className="text-[10px] font-bold text-[#91798E]">kg/m²</span>
                </span>
              </div>

              {/* VISUAL METRIC GAUGE BAR */}
              <div className="space-y-1">
                <div className="h-2.5 w-full bg-[#EED4E4] rounded-full overflow-hidden p-0.5 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF2A85] via-[#FFE600] to-[#10B981] rounded-full transition-all duration-500"
                    style={{ width: `${bmiDetails.meterPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-[#91798E] uppercase px-0.5 font-heading">
                  <span>Bajo</span>
                  <span>Saludable</span>
                  <span>Curva Fuerte</span>
                </div>
              </div>

              {/* DYNAMIC COMPATIBILITY BADGE */}
              <div className="pt-1 flex items-center justify-between text-xs font-bold">
                <span className="text-[#059669] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {bmiDetails.label}
                </span>
              </div>
            </div>

            {/* ACTION SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-4 sm:py-5 px-6 rounded-[20px] bg-gradient-to-r from-[#FF2A85] via-[#FF007F] to-[#FF3377] hover:brightness-110 text-white font-black text-lg sm:text-xl shadow-[0_12px_28px_rgba(255,42,133,0.35)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all cursor-pointer group uppercase tracking-wide font-heading"
            >
              <span>CONFIRMAR Y CONTINUAR</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform shrink-0" />
            </button>

          </form>

          {/* TRUST BADGE */}
          <div className="pt-2 text-center border-t border-[#F0DCEB] flex items-center justify-center gap-1.5 text-xs font-medium text-[#91798E]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Medición 100% privada para tu plan biomecánico</span>
          </div>
        </div>
      </div>
    </div>
  );
}


