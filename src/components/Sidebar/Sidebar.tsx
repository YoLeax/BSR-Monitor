import "./Sidebar.css";

export type PageType = "players" | "playlists" | "mapSearch";

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navItems: { key: PageType; label: string }[] = [
  { key: "players", label: "玩家管理" },
  { key: "playlists", label: "歌单管理" },
  { key: "mapSearch", label: "谱面查询" },
];

function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <nav className="sidebar">
      <ul className="sidebar-list">
        {navItems.map((item) => (
          <li key={item.key} className="sidebar-item">
            <button
              className={`sidebar-button ${currentPage === item.key ? "active" : ""}`}
              onClick={() => onPageChange(item.key)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;