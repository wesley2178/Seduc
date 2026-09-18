import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Target, 
  Crown, 
  Medal, 
  TrendingUp, 
  Award, 
  ShieldCheck 
} from 'lucide-react';
import { RankingEntry } from '../types';

export const RankingView: React.FC = () => {
  const [rankingType, setRankingType] = useState<'semanal' | 'mensal' | 'geral'>('geral');
  const [rankings, setRankings] = useState<{ semanal: RankingEntry[]; mensal: RankingEntry[]; geral: RankingEntry[] }>({
    semanal: [],
    mensal: [],
    geral: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ranking')
      .then(res => res.json())
      .then(data => {
        setRankings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro no ranking:', err);
        setLoading(false);
      });
  }, []);

  const currentList = rankings[rankingType] || [];
  const top3 = currentList.slice(0, 3);
  const remaining = currentList.slice(3);

  const getRankBadge = (pos: number) => {
    if (pos === 1) return <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />;
    if (pos === 2) return <Medal className="w-5 h-5 text-slate-300 fill-slate-300" />;
    if (pos === 3) return <Medal className="w-5 h-5 text-amber-700 fill-amber-700" />;
    return <span className="text-xs font-bold text-slate-400">#{pos}</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header do Ranking */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                Quadro de Honra Concurseiro
              </span>
              <span className="text-xs text-slate-400">• SEDUC-SP</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>Ranking de Desempenho & Foco</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Veja a classificação dos candidatos mais disciplinados. A consistência no treino de questões é o maior indicador de aprovação.
            </p>
          </div>

          {/* Filtro de Período */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setRankingType('semanal')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                rankingType === 'semanal' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setRankingType('mensal')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                rankingType === 'mensal' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setRankingType('geral')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                rankingType === 'geral' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Geral
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Atualizando posições do ranking oficial...</p>
        </div>
      ) : (
        <>
          {/* PÓDIO TOP 3 */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* 2º Lugar */}
              <div className="order-2 md:order-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-between shadow-sm relative">
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center text-3xl mb-2 shadow-inner">
                  {top3[1].avatar_url}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Medal className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-bold text-slate-300 uppercase">2º Lugar</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{top3[1].name}</h3>
                  <p className="text-xs text-indigo-400">Nível {top3[1].level} • {top3[1].level_name}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 w-full flex justify-around text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">XP</span>
                    <strong className="text-amber-400 font-bold">{top3[1].xp_total}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Acerto</span>
                    <strong className="text-emerald-400 font-bold">{top3[1].taxa_acerto}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Streak</span>
                    <strong className="text-orange-400 font-bold">{top3[1].streak}d</strong>
                  </div>
                </div>
              </div>

              {/* 1º Lugar (Destaque Central) */}
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/30 to-slate-900 border-2 border-amber-500/60 rounded-2xl p-6 text-center flex flex-col items-center justify-between shadow-xl relative -mt-2">
                <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-md">
                  <Crown className="w-3.5 h-3.5" /> Líder Geral
                </div>
                <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center text-4xl mb-2 shadow-inner">
                  {top3[0].avatar_url}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">{top3[0].name}</h3>
                  <p className="text-xs text-amber-300 font-semibold">Nível {top3[0].level} • {top3[0].level_name}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 w-full flex justify-around text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">XP</span>
                    <strong className="text-amber-400 text-sm font-bold">{top3[0].xp_total}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Acerto</span>
                    <strong className="text-emerald-400 text-sm font-bold">{top3[0].taxa_acerto}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Streak</span>
                    <strong className="text-orange-400 text-sm font-bold">{top3[0].streak}d</strong>
                  </div>
                </div>
              </div>

              {/* 3º Lugar */}
              <div className="order-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-between shadow-sm relative">
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-700 flex items-center justify-center text-3xl mb-2 shadow-inner">
                  {top3[2].avatar_url}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <Medal className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-amber-600 uppercase">3º Lugar</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{top3[2].name}</h3>
                  <p className="text-xs text-indigo-400">Nível {top3[2].level} • {top3[2].level_name}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 w-full flex justify-around text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">XP</span>
                    <strong className="text-amber-400 font-bold">{top3[2].xp_total}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Acerto</span>
                    <strong className="text-emerald-400 font-bold">{top3[2].taxa_acerto}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Streak</span>
                    <strong className="text-orange-400 font-bold">{top3[2].streak}d</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TABELA GERAL DO RANKING */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-xs text-slate-400 uppercase tracking-wider">
              Tabela de Concurseiros
            </div>

            <div className="divide-y divide-slate-800">
              {currentList.map((entry) => {
                const isCurrentUser = entry.user_id === 'user_wesley';

                return (
                  <div 
                    key={entry.user_id}
                    className={`p-4 sm:p-5 flex items-center justify-between transition ${
                      isCurrentUser 
                        ? 'bg-indigo-950/30 border-l-4 border-l-indigo-500' 
                        : 'hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 text-center shrink-0">
                        {getRankBadge(entry.rank)}
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                        {entry.avatar_url}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{entry.name}</span>
                          {isCurrentUser && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                              Você
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          Nível {entry.level} • {entry.level_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-5 text-right text-xs">
                      <div className="hidden sm:block">
                        <span className="text-slate-400 block text-[10px]">Streak</span>
                        <span className="font-semibold text-orange-400 flex items-center gap-1 justify-end">
                          <Flame className="w-3.5 h-3.5 fill-orange-500" /> {entry.streak}d
                        </span>
                      </div>

                      <div className="hidden sm:block">
                        <span className="text-slate-400 block text-[10px]">Acerto</span>
                        <span className="font-semibold text-emerald-400">{entry.taxa_acerto}%</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Experiência</span>
                        <span className="font-bold text-amber-400 text-sm">{entry.xp_total} XP</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
