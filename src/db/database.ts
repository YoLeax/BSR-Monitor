import Database from '@tauri-apps/plugin-sql';

const DB_PATH = 'sqlite:bsr-monitor.db';

// 数据库初始化 SQL
const INIT_SQL = `
-- Map 表：谱面基本信息
CREATE TABLE IF NOT EXISTS Map (
  key VARCHAR(16) PRIMARY KEY,
  songName TEXT NOT NULL,
  songAuthorName TEXT NOT NULL,
  levelAuthorName TEXT NOT NULL,
  rating FLOAT,
  coverURL TEXT,
  previewURL TEXT
);

-- MapDiff 表：谱面难度信息
CREATE TABLE IF NOT EXISTS MapDiff (
  key VARCHAR(16) NOT NULL,
  hash CHAR(40) NOT NULL,
  isCurrent BOOLEAN NOT NULL DEFAULT 0,
  mode VARCHAR(16) NOT NULL,
  difficulty VARCHAR(16) NOT NULL,
  PRIMARY KEY (key, hash, mode, difficulty),
  FOREIGN KEY (key) REFERENCES Map(key) ON DELETE CASCADE
);

-- PlayerInfo 表：玩家基本信息
CREATE TABLE IF NOT EXISTS PlayerInfo (
  id VARCHAR(40) PRIMARY KEY,
  name TEXT NOT NULL,
  avatarURL TEXT,
  liveURL TEXT,
  alias TEXT
);

-- PlayerScore 表：玩家成绩记录
CREATE TABLE IF NOT EXISTS PlayerScore (
  playerId VARCHAR(40) NOT NULL,
  scoreId BIGINT NOT NULL,
  leaderboardId VARCHAR(64) NOT NULL,
  mapKey VARCHAR(16),
  hash CHAR(40) NOT NULL,
  mode VARCHAR(16) NOT NULL,
  difficulty VARCHAR(16) NOT NULL,
  accuracy FLOAT NOT NULL,
  epochTime BIGINT NOT NULL,
  PRIMARY KEY (playerId, hash, mode, difficulty),
  FOREIGN KEY (playerId) REFERENCES PlayerInfo(id) ON DELETE CASCADE
);

-- Playlist 表：歌单元数据
CREATE TABLE IF NOT EXISTS Playlist (
  playlistId INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  playlistImage TEXT,
  ownerId INTEGER,
  ownerName TEXT,
  totalMaps INTEGER,
  createdAt TEXT,
  songsChangedAt TEXT,
  downloadURL TEXT
);

-- PlaylistMap 表：歌单与谱面关联
CREATE TABLE IF NOT EXISTS PlaylistMap (
  playlistId INTEGER NOT NULL,
  mapKey VARCHAR(16) NOT NULL,
  sortOrder FLOAT NOT NULL,
  PRIMARY KEY (playlistId, mapKey),
  FOREIGN KEY (playlistId) REFERENCES Playlist(playlistId) ON DELETE CASCADE,
  FOREIGN KEY (mapKey) REFERENCES Map(key) ON DELETE CASCADE
);

-- 创建索引以优化查询
CREATE INDEX IF NOT EXISTS idx_MapDiff_key ON MapDiff(key);
CREATE INDEX IF NOT EXISTS idx_MapDiff_hash ON MapDiff(hash);
CREATE INDEX IF NOT EXISTS idx_PlayerScore_playerId ON PlayerScore(playerId);
CREATE INDEX IF NOT EXISTS idx_PlayerScore_hash ON PlayerScore(hash);
CREATE INDEX IF NOT EXISTS idx_PlaylistMap_playlistId ON PlaylistMap(playlistId);
`;

let db: Database | null = null;

// 初始化数据库连接并创建表
export async function initDatabase(): Promise<Database> {
  if (db) return db;

  db = await Database.load(DB_PATH);
  await db.execute(INIT_SQL);
  return db;
}

// 获取数据库实例
export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// 关闭数据库连接
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}