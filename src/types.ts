// Tipos e Interfaces da Plataforma Inteligente de Estudos SEDUC

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type EditalStatus = 'ativo' | 'inativo' | 'analisando' | 'arquivado';

export interface Edital {
  id: string;
  nome: string;
  orgao: string; // Ex: SEDUC-CE
  cargo: string; // Ex: Professor da Educação Básica
  banca: string; // Ex: CEV-UECE, IDECAN, CEBRASPE, FGV
  data_publicacao: string;
  data_prova: string;
  arquivo_url?: string;
  texto_extraido?: string;
  texto_integral?: string;
  resumo_executivo?: string;
  status: EditalStatus;
  versao: string;
  created_at: string;
  updated_at: string;
}

export interface Disciplina {
  id: string;
  edital_id: string;
  nome: string;
  peso: number;
  quantidade_questoes: number;
  ordem: number;
}

export type NivelDominio = 'NAO_ESTUDADO' | 'EM_ESTUDO' | 'EM_REVISAO' | 'DOMINADO';

export interface Conteudo {
  id: string;
  disciplina_id: string;
  parent_id?: string | null;
  nome: string;
  descricao: string;
  nivel: number;
  ordem: number;
}

export interface Prova {
  id: string;
  edital_id: string;
  titulo: string;
  banca: string;
  ano: number;
  cargo: string;
  arquivo_url?: string;
  gabarito_url?: string;
  texto_extraido?: string;
  status: 'processada' | 'processando' | 'erro';
  created_at: string;
}

export type QuestaoOrigem = 
  | 'REAL_PROVA' 
  | 'IA_INEDITA_EDITAL' 
  | 'IA_INEDITA_PADRAO_BANCA' 
  | 'IA_ADAPTADA';

export type QuestaoDificuldade = 'FACIL' | 'MEDIA' | 'DIFICIL';

export interface QuestaoAlternativa {
  letra: 'A' | 'B' | 'C' | 'D' | 'E';
  texto: string;
  justificativa?: string;
}

export interface Questao {
  id: string;
  edital_id: string;
  prova_id?: string | null;
  disciplina_id: string;
  conteudo_id?: string | null;
  origem: QuestaoOrigem;
  fonte: string; // Ex: Prova CEV-UECE SEDUC-CE - Caderno 01
  banca: string; // Ex: CEV-UECE
  ano: number;
  enunciado: string;
  alternativas: QuestaoAlternativa[];
  resposta_correta: 'A' | 'B' | 'C' | 'D' | 'E';
  explicacao: string;
  por_que_correta?: string;
  por_que_outras_erradas?: string;
  dificuldade: QuestaoDificuldade;
  assunto: string;
  subassunto?: string;
  tags: string[];
  status: 'publicada' | 'revisando' | 'rejeitada';
  validada: boolean;
  created_at: string;
  updated_at: string;
  // Fontes anexadas
  fontes?: QuestaoFonte[];
  validacao?: QuestaoValidacao;
}

export interface QuestaoFonte {
  id: string;
  questao_id: string;
  tipo: 'LEI' | 'EDITAL' | 'PROVA_ANTERIOR' | 'BNCC' | 'DOUTRINA';
  titulo: string;
  url?: string;
  referencia: string; // Ex: Art. 21 da LDB 9.394/96
  trecho: string;
  created_at: string;
}

export interface QuestaoValidacao {
  id: string;
  questao_id: string;
  agente: string;
  resultado: 'VALIDADA' | 'REJEITADA';
  confianca: number; // 0 a 100
  problemas?: string[];
  observacoes: string;
  created_at: string;
}

export interface Tentativa {
  id: string;
  user_id: string;
  questao_id: string;
  resposta: 'A' | 'B' | 'C' | 'D' | 'E';
  correta: boolean;
  tempo_segundos: number;
  created_at: string;
}

export type SimuladoTipo = 
  | 'COMPLETO' 
  | 'POR_DISCIPLINA' 
  | 'POR_ASSUNTO' 
  | 'REVISAO' 
  | 'ERROS' 
  | 'ADAPTATIVO' 
  | 'REALISTA';

export interface Simulado {
  id: string;
  user_id: string;
  edital_id: string;
  titulo: string;
  tipo: SimuladoTipo;
  quantidade_questoes: number;
  tempo_limite: number; // em minutos
  nota?: number; // 0 a 100
  acertos?: number;
  erros?: number;
  taxa_acerto?: number;
  status: 'em_andamento' | 'finalizado' | 'cancelado';
  questoes_ids: string[];
  respostas?: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'>;
  tempo_gasto_segundos?: number;
  created_at: string;
  finalizado_at?: string;
}

