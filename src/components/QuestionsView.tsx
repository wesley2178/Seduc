import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  AlertCircle, 
  Filter, 
  ArrowRight,
  RotateCcw,
  Zap,
  Info,
  Layers,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Questao, QuestaoOrigem, QuestaoDificuldade } from '../types';

interface QuestionsViewProps {
  initialDisciplinaId?: string;
  initialConteudoId?: string;
  onRefreshSummary: () => void;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({ 
  initialDisciplinaId, 
  initialConteudoId,
  onRefreshSummary 
}) => {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtros
  const [disciplinaFilter, setDisciplinaFilter] = useState<string>(initialDisciplinaId || '');
  const [origemFilter, setOrigemFilter] = useState<string>('');
  const [dificuldadeFilter, setDificuldadeFilter] = useState<string>('');
  const [disciplinasList, setDisciplinasList] = useState<{ id: string; nome: string }[]>([]);

  // Estado da questão ativa
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | 'E' | null>(null);
  const [responseResult, setResponseResult] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Explicação inteligente expandida
  const [aiExplanationText, setAiExplanationText] = useState<string | null>(null);
  const [loadingAiExplanation, setLoadingAiExplanation] = useState<string | null>(null);

  // Carregar disciplinas para os filtros
  useEffect(() => {
    fetch('/api/edital')
      .then(res => res.json())
      .then(data => {
        if (data.disciplinas) {
          setDisciplinasList(data.disciplinas.map((d: any) => ({ id: d.id, nome: d.nome })));
        }
      })
      .catch(console.error);
  }, []);

  // Carregar questões
  const loadQuestions = () => {
    setLoading(true);
    setResponseResult(null);
    setSelectedOption(null);
    setAiExplanationText(null);

    const query = new URLSearchParams();
    if (disciplinaFilter) query.set('disciplina_id', disciplinaFilter);
    if (initialConteudoId) query.set('conteudo_id', initialConteudoId);
    if (origemFilter) query.set('origem', origemFilter);
    if (dificuldadeFilter) query.set('dificuldade', dificuldadeFilter);

    fetch(`/api/questoes?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        setQuestoes(data.questoes || []);
        setCurrentIndex(0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar questões:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadQuestions();
  }, [disciplinaFilter, origemFilter, dificuldadeFilter]);

  const currentQuestao = questoes[currentIndex] || null;

  // Enviar Resposta
  const handleAnswerSubmit = () => {
    if (!currentQuestao || !selectedOption || submitting || responseResult) return;

    setSubmitting(true);
    fetch(`/api/questoes/${currentQuestao.id}/responder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resposta: selectedOption,
        tempo_segundos: 45
      })
    })
      .then(res => res.json())
      .then(result => {
        setResponseResult(result);
        setSubmitting(false);
        onRefreshSummary();

        if (result.correta) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.75 }
            });
          } catch (e) {
            // ignore
          }
        }
      })
      .catch(err => {
        console.error('Erro ao submeter resposta:', err);
        setSubmitting(false);
      });
  };

  // Solicitar explicação inteligente por IA
  const handleRequestAiExplanation = (tipo: 'SIMPLES' | 'EXEMPLO' | 'COMO_ESTUDAR') => {
    if (!currentQuestao) return;
    setLoadingAiExplanation(tipo);

    fetch(`/api/questoes/${currentQuestao.id}/explicacao-inteligente`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo })
    })
      .then(res => res.json())
      .then(data => {
        setAiExplanationText(data.texto);
        setLoadingAiExplanation(null);
      })
      .catch(err => {
        console.error('Erro na explicação inteligente:', err);
        setLoadingAiExplanation(null);
      });
  };

  const handleNext = () => {
    if (currentIndex < questoes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setResponseResult(null);
      setAiExplanationText(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedOption(null);
      setResponseResult(null);
      setAiExplanationText(null);
    }
  };

  const getOrigemBadge = (origem: QuestaoOrigem) => {
    switch (origem) {
      case 'REAL_PROVA':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <BookOpen className="w-3.5 h-3.5 mr-1" /> Questão de Prova Anterior
          </span>
        );
      case 'IA_INEDITA_EDITAL':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> IA Inédita (Fiel ao Edital)
          </span>
        );
      case 'IA_INEDITA_PADRAO_BANCA':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> IA Inédita (Padrão da Banca)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            Questão Adaptada
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Filtros da Questão */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-sm font-bold text-white">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filtros do Banco de Questões</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Filtro Disciplina */}
          <select
            value={disciplinaFilter}
            onChange={(e) => setDisciplinaFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Todas as Disciplinas</option>
            {disciplinasList.map(d => (
              <option key={d.id} value={d.id}>{d.nome}</option>
            ))}
          </select>

          {/* Filtro Origem */}
          <select
            value={origemFilter}
            onChange={(e) => setOrigemFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Todas as Origens</option>
            <option value="REAL_PROVA">Provas Anteriores Oficiais</option>
            <option value="IA_INEDITA_EDITAL">Inédita IA (Edital SEDUC)</option>
            <option value="IA_INEDITA_PADRAO_BANCA">Inédita IA (Padrão VUNESP/FGV)</option>
          </select>

          {/* Filtro Dificuldade */}
          <select
            value={dificuldadeFilter}
            onChange={(e) => setDificuldadeFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Todas as Dificuldades</option>
            <option value="FACIL">Fácil</option>
            <option value="MEDIA">Média</option>
            <option value="DIFICIL">Difícil</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Carregando questões do acervo SEDUC...</p>
        </div>
      ) : !currentQuestao ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-4">
          <BookOpen className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-lg font-bold text-white">Nenhuma questão encontrada</h3>
          <p className="text-sm max-w-md mx-auto">
            Não há questões correspondentes aos filtros selecionados. Tente limpar os filtros ou gerar questões inéditas com IA.
          </p>
          <button
            onClick={() => {
              setDisciplinaFilter('');
              setOrigemFilter('');
              setDificuldadeFilter('');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        /* Card da Questão Ativa */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
          {/* Header da Questão */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {getOrigemBadge(currentQuestao.origem)}
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Banca: {currentQuestao.banca} ({currentQuestao.ano})
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                Dificuldade: {currentQuestao.dificuldade}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Questão {currentIndex + 1} de {questoes.length}
            </div>
          </div>

          {/* Origem e Tópico */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              {currentQuestao.assunto} {currentQuestao.subassunto ? `• ${currentQuestao.subassunto}` : ''}
            </div>
            <p className="text-xs text-slate-400 italic">
              Fonte oficial: {currentQuestao.fonte}
            </p>
          </div>

          {/* Enunciado da Questão */}
          <div className="text-slate-100 text-sm sm:text-base leading-relaxed font-medium bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
            {currentQuestao.enunciado}
          </div>

          {/* Alternativas (A, B, C, D, E) */}
          <div className="space-y-3">
            {currentQuestao.alternativas.map((alt) => {
              const isSelected = selectedOption === alt.letra;
              const isSubmitted = responseResult !== null;
              const isCorrectAnswer = currentQuestao.resposta_correta === alt.letra;

              let btnStyle = 'border-slate-800 bg-slate-950/70 hover:bg-slate-800/60 text-slate-200';
              if (isSubmitted) {
                if (isCorrectAnswer) {
                  btnStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = 'border-rose-500/80 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500';
                } else {
                  btnStyle = 'border-slate-800/60 bg-slate-950/30 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'border-indigo-500 bg-indigo-950/40 text-white ring-2 ring-indigo-500/50';
              }

              return (
                <button
                  key={alt.letra}
                  id={`btn-alt-${alt.letra}`}
                  disabled={isSubmitted || submitting}
                  onClick={() => setSelectedOption(alt.letra)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start space-x-3.5 ${btnStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSubmitted && isCorrectAnswer
                      ? 'bg-emerald-500 text-slate-950'
                      : isSubmitted && isSelected && !isCorrectAnswer
                      ? 'bg-rose-500 text-white'
                      : isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {alt.letra}
                  </span>
                  <span className="text-sm leading-relaxed pt-0.5">{alt.texto}</span>
                </button>
              );
            })}
          </div>

          {/* Botão Responder */}
          {!responseResult && (
            <div className="pt-2 flex justify-end">
              <button
                id="btn-submit-answer"
                disabled={!selectedOption || submitting}
                onClick={handleAnswerSubmit}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-blue-600/20 transition flex items-center gap-2"
              >
                {submitting ? 'Verificando...' : 'Confirmar Resposta'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* FEEDBACK INTELIGENTE COMPLETO (Item 35 & 53) */}
          {responseResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className={`p-5 rounded-2xl border ${
                responseResult.correta 
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {responseResult.correta ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-400" />
                    )}
                    <h4 className="text-base font-bold text-white">
                      {responseResult.correta ? 'Parabéns! Resposta Correta!' : 'Resposta Incorreta.'}
                    </h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    +{responseResult.xp_ganho} XP
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p><strong>Gabarito Oficial:</strong> Alternativa {currentQuestao.resposta_correta}</p>
                  <p className="text-slate-300">{currentQuestao.explicacao}</p>
                  {currentQuestao.por_que_correta && (
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-emerald-400 block">Fundamentação:</strong>
                      <p className="text-slate-300">{currentQuestao.por_que_correta}</p>
                    </div>
                  )}
                  {currentQuestao.por_que_outras_erradas && (
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                      <strong className="text-amber-400 block">Análise dos Distratores:</strong>
                      <p className="text-slate-300">{currentQuestao.por_que_outras_erradas}</p>
                    </div>
                  )}
                </div>

                {/* Botões de Aprofundamento com IA (Item 35) */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleRequestAiExplanation('SIMPLES')}
                    disabled={loadingAiExplanation !== null}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{loadingAiExplanation === 'SIMPLES' ? 'Gerando...' : 'Explique de Forma Simples'}</span>
                  </button>

                  <button
                    onClick={() => handleRequestAiExplanation('EXEMPLO')}
                    disabled={loadingAiExplanation !== null}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{loadingAiExplanation === 'EXEMPLO' ? 'Gerando...' : 'Me Dê um Exemplo na Prática'}</span>
                  </button>

                  <button
                    onClick={() => handleRequestAiExplanation('COMO_ESTUDAR')}
                    disabled={loadingAiExplanation !== null}
                    className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{loadingAiExplanation === 'COMO_ESTUDAR' ? 'Gerando...' : 'O Que Devo Estudar?'}</span>
                  </button>
                </div>

                {/* Caixa de Texto da Explicação Inteligente */}
                {aiExplanationText && (
                  <div className="mt-3 p-4 bg-slate-900 border border-indigo-500/40 rounded-xl text-xs sm:text-sm text-indigo-200 leading-relaxed space-y-1">
                    <strong className="text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Resposta da IA Educacional:
                    </strong>
                    <p className="whitespace-pre-line">{aiExplanationText}</p>
                  </div>
                )}
              </div>

              {/* Botões de Navegação */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition"
                >
                  Questão Anterior
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === questoes.length - 1}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Próxima Questão</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
