<script setup>
import { computed } from 'vue';
import { useEmploiStore } from '@/stores/emploiStore';

const props = defineProps({
  niveau: String,
  emplois: {
    type: Array,
    default: () => []
  },
  semaine: Number,
  highlightTeacher: String,
  highlightRoom: String
});

const store = useEmploiStore();

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const tranches = [
  '07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
];

const getHeureDebut = (tranche) => tranche.split('-')[0];

const grilleParJourEtHeure = computed(() => {
  const grille = {};
  const skip = {};

  tranches.forEach(tranche => {
    const h = getHeureDebut(tranche);
    grille[h] = {};
    jours.forEach(j => {
      if (skip[`${j}-${h}`]) {
        grille[h][j] = { type: 'skip' };
        return;
      }

      const creneaux = props.emplois.filter(e => e.jour === j && e.heureDebut === h);

      if (creneaux.length > 0) {
        const creneau = creneaux[0]; // Simplification: on prend le premier s'il y en a plusieurs (gestion groupes à ajouter si besoin)
        const hDebut = parseInt(creneau.heureDebut.split(':')[0]);
        const hFin = parseInt(creneau.heureFin.split(':')[0]);
        const rowspan = hFin - hDebut;

        grille[h][j] = { type: 'creneau', data: creneau, rowspan };

        // Marquer les cellules suivantes à skipper
        for (let i = 1; i < rowspan; i++) {
          const nextH = (hDebut + i).toString().padStart(2, '0') + ':00';
          skip[`${j}-${nextH}`] = true;
        }
      } else {
        grille[h][j] = { type: 'empty' };
      }
    });
  });

  return grille;
});

const isHighlighted = (creneau) => {
  if (props.highlightTeacher && props.highlightTeacher !== 'tous') {
    return creneau.enseignant.id === props.highlightTeacher;
  }
  if (props.highlightRoom && props.highlightRoom !== 'toutes') {
    return creneau.salle.id === props.highlightRoom;
  }
  return false;
};

const isDimmed = (creneau) => {
  const hasFilter = (props.highlightTeacher && props.highlightTeacher !== 'tous') ||
                    (props.highlightRoom && props.highlightRoom !== 'toutes');
  if (!hasFilter) return false;
  return !isHighlighted(creneau);
};

const dateGénération = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
});

const getSallePourNiveau = (niv) => {
  const salles = { L1: 'A101', L2: 'A205', L3: 'B303', M1: 'C102', M2: 'D201' };
  return salles[niv] || '---';
};
</script>

<template>
  <div :id="'section-' + niveau" class="bg-white p-6 shadow-lg border border-gray-200 print:shadow-none print:border-none max-w-full overflow-x-auto">
    <!-- En-tête Officiel -->
    <div class="flex justify-between items-start mb-6">
      <div class="space-y-1">
        <p class="font-bold text-[13px] uppercase">Mention : Informatique</p>
        <p class="text-[12px] uppercase">Parcours : Tronc Commun</p>
        <p class="text-[12px] uppercase">Niveau : [{{ niveau }}]</p>
      </div>

      <div class="text-center flex flex-col items-center relative">
        <h2 class="text-[20px] font-bold uppercase mb-2">EMPLOI DU TEMPS</h2>
        <div class="h-[2px] w-24 bg-gray-900"></div>

        <!-- Individual Export Button -->
        <button
          @click="store.exporterPDF('Informatique', niveau)"
          class="absolute -top-4 -right-24 bg-white border border-gray-200 text-gray-700 hover:text-blue-600 p-2 rounded shadow-sm transition-all flex items-center gap-2 text-[10px] font-bold uppercase"
        >
          📄 Exporter ce niveau
        </button>
      </div>

      <div class="text-right space-y-2">
        <p class="text-[11px] uppercase">Année Universitaire : 2025–2026</p>
        <div class="bg-[#1D4ED8] text-white px-3 py-1.5 rounded font-bold text-[12px] inline-block">
          SALLE [{{ getSallePourNiveau(niveau) }}]
        </div>
      </div>
    </div>

    <!-- Tableau Officiel -->
    <table class="w-full border-collapse border border-gray-400 table-fixed">
      <thead>
        <tr class="bg-[#E5E7EB] h-10">
          <th class="border border-gray-400 w-[110px] text-[13px] font-bold uppercase text-center">Horaires</th>
          <th v-for="j in jours" :key="j" class="border border-gray-400 text-[13px] font-bold uppercase text-center">
            {{ j }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tranche in tranches" :key="tranche" class="min-h-[64px]">
          <td class="border border-gray-400 bg-[#F9FAFB] text-[12px] text-gray-700 text-center py-4">
            {{ tranche }}
          </td>
          <template v-for="j in jours" :key="j">
            <td
              v-if="grilleParJourEtHeure[getHeureDebut(tranche)][j].type === 'creneau'"
              :rowspan="grilleParJourEtHeure[getHeureDebut(tranche)][j].rowspan"
              class="border border-gray-400 p-1.5 text-center align-middle transition-all duration-250 relative"
              :style="{
                backgroundColor: grilleParJourEtHeure[getHeureDebut(tranche)][j].data.matiere.couleur,
                opacity: isDimmed(grilleParJourEtHeure[getHeureDebut(tranche)][j].data) ? 0.3 : 1,
                border: isHighlighted(grilleParJourEtHeure[getHeureDebut(tranche)][j].data) ? '3px solid #FDE047' : '1px solid #D1D5DB',
                boxShadow: isHighlighted(grilleParJourEtHeure[getHeureDebut(tranche)][j].data) ? 'inset 0 0 0 1000px rgba(253,224,71,0.3)' : 'none'
              }"
            >
              <div class="flex flex-col items-center justify-center h-full">
                <span class="font-bold text-[13px] text-[#1F2937] uppercase leading-tight">
                  {{ grilleParJourEtHeure[getHeureDebut(tranche)][j].data.matiere.nom }}
                </span>
                <span class="text-[12px] text-[#374151] mt-1">
                  {{ grilleParJourEtHeure[getHeureDebut(tranche)][j].data.enseignant.civilité }} {{ grilleParJourEtHeure[getHeureDebut(tranche)][j].data.enseignant.nom }}
                </span>
              </div>

              <!-- Badge Conflit -->
              <div v-if="store.conflits.some(c => c.creneau1Id === grilleParJourEtHeure[getHeureDebut(tranche)][j].data.id || c.creneau2Id === grilleParJourEtHeure[getHeureDebut(tranche)][j].data.id)" class="absolute top-1 right-1">
                 <span class="text-[14px]">⚠️</span>
              </div>
            </td>
            <td
              v-else-if="grilleParJourEtHeure[getHeureDebut(tranche)][j].type === 'empty'"
              class="border border-gray-400 bg-white"
            ></td>
          </template>
        </tr>
      </tbody>
    </table>

    <!-- Pied de page -->
    <div class="mt-4 flex flex-col items-end pr-6">
      <p class="text-[12px] italic text-gray-700 mb-2">
        Fianarantsoa, le {{ dateGénération }}
      </p>
      <div class="w-[90px] h-[90px] border-2 border-dashed border-gray-300 flex items-center justify-center relative">
        <span class="text-[10px] text-[#0C2340] uppercase">[Cachet]</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  border-spacing: 0;
}
td {
  height: 64px;
}
/* Pour compacter les lignes vides si nécessaire comme mentionné */
tr:has(td.bg-white) {
  /* height: 48px; */ /* Peut être activé si toutes les cellules de la ligne sont vides */
}
</style>
