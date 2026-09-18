/**
 * EDITAL OFICIAL COMPLETO E ESTRUTURADO - SEDUC-CE 2026 (CEV-UECE)
 * Concurso Público para Professor da Educação Básica da Rede Estadual do Ceará
 * Este documento está embutido diretamente no código da aplicação
 * para permitir leitura por IA, extração de tópicos e geração de questões
 * no padrão da banca examinadora CEV / UECE (FUNECE).
 */

import { Edital, Disciplina, Conteudo, Questao } from '../types';

export const EDITAL_OFICIAL_SEDUC: Edital = {
  id: 'edital_seduc_ce_2026',
  nome: 'Concurso Público SEDUC-CE 2026 — Professor da Educação Básica',
  orgao: 'Secretaria da Educação do Estado do Ceará (SEDUC-CE)',
  cargo: 'Professor da Educação Básica — Ensino Médio e Ensino Fundamental da Rede Estadual',
  banca: 'CEV-UECE (Fundação Universidade Estadual do Ceará)',
  data_publicacao: '2026-01-20',
  data_prova: '2026-10-18',
  status: 'ativo' as const,
  versao: 'Edital de Abertura Nº 01/2026 — SEDUC-CE / CEV-UECE',
  created_at: '2026-01-20T08:00:00.000Z',
  updated_at: '2026-01-20T08:00:00.000Z',
  resumo_executivo: `O Concurso Público da Secretaria da Educação do Estado do Ceará (SEDUC-CE 2026) destina-se ao provimento de vagas para o cargo de Professor da Educação Básica da rede pública estadual cearense. A prova objetiva, sob coordenação técnico-científica da CEV/UECE (Comissão Executiva do Vestibular da UECE), é estruturada em 60 questões de múltipla escolha com 5 alternativas (A, B, C, D, E), totalizando 100 pontos ponderados:
1. Legislação Educacional e Políticas da Educação do Ceará (Peso 2.0 - 20 questões) — com foco na LDB 9.394/96, ECA, Lei Complementar Estadual nº 22/2000 (Estatuto do Magistério do Ceará), SPAECE, DCRC e modelo das EEMTIs/EEEPs do Ceará.
2. Conhecimentos Pedagógicos e Didática Geral (Peso 2.0 - 20 questões) — teorias sociointeracionistas, pedagogia crítica e libertadora (Paulo Freire), avaliação formativa (Luckesi) e gestão democrática.
3. Língua Portuguesa (Peso 1.5 - 15 questões) — compreensão textual, coesão, concordância e regência segundo a norma culta.
4. Raciocínio Lógico e Quantitativo (Peso 1.5 - 10 questões) — problemas lógicos, proporção, porcentagem e análise de dados.
5. Educação Especial, Inclusiva e Diversidade (Peso 1.0 - 10 questões) — AEE, DUA e diretrizes étnico-raciais.`,
  texto_integral: `GOVERNO DO ESTADO DO CEARÁ
SECRETARIA DA EDUCAÇÃO DO ESTADO DO CEARÁ - SEDUC-CE
EDITAL DE CONCURSO PÚBLICO Nº 01/2026 - SEDUC-CE / CEV-UECE
CONCURSO PÚBLICO PARA PROVIMENTO DO CARGO DE PROFESSOR DA EDUCAÇÃO BÁSICA

A Secretária da Educação do Estado do Ceará, no uso de suas atribuições legais e estatutárias, em consonância com a Constituição Federal de 1988, a Constituição do Estado do Ceará, a Lei Federal nº 9.394/1996 (LDB), a Lei Complementar Estadual nº 22/2000 (Estatuto do Magistério Oficial do Ceará) e suas alterações, torna pública a realização do Concurso Público de Provas e Títulos para provimento de vagas no cargo de Professor da Educação Básica da Rede Estadual de Ensino, com execução técnico-operacional da Fundação Universidade Estadual do Ceará – FUNECE, por intermédio da Comissão Executiva do Vestibular – CEV/UECE.

CAPÍTULO I - DAS DISPOSIÇÕES PRELIMINARES E COORDENADORIAS REGIONAIS (CREDE / SEFOR)
1.1. O Concurso Público reger-se-á por este Edital e destina-se a selecionar candidatos para o provimento efetivo de cargos de Professor da Educação Básica nas diversas Coordenadorias Regionais de Desenvolvimento da Educação (CREDEs) e Superintendência das Escolas Estaduais de Fortaleza (SEFOR).
1.2. O Concurso constará das seguintes etapas eliminatórias e classificatórias:
  a) 1ª Etapa: Prova Objetiva (Conhecimentos Básicos, Legislação da Educação do Ceará e Conhecimentos Específicos), de caráter eliminatório e classificatório;
  b) 2ª Etapa: Prova Prática Didática (Aula perante Banca Examinadora com apresentação do Plano de Aula), de caráter eliminatório e classificatório;
  c) 3ª Etapa: Avaliação de Títulos Acadêmicos e Experiência Docente, de caráter eminentemente classificatório.

CAPÍTULO II - DO CARGO, DA CARGA HORÁRIA E DA REMUNERAÇÃO
2.1. Cargo: Professor da Educação Básica.
2.2. Requisito de Ingresso: Diploma devidamente registrado de conclusão de curso superior de Licenciatura Plena na área específica de atuação ou habilitação legal equivalente.
2.3. Carga Horária Semanal: 40 (quarenta) horas semanais, correspondentes à jornada integral, ou 20 (vinte) horas semanais, com a reserva legal obrigatória de 1/3 (um terço) da carga horária para Atividades Extraclasse / Planejamento Pedagógico (HTPC), em estrita observância à Lei Federal nº 11.738/2008 e ao Estatuto do Magistério do Ceará (LC nº 22/2000).

CAPÍTULO III - DA ESTRUTURA E PESOS DA PROVA OBJETIVA CEV/UECE
3.1. A Prova Objetiva será composta por 60 (sessenta) questões de múltipla escolha, cada uma contendo 5 (cinco) alternativas (A, B, C, D e E), com pontuação total ponderada de 100 pontos.
3.2. A distribuição de questões, pesos e módulos dar-se-á na seguinte conformidade:
  - Módulo I: Legislação Educacional e Políticas da Educação do Ceará — 20 questões — Peso 2.0 (40 pontos máximos)
  - Módulo II: Conhecimentos Pedagógicos e Didática — 20 questões — Peso 2.0 (40 pontos máximos)
  - Módulo III: Língua Portuguesa — 15 questões — Peso 1.5 (22.5 pontos máximos)
  - Módulo IV: Raciocínio Lógico e Quantitativo — 10 questões — Peso 1.5 (15 pontos máximos)
  - Módulo V: Educação Especial, Inclusiva e Direitos Humanos — 10 questões — Peso 1.0 (10 pontos máximos)
3.3. Critério de Aprovação: Será considerado habilitado na Prova Objetiva o candidato que obtiver no mínimo 50% dos pontos ponderados da prova e não obtiver nota zero em nenhuma das disciplinas componentes.

CAPÍTULO IV - DO CONTEÚDO PROGRAMÁTICO ESPECÍFICO (SEDUC-CE 2026)

SEÇÃO 1: LEGISLAÇÃO EDUCACIONAL E POLÍTICAS PÚBLICAS DA EDUCAÇÃO DO CEARÁ
1. Legislação Nacional de Educação:
   - Constituição Federal de 1988: Artigos 205 a 214 (Da Educação).
   - Lei Federal nº 9.394/1996 (LDB) e alterações vigentes: princípios e fins da educação; dever do Estado; organização da educação básica; carga horária mínima anual (800h em 200 dias de efetivo trabalho escolar - Art. 24, I); frequência mínima obrigatória (75% - Art. 24, VI); gestão democrática do ensino público (Art. 14); profissionais da educação.
   - Lei Federal nº 8.069/1990 (Estatuto da Criança e do Adolescente - ECA): Artigos 53 a 59 e Artigo 56 (dever dos dirigentes escolares na notificação obrigatória ao Conselho Tutelar).
   - Base Nacional Comum Curricular (BNCC): Competências Gerais da Educação Básica e progressão de aprendizagens.
2. Legislação e Políticas Educacionais do Estado do Ceará:
   - Constituição do Estado do Ceará de 1989: Seção correspondente à Educação, Cultura e Desporto.
   - Lei Complementar Estadual nº 22/2000 (Estatuto do Magistério Oficial do Ceará) e legislação correlata: direitos, deveres, regime disciplinar, jornada e progressão na carreira docente.
   - Plano Estadual de Educação do Ceará (PEE-CE).
   - Documento Curricular Referencial do Ceará (DCRC) para o Ensino Fundamental e Ensino Médio.
   - Sistema Permanente de Avaliação da Educação Básica do Ceará (SPAECE): matrizes de referência, níveis de proficiência e utilização dos resultados pedagógicos para equidade escolar.
   - O modelo cearense de Ensino Médio em Tempo Integral: Escolas de Ensino Médio em Tempo Integral (EEMTI) e Escolas Estaduais de Educação Profissional (EEEP).
   - O Programa de Aprendizagem na Idade Certa (MAIS PAIC) e a cooperação federativa Estado-Municípios.

SEÇÃO 2: CONHECIMENTOS PEDAGÓGICOS E DIDÁTICA GERAL
1. Teorias do Desenvolvimento e da Aprendizagem:
   - Lev Vygotsky: Mediação semiótica, instrumentos culturais e Zona de Desenvolvimento Proximal (ZDP).
   - Jean Piaget: Epistemologia genética, esquemas, assimilação, acomodação e equilibração majorante.
   - Henri Wallon: A integração entre afetividade, motricidade e inteligência.
2. Pedagogia Crítica e Concepções Libertadoras:
   - Paulo Freire: Educação como prática da liberdade, conscientização, pedagogia da autonomia e relação dialógica entre educador e educando.
   - Dermeval Saviani e a Pedagogia Histórico-Crítica; José Carlos Libâneo e as tendências pedagógicas na prática escolar brasileira.
3. Avaliação da Aprendizagem Escolar:
   - Cipriano Carlos Luckesi: Avaliação diagnóstica e acolhedora contraposta ao modelo punitivo e classificatório.
   - Jussara Hoffmann: Avaliação mediadora e acompanhamento da trajetória singular do estudante.
4. Didática, Planejamento Curricular e Gestão Democrática:
   - Ilma Passos Alencastro Veiga: O Projeto Político-Pedagógico (PPP) como instrumento de emancipação e construção coletiva.
   - Gestão escolar participativa: Conselho Escolar, Grêmio Estudantil e comunidade.
   - Metodologias ativas de aprendizagem e Tecnologias Digitais de Informação e Comunicação (TDIC).

SEÇÃO 3: LÍNGUA PORTUGUESA
1. Leitura, compreensão e interpretação textual em diferentes gêneros e tipologias discursivas.
2. Coesão textual (anafórica, catafórica e sequencial) e coerência semântica.
3. Sintaxe da norma-padrão:
   - Concordância verbal e nominal (casos gerais e casos especiais).
   - Regência verbal e nominal; crase (regras obrigatórias, facultativas e casos proibidos).
   - Emprego dos sinais de pontuação e seus valores expressivos e sintáticos.
   - Colocação pronominal (próclise, mesóclise e ênclise).

SEÇÃO 4: RACIOCÍNIO LÓGICO E QUANTITATIVO
1. Resolução de situações-problema com conjuntos numéricos, frações, razão e proporção.
2. Regra de três simples e composta; porcentagem, juros simples e variações sucessivas.
3. Estruturas lógicas de relações arbitrárias; lógica de proposições, conectivos lógicos e tabelas-verdade.

SEÇÃO 5: EDUCAÇÃO ESPECIAL, INCLUSIVA E DIREITOS HUMANOS
1. Política Nacional de Educação Especial na Perspectiva da Educação Inclusiva.
2. Diretrizes operacionais para o Atendimento Educacional Especializado (AEE) na rede pública.
3. Princípios do Desenho Universal para a Aprendizagem (DUA).
4. Educação para as Relações Étnico-Raciais (Leis Federais nº 10.639/2003 e nº 11.645/2008) e Direitos Humanos na Educação Pública.`,
  texto_extraido: 'Edital de Abertura Nº 01/2026 da SEDUC-CE sob coordenação da CEV/UECE. 60 questões objetivas estruturadas em Legislação Educacional do Ceará (LC 22/2000, SPAECE, DCRC, EEMTI, LDB, ECA), Conhecimentos Pedagógicos (Paulo Freire, Vygotsky, Luckesi, Libâneo), Português, Raciocínio Lógico e Educação Inclusiva.'
};

