import { useAuth } from "../context/AuthContext.jsx";

export default function Admin() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "40px 32px" }}>
      <h1>Administration</h1>

      <p>
        Bienvenue dans ton espace administrateur
        {user?.nom_utilisateur ? `, ${user.nom_utilisateur}` : ""}.
      </p>

      <button className="btn-outline" onClick={logout} style={{ marginTop: 16 }}>
        Se déconnecter
      </button>
    </div>
  );
}
