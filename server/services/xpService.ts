import { db } from '../db/store';
import { XPTransaction, GamificationProfile } from '../../src/types';

// Tabela de Níveis
export const LEVEL_TABLE = [
  { level: 1, minXp: 0, title: 'Nível 1 — Iniciante dos Editais' },
  { level: 2, minXp: 150, title: 'Nível 2 — Aprendiz Dedicado' },
  { level: 3, minXp: 400, title: 'Nível 3 — Estudante Estratégico' },
  { level: 4, minXp: 800, title: 'Nível 4 — Preparação Avançada' },
  { level: 5, minXp: 1400, title: 'Nível 5 — Especialista em Concurso' },
  { level: 6, minXp: 2200, title: 'Nível 6 — Mestre Gabaritador SEDUC' },
  { level: 7, minXp: 3200, title: 'Nível 7 — Titular Inabalável' },
];

export function calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number; progressPercent: number } {
  let currentLevel = LEVEL_TABLE[0];
  let nextLevel = LEVEL_TABLE[1];

  for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TABLE[i].minXp) {
      currentLevel = LEVEL_TABLE[i];
      nextLevel = LEVEL_TABLE[i + 1] || { level: currentLevel.level + 1, minXp: currentLevel.minXp + 1500, title: 'Lendário' };
      break;
    }
  }

  const range = nextLevel.minXp - currentLevel.minXp;
  const currentInRange = xp - currentLevel.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    nextLevelXp: nextLevel.minXp,
    progressPercent
  };
}

export function awardXP(
  userId: string,
  amount: number,
  reason: string,
  referenceType: 'QUESTAO' | 'SIMULADO' | 'STREAK' | 'CONQUISTA' | 'REVISAO',
  referenceId?: string
): { profile: GamificationProfile; transaction: XPTransaction; levelUp: boolean; newAchievements: string[] } {
  let profile = db.getGamificationProfiles().find(p => p.user_id === userId);
  if (!profile) {
    profile = db.updateGamificationProfile(userId, { xp_total: 0, level: 1 });
  }

  const previousLevel = profile.level;
  const newXpTotal = profile.xp_total + amount;
  const levelInfo = calculateLevel(newXpTotal);
  const levelUp = levelInfo.level > previousLevel;

  // Registrar Transação de XP
  const transaction: XPTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    user_id: userId,
    amount,
    reason,
    reference_type: referenceType,
    reference_id: referenceId,
    created_at: new Date().toISOString()
  };
  db.addXpTransaction(transaction);

  // Atualizar Perfil
  const updatedProfile = db.updateGamificationProfile(userId, {
    xp_total: newXpTotal,
    level: levelInfo.level,
    level_name: levelInfo.title,
    last_activity_at: new Date().toISOString()
  });

  // Verificar Conquistas e Itens Desbloqueados
  const newAchievements = checkAndAwardAchievements(userId, newXpTotal);
  checkAndUnlockGameItems(userId, levelInfo.level, newXpTotal);

  return {
    profile: updatedProfile,
    transaction,
    levelUp,
    newAchievements
  };
}

export function updateStreak(userId: string): { current_streak: number; bonusAwarded: boolean } {
  let profile = db.getGamificationProfiles().find(p => p.user_id === userId);
  if (!profile) {
    profile = db.updateGamificationProfile(userId, { current_streak: 1, longest_streak: 1 });
    return { current_streak: 1, bonusAwarded: false };
  }

  const now = new Date();
  const lastActivity = new Date(profile.last_activity_at);
  const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 3600);

  let newStreak = profile.current_streak;
  let bonusAwarded = false;

  // Se passou mais de 24h mas menos de 48h, soma 1 dia à sequência
  if (diffHours >= 20 && diffHours < 48) {
    newStreak += 1;
    bonusAwarded = true;
    const bonusXp = Math.min(150, 30 + newStreak * 10);
    awardXP(userId, bonusXp, `🔥 Sequência de Estudos: ${newStreak} dias consecutivos!`, 'STREAK');
  } else if (diffHours >= 48) {
    // Quebrou a sequência
    newStreak = 1;
  }

  const longest = Math.max(newStreak, profile.longest_streak);
  db.updateGamificationProfile(userId, {
    current_streak: newStreak,
    longest_streak: longest,
    last_activity_at: now.toISOString()
  });

  return { current_streak: newStreak, bonusAwarded };
}

