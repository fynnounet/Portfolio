const mongoose = require('mongoose');

const profilSchema = new mongoose.Schema({
  prenom: { type: String, trim: true, default: '' },
  nom: { type: String, trim: true, default: '' },
  presentation: { type: String, trim: true, default: '' },
});

module.exports = mongoose.model('Profil', profilSchema);