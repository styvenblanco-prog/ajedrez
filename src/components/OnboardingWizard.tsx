/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, ChevronRight, Award, Flame, Zap, Target, Clock } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (data: { elo: number; targetElo: number; dailyGoalMinutes: number }) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [elo, setElo] = useState<number>(1000);
  const [targetElo, setTargetElo] = useState<number>(1400);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(15);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({ elo, targetElo, dailyGoalMinutes });
    }
  };

  const eloOptions = [
    { label: 'Principiante', desc: 'Conozco las reglas básicas', value: 800, icon: Award, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Intermedio', desc: 'Juego partidas y conozco tácticas comunes', value: 1200, icon: Zap, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Avanzado', desc: 'Compito regularmente y estudio aperturas', value: 1600, icon: Trophy, color: 'text-purple-500 bg-purple-500/10' },
  ];

  const targetOptions = [
    { label: 'Subir +100 ELO', desc: 'Mejora constante y gradual', add: 100 },
    { label: 'Subir +300 ELO', desc: 'Entrenamiento táctico intensivo', add: 300 },
    { label: 'Subir +500 ELO', desc: '¡Meta de Maestro táctico!', add: 500 },
  ];

  const timeOptions = [
    { label: 'Casual', minutes: 5, desc: 'Ideal para agendas muy ocupadas' },
    { label: 'Serio', minutes: 15, desc: 'Recomendado para ver progresos' },
    { label: 'Intenso', minutes: 30, desc: 'Dominio táctico garantizado' },
  ];

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col justify-between bg-slate-900 text-slate-100 p-6 select-none">
      
      {/* Top Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-slate-400">Paso {step} de 3</span>
          <div className="flex space-x-1.5">
            <div className={`h-2 w-12 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
            <div className={`h-2 w-12 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
            <div className={`h-2 w-12 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="mt-4">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-white">¿Cuál es tu nivel de juego actual?</h1>
                <p className="text-sm text-slate-400">Estimaremos tu nivel táctico inicial según tu experiencia.</p>
              </div>

              <div className="space-y-3 mt-6">
                {eloOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = elo === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setElo(opt.value)}
                      id={`opt-elo-${opt.value}`}
                      className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/5' 
                          : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg mr-4 ${opt.color}`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-base">{opt.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                      </div>
                      <div className="text-xs font-mono px-2 py-1 bg-slate-800 rounded-md text-emerald-400 font-bold">
                        ~{opt.value} ELO
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-white">¿Cuál es tu meta de juego?</h1>
                <p className="text-sm text-slate-400">Configuraremos el algoritmo para que se adapte a tu nivel aspiracional.</p>
              </div>

              <div className="space-y-3 mt-6">
                {targetOptions.map((opt) => {
                  const calculatedTarget = elo + opt.add;
                  const isSelected = targetElo === calculatedTarget;
                  return (
                    <button
                      key={opt.add}
                      onClick={() => setTargetElo(calculatedTarget)}
                      id={`opt-target-${opt.add}`}
                      className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/5' 
                          : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg mr-4 ${isSelected ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-800'}`}>
                        <Target size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-base">{opt.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                      </div>
                      <div className="text-xs font-mono px-26 py-1 bg-slate-800 rounded-md text-emerald-400 font-bold">
                        {calculatedTarget} ELO
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2 text-center md:text-left">
                <h1 className="text-2xl font-bold tracking-tight text-white">¿Cuál es tu meta diaria diario?</h1>
                <p className="text-sm text-slate-400">Duolingo nos enseña que el hábito diario hace al maestro.</p>
              </div>

              <div className="space-y-3 mt-6">
                {timeOptions.map((opt) => {
                  const isSelected = dailyGoalMinutes === opt.minutes;
                  return (
                    <button
                      key={opt.minutes}
                      onClick={() => setDailyGoalMinutes(opt.minutes)}
                      id={`opt-time-${opt.minutes}`}
                      className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/5' 
                          : 'border-slate-800 bg-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg mr-4 ${isSelected ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-800'}`}>
                        <Clock size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-base">{opt.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                      </div>
                      <div className="text-xs font-mono px-2 py-1 bg-slate-800 rounded-md text-emerald-400 font-bold whitespace-nowrap">
                        {opt.minutes} min / día
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Hero Illustration Character/Quote */}
      <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl mt-6 flex items-start space-x-3">
        <div className="text-3xl">🦉</div>
        <div>
          <p className="text-xs italic text-slate-300">
            {step === 1 && '"Un gran viaje de mil millas comienza con un solo movimiento en el tablero mental."'}
            {step === 2 && '"Establecer metas claras te da la brújula táctica necesaria para castigar las imprecisiones de tu rival."'}
            {step === 3 && '"Incluso 5 minutos al día de enfoque táctico evitan que tu cerebro pierda el patrón de cálculo geométrico."'}
          </p>
          <p className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase mt-1">Guía Táctico</p>
        </div>
      </div>

      {/* Main Action buttons */}
      <div className="mt-8">
        <button
          onClick={handleNext}
          id="btn-onboarding-next"
          className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 transition-all text-slate-950 font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 text-base cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          <span>{step === 3 ? '¡Comenzar Entrenamiento!' : 'Siguiente'}</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
export default OnboardingWizard;
