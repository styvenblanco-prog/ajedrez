/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChessColor, PieceType } from '../types';

interface ChessPieceIconProps {
  type: PieceType;
  color: ChessColor;
  className?: string;
}

export const ChessPieceIcon: React.FC<ChessPieceIconProps> = ({ type, color, className = "w-full h-full" }) => {
  const isWhite = color === 'w';
  
  // High-contrast, minimal modern styling
  const fill = isWhite ? '#FFFFFF' : '#1E293B';
  const stroke = isWhite ? '#1E293B' : '#E2E8F0';
  const accent = isWhite ? '#334155' : '#94A3B8';

  switch (type) {
    case 'p': // Pawn / Peón
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round">
            <path d="M22 9c-2.4 0-4 2-4 4.5 0 1.2.5 2.3 1.2 3A3 3 0 0017 19c0 1 .5 2 1.5 2.5a6 6 0 00-4.5 5.5v5c0 1 1 2 2 2h12c1 0 2-1 2-2v-5a6 6 0 00-4.5-5.5c1-.5 1.5-1.5 1.5-2.5 0-1.2-1-2.4-2.2-2.5.7-.7 1.2-1.8 1.2-3 0-2.5-1.6-4.5-4-4.5z" />
            <circle cx="22.5" cy="13" r="2.5" fill={accent} stroke="none" />
          </g>
        </svg>
      );

    case 'r': // Rook / Torre
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M9 39h27v-3H9v3zm3-3h21v-4H12v4zm1.5-4l1.5-12h15l1.5 12h-18zm-1.5-12h21v-4H11s1.5-2.5 1.5-4h18c0 1.5 1.5 4 1.5 4H11z" />
            <path d="M12 12v4h4v-4h-4zm6 0v4h3v-4h-3zm5 0v4h3v-4h-3zm5 0v4h4v-4h-4z" />
          </g>
        </svg>
      );

    case 'n': // Knight / Caballo
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M 22,10 C 22,10 19,11 16,15 C 13,19 13,24 13,24 C 13,24 14,21 17,20 C 17,20 16,21 16,24 C 16,27 18,29 20,29 C 22,29 23,27 24,25 C 25,23 27,20 29,20 C 31,20 32,22 32,22 C 32,22 30,17 27,15 C 24,13 22,10 22,10 z" />
            <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z" />
            <path d="M 33,23 C 33,23 37,24 37,28 C 37,32 34,35 30,35 L 14,35 C 12,35 11,32 12,30 C 13,28 15,26 17,26 C 17,26 18,28 20,28 C 22,28 23,26 23,25" />
            <circle cx="19" cy="16" r="1.5" fill={accent} stroke="none" />
          </g>
        </svg>
      );

    case 'b': // Bishop / Alfil
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M9 39h27v-3H9v3zm13.5-6s-9-4-9-15.5a9 9 0 0118 0C31.5 29 22.5 33 22.5 33z" />
            <circle cx="22.5" cy="11.5" r="2" fill={accent} stroke="none" />
            <path d="M17.5 18h10M22.5 14v11" strokeWidth="1.2" />
          </g>
        </svg>
      );

    case 'q': // Queen / Dama
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M9 39h27v-3H9v3zm3.5-3.5L8 16l8 9 6.5-17 6.5 17 8-9-4.5 19.5h-21z" />
            <circle cx="8" cy="14" r="1.5" fill={accent} stroke="none" />
            <circle cx="16" cy="23" r="1.5" fill={accent} stroke="none" />
            <circle cx="22.5" cy="6" r="1.5" fill={accent} stroke="none" />
            <circle cx="29" cy="23" r="1.5" fill={accent} stroke="none" />
            <circle cx="37" cy="14" r="1.5" fill={accent} stroke="none" />
          </g>
        </svg>
      );

    case 'k': // King / Rey
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M9 39h27v-3H9v3zm13.5-3.5S15 31 15 22.5a7.5 7.5 0 0115 0C30 31 22.5 35.5 22.5 35.5z" />
            {/* Cross on top */}
            <path d="M22.5 6v6M19.5 9h6" stroke={stroke} strokeWidth="1.5" />
            {/* Crown base detail */}
            <path d="M12 30h21M17 25h11" strokeWidth="1" />
          </g>
        </svg>
      );

    default:
      return null;
  }
};
export default ChessPieceIcon;
