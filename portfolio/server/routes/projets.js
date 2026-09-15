const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Projet = require('../models/Projet');
const requireAdmin = require('../middleware/requireAdmin');

// ----------------------
// LISTER (public)
// ----------------------
router.get('/projets', async (_req, res) => {
  try {
    const projets = await Projet.find().sort({ ordre_affichage: 1, _id: 1 });
    return res.status(200).json({ projets });
  } catch (err) {
    console.error('Erreur lors de la récupération des projets :', err.message);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// ----------------------
// CRÉER (admin uniquement)
// ----------------------
router.post(
  '/projets',
  requireAdmin,
  [
    body('titre').trim().notEmpty().withMessage('Le titre est requis.'),
    body('description').optional().trim(),
    body('lien').optional().trim(),
    body('statut').optional().trim(),
    body('ordre_affichage').optional().isInt().withMessage('ordre_affichage doit être un nombre.'),
    body('technologies').optional().isArray().withMessage('technologies doit être une liste.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const projet = await Projet.create(req.body);
      return res.status(201).json({ message: 'Projet créé.', id: projet._id });
    } catch (err) {
      console.error('Erreur lors de la création du projet :', err.message);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  }
);

// ----------------------
// METTRE À JOUR (admin uniquement)
// ----------------------
router.put(
  '/projets/:id',
  requireAdmin,
  [
    body('titre').trim().notEmpty().withMessage('Le titre est requis.'),
    body('description').optional().trim(),
    body('lien').optional().trim(),
    body('statut').optional().trim(),
    body('ordre_affichage').optional().isInt().withMessage('ordre_affichage doit être un nombre.'),
    body('technologies').optional().isArray().withMessage('technologies doit être une liste.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const projet = await Projet.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!projet) {
        return res.status(404).json({ message: 'Projet introuvable.' });
      }

      return res.status(200).json({ message: 'Projet mis à jour.' });
    } catch (err) {
      console.error('Erreur lors de la mise à jour du projet :', err.message);
      return res.status(500).json({ message: 'Erreur serveur.' });
    }
  }
);

// ----------------------
// SUPPRIMER (admin uniquement)
// ----------------------
router.delete('/projets/:id', requireAdmin, async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);

    if (!projet) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }

    return res.status(200).json({ message: 'Projet supprimé.' });
  } catch (err) {
    console.error('Erreur lors de la suppression du projet :', err.message);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;