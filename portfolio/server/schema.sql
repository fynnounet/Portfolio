CREATE DATABASE IF NOT EXISTS portfolio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio;

CREATE TABLE IF NOT EXISTS utilisateurs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom_utilisateur VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('utilisateur', 'admin') NOT NULL DEFAULT 'utilisateur',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_utilisateurs_email (email)
);

CREATE TABLE IF NOT EXISTS projets (
  id_projet INT UNSIGNED NOT NULL AUTO_INCREMENT,
  titre VARCHAR(150) NOT NULL,
  description TEXT,
  lien VARCHAR(255),
  statut VARCHAR(50) NOT NULL DEFAULT 'En cours',
  ordre_affichage INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id_projet)
);

CREATE TABLE IF NOT EXISTS technologies (
  id_technologie INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_technologie),
  UNIQUE KEY uq_technologies_nom (nom)
);

CREATE TABLE IF NOT EXISTS projets_technologies (
  id_projet INT UNSIGNED NOT NULL,
  id_technologie INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_projet, id_technologie),
  FOREIGN KEY (id_projet) REFERENCES projets(id_projet) ON DELETE CASCADE,
  FOREIGN KEY (id_technologie) REFERENCES technologies(id_technologie) ON DELETE CASCADE
);

-- Les messages de contact (entité MESSAGE du MCD) sont stockés dans MongoDB,
-- pas dans MySQL : voir backend/models/Message.js. La relation ENVOYER
-- (utilisateur -> message) est donc juste un id numérique stocké côté Mongo,
-- sans clé étrangère réelle puisque ce n'est pas la même base de données.
