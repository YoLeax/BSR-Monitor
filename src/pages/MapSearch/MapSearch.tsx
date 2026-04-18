import "./MapSearch.css";

function MapSearch() {
  return (
    <div className="mapsearch-page">
      <h2 className="page-title">谱面查询</h2>

      <section className="page-section">
        <h3>搜索谱面</h3>
        <div className="search-form">
          <input type="text" placeholder="输入谱面 Key 或 Hash" className="input-map" />
          <button>查询</button>
        </div>
      </section>

      <section className="page-section">
        <h3>谱面信息</h3>
        <div className="result-placeholder">
          <p className="empty-message">输入 Key 或 Hash 进行查询</p>
        </div>
      </section>
    </div>
  );
}

export default MapSearch;