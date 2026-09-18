import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  Calendar, 
  Award,
  ChevronRight,
  ChevronDown,
  BrainCircuit,
  Zap,
  Layers,
  ArrowRight,
  FileCheck2,
  ListOrdered,
  Bot
} from 'lucide-react';
import { Edital, Disciplina, Conteudo, NivelDominio, Questao } from '../types';
import { studyService } from '../services/studyService';
import { EDITAL_OFICIAL_SEDUC } from '../data/editalOficial';

interface EditalViewProps {
  onStartTopicPractice: (disciplinaId: string, conteudoId: string) => void;
}

export const EditalView: React.FC<EditalViewProps> = ({ onStartTopicPractice }) => {
  const [activeSubTab, setActiveSubTab] = useState<'verticalizado' | 'ia_leitor' | 'texto_integral'>('verticalizado');
  const [data, setData] = useState<{ edital: Edital; disciplinas: (Disciplina & { conteudos: (Conteudo & { nivel_dominio: NivelDominio; percentual_acerto: number; questoes_respondidas: number })[] })[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDisc, setExpandedDisc] = useState<Record<string, boolean>>({});

  // Estados da Análise do Edital por IA
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiGeneratingQuestions, setAiGeneratingQuestions] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<any | null>(null);
  const [generatedBatch, setGeneratedBatch] = useState<Questao[]>([]);
  const [selectedDiscToGenerate, setSelectedDiscToGenerate] = useState<string>('disc_leg_01');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    loadEditalData();
  }, []);

  const loadEditalData = async () => {
    setLoading(true);
    try {
      const resData = await studyService.getEditalData();
      setData(resData);
      const initialExpanded: Record<string, boolean> = {};
      resData.disciplinas?.forEach((d: any) => {
        initialExpanded[d.id] = true;
      });
      setExpandedDisc(initialExpanded);
    } catch (err) {
      console.error('Erro ao carregar dados do edital:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAIAnalysis = async () => {
    setAiAnalyzing(true);
    setStatusMessage(null);
    try {
      const res = await studyService.analisarEditalPorIA();
      setAiDiagnosis(res.diagnostico);
      setStatusMessage('Análise do Edital concluída com sucesso pelos Agentes Cognitivos!');
    } catch (err: any) {
      setStatusMessage('Erro na leitura de IA: ' + err.message);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleGenerateQuestionsFromEdital = async () => {
    setAiGeneratingQuestions(true);
    setStatusMessage(null);
    try {
      const res = await studyService.gerarBateriaQuestoesDoEdital(selectedDiscToGenerate);
      setGeneratedBatch(prev => [...res.novas_questoes, ...prev]);
      setStatusMessage(`Sucesso! ${res.questoes_criadas} novas questões inéditas foram geradas e incorporadas ao banco de questões.`);
    } catch (err: any) {
      setStatusMessage('Erro ao gerar questões: ' + err.message);
    } finally {
      setAiGeneratingQuestions(false);
    }
  };

  const toggleDisc = (id: string) => {
    setExpandedDisc(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status: NivelDominio) => {
    switch (status) {
      case 'DOMINADO':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Dominado
          </span>
        );
      case 'EM_REVISAO':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3 h-3 mr-1" /> Em Revisão
          </span>
        );
      case 'EM_ESTUDO':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3 mr-1" /> Em Estudo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            Não Estudado
          </span>
        );
    }
  };

  if (loading && !data) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm">Carregando edital oficial da SEDUC-CE 2026...</p>
      </div>
    );
  }

  const edital = data?.edital || EDITAL_OFICIAL_SEDUC;
  const disciplinas = data?.disciplinas || [];

  // Filtragem por busca
  const filteredDisciplinas = disciplinas.map(disc => {
    const matchesDisc = disc.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchedConteudos = disc.conteudos.filter(c => 
      matchesDisc || 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
      ...disc,
      conteudos: matchedConteudos
    };
  }).filter(disc => disc.conteudos.length > 0);

  const totalConteudos = disciplinas.reduce((acc, d) => acc + d.conteudos.length, 0);
  const dominados = disciplinas.reduce((acc, d) => acc + d.conteudos.filter(c => c.nivel_dominio === 'DOMINADO').length, 0);
  const emEstudo = disciplinas.reduce((acc, d) => acc + d.conteudos.filter(c => c.nivel_dominio === 'EM_ESTUDO').length, 0);
  const emRevisao = disciplinas.reduce((acc, d) => acc + d.conteudos.filter(c => c.nivel_dominio === 'EM_REVISAO').length, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header com Metadados Oficiais do Edital */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {edital.banca} • Edital Ativo
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {edital.versao}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                60 Questões Objetivas • Prova CEV-UECE
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {edital.nome}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              {edital.cargo} — {edital.orgao}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-center">
              <div className="text-xs text-slate-500 font-medium">Banca Examinadora</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">{edital.banca}</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-center">
              <div className="text-xs text-slate-500 font-medium">Data Prevista</div>
              <div className="text-sm font-bold text-indigo-400 mt-0.5">18/10/2026</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-500 font-medium">Cobertura Edital</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                {totalConteudos > 0 ? Math.round((dominados / totalConteudos) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs de Navegação */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap gap-2">
          <button
            id="subtab-verticalizado"
            onClick={() => setActiveSubTab('verticalizado')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'verticalizado'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Edital Verticalizado por Disciplina</span>
          </button>

          <button
            id="subtab-ia-leitor"
            onClick={() => {
              setActiveSubTab('ia_leitor');
              if (!aiDiagnosis) handleRunAIAnalysis();
            }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'ia_leitor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-amber-400" />
            <span>Leitura por IA & Gerador do Edital</span>
          </button>

          <button
            id="subtab-texto-integral"
            onClick={() => setActiveSubTab('texto_integral')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'texto_integral'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Texto Integral Oficial do Edital</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl text-xs text-indigo-200 flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white ml-4">✕</button>
        </div>
      )}

      {/* 1. ABA EDITAL VERTICALIZADO */}
      {activeSubTab === 'verticalizado' && (
        <div className="space-y-6">
          {/* Barra de Progresso Geral do Edital */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-300">
                Progresso Geral de Domínio dos Conteúdos ({dominados}/{totalConteudos} tópicos dominados)
              </span>
              <span className="text-xs font-semibold text-emerald-400">
                {totalConteudos > 0 ? Math.round((dominados / totalConteudos) * 100) : 0}% Concluído
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 flex overflow-hidden border border-slate-800">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${(dominados / totalConteudos) * 100}%` }} title="Dominados" />
              <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${(emEstudo / totalConteudos) * 100}%` }} title="Em Estudo" />
              <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${(emRevisao / totalConteudos) * 100}%` }} title="Em Revisão" />
            </div>
            <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 pt-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {dominados} Dominados</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> {emEstudo} Em Estudo</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> {emRevisao} Em Revisão</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> {totalConteudos - (dominados + emEstudo + emRevisao)} Não Estudados</span>
            </div>
          </div>

          {/* Busca e Filtro */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar disciplina, lei, artigo, autor (ex: LDB, ECA, Piaget, Vunesp, BNCC)..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Lista Verticalizada de Disciplinas e Conteúdos */}
          <div className="space-y-4">
            {filteredDisciplinas.map((disc) => {
              const isExpanded = !!expandedDisc[disc.id];
              return (
                <div 
                  key={disc.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <div 
                    onClick={() => toggleDisc(disc.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-850 bg-slate-900 select-none border-b border-slate-800/80"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {disc.nome}
                        </h3>
                        <p className="text-xs text-slate-400">
                          Peso no Edital: <strong className="text-amber-400 font-bold">{disc.peso}</strong> • {disc.quantidade_questoes} questões previstas na prova
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-slate-400 hidden sm:block">
                        {disc.conteudos.length} {disc.conteudos.length === 1 ? 'tópico' : 'tópicos'}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="divide-y divide-slate-800/60 bg-slate-950/40">
                      {disc.conteudos.map((conteudo) => (
                        <div 
                          key={conteudo.id}
                          className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/50 transition"
                        >
                          <div className="space-y-1.5 max-w-3xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-200">
                                {conteudo.nome}
                              </h4>
                              {getStatusBadge(conteudo.nivel_dominio)}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {conteudo.descricao}
                            </p>
                            {conteudo.questoes_respondidas > 0 && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                <span>{conteudo.questoes_respondidas} respondidas</span>
                                <span>•</span>
                                <span className={conteudo.percentual_acerto >= 70 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                                  {conteudo.percentual_acerto}% de acerto
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              id={`btn-practice-${conteudo.id}`}
                              onClick={() => onStartTopicPractice(disc.id, conteudo.id)}
                              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition shadow-sm"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Praticar Este Tópico</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. ABA LEITURA INTELIGENTE POR IA & GERADOR */}
      {activeSubTab === 'ia_leitor' && (
        <div className="space-y-6">
          {/* Caixa de Controle da IA */}
          <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Bot className="w-4 h-4" />
                  <span>Pipeline Multiagente de IA do Edital</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Leitor Inteligente do Edital Embutido
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  O edital oficial do concurso da SEDUC-CE 2026 (CEV-UECE) está embutido no código do sistema.
                  A IA analisa as normas, os pesos ponderados, o perfil da banca examinadora e gera automaticamente novas baterias de questões inéditas.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  id="btn-run-ai-analysis"
                  onClick={handleRunAIAnalysis}
                  disabled={aiAnalyzing}
                  className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition disabled:opacity-50 shadow-md"
                >
                  {aiAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processando Edital...</span>
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="w-4 h-4" />
                      <span>Reexecutar Análise por IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Diagnóstico da IA */}
          {aiDiagnosis && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Perfil da Banca */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  {aiDiagnosis.titulo}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  {aiDiagnosis.resumo_banca}
                </p>

                {/* Tópicos Críticos */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    6 Tópicos Mais Recorrentes da CEV-UECE Identificados no Edital:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {aiDiagnosis.topicos_criticos_vunesp?.map((topico: string, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {idx + 1}
                        </span>
                        <span>{topico}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recomendações Estratégicas */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Estratégia Recomendada pela IA:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {aiDiagnosis.sugestoes_estudo?.map((sugestao: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{sugestao}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 2: Pesos e Gerador Imediato */}
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Gerador de Questões pelo Edital
                  </h3>
                  <p className="text-xs text-slate-400">
                    Selecione a disciplina do edital para gerar 2 novas questões inéditas com fundamentação legal imediata:
                  </p>

                  <select
                    value={selectedDiscToGenerate}
                    onChange={(e) => setSelectedDiscToGenerate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {disciplinas.map(d => (
                      <option key={d.id} value={d.id}>{d.nome} (Peso {d.peso})</option>
                    ))}
                  </select>

                  <button
                    id="btn-generate-edital-batch"
                    onClick={handleGenerateQuestionsFromEdital}
                    disabled={aiGeneratingQuestions}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition disabled:opacity-50 shadow-md"
                  >
                    {aiGeneratingQuestions ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Gerando com Agentes...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Gerar Questões Desta Disciplina</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Pesos das Disciplinas */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Pesos Oficiais do Edital
                  </h4>
                  <div className="space-y-2">
                    {aiDiagnosis.distribuicao_pesos?.map((item: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-slate-200">{item.disciplina}</div>
                          <div className="text-[10px] text-slate-500">{item.questoes} questões • {item.relevancia}</div>
                        </div>
                        <span className="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs">
                          P {item.peso}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Questões recém-geradas pelo Edital */}
          {generatedBatch.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Questões Inéditas Geradas da Leitura do Edital ({generatedBatch.length})
              </h3>
              <div className="space-y-4">
                {generatedBatch.map((q) => (
                  <div key={q.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold text-indigo-400">{q.fonte}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{q.dificuldade}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {q.enunciado}
                    </p>
                    <div className="space-y-1.5 pl-2">
                      {q.alternativas.map(alt => (
                        <div 
                          key={alt.letra} 
                          className={`p-2 rounded-xl text-xs border ${
                            alt.letra === q.resposta_correta 
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-semibold' 
                              : 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                          }`}
                        >
                          <span className="font-bold mr-2">{alt.letra})</span> {alt.texto}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
                      <strong>Fundamentação:</strong> {q.explicacao}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ABA TEXTO INTEGRAL OFICIAL DO EDITAL */}
      {activeSubTab === 'texto_integral' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Edital de Abertura na Íntegra (SEDUC-CE 2026 / CEV-UECE)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Documento oficial embutido no código-fonte, consolidado para a prova de Professor da Educação Básica do Ceará.
                </p>
              </div>

              <div className="text-xs text-slate-500 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                Disponível Offline & em Deploy
              </div>
            </div>

            {/* Conteúdo textual do edital com visualizador estilizado */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[600px] overflow-y-auto selection:bg-indigo-600 selection:text-white">
              {EDITAL_OFICIAL_SEDUC.texto_integral}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
