import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db/store';
import { awardXP, updateStreak, getRankings, calculateLevel } from './server/services/xpService';
import { agentOrchestrator } from './server/services/agentOrchestrator';
import { simulationService } from './server/services/simulationService';
import { ragService } from './server/services/ragService';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware de identificação do usuário padrão
  const DEFAULT_USER_ID = 'user_wesley';

  // ==========================================
  // API ROUTES
  // ==========================================

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'SEDUC Concursos Personal Study Engine' });
  });

  // 1. DASHBOARD COMPLETO (Item 37)
  app.get('/api/dashboard', (req, res) => {
    try {
      const user = db.getUsers().find(u => u.id === DEFAULT_USER_ID) || db.getUsers()[0];
      const gamification = db.getGamificationProfiles().find(p => p.user_id === user.id) || {
        id: 'gp_default',
        user_id: user.id,
        xp_total: 0,
        level: 1,
        level_name: 'Nível 1 — Iniciante',
        current_streak: 1,
        longest_streak: 1,
        last_activity_at: new Date().toISOString(),
      };

      const activeEdital = db.getEditais().find(e => e.status === 'ativo') || db.getEditais()[0];
      const tentativas = db.getTentativas().filter(t => t.user_id === user.id);
      const questoesAcertadas = tentativas.filter(t => t.correta).length;
      const taxaAcerto = tentativas.length > 0 ? Math.round((questoesAcertadas / tentativas.length) * 100) : 0;

      // Progresso do Edital (% de conteúdos dominados)
      const conteudos = db.getConteudos();
      const progressos = db.getProgressoConteudo().filter(p => p.user_id === user.id);
      const conteudosDominados = progressos.filter(p => p.nivel_dominio === 'DOMINADO').length;
      const progressoEditalPercent = conteudos.length > 0 
        ? Math.round((conteudosDominados / conteudos.length) * 100) 
        : 0;

      // Desempenho por disciplina (Pontos fortes e fracos)
      const disciplinas = db.getDisciplinas();
      const allQuestoes = db.getQuestoes();
      
      const discStats = disciplinas.map(disc => {
        const discQuestoesIds = new Set(allQuestoes.filter(q => q.disciplina_id === disc.id).map(q => q.id));
        const discTentativas = tentativas.filter(t => discQuestoesIds.has(t.questao_id));
        const discAcertos = discTentativas.filter(t => t.correta).length;
        const taxa = discTentativas.length > 0 ? Math.round((discAcertos / discTentativas.length) * 100) : 0;

        return {
          disciplina: disc.nome,
          taxa,
          questoes: discTentativas.length
        };
      }).filter(s => s.questoes > 0);

      const pontosFortes = [...discStats].sort((a, b) => b.taxa - a.taxa).slice(0, 2);
      const pontosFracos = [...discStats].sort((a, b) => a.taxa - b.taxa).slice(0, 2);

      // Recomendação da IA ("O que estudar agora?")
      const recomendacao = agentOrchestrator.getSmartRecommendation(user.id);

      // Itens equipados
      const gameItems = db.getGameItems();
      const equippedPet = gameItems.find(i => i.id === gamification.pet_id);
      const equippedAvatar = gameItems.find(i => i.id === gamification.avatar_id);

      // Conquistas recentes
      const userAchs = db.getUserAchievements().filter(ua => ua.user_id === user.id);
      const achs = db.getAchievements();
      const recentAchievements = userAchs.slice(0, 3).map(ua => achs.find(a => a.id === ua.achievement_id)).filter(Boolean);

      // Meta diária (ex: 10 questões por dia)
      const hoje = new Date().toISOString().split('T')[0];
      const tentativasHoje = tentativas.filter(t => t.created_at.startsWith(hoje)).length;

      res.json({
        user,
        gamification: {
          ...gamification,
          levelInfo: calculateLevel(gamification.xp_total)
        },
        active_edital: activeEdital,
        progresso_edital_percent: progressoEditalPercent,
        questoes_respondidas: tentativas.length,
        questoes_acertadas: questoesAcertadas,
        taxa_acerto_percent: taxaAcerto,
        meta_diaria_atual: tentativasHoje,
        meta_diaria_meta: 10,
        pontos_fortes: pontosFortes,
        pontos_fracos: pontosFracos,
        recomendacao_ia: recomendacao,
        proximos_conteudos: conteudos.slice(0, 4).map(c => {
          const prog = progressos.find(p => p.conteudo_id === c.id);
          const disc = disciplinas.find(d => d.id === c.disciplina_id);
          return {
            id: c.id,
            nome: c.nome,
            disciplina: disc?.nome || 'Geral',
            nivel_dominio: prog?.nivel_dominio || 'NAO_ESTUDADO'
          };
        }),
        recent_achievements: recentAchievements,
        equipped_pet: equippedPet,
        equipped_avatar: equippedAvatar
      });
    } catch (err: any) {
      console.error('[Dashboard Error]', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 2. EDITAL E CONTEÚDOS (Itens 6 e 38)
  app.get('/api/edital', (req, res) => {
    const edital = db.getEditais().find(e => e.status === 'ativo') || db.getEditais()[0];
    const disciplinas = db.getDisciplinas().filter(d => d.edital_id === edital.id);
    const conteudos = db.getConteudos();
    const progressos = db.getProgressoConteudo().filter(p => p.user_id === DEFAULT_USER_ID);

    const disciplinasComConteudos = disciplinas.map(disc => {
      const discConteudos = conteudos.filter(c => c.disciplina_id === disc.id).map(c => {
        const prog = progressos.find(p => p.conteudo_id === c.id);
        return {
          ...c,
          nivel_dominio: prog?.nivel_dominio || 'NAO_ESTUDADO',
          questoes_respondidas: prog?.questoes_respondidas || 0,
          percentual_acerto: prog?.percentual || 0
        };
      });

      return {
        ...disc,
        conteudos: discConteudos
      };
    });

    res.json({
      edital,
      disciplinas: disciplinasComConteudos
    });
  });

  // 3. QUESTÕES E FILTROS (Itens 28, 29)
  app.get('/api/questoes', (req, res) => {
    const { disciplina_id, conteudo_id, origem, dificuldade, banca, search } = req.query;
    let questoes = db.getQuestoes().filter(q => q.status === 'publicada');

    if (disciplina_id) {
      questoes = questoes.filter(q => q.disciplina_id === disciplina_id);
    }
    if (conteudo_id) {
      questoes = questoes.filter(q => q.conteudo_id === conteudo_id);
    }
    if (origem) {
      questoes = questoes.filter(q => q.origem === origem);
    }
    if (dificuldade) {
      questoes = questoes.filter(q => q.dificuldade === dificuldade);
    }
    if (banca) {
      questoes = questoes.filter(q => q.banca?.toLowerCase() === String(banca).toLowerCase());
    }
    if (search) {
      const term = String(search).toLowerCase();
      questoes = questoes.filter(q => 
        q.enunciado.toLowerCase().includes(term) ||
        q.assunto.toLowerCase().includes(term) ||
        q.tags.some(t => t.toLowerCase().includes(term))
      );
    }

    res.json({
      total: questoes.length,
      questoes
    });
  });

  // 4. RESPOSTA DE QUESTÃO (Item 53 - Fluxo de Resposta do Aluno)
  app.post('/api/questoes/:id/responder', (req, res) => {
    try {
      const { id } = req.params;
      const { resposta, tempo_segundos } = req.body;
      const questao = db.getQuestoes().find(q => q.id === id);

      if (!questao) {
        return res.status(404).json({ error: 'Questão não encontrada' });
      }

      const correta = questao.resposta_correta === resposta;

      // 1. Registrar tentativa
      const tentativa = db.addTentativa({
        id: `tent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: DEFAULT_USER_ID,
        questao_id: id,
        resposta,
        correta,
        tempo_segundos: tempo_segundos || 40,
        created_at: new Date().toISOString()
      });

      // 2. Atualizar Progresso do Conteúdo
      let progresso = null;
      if (questao.conteudo_id) {
        progresso = db.updateProgressoConteudo(DEFAULT_USER_ID, questao.conteudo_id, correta);
      }

      // 3. Central de XP (Item 55 - awardXP)
      const baseXP = 15;
      const bonusAcerto = correta ? 35 : 0;
      const totalXP = baseXP + bonusAcerto;
      const reason = correta 
        ? `Acerto na questão ${questao.banca} (${questao.assunto})`
        : `Estudo e resolução da questão (${questao.assunto})`;

      const xpResult = awardXP(DEFAULT_USER_ID, totalXP, reason, 'QUESTAO', id);

      // 4. Checar Sequência diária (Streak)
      const streakResult = updateStreak(DEFAULT_USER_ID);

      res.json({
        correta,
        resposta_usuario: resposta,
        resposta_correta: questao.resposta_correta,
        explicacao: questao.explicacao,
        por_que_correta: questao.por_que_correta,
        por_que_outras_erradas: questao.por_que_outras_erradas,
        xp_ganho: totalXP,
        level_up: xpResult.levelUp,
        new_level: xpResult.profile.level,
        new_level_title: xpResult.profile.level_name,
        new_achievements: xpResult.newAchievements,
        current_streak: streakResult.current_streak,
        progresso_conteudo: progresso
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. EXPLICAÇÃO INTELIGENTE (Item 35)
  app.post('/api/questoes/:id/explicacao-inteligente', async (req, res) => {
    try {
      const { id } = req.params;
      const { tipo } = req.body; // 'SIMPLES' | 'EXEMPLO' | 'COMO_ESTUDAR'
      const explanation = await agentOrchestrator.getIntelligentExplanation(id, tipo || 'SIMPLES');
      res.json({ texto: explanation });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 6. GERADOR DE QUESTÕES SOB DEMANDA (Item 30 & Multi-Agent)
  app.post('/api/questoes/gerar-demanda', async (req, res) => {
    try {
      const { disciplina_id, conteudo_id, quantidade, dificuldade, tipo_origem, banca } = req.body;
      const qty = Math.min(10, Math.max(1, Number(quantidade) || 3));

      const novasQuestoes = await agentOrchestrator.generateQuestionsOnDemand({
        disciplina_id,
        conteudo_id,
        quantidade: qty,
        dificuldade,
        tipo_origem,
        banca
      });

      res.json({
        sucesso: true,
        quantidade_gerada: novasQuestoes.length,
        questoes: novasQuestoes
      });
    } catch (err: any) {
      console.error('[Gerar Demanda Erro]', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 7. SIMULADOS (Itens 32, 33, 34)
  app.post('/api/simulados/criar', (req, res) => {
    try {
      const { tipo, disciplina_id, conteudo_id, quantidade } = req.body;
      const activeEdital = db.getEditais().find(e => e.status === 'ativo') || db.getEditais()[0];

      const result = simulationService.createSimulado({
        userId: DEFAULT_USER_ID,
        editalId: activeEdital.id,
        tipo: tipo || 'COMPLETO',
        disciplinaId: disciplina_id,
        conteudoId: conteudo_id,
        quantidadeQuestoes: quantidade
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/simulados/:id', (req, res) => {
    const { id } = req.params;
    const simulado = db.getSimulados().find(s => s.id === id);
    if (!simulado) return res.status(404).json({ error: 'Simulado não encontrado' });

    const allQuestoes = db.getQuestoes();
    const questoes = simulado.questoes_ids.map(qid => allQuestoes.find(q => q.id === qid)).filter(Boolean);

    res.json({
      simulado,
      questoes
    });
  });

  app.post('/api/simulados/:id/submeter', (req, res) => {
    try {
      const { id } = req.params;
      const { respostas, tempo_gasto_segundos } = req.body;

      const result = simulationService.submitSimulado({
        simuladoId: id,
        userId: DEFAULT_USER_ID,
        respostas,
        tempoGastoSegundos: tempo_gasto_segundos || 600
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/simulados', (req, res) => {
    const list = db.getSimulados().filter(s => s.user_id === DEFAULT_USER_ID);
    res.json(list);
  });

  // 8. REVISÃO DE ERROS - "MEUS ERROS" (Item 36)
  app.get('/api/erros', (req, res) => {
    const tentativas = db.getTentativas().filter(t => t.user_id === DEFAULT_USER_ID && !t.correta);
    const allQuestoes = db.getQuestoes();
    const disciplinas = db.getDisciplinas();

    // Agrupar por questão com contagem de erros
    const erroMap: Record<string, { questao: any; totalErros: number; ultimaTentativa: string }> = {};

    tentativas.forEach(t => {
      const q = allQuestoes.find(item => item.id === t.questao_id);
      if (q) {
        if (!erroMap[q.id]) {
          const disc = disciplinas.find(d => d.id === q.disciplina_id);
          erroMap[q.id] = {
            questao: { ...q, disciplina_nome: disc?.nome },
            totalErros: 0,
            ultimaTentativa: t.created_at
          };
        }
        erroMap[q.id].totalErros += 1;
      }
    });

    const listaErros = Object.values(erroMap).sort((a, b) => b.totalErros - a.totalErros);

    res.json({
      total_erros: tentativas.length,
      questoes_com_erros: listaErros
    });
  });

  // 9. GAMIFICAÇÃO & LOJA COSMÉTICA (Itens 19, 20, 24, 25, 26)
  app.get('/api/gamificacao', (req, res) => {
    const profile = db.getGamificationProfiles().find(p => p.user_id === DEFAULT_USER_ID);
    const allAchievements = db.getAchievements();
    const userAchievements = db.getUserAchievements().filter(ua => ua.user_id === DEFAULT_USER_ID);
    const allItems = db.getGameItems();
    const userItems = db.getUserItems().filter(ui => ui.user_id === DEFAULT_USER_ID);
    const transactions = db.getXpTransactions().filter(tx => tx.user_id === DEFAULT_USER_ID).slice(0, 15);

    const achievementsWithStatus = allAchievements.map(ach => ({
      ...ach,
      unlocked: userAchievements.some(ua => ua.achievement_id === ach.id)
    }));

    const itemsWithStatus = allItems.map(item => {
      const ownership = userItems.find(ui => ui.item_id === item.id);
      return {
        ...item,
        unlocked: !!ownership,
        equipped: ownership?.equipped || false
      };
    });

    res.json({
      profile: {
        ...profile,
        levelInfo: calculateLevel(profile?.xp_total || 0)
      },
      achievements: achievementsWithStatus,
      items: itemsWithStatus,
      transactions
    });
  });

  app.post('/api/gamificacao/equipar', (req, res) => {
    const { item_id, item_type } = req.body;
    const ok = db.equipItem(DEFAULT_USER_ID, item_id, item_type);
    res.json({ sucesso: ok });
  });

  // 10. RANKING (Item 27)
  app.get('/api/ranking', (req, res) => {
    const rankings = getRankings();
    res.json(rankings);
  });

  // 11. ADMIN PAINEL E LOGS (Itens 43, 44)
  app.get('/api/admin/logs', (req, res) => {
    res.json(db.getAgentLogs());
  });

  app.get('/api/admin/rag-documents', (req, res) => {
    res.json(db.getRagDocuments());
  });

  app.post('/api/admin/rag-documents', (req, res) => {
    try {
      const { source_title, document_type, text, disciplina, assunto, source_url } = req.body;
      const docs = ragService.ingestDocument(source_title, document_type, text, {
        disciplina,
        assunto,
        source_url
      });
      res.json({ sucesso: true, chunks_criados: docs.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/reset-banco', (req, res) => {
    db.resetToSeed();
    res.json({ sucesso: true, mensagem: 'Banco de dados restaurado para os dados oficiais da SEDUC.' });
  });

  // ==========================================
  // VITE / STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SEDUC Engine] Servidor rodando na porta ${PORT}`);
  });
}

startServer();
