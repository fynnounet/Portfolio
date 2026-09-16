import { useEffect, useState } from "react";
import { API_URL } from "../../context/AuthContext.jsx";

export default function AdminProfil() {
  const [form, setForm] = useState({ prenom: "", nom: "", presentation: "" });
  const [statut, setStatut] = useState("chargement");
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    async function fetchProfil() {
      try {
        const res = await fetch(`${API_URL}/api/profil`, { credentials: "include" });
        if (!res.ok) throw new Error("Réponse serveur invalide.");
        const data = await res.json();
        setForm({
          prenom: data.profil.prenom || "",
          nom: data.profil.nom || "",
          presentation: data.profil.presentation || "",
        });
        setStatut("ok");
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
        setStatut("erreur");
      }
    }
    fetchProfil();
  }, []);

  async function soumettre(e) {
    e.preventDefault();
    setErreur("");
    setMessage("");
    setEnvoi(true);

    try {
      const res = await fetch(`${API_URL}/api/profil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(data.message || "Erreur lors de l'enregistrement.");
        return;
      }

      setMessage("Informations mises à jour.");
    } catch (err) {
      console.error(err);
      setErreur("Impossible de contacter le serveur.");
    } finally {
      setEnvoi(false);
    }
  }

  if (statut === "chargement") return <p className="admin-info">Chargement...</p>;
  if (statut === "erreur") return <p className="admin-info">Impossible de charger le profil.</p>;

  return (
    <form className="admin-form" onSubmit={soumettre} style={{ maxWidth: 480 }}>
      <h3>Informations personnelles</h3>

      <div className="admin-form-row">
        <input
          type="text"
          placeholder="Prénom"
          value={form.prenom}
          onChange={(e) => setForm({ ...form, prenom: e.target.value })}
        />
        <input
          type="text"
          placeholder="Nom"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
        />
      </div>

      <textarea
        placeholder="Présentation"
        rows={6}
        value={form.presentation}
        onChange={(e) => setForm({ ...form, presentation: e.target.value })}
      />

      {message && <div className="form-success">{message}</div>}
      {erreur && <div className="admin-erreur">{erreur}</div>}

      <div className="admin-actions">
        <button className="btn-main" type="submit" disabled={envoi}>
          {envoi ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}