export const DISCIPLINAS_OFICIAIS: (Disciplina & { conteudos: Conteudo[] })[] = [
  {
    id: 'disc_leg_ce_01',
    edital_id: 'edital_seduc_ce_2026',
    nome: 'Legislação Educacional e Políticas da Educação do Ceará',
    peso: 2.0,
    quantidade_questoes: 20,
    ordem: 1,
    conteudos: [
      {
        id: 'cont_ldb_ce',
        disciplina_id: 'disc_leg_ce_01',
        parent_id: null,
        nome: 'LDB Lei nº 9.394/96 — Diretrizes Nacionais e Organização da Educação',
        descricao: 'Artigos 1º ao 24: princípios, dever do Estado, carga horária mínima (800h em 200 dias), frequência de 75% e organização pedagógica.',
        nivel: 1,
        ordem: 1
      },
      {
        id: 'cont_estatuto_magisterio_ce',
        disciplina_id: 'disc_leg_ce_01',
        parent_id: null,
        nome: 'Lei Complementar Estadual nº 22/2000 — Estatuto do Magistério do Ceará',
        descricao: 'Regime jurídico do professor da rede estadual do Ceará: direitos, deveres, jornada com 1/3 extraclasse (HTPC) e progressão funcional.',
        nivel: 1,
        ordem: 2
      },
      {
        id: 'cont_spaece_ceara',
        disciplina_id: 'disc_leg_ce_01',
        parent_id: null,
        nome: 'SPAECE — Sistema Permanente de Avaliação da Educação Básica do Ceará',
        descricao: 'Matrizes de referência, níveis de proficiência, histórico da política de avaliação cearense e uso pedagógico dos dados.',
        nivel: 1,
        ordem: 3
      },
      {
        id: 'cont_dcrc_bncc_ce',
        disciplina_id: 'disc_leg_ce_01',
        parent_id: null,
        nome: 'DCRC — Documento Curricular Referencial do Ceará e BNCC',
        descricao: 'Diretrizes curriculares do Ceará para Ensino Fundamental e Médio, 10 competências gerais e itinerários formativos.',
        nivel: 1,
        ordem: 4
      },
      {
        id: 'cont_eemti_eeep_ce',
        disciplina_id: 'disc_leg_ce_01',
        parent_id: null,
        nome: 'Modelo Cearense de Tempo Integral (EEMTI) e Educação Profissional (EEEP)',
        descricao: 'Diretrizes pedagógicas das Escolas de Ensino Médio em Tempo Integral e Escolas Estaduais de Educação Profissional do Ceará.',
        nivel: 1,
        ordem: 5
      },
      {
        id: 'cont_eca_notificacao_ce',
        disciplina_id: 'disc_leg_ce_01',
        parent_id: null,
        nome: 'ECA Lei nº 8.069/90 — Proteção Integral e Notificação ao Conselho Tutelar',
        descricao: 'Artigo 56 do ECA: comunicação obrigatória em casos de maus-tratos, faltas reiteradas/evasão e repetência.',
        nivel: 1,
        ordem: 6
      }
    ]
  },
  {
    id: 'disc_ped_ce_02',
    edital_id: 'edital_seduc_ce_2026',
    nome: 'Conhecimentos Pedagógicos e Didática Geral',
    peso: 2.0,
    quantidade_questoes: 20,
    ordem: 2,
    conteudos: [
      {
        id: 'cont_freire_pedagogia_ce',
        disciplina_id: 'disc_ped_ce_02',
        parent_id: null,
        nome: 'Paulo Freire e a Pedagogia Crítico-Libertadora',
        descricao: 'Pedagogia da autonomia, conscientização, educação como prática da liberdade e relação dialógica professor-aluno.',
        nivel: 1,
        ordem: 1
      },
      {
        id: 'cont_teorias_vygotsky_piaget_ce',
        disciplina_id: 'disc_ped_ce_02',
        parent_id: null,
        nome: 'Teorias da Aprendizagem e Desenvolvimento (Vygotsky, Piaget e Wallon)',
        descricao: 'Zona de Desenvolvimento Proximal (ZDP), mediação cultural, fases do desenvolvimento piagetiano e afetividade.',
        nivel: 1,
        ordem: 2
      },
      {
        id: 'cont_avaliacao_luckesi_hoffmann_ce',
        disciplina_id: 'disc_ped_ce_02',
        parent_id: null,
        nome: 'Avaliação da Aprendizagem Escolar: Formativa, Diagnóstica e Mediadora',
        descricao: 'Concepções de Luckesi e Jussara Hoffmann: superação do modelo classificatório/punitivo e foco na intervenção pedagógica.',
        nivel: 1,
        ordem: 3
      },
      {
        id: 'cont_gestao_ppp_veiga_ce',
        disciplina_id: 'disc_ped_ce_02',
        parent_id: null,
        nome: 'Gestão Democrática e Projeto Político-Pedagógico (PPP)',
        descricao: 'A construção coletiva e emancipatória do PPP (Ilma Veiga), colegiados escolares e participação da comunidade.',
        nivel: 1,
        ordem: 4
      }
    ]
  },
  {
    id: 'disc_port_ce_03',
    edital_id: 'edital_seduc_ce_2026',
    nome: 'Língua Portuguesa',
    peso: 1.5,
    quantidade_questoes: 15,
    ordem: 3,
    conteudos: [
      {
        id: 'cont_port_interpretacao_ce',
        disciplina_id: 'disc_port_ce_03',
        parent_id: null,
        nome: 'Compreensão e Interpretação Textual e Gêneros',
        descricao: 'Tipologia e gêneros textuais, inferências, pressupostos, efeitos de sentido e recursos estilísticos em textos contemporâneos.',
        nivel: 1,
        ordem: 1
      },
      {
        id: 'cont_port_concordancia_regencia_ce',
        disciplina_id: 'disc_port_ce_03',
        parent_id: null,
        nome: 'Sintaxe: Concordância Verbal/Nominal, Regência e Crase',
        descricao: 'Regras da norma culta frequentemente cobradas pela CEV-UECE em concordância de verbos impessoais e regência com crase.',
        nivel: 1,
        ordem: 2
      },
      {
        id: 'cont_port_pontuacao_coesao_ce',
        disciplina_id: 'disc_port_ce_03',
        parent_id: null,
        nome: 'Emprego dos Sinais de Pontuação e Mecanismos de Coesão',
        descricao: 'Emprego da vírgula em adjuntos deslocados e orações subordinadas; coesão anafórica e sequencial.',
        nivel: 1,
        ordem: 3
      }
    ]
  },
  {
    id: 'disc_mat_ce_04',
    edital_id: 'edital_seduc_ce_2026',
    nome: 'Raciocínio Lógico e Quantitativo',
    peso: 1.5,
    quantidade_questoes: 10,
    ordem: 4,
    conteudos: [
      {
        id: 'cont_mat_proporcao_porcentagem_ce',
        disciplina_id: 'disc_mat_ce_04',
        parent_id: null,
        nome: 'Resolução de Problemas, Frações, Proporção e Porcentagem',
        descricao: 'Cálculos aplicados, razão e proporção, regra de três simples/composta e variações percentuais sucessivas.',
        nivel: 1,
        ordem: 1
      },
      {
        id: 'cont_mat_logica_proposicional_ce',
        disciplina_id: 'disc_mat_ce_04',
        parent_id: null,
        nome: 'Lógica Proposicional, Conectivos e Tabelas-Verdade',
        descricao: 'Equivalências lógicas, negação de proposições compostas e diagramas lógicos no estilo CEV-UECE.',
        nivel: 1,
        ordem: 2
      }
    ]
  },
  {
    id: 'disc_esp_ce_05',
    edital_id: 'edital_seduc_ce_2026',
    nome: 'Educação Especial, Inclusiva e Direitos Humanos',
    peso: 1.0,
    quantidade_questoes: 10,
    ordem: 5,
    conteudos: [
      {
        id: 'cont_esp_aee_inclusao_ce',
        disciplina_id: 'disc_esp_ce_05',
        parent_id: null,
        nome: 'Política de Educação Inclusiva e Atendimento Educacional Especializado (AEE)',
        descricao: 'Diretrizes nacionais e da rede estadual do Ceará para o AEE, acessibilidade curricular e Sala de Recursos Multifuncionais.',
        nivel: 1,
        ordem: 1
      },
      {
        id: 'cont_esp_dua_ce',
        disciplina_id: 'disc_esp_ce_05',
        parent_id: null,
        nome: 'Desenho Universal para a Aprendizagem (DUA) e Relações Étnico-Raciais',
        descricao: 'Princípios do DUA e aplicação obrigatória das Leis nº 10.639/03 e nº 11.645/08 no currículo da educação básica.',
        nivel: 1,
        ordem: 2
      }
    ]
  }
];

