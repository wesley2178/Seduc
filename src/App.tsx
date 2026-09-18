/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { EditalView } from './components/EditalView';
import { QuestionsView } from './components/QuestionsView';
import { GeneratorView } from './components/GeneratorView';
import { SimulationView } from './components/SimulationView';
import { ErrorsView } from './components/ErrorsView';
import { GamificationView } from './components/GamificationView';
import { RankingView } from './components/RankingView';
import { AdminView } from './components/AdminView';
import { DashboardSummary } from './types';
import { studyService } from './services/studyService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Filtros contextuais passados entre abas
  const [activeDisciplinaId, setActiveDisciplinaId] = useState<string | undefined>(undefined);
  const [activeConteudoId, setActiveConteudoId] = useState<string | undefined>(undefined);
  const [simulationType, setSimulationType] = useState<string | undefined>(undefined);

  const fetchSummary = async () => {
    try {
      const data = await studyService.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error('Erro ao buscar resumo:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleNavigate = (tab: string, extra?: any) => {
    if (extra?.disciplina_id) setActiveDisciplinaId(extra.disciplina_id);
    if (extra?.conteudo_id) setActiveConteudoId(extra.conteudo_id);
    if (extra?.simulationType) setSimulationType(extra.simulationType);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTopicPractice = (disciplinaId: string, conteudoId: string) => {
    setActiveDisciplinaId(disciplinaId);
    setActiveConteudoId(conteudoId);
    setCurrentTab('questoes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartSimulation = (tipo: string) => {
    setSimulationType(tipo);
    setCurrentTab('simulados');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetDatabase = async () => {
    if (window.confirm('Tem certeza que deseja restaurar o banco para as configurações originais da SEDUC?')) {
      await fetch('/api/admin/reset-banco', { method: 'POST' });
      fetchSummary();
      alert('Banco de dados restaurado com sucesso.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation & Status Bar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        summary={summary} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {loadingSummary && !summary ? (
          <div className="py-24 text-center text-slate-400 space-y-4">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium">Inicializando motor de estudos da SEDUC...</p>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && summary && (
              <DashboardView 
                summary={summary} 
                onNavigate={handleNavigate}
                onStartSimulation={handleStartSimulation}
              />
            )}

            {currentTab === 'edital' && (
              <EditalView 
                onStartTopicPractice={handleStartTopicPractice} 
              />
            )}

            {currentTab === 'questoes' && (
              <QuestionsView 
                initialDisciplinaId={activeDisciplinaId}
                initialConteudoId={activeConteudoId}
                onRefreshSummary={fetchSummary}
              />
            )}

            {currentTab === 'gerador' && (
              <GeneratorView 
                onGoToQuestions={() => setCurrentTab('questoes')} 
              />
            )}

            {currentTab === 'simulados' && (
              <SimulationView 
                initialType={simulationType}
                onRefreshSummary={fetchSummary}
              />
            )}

            {currentTab === 'erros' && (
              <ErrorsView 
                onStartSimulation={handleStartSimulation}
                onGoToQuestions={() => setCurrentTab('questoes')}
              />
            )}

            {currentTab === 'gamificacao' && (
              <GamificationView 
                onRefreshSummary={fetchSummary} 
              />
            )}

            {currentTab === 'ranking' && (
              <RankingView />
            )}

            {currentTab === 'admin' && (
              <AdminView 
                onResetDatabase={handleResetDatabase} 
              />
            )}
          </>
        )}
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>SEDUC Concursos • Plataforma Inteligente de Estudos Conectada com a Legislação Oficial</p>
        <p className="text-[11px] text-slate-600 mt-1">LDB 9.394/96 • ECA 8.069/90 • BNCC • Constituição Federal de 1988</p>
      </footer>
    </div>
  );
}
