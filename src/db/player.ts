// PlayerInfo 数据库操作

import { getDatabase } from './database';

export interface PlayerInfo {
  id: string;
  name: string;
  avatarURL: string | null;
  liveURL: string | null;
  alias: string | null;
}

export interface PlayerWithScoreCount {
  id: string;
  name: string;
  avatarURL: string | null;
  liveURL: string | null;
  alias: string | null;
  scoreCount: number;
}

// 添加玩家，若已存在则更新
export async function addPlayer(player: PlayerInfo): Promise<void> {
  const db = getDatabase();
  await db.execute(
    `INSERT OR REPLACE INTO PlayerInfo (id, name, avatarURL, liveURL, alias)
     VALUES ($1, $2, $3, $4, $5)`,
    [player.id, player.name, player.avatarURL, player.liveURL, player.alias]
  );
}

// 获取单个玩家
export async function getPlayer(id: string): Promise<PlayerInfo | null> {
  const db = getDatabase();
  const result = await db.select<PlayerInfo[]>(
    `SELECT id, name, avatarURL, liveURL, alias FROM PlayerInfo WHERE id = $1`,
    [id]
  );
  return result.length > 0 ? result[0] : null;
}

// 获取所有玩家列表（含成绩数量）
export async function getAllPlayers(): Promise<PlayerWithScoreCount[]> {
  const db = getDatabase();
  return db.select<PlayerWithScoreCount[]>(
    `SELECT p.id, p.name, p.avatarURL, p.liveURL, p.alias,
            COUNT(s.playerId) as scoreCount
     FROM PlayerInfo p
     LEFT JOIN PlayerScore s ON p.id = s.playerId
     GROUP BY p.id
     ORDER BY p.name`
  );
}

// 删除玩家（级联删除成绩）
export async function deletePlayer(id: string): Promise<void> {
  const db = getDatabase();
  await db.execute(`DELETE FROM PlayerInfo WHERE id = $1`, [id]);
}