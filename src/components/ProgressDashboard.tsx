/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, Zap, BookOpen, Target, CheckCircle, Flame, Star, ChevronRight } from 'lucide-react';
import { UserProgress } from '../types';

interface ProgressDashboardProps {
  progress: UserProgress;
  onResetProgress: () => void;
  onAdminLoginClick: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ progress, onResetProgress, onAdminLoginClick }) => {
  // Level definitions
  const getLevelTitle = (level: number) => {
    if (level < 3) return 'Novato del Tablero';
    if (level < 6) return 'Táctico Intermedio';
    if (level < 9) return 'Calculador Olimpico';
    return 'Maestro del Mate';
  };

  const levelProgressPercent = ((progress.xp % 100) / 100) * 100;
  const currentLevelNumber = Math.floor(progress.xp / 100) + 1;

  // Manual bar chart items for tactical themes
  const accuracyThemes = [
    { name: 'Clavadas (Pins)', precision: 80, color: 'bg-emerald-500', icon: '📎' },
    { name: 'Ataques dobles', precision: 65, color: 'bg-amber-500', icon: '⚔️' },
    { name: 'Mate en 1 (Pasillo)', precision: 90, color: 'bg-indigo-500', icon: '👑' },
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 text-slate-100 p-5 pb-24 min-h-[calc(100vh-66px)]">
      
      {/* Header Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Tu Perfil de Progreso</h1>
        <p className="text-xs text-slate-400 mt-1">Sigue tu evolución táctica y mantén tu constancia diaria.</p>
      </div>

      {/* Main Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 relative overflow-hidden mb-6"
      >
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
          <Award size={140} className="text-amber-400" />
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center border-2 border-slate-950 shadow-lg text-slate-950 font-black text-xl">
            {currentLevelNumber}
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">Nivel {currentLevelNumber}</span>
            <h2 className="text-lg font-black text-white">{getLevelTitle(currentLevelNumber)}</h2>
            <p className="text-xs text-slate-300 mt-0.5">Siguiente nivel en {100 - (progress.xp % 100)} XP</p>
          </div>
        </div>

        {/* Progress gauge bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Progreso de Nivel</span>
            <span className="text-amber-400 font-bold">{Math.round(levelProgressPercent)}%</span>
          </div>
          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div 
              style={{ width: `${Math.max(5, levelProgressPercent)}%` }} 
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Duolingo Streak Habit Calendar simulation */}
      <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800/80 mb-6">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center space-x-1.5">
          <Flame size={16} className="text-amber-500 fill-amber-500/20" />
          <span>Rastreador de Constancia</span>
        </h3>
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, idx) => {
            // Highlighting active streaks (e.g. simulation days)
            const isCompleted = idx < progress.streak % 7 || progress.streak > 0;
            return (
              <div key={day} className="space-y-1.5">
                <span className="text-slate-500 font-bold">{day}</span>
                <div className={`aspect-square w-full rounded-lg flex items-center justify-center border transition-all ${
                  isCompleted 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-black' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-600'
                }`}>
                  {isCompleted ? '🔥' : '•'}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-3 font-semibold">
          ¡Entrenas {progress.dailyGoalMinutes} min al día! Mantienes una racha activa de <span className="text-amber-400 font-bold">{progress.streak} días</span>.
        </p>
      </div>

      {/* Accuracy By Chess Theme bar chart section */}
      <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800/80 mb-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-1.5">
          <BookOpen size={16} className="text-emerald-400" />
          <span>Precisión por Tema Táctico</span>
        </h3>

        <div className="space-y-4">
          {accuracyThemes.map((theme) => (
            <div key={theme.name} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-1.5 text-slate-200">
                  <span>{theme.icon}</span>
                  <span className="font-semibold">{theme.name}</span>
                </div>
                <span className="font-bold text-white bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-lg text-[10px]">
                  {theme.precision}% Precisión
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${theme.precision}%` }} 
                  className={`h-full ${theme.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics badges grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800/60">
          <span className="text-[10px] uppercase font-bold text-slate-400">Tácticas Completadas</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{progress.completedPuzzles.length}</p>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800/60">
          <span className="text-[10px] uppercase font-bold text-slate-400">Meta Aspiracional</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{progress.targetElo} ELO</p>
        </div>
      </div>

      {/* Danger Zone Reset Option */}
      <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/40 flex items-center justify-between text-left">
        <div>
          <h4 className="text-xs font-bold text-slate-300">¿Quieres configurar de nuevo?</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Esto reiniciará tu progreso de onboarding.</p>
        </div>
        <button
          onClick={onResetProgress}
          id="btn-progress-reset"
          className="text-xs text-red-400 font-bold hover:text-red-300 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all px-3 py-1.5 rounded-lg cursor-pointer"
        >
          Reiniciar
        </button>
      </div>

      {/* Admin entry point - Small, discrete and unnoticeable */}
      <div className="mt-8 flex justify-center pb-2">
        <button
          onClick={onAdminLoginClick}
          id="btn-admin-access-discreet"
          className="text-[10px] text-slate-600 hover:text-slate-400 font-semibold uppercase tracking-wider transition-all cursor-pointer bg-transparent border-none p-2"
        >
          Acceso Admin
        </button>
      </div>

    </div>
  );
};
export default ProgressDashboard;
