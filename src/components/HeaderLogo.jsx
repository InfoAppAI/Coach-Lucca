import React from 'react';
import { ASSETS } from '../data/quizData';

export default function HeaderLogo() {
  return (
    <div className="flex items-center justify-center py-2 select-none text-center">
      <img 
        src={ASSETS.logo || "/assets/logo-320.webp"} 
        alt="Protocolo Glúteos Brasileños" 
        className="h-11 sm:h-13 w-auto max-w-[240px] sm:max-w-[280px] object-contain drop-shadow-sm transition-transform hover:scale-102" 
      />
    </div>
  );
}
