import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 min-h-screen flex flex-col">
        <TopHeader />
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
