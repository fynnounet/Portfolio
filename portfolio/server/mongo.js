const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

async function connectMongo() {
  mongoose.connection.on('error', (err) => {
    console.error('Erreur de connexion MongoDB :', err.message);
  });

  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connecté.');
}

module.exports = connectMongo;
