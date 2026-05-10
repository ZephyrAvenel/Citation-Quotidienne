require('dotenv').config();

const express = require('express');
const cors = require('cors');

const {
  choisirZone,
  choisirTraversee,
  traversees
} = require('./traversees');

const {
  creerMemoireSession,
  ajouterZone
} = require('./memoire');

const {
  obtenirFragment
} = require('./fragments');

const {
  verifierLimites
} = require('./rate-limit');

const app = express();

/* ===================================== */
/* 🌿 MIDDLEWARES */
/* ===================================== */

app.use(cors());

app.use(express.json());

app.use(express.static('public'));

/* ===================================== */
/* 🌌 MÉMOIRE SESSION */
/* ===================================== */

let memoire =
  creerMemoireSession();

/* ===================================== */
/* ❤️ HEALTHCHECK */
/* ===================================== */

app.get('/api/health', (req, res) => {

  res.json({
    status: 'ok',
    univers: 'Cosmologie des Récits Vivants'
  });

});

/* ===================================== */
/* 🌀 API TRAVERSÉE */
/* ===================================== */

app.post('/api/traversee', (req, res) => {

  try {

    /* ===================================== */
    /* 🌿 SESSION */
    /* ===================================== */

    const sessionId =
      req.ip;

    const limite =
      verifierLimites(sessionId);

    if (!limite.autorise) {

      return res.status(429).json({

        status: 'ralenti',

        message: limite.message

      });

    }

    /* ===================================== */
    /* 🌫️ HISTORIQUE */
    /* ===================================== */

    const historique =
      req.body?.historique || [];

    /* ===================================== */
    /* 🌌 OPTIONS */
    /* ===================================== */

    const options = {

      climat:
        req.body?.climat || null,

      type:
        req.body?.type || null,

      traversee:
        req.body?.traversee || null

    };

    /* ===================================== */
    /* 🌀 CHOIX ZONE */
    /* ===================================== */

    const resultat =
      choisirZone(
        memoire,
        historique,
        options
      );

    /* ===================================== */
    /* 🌿 MÉMOIRE */
    /* ===================================== */

    memoire =
      ajouterZone(
        memoire,
        resultat.id
      );

    memoire.dernierClimat =
      resultat.zone.climat;

    /* ===================================== */
    /* ✨ FRAGMENT */
    /* ===================================== */

    const fragment =
      resultat.zone.fragment ||
      obtenirFragment(
        resultat.zone.climat
      );

    /* ===================================== */
    /* 🌌 RÉPONSE */
    /* ===================================== */

    res.json({

      status: 'ok',

      zone:
        resultat.id,

      label:
        resultat.zone.label,

      type:
        resultat.zone.type,

      famille:
        resultat.zone.famille,

      niveau:
        resultat.zone.niveau,

      climat:
        resultat.zone.climat,

      intensite:
        resultat.zone.intensite,

      rarete:
        resultat.zone.rarete,

      ancre:
        resultat.zone.ancre,

      liens:
        resultat.zone.liens || [],

      suggestions:
        resultat.suggestions || [],

      fragment,

      meta:
        resultat.meta || {}

    });

  } catch (error) {

    console.error(
      'Erreur traversée :',
      error
    );

    res.status(500).json({

      status: 'erreur',

      message:
        'La traversée semble momentanément indisponible.'

    });

  }

});

/* ===================================== */
/* 🌌 API TRAVERSÉES */
/* ===================================== */

app.get('/api/traversees', (req, res) => {

  res.json({

    status: 'ok',

    traversees

  });

});

/* ===================================== */
/* 🌌 API TRAVERSÉE ALÉATOIRE */
/* ===================================== */

app.get('/api/traversee-type', (req, res) => {

  const resultat =
    choisirTraversee();

  res.json({

    status: 'ok',

    id:
      resultat.id,

    traversee:
      resultat.traversee

  });

});

/* ===================================== */
/* 🌿 ROUTE TEST */
/* ===================================== */

app.get('/', (req, res) => {

  res.send(`
    <h1>
      🌌 Navigation Vivante Active
    </h1>

    <p>
      Le territoire semble respirer.
    </p>
  `);

});

/* ===================================== */
/* 🚀 SERVEUR */
/* ===================================== */

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `🌌 Serveur actif sur ${PORT}`
  );

});
