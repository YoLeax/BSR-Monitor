// API 调用封装模块

// 配置
export { API_CONFIG } from './config';

// 请求工具
export { request, APIError } from './request';

// 类型定义
export type {
  BLPlayerResponse,
  BLCompactScore,
  BLCompactLeaderboard,
  BLCompactScoreResponse,
  BLCompactScoreResponseWithMetadata,
  BLLeaderboardResponse,
  BSMapDetailMetadata,
  BSMapStats,
  BSMapDifficulty,
  BSMapVersion,
  BSUserDetail,
  BSMapDetail,
  BSPlaylistFull,
  BSMapDetailWithOrder,
  BSPlaylistPage,
} from './types';
export { BL_DIFFICULTY_MAP, BL_MODE_MAP } from './types';

// BeatLeader API
export { getPlayerInfo, getPlayerScores, getLeaderboard } from './beatleader';

// BeatSaver API
export { getMapByKey, getMapByHash, getPlaylist } from './beatsaver';

// leaderboardId 解析
export { parseLeaderboardId, isValidLeaderboardId } from './leaderboardId';