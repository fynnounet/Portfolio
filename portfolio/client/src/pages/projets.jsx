import "../App.css";
import "./css/projets.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../context/AuthContext.jsx";

const TAG_CLASSES = ["panel-tag-p", "panel-tag-t", "panel-tag-c"];

function ProjetsHeader() {
  return (
    <div className="projets-header">
      <div className="panel-number">[ 02 ]</div>
      <div className="hero-eyebrow">Arc 2 · Les œuvres</div>
      <h1 className="hero-title">
        <span>Chapitre complet</span>
        <span className="accent">des projets</span>
      </h1>
      <p className="hero-sub">
        Retour sur les différents épisodes réalisés jusqu'ici : projets
        scolaires, expérimentations personnelles et travaux en cours.
      </p>
      <Link to="/">
        <button className="btn-outline">← Retour à l'accueil</button>
      </Link>
    </div>
  );
}

function WorkCard({ work, index }) {
  const tagClass = TAG_CLASSES[index % TAG_CLASSES.length];
  const statusClass = work.statut === "Terminé" ? "status-done" : "status-progress";
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="work-card">
      <div className="screentone"></div>
      <div className="work-card-top">
        <span className={`panel-tag ${tagClass}`}>{`Arc 2 · Épisode ${num}`}</span>
        <span className={`status-badge ${statusClass}`}>{work.statut}</span>
      </div>
      <div className="panel-title">{work.titre}</div>
      <p className="panel-desc">{work.description}</p>
      <div className="work-stack">
        {work.technologies.map((nom) => (
          <span className="char-tag" key={nom}>
            {nom}
          </span>
        ))}
      </div>
      {work.lien && (
        <a className="work-link" href={work.lien} target="_blank" rel="noreferrer">
          Voir le projet →
        </a>
      )}
      <div className="panel-num">{num}</div>
    </div>
  );
}

function Works({ projets }) {
  return (
    <div className="works-grid">
      {projets.map((p, index) => (
        <WorkCard work={p} index={index} key={p._id} />
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-mono">
        © 2026 · haizea.exe · arc 02 — les œuvres
      </div>
      <div className="footer-links">
        <a href="https://github.com/fynnounet" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/fynnounet" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </footer>
  );
}

export default function Projets() {
  const [projets, setProjets] = useState([]);
  const [statut, setStatut] = useState("chargement"); // chargement | ok | erreur

  useEffect(() => {
    let cancelled = false;

    async function fetchProjets() {
      try {
        const res = await fetch(`${API_URL}/api/projets`);
        if (!res.ok) throw new Error("Réponse serveur invalide.");
        const data = await res.json();
        if (!cancelled) {
          setProjets(data.projets);
          setStatut("ok");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des projets :", err);
        if (!cancelled) setStatut("erreur");
      }
    }

    fetchProjets();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="chapter-label">Chapitre 02 — Les œuvres</div>
      <ProjetsHeader />
      <div className="divider-label">
        <div className="divider-line"></div>
        <div className="divider-text">Tous les épisodes</div>
        <div className="divider-line"></div>
      </div>

      {statut === "chargement" && (
        <p className="panel-desc" style={{ padding: "20px 32px" }}>
          Chargement des projets...
        </p>
      )}
      {statut === "erreur" && (
        <p className="panel-desc" style={{ padding: "20px 32px" }}>
          Impossible de charger les projets pour le moment.
        </p>
      )}
      {statut === "ok" && <Works projets={projets} />}

      <Footer />
    </>
  );
}
