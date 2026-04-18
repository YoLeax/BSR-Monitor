// API 响应类型定义

// BeatLeader 类型

export interface BLPlayerResponse {
  id: string;
  name: string;
  platform: string;
  avatar: string;
  country: string;
  alias: string | null;
  bot: boolean;
  temporary: boolean;
  pp: number;
  rank: number;
  countryRank: number;
  level: number;
}

export interface BLCompactScore {
  id: number | null;
  originalId: number;
  baseScore: number;
  modifiedScore: number;
  accuracy: number;
  pp: number | null;
  epochTime: number;
}

export interface BLCompactLeaderboard {
  id: string;
  songHash: string;
  modeName: string;
  difficulty: number;
}

export interface BLCompactScoreResponse {
  score: BLCompactScore;
  leaderboard: BLCompactLeaderboard;
}

export interface BLCompactScoreResponseWithMetadata {
  metadata: {
    page: number;
    pageSize: number;
    total: number;
  };
  data: BLCompactScoreResponse[];
}

export interface BLLeaderboardResponse {
  id: string;
  song: {
    id: number;
    name: string;
    author: string;
    mapper: string;
    mapperId: string;
    coverImage: string;
    fullCoverImage: string;
    download: string;
    hashes: {
      hash: string;
      difficulty: number;
      mode: number;
    }[];
  } | null;
  difficulty: {
    id: number;
    name: string;
    modeName: string;
    mode: number;
    stars: number;
    passed: number;
    plays: number;
    positive: number;
  } | null;
}

// BeatSaver 类型

export interface BSMapDetailMetadata {
  bpm: number;
  duration: number;
  levelAuthorName: string;
  songAuthorName: string;
  songName: string;
  songSubName: string;
}

export interface BSMapStats {
  downloads: number;
  downvotes: number;
  plays: number;
  reviews: number;
  score: number;
  upvotes: number;
}

export interface BSMapDifficulty {
  characteristic: string;
  difficulty: string;
  bombs: number;
  notes: number;
  obstacles: number;
  nps: number;
  length: number;
  blStars: number;
}

export interface BSMapVersion {
  coverURL: string;
  downloadURL: string;
  hash: string;
  key: string;
  previewURL: string;
  diffs: BSMapDifficulty[];
  state: string;
  createdAt: string;
}

export interface BSUserDetail {
  id: number;
  name: string;
  avatar: string;
}

export interface BSMapDetail {
  id: string;
  name: string;
  description: string;
  metadata: BSMapDetailMetadata;
  stats: BSMapStats;
  versions: BSMapVersion[];
  uploader: BSUserDetail;
  createdAt: string;
  updatedAt: string;
}

export interface BSPlaylistFull {
  playlistId: number;
  name: string;
  description: string;
  playlistImage: string;
  owner: BSUserDetail;
  stats: {
    totalMaps: number;
    downloads: number;
    upvotes: number;
    downvotes: number;
  };
  createdAt: string;
  songsChangedAt: string;
  downloadURL: string;
}

export interface BSMapDetailWithOrder {
  map: BSMapDetail;
  order: number;
}

export interface BSPlaylistPage {
  playlist: BSPlaylistFull;
  maps: BSMapDetailWithOrder[];
}

// 难度值转换映射

export const BL_DIFFICULTY_MAP: Record<number, string> = {
  1: 'Easy',
  3: 'Normal',
  5: 'Hard',
  7: 'Expert',
  9: 'ExpertPlus',
};

// 模式值映射 (BL leaderboardId)

export const BL_MODE_MAP: Record<string, string> = {
  '0': 'Legacy',
  '1': 'Standard',
  '2': 'OneSaber',
  '3': 'NoArrows',
  '4': '90Degree',
  '5': '360Degree',
  '6': 'Lightshow',
  '7': 'Lawless',
};