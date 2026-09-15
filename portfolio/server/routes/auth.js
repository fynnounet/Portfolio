const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const SALT_ROUNDS = 10;

function toSessionUser(user) {
  return {
    id: user._id,
    nom_utilisateur: user.nom_utilisateur,
    email: user.email,
    role: user.role,
  };
}

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
      const existant = await User.findOne({ email });
      if (existant) {
        return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await User.create({
        nom_utilisateur: nom,
        email,
        mot_de_passe: hashedPassword,
        role: 'utilisateur',
      });

      const sessionUser = toSessionUser(user);
      req.session.user = sessionUser;

      return res.status(201).json({ message: 'Inscription réussie.', user: sessionUser });
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
      const utilisateur = await User.findOne({ email });

      if (!utilisateur) {
        return res.status(401).json({ message: 'Identifiants incorrects.' });
      }

      const match = await bcrypt.compare(password, utilisateur.mot_de_passe);

      if (!match) {
        return res.status(401).json({ message: 'Identifiants incorrects.' });
      }

      const sessionUser = toSessionUser(utilisateur);
      req.session.user = sessionUser;

      return res.status(200).json({ message: 'Connexion réussie.', user: sessionUser });
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

module.exports = router;
