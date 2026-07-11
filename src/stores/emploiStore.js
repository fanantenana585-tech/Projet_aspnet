import { defineStore } from 'pinia';

const S = 25; // semaine ISO 25

export const SALLES = {
  A101: { id: 'A101', nom: 'A101', batiment: 'Bâtiment A', capacite: 45 },
  A102: { id: 'A102', nom: 'A102', batiment: 'Bâtiment A', capacite: 40 },
  B203: { id: 'B203', nom: 'B203', batiment: 'Bâtiment B', capacite: 35 },
  B105: { id: 'B105', nom: 'B105', batiment: 'Bâtiment B', capacite: 30 },
  C301: { id: 'C301', nom: 'C301', batiment: 'Bâtiment C', capacite: 40 },
  LabInfo1: { id: 'LabInfo1', nom: 'Labo Info 1', batiment: 'Bâtiment C', capacite: 25 },
  LabInfo2: { id: 'LabInfo2', nom: 'Labo Info 2', batiment: 'Bâtiment C', capacite: 20 },
  D102: { id: 'D102', nom: 'D102', batiment: 'Bâtiment D', capacite: 50 },
  D205: { id: 'D205', nom: 'D205', batiment: 'Bâtiment D', capacite: 35 },
  AmphiA: { id: 'AmphiA', nom: 'Amphi A', batiment: 'Bâtiment A', capacite: 150 },
  E201: { id: 'E201', nom: 'E201', batiment: 'Bâtiment E', capacite: 45 },
  Studio: { id: 'Studio', nom: 'Studio Multimédia', batiment: 'Bâtiment D', capacite: 18 },
};

export const ENS = {
  JR: { id: 'ens-001', nom: 'Rakoto', prenom: 'Jean', initiales: 'JR', email: 'j.rakoto@emit.mg' },
  MR: { id: 'ens-002', nom: 'Rasoa', prenom: 'Marie', initiales: 'MR', email: 'm.rasoa@emit.mg' },
  PA: { id: 'ens-003', nom: 'Andry', prenom: 'Paul', initiales: 'PA', email: 'p.andry@emit.mg' },
  LH: { id: 'ens-004', nom: 'Hery', prenom: 'Luc', initiales: 'LH', email: 'l.hery@emit.mg' },
  SN: { id: 'ens-005', nom: 'Noro', prenom: 'Soa', initiales: 'SN', email: 's.noro@emit.mg' },
  HR: { id: 'ens-006', nom: 'Rabe', prenom: 'Haja', initiales: 'HR', email: 'h.rabe@emit.mg' },
  AV: { id: 'ens-007', nom: 'Vola', prenom: 'Aina', initiales: 'AV', email: 'a.vola@emit.mg' },
  FS: { id: 'ens-008', nom: 'Solo', prenom: 'Fara', initiales: 'FS', email: 'f.solo@emit.mg' },
  LT: { id: 'ens-009', nom: 'Tiana', prenom: 'Lova', initiales: 'LT', email: 'l.tiana@emit.mg' },
  ZM: { id: 'ens-010', nom: 'Mamy', prenom: 'Zo', initiales: 'ZM', email: 'z.mamy@emit.mg' },
  LR: { id: 'ens-013', nom: 'Ravo', prenom: 'Lanto', initiales: 'LR', email: 'l.ravo@emit.mg' },
  IR: { id: 'ens-014', nom: 'Raza', prenom: 'Ivo', initiales: 'IR', email: 'i.raza@emit.mg' },
};

