import { DatabaseSchema } from './store';
import { EDITAL_OFICIAL_SEDUC, DISCIPLINAS_OFICIAIS, QUESTOES_OFICIAIS_SEDUC } from '../../src/data/editalOficial';

export function getInitialSeedData(): DatabaseSchema {
  const now = new Date().toISOString();
  const editalId = EDITAL_OFICIAL_SEDUC.id;

  const defaultUser = {
    id: 'user_wesley',
    name: 'Prof. Wesley Oliveira',
    email: 'wesley2178@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'student' as const,
    created_at: now,
    updated_at: now,
  };

  // Flattened conteudos from official disciplines
  const allConteudos = DISCIPLINAS_OFICIAIS.flatMap(d =>
    d.conteudos.map(c => ({
      id: c.id,
      disciplina_id: c.disciplina_id,
      parent_id: c.parent_id || null,
      nome: c.nome,
      descricao: c.descricao,
      nivel: c.nivel,
      ordem: c.ordem
    }))
  );

  return {
    users: [
      defaultUser,
      {
        id: 'user_admin',
        name: 'Coordenador Pedagógico SEDUC-CE',
        email: 'admin.seduc@ceara.gov.br',
        role: 'admin' as const,
        created_at: now,
        updated_at: now,
      }
    ],

    editais: [
      EDITAL_OFICIAL_SEDUC as any
    ],

    disciplinas: DISCIPLINAS_OFICIAIS.map(d => ({
      id: d.id,
      edital_id: d.edital_id,
      nome: d.nome,
      peso: d.peso,
      quantidade_questoes: d.quantidade_questoes,
      ordem: d.ordem
    })),

    conteudos: allConteudos,

    provas: [
      {
        id: 'prova_cev_uece_2022',
        edital_id: editalId,
        titulo: 'SEDUC-CE - Professor da Educação Básica - CEV-UECE',
        banca: 'CEV-UECE',
        ano: 2022,
        cargo: 'Professor da Educação Básica',
        status: 'processada',
        created_at: now,
      },
      {
        id: 'prova_cev_uece_2018',
        edital_id: editalId,
        titulo: 'SEDUC-CE - Legislação Educacional e Didática - CEV-UECE',
        banca: 'CEV-UECE',
        ano: 2018,
        cargo: 'Professor da Educação Básica',
        status: 'processada',
        created_at: now,
      }
    ],

    questoes: QUESTOES_OFICIAIS_SEDUC as any,

    questao_fontes: [
      {
        id: 'fonte_edital_oficial',
        questao_id: QUESTOES_OFICIAIS_SEDUC[0].id,
        tipo: 'EDITAL',
        titulo: 'Edital do Concurso Público SEDUC-CE 2026',
        referencia: 'Edital de Abertura SEDUC-CE / CEV-UECE',
        trecho: 'Conteúdo programático oficial estabelecido para o concurso de professores.',
        created_at: now
      }
    ],

    questao_validacoes: [
      {
        id: 'val_01',
        questao_id: QUESTOES_OFICIAIS_SEDUC[0].id,
        agente: 'VALIDADOR',
        resultado: 'VALIDADA',
        confianca: 99,
        observacoes: 'Em estrita conformidade com a legislação cearense e os critérios da banca CEV-UECE.',
        created_at: now
      }
    ],

    tentativas: [
      {
        id: 'tent_01',
        user_id: 'user_wesley',
        questao_id: QUESTOES_OFICIAIS_SEDUC[0].id,
        resposta: 'A',
        correta: true,
        tempo_segundos: 48,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'tent_02',
        user_id: 'user_wesley',
        questao_id: QUESTOES_OFICIAIS_SEDUC[1].id,
        resposta: 'B',
        correta: true,
        tempo_segundos: 62,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      }
    ],

    simulados: [
      {
        id: 'sim_01',
        user_id: 'user_wesley',
        edital_id: editalId,
        titulo: 'Simulado Diagnóstico Inicial - SEDUC-CE 2026 (CEV-UECE)',
        tipo: 'COMPLETO',
        quantidade_questoes: QUESTOES_OFICIAIS_SEDUC.length,
        tempo_limite: 30,
        nota: 85,
        status: 'finalizado',
        questoes_ids: QUESTOES_OFICIAIS_SEDUC.map(q => q.id),
        respostas: {
          [QUESTOES_OFICIAIS_SEDUC[0].id]: 'A',
          [QUESTOES_OFICIAIS_SEDUC[1].id]: 'B',
          [QUESTOES_OFICIAIS_SEDUC[2].id]: 'B',
          [QUESTOES_OFICIAIS_SEDUC[3].id]: 'A',
          [QUESTOES_OFICIAIS_SEDUC[4].id]: 'B'
        },
        tempo_gasto_segundos: 1140,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        finalizado_at: new Date(Date.now() - 85000000).toISOString(),
      }
    ],

    progresso_conteudo: [
      {
        id: 'prog_01',
        user_id: 'user_wesley',
        conteudo_id: 'cont_estatuto_magisterio_ce',
        questoes_respondidas: 5,
        acertos: 4,
        erros: 1,
        percentual: 80,
        nivel_dominio: 'DOMINADO',
        ultima_atividade: now,
      },
      {
        id: 'prog_02',
        user_id: 'user_wesley',
        conteudo_id: 'cont_spaece_ceara',
        questoes_respondidas: 4,
        acertos: 3,
        erros: 1,
        percentual: 75,
        nivel_dominio: 'EM_ESTUDO',
        ultima_atividade: now,
      },
      {
        id: 'prog_03',
        user_id: 'user_wesley',
        conteudo_id: 'cont_port_concordancia_regencia_ce',
        questoes_respondidas: 3,
        acertos: 1,
        erros: 2,
        percentual: 33,
        nivel_dominio: 'EM_REVISAO',
        ultima_atividade: now,
      },
      {
        id: 'prog_04',
        user_id: 'user_wesley',
        conteudo_id: 'cont_freire_pedagogia_ce',
        questoes_respondidas: 4,
        acertos: 4,
        erros: 0,
        percentual: 100,
        nivel_dominio: 'DOMINADO',
        ultima_atividade: now,
      }
    ],

    recomendacoes: [
      {
        id: 'rec_01',
        user_id: 'user_wesley',
        conteudo_id: 'cont_port_concordancia_regencia_ce',
        conteudo_nome: 'Sintaxe: Concordância Verbal/Nominal, Regência e Crase',
        disciplina_nome: 'Língua Portuguesa',
        tipo: 'REVISAO_ERROS',
        mensagem: 'Identificamos necessidade de revisão em Concordância e Regência. Recomendamos resolver questões da banca CEV-UECE para fixar os casos especiais.',
        prioridade: 'ALTA',
        status: 'pendente',
        created_at: now,
      },
      {
        id: 'rec_02',
        user_id: 'user_wesley',
        conteudo_id: 'cont_spaece_ceara',
        conteudo_nome: 'SPAECE — Sistema Permanente de Avaliação da Educação Básica do Ceará',
        disciplina_nome: 'Legislação Educacional e Políticas da Educação do Ceará',
        tipo: 'NOVO_CONTEUDO',
        mensagem: 'Tema de alta incidência nas provas da CEV-UECE. Foque na matriz de referência e na apropriação dos resultados pedagógicos.',
        prioridade: 'ALTA',
        status: 'pendente',
        created_at: now,
      }
    ],

    gamification_profiles: [
      {
        id: 'gp_wesley',
        user_id: 'user_wesley',
        xp_total: 580,
        level: 3,
        level_name: 'Nível 3 — Docente Estratégico CE',
        current_streak: 5,
        longest_streak: 7,
        last_activity_at: now,
        avatar_id: 'item_avatar_coruja',
        pet_id: 'item_pet_athena',
      }
    ],

    xp_transactions: [
      {
        id: 'xp_01',
        user_id: 'user_wesley',
        amount: 50,
        reason: 'Acerto em questão CEV-UECE Legislação do Ceará',
        reference_type: 'QUESTAO',
        reference_id: QUESTOES_OFICIAIS_SEDUC[0].id,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'xp_02',
        user_id: 'user_wesley',
        amount: 50,
        reason: 'Acerto em questão SPAECE Ceará',
        reference_type: 'QUESTAO',
        reference_id: QUESTOES_OFICIAIS_SEDUC[1].id,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'xp_03',
        user_id: 'user_wesley',
        amount: 200,
        reason: 'Conclusão de Simulado Diagnóstico Inicial SEDUC-CE',
        reference_type: 'SIMULADO',
        reference_id: 'sim_01',
        created_at: new Date(Date.now() - 85000000).toISOString(),
      },
      {
        id: 'xp_04',
        user_id: 'user_wesley',
        amount: 100,
        reason: 'Bônus de Sequência Diária: 5 dias consecutivos 🔥',
        reference_type: 'STREAK',
        created_at: now,
      }
    ],

    achievements: [
      {
        id: 'ach_primeira_questao',
        name: 'Primeiro Passo Cearense',
        description: 'Respondeu à sua primeira questão do edital SEDUC-CE.',
        icon: 'Sparkles',
        xp_reward: 50,
        condition_type: 'QUESTIONS_ANSWERED',
        condition_value: 1,
        category: 'GERAL',
        active: true,
      },
      {
        id: 'ach_legislacao_ceara',
        name: 'Especialista em Legislação do Ceará',
        description: 'Acertou 10 questões sobre o Estatuto do Magistério (LC 22/2000) e SPAECE.',
        icon: 'BookOpen',
        xp_reward: 150,
        condition_type: 'SUBJECT_MASTERY',
        condition_value: 1,
        category: 'MESTRE',
        active: true,
      },
      {
        id: 'ach_streak_3',
        name: 'Foco Inabalável',
        description: 'Manteve 3 dias seguidos de resolução no app.',
        icon: 'Flame',
        xp_reward: 100,
        condition_type: 'STREAK_DAYS',
        condition_value: 3,
        category: 'CONSTANCIA',
        active: true,
      },
      {
        id: 'ach_simulado_1',
        name: 'Prova Simulado CEV-UECE',
        description: 'Finalizou seu primeiro simulado completo no formato de prova real.',
        icon: 'Trophy',
        xp_reward: 200,
        condition_type: 'SIMULATIONS_DONE',
        condition_value: 1,
        category: 'GERAL',
        active: true,
      }
    ],

    user_achievements: [
      {
        id: 'ua_01',
        user_id: 'user_wesley',
        achievement_id: 'ach_primeira_questao',
        unlocked_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'ua_02',
        user_id: 'user_wesley',
        achievement_id: 'ach_streak_3',
        unlocked_at: now,
      },
      {
        id: 'ua_03',
        user_id: 'user_wesley',
        achievement_id: 'ach_simulado_1',
        unlocked_at: new Date(Date.now() - 85000000).toISOString(),
      }
    ],

    game_items: [
      {
        id: 'item_avatar_coruja',
        name: 'Coruja Guardiã do Saber',
        type: 'AVATAR',
        description: 'Símbolo clássico da sabedoria e da pedagogia emancipatória.',
        image_url: '🦉',
        unlock_level: 1,
        unlock_xp: 0,
        active: true,
      },
      {
        id: 'item_avatar_professora',
        name: 'Professora Inovadora do Ceará',
        type: 'AVATAR',
        description: 'Dedicada ao ensino em tempo integral e mediação ativa.',
        image_url: '👩‍🏫',
        unlock_level: 2,
        unlock_xp: 200,
        active: true,
      },
      {
        id: 'item_avatar_pesquisador',
        name: 'Pesquisador da Educação',
        type: 'AVATAR',
        description: 'Especialista no edital da SEDUC-CE e teorias pedagógicas.',
        image_url: '🧙‍♂️',
        unlock_level: 4,
        unlock_xp: 750,
        active: true,
      },
      {
        id: 'item_pet_athena',
        name: 'Corujinha Athena',
        type: 'PET',
        description: 'Gera aura de foco durante suas sessões de estudo.',
        image_url: '🦉✨',
        unlock_level: 1,
        unlock_xp: 0,
        active: true,
      },
      {
        id: 'item_pet_lector',
        name: 'Gatinho Lector',
        type: 'PET',
        description: 'Descansa sobre os livros de legislação garantindo retenção de leitura.',
        image_url: '🐱📚',
        unlock_level: 2,
        unlock_xp: 300,
        active: true,
      },
      {
        id: 'item_moldura_ouro',
        name: 'Moldura Ouro SEDUC-CE',
        type: 'MOLDURA',
        description: 'Borda com acabamento dourado oficial para futuros servidores do Ceará.',
        image_url: '🏅',
        unlock_level: 3,
        unlock_xp: 450,
        active: true,
      }
    ],

    user_items: [
      {
        id: 'ui_01',
        user_id: 'user_wesley',
        item_id: 'item_avatar_coruja',
        unlocked_at: now,
        equipped: true,
      },
      {
        id: 'ui_02',
        user_id: 'user_wesley',
        item_id: 'item_pet_athena',
        unlocked_at: now,
        equipped: true,
      },
      {
        id: 'ui_03',
        user_id: 'user_wesley',
        item_id: 'item_moldura_ouro',
        unlocked_at: now,
        equipped: true,
      }
    ],

    agent_logs: [
      {
        id: 'log_01',
        agent_name: 'ORQUESTRADOR',
        request: 'Inicialização do motor cognitivo para Edital SEDUC-CE 2026',
        context: 'Edital CEV-UECE ativo e embutido no código',
        sources: ['Edital SEDUC-CE 2026', 'LC nº 22/2000', 'SPAECE', 'LDB 9.394/96'],
        result: 'Mapeamento de 5 disciplinas e 12 conteúdos prioritários do Ceará concluído',
        status: 'SUCESSO',
        execution_time_ms: 180,
        created_at: now,
      },
      {
        id: 'log_02',
        agent_name: 'VALIDADOR',
        request: 'Validação da questão inédita sobre SPAECE e equidade escolar',
        context: 'Matrizes de Referência do SPAECE',
        sources: ['Diretrizes SEDUC-CE'],
        result: 'VALIDADA - Confiança 99%, gabarito único comprovado',
        status: 'SUCESSO',
        execution_time_ms: 320,
        created_at: now,
      }
    ],

    rag_documents: [
      {
        document_id: 'rag_ceara_lc22',
        document_type: 'LEGISLACAO',
        edital_id: editalId,
        disciplina: 'Legislação Educacional e Políticas da Educação do Ceará',
        assunto: 'Estatuto do Magistério do Ceará (LC nº 22/2000)',
        subassunto: 'Jornada de Trabalho e Atividades Extraclasse',
        source_title: 'Lei Complementar Estadual nº 22/2000 (Ceará)',
        source_url: 'https://www.seduc.ce.gov.br',
        text: 'A jornada de trabalho dos professores da rede pública estadual do Ceará é estruturada com destinação de no mínimo 1/3 (um terço) da carga horária para horas-atividade (planejamento, avaliação e formação continuada), vedada a imposição de regência de classe durante este período.',
        created_at: now,
      },
      {
        document_id: 'rag_ceara_spaece',
        document_type: 'LEGISLACAO',
        edital_id: editalId,
        disciplina: 'Legislação Educacional e Políticas da Educação do Ceará',
        assunto: 'SPAECE',
        subassunto: 'Avaliação em Larga Escala e Equidade',
        source_title: 'Sistema Permanente de Avaliação da Educação Básica do Ceará (SPAECE)',
        source_url: 'https://www.seduc.ce.gov.br/spaece',
        text: 'O SPAECE tem por objetivo fornecer subsídios para a formulação, reformulação e monitoramento das políticas educacionais do Estado do Ceará, diagnosticando o nível de proficiência dos estudantes em Língua Portuguesa e Matemática para orientar intervenções pedagógicas e reduzir desigualdades.',
        created_at: now,
      },
      {
        document_id: 'rag_ldb_art24',
        document_type: 'LEGISLACAO',
        edital_id: editalId,
        disciplina: 'Legislação Educacional e Políticas da Educação do Ceará',
        assunto: 'LDB 9.394/96',
        subassunto: 'Artigo 24 - Regras Comuns',
        source_title: 'Lei nº 9.394/1996 (LDB)',
        source_url: 'http://www.planalto.gov.br/ccivil_03/leis/l9394.htm',
        text: 'Art. 24. A educação básica, nos níveis fundamental e médio, será organizada com carga horária mínima anual de oitocentas horas, distribuídas por um mínimo de duzentos dias de efetivo trabalho escolar, excluído o tempo reservado aos exames finais, quando houver.',
        created_at: now,
      },
      {
        document_id: 'rag_ped_freire',
        document_type: 'DIRETRIZ',
        edital_id: editalId,
        disciplina: 'Conhecimentos Pedagógicos e Didática Geral',
        assunto: 'Paulo Freire',
        subassunto: 'Pedagogia da Autonomia e Prática Libertadora',
        source_title: 'Pedagogia da Autonomia — Paulo Freire',
        text: 'Ensinar não é transferir conhecimento, mas criar as possibilidades para a sua própria produção ou a sua construção. Quem ensina aprende ao ensinar e quem aprende ensina ao aprender. A relação dialógica e o respeito aos saberes prévios dos educandos são imperativos éticos da prática docente.',
        created_at: now,
      }
    ]
  };
}
