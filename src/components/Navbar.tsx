import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Trophy, 
  AlertCircle, 
  ShieldCheck,
  Flame,
  Zap,
  GraduationCap
} from 'lucide-react';
import { DashboardSummary } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  summary: DashboardSummary | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, summary }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'edital', label: 'Edital Verticalizado', icon: BookOpen },
    { id: 'questoes', label: 'Banco de Questões', icon: CheckCircle2 },
    { id: 'gerador', label: 'Gerador IA Multiagente', icon: Sparkles },
    { id: 'simulados', label: 'Simulados', icon: Award },
    { id: 'erros', label: 'Meus Erros', icon: AlertCircle },
    { id: 'gamificacao', label: 'Gamificação & Pets', icon: Zap },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'admin', label: 'Agentes & RAG', icon: ShieldCheck },
  ];

  const profile = summary?.gamification;

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top bar with user stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">SEDUC</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  Personal Study Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Inteligência Multiagente & RAG Educacional</p>
            </div>
          </div>

          {/* Gamification Stats Header */}
          {profile && (
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Streak */}
              <div 
                id="header-streak-badge"
                className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-semibold shadow-inner"
                title="Sua sequência diária de estudos ininterruptos"
              >
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
                <span>{profile.current_streak} {profile.current_streak === 1 ? 'dia' : 'dias'}</span>
              </div>

              {/* Level & XP */}
              <div 
                id="header-level-badge"
                className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
              >
                <span className="font-bold text-indigo-400">Nível {profile.level}</span>
                <span className="text-slate-500">•</span>
                <span>{profile.xp_total} XP</span>
              </div>

              {/* Equipped Pet and Avatar */}
              <div 
                id="header-user-avatar"
                onClick={() => setCurrentTab('gamificacao')}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer border border-slate-700/60"
                title="Clique para ver perfil e itens cosméticos"
              >
                <div className="text-2xl" role="img" aria-label="Avatar">
                  {summary?.equipped_avatar?.image_url || '🦉'}
                </div>
                {summary?.equipped_pet && (
                  <div className="text-lg -ml-2" role="img" aria-label="Pet">
                    {summary.equipped_pet.image_url}
                  </div>
                )}
                <div className="hidden lg:block text-left pl-1">
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                    {summary?.user.name}
                  </div>
                  <div className="text-[10px] text-amber-400 truncate max-w-[120px]">
                    {profile.level_name.split('—')[1] || profile.level_name}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
