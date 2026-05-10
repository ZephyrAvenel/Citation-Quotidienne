const sessions = new Map();

const MAX_TRAVERSEES = 12;
const COOLDOWN_MS = 15000;

function verifierLimites(sessionId) {

  const maintenant = Date.now();

  if (!sessions.has(sessionId)) {

    sessions.set(sessionId, {
      count: 0,
      lastCall: 0
    });
  }

  const session = sessions.get(sessionId);

  if (session.count >= MAX_TRAVERSEES) {

    return {
      autorise: false,
      message:
        "Le seuil semble vouloir ralentir la traversée pour l'instant."
    };
  }

  if (maintenant - session.lastCall < COOLDOWN_MS) {

    return {
      autorise: false,
      message:
        "Certaines portes demandent un peu de silence avant de se rouvrir."
    };
  }

  session.count += 1;
  session.lastCall = maintenant;

  return {
    autorise: true
  };
}

module.exports = {
  verifierLimites
};