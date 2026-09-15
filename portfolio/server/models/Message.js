const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  sujet: { type: String, trim: true, default: '' },
  contenu: { type: String, required: true, trim: true },
  date_envoi: { type: Date, default: Date.now },
  lu: { type: Boolean, default: false },
  // Id de l'utilisateur MySQL qui a envoyé le message, si connecté.
  // Pas de ref/populate possible : ce n'est pas la même base de données.
  id_utilisateur: { type: Number, default: null },
});

module.exports = mongoose.model('Message', messageSchema);
