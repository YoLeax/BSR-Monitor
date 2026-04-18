// BeatSaver API 封装

import { API_CONFIG } from './config';
import { request } from './request';
import type { BSMapDetail, BSPlaylistPage } from './types';

export async function getMapByKey(key: string): Promise<BSMapDetail> {
  return request<BSMapDetail>(API_CONFIG.beatsaver.baseUrl, `/maps/id/${key}`, {
    timeout: API_CONFIG.beatsaver.timeout,
  });
}

export async function getMapByHash(hash: string): Promise<BSMapDetail> {
  return request<BSMapDetail>(API_CONFIG.beatsaver.baseUrl, `/maps/hash/${hash}`, {
    timeout: API_CONFIG.beatsaver.timeout,
  });
}

export async function getPlaylist(id: number, page: number = 0): Promise<BSPlaylistPage> {
  return request<BSPlaylistPage>(
    API_CONFIG.beatsaver.baseUrl,
    `/playlists/id/${id}/${page}`,
    {
      timeout: API_CONFIG.beatsaver.timeout,
    }
  );
}