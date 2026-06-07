/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { OnboardingWizard } from './components/OnboardingWizard';
import { TrainingScreen } from './components/TrainingScreen';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CHESS_PUZZLES } from './data/puzzles';
import { UserProgress } from './types';
import { Swords, Award, Users, ShieldAlert, Sparkles } from 'lucide-react';

// Default initial state for local progress
const DEFAULT_PROGRESS: UserProgress = {
  elo: 1000,
  targetElo: 1400,
  dailyGoalMinutes: 15,
  xp: 0,
  streak: 12, // Starting streak demo, Duolingo-style
  lives: 3,
  level: 1,
  completedPuzzles: [],
  accuracyByTheme: {
    'Mate en 1': { correct: 0, total: 0 },
    'Ataque Doble': { correct: 0, total: 0 },
    'Clavada Alfil': { correct: 0, total: 0 },
  }
};

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('chess_tactics_ux_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROGRESS;
      }
    }
    return DEFAULT_PROGRESS;
  });

  // Check if user has finished onboarding
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('chess_tactics_onboarded') === 'true';
  });

  // Current selected view tab
  const [currentTab, setCurrentTab] = useState<'train' | 'progress' | 'admin'>('train');

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('chess_tactics_ux_progress', JSON.stringify(progress));
  }, [progress]);

  const handleOnboardingComplete = (data: { elo: number; targetElo: number; dailyGoalMinutes: number }) => {
    setProgress((prev) => ({
      ...prev,
      elo: data.elo,
      targetElo: data.targetElo,
      dailyGoalMinutes: data.dailyGoalMinutes,
    }));
    setIsOnboarded(true);
    localStorage.setItem('chess_tactics_onboarded', 'true');
  };

  const handleResetProgress = () => {
    if (confirm('¿Estás seguro de que deseas restablecer todo tu progreso? Volverás a la pantalla de Onboarding.')) {
      setProgress(DEFAULT_PROGRESS);
      setIsOnboarded(false);
      setCurrentTab('train');
      localStorage.removeItem('chess_tactics_onboarded');
      localStorage.removeItem('chess_tactics_ux_progress');
    }
  };

  // Helper callback to mutate state using standard updater functions
  const handleUpdateProgress = (updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => updater(prev));
  };

  // Onboarding Screen Render
  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 md:p-6 select-none font-sans">
        {/* On Desktop/Tablet, wrap in a gorgeous simulated mobile phone screen bezel for beautiful UX presentability */}
        <div className="w-full max-w-md md:rounded-[40px] md:border-[10px] md:border-slate-800 bg-slate-900 md:shadow-2xl md:ring-1 md:ring-slate-700/50 overflow-hidden relative min-h-screen md:min-h-[820px] flex flex-col justify-between">
          
          {/* Simulated top status bar/notch for high premium detail */}
          <div className="hidden md:flex justify-between items-center px-8 py-2 bg-slate-950 text-[10px] font-mono text-slate-500 select-none">
            <span>14:08 ♟️</span>
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto" />
            <span>PWA 100%</span>
          </div>

          <OnboardingWizard onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-0 md:p-6 font-sans">
      {/* Sleek mobile mockup wrapper on desktop sizing */}
      <div className="w-full max-w-md md:rounded-[40px] md:border-[10px] md:border-slate-800 bg-slate-900 md:shadow-2xl md:ring-1 md:ring-slate-700/50 overflow-hidden relative min-h-screen md:min-h-[820px] flex flex-col justify-between">
        
        {/* Top bar mockup */}
        <div className="hidden md:flex justify-between items-center px-8 py-2 bg-slate-950 text-[10px] font-mono text-slate-500 z-10 select-none">
          <span>Active Practice</span>
          <div className="w-20 h-3 bg-slate-900 rounded-full" />
          <span>LTE 🔋</span>
        </div>

        {/* Scrollable primary content */}
        <div className="flex-1 overflow-y-auto">
          {currentTab === 'train' && (
            <TrainingScreen 
              puzzles={CHESS_PUZZLES} 
              progress={progress} 
              onUpdateProgress={handleUpdateProgress} 
            />
          )}

          {currentTab === 'progress' && (
            <ProgressDashboard 
              progress={progress} 
              onResetProgress={handleResetProgress}
            />
          )}

          {currentTab === 'admin' && (
            <AdminDashboard />
          )}
        </div>

        {/* Database & Chess.js Architecture Info Bar */}
        <div className="bg-slate-950/60 border-t border-slate-900 px-4 py-2 flex items-center justify-center space-x-1.5 opacity-90 select-none">
          <ShieldAlert size={12} className="text-emerald-400" />
          <span className="text-[9px] text-slate-400 text-center font-medium">
            Entorno de Prueba local: Persistencia por LocalStorage.
          </span>
        </div>

        {/* Bottom Navigation (Duolingo visual aesthetics!) */}
        <div className="absolute bottom-0 left-0 right-0 h-[66px] bg-slate-950 border-t border-slate-950/80 p-1 px-4 flex justify-around items-center z-10">
          
          {/* Train Tab */}
          <button
            onClick={() => setCurrentTab('train')}
            id="tab-btn-train"
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all relative cursor-pointer ${
              currentTab === 'train' 
                ? 'text-emerald-400 font-extrabold' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Swords size={20} className={currentTab === 'train' ? 'scale-110 text-emerald-400 filter drop-shadow-[0_0_3px_rgba(16,185,129,0.3)]' : ''} />
            <span className="text-[10px] tracking-wide mt-1 uppercase font-black">Entrenar</span>
            {currentTab === 'train' && (
              <div className="absolute top-0 w-8 h-1 bg-emerald-400 rounded-full" />
            )}
          </button>

          {/* Progress Tab */}
          <button
            onClick={() => setCurrentTab('progress')}
            id="tab-btn-progress"
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all relative cursor-pointer ${
              currentTab === 'progress' 
                ? 'text-amber-400 font-extrabold' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Award size={20} className={currentTab === 'progress' ? 'scale-110 text-amber-400 filter drop-shadow-[0_0_3px_rgba(245,158,11,0.3)]' : ''} />
            <span className="text-[10px] tracking-wide mt-1 uppercase font-black">Progreso</span>
            {currentTab === 'progress' && (
              <div className="absolute top-0 w-8 h-1 bg-amber-400 rounded-full" />
            )}
          </button>

          {/* Admin Tab */}
          <button
            onClick={() => setCurrentTab('admin')}
            id="tab-btn-admin"
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all relative cursor-pointer ${
              currentTab === 'admin' 
                ? 'text-cyan-400 font-extrabold' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Users size={20} className={currentTab === 'admin' ? 'scale-110 text-cyan-400 filter drop-shadow-[0_0_3px_rgba(34,211,238,0.3)]' : ''} />
            <span className="text-[10px] tracking-wide mt-1 uppercase font-black">Admin</span>
            {currentTab === 'admin' && (
              <div className="absolute top-0 w-8 h-1 bg-cyan-400 rounded-full" />
            )}
          </button>
        </div>

      </div>

      {/* Production & Copyable Integration Comments Panel (Architectural design) */}
      <div className="hidden lg:flex flex-col w-80 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-300 space-y-4 ml-6 self-start mt-6">
        <h3 className="text-sm font-bold text-white flex items-center space-x-1.5 border-b border-slate-800 pb-2.5">
          <Sparkles size={16} className="text-emerald-400" />
          <span>Guía de Conexión Real</span>
        </h3>
        
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-emerald-400 uppercase tracking-widest text-[10px]">1. Chess.js para Validación</h4>
            <p className="text-slate-400 mt-1 leading-relaxed">
              Para escalar a millones de posiciones FEN variables:
            </p>
            <pre className="bg-slate-950 p-2 rounded text-[10px] font-mono text-slate-300 mt-1.5 overflow-x-auto whitespace-pre">
{`import { Chess } from 'chess.js';
const engine = new Chess(fen);
const rawMove = engine.move({
  from: 'c1', to: 'c8',
  promotion: 'q'
});
if (rawMove) {
  // ¡Jugada legal certificada!
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-bold text-amber-500 uppercase tracking-widest text-[10px]">2. Firebase / Supabase</h4>
            <p className="text-slate-400 mt-1 leading-relaxed">
              Sustituye la manipulación de <code className="text-white font-semibold">localStorage</code> por persistencia remota:
            </p>
            <pre className="bg-slate-950 p-2 rounded text-[10px] font-mono text-slate-300 mt-1.5 overflow-x-auto whitespace-pre">
{`// Guardar XP en DB en tiempo real
await supabase
  .from('alumnos')
  .update({ xp: progress.xp })
  .eq('id', user.id);`}
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
}
