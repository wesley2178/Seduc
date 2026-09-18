import { db } from '../db/store';
import { Simulado, SimuladoTipo, Questao } from '../../src/types';
import { awardXP } from './xpService';

export class SimulationService {
  /**
   * Cria um novo simulado baseado no tipo escolhido
   */
  public createSimulado(params: {
    userId: string;
    editalId: string;
    tipo: SimuladoTipo;
    disciplinaId?: string;
    conteudoId?: string;
    quantidadeQuestoes?: number;
  }): { simulado: Simulado; questoes: Questao[] } {
    const allQuestoes = db.getQuestoes().filter(q => q.status === 'publicada');
    const tentativas = db.getTentativas().filter(t => t.user_id === params.userId);
    const progressos = db.getProgressoConteudo().filter(p => p.user_id === params.userId);

    let selecionadas: Questao[] = [];
    const count = params.quantidadeQuestoes || (params.tipo === 'COMPLETO' || params.tipo === 'REALISTA' ? 10 : 5);
    let titulo = 'Simulado de Estudos';
    let tempoLimite = count * 3; // 3 minutos por questão em média

    switch (params.tipo) {
      case 'POR_DISCIPLINA': {
        const disc = db.getDisciplinas().find(d => d.id === params.disciplinaId);
        titulo = `Simulado: ${disc?.nome || 'Disciplina'}`;
        selecionadas = allQuestoes.filter(q => q.disciplina_id === params.disciplinaId);
        break;
      }

      case 'POR_ASSUNTO': {
        const cont = db.getConteudos().find(c => c.id === params.conteudoId);
        titulo = `Simulado por Assunto: ${cont?.nome || 'Assunto'}`;
        selecionadas = allQuestoes.filter(q => q.conteudo_id === params.conteudoId || (cont && q.assunto.toLowerCase().includes(cont.nome.toLowerCase().substring(0, 8))));
        break;
      }

      case 'ERROS': {
        titulo = 'Simulado de Revisão dos Meus Erros';
        const erradasIds = new Set(tentativas.filter(t => !t.correta).map(t => t.questao_id));
        selecionadas = allQuestoes.filter(q => erradasIds.has(q.id));
        break;
      }

      case 'REVISAO': {
        titulo = 'Simulado de Fixação e Revisão';
        // Conteúdos marcados como EM_REVISAO ou com acerto intermediário
        const revisaoConteudosIds = new Set(progressos.filter(p => p.nivel_dominio === 'EM_REVISAO').map(p => p.conteudo_id));
        selecionadas = allQuestoes.filter(q => q.conteudo_id && revisaoConteudosIds.has(q.conteudo_id));
        if (selecionadas.length === 0) {
          selecionadas = allQuestoes;
        }
        break;
      }

      case 'ADAPTATIVO': {
        titulo = 'Simulado Adaptativo Inteligente';
        // Agrupa por fraqueza
        const fracosConteudos = progressos.filter(p => p.percentual < 60).map(p => p.conteudo_id);
        const questoesFracas = allQuestoes.filter(q => q.conteudo_id && fracosConteudos.includes(q.conteudo_id));
        const outras = allQuestoes.filter(q => !questoesFracas.includes(q));

        // 60% de conteúdos com dificuldade, 40% de outros
        const qtFracas = Math.min(questoesFracas.length, Math.ceil(count * 0.6));
        const qtOutras = count - qtFracas;

        selecionadas = [
          ...this.shuffle(questoesFracas).slice(0, qtFracas),
          ...this.shuffle(outras).slice(0, qtOutras)
        ];
        break;
      }

      case 'REALISTA': {
        titulo = 'Simulado Realista Padrão CEV-UECE SEDUC-CE 2026';
        tempoLimite = 45; // simulado cronometrado de prova real
        selecionadas = allQuestoes;
        break;
      }

      case 'COMPLETO':
      default: {
        titulo = 'Simulado Completo Geral';
        selecionadas = allQuestoes;
        break;
      }
    }

    // Se selecionadas forem menores que o requisitado, completa com o banco
    if (selecionadas.length < count) {
      const restantes = allQuestoes.filter(q => !selecionadas.some(s => s.id === q.id));
      selecionadas = [...selecionadas, ...this.shuffle(restantes)].slice(0, count);
    } else {
      selecionadas = this.shuffle(selecionadas).slice(0, count);
    }

    // Se ainda for vazio, pega qualquer disponível
    if (selecionadas.length === 0) {
      selecionadas = allQuestoes.slice(0, Math.min(5, allQuestoes.length));
    }

    const novoSimulado: Simulado = {
      id: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: params.userId,
      edital_id: params.editalId,
      titulo,
      tipo: params.tipo,
      quantidade_questoes: selecionadas.length,
      tempo_limite: tempoLimite,
      status: 'em_andamento',
      questoes_ids: selecionadas.map(q => q.id),
      created_at: new Date().toISOString()
    };

    db.addSimulado(novoSimulado);

    return {
      simulado: novoSimulado,
      questoes: selecionadas
    };
  }

  /**
   * Submissão e correção automática do simulado
   */
  public submitSimulado(params: {
    simuladoId: string;
    userId: string;
    respostas: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>;
    tempoGastoSegundos: number;
  }) {
    const simulado = db.getSimulados().find(s => s.id === params.simuladoId);
    if (!simulado) throw new Error('Simulado não encontrado');

    const allQuestoes = db.getQuestoes();
    const questoes = simulado.questoes_ids.map(id => allQuestoes.find(q => q.id === id)).filter(Boolean) as Questao[];

    let acertos = 0;
    const detalhes = questoes.map(q => {
      const respostaUsuario = params.respostas[q.id];
      const correta = respostaUsuario === q.resposta_correta;
      if (correta) acertos++;

      // Registrar tentativa no banco
      db.addTentativa({
        id: `tent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: params.userId,
        questao_id: q.id,
        resposta: respostaUsuario || 'A',
        correta,
        tempo_segundos: Math.round(params.tempoGastoSegundos / questoes.length),
        created_at: new Date().toISOString()
      });

      // Atualizar progresso do conteúdo
      if (q.conteudo_id) {
        db.updateProgressoConteudo(params.userId, q.conteudo_id, correta);
      }

      return {
        questao: q,
        respostaUsuario,
        correta
      };
    });

    const nota = Math.round((acertos / questoes.length) * 100);

    const updated = db.updateSimulado(params.simuladoId, {
      status: 'finalizado',
      respostas: params.respostas,
      nota,
      tempo_gasto_segundos: params.tempoGastoSegundos,
      finalizado_at: new Date().toISOString()
    });

    // Conceder XP pelo Simulado
    const baseXP = 100;
    const acertoBonus = acertos * 20;
    const totalXP = baseXP + acertoBonus;

    const xpResult = awardXP(
      params.userId,
      totalXP,
      `Conclusão de Simulado (${acertos}/${questoes.length} acertos - ${nota}%)`,
      'SIMULADO',
      params.simuladoId
    );

    return {
      simulado: updated,
      acertos,
      totalQuestoes: questoes.length,
      nota,
      detalhes,
      xpGanho: totalXP,
      levelUp: xpResult.levelUp,
      newAchievements: xpResult.newAchievements
    };
  }

  private shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

export const simulationService = new SimulationService();
