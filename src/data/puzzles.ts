/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChessPuzzle, Piece } from '../types';

// Helper to create an empty 8x8 chessboard
const createEmptyBoard = (): (Piece | null)[][] => {
  return Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
};

// Puzzle 1: Mate de Pasillo (Back Rank Mate)
const board1 = createEmptyBoard();
// Black side (Ranks 8, 7, 6...)
board1[0][5] = { type: 'k', color: 'b' }; // King at f8 (row 0, col 5)
board1[0][7] = { type: 'r', color: 'b' }; // Rook at h8 (row 0, col 7)
board1[1][5] = { type: 'p', color: 'b' }; // Pawn at f7
board1[1][6] = { type: 'p', color: 'b' }; // Pawn at g7
board1[1][7] = { type: 'p', color: 'b' }; // Pawn at h7
// White side
board1[7][2] = { type: 'r', color: 'w' }; // Rook at c1 (row 7, col 2)
board1[7][6] = { type: 'k', color: 'w' }; // King at g1 (row 7, col 6)
board1[6][5] = { type: 'p', color: 'w' }; // Pawn at f2
board1[6][6] = { type: 'p', color: 'w' }; // Pawn at g2
board1[6][7] = { type: 'p', color: 'w' }; // Pawn at h2

// Puzzle 2: Doble de Caballo (Knight Fork)
const board2 = createEmptyBoard();
// Black side
board2[0][6] = { type: 'k', color: 'b' }; // King at g8 (row 0, col 6)
board2[1][2] = { type: 'q', color: 'b' }; // Queen at c7 (row 1, col 2)
board2[1][6] = { type: 'p', color: 'b' }; // Pawn at g7
board2[1][7] = { type: 'p', color: 'b' }; // Pawn at h7
// White side
board2[4][4] = { type: 'n', color: 'w' }; // Knight at e4 (row 4, col 4)
board2[7][6] = { type: 'k', color: 'w' }; // King at g1
board2[6][6] = { type: 'p', color: 'w' }; // Pawn at g2
board2[6][7] = { type: 'p', color: 'w' }; // Pawn at h2

// Puzzle 3: Desviación Táctica (Deflection)
// White has Queen at h6 and wants to deliver mate. Black King is on g8, defended by Rook on e8.
// White rook on d1. Let's make it simpler: white rook on f1 and Black Queen is on c5. 
// Let's do: Clavada Absoluta (Absolute Pin)
const board3 = createEmptyBoard();
// Black side
board3[0][7] = { type: 'k', color: 'b' }; // King at h8 (row 0, col 7)
board3[2][5] = { type: 'q', color: 'b' }; // Queen at f6 (row 2, col 5)
board3[1][6] = { type: 'p', color: 'b' }; // Pawn at g7
board3[1][7] = { type: 'p', color: 'b' }; // Pawn at h7
// White side
board3[5][2] = { type: 'b', color: 'w' }; // Bishop at c3 (row 5, col 2)
board3[7][5] = { type: 'r', color: 'w' }; // Rook at f1 (row 7, col 5)
board3[7][6] = { type: 'k', color: 'w' }; // King at g1
board3[6][6] = { type: 'p', color: 'w' }; // Pawn at g2
board3[6][7] = { type: 'p', color: 'w' }; // Pawn at h2

export const CHESS_PUZZLES: ChessPuzzle[] = [
  {
    id: 'puz-101',
    title: 'Mate de Pasillo',
    theme: 'Mate en 1',
    description: '¡El rey negro está atrapado detrás de su propia barrera de peones sin escapatoria!',
    instruction: 'Juegan blancas y dan Mate en 1 (Mueve la torre de c1 a c8)',
    rating: 800,
    initialBoard: board1,
    solution: [
      {
        from: { r: 7, c: 2 }, // c1
        to: { r: 0, c: 2 },   // c8
      },
    ],
    solutionExplanation: 'Al mover la torre a c8, controlas toda la última fila. El rey negro no puede huir porque sus propios peones le bloquean las casillas de escape.',
    movesText: '1. Tc8#',
  },
  {
    id: 'puz-102',
    title: 'Doble de Caballo',
    theme: 'Ataque Doble',
    description: 'El rey y la dama negra están a la distancia justa para un salto letal de tu caballo.',
    instruction: 'Juegan blancas y ganan la dama (Mueve el caballo de e4 a f6)',
    rating: 950,
    initialBoard: board2,
    solution: [
      {
        from: { r: 4, c: 4 }, // e4
        to: { r: 2, c: 5 },   // f6
      },
    ],
    solutionExplanation: 'Mover el caballo a f6 da jaque al rey en g8 y simultáneamente amenaza a la dama en c7. Las negras deben mover su rey, permitiendo capturar su dama en la siguiente jugada.',
    movesText: '1. Cf6+ Rh8 2. Cxc7',
  },
  {
    id: 'puz-103',
    title: 'Aprovechar la Clavada',
    theme: 'Clavada Alfil',
    description: 'La dama negra en f6 no puede apartarse porque dejaría al descubierto a su rey en h8.',
    instruction: 'Juegan blancas y ganan material (Mueve el alfil de c3 para capturar a la dama en f6)',
    rating: 1100,
    initialBoard: board3,
    solution: [
      {
        from: { r: 5, c: 2 }, // c3
        to: { r: 2, c: 5 },   // f6
      },
    ],
    solutionExplanation: 'Dado que la dama negra está clavada absolutamente por la diagonal h8-a1, no puede huir de la amenaza de tu alfil. Capturar la dama asegura una ventaja material insuperable.',
    movesText: '1. Axf6+ gxf6',
  },
];
