const fragments = {

  respiration: [
    "Certaines traversées demandent moins de réponses que d'attention.",
    "Le vivant ne cherche pas toujours à être compris immédiatement."
  ],

  lucidite: [
    "Toute architecture contient une vision implicite du monde."
  ]

};

function obtenirFragment(climat) {

  const liste = fragments[climat] || fragments.respiration;

  return liste[Math.floor(Math.random() * liste.length)];
}

module.exports = {
  obtenirFragment
};