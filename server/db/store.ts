import fs from 'fs';
import path from 'path';
import {
  User, Edital, Disciplina, Conteudo, Prova, Questao, QuestaoFonte,
  QuestaoValidacao, Tentativa, Simulado, ProgressoConteudo, Recomendacao,
  GamificationProfile, XPTransaction, Achievement, UserAchievement,
  GameItem, UserItem, AgentLog, RagDocument
} from '../../src/types';
import { getInitialSeedData } from './seed';

export interface DatabaseSchema {
  users: User[];
  editais: Edital[];
  disciplinas: Disciplina[];
  conteudos: Conteudo[];
  provas: Prova[];
  questoes: Questao[];
  questao_fontes: QuestaoFonte[];
  questao_validacoes: QuestaoValidacao[];
  tentativas: Tentativa[];
  simulados: Simulado[];
  progresso_conteudo: ProgressoConteudo[];
  recomendacoes: Recomendacao[];
  gamification_profiles: GamificationProfile[];
  xp_transactions: XPTransaction[];
  achievements: Achievement[];
  user_achievements: UserAchievement[];
  game_items: GameItem[];
  user_items: UserItem[];
  agent_logs: AgentLog[];
  rag_documents: RagDocument[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'seduc_db.json');

class DatabaseStore {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        // Garantir que todas as coleções existam
        const seed = getInitialSeedData();
        return {
          users: parsed.users || seed.users,
          editais: parsed.editais || seed.editais,
          disciplinas: parsed.disciplinas || seed.disciplinas,
          conteudos: parsed.conteudos || seed.conteudos,
          provas: parsed.provas || seed.provas,
          questoes: parsed.questoes || seed.questoes,
          questao_fontes: parsed.questao_fontes || seed.questao_fontes,
          questao_validacoes: parsed.questao_validacoes || seed.questao_validacoes,
          tentativas: parsed.tentativas || seed.tentativas,
          simulados: parsed.simulados || seed.simulados,
          progresso_conteudo: parsed.progresso_conteudo || seed.progresso_conteudo,
          recomendacoes: parsed.recomendacoes || seed.recomendacoes,
          gamification_profiles: parsed.gamification_profiles || seed.gamification_profiles,
          xp_transactions: parsed.xp_transactions || seed.xp_transactions,
          achievements: parsed.achievements || seed.achievements,
          user_achievements: parsed.user_achievements || seed.user_achievements,
          game_items: parsed.game_items || seed.game_items,
          user_items: parsed.user_items || seed.user_items,
          agent_logs: parsed.agent_logs || seed.agent_logs,
          rag_documents: parsed.rag_documents || seed.rag_documents,
        };
      }
    } catch (err) {
      console.error('[DB] Erro ao carregar banco de dados, iniciando do seed:', err);
    }

    const seed = getInitialSeedData();
    this.persistSync(seed);
    return seed;
  }

  private persistSync(data: DatabaseSchema) {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  }

  public save() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      try {
        this.persistSync(this.data);
      } catch (err) {
        console.error('[DB] Falha ao persistir dados:', err);
      }
    }, 150);
  }

  // Getters
  public getUsers(): User[] { return this.data.users; }
  public getEditais(): Edital[] { return this.data.editais; }
  public getDisciplinas(): Disciplina[] { return this.data.disciplinas; }
  public getConteudos(): Conteudo[] { return this.data.conteudos; }
  public getProvas(): Prova[] { return this.data.provas; }
  public getQuestoes(): Questao[] { return this.data.questoes; }
  public getQuestaoFontes(): QuestaoFonte[] { return this.data.questao_fontes; }
  public getQuestaoValidacoes(): QuestaoValidacao[] { return this.data.questao_validacoes; }
  public getTentativas(): Tentativa[] { return this.data.tentativas; }
  public getSimulados(): Simulado[] { return this.data.simulados; }
  public getProgressoConteudo(): ProgressoConteudo[] { return this.data.progresso_conteudo; }
  public getRecomendacoes(): Recomendacao[] { return this.data.recomendacoes; }
  public getGamificationProfiles(): GamificationProfile[] { return this.data.gamification_profiles; }
  public getXpTransactions(): XPTransaction[] { return this.data.xp_transactions; }
  public getAchievements(): Achievement[] { return this.data.achievements; }
  public getUserAchievements(): UserAchievement[] { return this.data.user_achievements; }
  public getGameItems(): GameItem[] { return this.data.game_items; }
  public getUserItems(): UserItem[] { return this.data.user_items; }
  public getAgentLogs(): AgentLog[] { return this.data.agent_logs; }
  public getRagDocuments(): RagDocument[] { return this.data.rag_documents; }

  // Métodos de inserção e atualização
  public addQuestao(questao: Questao) {
    this.data.questoes.unshift(questao);
    this.save();
    return questao;
  }

  public updateQuestao(id: string, updates: Partial<Questao>) {
    const idx = this.data.questoes.findIndex(q => q.id === id);
    if (idx !== -1) {
      this.data.questoes[idx] = { ...this.data.questoes[idx], ...updates, updated_at: new Date().toISOString() };
      this.save();
      return this.data.questoes[idx];
    }
    return null;
  }

  public addTentativa(tentativa: Tentativa) {
    this.data.tentativas.unshift(tentativa);
    this.save();
    return tentativa;
  }

  public addSimulado(simulado: Simulado) {
    this.data.simulados.unshift(simulado);
    this.save();
    return simulado;
  }

  public updateSimulado(id: string, updates: Partial<Simulado>) {
    const idx = this.data.simulados.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.simulados[idx] = { ...this.data.simulados[idx], ...updates };
      this.save();
      return this.data.simulados[idx];
    }
    return null;
  }

  public updateGamificationProfile(userId: string, updates: Partial<GamificationProfile>) {
    let profile = this.data.gamification_profiles.find(p => p.user_id === userId);
    if (profile) {
      Object.assign(profile, updates);
    } else {
      profile = {
        id: `gp_${Date.now()}`,
        user_id: userId,
        xp_total: updates.xp_total || 0,
        level: updates.level || 1,
        level_name: updates.level_name || 'Nível 1 — Iniciante',
        current_streak: updates.current_streak || 1,
        longest_streak: updates.longest_streak || 1,
        last_activity_at: new Date().toISOString(),
        ...updates
      };
      this.data.gamification_profiles.push(profile);
    }
    this.save();
    return profile;
  }

  public addXpTransaction(tx: XPTransaction) {
    this.data.xp_transactions.unshift(tx);
    this.save();
    return tx;
  }

  public unlockAchievement(userId: string, achievementId: string) {
    const exists = this.data.user_achievements.some(
      ua => ua.user_id === userId && ua.achievement_id === achievementId
    );
    if (!exists) {
      const ua: UserAchievement = {
        id: `ua_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        achievement_id: achievementId,
        unlocked_at: new Date().toISOString()
      };
      this.data.user_achievements.push(ua);
      this.save();
      return ua;
    }
    return null;
  }

  public unlockItem(userId: string, itemId: string, equip = false) {
    const existing = this.data.user_items.find(ui => ui.user_id === userId && ui.item_id === itemId);
    if (!existing) {
      const ui: UserItem = {
        id: `ui_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        item_id: itemId,
        unlocked_at: new Date().toISOString(),
        equipped: equip
      };
      this.data.user_items.push(ui);
      this.save();
      return ui;
    }
    return existing;
  }

  public equipItem(userId: string, itemId: string, itemType: string) {
    // Desequipar itens do mesmo tipo
    const itemTarget = this.data.game_items.find(gi => gi.id === itemId);
    if (!itemTarget) return false;

    const itemsOfType = this.data.game_items.filter(gi => gi.type === itemTarget.type).map(gi => gi.id);
    this.data.user_items.forEach(ui => {
      if (ui.user_id === userId && itemsOfType.includes(ui.item_id)) {
        ui.equipped = (ui.item_id === itemId);
      }
    });

    const profile = this.data.gamification_profiles.find(p => p.user_id === userId);
    if (profile) {
      if (itemTarget.type === 'AVATAR') profile.avatar_id = itemId;
      if (itemTarget.type === 'PET') profile.pet_id = itemId;
    }

    this.save();
    return true;
  }

  public updateProgressoConteudo(userId: string, conteudoId: string, acerto: boolean) {
    let prog = this.data.progresso_conteudo.find(p => p.user_id === userId && p.conteudo_id === conteudoId);
    if (!prog) {
      prog = {
        id: `prog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        conteudo_id: conteudoId,
        questoes_respondidas: 0,
        acertos: 0,
        erros: 0,
        percentual: 0,
        nivel_dominio: 'EM_ESTUDO',
        ultima_atividade: new Date().toISOString()
      };
      this.data.progresso_conteudo.push(prog);
    }

    prog.questoes_respondidas += 1;
    if (acerto) {
      prog.acertos += 1;
    } else {
      prog.erros += 1;
    }
    prog.percentual = Math.round((prog.acertos / prog.questoes_respondidas) * 100);
    prog.ultima_atividade = new Date().toISOString();

    // Determinar Nível de Domínio
    if (prog.questoes_respondidas >= 8 && prog.percentual >= 80) {
      prog.nivel_dominio = 'DOMINADO';
    } else if (prog.percentual < 50 && prog.questoes_respondidas >= 3) {
      prog.nivel_dominio = 'EM_REVISAO';
    } else {
      prog.nivel_dominio = 'EM_ESTUDO';
    }

    this.save();
    return prog;
  }

  public addLog(log: Omit<AgentLog, 'id' | 'created_at'>) {
    const entry: AgentLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      ...log
    };
    this.data.agent_logs.unshift(entry);
    if (this.data.agent_logs.length > 300) {
      this.data.agent_logs = this.data.agent_logs.slice(0, 300);
    }
    this.save();
    return entry;
  }

  public addRagDocument(doc: RagDocument) {
    this.data.rag_documents.push(doc);
    this.save();
    return doc;
  }

  public addRecomendacao(rec: Omit<Recomendacao, 'id' | 'created_at'>) {
    const entry: Recomendacao = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
      ...rec
    };
    this.data.recomendacoes.unshift(entry);
    this.save();
    return entry;
  }

  public resetToSeed() {
    this.data = getInitialSeedData();
    this.persistSync(this.data);
    return this.data;
  }
}

export const db = new DatabaseStore();
