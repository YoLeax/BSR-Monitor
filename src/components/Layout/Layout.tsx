import { ReactNode } from "react";
import Sidebar, { PageType } from "../Sidebar";
import StatusBox, { DbStatus } from "../StatusBox";
import "./Layout.css";

interface LayoutProps {
  children: ReactNode;
  dbStatus: DbStatus;
  dbError?: string | null;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

function Layout({ children, dbStatus, dbError, currentPage, onPageChange }: LayoutProps) {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1 className="layout-title">BSR Monitor</h1>
        <StatusBox status={dbStatus} error={dbError} />
      </header>
      <div className="layout-body">
        <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;