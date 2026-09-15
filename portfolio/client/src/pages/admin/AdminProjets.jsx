import { useEffect, useState } from "react";
import { API_URL } from "../../context/AuthContext.jsx";

const FORM_VIDE = {
  titre: "",
  description: "",
  lien: "",
  statut: "En cours",
  ordre_affichage: 0,
  technologies: "",
};

export default function AdminProjets() {
  const [projets, setProjets] = useState([]);
  const [statut, setStatut] = useState("chargement"); // chargement | ok | erreur

  const [formOuvert, setFormOuvert] = useState(false);
  const [idEnEdition, setIdEnEdition] = useState(null);
  const [form, setForm] = useState(FORM_VIDE);
  const [erreurForm, setErreurForm] = useState("");
  const [envoi, setEnvoi] = useState(false);

  async function fetchProjets() {
    try {
      const res = await fetch(`${API_URL}/api/projets`);
      if (!res.ok) throw new Error("Réponse serveur invalide.");
      const data = await res.json();
      setProjets(data.projets);
      setStatut("ok");
    } catch (err) {
      console.error("Erreur lors du chargement des projets :", err);
      setStatut("erreur");
    }
  }

  useEffect(() => {
    fetchProjets();
  }, []);

  function ouvrirCreation() {
    setIdEnEdition(null);
    setForm(FORM_VIDE);
    setErreurForm("");
    setFormOuvert(true);
  }

  function ouvrirEdition(projet) {
    setIdEnEdition(projet._id);
    setForm({
      titre: projet.titre,
      description: projet.description || "",
      lien: projet.lien || "",
      statut: projet.statut || "En cours",
      ordre_affichage: projet.ordre_affichage ?? 0,
      technologies: (projet.technologies || []).join(", "),
    });
    setErreurForm("");
    setFormOuvert(true);
  }

  function fermerForm() {
    setFormOuvert(false);
    setIdEnEdition(null);
  }

  async function soumettre(e) {
    e.preventDefault();
    setErreurForm("");
    setEnvoi(true);

    const payload = {
      titre: form.titre,
      description: form.description,
      lien: form.lien,
      statut: form.statut,
      ordre_affichage: Number(form.ordre_affichage) || 0,
      technologies: form.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = idEnEdition
        ? `${API_URL}/api/projets/${idEnEdition}`
        : `${API_URL}/api/projets`;
      const method = idEnEdition ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErreurForm(data.message || "Erreur lors de l'enregistrement.");
        return;
      }

      await fetchProjets();
      fermerForm();
    } catch (err) {
      console.error(err);
      setErreurForm("Impossible de contacter le serveur.");
    } finally {
      setEnvoi(false);
    }
  }

  async function supprimer(id) {
    if (!window.confirm("Supprimer ce projet définitivement ?")) return;

    try {
      const res = await fetch(`${API_URL}/api/projets/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Impossible de supprimer le projet.");
      setProjets((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer ce projet.");
    }
  }

  return (
    <div>
      {!formOuvert && (
        <button className="btn-main" onClick={ouvrirCreation} style={{ marginBottom: 16 }}>
          + Nouveau projet
        </button>
      )}

      {formOuvert && (
        <form className="admin-form" onSubmit={soumettre}>
          <h3>{idEnEdition ? "Modifier le projet" : "Nouveau projet"}</h3>

          <input
            type="text"
            placeholder="Titre"
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Lien (URL du projet, optionnel)"
            value={form.lien}
            onChange={(e) => setForm({ ...form, lien: e.target.value })}
          />
          <div className="admin-form-row">
            <select
              value={form.statut}
              onChange={(e) => setForm({ ...form, statut: e.target.value })}
            >
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
            <input
              type="number"
              placeholder="Ordre d'affichage"
              value={form.ordre_affichage}
              onChange={(e) => setForm({ ...form, ordre_affichage: e.target.value })}
            />
          </div>
          <input
            type="text"
            placeholder="Technologies séparées par des virgules (ex: React, Node.js)"
            value={form.technologies}
            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
          />

          {erreurForm && <div className="admin-erreur">{erreurForm}</div>}

          <div className="admin-actions">
            <button className="btn-main" type="submit" disabled={envoi}>
              {envoi ? "Enregistrement..." : idEnEdition ? "Enregistrer" : "Créer"}
            </button>
            <button className="btn-outline" type="button" onClick={fermerForm}>
              Annuler
            </button>
          </div>
        </form>
      )}

      {statut === "chargement" && <p className="admin-info">Chargement des projets...</p>}
      {statut === "erreur" && <p className="admin-info">Impossible de charger les projets.</p>}

      {statut === "ok" && (
        <div className="admin-list">
          {projets.length === 0 && <p className="admin-info">Aucun projet pour le moment.</p>}

          {projets.map((p) => (
            <div className="admin-card" key={p._id}>
              <div className="admin-card-top">
                <strong>{p.titre}</strong>
                <span className="admin-muted">{p.statut}</span>
              </div>
              <p className="admin-contenu">{p.description}</p>
              <div className="work-stack">
                {(p.technologies || []).map((t) => (
                  <span className="char-tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="admin-actions">
                <button className="btn-outline" onClick={() => ouvrirEdition(p)}>
                  Modifier
                </button>
                <button className="btn-outline admin-btn-danger" onClick={() => supprimer(p._id)}>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
