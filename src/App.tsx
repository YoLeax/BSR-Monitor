import { useState, useEffect } from "react";
import { initDatabase } from "./db";
import "./App.css";

function App() {
  const [dbStatus, setDbStatus] = useState<"loading" | "ready" | "error">("loading");
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setDbStatus("ready"))
      .catch((err) => {
        setDbStatus("error");
        setDbError(err.message || String(err));
      });
  }, []);

  return (
    <main className="container">
      <h1>BSR Monitor</h1>

      <div className="row">
        <div className="status-box">
          <h2>数据库状态</h2>
          {dbStatus === "loading" && <p>正在初始化...</p>}
          {dbStatus === "ready" && <p style={{ color: "green" }}>数据库已就绪</p>}
          {dbStatus === "error" && <p style={{ color: "red" }}>错误: {dbError}</p>}
        </div>
      </div>

      <p>BeatSaber 玩家成绩监控应用</p>
    </main>
  );
}

export default App;