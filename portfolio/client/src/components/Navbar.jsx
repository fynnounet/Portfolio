import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <NavLink to="/" className="logo" end>
        HAIZEA<span>.</span>EXE
      </NavLink>

      <div className="nav-links">
        <NavLink
          to="/projets"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Projets
        </NavLink>
        <NavLink
          to="/informations"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Informations
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Contact
        </NavLink>

        {!user && (
          <NavLink
            to="/connexion"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Connexion
          </NavLink>
        )}
        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Admin
          </NavLink>
        )}
        {user && (
          <button type="button" className="nav-logout" onClick={logout}>
            Déconnexion
          </button>
        )}
      </div>

      <div className="text-[11px] bg-[#1d9e75]/10 text-[#5dcaa5] py-1 px-3 rounded-full border border-[#1d9e75] tracking-[0.04em]">
        Disponible
      </div>
    </nav>
  );
}
