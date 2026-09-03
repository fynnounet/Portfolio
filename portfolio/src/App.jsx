import { useState } from "react";
import heroImg from "./assets/hero.png";
import "./App.css";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Page1 from "./pages/projets.jsx";
import Page2 from "./pages/informations.jsx";
import Page3 from "./pages/contact.jsx";

const projects = [
  {
    tag: "Projet #001",
    tagClass: "panel-tag-p",
    title: "Blog Genshin Impact",
    desc: "Blog de fan sur le jeu Genshin Impact.Fait comme projet scolaire.",
    num: "01",
  },
  {
    tag: "Projet #002",
    tagClass: "panel-tag-t",
    title: "Projet site IA",
    desc: "Site web avec une IA en interne, qui répond et fait des calculs en temps réel",
    num: "02",
  },
];

const skills = [
  { name: "Frontend", value: 90, color: "#7F77DD" },
  { name: "Design", value: 80, color: "#534AB7" },
  { name: "Backend", value: 65, color: "#1D9E75" },
  { name: "DevOps", value: 35, color: "#D85A30" },
];

function Nav() {
  return (
    <nav className="nav">
      <div className="logo">
        HAIZEA<span>.</span>EXE
      </div>
      <div className="nav-links">
        <Link to="/projets">Projets</Link>
        <Link to="/informations">Informations</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/connexion">Connexion</Link>
      </div>
      <div className="status-pill">Disponible</div>
    </nav>
  );
}

function SpeedLines() {
  return (
    <div className="speed-lines">
      <svg viewBox="0 0 480 260" preserveAspectRatio="none">
        <line
          x1="480"
          y1="130"
          x2="340"
          y2="20"
          stroke="rgba(127,119,221,0.04)"
          strokeWidth="1"
        />
        <line
          x1="480"
          y1="130"
          x2="320"
          y2="10"
          stroke="rgba(127,119,221,0.03)"
          strokeWidth="1"
        />
        <line
          x1="480"
          y1="130"
          x2="300"
          y2="0"
          stroke="rgba(127,119,221,0.025)"
          strokeWidth="1"
        />
        <line
          x1="480"
          y1="130"
          x2="360"
          y2="0"
          stroke="rgba(127,119,221,0.035)"
          strokeWidth="1"
        />
        <line
          x1="480"
          y1="130"
          x2="260"
          y2="5"
          stroke="rgba(127,119,221,0.02)"
          strokeWidth="1"
        />
        <line
          x1="480"
          y1="130"
          x2="380"
          y2="260"
          stroke="rgba(127,119,221,0.04)"
          strokeWidth="1"
        />
        <line
          x1="480"
          y1="130"
          x2="340"
          y2="260"
          stroke="rgba(127,119,221,0.03)"
          strokeWidth="1"
        />
        <line
          x1="480"
          y1="130"
          x2="290"
          y2="250"
          stroke="rgba(127,119,221,0.025)"
          strokeWidth="1"
        />
        <line
          x1="480"
          y1="130"
          x2="250"
          y2="240"
          stroke="rgba(127,119,221,0.02)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <div className="hero-panel">
      <div className="hero-left">
        <SpeedLines />
        <div className="panel-number">[ 01 ]</div>
        <div className="hero-eyebrow">Arc 1 · Développeuse full-stack</div>
        <span className="sfx">CODE://</span>
        <h1 className="hero-title">
          <span>Je construis</span>
          <span className="accent">des interfaces</span>
          <span className="stroke-text">qui durent.</span>
        </h1>
        <p className="hero-sub">
          Passionnée de web et de jeux vidéos. Chaque projet est un nouveau défi
          que je suis prête à relever.
        </p>
        <div className="hero-btns">
          <Link to="/projets">
            <button className="btn-main">Voir les projets</button>
          </Link>
          <Link to="/informations">
            <button className="btn-main">Informations</button>
          </Link>
          <Link to="/contact">
            <button className="btn-outline">Me contacter →</button>
          </Link>
        </div>
      </div>

      <div className="hero-right">
        <div className="stat-block">
          <div className="stat-num">3</div>
          <div className="stat-label">projets disponibles</div>
        </div>
        <div className="stat-block">
          <div className="stat-num">7</div>
          <div className="stat-label">mois d'expérience</div>
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="divider-label">
      <div className="divider-line"></div>
      <div className="divider-text">Arc 2 — Les œuvres</div>
      <div className="divider-line"></div>
    </div>
  );
}

function Projects() {
  return (
    <div className="panels-row" id="projets">
      {projects.map((p) => (
        <div className="panel" key={p.num}>
          <div className="screentone"></div>
          <div className={`panel-tag ${p.tagClass}`}>{p.tag}</div>
          <div className="panel-title">{p.title}</div>
          <div className="panel-desc">{p.desc}</div>
          <div className="panel-num">{p.num}</div>
        </div>
      ))}
    </div>
  );
}

function ThoughtBubble() {
  return (
    <div style={{ padding: "18px 0 14px" }}>
      <div className="thought-bubble">
        <div className="thought-text">
          « Je veux juste que le monde sache que j'étais là, que j'avais de
          l'importance. » - V, Cyberpunk 2077
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="about-panel">
      <div className="char-portrait">
        <img src="https://img1.picmix.com/output/stamp/normal/4/4/5/4/604544_3dbbc.gif" alt="Haizea MAREMBERT" height="50px" />
      </div>
      <div>
        <div className="char-name">Haizea MAREMBERT</div>
        <div className="char-role">Protagoniste · Full-stack Dev</div>
        <div className="char-bio">
          Développeuse basée à Pau en Nouvelle-Aquitaine.
        </div>
        <div className="char-tags">
          {["React", "Node.js", "Tailwind", "SQL", "JavaScript"].map((tag) => (
            <span className="char-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Skills() {
  return (
    <div className="skills-bar" id="stack">
      <div className="skills-label">Informations sur le personnage</div>
      {skills.map((s) => (
        <div className="skill-row" key={s.name}>
          <div className="skill-name">{s.name}</div>
          <div className="skill-track">
            <div
              className="skill-fill"
              style={{ width: `${s.value}%`, background: s.color }}
            ></div>
          </div>
          <div className="skill-val">{s.value}</div>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-mono">
        © 2026 · haizea.exe · fin du chapitre 01
      </div>
      <div className="footer-links">
        <Link to="https://github.com/fynnounet">GitHub</Link>
        <Link to="https://linkedin.com/in/fynnounet">LinkedIn</Link>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="port">
      <Nav />
      <div className="chapter-label">
        Chapitre 01 — Présentation du personnage
      </div>
      <Hero />
      <Divider />
      <Projects />
      <ThoughtBubble />
      <About />
      <Skills />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projets" element={<Page1 />} />
        <Route path="/informations" element={<Page2 />} />
        <Route path="/contact" element={<Page3 />} />
      </Routes>
    </BrowserRouter>
  );
}
