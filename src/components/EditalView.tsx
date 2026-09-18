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
  ChevronDown
} from 'lucide-react';
import { Edital, Disciplina, Conteudo, NivelDominio } from '../types';

interface EditalViewProps {
  onStartTopicPractice: (disciplinaId: string, conteudoId: string) => void;
}

export const EditalView: React.FC<EditalViewProps> = ({ onStartTopicPractice }) => {
  const [data, setData] = useState<{ edital: Edital; disciplinas: (Disciplina & { conteudos: (Conteudo & { nivel_dominio: NivelDominio; percentual_acerto: number; questoes_respondidas: number })[] })[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDisc, setExpandedDisc] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/edital')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        // Expand all disciplines by default
        const initialExpanded: Record<string, boolean> = {};
        resData.disciplinas?.forEach((d: any) => {
          initialExpanded[d.id] = true;
        });
        setExpandedDisc(initialExpanded);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar edital:', err);
        setLoading(false);
      });
  }, []);

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

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm">Carregando edital verticalizado e mapeamento do concurso...</p>
      </div>
    );
  }

  const { edital, disciplinas } = data;

  // Filtragem por busca
  const filteredDisciplinas = disciplinas.map(disc => {
    const matchingConteudos = disc.conteudos.filter(c => 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disc.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...disc, conteudos: matchingConteudos };
  }).filter(disc => disc.conteudos.length > 0 || disc.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  // Contagem geral
  const allConteudos = disciplinas.flatMap(d => d.conteudos);
  const totalConteudos = allConteudos.length;
  const dominados = allConteudos.filter(c => c.nivel_dominio === 'DOMINADO').length;
  const emEstudo = allConteudos.filter(c => c.nivel_dominio === 'EM_ESTUDO').length;
  const emRevisao = allConteudos.filter(c => c.nivel_dominio === 'EM_REVISAO').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header do Edital Oficial */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                Edital Ativo: {edital.versao}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                Banca: {edital.banca}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{edital.nome}</h1>
            <p className="text-sm text-slate-400 mt-1">{edital.cargo} • {edital.orgao}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Prova: <strong>{new Date(edital.data_prova).toLocaleDateString('pt-BR')}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Disciplinas: <strong>{disciplinas.length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Conteúdos: <strong>{totalConteudos}</strong></span>
            </div>
          </div>
        </div>

        {/* Barra de Progresso do Edital */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Progresso Global do Edital</span>
            <span className="font-bold text-indigo-400">
              {Math.round((dominados / totalConteudos) * 100)}% Dominado
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${(dominados / totalConteudos) * 100}%` }} title="Dominados" />
            <div className="bg-blue-500 h-full" style={{ width: `${(emEstudo / totalConteudos) * 100}%` }} title="Em Estudo" />
            <div className="bg-rose-500 h-full" style={{ width: `${(emRevisao / totalConteudos) * 100}%` }} title="Em Revisão" />
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {dominados} Dominados</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> {emEstudo} Em Estudo</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> {emRevisao} Em Revisão</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600" /> {totalConteudos - (dominados + emEstudo + emRevisao)} Não Estudados</span>
          </div>
        </div>
      </div>

      {/* Busca e Filtro */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar disciplina, lei, artigo, autor (ex: LDB, ECA, Piaget, Vunesp)..."
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
              {/* Disciplina Accordion Header */}
              <div 
                onClick={() => toggleDisc(disc.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-850 bg-slate-900 select-none border-b border-slate-800/80"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {disc.nome}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Peso: <strong>{disc.peso}</strong> • {disc.quantidade_questoes} questões previstas na prova oficial
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-400 hidden sm:block">
                    {disc.conteudos.length} {disc.conteudos.length === 1 ? 'assunto' : 'assuntos'}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Conteúdos */}
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
                          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Praticar Assunto</span>
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
  );
};
