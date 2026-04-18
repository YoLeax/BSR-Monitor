// BeatLeader API 封装

import { API_CONFIG } from './config';
import { request } from './request';
import type {
  BLPlayerResponse,
  BLCompactScoreResponseWithMetadata,
  BLLeaderboardResponse,
} from './types';

export async function getPlayerInfo(id: string): Promise<BLPlayerResponse> {
  return request<BLPlayerResponse>(API_CONFIG.beatleader.baseUrl, `/player/${id}`, {
    timeout: API_CONFIG.beatleader.timeout,
  });
}

export async function getPlayerScores(
  id: string,
  count: number = 100
): Promise<BLCompactScoreResponseWithMetadata> {
  return request<BLCompactScoreResponseWithMetadata>(
    API_CONFIG.beatleader.baseUrl,
    `/player/${id}/scores/compact`,
    {
      method: 'POST',
      body: { count },
      timeout: API_CONFIG.beatleader.timeout,
    }
  );
}

export async function getLeaderboard(id: string): Promise<BLLeaderboardResponse> {
  return request<BLLeaderboardResponse>(
    API_CONFIG.beatleader.baseUrl,
    `/leaderboard/${id}`,
    {
      timeout: API_CONFIG.beatleader.timeout,
    }
  );
}