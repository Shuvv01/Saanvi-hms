import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ role, children }) {
  return (
    <div className="dashboard-shell">
      <Navbar role={role} />

      <div className="dashboard-body">
        <Sidebar role={role} />

        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
