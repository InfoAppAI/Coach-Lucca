import React, { useEffect, useState } from 'react';
import { TabType, HabitItem, UserSession, MealsState, LoggedSet } from './types';
import { TopHeader, BottomNavBar } from './components/Navigation';
import { InicioTab } from './components/InicioTab';
import { ComidasTab } from './components/ComidasTab';
import { EntrenarTab } from './components/EntrenarTab';
import { CoachAiTab } from './components/CoachAiTab';
import { ProgresoTab } from './components/ProgresoTab';
import { PurchaseAuthScreen } from './components/PurchaseAuthScreen';
import { QuizFlowModal } from './components/QuizFlowModal';
import { MiniOnboardingModal } from './components/MiniOnboardingModal';
import { SoundControl } from './components/SoundControl';
import { ProteinCookbookModal } from './components/ProteinCookbookModal';
import { UpsellPage } from './components/UpsellPage';
import { AppSlug, APP_PATH, getCurrentSlug, isUpsellPage, navigateToSlug } from './utils/router';
import { fetchSession, logout, ServerSession, UPSELL_CHECKOUT_URL } from './utils/auth';
import { clearLocalProfile, loadLocalProfile, saveLocalProfile } from './utils/localProfile';

export default function App() {
  // Access comes only from the purchase-verified server session; the profile is per device
  const [serverSession, setServerSession] = useState<ServerSession | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profile, setProfile] = useState<Partial<UserSession>>(() => loadLocalProfile());
  const onUpsellPage = isUpsellPage();

  useEffect(() => {
    if (onUpsellPage) {
      document.title = '⚠️ Paso 2 de 2: Oferta Única VIP · Protocolo Acelerador 3X';
      return;
    }
    fetchSession().then((session) => {
      setServerSession(session);
      setAuthChecked(true);
    });
  }, [onUpsellPage]);

  const userSession: UserSession | null = serverSession
    ? {
        ...profile,
        email: serverSession.email,
        name: profile.name || serverSession.name || serverSession.email.split('@')[0],
        plan: serverSession.hasUpsell
          ? 'Desafío Glúteos 28 Días + Acelerador VIP'
          : 'Desafío Glúteos 28 Días · Vitalicio',
        purchasedAt: profile.purchasedAt || '',
        isVerified: true,
        hasUpsell: serverSession.hasUpsell,
      }
    : null;

  const setUserSession = (updated: UserSession | null) => {
    if (!updated) return;
    saveLocalProfile(updated);
    setProfile(loadLocalProfile());
  };

  const [currentSlug, setCurrentSlug] = useState<AppSlug>(() => getCurrentSlug());
  const [currentTab, setCurrentTab] = useState<TabType>('inicio');
  const [initialCoachPrompt, setInitialCoachPrompt] = useState<string | undefined>(undefined);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showCookbookModal, setShowCookbookModal] = useState(false);
  const [cookbookExtraProtein, setCookbookExtraProtein] = useState<number>(0);

  // Synchronize internal state based on slug
  const applySlugState = (slug: AppSlug, shouldPush: boolean = true) => {
    setCurrentSlug(slug);
    if (shouldPush) {
      navigateToSlug(slug);
    }

    if (slug === '/quiz') {
      setShowQuizModal(true);
      setShowCookbookModal(false);
    } else if (slug === '/receitas') {
      setShowCookbookModal(true);
      setShowQuizModal(false);
    } else {
      setShowQuizModal(false);
      setShowCookbookModal(false);
      if (slug === '/inicio') setCurrentTab('inicio');
      else if (slug === '/entrenar') setCurrentTab('entrenar');
      else if (slug === '/comidas') setCurrentTab('comidas');
      else if (slug === '/coach-ai') setCurrentTab('coach-ai');
      else if (slug === '/progreso') setCurrentTab('progreso');
    }
  };

  // Listen to popstate (browser back/forward) and initialize from URL
  useEffect(() => {
    const handlePopState = () => {
      const slug = getCurrentSlug();
      applySlugState(slug, false);
    };
    window.addEventListener('popstate', handlePopState);

    // Initial check
    const initialSlug = getCurrentSlug();
    applySlugState(initialSlug, false);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSlugNavigation = (slug: AppSlug) => {
    applySlugState(slug, true);
  };

  // Automatically prompt mini onboarding on first access if not yet completed
  React.useEffect(() => {
    if (userSession && userSession.isVerified && !userSession.hasCompletedOnboarding) {
      const timer = setTimeout(() => {
        setShowOnboardingModal(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [userSession?.hasCompletedOnboarding, userSession?.isVerified]);

  // Hydration state - starts zeroed out
  const [waterGlasses, setWaterGlasses] = useState<number>(0);

  // Meals state - all meals start uncompleted (0g)
  const [mealsState, setMealsState] = useState<MealsState>({
    breakfast: false,
    lunch: false,
    snack: false,
    dinner: false,
    supper: false,
  });

  // Dynamic protein calculation from consumed meals + cookbook logged recipes
  // Café da Manhã (30g) + Almoço (38g) + Lanche (24g) + Jantar (30g) + Ceia (20g)
  const currentProtein =
    (mealsState.breakfast ? 30 : 0) +
    (mealsState.lunch ? 38 : 0) +
    (mealsState.snack ? 24 : 0) +
    (mealsState.dinner ? 30 : 0) +
    (mealsState.supper ? 20 : 0) +
    cookbookExtraProtein;
  const targetProtein = 115;

  // Workout state - starts zeroed out (0 completed sets)
  const [completedWorkoutSets, setCompletedWorkoutSets] = useState<number>(0);
  const [loggedWorkoutSets, setLoggedWorkoutSets] = useState<LoggedSet[]>([]);

  // Habits state - starts zeroed out / uncompleted
  const [habits, setHabits] = useState<HabitItem[]>([
    {
      id: 'h1',
      title: 'Creatina 5g con el desayuno',
      subtitle: 'Pendiente',
      completed: false,
    },
    {
      id: 'h2',
      title: 'Completar Glúteos A (Tensión)',
      subtitle: '0 de 4 series',
      completed: false,
    },
    {
      id: 'h3',
      title: 'Alcanzar meta de 115g de proteína',
      subtitle: '0 / 115g',
      completed: false,
    },
    {
      id: 'h4',
      title: '8.000 pasos / Caminata activa',
      subtitle: '0 / 8.000 pasos',
      completed: false,
    },
  ]);

  const handleToggleMeal = (mealKey: keyof MealsState) => {
    setMealsState((prev) => {
      const next = { ...prev, [mealKey]: !prev[mealKey] };
      const nextProtein =
        (next.breakfast ? 30 : 0) +
        (next.lunch ? 38 : 0) +
        (next.snack ? 24 : 0) +
        (next.dinner ? 30 : 0) +
        (next.supper ? 20 : 0) +
        cookbookExtraProtein;

      // Synchronize habit h3
      setHabits((hList) =>
        hList.map((h) => {
          if (h.id === 'h3') {
            return {
              ...h,
              subtitle: `${nextProtein} / ${targetProtein}g`,
              completed: nextProtein >= targetProtein,
            };
          }
          return h;
        })
      );

      return next;
    });
  };

  const handleAddCookbookProtein = (grams: number) => {
    setCookbookExtraProtein((prev) => {
      const nextExtra = prev + grams;
      const totalProtein =
        (mealsState.breakfast ? 30 : 0) +
        (mealsState.lunch ? 38 : 0) +
        (mealsState.snack ? 24 : 0) +
        (mealsState.dinner ? 30 : 0) +
        (mealsState.supper ? 20 : 0) +
        nextExtra;

      setHabits((hList) =>
        hList.map((h) => {
          if (h.id === 'h3') {
            return {
              ...h,
              subtitle: `${totalProtein} / ${targetProtein}g`,
              completed: totalProtein >= targetProtein,
            };
          }
          return h;
        })
      );

      return nextExtra;
    });
  };

  const handleResetMeals = () => {
    setMealsState({
      breakfast: false,
      lunch: false,
      snack: false,
      dinner: false,
      supper: false,
    });
    setCookbookExtraProtein(0);
    setHabits((hList) =>
      hList.map((h) => {
        if (h.id === 'h3') {
          return {
            ...h,
            subtitle: `0 / ${targetProtein}g`,
            completed: false,
          };
        }
        return h;
      })
    );
  };

  const handleUpdateWorkoutSets = (logs: LoggedSet[]) => {
    const count = logs.filter((s) => s.completed).length;
    setCompletedWorkoutSets(count);
    setLoggedWorkoutSets(logs);
    setHabits((hList) =>
      hList.map((h) => {
        if (h.id === 'h2') {
          return {
            ...h,
            subtitle: `${count} de 4 series ${count >= 4 ? '· Completado ✓' : ''}`,
            completed: count >= 4,
          };
        }
        return h;
      })
    );
  };

  const handleResetWorkout = () => {
    setCompletedWorkoutSets(0);
    setLoggedWorkoutSets([]);
    setHabits((hList) =>
      hList.map((h) => {
        if (h.id === 'h2') {
          return {
            ...h,
            subtitle: '0 de 4 series',
            completed: false,
          };
        }
        return h;
      })
    );
  };

  const handleResetAll = () => {
    setWaterGlasses(0);
    handleResetMeals();
    handleResetWorkout();
    setHabits([
      {
        id: 'h1',
        title: 'Creatina 5g con el desayuno',
        subtitle: 'Pendiente',
        completed: false,
      },
      {
        id: 'h2',
        title: 'Completar Glúteos A (Tensión)',
        subtitle: '0 de 4 series',
        completed: false,
      },
      {
        id: 'h3',
        title: 'Alcanzar meta de 115g de proteína',
        subtitle: '0 / 115g',
        completed: false,
      },
      {
        id: 'h4',
        title: '8.000 pasos / Caminata activa',
        subtitle: '0 / 8.000 pasos',
        completed: false,
      },
    ]);
  };

  const handleLoginSuccess = (session: ServerSession) => {
    setServerSession(session);
  };

  const handleAddWater = () => {
    if (waterGlasses < 8) {
      setWaterGlasses((prev) => prev + 1);
    }
  };

  const handleRemoveWater = () => {
    if (waterGlasses > 0) {
      setWaterGlasses((prev) => prev - 1);
    }
  };

  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const handleNavigate = (tab: TabType, prompt?: string) => {
    if (prompt) {
      setInitialCoachPrompt(prompt);
    }
    const slugMap: Record<TabType, AppSlug> = {
      inicio: '/inicio',
      entrenar: '/entrenar',
      comidas: '/comidas',
      'coach-ai': '/coach-ai',
      progreso: '/progreso',
    };
    const targetSlug = slugMap[tab] || '/inicio';
    applySlugState(targetSlug, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    clearLocalProfile();
    setProfile({});
    setServerSession(null);
    navigateToSlug('/inicio', true);
  };

  // 1. Hidden upsell page (Hotmart redirects buyers here right after the main purchase)
  if (onUpsellPage) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] text-[#2B0B2E] flex flex-col font-sans">
        <UpsellPage
          onDeclineUpsell={() => {
            window.location.href = APP_PATH;
          }}
        />
      </div>
    );
  }

  // 2. Purchase verification
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF3377] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userSession) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] text-[#2B0B2E] flex flex-col font-sans">
        <PurchaseAuthScreen onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // 3. Member Area App
  const activeUserSession = userSession;

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#2B0B2E] flex flex-col font-sans selection:bg-[#FF3377] selection:text-white">
      {/* Sticky Top Header */}
      <TopHeader
        currentTab={currentTab}
        currentSlug={currentSlug}
        userSession={activeUserSession}
        onLogout={handleLogout}
        onOpenQuiz={() => handleSlugNavigation('/quiz')}
        onUpdateSession={(updated) => setUserSession(updated)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onNavigateSlug={handleSlugNavigation}
      />

      {/* Main Content Area - Responsive Expansion for PC & Mobile */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28">
        {currentTab === 'inicio' && (
          <InicioTab
            onNavigate={handleNavigate}
            waterGlasses={waterGlasses}
            onAddWater={handleAddWater}
            onRemoveWater={handleRemoveWater}
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onOpenQuiz={() => handleSlugNavigation('/quiz')}
            currentProtein={currentProtein}
            completedWorkoutSets={completedWorkoutSets}
            onResetAll={handleResetAll}
            userSession={activeUserSession}
            onUpdateSession={(updated) => setUserSession(updated)}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
            onOpenCookbook={() => handleSlugNavigation('/receitas')}
          />
        )}

        {currentTab === 'entrenar' && (
          <EntrenarTab
            onNavigate={handleNavigate}
            completedSetsCount={completedWorkoutSets}
            loggedSets={loggedWorkoutSets}
            onUpdateSets={handleUpdateWorkoutSets}
            onResetWorkout={handleResetWorkout}
          />
        )}

        {currentTab === 'comidas' && (
          <ComidasTab
            mealsState={mealsState}
            onToggleMeal={handleToggleMeal}
            onResetMeals={handleResetMeals}
            currentProtein={currentProtein}
            targetProtein={targetProtein}
            onOpenCookbook={() => handleSlugNavigation('/receitas')}
          />
        )}

        {currentTab === 'coach-ai' && (
          <CoachAiTab
            initialPrompt={initialCoachPrompt}
            onClearInitialPrompt={() => setInitialCoachPrompt(undefined)}
          />
        )}

        {currentTab === 'progreso' && (
          <ProgresoTab
            onNavigate={handleNavigate}
            completedWorkoutSets={completedWorkoutSets}
            currentProtein={currentProtein}
            targetProtein={targetProtein}
            waterGlasses={waterGlasses}
            onResetAll={handleResetAll}
            userSession={activeUserSession}
            onUpdateSession={(updated) => setUserSession(updated)}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNavBar currentTab={currentTab} onSelectTab={(tab) => handleNavigate(tab)} />

      {/* Floating Procedural Audio Toggle */}
      <div className="fixed top-20 right-4 z-30">
        <SoundControl />
      </div>

      {/* High Conversion 28-Day Quiz Funnel Modal */}
      {showQuizModal && (
        <QuizFlowModal
          isOpen={showQuizModal}
          onClose={() => handleSlugNavigation('/inicio')}
          userSession={activeUserSession}
          onUpdateSession={(updated) => setUserSession(updated)}
          onOpenCookbook={() => handleSlugNavigation('/receitas')}
        />
      )}

      {/* Mini Onboarding Popup Modal (Profile Photo, Weight, Height & Day 1 Photo) */}
      {showOnboardingModal && (
        <MiniOnboardingModal
          isOpen={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
          userSession={activeUserSession}
          onSaveSession={(updated) => setUserSession(updated)}
        />
      )}

      {/* Protein Cookbook Modal (+50 Recetas Proteicas para Glúteos) */}
      {showCookbookModal && !activeUserSession.hasUpsell && (
        <div className="fixed inset-0 z-50 bg-[#2B0B2E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFF9E6] border-3 border-[#2B0B2E] w-full max-w-sm rounded-3xl p-5 shadow-[6px_6px_0_#2B0B2E] flex flex-col gap-3 text-center text-[#2B0B2E]">
            <span className="text-3xl">🔒</span>
            <h3 className="font-display font-black text-lg">Libro de +50 Recetas Proteicas</h3>
            <p className="text-xs text-[#6C586B] leading-relaxed">
              Este contenido es parte del <strong>Protocolo Acelerador VIP</strong>.
            </p>
            {UPSELL_CHECKOUT_URL && (
              <a href={UPSELL_CHECKOUT_URL} className="cta-button no-underline">
                <span>⚡ Desbloquear Acelerador VIP</span>
                <span className="button-sheen" />
              </a>
            )}
            <button
              type="button"
              onClick={() => handleSlugNavigation('/comidas')}
              className="text-xs font-bold text-[#6C586B] underline cursor-pointer"
            >
              Volver
            </button>
          </div>
        </div>
      )}

      {showCookbookModal && activeUserSession.hasUpsell && (
        <ProteinCookbookModal
          isOpen={showCookbookModal}
          onClose={() => handleSlugNavigation('/comidas')}
          onAddProtein={handleAddCookbookProtein}
        />
      )}
    </div>
  );
}
