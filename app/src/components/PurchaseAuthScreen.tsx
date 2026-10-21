import React, { useState } from 'react';
import { uiAudio } from '../utils/audioEngine';
import { SoundControl } from './SoundControl';
import { login, ServerSession } from '../utils/auth';
import {
  CheckCircle2,
  Mail,
  Sparkles,
  ArrowRight,
  Lock,
  HelpCircle,
  KeyRound,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface PurchaseAuthScreenProps {
  onLoginSuccess: (session: ServerSession) => void;
  defaultEmail?: string;
}

const ERROR_MESSAGES = {
  empty: 'Por favor, ingresa el correo electrónico utilizado en la compra.',
  invalid: 'Ingresa una dirección de correo válida.',
  not_found:
    'No encontramos una compra aprobada con este correo. Usa el mismo correo con el que pagaste en Hotmart.',
  unavailable: 'No pudimos verificar tu compra en este momento. Inténtalo de nuevo en unos minutos.',
};

export function PurchaseAuthScreen({ onLoginSuccess, defaultEmail = '' }: PurchaseAuthScreenProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');

  const validateAndSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      uiAudio.play('back');
      setErrorMessage(ERROR_MESSAGES.empty);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      uiAudio.play('back');
      setErrorMessage(ERROR_MESSAGES.invalid);
      return;
    }

    setErrorMessage('');
    setStatus('verifying');
    uiAudio.play('click');

    const result = await login(cleanEmail);
    if (!result.ok) {
      uiAudio.play('back');
      setStatus('idle');
      setErrorMessage(ERROR_MESSAGES[result.reason]);
      return;
    }

    setVerifiedName(result.session.name?.split(' ')[0] || '');
    setStatus('verified');
    uiAudio.play('success');
    setTimeout(() => onLoginSuccess(result.session), 1200);
  };

  return (
    <div className="min-h-screen quiz-canvas text-[#2B0B2E] flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden font-body selection:bg-[#FF3377] selection:text-white">
      {/* Ambient background orbs */}
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />

      {/* Sound Toggle Button */}
      <SoundControl />

      {/* Top Header */}
      <header className="w-full max-w-md pt-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <span className="brand-mark">⚡</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg text-[#2B0B2E] tracking-tight">
                Método 28 Días
              </span>
              <span className="bg-[#FF3377] text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-[#2B0B2E] shadow-[2px_2px_0_#2B0B2E]">
                VIP
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#6C586B] tracking-wider uppercase">
              Coach Luca · Área de Alumnas
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            uiAudio.play('click');
            setShowHelpModal(true);
          }}
          className="flex items-center gap-1 text-xs font-bold text-[#2B0B2E] bg-white hover:bg-[#FFE600] border-2 border-[#2B0B2E] px-3 py-1.5 rounded-full shadow-[2px_2px_0_#2B0B2E] transition-all cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#FF3377]" />
          <span>Ayuda</span>
        </button>
      </header>

      {/* Main Neo-Brutalist Authentication Card */}
      <div className="w-full max-w-md my-auto py-5 z-10 screen-enter">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-[7px_7px_0_#2B0B2E,13px_13px_0_#FF3377] border-3 border-[#2B0B2E] flex flex-col gap-5 relative">
          {/* Status icon & Neo-Pop Badge */}
          <div className="flex flex-col items-center text-center gap-2.5">
            {status === 'verified' ? (
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[#A7FF00]/30 border-3 border-[#2B0B2E] flex items-center justify-center text-[#2B0B2E] shadow-[5px_5px_0_#00A859] animate-scaleIn">
                  <CheckCircle2 className="w-10 h-10 text-[#00A859] stroke-[3]" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#2B0B2E] text-[#FFE600] p-1.5 rounded-full text-[10px] font-black border border-[#2B0B2E]">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              </div>
            ) : status === 'verifying' ? (
              <div className="relative w-16 h-16 rounded-full bg-[#FF3377]/15 border-3 border-[#2B0B2E] flex items-center justify-center text-[#FF3377]">
                <div className="w-8 h-8 border-3 border-[#FF3377] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#FFE600] border-3 border-[#2B0B2E] flex items-center justify-center text-[#2B0B2E] shadow-[4px_4px_0_#FF3377] rotate-[-2deg]">
                <ShieldCheck className="w-9 h-9 text-[#2B0B2E]" />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <span className="eyebrow-pill mx-auto">
                <Sparkles className="w-3 h-3 text-[#FF3377]" />
                {status === 'verified' ? 'Acceso Confirmado' : 'Alumnas & Miembros VIP'}
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2B0B2E] tracking-tight leading-tight">
                {status === 'verified' ? `¡Bienvenida${verifiedName ? `, ${verifiedName}` : ''}!` : 'Accede a tu Programa'}
              </h1>
              <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed max-w-xs mx-auto">
                {status === 'verified'
                  ? 'Compra verificada. Ingresando a tu aplicación...'
                  : 'Ingresa el correo que usaste en la compra para desbloquear tu acceso.'}
              </p>
            </div>
          </div>

          {status !== 'verified' && (
            <form onSubmit={validateAndSubmit} className="flex flex-col gap-3.5">
              {/* Email Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#2B0B2E]">Correo de la compra:</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6C586B]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="tu-correo@ejemplo.com"
                    disabled={status === 'verifying'}
                    className="w-full bg-[#FFF9E6] border-2 border-[#2B0B2E] focus:border-[#FF3377] text-[#2B0B2E] placeholder:text-[#6C586B]/60 pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:ring-3 focus:ring-[#FF3377]/30 shadow-[3px_3px_0_#2B0B2E] transition-all"
                  />
                </div>
                {errorMessage && (
                  <p className="text-xs text-[#FF3377] mt-0.5 font-bold flex items-center gap-1">
                    ⚠️ {errorMessage}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <button type="submit" disabled={status === 'verifying'} className="cta-button mt-1">
                {status === 'verifying' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verificando tu compra...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 stroke-[3]" />
                    <span>Entrar a Mi Programa</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
                <span className="button-sheen" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-center text-[10px] font-bold text-[#6C586B] pt-0.5">
                <Lock className="w-3.5 h-3.5 text-[#00A859]" />
                <span>Acceso exclusivo para alumnas con compra verificada</span>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <footer className="w-full max-w-md text-center py-2 z-10">
        <p className="text-[11px] font-bold text-[#6C586B]">Método Glúteos 28 Días © 2026</p>
      </footer>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9E6] border-3 border-[#2B0B2E] w-full max-w-sm rounded-3xl p-5 shadow-[6px_6px_0_#2B0B2E] flex flex-col gap-3.5 screen-enter text-[#2B0B2E]">
            <div className="flex items-center justify-between border-b-2 border-[#2B0B2E]/15 pb-2.5">
              <h3 className="font-display font-black text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#FF3377]" />
                ¿Problemas para entrar?
              </h3>
              <button
                onClick={() => {
                  uiAudio.play('click');
                  setShowHelpModal(false);
                }}
                className="w-7 h-7 rounded-lg border-2 border-[#2B0B2E] bg-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#6C586B] leading-relaxed">
              Usa exactamente el <strong>correo con el que pagaste en Hotmart</strong>. Lo encuentras en el correo de
              confirmación de compra que te envió Hotmart.
            </p>
            <div className="bg-white p-3 rounded-xl border-2 border-[#2B0B2E] text-xs font-semibold text-[#2B0B2E]">
              💡 Si acabas de comprar, espera unos minutos a que el pago sea aprobado e inténtalo de nuevo.
            </div>
            <button
              onClick={() => {
                uiAudio.play('click');
                setShowHelpModal(false);
              }}
              className="w-full py-2.5 bg-[#2B0B2E] text-[#FFE600] font-display font-black text-xs uppercase rounded-xl shadow-[3px_3px_0_#FF3377] transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
