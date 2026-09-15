import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AdminMessages from "./admin/AdminMessages.jsx";
import AdminProjets from "./admin/AdminProjets.jsx";
import "./css/admin.css";

export default function Admin() {
  const { user, logout } = useAuth();
  const [onglet, setOnglet] = useState("messages"); // messages | projets

  return (
    <div style={{ padding: "40px 32px" }}>
      <div className="admin-header">
        <div>
          <h1>Administration</h1>
          <p className="admin-muted">
            Bienvenue{user?.nom_utilisateur ? `, ${user.nom_utilisateur}` : ""}.
          </p>
        </div>
        <button className="btn-outline" onClick={logout}>
          Se déconnecter
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${onglet === "messages" ? "admin-tab-active" : ""}`}
          onClick={() => setOnglet("messages")}
        >
          Messages
        </button>
        <button
          className={`admin-tab ${onglet === "projets" ? "admin-tab-active" : ""}`}
          onClick={() => setOnglet("projets")}
        >
          Projets
        </button>
      </div>

      {onglet === "messages" ? <AdminMessages /> : <AdminProjets />}
    </div>
  );
}
