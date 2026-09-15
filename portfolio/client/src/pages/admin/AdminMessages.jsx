import { useEffect, useState } from "react";
import { API_URL } from "../../context/AuthContext.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [statut, setStatut] = useState("chargement"); // chargement | ok | erreur
  const [erreurAction, setErreurAction] = useState("");

  async function fetchMessages() {
    try {
      const res = await fetch(`${API_URL}/api/messages`, { credentials: "include" });
      if (!res.ok) throw new Error("Réponse serveur invalide.");
      const data = await res.json();
      setMessages(data.messages);
      setStatut("ok");
    } catch (err) {
      console.error("Erreur lors du chargement des messages :", err);
      setStatut("erreur");
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function toggleLu(message) {
    setErreurAction("");
    try {
      const res = await fetch(`${API_URL}/api/messages/${message._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ lu: !message.lu }),
      });
      if (!res.ok) throw new Error("Impossible de mettre à jour le message.");
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? { ...m, lu: !m.lu } : m))
      );
    } catch (err) {
      console.error(err);
      setErreurAction("Impossible de mettre à jour ce message.");
    }
  }

  async function supprimer(id) {
    if (!window.confirm("Supprimer ce message définitivement ?")) return;

    setErreurAction("");
    try {
      const res = await fetch(`${API_URL}/api/messages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Impossible de supprimer le message.");
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      setErreurAction("Impossible de supprimer ce message.");
    }
  }

  if (statut === "chargement") return <p className="admin-info">Chargement des messages...</p>;
  if (statut === "erreur") return <p className="admin-info">Impossible de charger les messages.</p>;
  if (messages.length === 0) return <p className="admin-info">Aucun message reçu pour le moment.</p>;

  return (
    <div className="admin-list">
      {erreurAction && <div className="admin-erreur">{erreurAction}</div>}

      {messages.map((m) => (
        <div className={`admin-card ${m.lu ? "" : "admin-card-non-lu"}`} key={m._id}>
          <div className="admin-card-top">
            <div>
              <strong>{m.nom}</strong> <span className="admin-muted">({m.email})</span>
            </div>
            <span className="admin-muted">{formatDate(m.date_envoi)}</span>
          </div>

          {m.sujet && <div className="admin-sujet">{m.sujet}</div>}
          <p className="admin-contenu">{m.contenu}</p>

          <div className="admin-actions">
            <button className="btn-outline" onClick={() => toggleLu(m)}>
              {m.lu ? "Marquer non lu" : "Marquer lu"}
            </button>
            <button className="btn-outline admin-btn-danger" onClick={() => supprimer(m._id)}>
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
