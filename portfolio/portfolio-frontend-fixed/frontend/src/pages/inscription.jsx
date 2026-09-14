import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, API_URL } from "../context/AuthContext.jsx";

export default function Inscription() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      const res = await fetch(`${API_URL}/api/inscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nom, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(data.message || "Erreur lors de l'inscription.");
        return;
      }

      setUser(data.user);
      navigate("/");
    } catch {
      setErreur("Impossible de contacter le serveur.");
    } finally {
      setChargement(false);
    }
  }

  return (
    <div style={{ padding: "40px 32px" }}>
      <h1 style={{ marginBottom: 20 }}>Inscription</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320 }}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe (min. 6 caractères)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        {erreur && <div style={{ color: "#f0997b", fontSize: 13 }}>{erreur}</div>}

        <button className="btn-main" type="submit" disabled={chargement}>
          {chargement ? "Inscription..." : "S'inscrire"}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: 13 }}>
        Déjà un compte ? <Link to="/connexion">Se connecter</Link>
      </p>
    </div>
  );
}
