function verifierSessionLocale() {

  let traverses = Number(
    sessionStorage.getItem('traversees') || 0
  );

  traverses += 1;

  sessionStorage.setItem('traversees', traverses);

  if (traverses > 12) {

    return {
      autorise: false,
      message:
        'Le territoire semble vouloir ralentir la traversée pour aujourd’hui.'
    };
  }

  return {
    autorise: true
  };
}

async function traverserAuHasard() {

  const session = verifierSessionLocale();

  if (!session.autorise) {

    afficherFragment(session.message);
    return;
  }

  try {

    const response = await fetch(
      'https://zephyr-navigation-vivante.onrender.com/api/traversee'
    );

    const data = await response.json();

    afficherFragment(data.fragment);

    appliquerClimat(data.climat);

    const cible = document.getElementById(data.zone);

    if (cible) {

      cible.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

  } catch (error) {
    console.error(error);
  }
}

function afficherFragment(texte) {

  const bloc = document.getElementById('fragment-vivant');

  if (bloc) {
    bloc.innerText = texte;
  }
}

function appliquerClimat(climat) {

  document.body.classList.remove(
    'etat-vivant',
    'etat-interdit',
    'etat-plurivers'
  );

  if (climat === 'organique') {
    document.body.classList.add('etat-vivant');
  }
}
