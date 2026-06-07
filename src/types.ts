/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ChessColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Piece {
  type: PieceType;
  color: ChessColor;
}

export type BoardGrid = (Piece | null)[][];

export interface ChessPuzzle {
  id: string;
  title: string;
  theme: string;
  description: string;
  instruction: string;
  rating: number;
  initialBoard: BoardGrid;
  solution: {
    from: { r: number; c: number };
    to: { r: number; c: number };
  }[];
  solutionExplanation: string;
  movesText: string;
}

export interface UserProgress {
  elo: number;
  targetElo: number;
  dailyGoalMinutes: number;
  xp: number;
  streak: number;
  lives: number;
  level: number;
  completedPuzzles: string[]; // Puzzle IDs completed
  accuracyByTheme: {
    [theme: string]: {
      correct: number;
      total: number;
    };
  };
}

export interface FictionalUser {
  id: string;
  name: string;
  elo: number;
  subscription: 'Gratis' | 'Plus' | 'Premium';
  joinedDate: string;
  puzzlesSolved: number;
}
