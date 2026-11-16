// Contenuto degli step. Il testo tra **doppi asterischi** viene mostrato in grassetto.

export const phases = [
  { id: 'home', title: 'Preparazione a casa', icon: '🏠' },
  { id: 'party', title: 'Il giorno del Secret Santa', icon: '🎄' },
]

export const steps = [
  {
    phase: 'home',
    icon: '🛍️',
    title: 'Compra il regalo',
    intro: 'Compra il regalo per la persona che ti è stata assegnata.',
    tip: {
      icon: '💡',
      title: 'Se il tuo partner o un familiare partecipa anche lui',
      items: [
        '**Non ordinare su Amazon** se anche lui vede gli ordini dell’account condiviso.',
        'In alternativa, **chiedi a qualcun altro** di fare l’ordine con il suo account.',
        'Quando porti a casa il regalo, **tienilo nascosto** fino a quando l’hai impacchettato.',
      ],
    },
  },
  {
    phase: 'home',
    icon: '🎀',
    title: 'Impacchetta il regalo e prepara il bigliettino',
    items: [
      '**Impacchettare è facoltativo:** fallo come preferisci, oppure saltalo.',
      '**Il bigliettino è obbligatorio:** scrivi il **nome di chi riceverà il regalo** e attaccalo al pacchetto. Se non l’hai impacchettato, mettilo insieme al regalo.',
    ],
  },
  {
    phase: 'home',
    icon: '👜',
    title: 'Mettilo in una busta esterna',
    items: [
      'Metti il regalo, con il suo bigliettino, dentro **una busta qualsiasi, purché non sia trasparente**.',
    ],
    note: {
      icon: '✅',
      text: 'Da qui in poi non c’è più niente da nascondere al partner o ai familiari. La parte da fare di nascosto, in un’altra stanza, finisce qui.',
    },
  },
  {
    phase: 'party',
    icon: '✉️',
    title: 'Cambio di busta',
    items: [
      '**Prima di iniziare**, preparate nella stanza tante **buste tutte uguali** quanti sono i partecipanti.',
      'A turno ognuno entra **da solo** nella stanza e:',
    ],
    substeps: [
      'toglie il regalo dalla busta esterna;',
      'lo mette in una delle buste uguali, **con il bigliettino dentro e non visibile da fuori**;',
      '**si riporta via la busta esterna**, così nessuno può riconoscerla.',
    ],
    note: {
      icon: '📝',
      text: '**Segnatevi chi è entrato per primo.**',
    },
  },
  {
    phase: 'party',
    icon: '🔀',
    title: 'Mescolare le buste',
    items: [
      'Chi è entrato **per primo** torna nella stanza e **mescola le buste**, così nessuno può capire di chi è ciascuna in base alla posizione.',
    ],
  },
  {
    phase: 'party',
    icon: '🎁',
    title: 'Consegna e indovinello',
    items: [
      'Una persona prende **una busta alla volta**, legge il bigliettino dentro e **consegna il regalo** alla persona indicata.',
      'Chi riceve il regalo **prova a indovinare** chi è il suo Secret Santa.',
    ],
  },
]

export const REPO_URL = 'https://github.com/gennaahh/secret-santa'
