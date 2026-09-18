import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Search,
  Sliders
} from 'lucide-react';
import { Questao, QuestaoDificuldade, QuestaoOrigem } from '../types';

interface GeneratorViewProps {
  onGoToQuestions: () => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({ onGoToQuestions }) => {
  const [disciplinas, setDisciplinas] = useState<{ id: string; nome: string; conteudos: { id: string; nome: string }[] }[]>([]);
  const [selectedDisc, setSelectedDisc] = useState<string>('');
  const [selectedCont, setSelectedCont] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(3);
  const [dificuldade, setDificuldade] = useState<QuestaoDificuldade>('MEDIA');
  const [tipoOrigem, setTipoOrigem] = useState<QuestaoOrigem>('IA_INEDITA_EDITAL');
  const [banca, setBanca] = useState<string>('VUNESP');

  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [generatedQuestions, setGeneratedQuestions] = useState<Questao[]>([]);

  useEffect(() => {
    fetch('/api/edital')
      .then(res => res.json())
      .then(data => {
        if (data.disciplinas) {
          setDisciplinas(data.disciplinas);
          if (data.disciplinas.length > 0) {
            setSelectedDisc(data.disciplinas[0].id);
          }
        }
      })
      .catch(console.error);
  }, []);

  const activeConteudos = disciplinas.find(d => d.id === selectedDisc)?.conteudos || [];

  const handleGenerate = async () => {
    if (!selectedDisc || generating) return;
    setGenerating(true);
    setGeneratedQuestions([]);
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

      const data = await res.json();
      setCurrentStep(5);
      setGeneratedQuestions(data.questoes || []);
    } catch (err) {
      console.error('Erro na geração:', err);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setGenerating(false);
    }
  };

  const steps = [
    { label: 'Orquestrador', desc: 'Identifica contexto do concurso e parâmetros do edital' },
    { label: 'Pesquisador RAG', desc: 'Recupera normas oficiais da LDB, ECA e BNCC' },
    { label: 'Gerador Cognitivo', desc: 'Elabora questões inéditas e distratores plausíveis' },
    { label: 'Validador & Revisor', desc: 'Garante gabarito unívoco e ausência de ambiguidade' },
    { label: 'Detector de Duplicidade', desc: 'Valida ineditismo semântico com o banco existente' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Banner Explicativo do Sistema Multiagente */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 rounded-2xl p-6 shadow-md text-white">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Sistema Multiagente SEDUC
              </span>
              <span className="text-xs text-slate-400">• Sem alucinações</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Gerador Inteligente de Questões Inéditas sob Demanda
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              O sistema não gera perguntas aleatórias. Ele consulta o edital em vigor, as provas anteriores da banca examinadora (VUNESP, FGV, CEBRASPE), a legislação seca oficial e passa por um pipeline com 10 agentes especializados de revisão e validação.
            </p>
          </div>
        </div>
      </div>

      {/* Formulário de Configuração */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Configuração da Geração</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Disciplina */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Disciplina do Edital</label>
            <select
              value={selectedDisc}
              onChange={(e) => {
                setSelectedDisc(e.target.value);
                setSelectedCont('');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {disciplinas.map(d => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </div>

          {/* Conteúdo Específico */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Conteúdo / Assunto</label>
            <select
              value={selectedCont}
              onChange={(e) => setSelectedCont(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Todos os Conteúdos da Disciplina</option>
              {activeConteudos.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          {/* Banca Examinadora */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Padrão da Banca</label>
            <select
              value={banca}
              onChange={(e) => setBanca(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="VUNESP">VUNESP (Banca Oficial SEDUC-SP)</option>
              <option value="FGV">FGV (Fundação Getulio Vargas)</option>
              <option value="CEBRASPE">CEBRASPE / CESPE</option>
              <option value="FCC">FCC (Fundação Carlos Chagas)</option>
            </select>
          </div>

          {/* Quantidade */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Quantidade de Questões (1 a 10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={quantidade}
              onChange={(e) => setQuantidade(Math.min(10, Math.max(1, Number(e.target.value))))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Dificuldade */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Nível de Dificuldade</label>
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(e.target.value as QuestaoDificuldade)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="FACIL">Fácil (Conceitual Direto)</option>
              <option value="MEDIA">Média (Estudos de Caso e Análise)</option>
              <option value="DIFICIL">Difícil (Casos Complexos e Exceções Legais)</option>
            </select>
          </div>

          {/* Tipo de Geração */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Classificação da Questão</label>
            <select
              value={tipoOrigem}
              onChange={(e) => setTipoOrigem(e.target.value as QuestaoOrigem)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="IA_INEDITA_EDITAL">Inédita baseada no Edital</option>
              <option value="IA_INEDITA_PADRAO_BANCA">Inédita modelada no padrão da Banca</option>
              <option value="IA_ADAPTADA">Adaptada de Provas Anteriores</option>
            </select>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            id="btn-generate-questions"
            onClick={handleGenerate}
            disabled={generating}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md shadow-purple-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processando Agentes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Gerar {quantidade} Questões Inéditas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Pipeline Visual dos Agentes de IA */}
      {generating && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Pipeline Cognitivo em Execução</span>
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

      {/* Questões Geradas com Sucesso */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{generatedQuestions.length} Questões Geradas e Validadas!</span>
            </h3>
            <button
              onClick={onGoToQuestions}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Resolver no Banco</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {generatedQuestions.map((q, idx) => (
              <div 
                key={q.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400">Questão Inédita #{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                    Validada por IA
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {q.enunciado}
                </p>
                <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <strong className="text-slate-300">Gabarito: Alternativa {q.resposta_correta}</strong> — {q.explicacao}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
