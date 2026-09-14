import "../App.css";
import "./css/projets.css";

import { Link } from "react-router-dom";

const works = [
  {
    num: "01",
    arc: "Arc 2 · Épisode 01",
    tagClass: "panel-tag-p",
    title: "Blog Genshin Impact",
    desc: "Blog de fan sur le jeu Genshin Impact, réalisé comme projet scolaire : articles, fiches personnages et mise en page thématique.",
    stack: ["React", "CSS", "JavaScript"],
    status: "Terminé",
    statusClass: "status-done",
    link: "https://github.com/fynnounet/BlogGenshin",
  },
  {
    num: "02",
    arc: "Arc 2 · Épisode 02",
    tagClass: "panel-tag-t",
    title: "Projet site IA",
    desc: "Site web intégrant une IA en interne, capable de répondre à des questions et d'effectuer des calculs en temps réel.",
    stack: ["Node.js", "Express", "API"],
    status: "En cours",
    statusClass: "status-progress",
    link: "#",
  },
  {
    num: "03",
    arc: "Arc 2 · Épisode 03",
    tagClass: "panel-tag-c",
    title: "Portfolio HAIZEA.EXE",
    desc: "Ce site : un portfolio pensé comme une série de chapitres, entre identité graphique moderne et structure de développeuse full-stack.",
    stack: ["React", "React Router", "Vite"],
    status: "En cours",
    statusClass: "status-progress",
    link: "#",
  },
];

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

function WorkCard({ work }) {
  return (
    <div className="work-card">
      <div className="screentone"></div>
      <div className="work-card-top">
        <span className={`panel-tag ${work.tagClass}`}>{work.arc}</span>
        <span className={`status-badge ${work.statusClass}`}>
          {work.status}
        </span>
      </div>
      <div className="panel-title">{work.title}</div>
      <p className="panel-desc">{work.desc}</p>
      <div className="work-stack">
        {work.stack.map((s) => (
          <span className="char-tag" key={s}>
            {s}
          </span>
        ))}
      </div>
      <a className="work-link" href={work.link}>
        Voir le projet →
      </a>
      <div className="panel-num">{work.num}</div>
    </div>
  );
}

function Works() {
  return (
    <div className="works-grid">
      {works.map((w) => (
        <WorkCard work={w} key={w.num} />
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
  return (
    <>
      <div className="chapter-label">Chapitre 02 — Les œuvres</div>
      <ProjetsHeader />
      <div className="divider-label">
        <div className="divider-line"></div>
        <div className="divider-text">Tous les épisodes</div>
        <div className="divider-line"></div>
      </div>
      <Works />
      <Footer />
    </>
  );
}
