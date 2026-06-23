import { Link, useLocation } from "react-router-dom";

const menus = {
  Admin: [
    { to: "/admin-dashboard", label: "Dashboard", icon: "bi-grid-1x2" },
    {
      to: "/admin-dashboard?tab=doctors",
      label: "Doctors",
      icon: "bi-heart-pulse",
    },
    { to: "/admin-dashboard?tab=users", label: "Users", icon: "bi-people" },
    {
      to: "/admin-dashboard?tab=patients",
      label: "Patients",
      icon: "bi-person-vcard",
    },
    {
      to: "/admin-dashboard?tab=appointments",
      label: "Appointments",
      icon: "bi-calendar2-week",
    },
  ],
  Doctor: [
    { to: "/doctor-dashboard", label: "Dashboard", icon: "bi-grid-1x2" },
    { to: "/doctor-dashboard", label: "Appointments", icon: "bi-calendar-check" },
    { to: "/doctor-dashboard", label: "Patients", icon: "bi-people" },
    { to: "/doctor-dashboard", label: "Reports", icon: "bi-clipboard-data" },
  ],
  Patient: [
    { to: "/patient-dashboard", label: "Dashboard", icon: "bi-grid-1x2" },
    { to: "/patient-dashboard", label: "Appointments", icon: "bi-calendar2-check" },
    { to: "/patient-dashboard", label: "Records", icon: "bi-folder2-open" },
    { to: "/patient-dashboard", label: "Prescriptions", icon: "bi-capsule" },
  ],
};

function Sidebar({ role }) {
  const items = menus[role] || menus.Patient;
  const location = useLocation();
  const currentPath = `${location.pathname}${location.search}`;

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-title">
        <span>Workspace</span>
        <strong>{role}</strong>
      </div>

      <nav className="sidebar-nav" aria-label={`${role} navigation`}>
        {items.map((item) => (
          <Link
            key={`${item.label}-${item.to}`}
            className={currentPath === item.to ? "active" : ""}
            to={item.to}
          >
            <i className={`bi ${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
