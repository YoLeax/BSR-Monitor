import { useState, useEffect, useCallback } from 'react';
import {
  getAllPlayers,
  addPlayer,
  deletePlayer,
  batchAddScores,
  getScoreCount,
  type PlayerWithScoreCount,
} from '../../db';
import { getPlayerInfo, getPlayerScores } from '../../api/beatleader';
import type { BLCompactScoreResponse } from '../../api/types';
import './Players.css';

interface FetchProgress {
  playerId: string;
  playerName: string;
  fetched: number;
  total: number;
}

function Players() {
  const [players, setPlayers] = useState<PlayerWithScoreCount[]>([]);
  const [playerIdInput, setPlayerIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingScores, setFetchingScores] = useState<FetchProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 加载玩家列表
  const loadPlayers = useCallback(async () => {
    try {
      const list = await getAllPlayers();
      setPlayers(list);
    } catch (err) {
      console.error('加载玩家列表失败:', err);
    }
  }, []);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  // 添加玩家
  const handleAddPlayer = async () => {
    const id = playerIdInput.trim();
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const playerInfo = await getPlayerInfo(id);
      await addPlayer({
        id: playerInfo.id,
        name: playerInfo.name,
        avatarURL: playerInfo.avatar,
        liveURL: null,
        alias: null,
      });
      setPlayerIdInput('');
      await loadPlayers();
    } catch (err) {
      console.error('添加玩家失败:', err);
      setError(`添加失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 拉取玩家成绩（全量）
  const handleFetchScores = async (player: PlayerWithScoreCount) => {
    setFetchingScores({ playerId: player.id, playerName: player.name, fetched: 0, total: 0 });
    setError(null);

    try {
      let fetched = 0;
      let keepFetching = true;

      while (keepFetching) {
        const response = await getPlayerScores(player.id, 100);
        const scores: BLCompactScoreResponse[] = response.data;

        if (scores.length === 0) break;

        // 批量插入成绩
        const insertData = scores.map((s) => ({
          scoreId: s.score.id ?? s.score.originalId,
          leaderboardId: s.leaderboard.id,
          hash: s.leaderboard.songHash,
          mode: s.leaderboard.modeName,
          difficulty: s.leaderboard.difficulty,
          accuracy: s.score.accuracy,
          epochTime: s.score.epochTime,
        }));

        const inserted = await batchAddScores(player.id, insertData);
        fetched += inserted;

        setFetchingScores((prev) =>
          prev ? { ...prev, fetched, total: response.metadata.total } : null
        );

        // 如果返回数量少于请求数量，说明已获取全部
        if (scores.length < 100) {
          keepFetching = false;
        }
      }

      // 更新成绩数量显示
      const newCount = await getScoreCount(player.id);
      setPlayers((prev) =>
        prev.map((p) => (p.id === player.id ? { ...p, scoreCount: newCount } : p))
      );
    } catch (err) {
      console.error('拉取成绩失败:', err);
      setError(`拉取成绩失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setFetchingScores(null);
    }
  };

  // 删除玩家
  const handleDeletePlayer = async (player: PlayerWithScoreCount) => {
    if (!window.confirm(`确定删除玩家 "${player.name}"？其所有成绩也将被删除。`)) {
      return;
    }

    try {
      await deletePlayer(player.id);
      await loadPlayers();
    } catch (err) {
      console.error('删除玩家失败:', err);
      setError(`删除失败: ${err instanceof Error ? err.message : '未知错误'}`);
    }
  };

  return (
    <div className="players-page">
      <h2 className="page-title">玩家管理</h2>

      {error && <div className="error-message">{error}</div>}

      {fetchingScores && (
        <div className="fetch-progress">
          正在拉取 {fetchingScores.playerName} 的成绩：已获取 {fetchingScores.fetched} 条
          {fetchingScores.total > 0 && ` / 共 ${fetchingScores.total} 条`}
        </div>
      )}

      <section className="page-section">
        <h3>添加玩家</h3>
        <div className="add-form">
          <input
            type="text"
            placeholder="输入玩家 ID"
            className="input-player"
            value={playerIdInput}
            onChange={(e) => setPlayerIdInput(e.target.value)}
            disabled={loading || fetchingScores !== null}
          />
          <button
            onClick={handleAddPlayer}
            disabled={loading || !playerIdInput.trim() || fetchingScores !== null}
          >
            {loading ? '添加中...' : '添加'}
          </button>
        </div>
      </section>

      <section className="page-section">
        <h3>玩家列表</h3>
        {players.length === 0 ? (
          <div className="list-placeholder">
            <p className="empty-message">暂无玩家数据</p>
          </div>
        ) : (
          <div className="player-list">
            {players.map((player) => (
              <div key={player.id} className="player-item">
                <div className="player-info">
                  {player.avatarURL && (
                    <img src={player.avatarURL} alt={player.name} className="player-avatar" />
                  )}
                  <div className="player-details">
                    <span className="player-name">{player.name}</span>
                    <span className="player-id">ID: {player.id}</span>
                    <span className="player-scores">成绩: {player.scoreCount} 条</span>
                  </div>
                </div>
                <div className="player-actions">
                  <button
                    className="btn-fetch"
                    onClick={() => handleFetchScores(player)}
                    disabled={fetchingScores !== null}
                  >
                    拉取成绩
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeletePlayer(player)}
                    disabled={fetchingScores !== null}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Players;