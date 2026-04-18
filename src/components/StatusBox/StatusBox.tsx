import "./StatusBox.css";

export type DbStatus = "loading" | "ready" | "error";

interface StatusBoxProps {
  status: DbStatus;
  error?: string | null;
}

function StatusBox({ status, error }: StatusBoxProps) {
  return (
    <div className="status-box">
      <span className="status-label">数据库:</span>
      {status === "loading" && <span className="status-text loading">连接中...</span>}
      {status === "ready" && <span className="status-text ready">就绪</span>}
      {status === "error" && (
        <span className="status-text error" title={error || "未知错误"}>
          错误
        </span>
      )}
    </div>
  );
}

export default StatusBox;