// PlayerScore 数据库操作

import { getDatabase } from './database';
import { BL_DIFFICULTY_MAP } from '../api/types';

export interface PlayerScore {
  playerId: string;
  scoreId: number;
  leaderboardId: string;
  mapKey: string | null;
  hash: string;
  mode: string;
  difficulty: string;
  accuracy: number;
  epochTime: number;
}

export interface ScoreInsertData {
  scoreId: number;
  leaderboardId: string;
  hash: string;
  mode: string;
  difficulty: number;
  accuracy: number;
  epochTime: number;
}

// 难度值转换为字符串
function difficultyValueToString(value: number): string {
  return BL_DIFFICULTY_MAP[value] || 'Unknown';
}

// 添加单条成绩，处理去重逻辑
// 若已存在相同 playerId+hash+mode+difficulty，只有新记录时间戳更大时才更新
export async function addScore(playerId: string, data: ScoreInsertData): Promise<boolean> {
  const db = getDatabase();
  const difficulty = difficultyValueToString(data.difficulty);

  // 先检查是否已存在
  const existing = await db.select<{ epochTime: number }[]>(
    `SELECT epochTime FROM PlayerScore
     WHERE playerId = $1 AND hash = $2 AND mode = $3 AND difficulty = $4`,
    [playerId, data.hash, data.mode, difficulty]
  );

  if (existing.length > 0) {
    // 已存在，只有新记录时间戳更大时才更新
    if (data.epochTime > existing[0].epochTime) {
      await db.execute(
        `UPDATE PlayerScore
         SET scoreId = $1, accuracy = $2, epochTime = $3, leaderboardId = $4
         WHERE playerId = $5 AND hash = $6 AND mode = $7 AND difficulty = $8`,
        [data.scoreId, data.accuracy, data.epochTime, data.leaderboardId, playerId, data.hash, data.mode, difficulty]
      );
      return true;
    }
    return false; // 不更新
  }

  // 不存在，插入新记录
  await db.execute(
    `INSERT INTO PlayerScore (playerId, scoreId, leaderboardId, mapKey, hash, mode, difficulty, accuracy, epochTime)
     VALUES ($1, $2, $3, NULL, $4, $5, $6, $7, $8)`,
    [playerId, data.scoreId, data.leaderboardId, data.hash, data.mode, difficulty, data.accuracy, data.epochTime]
  );
  return true;
}

// 批量添加成绩，返回成功插入/更新的数量
export async function batchAddScores(playerId: string, scores: ScoreInsertData[]): Promise<number> {
  let count = 0;
  for (const score of scores) {
    if (await addScore(playerId, score)) {
      count++;
    }
  }
  return count;
}

// 获取玩家所有成绩
export async function getPlayerScores(playerId: string): Promise<PlayerScore[]> {
  const db = getDatabase();
  return db.select<PlayerScore[]>(
    `SELECT playerId, scoreId, leaderboardId, mapKey, hash, mode, difficulty, accuracy, epochTime
     FROM PlayerScore WHERE playerId = $1
     ORDER BY epochTime DESC`,
    [playerId]
  );
}

// 获取玩家成绩数量
export async function getScoreCount(playerId: string): Promise<number> {
  const db = getDatabase();
  const result = await db.select<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM PlayerScore WHERE playerId = $1`,
    [playerId]
  );
  return result[0]?.count || 0;
}