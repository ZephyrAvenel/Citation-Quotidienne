require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { choisirZone } = require('./traversees');
const { creerMemoireSession, ajouterZone } = require('./memoire');
const { obtenirFragment } = require('./fragments');
const { verifierLimites } = require('./rate-limit');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let memoire = creerMemoireSession();

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok'
  });
});

app.get('/api/traversee', (req, res) => {

  const sessionId = req.ip;

  const limite = verifierLimites(sessionId);

  if (!limite.autorise) {

    return res.status(429).json({
      status: 'ralenti',
      message: limite.message
    });
  }

  const resultat = choisirZone(memoire);

  memoire = ajouterZone(memoire, resultat.id);

  memoire.dernierClimat = resultat.zone.climat;

  const fragment = obtenirFragment(resultat.zone.climat);

  res.json({
    zone: resultat.id,
    label: resultat.zone.label,
    climat: resultat.zone.climat,
    fragment
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur actif sur ${PORT}`);
});