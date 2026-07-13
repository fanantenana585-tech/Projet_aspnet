import { defineStore } from 'pinia';

export const useFiliereStore = defineStore('filiere', {
  state: () => ({
    mentions: [],
    parcours: [], // Flattened list for searching and filtering
    loading: false,
    error: null,
    notification: { type: '', text: '' },
    filtres: {
      search: '',
      mention: 'toutes',
      niveau: 'tous',
      statut: 'toutes',
      ouvertConcours: false
    },
    modeVue: 'mentions',
    modalOuverte: false,
    parcoursEnEdition: null,
    detailOuvert: false
  }),

  getters: {
    parcoursFiltres: (state) => {
      return state.parcours.filter(p => {
        const matchSearch = p.nom.toLowerCase().includes(state.filtres.search.toLowerCase()) ||
                            p.code.toLowerCase().includes(state.filtres.search.toLowerCase());
        const matchMention = state.filtres.mention === 'toutes' || p.mentionId === state.filtres.mention;
        const matchConcours = !state.filtres.ouvertConcours || p.ouvertConcours;
        const matchStatut = state.filtres.statut === 'toutes' ||
          (state.filtres.statut === 'actif' && p.actif) ||
          (state.filtres.statut === 'inactif' && !p.actif);
        return matchSearch && matchMention && matchConcours && matchStatut;
      });
    },
    statsGlobales: (state) => {
      const totalEtudiants = state.parcours.reduce((acc, p) => acc + (p.nbEtudiants || 0), 0);
      const totalParcours = state.parcours.length;
      const totalLicences = state.parcours.filter(p => p.niveau === 'Licence').length;
      const totalMasters = state.parcours.filter(p => p.niveau === 'Master').length;
      return { totalEtudiants, totalParcours, totalLicences, totalMasters };
    }
  },

  actions: {
    ouvrirModal(p = null) {
      this.parcoursEnEdition = p;
      this.modalOuverte = true;
    },
    fermerModal() {
      this.modalOuverte = false;
      this.parcoursEnEdition = null;
    },
    ouvrirDetail(p) {
      this.parcoursEnEdition = p;
      this.detailOuvert = true;
    },
    fermerDetail() {
      this.detailOuvert = false;
      this.parcoursEnEdition = null;
    },
    async fetchFilieres() {
      this.loading = true;
      try {
        const res = await fetch('/api/filieres');
        if (res.ok) {
          const data = await res.json();
          const mentionsWithResponsable = data.map(m => ({
            ...m,
            responsable: {
              nom: m.responsableNom,
              prenom: m.responsablePrenom,
              initiales: `${m.responsablePrenom?.[0] || ''}${m.responsableNom?.[0] || ''}`
            }
          }));

          this.mentions = mentionsWithResponsable;
          // Flatten parcours for the list/grid views
          const allParcours = [];
          mentionsWithResponsable.forEach(m => {
            m.parcours.forEach(p => {
              const responsable = p.responsableEnseignant || {
                nom: m.responsableNom,
                prenom: m.responsablePrenom,
                initiales: `${m.responsablePrenom?.[0] || ''}${m.responsableNom?.[0] || ''}`
              };

              allParcours.push({
                ...p,
                actif: p.actif ?? true,
                mentionNom: m.nom,
                mentionIcone: m.icone,
                mentionCouleur: m.couleur,
                responsable,
                couleur: m.couleur // Use mention color as default for parcours
              });
            });
          });
          this.parcours = allParcours;
        }
      } catch (err) {
        console.error(err);
        this.error = "Erreur de chargement des filières";
      } finally {
        this.loading = false;
      }
    },
    setNotification(type, text) {
      this.notification = { type, text };
      // Auto-clear notification after 5 seconds
      setTimeout(() => {
        this.notification = { type: '', text: '' };
      }, 5000);
    },
    async ajouterParcours(data) {
        try {
            const res = await fetch('/api/filieres/parcours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const body = await res.json().catch(() => null);
            if (res.ok) {
                this.setNotification('success', 'Parcours ajouté avec succès.');
                await this.fetchFilieres();
                this.fermerModal();
                return true;
            }
            // Gestion des erreurs de validation du backend (400)
            if (res.status === 400) {
                const errorMessage = body || 'Erreur de validation';
                this.setNotification('error', errorMessage);
                return false;
            }
            const errorMessage = body?.title || body?.message || JSON.stringify(body) || res.statusText;
            this.setNotification('error', `Erreur : ${errorMessage}`);
            return false;
        } catch (err) {
            console.error(err);
            this.setNotification('error', 'Erreur réseau lors de l’ajout du parcours.');
            return false;
        }
    },    async modifierParcours(data) {
      try {
        const res = await fetch(`/api/filieres/parcours/${data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const body = await res.json().catch(() => null);
        if (res.ok) {
          this.setNotification('success', 'Parcours modifié avec succès.');
          await this.fetchFilieres();
          this.fermerModal();
          return true;
        }
        // Gestion des erreurs de validation du backend (400/404)
        if (res.status === 400) {
          const errorMessage = body?.message || body || 'Erreur de validation';
          this.setNotification('error', errorMessage);
          return false;
        }
        if (res.status === 404) {
          const errorMessage = body?.message || 'Parcours non trouvé';
          this.setNotification('error', errorMessage);
          return false;
        }
        const errorMessage = body?.title || body?.message || JSON.stringify(body) || res.statusText;
        this.setNotification('error', `Erreur : ${errorMessage}`);
        return false;
      } catch (err) {
        console.error(err);
        this.setNotification('error', 'Erreur réseau lors de la modification du parcours.');
        return false;
      }
    },    async supprimerParcours(id) {
        try {
            const res = await fetch(`/api/filieres/parcours/${id}`, { method: 'DELETE' });
            if (res.ok) {
                this.setNotification('success', 'Parcours supprimé avec succès.');
                await this.fetchFilieres();
                return true;
            } else {
                this.setNotification('error', 'Erreur lors de la suppression.');
                return false;
            }
        } catch (err) {
            console.error(err);
            this.setNotification('error', 'Erreur réseau lors de la suppression.');
            return false;
        }
    }
  }
});