export function checkAndAwardAchievements(userId: string, currentXp: number): string[] {
  const achievements = db.getAchievements().filter(a => a.active);
  const userAchs = db.getUserAchievements().filter(ua => ua.user_id === userId);
  const tentativas = db.getTentativas().filter(t => t.user_id === userId);
  const simulados = db.getSimulados().filter(s => s.user_id === userId && s.status === 'finalizado');
  const profile = db.getGamificationProfiles().find(p => p.user_id === userId);

  const newlyUnlocked: string[] = [];

  for (const ach of achievements) {
    const alreadyUnlocked = userAchs.some(ua => ua.achievement_id === ach.id);
    if (alreadyUnlocked) continue;

    let conditionMet = false;

    switch (ach.condition_type) {
      case 'QUESTIONS_ANSWERED':
        conditionMet = tentativas.length >= ach.condition_value;
        break;
      case 'QUESTIONS_CORRECT':
        const corretas = tentativas.filter(t => t.correta).length;
        conditionMet = corretas >= ach.condition_value;
        break;
      case 'SIMULATIONS_DONE':
        conditionMet = simulados.length >= ach.condition_value;
        break;
      case 'STREAK_DAYS':
        conditionMet = (profile?.current_streak || 0) >= ach.condition_value;
        break;
      case 'ACCURACY_RATE':
        if (tentativas.length >= 5) {
          const taxa = (tentativas.filter(t => t.correta).length / tentativas.length) * 100;
          conditionMet = taxa >= ach.condition_value;
        }
        break;
    }

    if (conditionMet) {
      db.unlockAchievement(userId, ach.id);
      newlyUnlocked.push(ach.name);
      // Bônus da conquista
      if (ach.xp_reward > 0) {
        db.addXpTransaction({
          id: `tx_ach_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          user_id: userId,
          amount: ach.xp_reward,
          reason: `🏆 Conquista Desbloqueada: ${ach.name}`,
          reference_type: 'CONQUISTA',
          reference_id: ach.id,
          created_at: new Date().toISOString()
        });
        if (profile) {
          profile.xp_total += ach.xp_reward;
          db.updateGamificationProfile(userId, { xp_total: profile.xp_total });
        }
      }
    }
  }

  return newlyUnlocked;
}

export function checkAndUnlockGameItems(userId: string, currentLevel: number, currentXp: number) {
  const items = db.getGameItems().filter(i => i.active);
  const userItems = db.getUserItems().filter(ui => ui.user_id === userId);

  for (const item of items) {
    const alreadyOwns = userItems.some(ui => ui.item_id === item.id);
    if (!alreadyOwns && (currentLevel >= item.unlock_level || currentXp >= item.unlock_xp)) {
      db.unlockItem(userId, item.id, false);
    }
  }
}

export function getRankings() {
  const profiles = db.getGamificationProfiles();
  const users = db.getUsers();
  const tentativas = db.getTentativas();
  const items = db.getGameItems();

  const ranking = profiles.map(p => {
    const user = users.find(u => u.id === p.user_id);
    const userTents = tentativas.filter(t => t.user_id === p.user_id);
    const taxa = userTents.length > 0 
      ? Math.round((userTents.filter(t => t.correta).length / userTents.length) * 100) 
      : 0;

    const pet = items.find(i => i.id === p.pet_id);
    const avatar = items.find(i => i.id === p.avatar_id);

    return {
      user_id: p.user_id,
      name: user?.name || 'Estudante SEDUC',
      avatar_url: avatar?.image_url || user?.avatar_url || '🦉',
      pet_url: pet?.image_url,
      level: p.level,
      level_name: p.level_name,
      xp_total: p.xp_total,
      streak: p.current_streak,
      taxa_acerto: taxa,
    };
  });

  // Ordenar por XP descrescente
  ranking.sort((a, b) => b.xp_total - a.xp_total);

  return ranking.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}
