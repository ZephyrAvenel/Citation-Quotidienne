const zones = require('./zones.json');
const { verifierRarete } = require('./rarete');

/* ===================================== */
/* 🌿 CHOIX D’UNE ZONE */
/* ===================================== */

function choisirZone(
  memoire,
  historique = []
) {

  const toutesZones =
    Object.keys(zones);

  /* ===================================== */
  /* 🌫️ FILTRAGE PRINCIPAL */
  /* ===================================== */

  let candidates =
    toutesZones.filter(zoneId => {

      const zone = zones[zoneId];

      /* ============================== */
      /* 🚫 ÉVITE LES ZONES VISITÉES */
      /* ============================== */

      if (
        memoire.zonesVisitees.includes(zoneId)
      ) {
        return false;
      }

      /* ============================== */
      /* 🚫 ÉVITE LES 3 DERNIÈRES */
      /* ============================== */

      if (
        historique.includes(zoneId)
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

        return verifierRarete(zone);

      });

  }

  /* ===================================== */
  /* 🌌 SI TOUJOURS VIDE */
  /* ===================================== */

  if (candidates.length === 0) {

    candidates = toutesZones;

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

  return {

    id: choix,

    zone: zones[choix]

  };
}

module.exports = {
  choisirZone
};
