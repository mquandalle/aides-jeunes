const Scolarite = {
  annee_etude: [
    {
      label: "CAP - 1ère année",
      value: "cap_1",
      only: "lycee",
    },
    {
      label: "CAP - 2ème année",
      value: "cap_2",
      only: "lycee",
    },
    {
      label: "Seconde",
      value: "seconde",
      only: "lycee",
    },
    {
      label: "Première",
      value: "premiere",
      only: "lycee",
    },
    {
      label: "Terminale",
      value: "terminale",
      only: "lycee",
    },
    {
      label: "BTS",
      value: "bts_1",
      only: "enseignement_superieur",
    },
    {
      label: "BUT",
      value: "but_1",
      only: "enseignement_superieur",
    },
    {
      label: "CPGE",
      value: "cpge_1",
      only: "enseignement_superieur",
    },
    {
      label: "Licence - 1ère année",
      value: "licence_1",
      only: "enseignement_superieur",
    },
    {
      label: "Licence - 2ème année",
      value: "licence_2",
      only: "enseignement_superieur",
    },
    {
      label: "Licence - 3ème année",
      value: "licence_3",
      only: "enseignement_superieur",
    },
    {
      label: "Master - 1ère année",
      value: "master_1",
      only: "enseignement_superieur",
    },
    {
      label: "Master - 2ème année",
      value: "master_2",
      only: "enseignement_superieur",
    },
    {
      label: "Doctorat - 1ère année",
      value: "doctorat_1",
      only: "enseignement_superieur",
    },
    {
      label: "Doctorat - 2ème année",
      value: "doctorat_2",
      only: "enseignement_superieur",
    },
    {
      label: "Doctorat - 3ème année",
      value: "doctorat_3",
      only: "enseignement_superieur",
    },
    {
      label: "Autre",
      value: "autre",
    },
  ],
  types: [
    {
      value: "college",
      label: "Au collège",
    },
    {
      value: "lycee",
      label: "Au lycée / En CAP / En CPA",
    },
    {
      value: "enseignement_superieur",
      label: "Dans l'enseignement supérieur",
    },
    {
      value: "grande_ecole_du_numerique",
      label: "Dans une grande école du numérique",
    },
    {
      value: "inconnue",
      label: "Autre",
    },
  ],
  mentionsBaccalaureat: [
    {
      label: "Mention assez bien",
      value: "mention_assez_bien",
    },
    {
      label: "Mention bien",
      value: "mention_bien",
    },
    {
      label: "Mention très bien",
      value: "mention_tres_bien",
    },
    {
      label: "Mention très bien avec félicitations du jury",
      value: "mention_tres_bien_felicitations_jury",
    },
    {
      label: "Autre",
      value: "non_renseignee",
    },
  ],
}

module.exports = Scolarite
