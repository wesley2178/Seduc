import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  XCircle,
  AlertCircle, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Search,
  Sliders,
  RefreshCw,
  HelpCircle,
  Award,
  Check,
  X,
  RotateCcw,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Questao, QuestaoDificuldade, QuestaoOrigem } from '../types';
import { DISCIPLINAS_OFICIAIS, QUESTOES_OFICIAIS_SEDUC } from '../data/editalOficial';

interface GeneratorViewProps {
  onGoToQuestions: () => void;
}

const DEFAULT_DISCIPLINAS = DISCIPLINAS_OFICIAIS.map(d => ({
  id: d.id,
  nome: d.nome,
  conteudos: d.conteudos.map(c => ({ id: c.id, nome: c.nome }))
}));

export const GeneratorView: React.FC<GeneratorViewProps> = ({ onGoToQuestions }) => {
  const [disciplinas, setDisciplinas] = useState<{ id: string; nome: string; conteudos: { id: string; nome: string }[] }[]>(DEFAULT_DISCIPLINAS);
  const [selectedDisc, setSelectedDisc] = useState<string>(DEFAULT_DISCIPLINAS[0]?.id || '');
  const [selectedCont, setSelectedCont] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(3);
  const [dificuldade, setDificuldade] = useState<QuestaoDificuldade>('MEDIA');
  const [tipoOrigem, setTipoOrigem] = useState<QuestaoOrigem>('IA_INEDITA_EDITAL');
  const [banca, setBanca] = useState<string>('CEV-UECE');

  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [generatedQuestions, setGeneratedQuestions] = useState<Questao[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estados de resposta interativa do aluno
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/edital')
      .then(res => {
        if (!res.ok) throw new Error('Falha ao carregar edital');
        return res.json();
      })
      .then(data => {
        if (data.disciplinas && data.disciplinas.length > 0) {
          setDisciplinas(data.disciplinas);
          if (!selectedDisc) {
            setSelectedDisc(data.disciplinas[0].id);
          }
        }
      })
      .catch(err => {
        console.warn('Usando dados de disciplinas locais (modo resiliente):', err);
      });
  }, []);

  const activeConteudos = disciplinas.find(d => d.id === selectedDisc)?.conteudos || [];

  const handleGenerate = async () => {
    if (!selectedDisc || generating) return;
    setGenerating(true);
    setGeneratedQuestions([]);
    setUserAnswers({});
    setSubmittedQuestions({});
    setErrorMessage(null);
    setCurrentStep(1);

    // Animação dos passos multiagentes
    const timer1 = setTimeout(() => setCurrentStep(2), 600);
    const timer2 = setTimeout(() => setCurrentStep(3), 1200);
    const timer3 = setTimeout(() => setCurrentStep(4), 1800);

    try {
      const res = await fetch('/api/questoes/gerar-demanda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplina_id: selectedDisc,
          conteudo_id: selectedCont || undefined,
          quantidade,
          dificuldade,
          tipo_origem: tipoOrigem,
          banca
        })
      });

      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) {
        const errorText = await res.text();
        throw new Error(
          res.status === 504 
            ? 'A requisição excedeu o tempo limite da Vercel (Timeout). Tente gerar 1 ou 2 questões.' 
            : res.status === 404
            ? 'A rota /api/questoes/gerar-demanda não foi encontrada no deploy da Vercel. Verifique a configuração do vercel.json.'
            : `Erro no servidor (${res.status}): ${errorText.substring(0, 120)}`
        );
      }

      const data = await res.json();
      if (!data.sucesso || !data.questoes || data.questoes.length === 0) {
        throw new Error(data.mensagem || data.error || 'Nenhuma questão foi retornada pelo motor de IA.');
      }

      setCurrentStep(5);
      setGeneratedQuestions(data.questoes);
    } catch (err: any) {
      console.error('Erro na geração:', err);
      setErrorMessage(err.message || 'Erro inesperado ao gerar questões.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setGenerating(false);
    }
  };

  // Fallback de emergência local se a Vercel estiver sem GROQ_API_KEY ou sem conexão
  const handleLocalFallbackGenerate = () => {
    setGenerating(false);
    setErrorMessage(null);
    setCurrentStep(5);
    setUserAnswers({});
    setSubmittedQuestions({});

    const filtradas = QUESTOES_OFICIAIS_SEDUC.filter(q => q.disciplina_id === selectedDisc);
    const pool = filtradas.length > 0 ? filtradas : QUESTOES_OFICIAIS_SEDUC;
    const selecionadas: Questao[] = [];

    for (let i = 0; i < quantidade; i++) {
      const base = pool[i % pool.length];
      selecionadas.push({
        ...base,
        id: `q_fallback_${Date.now()}_${i}`,
        origem: 'IA_INEDITA_PADRAO_BANCA',
        fonte: `Questão Calibrada SEDUC-CE 2026 — Padrão ${banca} (Modo Resiliente)`,
        banca: banca,
        created_at: new Date().toISOString()
      });
    }

    setGeneratedQuestions(selecionadas);
  };

  // Ação de responder uma questão
  const handleSelectOption = (questaoId: string, letra: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (submittedQuestions[questaoId]) return; // Não altera se já respondida
    setUserAnswers(prev => ({ ...prev, [questaoId]: letra }));
  };

  const handleConfirmAnswer = async (questao: Questao) => {
    const selectedLetter = userAnswers[questao.id];
    if (!selectedLetter) return;

    setSubmittedQuestions(prev => ({ ...prev, [questao.id]: true }));

    const acertou = selectedLetter === questao.resposta_correta;
    if (acertou) {
      try {
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch {}
    }

    // Registra a tentativa na API para pontuação de XP e estatísticas
    try {
      await fetch(`/api/questoes/${questao.id}/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resposta: selectedLetter,
          tempo_segundos: 60
        })
      });
    } catch {
      // Ignora erro se estiver em ambiente sem servidor persistente
    }
  };

  const handleResetQuestion = (questaoId: string) => {
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[questaoId];
      return next;
    });
    setSubmittedQuestions(prev => {
      const next = { ...prev };
      delete next[questaoId];
      return next;
    });
  };

  // Estatísticas em tempo real das questões geradas
  const totalQuestions = generatedQuestions.length;
  const answeredQuestionsCount = Object.keys(submittedQuestions).length;
  const correctAnswersCount = generatedQuestions.filter(
    q => submittedQuestions[q.id] && userAnswers[q.id] === q.resposta_correta
  ).length;
  const accuracyPercentage = answeredQuestionsCount > 0 
    ? Math.round((correctAnswersCount / answeredQuestionsCount) * 100) 
    : 0;

  const steps = [
    { label: 'Orquestrador', desc: 'Identifica contexto do concurso e parâmetros do edital 2026' },
    { label: 'Pesquisador RAG', desc: 'Recupera normas oficiais da LDB, ECA, LC 22/2000 e BNCC' },
    { label: 'Gerador Cognitivo', desc: 'Elabora questões inéditas com 5 opções (A a E) e distratores' },
    { label: 'Validador & Revisor', desc: 'Garante gabarito unívoco e ausência de ambiguidade' },
    { label: 'Detector de Duplicidade', desc: 'Valida ineditismo semântico com o banco existente' }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Cabeçalho do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              Gerador Inteligente de Questões por IA
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gera questões inéditas no padrão rigoroso do <strong>Edital SEDUC-CE 2026</strong> com 5 alternativas (A a E), gabarito comentado e parecer pedagógico completo.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Padrão CEV-UECE</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/40 text-xs font-bold text-indigo-300">
            5 Alternativas (A a E)
          </span>
        </div>
      </div>

      {/* Painel de Configuração da Geração */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Parâmetros de Elaboração da Prova</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Alinhamento estrito à Matriz de Competências SEDUC-CE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Disciplina */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Disciplina do Edital 2026:
            </label>
            <select
              value={selectedDisc}
              onChange={e => {
                setSelectedDisc(e.target.value);
                setSelectedCont('');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {disciplinas.map(d => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Conteúdo Programático */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Tópico Específico (Opcional):
            </label>
            <select
              value={selectedCont}
              onChange={e => setSelectedCont(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Todos os tópicos da disciplina</option>
              {activeConteudos.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Quantidade */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Quantidade de Questões:
            </label>
            <select
              value={quantidade}
              onChange={e => setQuantidade(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value={1}>1 questão focada</option>
              <option value={2}>2 questões</option>
              <option value={3}>3 questões (Recomendado)</option>
              <option value={5}>5 questões (Mini-Simulado)</option>
            </select>
          </div>

          {/* Dificuldade */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Nível de Dificuldade:
            </label>
            <select
              value={dificuldade}
              onChange={e => setDificuldade(e.target.value as QuestaoDificuldade)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="FACIL">Fácil — Conceitos Diretos</option>
              <option value="MEDIA">Média — Situações-Problema e Casos Concretos</option>
              <option value="DIFICIL">Difícil — Pegadinhas e Detalhes da Legislação</option>
            </select>
          </div>

          {/* Banca Examinadora */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Perfil da Banca Examinadora:
            </label>
            <select
              value={banca}
              onChange={e => setBanca(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="CEV-UECE">CEV-UECE (Fundação Universidade Estadual do Ceará)</option>
              <option value="FGV">FGV (Fundação Getulio Vargas)</option>
              <option value="Cebraspe">Cebraspe / UnB</option>
            </select>
          </div>

          {/* Tipo de Origem */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Tipo de Questão:
            </label>
            <select
              value={tipoOrigem}
              onChange={e => setTipoOrigem(e.target.value as QuestaoOrigem)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="IA_INEDITA_EDITAL">Inédita baseada no Edital SEDUC-CE 2026</option>
              <option value="IA_INEDITA_PADRAO_BANCA">Espelhada no histórico da CEV-UECE</option>
              <option value="IA_ADAPTADA">Adaptada com novos distratores</option>
            </select>
          </div>
        </div>

        {/* Botão de Disparo */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>As opções A a E são geradas com distratores calibrados para o concurso. Você só verá o gabarito após responder.</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition ${
              generating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Processando Agentes Cognitivos...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Gerar {quantidade} Questões Inéditas por IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Banner de Erro com Fallback Resiliente */}
      {errorMessage && (
        <div key="error-diagnostic-banner" className="bg-red-950/40 border border-red-500/40 rounded-2xl p-5 space-y-3 text-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <h4 className="text-sm font-bold text-red-100">
                Falha na conexão com o servidor de IA
              </h4>
              <p className="text-xs text-red-300 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 justify-end">
            <button
              onClick={handleLocalFallbackGenerate}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Gerar Questões pelo Banco Oficial CEV-UECE</span>
            </button>
          </div>
        </div>
      )}

      {/* Pipeline Visual dos Agentes de IA */}
      {generating && (
        <div key="pipeline-visual-block" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Pipeline Cognitivo em Execução (Multi-Agent Engine)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {steps.map((step, idx) => {
              const isPast = currentStep > idx + 1;
              const isCurrent = currentStep === idx + 1;
              return (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border text-xs space-y-1 transition ${
                    isPast
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 text-indigo-200'
                      : 'bg-slate-950/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{step.label}</span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {isCurrent && <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />}
                  </div>
                  <p className="text-[10px] leading-tight text-slate-400">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Questões Geradas com Sucesso & Fluxo Interativo de Resposta */}
      {generatedQuestions.length > 0 && (
        <div key="questions-list-block" className="space-y-6">
          {/* Barra de Progresso e Placar da Rodada */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{totalQuestions} Questões Prontas para Resolução</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Responda cada item para desbloquear o gabarito oficial e a explicação da banca.
                </p>
              </div>
            </div>

            {/* Placar em Tempo Real */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Respondidas</span>
                <span className="font-bold text-white">{answeredQuestionsCount} / {totalQuestions}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Acertos</span>
                <span className="font-bold text-emerald-400">{correctAnswersCount} ({accuracyPercentage}%)</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">XP Ganho</span>
                <span className="font-bold text-amber-400">+{correctAnswersCount * 25} XP</span>
              </div>
            </div>
          </div>

          {/* Lista de Questões Interativas */}
          <div className="space-y-6">
            {generatedQuestions.map((q, idx) => {
              if (!q) return null;
              const isSubmitted = Boolean(submittedQuestions[q.id]);
              const selectedLetter = userAnswers[q.id];
              const isCorrect = isSubmitted && selectedLetter === q.resposta_correta;

              const enunciado = typeof q.enunciado === 'string' ? q.enunciado : JSON.stringify(q.enunciado || '');
              const respostaCorreta = typeof q.resposta_correta === 'string' ? q.resposta_correta : 'A';
              const explicacao = typeof q.explicacao === 'string' ? q.explicacao : '';

              // Garantir 5 alternativas A a E mesmo se houver dados incompletos
              const letras: ('A' | 'B' | 'C' | 'D' | 'E')[] = ['A', 'B', 'C', 'D', 'E'];
              const alternativas = (q.alternativas && q.alternativas.length > 0)
                ? q.alternativas
                : letras.map(l => ({ letra: l, texto: `Alternativa ${l} referente ao tópico ${q.assunto || 'do edital'}.` }));

              return (
                <div 
                  key={q.id || `gen_${idx}`}
                  className={`bg-slate-900 border rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm transition ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-500/50 bg-slate-900/95 ring-1 ring-emerald-500/30'
                        : 'border-rose-500/40 bg-slate-900/95 ring-1 ring-rose-500/20'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Cabeçalho da Questão */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-indigo-400 uppercase tracking-wide">
                        Questão {idx + 1} de {totalQuestions}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                        {q.banca || 'CEV-UECE'} • SEDUC-CE 2026
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-400 text-[10px]">
                        {q.dificuldade === 'DIFICIL' ? 'Difícil' : q.dificuldade === 'FACIL' ? 'Fácil' : 'Média'}
                      </span>
                    </div>

                    {/* Status de Resposta */}
                    <div>
                      {isSubmitted ? (
                        isCorrect ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Você Acertou! (+25 XP)</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-rose-400" />
                            <span>Resposta Incorreta</span>
                          </span>
                        )
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Aguardando sua resposta</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Assunto / Referência */}
                  {q.assunto && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span><strong>Assunto:</strong> {q.assunto} {q.subassunto ? `— ${q.subassunto}` : ''}</span>
                    </div>
                  )}

                  {/* Enunciado Contextualizado */}
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
                      {enunciado}
                    </p>
                  </div>

                  {/* Alternativas Interativas (A a E) */}
                  <div className="space-y-2.5 pt-1">
                    {alternativas.map((alt) => {
                      const isSelected = selectedLetter === alt.letra;
                      const isGabarito = alt.letra === respostaCorreta;

                      let itemClasses = 'border-slate-800 bg-slate-950/60 hover:bg-slate-850 hover:border-slate-700 text-slate-300';
                      let badgeClasses = 'bg-slate-800 text-slate-300 border-slate-700';

                      if (!isSubmitted) {
                        if (isSelected) {
                          itemClasses = 'border-indigo-500 bg-indigo-950/40 text-white ring-2 ring-indigo-500/30';
                          badgeClasses = 'bg-indigo-600 text-white border-indigo-400';
                        }
                      } else {
                        // Após confirmação do gabarito
                        if (isGabarito) {
                          itemClasses = 'border-emerald-500 bg-emerald-950/50 text-emerald-100 ring-2 ring-emerald-500/40 font-medium';
                          badgeClasses = 'bg-emerald-600 text-white border-emerald-400';
                        } else if (isSelected && !isGabarito) {
                          itemClasses = 'border-rose-500 bg-rose-950/40 text-rose-200 line-through';
                          badgeClasses = 'bg-rose-600 text-white border-rose-400';
                        } else {
                          itemClasses = 'border-slate-800/60 bg-slate-950/30 text-slate-500 opacity-60';
                          badgeClasses = 'bg-slate-900 text-slate-600 border-slate-800';
                        }
                      }

                      return (
                        <button
                          key={alt.letra}
                          type="button"
                          onClick={() => handleSelectOption(q.id, alt.letra as any)}
                          disabled={isSubmitted}
                          className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition flex items-start gap-3.5 ${itemClasses}`}
                        >
                          <span className={`w-7 h-7 rounded-lg border font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${badgeClasses}`}>
                            {isSubmitted && isGabarito ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : isSubmitted && isSelected && !isGabarito ? (
                              <X className="w-4 h-4 stroke-[3]" />
                            ) : (
                              alt.letra
                            )}
                          </span>

                          <span className="text-xs sm:text-sm leading-relaxed flex-1">
                            {alt.texto}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Ação: Botão de Responder / Confirmar */}
                  {!isSubmitted ? (
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
                      <span className="text-xs text-slate-400">
                        {selectedLetter 
                          ? `Alternativa selecionada: (${selectedLetter}). Clique no botão ao lado para confirmar.`
                          : 'Selecione uma opção de A a E para conferir o gabarito e a explicação.'}
                      </span>

                      <button
                        onClick={() => handleConfirmAnswer(q)}
                        disabled={!selectedLetter}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-sm ${
                          selectedLetter
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 cursor-pointer'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <span>Confirmar Resposta</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* Painel de Gabarito Oficial e Parecer da Banca (SEDUC-CE 2026) */
                    <div className="pt-2 space-y-4 border-t border-slate-800">
                      {/* Destaque do Resultado */}
                      <div className={`p-4 rounded-xl border ${
                        isCorrect 
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                          : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-sm font-bold">
                            {isCorrect ? (
                              <>
                                <Award className="w-5 h-5 text-emerald-400" />
                                <span>Excelente! Gabarito Oficial: Alternativa {respostaCorreta}</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-5 h-5 text-amber-400" />
                                <span>Gabarito Oficial: Alternativa {respostaCorreta} (Você marcou {selectedLetter})</span>
                              </>
                            )}
                          </div>

                          <button
                            onClick={() => handleResetQuestion(q.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Tentar Novamente</span>
                          </button>
                        </div>
                      </div>

                      {/* Parecer Pedagógico Exaustivo da Banca */}
                      <div className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3.5 text-xs">
                        <div className="flex items-center gap-2 text-indigo-300 font-bold border-b border-slate-800/80 pb-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-400" />
                          <span>Fundamentação e Parecer Pedagógico da Banca Examinadora</span>
                        </div>

                        {/* Explicação Geral */}
                        {explicacao && (
                          <div className="space-y-1">
                            <span className="font-semibold text-slate-300">Justificativa Oficial do Item:</span>
                            <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                              {explicacao}
                            </p>
                          </div>
                        )}

                        {/* Por que a correta é a correta */}
                        {q.por_que_correta && (
                          <div className="space-y-1">
                            <span className="font-semibold text-emerald-400">
                              Por que a Alternativa ({respostaCorreta}) é a Correta:
                            </span>
                            <p className="text-emerald-200/90 leading-relaxed bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20">
                              {q.por_que_correta}
                            </p>
                          </div>
                        )}

                        {/* Análise dos distratores */}
                        {q.por_que_outras_erradas && (
                          <div className="space-y-1">
                            <span className="font-semibold text-rose-400">
                              Análise dos Distratores (Por que as outras alternativas estão incorretas):
                            </span>
                            <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                              {q.por_que_outras_erradas}
                            </p>
                          </div>
                        )}

                        {/* Referência da Legislação / Edital */}
                        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-900">
                          <span><strong>Fonte:</strong> {q.fonte || 'SEDUC-CE 2026 — CEV-UECE'}</span>
                          <span className="text-indigo-400">Matriz de Competências Oficial</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
