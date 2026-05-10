function creerMemoireSession() {
  return {
    zonesVisitees: [],
    saturation: 0,
    dernierClimat: null,
    tempsPresence: 0,
    fictionOuverte: false
  };
}

function ajouterZone(memoire, zone) {

  if (!memoire.zonesVisitees.includes(zone)) {
    memoire.zonesVisitees.push(zone);
  }

  memoire.saturation += 0.08;

  return memoire;
}

module.exports = {
  creerMemoireSession,
  ajouterZone
};