const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const pool = require('../database');

const SALT_ROUNDS = 10;

// ----------------------
// INSCRIPTION
// ----------------------
router.post(
  '/inscription',
  [
    body('nom').trim().notEmpty().withMessage('Le nom est requis.'),
    body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { nom, email, password } = req.body;

    try {
      const [existing] = await pool.query(
        'SELECT id FROM utilisateurs WHERE email = ?',
        [email]
      );
      if (existing.length > 0) {
        return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const [result] = await pool.query(
        'INSERT INTO utilisateurs (nom_utilisateur, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
        [nom, email, hashedPassword, 'utilisateur']
      );

      const user = {
        id: result.insertId,
        nom_utilisateur: nom,
        email,
        role: 'utilisateur',
      };

      // On connecte automatiquement l'utilisateur après inscription.
      req.session.user = user;

      return res.status(201).json({ message: 'Inscription réussie.', user });
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err.message);
      return res.status(500).json({ message: 'Erreur serveur, réessayez plus tard.' });
    }
  }
);

// ----------------------
// CONNEXION
// ----------------------
router.post(
  '/connexion',
  [
    body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
    body('password').notEmpty().withMessage('Mot de passe requis.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const [rows] = await pool.query(
        'SELECT * FROM utilisateurs WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Identifiants incorrects.' });
      }

      const utilisateur = rows[0];
      const match = await bcrypt.compare(password, utilisateur.mot_de_passe);

      if (!match) {
        return res.status(401).json({ message: 'Identifiants incorrects.' });
      }

      const user = {
        id: utilisateur.id,
        nom_utilisateur: utilisateur.nom_utilisateur,
        email: utilisateur.email,
        role: utilisateur.role,
      };

      req.session.user = user;

      return res.status(200).json({ message: 'Connexion réussie.', user });
    } catch (err) {
      console.error('Erreur lors de la connexion :', err.message);
      return res.status(500).json({ message: 'Erreur serveur, réessayez plus tard.' });
    }
  }
);

// ----------------------
// DÉCONNEXION
// ----------------------
router.post('/deconnexion', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Déconnexion réussie.' });
  });
});

// ----------------------
// UTILISATEUR CONNECTÉ (utile pour le frontend au chargement)
// ----------------------
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Non connecté.' });
  }
  return res.status(200).json({ user: req.session.user });
});

// ----------------------
// MIDDLEWARE ADMIN (à utiliser sur de futures routes protégées, ex: /api/admin/*)
// ----------------------
function requireAdmin(req, res, next) {
  if (req.session.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  }
  next();
}

module.exports = router;
module.exports.requireAdmin = requireAdmin;
