import { useState, useEffect } from "react";
import { initDatabase } from "./db";
import Layout, { PageType } from "./components/Layout";
import { DbStatus } from "./components/StatusBox";
import Players from "./pages/Players";
import Playlists from "./pages/Playlists";
import MapSearch from "./pages/MapSearch";
import "./App.css";

function App() {
  const [dbStatus, setDbStatus] = useState<DbStatus>("loading");
  const [dbError, setDbError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>("players");

  useEffect(() => {
    initDatabase()
      .then(() => setDbStatus("ready"))
      .catch((err) => {
        setDbStatus("error");
        setDbError(err.message || String(err));
      });
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "players":
        return <Players />;
      case "playlists":
        return <Playlists />;
      case "mapSearch":
        return <MapSearch />;
      default:
        return null;
    }
  };

  return (
    <Layout
      dbStatus={dbStatus}
      dbError={dbError}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;