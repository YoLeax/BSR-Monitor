import "./Playlists.css";

function Playlists() {
  return (
    <div className="playlists-page">
      <h2 className="page-title">歌单管理</h2>

      <section className="page-section">
        <h3>添加歌单</h3>
        <div className="add-form">
          <input type="text" placeholder="输入歌单 URL 或 ID" className="input-playlist" />
          <button>添加</button>
        </div>
      </section>

      <section className="page-section">
        <h3>歌单列表</h3>
        <div className="list-placeholder">
          <p className="empty-message">暂无歌单数据</p>
        </div>
      </section>
    </div>
  );
}

export default Playlists;