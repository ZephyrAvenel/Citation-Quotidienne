let traverseeEnCours = false;

/* ===================================== */
/* 🌿 SESSION LOCALE */
/* ===================================== */

function verifierSessionLocale() {

  let traversees = Number(
    sessionStorage.getItem('traversees') || 0
  );

  traversees += 1;

  sessionStorage.setItem(
    'traversees',
    traversees
  );

  if (traversees > 12) {

    return {
      autorise: false,
      message:
        'Le territoire semble vouloir ralentir la traversée pour aujourd’hui.<br><br>Certaines portes demandent davantage de silence entre deux passages.'
    };
  }

  return {
    autorise: true
  };
}

/* ===================================== */
/* 🌿 MÉMOIRE ANTI-RÉPÉTITION */
/* ===================================== */

function recupererHistorique() {

  return JSON.parse(
    sessionStorage.getItem('zonesVisitees') || '[]'
  );
}

function sauvegarderHistorique(zone) {

  let historique = recupererHistorique();

  historique.push(zone);

  historique = historique.slice(-3);

  sessionStorage.setItem(
    'zonesVisitees',
    JSON.stringify(historique)
  );
}

/* ===================================== */
/* 🌌 TRAVERSÉE PRINCIPALE */
/* ===================================== */

async function traverserAuHasard() {

  /* ===================================== */
  /* 🚫 ÉVITE DOUBLE CLIC */
  /* ===================================== */

  if (traverseeEnCours) {
    return;
  }

  traverseeEnCours = true;

  const session = verifierSessionLocale();

  if (!session.autorise) {

    afficherFragment(session.message);

    traverseeEnCours = false;

    return;
  }

  /* ===================================== */
  /* 🌀 BOUTON VIVANT */
  /* ===================================== */

  const bouton =
    document.querySelector(
      '.traversee-widget button'
    );

  if (bouton) {

    bouton.disabled = true;

    bouton.innerHTML =
      '🌀 Le territoire s’éveille…';

    bouton.style.opacity = '.82';

    bouton.style.cursor = 'wait';
  }

  /* ===================================== */
  /* 🌫️ MESSAGE IMMÉDIAT */
  /* ===================================== */

  afficherFragment(
    '🌀 Le territoire s’éveille…'
  );

  try {

    const response = await fetch(
      'https://zephyr-navigation-vivante.onrender.com/api/traversee',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          historique:
            recupererHistorique()

        })

      }
    );

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }

    const data = await response.json();

    console.log(
      'Traversée reçue :',
      data
    );

    const historique =
      recupererHistorique();

    /* ===================================== */
    /* 🚫 ÉVITE RÉPÉTITION IMMÉDIATE */
    /* ===================================== */

    if (
      historique.includes(data.zone)
    ) {

      console.log(
        'Zone récemment visitée :',
        data.zone
      );
    }

    sauvegarderHistorique(data.zone);

    /* ===================================== */
    /* ✨ FRAGMENT */
    /* ===================================== */

    afficherFragment(data.fragment);

    /* ===================================== */
    /* 🌫️ CLIMAT */
    /* ===================================== */

    appliquerClimat(data.climat);

    /* ===================================== */
    /* 🌿 RESTAURE BOUTON */
    /* ===================================== */

    if (bouton) {

      bouton.disabled = false;

      bouton.innerHTML =
        '🌀 Ouvrir une traversée';

      bouton.style.opacity = '1';

      bouton.style.cursor = 'pointer';
    }

    /* ===================================== */
    /* 🌀 NAVIGATION DIFFÉRÉE */
    /* ===================================== */

    setTimeout(() => {

      /* ============================== */
      /* 🌌 NAVIGATION PAR ANCRE */
      /* ============================== */

      if (data.ancre) {

        const id =
          data.ancre.replace('#', '');

        const cible =
          document.getElementById(id);

        if (cible) {

          cible.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

        } else {

          console.warn(
            'Ancre introuvable :',
            data.ancre
          );
        }

      }

      /* ============================== */
      /* 🌿 FALLBACK */
      /* ============================== */

      else {

        const cible =
          document.getElementById(data.zone);

        if (cible) {

          cible.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

        } else {

          console.warn(
            'Zone introuvable :',
            data.zone
          );
        }
      }

      /* ===================================== */
      /* 🔓 FIN TRAVERSÉE */
      /* ===================================== */

      traverseeEnCours = false;

    }, 6700);

  } catch (error) {

    console.error(
      'Erreur traversée détaillée :',
      error
    );

    if (bouton) {

      bouton.disabled = false;

      bouton.innerHTML =
        '🌀 Ouvrir une traversée';

      bouton.style.opacity = '1';

      bouton.style.cursor = 'pointer';
    }

    afficherFragment(
      'La traversée semble momentanément indisponible.'
    );

    traverseeEnCours = false;
  }
}

/* ===================================== */
/* 🌿 AFFICHAGE FRAGMENT */
/* ===================================== */

function afficherFragment(texte) {

  const bloc =
    document.getElementById(
      'fragment-vivant'
    );

  if (!bloc) return;

  bloc.innerHTML = `
    <div class="fragment-interieur">
      ${texte}
    </div>
  `;

  bloc.classList.remove(
    'visible'
  );

  /* Force repaint mobile */

  void bloc.offsetWidth;

  setTimeout(() => {

    bloc.classList.add(
      'visible'
    );

  }, 60);
}

/* ===================================== */
/* 🌫️ CLIMATS SYMBOLIQUES */
/* ===================================== */

function appliquerClimat(climat) {

  document.body.classList.remove(
    'etat-vivant',
    'etat-interdit',
    'etat-plurivers',
    'mode-veilleurs',
    'presence-longue',
    'etat-solaire',
    'etat-fractale'
  );

  if (climat === 'vivant') {

    document.body.classList.add(
      'etat-vivant'
    );
  }

  if (climat === 'interdit') {

    document.body.classList.add(
      'etat-interdit'
    );
  }

  if (climat === 'plurivers') {

    document.body.classList.add(
      'etat-plurivers'
    );
  }

  if (climat === 'veilleurs') {

    document.body.classList.add(
      'mode-veilleurs'
    );
  }

  if (climat === 'respiration') {

    document.body.classList.add(
      'presence-longue'
    );
  }

  if (climat === 'solaire') {

    document.body.classList.add(
      'etat-solaire'
    );
  }

  if (climat === 'fractale') {

    document.body.classList.add(
      'etat-fractale'
    );
  }
}

console.log(
  'Bridge vivant chargé'
);
