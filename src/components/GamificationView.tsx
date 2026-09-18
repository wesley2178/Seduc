import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  Trophy, 
  Award, 
  Flame, 
  Sparkles, 
  Check, 
  Lock, 
  Clock, 
  ArrowRight,
  Shield,
  Heart
} from 'lucide-react';
import { GameItem, Achievement, XpTransaction, GamificationProfile } from '../types';

interface GamificationViewProps {
  onRefreshSummary: () => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({ onRefreshSummary }) => {
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<(Achievement & { unlocked: boolean })[]>([]);
  const [items, setItems] = useState<(GameItem & { unlocked: boolean; equipped: boolean })[]>([]);
  const [transactions, setTransactions] = useState<XpTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'itens' | 'conquistas' | 'historico'>('itens');

  const fetchGamification = () => {
    setLoading(true);
    fetch('/api/gamificacao')
      .then(res => res.json())
      .then(data => {
        setProfile(data.profile);
        setAchievements(data.achievements || []);
        setItems(data.items || []);
        setTransactions(data.transactions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGamification();
  }, []);

  const handleEquip = async (item: GameItem) => {
    try {
      const res = await fetch('/api/gamificacao/equipar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: item.id,
          item_type: item.type
        })
      });
      const data = await res.json();
      if (data.sucesso) {
        fetchGamification();
        onRefreshSummary();
        try {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 }
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.error('Erro ao equipar:', err);
    }
  };

  if (loading || !profile) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm">Carregando centro de recompensas e gamificação...</p>
      </div>
    );
  }

  const levelInfo = profile.levelInfo || {
    level: profile.level,
    title: profile.level_name,
    nextLevelXp: 800,
    progressPercent: 60
  };

  const pets = items.filter(i => i.type === 'PET');
  const avatars = items.filter(i => i.type === 'AVATAR');
  const frames = items.filter(i => i.type === 'MOLDURA');

  return (
    <div className="space-y-6 pb-12">
      {/* Header com Nível e Barra de XP Estilizada */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Sistema de Honrarias & Progresso
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <Zap className="w-7 h-7 text-amber-400 fill-amber-400" />
              <span>Nível {profile.level} — {profile.level_name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Cada questão resolvida e cada simulado concluído concedem XP para desbloquear títulos acadêmicos, pets companheiros e novas honrarias.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/90 border border-slate-700/80 p-4 rounded-xl shrink-0">
            <Flame className="w-8 h-8 fill-orange-500 text-orange-500 animate-pulse" />
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Ofensiva de Estudos</div>
              <div className="text-xl font-bold text-orange-400">{profile.current_streak} Dias Consecutivos</div>
            </div>
          </div>
        </div>

        {/* Barra de XP */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Progresso para o Nível {profile.level + 1}</span>
            <span className="text-amber-400 font-bold">{profile.xp_total} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sub-navegação */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('itens')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'itens'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Loja de Companheiros & Avatares ({items.length})
        </button>

        <button
          onClick={() => setActiveSubTab('conquistas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'conquistas'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Galeria de Medalhas ({achievements.filter(a => a.unlocked).length}/{achievements.length})
        </button>

        <button
          onClick={() => setActiveSubTab('historico')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'historico'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Extrato de XP
        </button>
      </div>

      {/* 1. ABA ITENS & COMPANHEIROS */}
      {activeSubTab === 'itens' && (
        <div className="space-y-8">
          {/* Seção Pets Companheiros */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <h3 className="text-base font-bold text-white">Pets Companheiros de Estudo</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pets.map((item) => (
                <div 
                  key={item.id}
                  className={`bg-slate-900 border rounded-2xl p-5 space-y-3 flex flex-col justify-between transition ${
                    item.equipped 
                      ? 'border-emerald-500/80 ring-2 ring-emerald-500/30'
                      : item.unlocked
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-800/40 opacity-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl shadow-inner mx-auto">
                      {item.image_url}
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-slate-400 uppercase">
                        {item.type} • Nível {item.unlock_level}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    {item.equipped ? (
                      <button 
                        disabled
                        className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Companheiro Ativo
                      </button>
                    ) : item.unlocked ? (
                      <button 
                        onClick={() => handleEquip(item)}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        Equipar Pet
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold flex items-center justify-center gap-1 cursor-not-allowed"
                      >
                        <Lock className="w-3.5 h-3.5" /> Requer Nível {item.unlock_level}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção Avatares */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Avatares do Concurseiro</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {avatars.map((item) => (
                <div 
                  key={item.id}
                  className={`bg-slate-900 border rounded-2xl p-5 space-y-3 flex flex-col justify-between transition ${
                    item.equipped 
                      ? 'border-emerald-500/80 ring-2 ring-emerald-500/30'
                      : item.unlocked
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-800/40 opacity-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-4xl shadow-inner mx-auto">
                      {item.image_url}
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-slate-400 uppercase">
                        {item.type} • Nível {item.unlock_level}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-0.5">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    {item.equipped ? (
                      <button 
                        disabled
                        className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Avatar em Uso
                      </button>
                    ) : item.unlocked ? (
                      <button 
                        onClick={() => handleEquip(item)}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
                      >
                        Usar Avatar
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold flex items-center justify-center gap-1 cursor-not-allowed"
                      >
                        <Lock className="w-3.5 h-3.5" /> Requer Nível {item.unlock_level}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ABA CONQUISTAS */}
      {activeSubTab === 'conquistas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-3 flex items-start space-x-3.5 transition ${
                ach.unlocked 
                  ? 'border-amber-500/40 bg-gradient-to-br from-amber-950/10 to-slate-900' 
                  : 'border-slate-800/40 opacity-40'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl border ${
                ach.unlocked 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}>
                {ach.unlocked ? <Trophy className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>

              <div className="space-y-1 truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    +{ach.xp_reward} XP
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    {ach.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white truncate">{ach.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{ach.description}</p>
                {ach.unlocked && (
                  <div className="text-[10px] text-emerald-400 font-semibold pt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Desbloqueada!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. ABA EXTRATO DE XP */}
      {activeSubTab === 'historico' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Últimos Lançamentos de Experiência</span>
          </h3>

          <div className="divide-y divide-slate-800">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">{tx.reason}</div>
                  <div className="text-[11px] text-slate-500">
                    {new Date(tx.created_at).toLocaleString('pt-BR')} • Categoria: {tx.reference_type}
                  </div>
                </div>
                <span className="font-bold text-amber-400 text-sm px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  +{tx.amount} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