export const useEmploiStore = defineStore('emploi', {
  state: () => ({
    emplois: [
      // ─── LUNDI 16 JUIN ───────────────────────────────────────────────
      { id:'cr-001', matiere:{id:'mat-001',nom:'Programmation Web Front-End',code:'DA2I101',couleur:'#0EA5E9'}, enseignant:ENS.JR, salle:SALLES.LabInfo1, parcours:{id:'DA2I',nom:'Développement d\'Application Internet/Intranet',code:'DA2I',couleur:'#0EA5E9'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'L1', groupe:null, jour:'Lundi', heureDebut:'08:00', heureFin:'10:00', type:'Cours', semaine:S, recurrent:true, note:'' },
      { id:'cr-002', matiere:{id:'mat-004',nom:'Analyse et Conception des SI',code:'CIGSI101',couleur:'#38BDF8'}, enseignant:ENS.PA, salle:SALLES.B203, parcours:{id:'CIGSI',nom:'Conception, Intégration et Gestion des SI',code:'CIGSI',couleur:'#38BDF8'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'L1', groupe:'Groupe A', jour:'Lundi', heureDebut:'10:30', heureFin:'12:30', type:'TD', semaine:S, recurrent:true, note:'' },
      { id:'cr-003', matiere:{id:'mat-012',nom:'Introduction à l\'Économie',code:'AES101',couleur:'#10B981'}, enseignant:ENS.HR, salle:SALLES.AmphiA, parcours:{id:'AES',nom:'Administration Économique et Sociale',code:'AES',couleur:'#10B981'}, mention:{id:'mention-mgt',nom:'Management',couleur:'#059669'}, niveau:'L1', groupe:null, jour:'Lundi', heureDebut:'08:00', heureFin:'10:00', type:'Cours', semaine:S, recurrent:true, note:'Cours inaugural S1' },
      { id:'cr-004', matiere:{id:'mat-017',nom:'Techniques Audiovisuelles',code:'CM101',couleur:'#F472B6'}, enseignant:ENS.ZM, salle:SALLES.Studio, parcours:{id:'CM',nom:'Communication Multimédia',code:'CM',couleur:'#F472B6'}, mention:{id:'mention-rpm',nom:'Relations Publiques et Multimédia',couleur:'#EC4899'}, niveau:'L1', groupe:null, jour:'Lundi', heureDebut:'14:00', heureFin:'16:00', type:'TP', semaine:S, recurrent:true, note:'' },
      { id:'cr-005', matiere:{id:'mat-005',nom:'Base de Données Avancée',code:'CIGSI202',couleur:'#38BDF8'}, enseignant:ENS.PA, salle:SALLES.LabInfo1, parcours:{id:'CIGSI',nom:'Conception, Intégration et Gestion des SI',code:'CIGSI',couleur:'#38BDF8'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'L2', groupe:'Groupe B', jour:'Lundi', heureDebut:'16:00', heureFin:'18:00', type:'TP', semaine:S, recurrent:true, note:'Apporter clé USB' },

      // ─── MARDI 17 JUIN ────────────────────────────────────────────────
      { id:'cr-006', matiere:{id:'mat-025',nom:'Mathématiques pour l\'Informatique',code:'TRANS102',couleur:'#F59E0B'}, enseignant:ENS.FS, salle:SALLES.C301, parcours:{id:'DA2I',nom:'Développement d\'Application Internet/Intranet',code:'DA2I',couleur:'#0EA5E9'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'L1', groupe:null, jour:'Mardi', heureDebut:'08:00', heureFin:'10:00', type:'Cours', semaine:S, recurrent:true, note:'Tronc commun DA2I + CIGSI' },
      { id:'cr-007', matiere:{id:'mat-009',nom:'Intelligence Artificielle et ML',code:'M2I501',couleur:'#2563EB'}, enseignant:ENS.JR, salle:SALLES.B203, parcours:{id:'M2I',nom:'Modélisation et Ingénierie Informatique',code:'M2I',couleur:'#2563EB'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'M1', groupe:null, jour:'Mardi', heureDebut:'10:30', heureFin:'12:30', type:'Cours', semaine:S, recurrent:true, note:'' },
      { id:'cr-008', matiere:{id:'mat-007',nom:'SIG et Géomatique',code:'SIGD501',couleur:'#0284C7'}, enseignant:ENS.SN, salle:SALLES.LabInfo2, parcours:{id:'SIGD',nom:'Systèmes d\'Information, Géomatique et Décision',code:'SIGD',couleur:'#0284C7'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'M1', groupe:null, jour:'Mardi', heureDebut:'14:00', heureFin:'17:00', type:'TP', semaine:S, recurrent:false, note:'Session QGIS' },
      { id:'cr-009', matiere:{id:'mat-019',nom:'Communication Organisationnelle',code:'RPCO101',couleur:'#EC4899'}, enseignant:ENS.ZM, salle:SALLES.D102, parcours:{id:'RPCO',nom:'Relations Publiques et Communication Organisationnelle',code:'RPCO',couleur:'#EC4899'}, mention:{id:'mention-rpm',nom:'Relations Publiques et Multimédia',couleur:'#EC4899'}, niveau:'L1', groupe:null, jour:'Mardi', heureDebut:'08:00', heureFin:'10:00', type:'Cours', semaine:S, recurrent:true, note:'' },
      { id:'cr-010', matiere:{id:'mat-022',nom:'Introduction aux Médias',code:'ICM101',couleur:'#F43F5E'}, enseignant:ENS.ZM, salle:SALLES.D205, parcours:{id:'ICM',nom:'Information et Communication Multimédia',code:'ICM',couleur:'#F43F5E'}, mention:{id:'mention-rpm',nom:'Relations Publiques et Multimédia',couleur:'#EC4899'}, niveau:'L1', groupe:null, jour:'Mardi', heureDebut:'10:30', heureFin:'12:00', type:'Cours', semaine:S, recurrent:true, note:'Parcours ouvert concours 2025' },

      // ─── MERCREDI 18 JUIN ─────────────────────────────────────────────
      { id:'cr-011', matiere:{id:'mat-002',nom:'Développement Back-End Node.js',code:'DA2I201',couleur:'#0EA5E9'}, enseignant:ENS.JR, salle:SALLES.LabInfo1, parcours:{id:'DA2I',nom:'Développement d\'Application Internet/Intranet',code:'DA2I',couleur:'#0EA5E9'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'L2', groupe:'Groupe A', jour:'Mercredi', heureDebut:'08:00', heureFin:'11:00', type:'TP', semaine:S, recurrent:true, note:'TP Node.js + Express' },
      { id:'cr-012', matiere:{id:'mat-011',nom:'Cartographie et Télédétection',code:'GEO201',couleur:'#6D28D9'}, enseignant:ENS.SN, salle:SALLES.LabInfo2, parcours:{id:'GEO',nom:'Géomatique et Cartographie Numérique',code:'GEO',couleur:'#6D28D9'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'L2', groupe:null, jour:'Mercredi', heureDebut:'10:30', heureFin:'13:00', type:'TP', semaine:S, recurrent:false, note:'Drones et imagerie satellite' },
      { id:'cr-013', matiere:{id:'mat-013',nom:'Droit des Affaires Malgache',code:'AES202',couleur:'#10B981'}, enseignant:ENS.LR, salle:SALLES.C301, parcours:{id:'AES',nom:'Administration Économique et Sociale',code:'AES',couleur:'#10B981'}, mention:{id:'mention-mgt',nom:'Management',couleur:'#059669'}, niveau:'L2', groupe:null, jour:'Mercredi', heureDebut:'08:00', heureFin:'10:00', type:'Cours', semaine:S, recurrent:true, note:'' },
      { id:'cr-014', matiere:{id:'mat-015',nom:'Management Stratégique',code:'MD501',couleur:'#059669'}, enseignant:ENS.AV, salle:SALLES.D205, parcours:{id:'MD',nom:'Management Décisionnel',code:'MD',couleur:'#059669'}, mention:{id:'mention-mgt',nom:'Management',couleur:'#059669'}, niveau:'M1', groupe:null, jour:'Mercredi', heureDebut:'14:00', heureFin:'16:00', type:'Cours', semaine:S, recurrent:true, note:'' },
      { id:'cr-015', matiere:{id:'mat-021',nom:'Stratégie Médias Numériques',code:'CMN501',couleur:'#DB2777'}, enseignant:ENS.ZM, salle:SALLES.D102, parcours:{id:'CMN',nom:'Communications et Médias Numériques',code:'CMN',couleur:'#DB2777'}, mention:{id:'mention-rpm',nom:'Relations Publiques et Multimédia',couleur:'#EC4899'}, niveau:'M1', groupe:null, jour:'Mercredi', heureDebut:'16:00', heureFin:'18:00', type:'Cours', semaine:S, recurrent:true, note:'' },

      // ─── JEUDI 19 JUIN ────────────────────────────────────────────────
      { id:'cr-016', matiere:{id:'mat-006',nom:'Intégration ERP/PGI',code:'CIGSI303',couleur:'#38BDF8'}, enseignant:ENS.LH, salle:SALLES.LabInfo1, parcours:{id:'CIGSI',nom:'Conception, Intégration et Gestion des SI',code:'CIGSI',couleur:'#38BDF8'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'L3', groupe:'Groupe A', jour:'Jeudi', heureDebut:'08:00', heureFin:'11:00', type:'TP', semaine:S, recurrent:true, note:'Odoo 16 en ligne' },
      { id:'cr-017', matiere:{id:'mat-010',nom:'Modélisation Formelle des Systèmes',code:'M2I502',couleur:'#2563EB'}, enseignant:ENS.PA, salle:SALLES.B203, parcours:{id:'M2I',nom:'Modélisation et Ingénierie Informatique',code:'M2I',couleur:'#2563EB'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'M1', groupe:null, jour:'Jeudi', heureDebut:'10:30', heureFin:'12:30', type:'TD', semaine:S, recurrent:true, note:'' },
      { id:'cr-018', matiere:{id:'mat-014',nom:'GRH',code:'AES303',couleur:'#10B981'}, enseignant:ENS.HR, salle:SALLES.AmphiA, parcours:{id:'AES',nom:'Administration Économique et Sociale',code:'AES',couleur:'#10B981'}, mention:{id:'mention-mgt',nom:'Management',couleur:'#059669'}, niveau:'L3', groupe:null, jour:'Jeudi', heureDebut:'08:00', heureFin:'10:00', type:'Cours', semaine:S, recurrent:true, note:'' },
      { id:'cr-019', matiere:{id:'mat-016',nom:'Finance et Contrôle de Gestion',code:'MD602',couleur:'#059669'}, enseignant:ENS.AV, salle:SALLES.D205, parcours:{id:'MD',nom:'Management Décisionnel',code:'MD',couleur:'#059669'}, mention:{id:'mention-mgt',nom:'Management',couleur:'#059669'}, niveau:'M2', groupe:null, jour:'Jeudi', heureDebut:'14:00', heureFin:'16:00', type:'Cours', semaine:S, recurrent:true, note:'' },
      { id:'cr-020', matiere:{id:'mat-018',nom:'Design Graphique et UX',code:'CM202',couleur:'#F472B6'}, enseignant:ENS.ZM, salle:SALLES.Studio, parcours:{id:'CM',nom:'Communication Multimédia',code:'CM',couleur:'#F472B6'}, mention:{id:'mention-rpm',nom:'Relations Publiques et Multimédia',couleur:'#EC4899'}, niveau:'L2', groupe:null, jour:'Jeudi', heureDebut:'16:00', heureFin:'19:00', type:'TP', semaine:S, recurrent:false, note:'Projet Figma' },

      // ─── VENDREDI 20 JUIN ─────────────────────────────────────────────
      { id:'cr-021', matiere:{id:'mat-003',nom:'Architecture Microservices',code:'DA2I301',couleur:'#0EA5E9'}, enseignant:ENS.LH, salle:SALLES.B203, parcours:{id:'DA2I',nom:'Développement d\'Application Internet/Intranet',code:'DA2I',couleur:'#0EA5E9'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'L3', groupe:null, jour:'Vendredi', heureDebut:'08:00', heureFin:'10:00', type:'Cours', semaine:S, recurrent:true, note:'' },
      { id:'cr-022', matiere:{id:'mat-008',nom:'Business Intelligence',code:'SIGD602',couleur:'#0284C7'}, enseignant:ENS.SN, salle:SALLES.LabInfo2, parcours:{id:'SIGD',nom:'Systèmes d\'Information, Géomatique et Décision',code:'SIGD',couleur:'#0284C7'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'M2', groupe:null, jour:'Vendredi', heureDebut:'10:30', heureFin:'12:30', type:'TD', semaine:S, recurrent:true, note:'Projet Power BI' },
      { id:'cr-023', matiere:{id:'mat-020',nom:'Relations Presse et Lobbying',code:'RPCO303',couleur:'#EC4899'}, enseignant:ENS.ZM, salle:SALLES.E201, parcours:{id:'RPCO',nom:'Relations Publiques et Communication Organisationnelle',code:'RPCO',couleur:'#EC4899'}, mention:{id:'mention-rpm',nom:'Relations Publiques et Multimédia',couleur:'#EC4899'}, niveau:'L3', groupe:null, jour:'Vendredi', heureDebut:'14:00', heureFin:'16:00', type:'TD', semaine:S, recurrent:true, note:'' },
      { id:'cr-024', matiere:{id:'mat-023',nom:'Gestion de Projet Numérique',code:'CNGP201',couleur:'#E11D48'}, enseignant:ENS.AV, salle:SALLES.D102, parcours:{id:'CNGP',nom:'Communication Numérique et Gestion de Projet',code:'CNGP',couleur:'#E11D48'}, mention:{id:'mention-rpm',nom:'Relations Publiques et Multimédia',couleur:'#EC4899'}, niveau:'L2', groupe:null, jour:'Vendredi', heureDebut:'16:00', heureFin:'18:00', type:'Cours', semaine:S, recurrent:true, note:'Nouveau parcours 2024' },
      { id:'cr-025', matiere:{id:'mat-024',nom:'Anglais des Affaires',code:'TRANS101',couleur:'#64A8CC'}, enseignant:ENS.IR, salle:SALLES.C301, parcours:{id:'DA2I',nom:'Développement d\'Application Internet/Intranet',code:'DA2I',couleur:'#0EA5E9'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'L1', groupe:null, jour:'Vendredi', heureDebut:'08:00', heureFin:'10:00', type:'Cours', semaine:S, recurrent:true, note:'Tronc commun' },

      // ─── SAMEDI 21 JUIN ───────────────────────────────────────────────
      { id:'cr-026', matiere:{id:'mat-009',nom:'Intelligence Artificielle et ML',code:'M2I501',couleur:'#2563EB'}, enseignant:ENS.JR, salle:SALLES.B203, parcours:{id:'M2I',nom:'Modélisation et Ingénierie Informatique',code:'M2I',couleur:'#2563EB'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'M1', groupe:null, jour:'Samedi', heureDebut:'08:00', heureFin:'10:00', type:'TD', semaine:S, recurrent:false, note:'Séance de rattrapage' },
      { id:'cr-027', matiere:{id:'mat-015',nom:'Management Stratégique',code:'MD501',couleur:'#059669'}, enseignant:ENS.AV, salle:SALLES.D102, parcours:{id:'MD',nom:'Management Décisionnel',code:'MD',couleur:'#059669'}, mention:{id:'mention-mgt',nom:'Management',couleur:'#059669'}, niveau:'M1', groupe:null, jour:'Samedi', heureDebut:'10:30', heureFin:'12:30', type:'TD', semaine:S, recurrent:false, note:'' },

      // ─── CRÉNEAUX EN CONFLIT INTENTIONNELS (pour tester la détection) ───
      { id:'cr-028', matiere:{id:'mat-001',nom:'Programmation Web Front-End',code:'DA2I101',couleur:'#0EA5E9'}, enseignant:ENS.JR, salle:SALLES.A102, parcours:{id:'DA2I',nom:'DA2I',code:'DA2I',couleur:'#0EA5E9'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'L1', groupe:'Groupe B', jour:'Lundi', heureDebut:'09:00', heureFin:'11:00', type:'TD', semaine:S, recurrent:false, note:'⚠️ CONFLIT INTENTIONNEL : Enseignant Rakoto déjà en cours Lundi 8h–10h' },
      { id:'cr-029', matiere:{id:'mat-025',nom:'Mathématiques',code:'TRANS102',couleur:'#F59E0B'}, enseignant:ENS.LT, salle:SALLES.C301, parcours:{id:'CIGSI',nom:'CIGSI',code:'CIGSI',couleur:'#38BDF8'}, mention:{id:'mention-info',nom:'Informatique',couleur:'#38BDF8'}, niveau:'L1', groupe:null, jour:'Mardi', heureDebut:'09:00', heureFin:'11:00', type:'TD', semaine:S, recurrent:false, note:'⚠️ CONFLIT INTENTIONNEL : Salle C301 déjà occupée Mardi 8h–10h' },
      { id:'cr-030', matiere:{id:'mat-019',nom:'Communication Organisationnelle',code:'RPCO101',couleur:'#EC4899'}, enseignant:ENS.MR, salle:SALLES.A101, parcours:{id:'ICM',nom:'ICM',code:'ICM',couleur:'#F43F5E'}, mention:{id:'mention-rpm',nom:'Relations Publiques et Multimédia',couleur:'#EC4899'}, niveau:'L1', groupe:null, jour:'Mardi', heureDebut:'08:30', heureFin:'10:30', type:'Cours', semaine:S, recurrent:false, note:'⚠️ CONFLIT INTENTIONNEL : Groupe L1 ICM déjà en cours RPCO101 Mardi 8h' },
    ],
    creneauSelectionne: null,
    filtres: {
      mention: 'toutes',
      parcours: 'tous',
      niveau: 'tous',
      groupe: 'tous',
      enseignant: 'tous',
      salle: 'toutes',
      type: 'tous'
    },
    semaineCourante: new Date('2026-06-15'), // Lundi S25
    loading: false,
    modeVue: 'semaine',
    drawerOuvert: false,
    modalOuverte: false,
    creneauEnEdition: null,
    donneesParDefaut: null,
    printModalOuverte: false,
    pixelsParMinute: 1.2,
    conflits: [],
    conflitsIgnores: false
  }),
  getters: {
    emploisFiltres: (state) => {
      return state.emplois.filter(e => {
        const matchMention = state.filtres.mention === 'toutes' || e.mention.id === state.filtres.mention;
        const matchParcours = state.filtres.parcours === 'tous' || e.parcours.id === state.filtres.parcours;
        const matchNiveau = state.filtres.niveau === 'tous' || e.niveau === state.filtres.niveau;
        const matchType = state.filtres.type === 'tous' || e.type === state.filtres.type;
        const matchEnseignant = state.filtres.enseignant === 'tous' || e.enseignant.id === state.filtres.enseignant;
        const matchSalle = state.filtres.salle === 'tous' || e.salle.id === state.filtres.salle;

        return matchMention && matchParcours && matchNiveau && matchType && matchEnseignant && matchSalle;
      });
    },
    numeroSemaine: (state) => 25, // Mock static
    dateDebutSemaine: (state) => '16 Juin 2026',
    dateFinSemaine: (state) => '21 Juin 2026',

    chargesEnseignants: (state) => {
      const charges = {};
      state.emplois.forEach(e => {
        if (!charges[e.enseignant.id]) charges[e.enseignant.id] = 0;
        const start = e.heureDebut.split(':').map(Number);
        const end = e.heureFin.split(':').map(Number);
        const duree = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
        charges[e.enseignant.id] += duree / 60;
      });
      return charges;
    }
  },
  actions: {
    detecterConflits() {
      this.conflits = [];
      const slots = this.emplois;

      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const c1 = slots[i];
          const c2 = slots[j];

          if (c1.jour === c2.jour && this.chevauchement(c1, c2)) {
            // Conflit Enseignant
            if (c1.enseignant.id === c2.enseignant.id) {
              this.conflits.push({
                id: Date.now() + i + j,
                type: 'Enseignant',
                message: `${c1.enseignant.prenom} ${c1.enseignant.nom} est déjà en cours (${c1.matiere.code} et ${c2.matiere.code}) le ${c1.jour} à ${c1.heureDebut}`
              });
            }
            // Conflit Salle
            if (c1.salle.id === c2.salle.id) {
              this.conflits.push({
                id: Date.now() + i + j + 1,
                type: 'Salle',
                message: `La salle ${c1.salle.nom} est occupée par ${c1.matiere.code} et ${c2.matiere.code} le ${c1.jour} à ${c1.heureDebut}`
              });
            }
            // Conflit Groupe
            if (c1.parcours.id === c2.parcours.id && c1.niveau === c2.niveau && (c1.groupe === c2.groupe || !c1.groupe || !c2.groupe)) {
              this.conflits.push({
                id: Date.now() + i + j + 2,
                type: 'Groupe',
                message: `Le groupe ${c1.parcours.code} ${c1.niveau} a deux cours en même temps (${c1.matiere.code} et ${c2.matiere.code})`
              });
            }
          }
        }
      }
    },

    chevauchement(c1, c2) {
      const h2m = (h) => {
        const [hh, mm] = h.split(':').map(Number);
        return hh * 60 + mm;
      };
      const start1 = h2m(c1.heureDebut);
      const end1 = h2m(c1.heureFin);
      const start2 = h2m(c2.heureDebut);
      const end2 = h2m(c2.heureFin);

      return Math.max(start1, start2) < Math.min(end1, end2);
    },

    ajouterCreneau(data) {
      const id = `cr-${Math.random().toString(36).substr(2, 3).toUpperCase()}${Math.floor(Math.random() * 1000)}`;
      this.emplois.push({ id, ...data });
      this.detecterConflits();
    },

    modifierCreneau(id, data) {
      const idx = this.emplois.findIndex(e => e.id === id);
      if (idx !== -1) {
        this.emplois[idx] = { ...this.emplois[idx], ...data };
        this.detecterConflits();
      }
    },

    supprimerCreneau(id, deleteAllRecurrent = false) {
      const target = this.emplois.find(e => e.id === id);
      if (!target) return;

      if (deleteAllRecurrent && target.recurrent) {
        this.emplois = this.emplois.filter(e =>
          !(e.matiere.id === target.matiere.id && e.jour === target.jour)
        );
      } else {
        this.emplois = this.emplois.filter(e => e.id !== id);
      }
      this.detecterConflits();
    },

    changerSemaine(dir) {
      const newDate = new Date(this.semaineCourante);
      newDate.setDate(newDate.getDate() + (dir * 7));
      this.semaineCourante = newDate;
    },
    ouvrirModal(c = null, defaultData = null) {
      this.creneauEnEdition = c ? { ...c } : null;
      this.donneesParDefaut = defaultData;
      this.modalOuverte = true;
    },
    fermerModal() {
      this.modalOuverte = false;
    },
    setZoom(val) {
      this.pixelsParMinute = Math.max(0.8, Math.min(2.5, val));
    }
  }
});
