const zones = require('./zones.json');
const { verifierRarete } = require('./rarete');

/* ===================================== */
/* 🌌 TRAVERSÉES NARRATIVES */
/* ===================================== */

const traversees = {

  "traversees-lentes": {
    label: "Traversées lentes",
    climat: "respiration",
    zones: [
      "radio-recits-vivants",
      "acte2-resonance",
      "chatContainer",
      "habitabilite"
    ]
  },

  "traversees-cosmiques": {
    label: "Traversées cosmiques",
    climat: "plurivers",
    zones: [
      "porte-plurivers",
      "plurivers",
      "acte2-grandes-cartes",
      "mini-cosmologies"
    ]
  },

  "traversees-seuils": {
    label: "Traversées des seuils",
    climat: "passage",
    zones: [
      "porte-vivant",
      "seuil-film",
      "point-jonction",
      "acte3"
    ]
  },

  "traversees-secretes": {
    label: "Traversées secrètes",
    climat: "interdit",
    zones: [
      "failleHidden",
      "humour",
      "marge-vivante",
      "au-seuil-visible"
    ]
  },

  "traversees-cartographiques": {
    label: "Traversées cartographiques",
    climat: "cartographie",
    zones: [
      "atlas-recits-vivants",
      "acte2-passages",
      "acte2-grandes-cartes",
      "mini-cosmologies"
    ]
  }

};

/* ===================================== */
/* 🌿 ZONES VALIDES */
/* ===================================== */

const toutesZones =
  Object.keys(zones).filter(id => {

    return (
      typeof zones[id] === 'object' &&
      zones[id].label
    );

  });

/* ===================================== */
/* 🌿 CHOIX D’UNE ZONE */
/* ===================================== */

function choisirZone(
  memoire,
  historique = [],
  options = {}
) {

  const {
    climat = null,
    type = null,
    traversée = null
  } = options;

  /* ===================================== */
  /* 🌌 BASE DE CANDIDATS */
  /* ===================================== */

  let candidates = [...toutesZones];

  /* ===================================== */
  /* 🌀 FILTRE PAR TRAVERSÉE */
  /* ===================================== */

  if (
    traversée &&
    traversees[traversée]
  ) {

    candidates =
      traversees[traversée].zones
        .filter(id => zones[id]);

  }

  /* ===================================== */
  /* 🌫️ FILTRAGE PRINCIPAL */
  /* ===================================== */

  candidates =
    candidates.filter(zoneId => {

      const zone = zones[zoneId];

      if (!zone) {
        return false;
      }

      /* ============================== */
      /* 🚫 ZONES DÉJÀ VISITÉES */
      /* ============================== */

      if (
        memoire.zonesVisitees.includes(zoneId)
      ) {
        return false;
      }

      /* ============================== */
      /* 🚫 HISTORIQUE RÉCENT */
      /* ============================== */

      if (
        historique.includes(zoneId)
      ) {
        return false;
      }

      /* ============================== */
      /* 🌤️ FILTRE CLIMAT */
      /* ============================== */

      if (
        climat &&
        zone.climat !== climat
      ) {
        return false;
      }

      /* ============================== */
      /* 🌿 FILTRE TYPE */
      /* ============================== */

      if (
        type &&
        zone.type !== type
      ) {
        return false;
      }

      /* ============================== */
      /* ✨ RARETÉ */
      /* ============================== */

      return verifierRarete(zone);

    });

  /* ===================================== */
  /* 🌿 SI PLUS ASSEZ DE ZONES */
  /* ===================================== */

  if (candidates.length < 3) {

    candidates =
      toutesZones.filter(zoneId => {

        const zone = zones[zoneId];

        if (!zone) {
          return false;
        }

        return verifierRarete(zone);

      });

  }

  /* ===================================== */
  /* 🌌 SI TOUJOURS VIDE */
  /* ===================================== */

  if (candidates.length === 0) {

    candidates = [...toutesZones];

  }

  /* ===================================== */
  /* 🎲 CHOIX FINAL */
  /* ===================================== */

  const choix =
    candidates[
      Math.floor(
        Math.random() *
        candidates.length
      )
    ];

  const zone =
    zones[choix];

  /* ===================================== */
  /* 🌌 LIENS SUGGÉRÉS */
  /* ===================================== */

  const suggestions =
    (zone.liens || [])
      .filter(id => zones[id])
      .slice(0, 3);

  /* ===================================== */
  /* 🌿 RÉSULTAT */
  /* ===================================== */

  return {

    id: choix,

    zone,

    suggestions,

    meta: {

      climat:
        zone.climat || null,

      type:
        zone.type || null,

      niveau:
        zone.niveau || null,

      rarete:
        zone.rarete || 0,

      famille:
        zone.famille || null

    }

  };

}

/* ===================================== */
/* 🌌 CHOISIR UNE TRAVERSÉE */
/* ===================================== */

function choisirTraversee() {

  const ids =
    Object.keys(traversees);

  const id =
    ids[
      Math.floor(
        Math.random() *
        ids.length
      )
    ];

  return {

    id,

    traversee:
      traversees[id]

  };

}

/* ===================================== */
/* 🌿 EXPORTS */
/* ===================================== */

module.exports = {

  choisirZone,

  choisirTraversee,

  traversees

};
