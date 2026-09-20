const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const requireAdmin = require('../middleware/requireAdmin');

const limiteurMessages = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de messages envoyés, réessaie un peu plus tard.' },
});

// ----------------------
// CRÉER (formulaire de contact, public)
// ----------------------

router.post(
  '/messages',
  [
    body('nom').trim().notEmpty().withMessage('Le nom est requis.'),
    body('email').isEmail().withMessage('Email invalide.').normalizeEmail(),
    body('sujet').optional().trim(),
    body('contenu')
      .trim()
      .notEmpty()
      .withMessage('Le message ne peut pas être vide.')
      .isLength({ max: 5000 })
      .withMessage('Le message est trop long.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { nom, email, sujet, contenu } = req.body;

    try {
      const message = await Message.create({
        nom,
        email,
        sujet,
        contenu,
        id_utilisateur: req.session.user?.id ?? null,
      });

      return res.status(201).json({
        message: 'Message envoyé, merci !',
        id: message._id,
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err.message);
      return res.status(500).json({ message: 'Erreur serveur, réessayez plus tard.' });
    }
  }
);

// ----------------------
// LISTER (admin uniquement)
// ----------------------

router.get('/messages', requireAdmin, async (_req, res) => {
  try {
    const messages = await Message.find().sort({ date_envoi: -1 });
    return res.status(200).json({ messages });
  } catch (err) {
    console.error('Erreur lors de la récupération des messages :', err.message);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// ----------------------
// METTRE À JOUR — ex: marquer comme lu/non lu (admin uniquement)
// ----------------------

router.patch('/messages/:id', requireAdmin, async (req, res) => {
  const { lu } = req.body;

  if (typeof lu !== 'boolean') {
    return res.status(400).json({ message: "Le champ 'lu' doit être un booléen." });
  }

  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { lu },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message introuvable.' });
    }

    return res.status(200).json({ message: 'Message mis à jour.', data: message });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du message :', err.message);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// ----------------------
// SUPPRIMER (admin uniquement)
// ----------------------

router.delete('/messages/:id', requireAdmin, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message introuvable.' });
    }

    return res.status(200).json({ message: 'Message supprimé.' });
  } catch (err) {
    console.error('Erreur lors de la suppression du message :', err.message);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
