const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Profil = require('../models/Profil');
const requireAdmin = require('../middleware/requireAdmin');

// ----------------------
// LIRE (public)
// ----------------------
router.get('/profil', async (_req, res) => {
  try {
    let profil = await Profil.findOne();

    if (!profil) {
      profil = await Profil.create({});
    }

    return res.status(200).json({ profil });
  } catch (err) {
    console.error('Erreur lors de la récupération du profil :', err.message);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// ----------------------
// MODIFIER (admin uniquement)
// ----------------------
router.put(
  '/profil',
  requireAdmin,
  [
    body('prenom').optional().trim(),
    body('nom').optional().trim(),
    body('presentation').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { prenom, nom, presentation } = req.body;

    try {
      const profil = await Profil.findOneAndUpdate(
        {},
        { prenom, nom, presentation },
        { new: true, upsert: true }
      );

      return res.status(200).json({ message: 'Profil mis à jour.', profil });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil :', err.message);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  }
);

module.exports = router;