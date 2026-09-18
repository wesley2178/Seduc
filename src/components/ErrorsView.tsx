import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  Play, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Questao } from '../types';

interface ErrorsViewProps {
  onStartSimulation: (tipo: string) => void;
  onGoToQuestions: () => void;
}

export const ErrorsView: React.FC<ErrorsViewProps> = ({ onStartSimulation, onGoToQuestions }) => {
  const [data, setData] = useState<{ total_erros: number; questoes_com_erros: { questao: Questao & { disciplina_nome?: string }; totalErros: number; ultimaTentativa: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchErros = () => {
    setLoading(true);
    fetch('/api/erros')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchErros();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm">Carregando seu Caderno de Erros Ativo...</p>
      </div>
    );
  }

  const items = data?.questoes_com_erros || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header do Caderno de Erros */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                Caderno de Erros Ativo
              </span>
              <span className="text-xs text-slate-400">• Técnica de Fixação Neurodidática</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
              <span>Diagnóstico e Superação de Erros</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              O concurseiro não é aprovado pelas questões que já sabe, mas sim pela correção sistemática dos detalhes que costuma errar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-generate-error-sim"
              onClick={() => onStartSimulation('ERROS')}
              disabled={items.length === 0}
              className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center gap-2 shrink-0"
            >
              <Play className="w-4 h-4" />
              <span>Gerar Simulado com Meus Erros ({items.length})</span>
            </button>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300 border-t border-slate-800">
          <div>Total de falhas registradas: <strong className="text-rose-400 font-bold">{data?.total_erros || 0}</strong></div>
          <div>Questões únicas a revisar: <strong className="text-amber-400 font-bold">{items.length}</strong></div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Nenhum erro pendente no momento!</h3>
          <p className="text-sm max-w-md mx-auto">
            Você ainda não errou nenhuma questão ou zerou todos os erros em seus simulados. Continue respondendo questões no banco!
          </p>
          <button
            onClick={onGoToQuestions}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            Ir para o Banco de Questões
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(({ questao, totalErros, ultimaTentativa }) => (
            <div 
              key={questao.id}
              className="bg-slate-900 border border-rose-500/20 hover:border-rose-500/40 rounded-2xl p-6 shadow-sm space-y-4 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 font-bold text-xs border border-rose-500/30">
                    Errou {totalErros} {totalErros === 1 ? 'vez' : 'vezes'}
                  </span>
                  <span className="text-xs font-semibold text-indigo-400">
                    {questao.disciplina_nome || questao.assunto}
                  </span>
                  <span className="text-xs text-slate-500">• Banca {questao.banca}</span>
                </div>

                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Último erro em {new Date(ultimaTentativa).toLocaleDateString('pt-BR')}
                </span>
              </div>

              {/* Enunciado */}
              <p className="text-sm text-slate-200 leading-relaxed font-medium bg-slate-950 p-4 rounded-xl border border-slate-800">
                {questao.enunciado}
              </p>

              {/* Solução & Por que Errou */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">Gabarito Oficial:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Alternativa {questao.resposta_correta}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed pt-1">
                  <strong>Explicação:</strong> {questao.explicacao}
                </p>
                {questao.por_que_correta && (
                  <p className="text-emerald-300/90 leading-relaxed">
                    <strong>Ponto Chave:</strong> {questao.por_que_correta}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
