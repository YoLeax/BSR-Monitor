import "./Players.css";

function Players() {
  return (
    <div className="players-page">
      <h2 className="page-title">玩家管理</h2>

      <section className="page-section">
        <h3>添加玩家</h3>
        <div className="add-form">
          <input type="text" placeholder="输入玩家 ID 或名称" className="input-player" />
          <button>添加</button>
        </div>
      </section>

      <section className="page-section">
        <h3>玩家列表</h3>
        <div className="list-placeholder">
          <p className="empty-message">暂无玩家数据</p>
        </div>
      </section>
    </div>
  );
}

export default Players;