import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Target, 
  Trophy, 
  BookOpen, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Award,
  Zap,
  Play
} from 'lucide-react';
import { DashboardSummary } from '../types';

interface DashboardViewProps {
  summary: DashboardSummary;
  onNavigate: (tab: string, extra?: any) => void;
  onStartSimulation: (tipo: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  summary, 
  onNavigate,
  onStartSimulation 
}) => {
  const { 
    user, 
    gamification, 
    active_edital, 
    progresso_edital_percent, 
    questoes_respondidas, 
    taxa_acerto_percent, 
    meta_diaria_atual, 
    meta_diaria_meta,
    pontos_fortes,
    pontos_fracos,
    recomendacao_ia,
    recent_achievements,
    equipped_pet,
    equipped_avatar
  } = summary;

  const levelInfo = (gamification as any).levelInfo || {
    level: gamification.level,
    title: gamification.level_name,
    nextLevelXp: 800,
    progressPercent: 60
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Motivational Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-4xl" role="img" aria-label="Avatar">
                {equipped_avatar?.image_url || '🦉'}
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Olá, {user.name}
                  {equipped_pet && (
                    <span className="text-xl" title={`Pet Companheiro: ${equipped_pet.name}`}>
                      {equipped_pet.image_url}
                    </span>
                  )}
                </h1>
                <p className="text-sm text-indigo-300">
                  {active_edital?.cargo} • {active_edital?.orgao} ({active_edital?.banca})
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Sua jornada de preparação está ativa. Você já dominou <strong className="text-amber-400">{progresso_edital_percent}%</strong> do edital oficial. Mantenha sua constância para garantir a posse!
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold border border-orange-500/30">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                Sequência: {gamification.current_streak} dias
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                <Target className="w-3.5 h-3.5" />
                {meta_diaria_atual}/{meta_diaria_meta} questões hoje
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-semibold border border-purple-500/30">
                <Trophy className="w-3.5 h-3.5" />
                {gamification.xp_total} XP Conquistados
              </span>
            </div>
          </div>

          {/* Level Progress Card */}
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 min-w-[260px] lg:w-72 shadow-lg">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300">Nível {levelInfo.level}</span>
              <span className="text-indigo-400 font-medium">{levelInfo.progressPercent}%</span>
            </div>
            <div className="text-sm font-bold text-amber-400 truncate mb-2">
              {levelInfo.title}
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
              <div 
                className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
              <span>{gamification.xp_total} XP</span>
              <span>Próximo: {levelInfo.nextLevelXp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI RECOMMENDATION WIDGET: "O Que Estudar Agora?" (Item 31) */}
      {recomendacao_ia && (
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/40 rounded-2xl p-5 sm:p-6 shadow-md relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-indigo-600/20 border border-indigo-500/50 rounded-xl text-indigo-400 shrink-0 mt-0.5">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Motor Cognitivo da IA
                  </span>
                  <span className="text-xs text-slate-400">• O que estudar agora?</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {recomendacao_ia.conteudo_nome || 'Recomendação Prioritária'}
                </h3>
                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {recomendacao_ia.mensagem}
                </p>
              </div>
            </div>

            <button
              id="btn-action-recommendation"
              onClick={() => {
                if (recomendacao_ia.tipo === 'REVISAO_ERROS') {
                  onNavigate('erros');
                } else if (recomendacao_ia.tipo === 'SIMULADO_AGENDADO') {
                  onStartSimulation('ADAPTATIVO');
                } else {
                  onNavigate('questoes', { conteudo_id: recomendacao_ia.conteudo_id });
                }
              }}
              className="hidden sm:inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition shrink-0"
            >
              <span>{recomendacao_ia.sugestao_acao || 'Iniciar Estudo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:hidden mt-4">
            <button
              onClick={() => onNavigate('questoes', { conteudo_id: recomendacao_ia.conteudo_id })}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
            >
              <span>{recomendacao_ia.sugestao_acao || 'Iniciar Estudo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Questões Respondidas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Questões Realizadas</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-white">{questoes_respondidas}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Ativo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Banco SEDUC e provas anteriores</p>
        </div>

        {/* Metric 2: Taxa de Acerto */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Taxa de Acerto</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-white">{taxa_acerto_percent}%</span>
            <span className="text-xs font-medium text-slate-400">
              {summary.questoes_acertadas} certas
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${taxa_acerto_percent >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
              style={{ width: `${taxa_acerto_percent}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Cobertura do Edital */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cobertura do Edital</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-white">{progresso_edital_percent}%</span>
            <span className="text-xs font-medium text-purple-400">Conteúdos Dominados</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Métricas de domínio contínuo</p>
        </div>

        {/* Metric 4: Meta Diária */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meta do Dia</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold text-white">
              {meta_diaria_atual}/{meta_diaria_meta}
            </span>
            <span className={`text-xs font-medium ${meta_diaria_atual >= meta_diaria_meta ? 'text-emerald-400' : 'text-amber-400'}`}>
              {meta_diaria_atual >= meta_diaria_meta ? 'Meta Batida! 🎉' : 'Em progresso'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Resolva ao menos 10 questões/dia</p>
        </div>
      </div>

      {/* Grid de Pontos Fortes, Fracos e Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pontos Fortes e Fracos (Item 37) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Diagnóstico por Disciplina</h3>
              <p className="text-xs text-slate-400">Identificação automática dos seus pontos fortes e fracos</p>
            </div>
            <button 
              onClick={() => onNavigate('edital')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              Ver Edital Completo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pontos Fortes */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Pontos Fortes (Maior Domínio)</span>
              </div>
              {pontos_fortes.length > 0 ? (
                <div className="space-y-2">
                  {pontos_fortes.map((p, idx) => (
                    <div key={idx} className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
                      <div className="flex justify-between text-xs font-medium text-slate-200">
                        <span className="truncate max-w-[170px]">{p.disciplina}</span>
                        <span className="text-emerald-400 font-bold">{p.taxa}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${p.taxa}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Responda mais questões para calibrar seus pontos fortes.</p>
              )}
            </div>

            {/* Pontos Fracos */}
            <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Pontos Fracos (Atenção e Revisão)</span>
              </div>
              {pontos_fracos.length > 0 ? (
                <div className="space-y-2">
                  {pontos_fracos.map((p, idx) => (
                    <div key={idx} className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
                      <div className="flex justify-between text-xs font-medium text-slate-200">
                        <span className="truncate max-w-[170px]">{p.disciplina}</span>
                        <span className="text-rose-400 font-bold">{p.taxa}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${p.taxa}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Nenhum ponto de fraqueza crítico detectado no momento.</p>
              )}
            </div>
          </div>

          {/* Ações Rápidas de Treinamento */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              id="btn-quick-sim-adaptativo"
              onClick={() => onStartSimulation('ADAPTATIVO')}
              className="flex-1 min-w-[200px] flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-sm"
            >
              <Play className="w-4 h-4" />
              <span>Simulado Adaptativo</span>
            </button>

            <button
              id="btn-quick-review-errors"
              onClick={() => onNavigate('erros')}
              className="flex-1 min-w-[200px] flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition border border-slate-700"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Revisar Meus Erros</span>
            </button>

            <button
              id="btn-quick-generate-ia"
              onClick={() => onNavigate('gerador')}
              className="flex-1 min-w-[200px] flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold text-sm transition border border-purple-500/40"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Gerar Questões Inéditas</span>
            </button>
          </div>
        </div>

        {/* Conquistas e Gamificação */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Medalhas Conquistadas</span>
              </h3>
              <button 
                onClick={() => onNavigate('gamificacao')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Ver Todas
              </button>
            </div>

            {recent_achievements.length > 0 ? (
              <div className="space-y-3">
                {recent_achievements.map((ach) => (
                  <div 
                    key={ach.id} 
                    className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 hover:border-amber-500/40 transition"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-slate-200 truncate">{ach.name}</h4>
                      <p className="text-xs text-slate-400 truncate">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Complete seus primeiros simulados para desbloquear medalhas!</p>
            )}
          </div>

          {/* Pet Spotlight */}
          {equipped_pet && (
            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4 flex items-center space-x-3">
              <span className="text-3xl">{equipped_pet.image_url}</span>
              <div>
                <div className="text-xs font-bold text-indigo-300 uppercase">Pet Companheiro Ativo</div>
                <div className="text-sm font-bold text-white">{equipped_pet.name}</div>
                <p className="text-[11px] text-slate-400">{equipped_pet.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
