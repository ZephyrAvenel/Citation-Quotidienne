function verifierRarete(zone) {

  if (!zone.rarete) {
    return true;
  }

  return Math.random() > zone.rarete;
}

module.exports = {
  verifierRarete
};