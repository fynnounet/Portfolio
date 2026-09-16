import { useEffect, useState } from "react";
import "../App.css";
import "./css/informations.css";
import { API_URL } from "../context/AuthContext.jsx";

export default function Informations() {
  const [profil, setProfil] = useState(null);
  const [statut, setStatut] = useState("chargement"); // chargement | ok | erreur

  useEffect(() => {
    let cancelled = false;

    async function fetchProfil() {
      try {
        const res = await fetch(`${API_URL}/api/profil`);
        if (!res.ok) throw new Error("Réponse serveur invalide.");
        const data = await res.json();
        if (!cancelled) {
          setProfil(data.profil);
          setStatut("ok");
        }
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
        if (!cancelled) setStatut("erreur");
      }
    }

    fetchProfil();
    return () => {
      cancelled = true;
    };
  }, []);

  if (statut === "chargement") {
    return <main style={{ padding: "40px 32px" }}>Chargement...</main>;
  }
  if (statut === "erreur") {
    return <main style={{ padding: "40px 32px" }}>Impossible de charger les informations.</main>;
  }

  const nomComplet = [profil.prenom, profil.nom].filter(Boolean).join(" ");

  return (
    <main style={{ padding: "40px 32px" }}>
      <h1 style={{ marginBottom: 8 }}>{nomComplet || "Informations"}</h1>
      <p className="hero-sub" style={{ whiteSpace: "pre-wrap" }}>
        {profil.presentation || "Aucune présentation renseignée pour le moment."}
      </p>
    </main>
  );
}