export interface ProgressoConteudo {
  id: string;
  user_id: string;
  conteudo_id: string;
  questoes_respondidas: number;
  acertos: number;
  erros: number;
  percentual: number;
  nivel_dominio: NivelDominio;
  ultima_atividade: string;
}

export interface Recomendacao {
  id: string;
  user_id: string;
  conteudo_id?: string;
  conteudo_nome?: string;
  disciplina_nome?: string;
  tipo: 'REVISAO_ERROS' | 'NOVO_CONTEUDO' | 'FORTALECER_FRACO' | 'SIMULADO_AGENDADO';
  mensagem: string;
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';
  sugestao_acao?: string;
  status: 'pendente' | 'concluida' | 'ignorada';
  created_at: string;
}

// Gamificação
export interface GamificationProfile {
  id: string;
  user_id: string;
  xp_total: number;
  level: number;
  level_name: string;
  current_streak: number;
  longest_streak: number;
  last_activity_at: string;
  avatar_id?: string;
  pet_id?: string;
  levelInfo?: any;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  reference_type: 'QUESTAO' | 'SIMULADO' | 'STREAK' | 'CONQUISTA' | 'REVISAO';
  reference_id?: string;
  created_at: string;
}

export type XpTransaction = XPTransaction;

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  condition_type: 'QUESTIONS_ANSWERED' | 'QUESTIONS_CORRECT' | 'SIMULATIONS_DONE' | 'STREAK_DAYS' | 'ACCURACY_RATE' | 'SUBJECT_MASTERY';
  condition_value: number;
  category: 'GERAL' | 'PRECISAO' | 'CONSTANCIA' | 'MESTRE';
  rarity?: string;
  active: boolean;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export type GameItemType = 'AVATAR' | 'PET' | 'MOLDURA' | 'TITULO' | 'EMBLEMA';

export interface GameItem {
  id: string;
  name: string;
  type: GameItemType;
  description: string;
  image_url: string;
  unlock_level: number;
  unlock_xp: number;
  rarity?: string;
  required_level?: number;
  active: boolean;
}

export interface UserItem {
  id: string;
  user_id: string;
  item_id: string;
  unlocked_at: string;
  equipped: boolean;
}

export interface RankingUser {
  rank: number;
  user_id: string;
  name: string;
  avatar_url?: string;
  pet_url?: string;
  level: number;
  level_name: string;
  xp_total: number;
  streak: number;
  taxa_acerto: number;
}

export type RankingEntry = RankingUser & { user_name?: string };

export interface AgentLog {
  id: string;
  agent_name: 
    | 'ORQUESTRADOR'
    | 'ANALISTA_EDITAL'
    | 'ANALISTA_PROVAS'
    | 'PESQUISADOR'
    | 'GERADOR_QUESTOES'
    | 'REVISOR'
    | 'VALIDADOR'
    | 'DETECTOR_DUPLICIDADE'
    | 'ANALISTA_DESEMPENHO'
    | 'RECOMENDADOR';
  request: string;
  context?: string;
  sources?: string[];
  result?: string;
  status: 'SUCESSO' | 'AVISO' | 'ERRO';
  error?: string;
  execution_time_ms: number;
  created_at: string;
}

export interface RagDocument {
  id?: string;
  document_id: string;
  document_type: 'EDITAL' | 'PROVA' | 'LEGISLACAO' | 'BNCC' | 'DIRETRIZ' | string;
  edital_id?: string;
  prova_id?: string;
  disciplina?: string;
  assunto?: string;
  subassunto?: string;
  chunk_index?: number;
  page?: number;
  source_url?: string;
  source_title: string;
  text: string;
  metadata?: any;
  created_at: string;
}

export interface DashboardSummary {
  user: User;
  gamification: GamificationProfile;
  active_edital: Edital;
  progresso_edital_percent: number;
  questoes_respondidas: number;
  questoes_acertadas: number;
  taxa_acerto_percent: number;
  meta_diaria_atual: number;
  meta_diaria_meta: number;
  pontos_fortes: { disciplina: string; taxa: number; questoes: number }[];
  pontos_fracos: { disciplina: string; taxa: number; questoes: number }[];
  recomendacao_ia: Recomendacao | null;
  proximos_conteudos: { id: string; nome: string; disciplina: string; nivel_dominio: NivelDominio }[];
  recent_achievements: Achievement[];
  equipped_pet?: GameItem;
  equipped_avatar?: GameItem;
}
