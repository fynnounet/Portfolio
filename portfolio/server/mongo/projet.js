const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  lien: { type: String, trim: true, default: '' },
  statut: { type: String, trim: true, default: 'En cours' },
  ordre_affichage: { type: Number, default: 0 },
  technologies: { type: [String], default: [] },
});

module.exports = mongoose.model('Projet', projetSchema);