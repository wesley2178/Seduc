import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Play, 
  ShieldAlert, 
  Zap, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Flag
} from 'lucide-react';
import { Simulado, Questao, SimuladoTipo } from '../types';
import { studyService } from '../services/studyService';

interface SimulationViewProps {
  initialType?: string;
  onRefreshSummary: () => void;
}

export const SimulationView: React.FC<SimulationViewProps> = ({ 
  initialType, 
  onRefreshSummary 
}) => {
  const [activeSimulado, setActiveSimulado] = useState<Simulado | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  // Cronômetro
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  // Resultado
  const [submitting, setSubmitting] = useState(false);
  const [report, setReport] = useState<any | null>(null);

  // Seleção de Tipo para Criar
  const [selectedType, setSelectedType] = useState<SimuladoTipo>((initialType as SimuladoTipo) || 'COMPLETO');
  const [disciplinas, setDisciplinas] = useState<{ id: string; nome: string }[]>([]);
  const [selectedDisc, setSelectedDisc] = useState<string>('');

  useEffect(() => {
    studyService.getEditalData().then(data => {
      if (data.disciplinas) {
        setDisciplinas(data.disciplinas);
        if (data.disciplinas.length > 0) setSelectedDisc(data.disciplinas[0].id);
      }
    }).catch(console.error);
  }, []);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const handleStartSimulado = async (tipo: SimuladoTipo) => {
    try {
      const qtd = tipo === 'COMPLETO' || tipo === 'REALISTA' ? 10 : 5;
      const data = await studyService.criarSimulado(
        tipo, 
        tipo === 'POR_DISCIPLINA' ? selectedDisc : undefined,
        qtd
      );

      setActiveSimulado(data.simulado);
      setQuestoes(data.questoes);
      setCurrentIdx(0);
      setUserAnswers({});
      setFlagged({});
      setReport(null);
      setSecondsRemaining(data.simulado.tempo_limite * 60);
      setIsRunning(true);
    } catch (err) {
      console.error('Erro ao iniciar simulado:', err);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmitSimulado();
  };

  const handleSubmitSimulado = async () => {
    if (!activeSimulado || submitting) return;
    setSubmitting(true);
    setIsRunning(false);

    const tempoGasto = (activeSimulado.tempo_limite * 60) - secondsRemaining;

    try {
      // Tenta submeter na API
      const res = await fetch(`/api/simulados/${activeSimulado.id}/submeter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respostas: userAnswers,
          tempo_gasto_segundos: tempoGasto > 0 ? tempoGasto : 60
        })
      });

      if (res.ok) {
        const result = await res.json();
        setReport(result);
      } else {
        throw new Error('API offline');
      }
    } catch {
      // Cálculo local do relatório do simulado
      let acertos = 0;
      questoes.forEach(q => {
        if (userAnswers[q.id] === q.resposta_correta) {
          acertos++;
        }
      });
      const taxa = questoes.length > 0 ? Math.round((acertos / questoes.length) * 100) : 0;
      const xpGanho = (acertos * 30) + ((questoes.length - acertos) * 10);

      setReport({
        simulado: {
          ...activeSimulado,
          status: 'CONCLUIDO',
          acertos,
          erros: questoes.length - acertos,
          taxa_acerto: taxa,
          tempo_gasto_segundos: tempoGasto > 0 ? tempoGasto : 60
        },
        questoes_detalhe: questoes.map(q => ({
          questao: q,
          resposta_usuario: userAnswers[q.id] || null,
          correta: userAnswers[q.id] === q.resposta_correta
        })),
        desempenho_por_disciplina: disciplinas.map(d => {
          const qDisc = questoes.filter(item => item.disciplina_id === d.id);
          const acertosDisc = qDisc.filter(item => userAnswers[item.id] === item.resposta_correta).length;
          return {
            disciplina_nome: d.nome,
            total: qDisc.length,
            acertos: acertosDisc,
            taxa: qDisc.length > 0 ? Math.round((acertosDisc / qDisc.length) * 100) : 0
          };
        }).filter(d => d.total > 0),
        diagnostico_ia: {
          mensagem: taxa >= 70 
            ? 'Excelente aproveitamento! Seu desempenho demonstra sólida compreensão das diretrizes pedagógicas e da legislação da SEDUC.'
            : 'Bom treino! Recomendamos revisar os tópicos em que ocorreram erros utilizando o Caderno de Erros da plataforma.',
          prioridade_estudo: 'Revisão das questões erradas com foco no gabarito fundamentado.'
        },
        xp_ganho: xpGanho,
        level_up: false,
        streak_info: {
          current_streak: 4,
          message: 'Sequência diária de estudos mantida!'
        }
      });
    } finally {
      onRefreshSummary();
      setSubmitting(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Se o aluno está no meio de uma prova ativa
  if (activeSimulado && !report) {
    const q = questoes[currentIdx];
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="space-y-6 pb-12">
        {/* Header da Prova & Cronômetro */}
        <div className="sticky top-20 z-40 bg-slate-900/95 backdrop-blur border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">{activeSimulado.titulo}</h2>
            <p className="text-xs text-slate-400">
              Questão {currentIdx + 1} de {questoes.length} • {answeredCount}/{questoes.length} respondidas
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Timer */}
            <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border font-mono text-sm font-bold ${
              secondsRemaining < 300 
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            {/* Submeter */}
            <button
              id="btn-submit-exam"
              onClick={handleSubmitSimulado}
              disabled={submitting}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              Finalizar Simulado
            </button>
          </div>
        </div>

        {/* Grade de Navegação das Questões */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-400 mr-2 font-medium">Navegador:</span>
          {questoes.map((item, idx) => {
            const hasAns = !!userAnswers[item.id];
            const isFlag = !!flagged[item.id];
            const isCur = currentIdx === idx;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center relative ${
                  isCur
                    ? 'ring-2 ring-indigo-400 bg-indigo-600 text-white'
                    : hasAns
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {idx + 1}
                {isFlag && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Questão Atual */}
        {q && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {q.assunto}
              </span>
              <button
                onClick={() => setFlagged(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                className={`flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                  flagged[q.id]
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[q.id] ? 'Revisar Depois' : 'Marcar para Revisar'}</span>
              </button>
            </div>

            <div className="text-slate-100 text-sm sm:text-base leading-relaxed font-medium bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
              {q.enunciado}
            </div>

            {/* Alternativas */}
            <div className="space-y-3">
              {q.alternativas.map((alt) => {
                const isSelected = userAnswers[q.id] === alt.letra;
                return (
                  <button
                    key={alt.letra}
                    onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: alt.letra }))}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start space-x-3.5 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/40 text-white ring-2 ring-indigo-500/50'
                        : 'border-slate-800 bg-slate-950/70 hover:bg-slate-800/60 text-slate-200'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {alt.letra}
                    </span>
                    <span className="text-sm leading-relaxed pt-0.5">{alt.texto}</span>
                  </button>
                );
              })}
            </div>

            {/* Navegação Prev / Next */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>

              <button
                disabled={currentIdx === questoes.length - 1}
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 text-xs font-bold transition flex items-center gap-1.5"
              >
                Próxima <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Se o aluno finalizou o simulado: RELATÓRIO PÓS-SIMULADO (Item 34)
  if (report) {
    const { nota, acertos, totalQuestoes, xpGanho, detalhes, levelUp } = report;

    return (
      <div className="space-y-6 pb-12">
        {/* Banner de Resultado */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Relatório de Desempenho Pós-Simulado
              </span>
              <h2 className="text-2xl font-bold mt-2">Simulado Concluído com Sucesso!</h2>
              <p className="text-xs text-slate-400">
                {acertos} de {totalQuestoes} acertos • Tempo calibrado
              </p>
            </div>

            <div className="text-center bg-slate-900/90 border border-slate-700 p-4 rounded-xl min-w-[140px]">
              <div className="text-3xl font-extrabold text-amber-400">{nota}%</div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Nota Final</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Zap className="w-4 h-4 text-amber-400" /> +{xpGanho} XP Conquistados
            </span>
            {levelUp && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 animate-bounce">
                <Award className="w-4 h-4 text-emerald-400" /> LEVEL UP! Parabéns!
              </span>
            )}
          </div>
        </div>

        {/* Gabarito Comentado e Revisão de Erros do Simulado */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Gabarito Comentado e Análise de Questões</span>
          </h3>

          <div className="space-y-4">
            {detalhes.map((item: any, idx: number) => {
              const q = item.questao;
              const isCorrect = item.correta;

              return (
                <div 
                  key={q.id}
                  className={`p-5 rounded-xl border space-y-3 ${
                    isCorrect 
                      ? 'bg-slate-950/40 border-slate-800' 
                      : 'bg-rose-950/20 border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Questão #{idx + 1} • {q.assunto}</span>
                    <span className={`font-bold flex items-center gap-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isCorrect ? 'Acertou' : 'Errou'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {q.enunciado}
                  </p>

                  <div className="text-xs text-slate-300 space-y-1.5 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div>
                      <strong className="text-slate-400">Sua Resposta:</strong> Alternativa {item.respostaUsuario || 'Não respondeu'}
                    </div>
                    <div>
                      <strong className="text-emerald-400">Gabarito Correto:</strong> Alternativa {q.resposta_correta}
                    </div>
                    <p className="text-slate-400 pt-1 leading-relaxed">{q.explicacao}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                setActiveSimulado(null);
                setReport(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Voltar aos Simulados</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Menu Inicial para Escolher e Criar Simulado (Item 32)
  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
          <Award className="w-6 h-6 text-amber-400" />
          <span>Simulados Estratégicos SEDUC</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Testes cronometrados calibrados com a banca oficial. Escolha a modalidade de treino para testar sua resistência e diagnosticar seu nível de prontidão.
        </p>
      </div>

      {/* Grid de Modalidades de Simulado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Completo */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3 flex flex-col justify-between transition">
          <div className="space-y-2">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl w-fit">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Simulado Completo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Distribuição equilibrada por todas as disciplinas do edital com cronômetro realista.
            </p>
          </div>
          <button
            onClick={() => handleStartSimulado('COMPLETO')}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Iniciar Completo (10 Q)
          </button>
        </div>

        {/* 2. Adaptativo Inteligente */}
        <div className="bg-gradient-to-b from-purple-950/30 to-slate-900 border border-purple-500/30 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-white">Simulado Adaptativo</h3>
              <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold">IA</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A IA distribui 60% das questões nos tópicos em que sua taxa de acerto está mais baixa.
            </p>
          </div>
          <button
            onClick={() => handleStartSimulado('ADAPTATIVO')}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Iniciar Adaptativo
          </button>
        </div>

        {/* 3. Realista CEV-UECE */}
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3 flex flex-col justify-between transition">
          <div className="space-y-2">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl w-fit">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Simulado Realista CEV-UECE</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simula as condições reais da prova SEDUC-CE 2026 da CEV-UECE, com tempo cronometrado rígido e pesos oficiais.
            </p>
          </div>
          <button
            onClick={() => handleStartSimulado('REALISTA')}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Iniciar Prova Real
          </button>
        </div>

        {/* 4. Por Disciplina */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Por Disciplina</h3>
            <select
              value={selectedDisc}
              onChange={(e) => setSelectedDisc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
            >
              {disciplinas.map(d => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => handleStartSimulado('POR_DISCIPLINA')}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Iniciar Disciplina
          </button>
        </div>

        {/* 5. Meus Erros */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl w-fit">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Simulado dos Meus Erros</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Treine exclusivamente as questões que você errou anteriormente até fixar 100%.
            </p>
          </div>
          <button
            onClick={() => handleStartSimulado('ERROS')}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Iniciar Treino de Erros
          </button>
        </div>

        {/* 6. Revisão Geral */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Simulado de Revisão</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Questões selecionadas dos conteúdos em ciclo de revisão ativa espaçada.
            </p>
          </div>
          <button
            onClick={() => handleStartSimulado('REVISAO')}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Iniciar Revisão
          </button>
        </div>
      </div>
    </div>
  );
};
