const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
  nom_utilisateur: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  mot_de_passe: { type: String, required: true },
  role: { type: String, enum: ['utilisateur', 'admin'], default: 'utilisateur' },
  date_creation: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);