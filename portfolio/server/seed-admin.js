require('dotenv').config();
const bcrypt = require('bcrypt');
const connectMongo = require('./mongo');
const User = require('./models/User');

const SALT_ROUNDS = 10;

async function main() {
  const [, , email, password, nom = 'Admin'] = process.argv;

  if (!email || !password) {
    console.error('Usage : npm run seed:admin -- <email> <mot_de_passe> [nom_utilisateur]');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('Le mot de passe doit contenir au moins 6 caractères.');
    process.exit(1);
  }

  await connectMongo();

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // On veut un seul compte au total : on repart de zéro avant de recréer l'admin.
  await User.deleteMany({});
  await User.create({
    nom_utilisateur: nom,
    email,
    mot_de_passe: hashedPassword,
    role: 'admin',
  });

  console.log(`Compte admin créé : ${email} (mot de passe haché avec bcrypt).`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Erreur lors de la création du compte admin :', err.message);
  process.exit(1);
});
