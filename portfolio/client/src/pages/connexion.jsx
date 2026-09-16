import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, API_URL } from "../context/AuthContext.jsx";

export default function Connexion() {
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
      const res = await fetch(`${API_URL}/api/connexion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      // Erreur provenant du serveur
      if (!res.ok) {
        setErreur(data.message || "Erreur lors de la connexion.");
        return;
      }

      // Connexion réussie
      setUser(data.user);

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      setErreur("Impossible de contacter le serveur.");
    } finally {
      setChargement(false);
    }
  }

  return (
    <div
      style={{
        padding: "40px 32px",
      }}
    >
      <h1
        style={{
          marginBottom: 20,
        }}
      >
        Connexion
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 320,
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {erreur && (
          <div
            style={{
              color: "#f0997b",
              fontSize: 13,
            }}
          >
            {erreur}
          </div>
        )}

        <button className="btn-main" type="submit" disabled={chargement}>
          {chargement ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
