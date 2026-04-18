// leaderboardId 解析工具

import { BL_DIFFICULTY_MAP, BL_MODE_MAP } from './types';

interface ParsedLeaderboardId {
  key: string;
  difficulty: string;
  mode: string;
  versionSegment: string; // 用于调试和追踪
}

/**
 * 解析 BeatLeader leaderboardId
 *
 * 格式: {key}{版本段}{难度}{模式}
 * - 版本段: 空=首次上传，x=第二次，xx=第三次...
 * - 难度: 1=Easy, 3=Normal, 5=Hard, 7=Expert, 9=ExpertPlus
 * - 模式: 0=Legacy, 1=Standard, 2=OneSaber, 3=NoArrows, 4=90Degree, 5=360Degree, 6=Lightshow, 7=Lawless
 *
 * 解析规则:
 * 1. 若存在版本段（含有一个或多个 x）: 以这些 x 为锚点，向前取 key，向后依次取难度值（1位）和模式值（剩余位）
 * 2. 若版本段为空: 从末尾取1位作为模式值，再取1位作为难度值，剩余部分为 key
 *
 * 注意: 版本段为空且模式值超过1位（非常规模式）时，会导致 key 解析不准确，但 hash 仍正确。
 */
export function parseLeaderboardId(leaderboardId: string): ParsedLeaderboardId | null {
  if (!leaderboardId || leaderboardId.length < 3) {
    return null;
  }

  // 检查是否存在版本段（包含 x）
  const xMatch = leaderboardId.match(/x+/);

  if (xMatch) {
    // 存在版本段的情况
    const versionSegment = xMatch[0];
    const xIndex = leaderboardId.indexOf(versionSegment);
    const afterX = leaderboardId.slice(xIndex + versionSegment.length);

    // 至少需要难度(1位) + 模式(至少1位)
    if (afterX.length < 2) {
      return null;
    }

    const difficultyValue = afterX[0];
    const modeValue = afterX.slice(1);
    const key = leaderboardId.slice(0, xIndex);

    const difficulty = BL_DIFFICULTY_MAP[parseInt(difficultyValue, 10)];
    const mode = BL_MODE_MAP[modeValue] || 'Unknown';

    if (!difficulty) {
      return null;
    }

    return {
      key,
      difficulty,
      mode,
      versionSegment,
    };
  } else {
    // 版本段为空的情况
    // 从末尾取1位作为模式值，再取1位作为难度值
    // 注意：非常规模式值可能超过1位，此时 key 解析不准确

    // 先尝试常规情况：模式值1位
    const modeValue = leaderboardId.slice(-1);
    const difficultyValue = leaderboardId.slice(-2, -1);
    const key = leaderboardId.slice(0, -2);

    const difficulty = BL_DIFFICULTY_MAP[parseInt(difficultyValue, 10)];
    const mode = BL_MODE_MAP[modeValue];

    if (difficulty && mode) {
      return {
        key,
        difficulty,
        mode,
        versionSegment: '',
      };
    }

    // 尝试模式值超过1位的情况（如 Legacy 是 0，但某些非常规模式可能需要更多位）
    // 检查是否存在有效的难度值在倒数第2位
    // 如果没有找到有效难度，尝试其他组合

    // 从末尾开始尝试匹配有效的模式值
    for (let modeLen = 1; modeLen <= 3 && leaderboardId.length - modeLen >= 2; modeLen++) {
      const potentialModeValue = leaderboardId.slice(-modeLen);
      const potentialDifficultyValue = leaderboardId.slice(-(modeLen + 1), -modeLen);
      const potentialKey = leaderboardId.slice(0, -(modeLen + 1));

      const potentialMode = BL_MODE_MAP[potentialModeValue];
      const potentialDifficulty = BL_DIFFICULTY_MAP[parseInt(potentialDifficultyValue, 10)];

      if (potentialMode && potentialDifficulty) {
        return {
          key: potentialKey,
          difficulty: potentialDifficulty,
          mode: potentialMode,
          versionSegment: '',
        };
      }
    }

    return null;
  }
}

/**
 * 验证 leaderboardId 是否符合 BL 格式
 */
export function isValidLeaderboardId(leaderboardId: string): boolean {
  return parseLeaderboardId(leaderboardId) !== null;
}