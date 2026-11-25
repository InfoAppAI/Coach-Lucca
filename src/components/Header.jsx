import React from 'react';
import { ShieldCheck, Flame } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function Header({ currentStep, totalSteps, isFinished }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#F0DCEB] shadow-xs text-[#1F121C]">
      {/* Top Announcement Bar */}
      <div className="bg-[#4A154B] text-white text-[11px] font-semibold text-center py-1.5 px-3 flex items-center justify-center gap-1.5 font-heading">
        <Flame className="w-3.5 h-3.5 text-[#FFA5CD] animate-pulse" />
        <span>🔥 Oferta especial disponible por tiempo limitado</span>
      </div>

      <div className="max-w-md mx-auto py-2 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/assets/logo-320.webp" 
            alt="Protocolo Glúteos Brasileños" 
            className="h-8 sm:h-9 w-auto max-w-[140px] sm:max-w-[170px] object-contain" 
          />
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FDF2F8] text-[#B81E64] border border-[#F0DCEB] flex items-center gap-1 font-heading">
          <ShieldCheck className="w-3 h-3 text-[#10B981]" />
          <span>Acceso 100% Seguro</span>
        </div>
      </div>

      {!isFinished && currentStep > 0 && (
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      )}
    </header>
  );
}