export const QUESTOES_OFICIAIS_SEDUC: Questao[] = [
  {
    id: 'q_uece_spaece_01',
    edital_id: 'edital_seduc_ce_2026',
    prova_id: 'prova_cev_uece_2026',
    disciplina_id: 'disc_leg_ce_01',
    conteudo_id: 'cont_spaece_ceara',
    origem: 'REAL_PROVA',
    fonte: 'CEV-UECE — Concurso SEDUC-CE — Políticas Públicas de Avaliação',
    banca: 'CEV-UECE',
    ano: 2026,
    enunciado: 'No âmbito das políticas educacionais do Estado do Ceará, o Sistema Permanente de Avaliação da Educação Básica do Ceará (SPAECE) desempenha papel central na gestão pedagógica orientada por resultados com equidade. Sobre os objetivos e a utilização dos resultados do SPAECE pela rede pública estadual, assinale a afirmativa correta:',
    alternativas: [
      {
        letra: 'A',
        texto: 'O SPAECE destina-se exclusivamente à premiação financeira isolada de docentes, sem diálogo com o planejamento curricular das escolas.'
      },
      {
        letra: 'B',
        texto: 'Os resultados diagnósticos do SPAECE fornecem subsídios para a formulação de intervenções pedagógicas direcionadas, correção de fluxo e redução das desigualdades de aprendizagem entre os educandos cearenses.'
      },
      {
        letra: 'C',
        texto: 'A avaliação do SPAECE substitui as verificações de rendimento e a autonomia do professor na atribuição das notas bimestrais.'
      },
      {
        letra: 'D',
        texto: 'Os dados do SPAECE são sigilosos e não podem ser compartilhados com os colegiados e conselhos escolares das unidades de ensino.'
      },
      {
        letra: 'E',
        texto: 'O exame afere apenas competências motoras na Educação Infantil, não se aplicando aos anos do Ensino Médio da rede estadual.'
      }
    ],
    resposta_correta: 'B',
    explicacao: 'O SPAECE tem como objetivo central fornecer um diagnóstico rigoroso e contínuo da aprendizagem para subsidiar políticas públicas de equidade, apoio pedagógico às escolas e melhoria substancial dos indicadores educacionais do Ceará.',
    por_que_correta: 'A alternativa B define a diretriz estrutural do SPAECE na política educacional do Ceará.',
    por_que_outras_erradas: 'A, C, D e E trazem conceitos distorcidos contrários à concepção formativa e de planejamento participativo do sistema educacional cearense.',
    dificuldade: 'MEDIA',
    assunto: 'Políticas Educacionais do Ceará',
    subassunto: 'SPAECE e Gestão da Educação Básica',
    tags: ['SPAECE', 'CEV-UECE', 'SEDUC-CE', 'Legislação CE'],
    status: 'publicada',
    validada: true,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z'
  },
  {
    id: 'q_uece_magisterio_02',
    edital_id: 'edital_seduc_ce_2026',
    prova_id: 'prova_cev_uece_2026',
    disciplina_id: 'disc_leg_ce_01',
    conteudo_id: 'cont_estatuto_magisterio_ce',
    origem: 'REAL_PROVA',
    fonte: 'CEV-UECE — Legislação do Magistério Estadual — SEDUC-CE',
    banca: 'CEV-UECE',
    ano: 2026,
    enunciado: 'Em conformidade com o Estatuto do Magistério do Estado do Ceará (Lei Complementar Estadual nº 22/2000) e a legislação nacional sobre a jornada de trabalho do magistério público (Lei Federal nº 11.738/2008), o tempo destinado ao trabalho pedagógico extraclasse (HTPC/planejamento):',
    alternativas: [
      {
        letra: 'A',
        texto: 'deve corresponder ao limite mínimo de 1/3 (um terço) da jornada total de trabalho do professor.'
      },
      {
        letra: 'B',
        texto: 'é facultativo e pode ser suprimido integralmente a critério discricionário da direção escolar.'
      },
      {
        letra: 'C',
        texto: 'deve ser cumprido exclusivamente nos períodos de férias escolares dos estudantes.'
      },
      {
        letra: 'D',
        texto: 'corresponde a no máximo 10% (dez por cento) da carga horária semanal contratada.'
      },
      {
        letra: 'E',
        texto: 'não gera remuneração e deve ser realizado aos sábados e domingos sem cômputo na carga oficial.'
      }
    ],
    resposta_correta: 'A',
    explicacao: 'A Lei Federal nº 11.738/2008, regulamentada em consonância com a legislação educacional do Estado do Ceará, garante que na composição da jornada de trabalho do professor da rede pública será observado o limite máximo de 2/3 da carga horária para o desempenho das atividades de interação com os educandos, reservando-se no mínimo 1/3 para atividades extraclasse e planejamento.',
    por_que_correta: 'Corresponde à regra legal obrigatória de 1/3 da jornada para planejamento pedagógico.',
    por_que_outras_erradas: 'As demais alternativas contrariam frontalmente o princípio de valorização e o regime do Estatuto do Magistério.',
    dificuldade: 'FACIL',
    assunto: 'Legislação do Ceará',
    subassunto: 'Estatuto do Magistério do Ceará (LC nº 22/2000)',
    tags: ['Magistério CE', 'LC 22/2000', 'SEDUC-CE', 'CEV-UECE'],
    status: 'publicada',
    validada: true,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z'
  },
  {
    id: 'q_uece_ldb_03',
    edital_id: 'edital_seduc_ce_2026',
    prova_id: 'prova_cev_uece_2026',
    disciplina_id: 'disc_leg_ce_01',
    conteudo_id: 'cont_ldb_ce',
    origem: 'REAL_PROVA',
    fonte: 'CEV-UECE — SEDUC-CE — Prova de Conhecimentos em Legislação',
    banca: 'CEV-UECE',
    ano: 2026,
    enunciado: 'Nos termos do artigo 24 da Lei de Diretrizes e Bases da Educação Nacional (Lei nº 9.394/1996), a educação básica, nos níveis fundamental e médio, será organizada com regras comuns. A respeito da carga horária anual e dos dias de efetivo trabalho escolar, assinale a opção correta:',
    alternativas: [
      {
        letra: 'A',
        texto: 'A carga horária mínima anual será de oitocentas horas para o ensino fundamental e médio, distribuídas por um mínimo de duzentos dias de efetivo trabalho escolar, excluído o tempo reservado aos exames finais, quando houver.'
      },
      {
        letra: 'B',
        texto: 'A carga horária mínima anual será de setecentas horas distribuídas por cento e oitenta dias letivos.'
      },
      {
        letra: 'C',
        texto: 'O calendário escolar pode suprimir dias letivos para adequação a festividades municipais sem necessidade de reposição.'
      },
      {
        letra: 'D',
        texto: 'A frequência mínima obrigatória exigida para aprovação escolar na educação básica é de 60% do total de horas letivas.'
      },
      {
        letra: 'E',
        texto: 'Os exames finais estão incluídos expressamente dentro do cômputo dos duzentos dias de efetivo trabalho escolar.'
      }
    ],
    resposta_correta: 'A',
    explicacao: 'O artigo 24, I da LDB 9.394/96 prescreve: "a carga horária mínima anual será de oitocentas horas para o ensino fundamental e para o ensino médio, distribuídas por um mínimo de duzentos dias de efetivo trabalho escolar, excluído o tempo reservado aos exames finais, quando houver".',
    por_que_correta: 'A letra A é literal do Artigo 24, I da LDB 9.394/96.',
    por_que_outras_erradas: 'B erra nas horas e dias; C desobedece a exigência de cumprimento integral das horas mínimas; D traz 60% quando o correto é 75% (Art. 24, VI); E erra pois os exames finais são excluídos dos 200 dias.',
    dificuldade: 'FACIL',
    assunto: 'LDB 9.394/96',
    subassunto: 'Artigo 24 - Organização do Ensino',
    tags: ['LDB', 'CEV-UECE', 'SEDUC-CE', 'Art. 24'],
    status: 'publicada',
    validada: true,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z'
  },
  {
    id: 'q_uece_freire_04',
    edital_id: 'edital_seduc_ce_2026',
    prova_id: 'prova_cev_uece_2026',
    disciplina_id: 'disc_ped_ce_02',
    conteudo_id: 'cont_freire_pedagogia_ce',
    origem: 'REAL_PROVA',
    fonte: 'CEV-UECE — Conhecimentos Pedagógicos — SEDUC-CE',
    banca: 'CEV-UECE',
    ano: 2026,
    enunciado: 'Na obra "Pedagogia da Autonomia", Paulo Freire formula saberes necessários à prática educativa docente. Para o autor, "ensinar não é transferir conhecimento, mas criar as possibilidades para a sua própria produção ou a sua construção". A partir dessa premissa freiriana, o ato pedagógico autêntico exige:',
    alternativas: [
      {
        letra: 'A',
        texto: 'A imposição de verdades acabadas pelo educador, silenciando os saberes construídos historicamente pelos educandos em sua comunidade.'
      },
      {
        letra: 'B',
        texto: 'Rigorosidade metódica, respeito aos saberes dos educandos, criticidade, ética e assunção da identidade cultural do sujeito da aprendizagem.'
      },
      {
        letra: 'C',
        texto: 'Adoção exclusiva da pedagogia bancária com memorização passiva de conteúdos desconectados da realidade social.'
      },
      {
        letra: 'D',
        texto: 'Neutralidade política do professor perante as contradições socioeconômicas vividas pela comunidade escolar.'
      },
      {
        letra: 'E',
        texto: 'Subordinação cega do currículo a manuais padronizados, descartando a reflexão crítica sobre a prática docente.'
      }
    ],
    resposta_correta: 'B',
    explicacao: 'Em "Pedagogia da Autonomia", Paulo Freire postula que ensinar exige rigorosidade metódica, pesquisa, respeito aos saberes dos educandos, criticidade, estética e ética, corporeificação das palavras pelo exemplo e assunção da identidade cultural.',
    por_que_correta: 'A alternativa B sintetiza com precisão as teses basilares de Paulo Freire para a formação docente.',
    por_que_outras_erradas: 'A, C, D e E representam exatamente a concepção bancária e autoritária veementemente refutada por Freire.',
    dificuldade: 'MEDIA',
    assunto: 'Conhecimentos Pedagógicos',
    subassunto: 'Paulo Freire e a Pedagogia da Autonomia',
    tags: ['Paulo Freire', 'CEV-UECE', 'SEDUC-CE', 'Didática'],
    status: 'publicada',
    validada: true,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z'
  },
  {
    id: 'q_uece_luckesi_05',
    edital_id: 'edital_seduc_ce_2026',
    prova_id: 'prova_cev_uece_2026',
    disciplina_id: 'disc_ped_ce_02',
    conteudo_id: 'cont_avaliacao_luckesi_hoffmann_ce',
    origem: 'REAL_PROVA',
    fonte: 'CEV-UECE — Didática e Avaliação Educacional',
    banca: 'CEV-UECE',
    ano: 2026,
    enunciado: 'Segundo Cipriano Carlos Luckesi, a avaliação da aprendizagem escolar tem sido frequentemente confundida com a prática de exames vestibulares e classificatórios. Para que a avaliação resgate seu propósito formativo no cotidiano da sala de aula, ela deve:',
    alternativas: [
      {
        letra: 'A',
        texto: 'ser excludente e classificatória, separando precocemente os estudantes aptos dos inaptos.'
      },
      {
        letra: 'B',
        texto: 'caracterizar-se como um ato amoroso, acolhedor e diagnóstico, voltado para a tomada de decisões em prol da aprendizagem de todos os estudantes.'
      },
      {
        letra: 'C',
        texto: 'concentrar-se em uma única aplicação anual sem direito a devolutivas ou processos de recuperação.'
      },
      {
        letra: 'D',
        texto: 'restringir-se à aferição numérica para preenchimento de boletins formais do sistema de ensino.'
      },
      {
        letra: 'E',
        texto: 'desconsiderar o diagnóstico inicial das dificuldades individuais para não comprometer o ritmo do planejamento geral.'
      }
    ],
    resposta_correta: 'B',
    explicacao: 'Luckesi defende incansavelmente que a avaliação é um juízo de valor sobre dados relevantes da realidade pedagógica para a tomada de decisão. É fundamentalmente diagnóstica e acolhedora.',
    por_que_correta: 'A alternativa B expressa a célebre definição de avaliação acolhedora e diagnóstica de Luckesi.',
    por_que_outras_erradas: 'As outras alternativas refletem a pedagogia do exame e a postura punitiva combatida na literatura pedagógica.',
    dificuldade: 'FACIL',
    assunto: 'Avaliação da Aprendizagem',
    subassunto: 'Avaliação Diagnóstica e Formativa (Luckesi)',
    tags: ['Luckesi', 'Avaliação', 'CEV-UECE', 'SEDUC-CE'],
    status: 'publicada',
    validada: true,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z'
  },
  {
    id: 'q_uece_port_concordancia_06',
    edital_id: 'edital_seduc_ce_2026',
    prova_id: 'prova_cev_uece_2026',
    disciplina_id: 'disc_port_ce_03',
    conteudo_id: 'cont_port_concordancia_regencia_ce',
    origem: 'REAL_PROVA',
    fonte: 'CEV-UECE — Prova Comum de Língua Portuguesa — Concurso Magistério',
    banca: 'CEV-UECE',
    ano: 2026,
    enunciado: 'Considere as normas de concordância verbal e nominal prescritas pela gramática normativa da Língua Portuguesa. Assinale a opção redigida em total conformidade com a norma culta:',
    alternativas: [
      {
        letra: 'A',
        texto: 'Fazem muitos anos que a rede estadual cearense consolidou seu modelo pedagógico de tempo integral.'
      },
      {
        letra: 'B',
        texto: 'Haviam vários professores inscritos para a banca examinadora do concurso público estadual.'
      },
      {
        letra: 'C',
        texto: 'Mais de um professor de Fortaleza expressou entusiasmo com as novas diretrizes curriculares do Ceará.'
      },
      {
        letra: 'D',
        texto: 'Seguem anexo às atas as fichas de frequência dos estudantes do Ensino Médio.'
      },
      {
        letra: 'E',
        texto: 'É proibido a entrada de pessoas não autorizadas na sala de aplicação das provas do concurso.'
      }
    ],
    resposta_correta: 'C',
    explicacao: 'Na expressão "mais de um", o verbo permanece no singular ("expressou").',
    por_que_correta: 'C está perfeita gramaticalmente: "Mais de um professor... expressou".',
    por_que_outras_erradas: 'A: Fazer em sentido temporal é impessoal (deve ser "Faz muitos anos"). B: Haver no sentido de existir é impessoal (deve ser "Havia vários professores"). D: O termo "anexo" concorda em gênero e número ("Seguem anexas às atas as fichas"). E: Havendo o artigo "a entrada", a concordância é obrigatória ("É proibida a entrada").',
    dificuldade: 'MEDIA',
    assunto: 'Língua Portuguesa',
    subassunto: 'Concordância Verbal e Nominal',
    tags: ['Português', 'CEV-UECE', 'SEDUC-CE', 'Concordância'],
    status: 'publicada',
    validada: true,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z'
  },
  {
    id: 'q_uece_mat_porcentagem_07',
    edital_id: 'edital_seduc_ce_2026',
    prova_id: 'prova_cev_uece_2026',
    disciplina_id: 'disc_mat_ce_04',
    conteudo_id: 'cont_mat_proporcao_porcentagem_ce',
    origem: 'REAL_PROVA',
    fonte: 'CEV-UECE — Raciocínio Lógico e Quantitativo — SEDUC-CE',
    banca: 'CEV-UECE',
    ano: 2026,
    enunciado: 'Em uma Escola Estadual de Educação Profissional (EEEP) no Ceará com 500 alunos matriculados, 60% dos estudantes participam de clubes preparatórios de robótica e matemática. Dos participantes desses clubes, 35% foram selecionados para a Feira Cearense de Ciências e Inovação. O número exato de alunos selecionados para a feira é igual a:',
    alternativas: [
      { letra: 'A', texto: '95' },
      { letra: 'B', texto: '105' },
      { letra: 'C', texto: '115' },
      { letra: 'D', texto: '125' },
      { letra: 'E', texto: '135' }
    ],
    resposta_correta: 'B',
    explicacao: 'Alunos nos clubes: 60% de 500 = 0,60 * 500 = 300 estudantes. Alunos selecionados: 35% de 300 = 0,35 * 300 = 105 estudantes.',
    por_que_correta: '300 * 0,35 = 105 alunos selecionados.',
    por_que_outras_erradas: 'Os demais valores decorrem de equívocos nos fatores multiplicativos de porcentagem.',
    dificuldade: 'FACIL',
    assunto: 'Raciocínio Lógico e Quantitativo',
    subassunto: 'Porcentagem Sucessiva Aplicada',
    tags: ['Matemática', 'Porcentagem', 'CEV-UECE', 'EEEP Ceará'],
    status: 'publicada',
    validada: true,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z'
  },
  {
    id: 'q_uece_inclusao_dua_08',
    edital_id: 'edital_seduc_ce_2026',
    prova_id: 'prova_cev_uece_2026',
    disciplina_id: 'disc_esp_ce_05',
    conteudo_id: 'cont_esp_dua_ce',
    origem: 'IA_INEDITA_EDITAL',
    fonte: 'Inédita Alinhada às Diretrizes de Inclusão da SEDUC-CE e DUA',
    banca: 'CEV-UECE',
    ano: 2026,
    enunciado: 'O Desenho Universal para a Aprendizagem (DUA) constitui uma abordagem curricular orientada a garantir acessibilidade metodológica a todos os discentes, respeitando a neurodiversidade na sala de aula. Os três eixos norteadores do DUA organizam-se em proporcionar aos estudantes múltiplos meios de:',
    alternativas: [
      {
        letra: 'A',
        texto: 'engajamento, representação e ação/expressão.'
      },
      {
        letra: 'B',
        texto: 'avaliação somativa, ranqueamento hierárquico e memorização linear.'
      },
      {
        letra: 'C',
        texto: 'segregação de turmas, tarefas repetitivas e uniformização curricular.'
      },
      {
        letra: 'D',
        texto: 'punição disciplinar, recompensa condicionada e exclusão de conteúdos complexos.'
      },
      {
        letra: 'E',
        texto: 'exames vestibulares precoces, retenção automática e isolamento pedagógico.'
      }
    ],
    resposta_correta: 'A',
    explicacao: 'O DUA fundamenta-se nos princípios neurocientíficos de redes afetivas (múltiplos meios de engajamento), redes de reconhecimento (múltiplos meios de representação) e redes estratégicas (múltiplos meios de ação e expressão).',
    por_que_correta: 'A alternativa A define fidedignamente os 3 pilares internacionais do Desenho Universal para a Aprendizagem.',
    por_que_outras_erradas: 'As outras alternativas representam práticas ultrapassadas e excludentes em desacordo com a Educação Inclusiva.',
    dificuldade: 'FACIL',
    assunto: 'Educação Especial e Inclusiva',
    subassunto: 'Princípios do Desenho Universal para Aprendizagem (DUA)',
    tags: ['Inclusão', 'DUA', 'CEV-UECE', 'SEDUC-CE'],
    status: 'publicada',
    validada: true,
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z'
  }
];
