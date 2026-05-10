const zones = require('./zones.json');
const { verifierRarete } = require('./rarete');

function choisirZone(memoire) {

  const toutesZones = Object.keys(zones);

  let candidates = toutesZones.filter(zoneId => {

    const zone = zones[zoneId];

    if (memoire.zonesVisitees.includes(zoneId)) {
      return false;
    }

    return verifierRarete(zone);
  });

  if (candidates.length === 0) {
    candidates = toutesZones;
  }

  const choix = candidates[
    Math.floor(Math.random() * candidates.length)
  ];

  return {
    id: choix,
    zone: zones[choix]
  };
}

module.exports = {
  choisirZone
};