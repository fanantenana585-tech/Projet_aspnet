import { defineStore } from 'pinia';

export const MENTIONS_EMIT = [
  {
    id: 'mention-info',
    nom: 'Informatique',
    couleur: '#38BDF8',
    icone: '💻',
    parcours: [
      { id: 'DA2I',  nom: 'Développement d\'Application Internet/Intranet',          niveau: 'Licence', code: 'DA2I',  couleur: '#0EA5E9' },
      { id: 'CIGSI', nom: 'Conception, Intégration et Gestion des Systèmes d\'Information', niveau: 'Licence', code: 'CIGSI', couleur: '#38BDF8' },
      { id: 'SIGD',  nom: 'Systèmes d\'Information, Géomatique et Décision',          niveau: 'Master',  code: 'SIGD',  couleur: '#0284C7' },
      { id: 'M2I',   nom: 'Modélisation et Ingénierie Informatique',                  niveau: 'Master',  code: 'M2I',   couleur: '#2563EB' },
      { id: 'GEO',   nom: 'Géomatique et Cartographie Numérique',                     niveau: 'Licence', code: 'GEO',   couleur: '#6D28D9' },
    ]
  },
  {
    id: 'mention-mgt',
    nom: 'Management',
    couleur: '#059669',
    icone: '📊',
    parcours: [
      { id: 'AES', nom: 'Administration Économique et Sociale', niveau: 'Licence', code: 'AES', couleur: '#10B981' },
      { id: 'MD',  nom: 'Management Décisionnel',               niveau: 'Master',  code: 'MD',  couleur: '#059669' },
    ]
  },
  {
    id: 'mention-rpm',
    nom: 'Relations Publiques et Multimédia',
    couleur: '#EC4899',
    icone: '📢',
    parcours: [
      { id: 'CM',   nom: 'Communication Multimédia',                      niveau: 'Licence', code: 'CM',   couleur: '#F472B6' },
      { id: 'RPCO', nom: 'Relations Publiques et Communication Organisationnelle', niveau: 'Licence', code: 'RPCO', couleur: '#EC4899' },
      { id: 'CMN',  nom: 'Communications et Médias Numériques',            niveau: 'Master',  code: 'CMN',  couleur: '#DB2777' },
      { id: 'RPC',  nom: 'Relations Publiques et Communications',           niveau: 'Master',  code: 'RPC',  couleur: '#BE185D' },
      { id: 'ICM',  nom: 'Information et Communication Multimédia',         niveau: 'Licence', code: 'ICM',  couleur: '#F43F5E' },
      { id: 'CNGP', nom: 'Communication Numérique et Gestion de Projet',    niveau: 'Licence', code: 'CNGP', couleur: '#E11D48' },
    ]
  }
];

