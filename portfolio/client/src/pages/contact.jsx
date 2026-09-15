import { useState } from "react";
import "../App.css";
import "./css/contact.css";
import { API_URL } from "../context/AuthContext.jsx";

export default function Contact() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [contenu, setContenu] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur("");
    setChargement(true);

    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nom, email, sujet, contenu }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(data.message || "Erreur lors de l'envoi du message.");
        return;
      }

      setEnvoye(true);
      setNom("");
      setEmail("");
      setSujet("");
      setContenu("");
    } catch (err) {
      console.error(err);
      setErreur("Impossible de contacter le serveur.");
    } finally {
      setChargement(false);
    }
  }

  return (
    <main style={{ padding: "40px 32px" }}>
      <h1 style={{ marginBottom: 8 }}>Contact</h1>
      <p className="hero-sub" style={{ marginBottom: 20 }}>
        Une question, une proposition de projet ? Écris-moi un message.
      </p>

      {envoye && (
        <div className="form-success" style={{ marginBottom: 16, maxWidth: 400 }}>
          Message envoyé, merci ! Je te répondrai rapidement.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}
      >
        <input
          type="text"
          placeholder="Nom"
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
          type="text"
          placeholder="Sujet (optionnel)"
          value={sujet}
          onChange={(e) => setSujet(e.target.value)}
        />
        <textarea
          placeholder="Ton message"
          rows={5}
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          required
        />

        {erreur && <div style={{ color: "#f0997b", fontSize: 13 }}>{erreur}</div>}

        <button className="btn-main" type="submit" disabled={chargement}>
          {chargement ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </main>
  );
}
