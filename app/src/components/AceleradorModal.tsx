import React, { useState } from 'react';
import { BookOpen, Check, Droplets, Moon, ShieldAlert, Utensils, X, Zap } from 'lucide-react';
import { uiAudio } from '../utils/audioEngine';
import { ImageWithFallback } from './ImageWithFallback';
import { ALL_16_EXERCISES } from '../data/workoutData';
import {
  LYMPHATIC_NOTES,
  LYMPHATIC_STEPS,
  NIGHT_ROUTINES,
  NIGHT_ROUTINE_TIPS,
  PROTEIN_COMBOS,
  PROTEIN_TARGET_TEXT,
} from '../data/aceleradorData';

type Section = 'noche' | 'linfatico' | 'proteina';

const CHECKLIST_KEY = 'coach_gluteos_linfatico_14d';

interface AceleradorModalProps {
  onClose: () => void;
  onOpenCookbook: () => void;
}

function loadChecklist(): boolean[] {
  try {
    const saved = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '[]');
    if (Array.isArray(saved) && saved.length === 14) return saved;
  } catch {
    // ignore
  }
  return Array(14).fill(false);
}

export function AceleradorModal({ onClose, onOpenCookbook }: AceleradorModalProps) {
  const [section, setSection] = useState<Section>('noche');
  const [routineId, setRoutineId] = useState(NIGHT_ROUTINES[0].id);
  const [checklist, setChecklist] = useState<boolean[]>(loadChecklist);

  const routine = NIGHT_ROUTINES.find((r) => r.id === routineId) || NIGHT_ROUTINES[0];
  const totalLymphaticSeconds = LYMPHATIC_STEPS.reduce((sum, s) => sum + s.seconds, 0);
  const daysDone = checklist.filter(Boolean).length;

  const toggleDay = (index: number) => {
    uiAudio.play('select');
    const next = checklist.map((done, i) => (i === index ? !done : done));
    setChecklist(next);
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const tabs: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'noche', label: 'Rutinas Nocturnas', icon: <Moon className="w-4 h-4" /> },
    { id: 'linfatico', label: 'Drenaje Linfático', icon: <Droplets className="w-4 h-4" /> },
    { id: 'proteina', label: 'Proteínas', icon: <Utensils className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-[#FFFDF8] border-3 border-[#2B0B2E] w-full max-w-2xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-[6px_6px_0_#2B0B2E] flex flex-col text-[#2B0B2E] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-4 border-b-2 border-[#2B0B2E]/15 bg-[#FFE600]">
          <div className="flex items-center gap-2 min-w-0">
            <Zap className="w-5 h-5 text-[#FF3377] flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="font-display font-black text-base sm:text-lg leading-tight truncate">
                Protocolo Acelerador 3X VIP
              </h2>
              <p className="text-[11px] font-bold text-[#6C586B]">Tu contenido exclusivo desbloqueado</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-lg border-2 border-[#2B0B2E] bg-white flex items-center justify-center cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-3 border-b-2 border-[#2B0B2E]/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                uiAudio.play('click');
                setSection(tab.id);
              }}
              className={`py-2 px-1 rounded-xl border-2 border-[#2B0B2E] text-[11px] sm:text-xs font-black flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer transition-all ${
                section === tab.id ? 'bg-[#2B0B2E] text-[#FFE600]' : 'bg-white hover:bg-[#FFF9E6]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          {section === 'noche' && (
            <>
              <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed">
                Rutinas de ~10 minutos sin material, en la cama o en una esterilla, para activar el glúteo antes de
                dormir.
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {NIGHT_ROUTINES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoutineId(r.id)}
                    className={`px-3 py-1.5 rounded-full border-2 border-[#2B0B2E] text-xs font-black whitespace-nowrap cursor-pointer ${
                      r.id === routineId ? 'bg-[#FF3377] text-white' : 'bg-white'
                    }`}
                  >
                    {r.title.split(' · ')[0]}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-2xl border-2 border-[#2B0B2E] p-3.5 shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-1">
                <h3 className="font-display font-black text-base">{routine.title}</h3>
                <p className="text-xs text-[#6C586B]">{routine.focus}</p>
                <p className="text-[11px] font-black text-[#FF3377]">
                  ⏱ {routine.minutes} min · {routine.rounds}
                </p>
              </div>
              <ol className="flex flex-col gap-2.5">
                {routine.moves.map((move, i) => {
                  const ref = ALL_16_EXERCISES.find((e) => e.id === move.exerciseId);
                  return (
                    <li key={`${routine.id}-${i}`} className="flex gap-3 bg-white rounded-2xl border-2 border-[#2B0B2E]/20 p-3">
                      <ImageWithFallback
                        src={ref?.primaryImageUrl}
                        fallbackSrc={ref?.fallbackImageUrl}
                        alt={move.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#2B0B2E]/20 flex-shrink-0 bg-[#FFF9E6]"
                      />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-sm font-black">
                          {i + 1}. {move.name}
                        </span>
                        <span className="text-[11px] font-black text-[#00A859]">{move.prescription}</span>
                        <span className="text-xs text-[#6C586B] leading-relaxed">{move.howTo}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <ul className="bg-[#FFF9E6] rounded-2xl border-2 border-[#2B0B2E]/20 p-3 flex flex-col gap-1.5 text-xs text-[#2B0B2E]">
                {NIGHT_ROUTINE_TIPS.map((tip) => (
                  <li key={tip}>💡 {tip}</li>
                ))}
              </ul>
            </>
          )}

          {section === 'linfatico' && (
            <>
              <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed">
                Automasaje de {Math.round(totalLymphaticSeconds / 60)} minutos bajo la ducha. Presión suave y siempre en
                dirección a las ingles.
              </p>
              <ol className="flex flex-col gap-2.5">
                {LYMPHATIC_STEPS.map((step, i) => (
                  <li key={step.title} className="bg-white rounded-2xl border-2 border-[#2B0B2E]/20 p-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-black">
                        {i + 1}. {step.title}
                      </span>
                      <span className="text-[11px] font-black text-[#FF3377] flex-shrink-0">{step.seconds} s</span>
                    </div>
                    <span className="text-xs text-[#6C586B] leading-relaxed">{step.instructions}</span>
                  </li>
                ))}
              </ol>

              <div className="bg-white rounded-2xl border-2 border-[#2B0B2E] p-3.5 shadow-[3px_3px_0_#2B0B2E] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black">Reto de 14 días</span>
                  <span className="text-xs font-black text-[#00A859]">{daysDone} / 14</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {checklist.map((done, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleDay(i)}
                      aria-label={`Día ${i + 1}`}
                      className={`aspect-square rounded-lg border-2 border-[#2B0B2E] text-[11px] font-black flex items-center justify-center cursor-pointer ${
                        done ? 'bg-[#A7FF00]' : 'bg-white'
                      }`}
                    >
                      {done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#6C586B] leading-relaxed">{LYMPHATIC_NOTES.expectation}</p>
              <div className="bg-[#FFF0F4] rounded-2xl border-2 border-[#FF3377]/40 p-3 flex gap-2 text-xs text-[#2B0B2E]">
                <ShieldAlert className="w-4 h-4 text-[#FF3377] flex-shrink-0 mt-0.5" />
                <span>{LYMPHATIC_NOTES.safety}</span>
              </div>
            </>
          )}

          {section === 'proteina' && (
            <>
              <p className="text-xs sm:text-sm text-[#6C586B] leading-relaxed">{PROTEIN_TARGET_TEXT}</p>
              <ul className="flex flex-col gap-2.5">
                {PROTEIN_COMBOS.map((item) => (
                  <li key={item.combo} className="bg-white rounded-2xl border-2 border-[#2B0B2E]/20 p-3 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase text-[#FF3377]">{item.meal}</span>
                      <span className="text-[11px] font-black text-[#00A859] flex-shrink-0">~{item.protein} g proteína</span>
                    </div>
                    <span className="text-sm font-black">{item.combo}</span>
                    <span className="text-xs text-[#6C586B]">{item.why}</span>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={onOpenCookbook} className="cta-button">
                <BookOpen className="w-4 h-4" />
                <span>Abrir Libro de +50 Recetas Proteicas</span>
                <span className="button-sheen" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