export const useMatiereStore = defineStore('matiere', {
  state: () => ({
    matieres: [
      // === MENTION INFORMATIQUE — Parcours DA2I (Licence) ===
      { id: 'mat-001', code: 'DA2I101', nom: 'Programmation Web Front-End', description: 'HTML5, CSS3, JavaScript ES6+ et frameworks modernes Vue.js/React.', mention: 'Informatique', mentionId: 'mention-info', parcours: 'DA2I', parcoursNom: 'Développement d\'Application Internet/Intranet', niveau: 'L1', semestre: 'S1', type: ['Cours', 'TP'], credits: 4, volumeHoraire: { cours: 20, td: 0, tp: 20, projet: 0 }, couleur: '#0EA5E9', enseignants: [{ id: 'ens-001', nom: 'Rakoto', prenom: 'Jean', initiales: 'JR', role: 'Responsable' }], coefficient: 3, statut: 'actif' },
      { id: 'mat-002', code: 'DA2I201', nom: 'Développement Back-End Node.js', description: 'APIs REST, Express.js, authentification JWT et bases de données NoSQL.', mention: 'Informatique', mentionId: 'mention-info', parcours: 'DA2I', parcoursNom: 'Développement d\'Application Internet/Intranet', niveau: 'L2', semestre: 'S3', type: ['Cours', 'TD', 'TP'], credits: 5, volumeHoraire: { cours: 22, td: 8, tp: 16, projet: 0 }, couleur: '#0EA5E9', enseignants: [{ id: 'ens-001', nom: 'Rakoto', prenom: 'Jean', initiales: 'JR', role: 'Responsable' }, { id: 'ens-002', nom: 'Rasoa', prenom: 'Marie', initiales: 'MR', role: 'Chargé TP' }], coefficient: 3, statut: 'actif' },
      { id: 'mat-003', code: 'DA2I301', nom: 'Architecture Microservices', description: 'Conception microservices, Docker, Kubernetes et déploiement cloud.', mention: 'Informatique', mentionId: 'mention-info', parcours: 'DA2I', parcoursNom: 'Développement d\'Application Internet/Intranet', niveau: 'L3', semestre: 'S5', type: ['Cours', 'Projet'], credits: 6, volumeHoraire: { cours: 20, td: 0, tp: 0, projet: 24 }, couleur: '#0EA5E9', enseignants: [{ id: 'ens-004', nom: 'Hery', prenom: 'Luc', initiales: 'LH', role: 'Responsable' }], coefficient: 4, statut: 'actif' },

      // === MENTION INFORMATIQUE — Parcours CIGSI (Licence) ===
      { id: 'mat-004', code: 'CIGSI101', nom: 'Analyse et Conception des SI', description: 'UML, Merise, modélisation des systèmes d\'information et cas d\'usage.', mention: 'Informatique', mentionId: 'mention-info', parcours: 'CIGSI', parcoursNom: 'Conception, Intégration et Gestion des Systèmes d\'Information', niveau: 'L1', semestre: 'S2', type: ['Cours', 'TD'], credits: 4, volumeHoraire: { cours: 24, td: 12, tp: 0, projet: 0 }, couleur: '#38BDF8', enseignants: [{ id: 'ens-003', nom: 'Andry', prenom: 'Paul', initiales: 'PA', role: 'Responsable' }], coefficient: 3, statut: 'actif' },
      { id: 'mat-005', code: 'CIGSI202', nom: 'Base de Données Avancée', description: 'SQL avancé, optimisation, NoSQL (MongoDB, Redis) et data warehousing.', mention: 'Informatique', mentionId: 'mention-info', parcours: 'CIGSI', parcoursNom: 'Conception, Intégration et Gestion des Systèmes d\'Information', niveau: 'L2', semestre: 'S4', type: ['Cours', 'TD', 'TP'], credits: 5, volumeHoraire: { cours: 20, td: 10, tp: 14, projet: 0 }, couleur: '#38BDF8', enseignants: [{ id: 'ens-003', nom: 'Andry', prenom: 'Paul', initiales: 'PA', role: 'Responsable' }], coefficient: 3, statut: 'actif' },
      { id: 'mat-006', code: 'CIGSI303', nom: 'Intégration ERP/PGI', description: 'Odoo, SAP Business One, intégration et paramétrage des ERP.', mention: 'Informatique', mentionId: 'mention-info', parcours: 'CIGSI', parcoursNom: 'Conception, Intégration et Gestion des Systèmes d\'Information', niveau: 'L3', semestre: 'S6', type: ['Cours', 'TP', 'Projet'], credits: 5, volumeHoraire: { cours: 16, td: 0, tp: 20, projet: 10 }, couleur: '#38BDF8', enseignants: [{ id: 'ens-004', nom: 'Hery', prenom: 'Luc', initiales: 'LH', role: 'Responsable' }], coefficient: 4, statut: 'actif' },

      // === MENTION INFORMATIQUE — Parcours SIGD (Master) ===
      { id: 'mat-007', code: 'SIGD501', nom: 'Systèmes d\'Information Géographique', description: 'QGIS, ArcGIS, PostGIS, analyse spatiale et cartographie numérique.', mention: 'Informatique', mentionId: 'mention-info', parcours: 'SIGD', parcoursNom: 'Systèmes d\'Information, Géomatique et Décision', niveau: 'M1', semestre: 'S7', type: ['Cours', 'TP', 'Projet'], credits: 6, volumeHoraire: { cours: 20, td: 0, tp: 20, projet: 10 }, couleur: '#0284C7', enseignants: [{ id: 'ens-005', nom: 'Noro', prenom: 'Soa', initiales: 'SN', role: 'Responsable' }], coefficient: 4, statut: 'actif' },
      { id: 'mat-008', code: 'SIGD602', nom: 'Business Intelligence et Décisionnel', description: 'ETL, data warehouse, tableaux de bord décisionnels et Power BI.', mention: 'Informatique', mentionId: 'mention-info', parcours: 'SIGD', parcoursNom: 'Systèmes d\'Information, Géomatique et Décision', niveau: 'M2', semestre: 'S9', type: ['Cours', 'TD', 'Projet'], credits: 6, volumeHoraire: { cours: 22, td: 10, tp: 0, projet: 18 }, couleur: '#0284C7', enseignants: [{ id: 'ens-005', nom: 'Noro', prenom: 'Soa', initiales: 'SN', role: 'Responsable' }], coefficient: 4, statut: 'actif' },

      // === MENTION INFORMATIQUE — Parcours M2I (Master) ===
      { id: 'mat-009', code: 'M2I501', nom: 'Intelligence Artificielle et ML', description: 'Machine learning supervisé/non supervisé, réseaux de neurones et NLP.', mention: 'Informatique', mentionId: 'mention-info', parcours: 'M2I', parcoursNom: 'Modélisation et Ingénierie Informatique', niveau: 'M1', semestre: 'S7', type: ['Cours', 'TD', 'Projet'], credits: 6, volumeHoraire: { cours: 24, td: 10, tp: 0, projet: 16 }, couleur: '#2563EB', enseignants: [{ id: 'ens-001', nom: 'Rakoto', prenom: 'Jean', initiales: 'JR', role: 'Responsable' }, { id: 'ens-005', nom: 'Noro', prenom: 'Soa', initiales: 'SN', role: 'Chargé TD' }], coefficient: 4, statut: 'actif' },
      { id: 'mat-010', code: 'M2I502', nom: 'Modélisation Formelle des Systèmes', description: 'Automates, logique formelle, model checking et vérification de systèmes.', mention: 'Informatique', mentionId: 'mention-info', parcours: 'M2I', parcoursNom: 'Modélisation et Ingénierie Informatique', niveau: 'M1', semestre: 'S8', type: ['Cours', 'TD'], credits: 5, volumeHoraire: { cours: 26, td: 13, tp: 0, projet: 0 }, couleur: '#2563EB', enseignants: [{ id: 'ens-003', nom: 'Andry', prenom: 'Paul', initiales: 'PA', role: 'Responsable' }], coefficient: 4, statut: 'actif' },

      // === MENTION INFORMATIQUE — Géomatique ===
      { id: 'mat-011', code: 'GEO201', nom: 'Cartographie et Télédétection', description: 'Traitement d\'images satellitaires, drones et cartographie participative.', mention: 'Informatique', mentionId: 'mention-info', parcours: 'GEO', parcoursNom: 'Géomatique et Cartographie Numérique', niveau: 'L2', semestre: 'S4', type: ['Cours', 'TP'], credits: 4, volumeHoraire: { cours: 18, td: 0, tp: 18, projet: 0 }, couleur: '#6D28D9', enseignants: [{ id: 'ens-005', nom: 'Noro', prenom: 'Soa', initiales: 'SN', role: 'Responsable' }], coefficient: 3, statut: 'actif' },

      // === MENTION MANAGEMENT — Parcours AES (Licence) ===
      { id: 'mat-012', code: 'AES101', nom: 'Introduction à l\'Économie', description: 'Microéconomie, macroéconomie, marchés et politiques économiques.', mention: 'Management', mentionId: 'mention-mgt', parcours: 'AES', parcoursNom: 'Administration Économique et Sociale', niveau: 'L1', semestre: 'S1', type: ['Cours', 'TD'], credits: 4, volumeHoraire: { cours: 24, td: 12, tp: 0, projet: 0 }, couleur: '#10B981', enseignants: [{ id: 'ens-006', nom: 'Rabe', prenom: 'Haja', initiales: 'HR', role: 'Responsable' }], coefficient: 3, statut: 'actif' },
      { id: 'mat-013', code: 'AES202', nom: 'Droit des Affaires Malgache', description: 'Droit commercial, droit des sociétés et droit du travail selon le code malgache.', mention: 'Management', mentionId: 'mention-mgt', parcours: 'AES', parcoursNom: 'Administration Économique et Sociale', niveau: 'L2', semestre: 'S3', type: ['Cours', 'TD'], credits: 4, volumeHoraire: { cours: 22, td: 11, tp: 0, projet: 0 }, couleur: '#10B981', enseignants: [{ id: 'ens-013', nom: 'Ravo', prenom: 'Lanto', initiales: 'LR', role: 'Responsable' }], coefficient: 3, statut: 'actif' },
      { id: 'mat-014', code: 'AES303', nom: 'Gestion des Ressources Humaines', description: 'Recrutement, GPEC, formation, évaluation et relations sociales.', mention: 'Management', mentionId: 'mention-mgt', parcours: 'AES', parcoursNom: 'Administration Économique et Sociale', niveau: 'L3', semestre: 'S5', type: ['Cours', 'TD', 'Projet'], credits: 5, volumeHoraire: { cours: 20, td: 10, tp: 0, projet: 8 }, couleur: '#10B981', enseignants: [{ id: 'ens-006', nom: 'Rabe', prenom: 'Haja', initiales: 'HR', role: 'Responsable' }], coefficient: 3, statut: 'actif' },

      // === MENTION MANAGEMENT — Parcours MD (Master) ===
      { id: 'mat-015', code: 'MD501', nom: 'Management Stratégique', description: 'Stratégie corporate, analyse de portefeuille, fusions-acquisitions et gouvernance.', mention: 'Management', mentionId: 'mention-mgt', parcours: 'MD', parcoursNom: 'Management Décisionnel', niveau: 'M1', semestre: 'S7', type: ['Cours', 'TD', 'Projet'], credits: 6, volumeHoraire: { cours: 22, td: 11, tp: 0, projet: 12 }, couleur: '#059669', enseignants: [{ id: 'ens-007', nom: 'Vola', prenom: 'Aina', initiales: 'AV', role: 'Responsable' }], coefficient: 4, statut: 'actif' },
      { id: 'mat-016', code: 'MD602', nom: 'Finance et Contrôle de Gestion', description: 'Analyse financière, tableaux de bord, budget et évaluation de la performance.', mention: 'Management', mentionId: 'mention-mgt', parcours: 'MD', parcoursNom: 'Management Décisionnel', niveau: 'M2', semestre: 'S9', type: ['Cours', 'TD'], credits: 6, volumeHoraire: { cours: 24, td: 12, tp: 0, projet: 0 }, couleur: '#059669', enseignants: [{ id: 'ens-007', nom: 'Vola', prenom: 'Aina', initiales: 'AV', role: 'Responsable' }], coefficient: 4, statut: 'actif' },

      // === MENTION RPM — Parcours CM (Licence) ===
      { id: 'mat-017', code: 'CM101', nom: 'Techniques Audiovisuelles', description: 'Prise de vue, montage vidéo, infographie et production multimédia.', mention: 'Relations Publiques et Multimédia', mentionId: 'mention-rpm', parcours: 'CM', parcoursNom: 'Communication Multimédia', niveau: 'L1', semestre: 'S2', type: ['Cours', 'TP'], credits: 4, volumeHoraire: { cours: 14, td: 0, tp: 22, projet: 0 }, couleur: '#F472B6', enseignants: [{ id: 'ens-010', nom: 'Mamy', prenom: 'Zo', initiales: 'ZM', role: 'Responsable' }], coefficient: 3, statut: 'actif' },
      { id: 'mat-018', code: 'CM202', nom: 'Design Graphique et UX', description: 'Adobe Suite, UI/UX design, maquettage Figma et identité visuelle.', mention: 'Relations Publiques et Multimédia', mentionId: 'mention-rpm', parcours: 'CM', parcoursNom: 'Communication Multimédia', niveau: 'L2', semestre: 'S3', type: ['Cours', 'TP', 'Projet'], credits: 5, volumeHoraire: { cours: 14, td: 0, tp: 20, projet: 10 }, couleur: '#F472B6', enseignants: [{ id: 'ens-010', nom: 'Mamy', prenom: 'Zo', initiales: 'ZM', role: 'Responsable' }], coefficient: 3, statut: 'actif' },

      // === MENTION RPM — Parcours RPCO (Licence) ===
      { id: 'mat-019', code: 'RPCO101', nom: 'Communication Organisationnelle', description: 'Communication interne/externe, culture d\'entreprise et gestion de crise.', mention: 'Relations Publiques et Multimédia', mentionId: 'mention-rpm', parcours: 'RPCO', parcoursNom: 'Relations Publiques et Communication Organisationnelle', niveau: 'L1', semestre: 'S1', type: ['Cours', 'TD'], credits: 3, volumeHoraire: { cours: 18, td: 9, tp: 0, projet: 0 }, couleur: '#EC4899', enseignants: [{ id: 'ens-010', nom: 'Mamy', prenom: 'Zo', initiales: 'ZM', role: 'Responsable' }], coefficient: 2, statut: 'actif' },
      { id: 'mat-020', code: 'RPCO303', nom: 'Relations Presse et Lobbying', description: 'Relations avec les médias, conférences de presse, plaidoyer et influence.', mention: 'Relations Publiques et Multimédia', mentionId: 'mention-rpm', parcours: 'RPCO', parcoursNom: 'Relations Publiques et Communication Organisationnelle', niveau: 'L3', semestre: 'S6', type: ['Cours', 'TD', 'Projet'], credits: 4, volumeHoraire: { cours: 18, td: 9, tp: 0, projet: 8 }, couleur: '#EC4899', enseignants: [{ id: 'ens-010', nom: 'Mamy', prenom: 'Zo', initiales: 'ZM', role: 'Responsable' }], coefficient: 3, statut: 'actif' },

      // === MENTION RPM — Parcours CMN (Master) ===
      { id: 'mat-021', code: 'CMN501', nom: 'Stratégie Médias Numériques', description: 'Stratégie de contenu, SEO, réseaux sociaux professionnels et analytics.', mention: 'Relations Publiques et Multimédia', mentionId: 'mention-rpm', parcours: 'CMN', parcoursNom: 'Communications et Médias Numériques', niveau: 'M1', semestre: 'S7', type: ['Cours', 'TD', 'Projet'], credits: 5, volumeHoraire: { cours: 20, td: 10, tp: 0, projet: 12 }, couleur: '#DB2777', enseignants: [{ id: 'ens-010', nom: 'Mamy', prenom: 'Zo', initiales: 'ZM', role: 'Responsable' }], coefficient: 4, statut: 'actif' },

      // === MENTION RPM — Parcours ICM (Licence — Concours L1) ===
      { id: 'mat-022', code: 'ICM101', nom: 'Introduction aux Médias et Information', description: 'Histoire des médias, paysage médiatique malgache, éthique journalistique.', mention: 'Relations Publiques et Multimédia', mentionId: 'mention-rpm', parcours: 'ICM', parcoursNom: 'Information et Communication Multimédia', niveau: 'L1', semestre: 'S1', type: ['Cours', 'TD'], credits: 3, volumeHoraire: { cours: 18, td: 9, tp: 0, projet: 0 }, couleur: '#F43F5E', enseignants: [{ id: 'ens-010', nom: 'Mamy', prenom: 'Zo', initiales: 'ZM', role: 'Responsable' }], coefficient: 2, statut: 'actif' },

      // === MENTION RPM — Parcours CNGP ===
      { id: 'mat-023', code: 'CNGP201', nom: 'Gestion de Projet Numérique', description: 'Méthodes agiles, Scrum, Kanban, outils collaboratifs et gestion des risques.', mention: 'Relations Publiques et Multimédia', mentionId: 'mention-rpm', parcours: 'CNGP', parcoursNom: 'Communication Numérique et Gestion de Projet', niveau: 'L2', semestre: 'S4', type: ['Cours', 'TD', 'Projet'], credits: 4, volumeHoraire: { cours: 18, td: 9, tp: 0, projet: 10 }, couleur: '#E11D48', enseignants: [{ id: 'ens-007', nom: 'Vola', prenom: 'Aina', initiales: 'AV', role: 'Responsable' }], coefficient: 3, statut: 'actif' },

      // === MATIÈRES TRANSVERSALES (communes à plusieurs parcours) ===
      { id: 'mat-024', code: 'TRANS101', nom: 'Anglais des Affaires et Technologique', description: 'Communication professionnelle en anglais, rédaction de rapports et présentations.', mention: 'Transversal', mentionId: 'transversal', parcours: 'Transversal', parcoursNom: 'Tronc commun', niveau: 'L1', semestre: 'S1', type: ['Cours', 'TD'], credits: 3, volumeHoraire: { cours: 16, td: 8, tp: 0, projet: 0 }, couleur: '#64A8CC', enseignants: [{ id: 'ens-014', nom: 'Raza', prenom: 'Ivo', initiales: 'IR', role: 'Responsable' }], coefficient: 2, statut: 'actif' },
      { id: 'mat-025', code: 'TRANS102', nom: 'Mathématiques pour l\'Informatique', description: 'Logique, arithmétique, combinatoire, graphes et probabilités discrètes.', mention: 'Transversal', mentionId: 'transversal', parcours: 'Transversal', parcoursNom: 'Tronc commun', niveau: 'L1', semestre: 'S1', type: ['Cours', 'TD'], credits: 4, volumeHoraire: { cours: 26, td: 13, tp: 0, projet: 0 }, couleur: '#F59E0B', enseignants: [{ id: 'ens-008', nom: 'Solo', prenom: 'Fara', initiales: 'FS', role: 'Responsable' }], coefficient: 3, statut: 'actif' },
      { id: 'mat-026', code: 'TRANS201', nom: 'Méthodologie de la Recherche', description: 'Recherche documentaire, rédaction académique, citation et anti-plagiat.', mention: 'Transversal', mentionId: 'transversal', parcours: 'Transversal', parcoursNom: 'Tronc commun', niveau: 'L2', semestre: 'S3', type: ['Cours', 'TD'], credits: 2, volumeHoraire: { cours: 12, td: 6, tp: 0, projet: 0 }, couleur: '#64A8CC', enseignants: [{ id: 'ens-013', nom: 'Ravo', prenom: 'Lanto', initiales: 'LR', role: 'Responsable' }], coefficient: 1, statut: 'actif' },
      { id: 'mat-027', code: 'AES101B', nom: 'Comptabilité Générale', description: 'PCG malgache, plan comptable, bilans, comptes de résultat et journaux.', mention: 'Management', mentionId: 'mention-mgt', parcours: 'AES', parcoursNom: 'Administration Économique et Sociale', niveau: 'L1', semestre: 'S2', type: ['Cours', 'TD'], credits: 4, volumeHoraire: { cours: 22, td: 11, tp: 0, projet: 0 }, couleur: '#34D399', enseignants: [{ id: 'ens-006', nom: 'Rabe', prenom: 'Haja', initiales: 'HR', role: 'Responsable' }], coefficient: 3, statut: 'actif' },
      { id: 'mat-028', code: 'RPC601', nom: 'Mémoire de Fin d\'Études', description: 'Travail de recherche appliqué, soutenance devant jury et rapport écrit.', mention: 'Relations Publiques et Multimédia', mentionId: 'mention-rpm', parcours: 'RPC', parcoursNom: 'Relations Publiques et Communications', niveau: 'M2', semestre: 'S10', type: ['Projet'], credits: 10, volumeHoraire: { cours: 0, td: 0, tp: 0, projet: 60 }, couleur: '#BE185D', enseignants: [{ id: 'ens-010', nom: 'Mamy', prenom: 'Zo', initiales: 'ZM', role: 'Directeur mémoire' }], coefficient: 6, statut: 'actif' },
    ],
    matiereSelectionnee: null,
    filtres: {
      search: '',
      mention: 'toutes',
      parcours: 'tous',
      niveau: 'tous',
      semestre: 'tous',
      type: 'tous',
      statut: 'actif'
    },
    loading: false,
    drawerOuvert: false,
    modalOuverte: false,
    matiereEnEdition: null,
    modeVue: 'cartes' // 'cartes' | 'liste' | 'dashboard'
  }),
  getters: {
    matieresFiltrees: (state) => {
      return state.matieres.filter(m => {
        const matchSearch = state.filtres.search === '' ||
          m.nom.toLowerCase().includes(state.filtres.search.toLowerCase()) ||
          m.code.toLowerCase().includes(state.filtres.search.toLowerCase());

        const matchMention = state.filtres.mention === 'toutes' || m.mentionId === state.filtres.mention;
        const matchParcours = state.filtres.parcours === 'tous' || m.parcours === state.filtres.parcours;
        const matchNiveau = state.filtres.niveau === 'tous' || m.niveau === state.filtres.niveau;
        const matchSemestre = state.filtres.semestre === 'tous' || m.semestre === state.filtres.semestre;
        const matchType = state.filtres.type === 'tous' || m.type.includes(state.filtres.type);
        const matchStatut = state.filtres.statut === 'tous' || m.statut === state.filtres.statut;

        return matchSearch && matchMention && matchParcours && matchNiveau && matchSemestre && matchType && matchStatut;
      });
    },
    statsGlobales: (state) => {
      const actives = state.matieres.filter(m => m.statut === 'actif').length;
      const totalCredits = state.matieres.reduce((acc, m) => acc + m.credits, 0);
      const mentions = [...new Set(state.matieres.map(m => m.mentionId))].length;
      return {
        total: state.matieres.length,
        actives,
        creditsMoyens: (totalCredits / state.matieres.length).toFixed(1),
        mentions
      };
    },
    matieresByMention: (state) => {
      const result = {};
      MENTIONS_EMIT.forEach(mention => {
        result[mention.id] = {
          ...mention,
          parcoursData: mention.parcours.map(p => ({
            ...p,
            matieres: state.matieres.filter(m => m.parcours === p.id)
          }))
        };
      });
      return result;
    }
  },
  actions: {
    ouvrirDetail(matiere) {
      this.matiereSelectionnee = matiere;
      this.drawerOuvert = true;
    },
    fermerDetail() {
      this.drawerOuvert = false;
    },
    ouvrirModal(matiere = null) {
      this.matiereEnEdition = matiere ? { ...matiere } : null;
      this.modalOuverte = true;
    },
    fermerModal() {
      this.modalOuverte = false;
    },
    ajouterMatiere(data) {
      this.matieres.push({ id: 'mat-' + Date.now(), ...data });
    },
    modifierMatiere(id, data) {
      const index = this.matieres.findIndex(m => m.id === id);
      if (index !== -1) this.matieres[index] = { ...this.matieres[index], ...data };
    },
    supprimerMatiere(id) {
      this.matieres = this.matieres.filter(m => m.id !== id);
    }
  }
});
