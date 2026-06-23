import { useNavigate } from "react-router-dom";

function Navbar({ role }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar dashboard-navbar px-3 px-md-4">
      <span className="navbar-brand">
        <i className="bi bi-hospital" aria-hidden="true" />
        Saanvi HMS
        <small>{role}</small>
      </span>

      <button
        className="btn btn-light btn-sm"
        onClick={logout}
      >
        <i className="bi bi-box-arrow-right" aria-hidden="true" />
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
