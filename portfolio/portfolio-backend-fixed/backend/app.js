const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const app = express();
const port = Number(process.env.PORT) || 3000;
const configuredClientUrl = process.env.CLIENT_URL;

app.use(cors({
  origin(origin, callback) {
    if (!origin || origin === configuredClientUrl || /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origine CORS non autorisée.'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'portfolio-development-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' },
}));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`Serveur lance sur http://localhost:${port}`);
});
