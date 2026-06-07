/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Heart, Trophy, RefreshCw, SkipForward, ArrowRight, HelpCircle, Check, Info, AlertTriangle } from 'lucide-react';
import { ChessPuzzle, UserProgress } from '../types';
import { ChessPieceIcon } from './ChessPieceIcon';
import { sounds } from '../utils/sound';

interface TrainingScreenProps {
  puzzles: ChessPuzzle[];
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const TrainingScreen: React.FC<TrainingScreenProps> = ({ puzzles, progress, onUpdateProgress }) => {
  // Puzzle tracking
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const activePuzzle = puzzles[currentPuzzleIndex] || puzzles[0];

  // Board board state representing current positions (can change during solving move)
  const [board, setBoard] = useState<(any | null)[][]>([]);
  const [selectedSquare, setSelectedSquare] = useState<{ r: number; c: number } | null>(null);
  const [solvedState, setSolvedState] = useState<'solving' | 'correct' | 'incorrect' | 'fail_lives'>('solving');
  const [lastMove, setLastMove] = useState<{ from: { r: number; c: number }; to: { r: number; c: number } } | null>(null);

  // Initialize board for the current puzzle
  useEffect(() => {
    if (activePuzzle) {
      // Deep copy the board
      const clonedBoard = activePuzzle.initialBoard.map((row) =>
        row.map((val) => (val ? { ...val } : null))
      );
      setBoard(clonedBoard);
      setSelectedSquare(null);
      setSolvedState('solving');
      setLastMove(null);
    }
  }, [activePuzzle, currentPuzzleIndex]);

  // Handle tile click
  const handleTileClick = (r: number, c: number) => {
    if (solvedState !== 'solving') return;
    if (progress.lives <= 0) {
      setSolvedState('fail_lives');
      return;
    }

    const clickedPiece = board[r][c];

    // If no piece is selected yet
    if (!selectedSquare) {
      if (clickedPiece && clickedPiece.color === 'w') {
        setSelectedSquare({ r, c });
        sounds.playMove();
      }
      return;
    }

    // If clicking the same square, deselect
    if (selectedSquare.r === r && selectedSquare.c === c) {
      setSelectedSquare(null);
      sounds.playMove();
      return;
    }

    // If clicking another white piece, change selection
    if (clickedPiece && clickedPiece.color === 'w') {
      setSelectedSquare({ r, c });
      sounds.playMove();
      return;
    }

    // Otherwise, attempt a move
    const fromSquare = selectedSquare;
    const toSquare = { r, c };

    // Move piece on localized board
    const updatedBoard = board.map((row) => [...row]);
    const movingPiece = updatedBoard[fromSquare.r][fromSquare.c];
    updatedBoard[toSquare.r][toSquare.c] = movingPiece;
    updatedBoard[fromSquare.r][fromSquare.c] = null;
    
    setBoard(updatedBoard);
    sounds.playMove();

    // Check solution
    const expectedMove = activePuzzle.solution[0];
    const isCorrect = 
      fromSquare.r === expectedMove.from.r && 
      fromSquare.c === expectedMove.from.c &&
      toSquare.r === expectedMove.to.r &&
      toSquare.c === expectedMove.to.c;

    if (isCorrect) {
      sounds.playSuccess();
      setSolvedState('correct');
      setLastMove({ from: fromSquare, to: toSquare });
      
      // Update XP, streak, and log completed puzzle
      onUpdateProgress((prev) => {
        const theme = activePuzzle.theme;
        const currentAccuracy = prev.accuracyByTheme[theme] || { correct: 0, total: 0 };
        
        return {
          ...prev,
          xp: prev.xp + 10,
          streak: prev.streak + 1,
          completedPuzzles: prev.completedPuzzles.includes(activePuzzle.id) 
            ? prev.completedPuzzles 
            : [...prev.completedPuzzles, activePuzzle.id],
          accuracyByTheme: {
            ...prev.accuracyByTheme,
            [theme]: {
              correct: currentAccuracy.correct + 1,
              total: currentAccuracy.total + 1,
            },
          },
        };
      });
    } else {
      sounds.playError();
      setSolvedState('incorrect');
      setLastMove({ from: fromSquare, to: toSquare });

      // Deduct a life
      onUpdateProgress((prev) => {
        const theme = activePuzzle.theme;
        const currentAccuracy = prev.accuracyByTheme[theme] || { correct: 0, total: 0 };
        const nextLives = Math.max(0, prev.lives - 1);
        
        return {
          ...prev,
          lives: nextLives,
          streak: 0, // Reset streak on mistake, Duolingo-style!
          accuracyByTheme: {
            ...prev.accuracyByTheme,
            [theme]: {
              ...currentAccuracy,
              total: currentAccuracy.total + 1,
            },
          },
        };
      });
    }

    setSelectedSquare(null);
  };

  // Get index labels for chessboard (a-h and 8-1)
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const handleNextPuzzle = () => {
    setSelectedSquare(null);
    setSolvedState('solving');
    setCurrentPuzzleIndex((prev) => (prev + 1) % puzzles.length);
  };

  const handleRetryPuzzle = () => {
    // Reset board back to initial
    const clonedBoard = activePuzzle.initialBoard.map((row) =>
      row.map((val) => (val ? { ...val } : null))
    );
    setBoard(clonedBoard);
    setSelectedSquare(null);
    setSolvedState('solving');
    setLastMove(null);
  };

  const handleRefillLives = () => {
    sounds.playSuccess();
    onUpdateProgress((prev) => ({
      ...prev,
      lives: 3,
    }));
    setSolvedState('solving');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 text-slate-100 flex flex-col justify-between min-h-[calc(100vh-66px)] pb-24">
      
      {/* Upper Status Header */}
      <div className="bg-slate-800/80 backdrop-blur-md sticky top-0 z-10 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
        {/* Streak 🔥 */}
        <div className="flex items-center space-x-1.5" title="Racha de días entrenando">
          <div className="p-1 px-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center space-x-1 font-bold text-sm">
            <Flame size={16} className="fill-amber-500 stroke-amber-600 animate-pulse" />
            <span>{progress.streak}</span>
          </div>
        </div>

        {/* Lives ❤️ */}
        <div className="flex items-center space-x-1" title="Vidas restantes">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              size={20}
              className={`transition-all duration-300 ${
                i < progress.lives 
                  ? 'fill-red-500 text-red-500 scale-100 filter drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]' 
                  : 'text-slate-600 scale-90'
              }`}
            />
          ))}
          {progress.lives === 0 && (
            <button 
              onClick={handleRefillLives}
              id="btn-refill-lives-mini"
              className="ml-2 text-[10px] bg-red-500/20 text-red-400 font-bold px-1.5 py-0.5 rounded cursor-pointer hover:bg-red-500/30 transition-all border border-red-500/30 uppercase tracking-widest"
            >
              Cargar
            </button>
          )}
        </div>

        {/* XP 🏆 */}
        <div className="flex items-center space-x-1.5" title="XP acumulada">
          <div className="p-1 px-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center space-x-1 font-bold text-sm">
            <Trophy size={15} className="text-emerald-400" />
            <span>{progress.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Main Chess Board Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        
        {/* Level and Theme prompt card */}
        <div className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-800/90 rounded-2xl p-4 mb-4 text-center">
          <span className="text-[10px] font-bold text-emerald-400 tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase">
            Táctica: {activePuzzle.theme}
          </span>
          <h2 className="text-lg font-bold text-white mt-2.5 leading-snug">
            {activePuzzle.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 font-medium italic">
            "{activePuzzle.description}"
          </p>
          <div className="flex items-center justify-center space-x-1.5 text-xs text-amber-400 font-bold font-mono mt-2">
            <span className="bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/10">🤖 Elo inicial: {activePuzzle.rating}</span>
          </div>
        </div>

        {/* The Chessboard Grid */}
        <div className="relative w-full aspect-square max-w-[360px] bg-slate-950 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800">
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
            {Array.from({ length: 8 }).map((_, r) => (
              <React.Fragment key={r}>
                {Array.from({ length: 8 }).map((_, c) => {
                  const piece = board[r]?.[c];
                  const isDarkTile = (r + c) % 2 === 1;
                  const isSelected = selectedSquare?.r === r && selectedSquare?.c === c;
                  
                  // Style colors (Clean Minimalism slate palette)
                  let bgClass = isDarkTile ? 'bg-[#334155]' : 'bg-[#94A3B8]'; // Slate dark and Slate light
                  
                  // Highlights:
                  if (isSelected) {
                    bgClass = 'bg-emerald-500/80 ring-4 ring-emerald-400/60';
                  }

                  // Trace last move
                  const isCurrentLastMove = lastMove && 
                    ((lastMove.from.r === r && lastMove.from.c === c) || 
                     (lastMove.to.r === r && lastMove.to.c === c));

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => handleTileClick(r, c)}
                      id={`tile-${r}-${c}`}
                      className={`relative aspect-square flex items-center justify-center cursor-pointer transition-all duration-150 select-none ${bgClass}`}
                    >
                      {/* Render chess piece */}
                      {piece && (
                        <div className="w-[82%] h-[82%] z-5 filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-transform duration-100">
                          <ChessPieceIcon type={piece.type} color={piece.color} />
                        </div>
                      )}

                      {/* Small Coordinates markers inside corner spaces (e.g. rank number on left edge, file letter on bottom edge) */}
                      {c === 0 && (
                        <span className={`absolute top-0.5 left-0.5 text-[8px] font-mono font-bold ${isDarkTile ? 'text-slate-400/80' : 'text-slate-700/80'}`}>
                          {ranks[r]}
                        </span>
                      )}
                      {r === 7 && (
                        <span className={`absolute bottom-0.5 right-1.5 text-[8px] font-mono font-bold ${isDarkTile ? 'text-slate-400/80' : 'text-slate-700/80'}`}>
                          {cols[c]}
                        </span>
                      )}

                      {/* Expected destination helper dot when selected */}
                      {selectedSquare && !piece && (
                        <div className="absolute w-3 h-3 rounded-full bg-emerald-500/40 pointer-events-none" />
                      )}

                      {/* Last move translucent markers */}
                      {isCurrentLastMove && (
                        <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-400/30 pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Locked out state when life is drained */}
          {progress.lives <= 0 && solvedState === 'solving' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-center items-center p-6 text-center z-10 animate-fade-in">
              <AlertTriangle className="text-red-500 animate-bounce mb-3" size={40} />
              <h3 className="text-lg font-bold text-white mb-1">¡Sin Vidas en tu Carcaj!</h3>
              <p className="text-xs text-slate-300 max-w-xs mb-4">
                Has agotado tus oportunidades. Duolingo nos alienta a respirar y rellenar vidas para seguir afinando tu instinto táctico.
              </p>
              <button
                onClick={handleRefillLives}
                id="btn-refill-lives-board"
                className="bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 hover:bg-emerald-400 active:scale-95 transition-all cursor-pointer"
              >
                <Heart size={14} className="fill-slate-950" />
                <span>Restaurar Vidas ❤️</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Instructional Indicator */}
        <div className="mt-4 flex items-center space-x-2 text-xs bg-slate-800/30 px-4 py-2.5 rounded-lg border border-slate-800/50 max-w-[360px] w-full text-center justify-center">
          <HelpCircle size={14} className="text-emerald-400" />
          <span className="text-slate-300 font-medium">{activePuzzle.instruction}</span>
        </div>
      </div>

      {/* Persistent Explanation card structure */}
      <div className="px-4 pb-2 text-center max-w-[360px] mx-auto">
        <p className="text-[10px] text-slate-500 font-serif leading-relaxed italic">
          * Para jugar, haz clic en la pieza blanca que quieres mover, y luego haz clic en la casilla objetivo.
        </p>
      </div>

      {/* Slidable Feedback Overlay (Duolingo Style!) */}
      <AnimatePresence>
        {solvedState !== 'solving' && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed bottom-16 left-0 right-0 max-w-md mx-auto p-5 pb-8 rounded-t-3xl border-t shadow-[0_-8px_30px_rgb(0,0,0,0.5)] z-20 ${
              solvedState === 'correct' 
                ? 'bg-emerald-950 border-emerald-500/30' 
                : 'bg-red-950 border-red-500/30'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-2xl flex-shrink-0 ${
                solvedState === 'correct' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {solvedState === 'correct' ? <Check size={28} strokeWidth={3} /> : <Info size={28} strokeWidth={2} />}
              </div>
              
              <div className="flex-1 space-y-1">
                <h3 className={`text-lg font-black tracking-tight ${
                  solvedState === 'correct' ? 'text-emerald-300' : 'text-red-300'
                }`}>
                  {solvedState === 'correct' ? '¡Excelente Trabajo!' : '¡Oops! Táctica Errónea'}
                </h3>
                
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {solvedState === 'correct' 
                    ? `¡Resuelto con éxito! Has ganado +10 XP por descifrar la posición y castigar al oponente. Continuemos acumulando gemas de conocimiento.` 
                    : `No es el movimiento decisivo. Recuerda repasar siempre los resguardos y desvíos geométricos en ajedrez clásico.`}
                </p>

                {/* Technical / Educational solution explanation */}
                <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40 mt-3 text-left">
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Respuesta Técnica:</p>
                  <p className="text-[11px] text-slate-200 mt-1">
                    <span className="font-bold text-amber-400 mr-1.5">{activePuzzle.movesText}</span>
                    {activePuzzle.solutionExplanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions inside the Slide Overlay */}
            <div className="flex space-x-3 mt-5">
              {solvedState === 'incorrect' && progress.lives > 0 && (
                <button
                  onClick={handleRetryPuzzle}
                  id="btn-retry-puzzle"
                  className="flex-1 border-2 border-slate-700 bg-slate-800 hover:bg-slate-755 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-1.5 text-xs transition duration-150 cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Reintentar</span>
                </button>
              )}

              {solvedState === 'incorrect' && progress.lives === 0 && (
                <button
                  onClick={handleRefillLives}
                  id="btn-refill-lives-action"
                  className="flex-1 bg-red-600 hover:bg-red-550 active:bg-red-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-1.5 text-xs transition duration-150 cursor-pointer"
                >
                  <Heart size={14} className="fill-white" />
                  <span>Recargar Vidas</span>
                </button>
              )}

              <button
                onClick={handleNextPuzzle}
                id="btn-next-puzzle"
                className={`flex-1 font-black py-3.5 px-4 rounded-xl flex items-center justify-center space-x-1.5 text-xs transition duration-150 cursor-pointer shadow-md ${
                  solvedState === 'correct'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/10'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <span>Siguiente Táctica</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default TrainingScreen;
