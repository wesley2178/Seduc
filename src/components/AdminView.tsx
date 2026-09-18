import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  FileText, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Plus, 
  Search 
} from 'lucide-react';
import { AgentLog, RagDocument } from '../types';

interface AdminViewProps {
  onResetDatabase: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onResetDatabase }) => {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [ragDocs, setRagDocs] = useState<RagDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'rag'>('logs');
  const [loading, setLoading] = useState(true);

  // Formulário de Ingestão de Documento RAG
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDocType, setNewDocType] = useState('LEI');
  const [newText, setNewText] = useState('');
  const [newDisciplina, setNewDisciplina] = useState('Legislação Educacional');
  const [newAssunto, setNewAssunto] = useState('');
  const [ingesting, setIngesting] = useState(false);

  const fetchAdminData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/logs').then(r => r.json()),
      fetch('/api/admin/rag-documents').then(r => r.json())
    ])
      .then(([logsData, ragData]) => {
        setLogs(logsData || []);
        setRagDocs(ragData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro nos dados admin:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleIngestDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newText || ingesting) return;

    setIngesting(true);
    try {
      const res = await fetch('/api/admin/rag-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_title: newTitle,
          document_type: newDocType,
          text: newText,
          disciplina: newDisciplina,
          assunto: newAssunto
        })
      });
      const data = await res.json();
      if (data.sucesso) {
        setShowIngestModal(false);
        setNewTitle('');
        setNewText('');
        fetchAdminData();
      }
    } catch (err) {
      console.error('Erro na ingestão:', err);
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header do Painel Admin */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                Auditoria & RAG Educacional
              </span>
              <span className="text-xs text-slate-400">• Painel de Engenharia</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              <span>Observabilidade Multiagente & Base Confiável</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Monitore a execução dos 10 agentes cognitivos de IA (Orquestrador, Pesquisador, Validador, etc.) e audite as fontes normativas da base de conhecimento vetorial (RAG).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetDatabase}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition flex items-center gap-2"
              title="Restaura banco de dados para os valores e sementes iniciais oficiais"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Restaurar Base SEDUC</span>
            </button>
          </div>
        </div>

        {/* Abas */}
        <div className="flex space-x-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'logs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Logs dos Agentes ({logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rag')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'rag' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Base RAG de Legislação ({ragDocs.length} Chunks)</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm">Carregando logs e registros de observabilidade...</p>
        </div>
      ) : activeTab === 'logs' ? (
        /* TAB 1: LOGS DOS AGENTES */
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
              <span>Trilha de Auditoria dos Agentes Cognitivos</span>
              <span>{logs.length} Execuções Registradas</span>
            </div>

            <div className="divide-y divide-slate-800">
              {logs.map((log) => (
                <div key={log.id} className="p-4 sm:p-5 space-y-2 hover:bg-slate-850 transition text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                        {log.agent_name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        log.status === 'SUCESSO' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {log.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {log.execution_time_ms} ms
                      </span>
                      <span>{new Date(log.created_at).toLocaleTimeString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="text-slate-200 font-medium">
                    {log.request}
                  </div>

                  {log.context && (
                    <div className="text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      <strong>Contexto:</strong> {log.context}
                    </div>
                  )}

                  <div className="text-emerald-400 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
                    <strong>Resultado:</strong> {log.result}
                  </div>

                  {log.sources && log.sources.length > 0 && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 flex-wrap pt-1">
                      <span className="font-semibold text-slate-400">Fontes RAG Utilizadas:</span>
                      {log.sources.map((src, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: BASE RAG DE LEGISLAÇÃO */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              <span>Fragmentos Normativos Ingeridos (Embeddings/Chunks)</span>
            </h3>

            <button
              onClick={() => setShowIngestModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Inserir Norma / Lei</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ragDocs.map((doc, idx) => (
              <div 
                key={doc.document_id || `rag_${idx}`}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400 uppercase tracking-wider">
                    {doc.document_type} • {doc.source_title}
                  </span>
                  <span className="text-slate-500 text-[11px]">Fonte #{idx + 1}</span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
                  {doc.text}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{doc.disciplina || 'Legislação'} • {doc.assunto || 'Educação'}</span>
                  <span className="text-emerald-400 font-semibold">Grounded Source</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL PARA INGERIR DOCUMENTO NA BASE RAG */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <span>Ingerir Legislação na Base RAG</span>
              </h3>
              <button 
                onClick={() => setShowIngestModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIngestDocument} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Título do Documento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lei Federal 9.394/96 - LDB Artigo 14"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Tipo</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="LEI">Lei / Estatuto</option>
                    <option value="EDITAL">Edital Oficial</option>
                    <option value="DIRETRIZ">Diretriz Pedagógica / BNCC</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Disciplina / Assunto</label>
                  <input
                    type="text"
                    value={newAssunto}
                    onChange={(e) => setNewAssunto(e.target.value)}
                    placeholder="Ex: Gestão Democrática"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Texto Normativo Integral ou Fragmentos</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Cole aqui o texto legal com artigos, incisos e parágrafos para o motor RAG processar e chunkear..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowIngestModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={ingesting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  {ingesting ? 'Chunking & Ingestão...' : 'Processar & Ingerir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
