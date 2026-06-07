/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ShieldAlert, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Hardcoded demo credentials
    if (email === 'admin@chessmaster.com' && password === 'admin123') {
      onLoginSuccess();
      setEmail('');
      setPassword('');
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-6 select-none">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 text-left max-w-sm w-full space-y-4 shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="btn-close-admin-login"
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="space-y-1 pr-6">
          <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center border border-amber-500/20 mb-3">
            <Lock size={20} />
          </div>
          <h3 className="text-lg font-black text-white">Ingreso de Administrador</h3>
          <p className="text-xs text-slate-400">
            Ingresa las credenciales autorizadas del panel de control
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center space-x-2 text-xs text-red-405 animate-shake">
              <ShieldAlert size={14} className="text-red-400 shrink-0" />
              <span className="font-semibold text-red-300">{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 block">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-500" size={14} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@chessmaster.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 block">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={14} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-9 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-admin-submit-login"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs cursor-pointer shadow-lg shadow-amber-500/10 transition-all hover:scale-[1.01] active:scale-98"
          >
            Ingresar
          </button>
        </form>
      </motion.div>
    </div>
  );
};
export default AdminLoginModal;
