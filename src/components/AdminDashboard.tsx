/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, CreditCard, BarChart2, ShieldAlert, Plus, TrendingUp, DollarSign, Award, LogOut } from 'lucide-react';
import { FictionalUser } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  // Fictional initial users list
  const [users, setUsers] = useState<FictionalUser[]>([
    { id: '1', name: 'Beth Harmon', elo: 2450, subscription: 'Premium', joinedDate: '2026-05-12', puzzlesSolved: 312 },
    { id: '2', name: 'Magnus C.', elo: 2882, subscription: 'Premium', joinedDate: '2026-05-14', puzzlesSolved: 450 },
    { id: '3', name: 'Hikaru N.', elo: 2795, subscription: 'Plus', joinedDate: '2026-05-20', puzzlesSolved: 280 },
    { id: '4', name: 'Alexandra B.', elo: 1950, subscription: 'Plus', joinedDate: '2026-06-01', puzzlesSolved: 142 },
    { id: '5', name: 'Pepe Grillo', elo: 920, subscription: 'Gratis', joinedDate: '2026-06-04', puzzlesSolved: 18 },
    { id: '6', name: 'Juana de Arco', elo: 1550, subscription: 'Gratis', joinedDate: '2026-06-05', puzzlesSolved: 43 },
  ]);

  // States to add new simulated students
  const [newUserName, setNewUserName] = useState('');
  const [newUserElo, setNewUserElo] = useState('1200');
  const [newUserSub, setNewUserSub] = useState<'Gratis' | 'Plus' | 'Premium'>('Gratis');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const newUser: FictionalUser = {
      id: Date.now().toString(),
      name: newUserName.trim(),
      elo: parseInt(newUserElo) || 1200,
      subscription: newUserSub,
      joinedDate: new Date().toISOString().split('T')[0],
      puzzlesSolved: Math.floor(Math.random() * 20) + 1,
    };

    setUsers([newUser, ...users]);
    setNewUserName('');
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Helper metric sums
  const totalUsersCount = users.length;
  const premiumPlusCount = users.filter((u) => u.subscription !== 'Gratis').length;
  const averageEloRating = Math.round(users.reduce((acc, u) => acc + u.elo, 0) / totalUsersCount);

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 text-slate-100 p-5 pb-10 min-h-screen">
      
      {/* Admin Top Header Bar */}
      <div className="flex justify-between items-center bg-slate-800/50 border border-slate-700/40 rounded-2xl p-3.5 mb-6 shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Live Admin</span>
        </div>
        <button
          onClick={onLogout}
          id="btn-admin-logout"
          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <LogOut size={12} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Title */}
      <div className="mb-6 px-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Consola de Control</h1>
        <p className="text-xs text-slate-400 mt-1">Supervisión en tiempo real de métricas críticas y alumnos del MVP.</p>
      </div>

      {/* Metrics Carousel Layout */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Retention KPI Card */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 relative overflow-hidden">
          <div className="absolute right-1 bottom-1 text-emerald-500/10">
            <TrendingUp size={60} />
          </div>
          <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block">Retención 7d</span>
          <p className="text-2xl font-black text-white mt-1">68.4%</p>
          <span className="text-[8px] text-slate-400 block mt-1">+1.2% desde la semana pasada</span>
        </div>

        {/* Active Premium KPI Card */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 relative overflow-hidden">
          <div className="absolute right-1 bottom-1 text-amber-500/10">
            <DollarSign size={60} />
          </div>
          <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase block">Conversión</span>
          <p className="text-2xl font-black text-white mt-1">
            {Math.round((premiumPlusCount / totalUsersCount) * 100)}%
          </p>
          <span className="text-[8px] text-slate-400 block mt-1">{premiumPlusCount} de {totalUsersCount} alumnos de pago</span>
        </div>

        {/* Average Elo rating KPI */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-purple-400 tracking-wider uppercase block">Nivel medio del Alumnado</span>
              <p className="text-xl font-bold text-white mt-1">{averageEloRating} ELO</p>
            </div>
            <Award className="text-purple-500/40" size={36} />
          </div>
        </div>
      </div>

      {/* Add New User simulated Form */}
      <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800/80 mb-6">
        <h3 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Simular Registro de Ficticio Alumno</h3>
        <form onSubmit={handleAddUser} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Nombre</label>
              <input 
                type="text" 
                value={newUserName}
                maxLength={20}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Ej. Anatoly K."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">ELO Inicial</label>
              <input 
                type="number" 
                value={newUserElo}
                onChange={(e) => setNewUserElo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-2 items-end">
            <div className="flex-1">
              <label className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Tipo Suscripción</label>
              <select 
                value={newUserSub}
                onChange={(e: any) => setNewUserSub(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
              >
                <option value="Gratis">Gratis</option>
                <option value="Plus">Plus</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            
            <button
              type="submit"
              id="btn-admin-add-user"
              className="bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs flex items-center space-x-1 hover:bg-emerald-400 max-h-[36px] cursor-pointer"
            >
              <Plus size={14} />
              <span>Registrar</span>
            </button>
          </div>
        </form>
      </div>

      {/* Styled Fictional Users Table */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-800/80 overflow-hidden mb-4">
        <div className="p-3 bg-slate-800/60 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider block">Estudiantes de la Plataforma</h3>
          <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-md font-mono font-bold text-slate-400">Total: {totalUsersCount}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-900/40">
                <th className="p-3">Nombre</th>
                <th className="p-3 text-center">ELO</th>
                <th className="p-3 text-center">Tipo</th>
                <th className="p-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-800/60 hover:bg-slate-800/20 transition-all font-medium">
                  <td className="p-3">
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Soluciones: {user.puzzlesSolved}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="font-mono bg-slate-900 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-amber-500/10">
                      {user.elo}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      user.subscription === 'Premium' 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                        : user.subscription === 'Plus'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {user.subscription}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      id={`btn-delete-user-${user.id}`}
                      className="text-red-400 font-bold hover:text-red-300 transition-colors uppercase text-[10px] tracking-wider cursor-pointer font-semibold"
                    >
                      Baja
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default AdminDashboard;
