<script setup>
import { computed, ref } from 'vue';
import { useEmploiStore } from '@/stores/emploiStore';
import { User, MapPin, Users, Clock, AlertTriangle } from 'lucide-vue-next';

const props = defineProps({
  creneau: { type: Object, required: true },
  enConflit: { type: Boolean, default: false },
  pixelsParMinute: { type: Number, default: 1.4 }
});

const emit = defineEmits(['ouvrir-detail', 'drag-start', 'drag-end']);
const store = useEmploiStore();
const showTooltip = ref(false);
const tooltipPos = ref({ x: 0, y: 0 });

const heureEnMinutes = (heure) => {
  const [h, m] = heure.split(':').map(Number);
  return h * 60 + m;
};

const top = computed(() => {
  return (heureEnMinutes(props.creneau.heureDebut) - heureEnMinutes('07:00')) * props.pixelsParMinute;
});

const height = computed(() => {
  const duree = heureEnMinutes(props.creneau.heureFin) - heureEnMinutes(props.creneau.heureDebut);
  return (duree * props.pixelsParMinute) - 4;
});

const isShort = computed(() => {
  const duree = heureEnMinutes(props.creneau.heureFin) - heureEnMinutes(props.creneau.heureDebut);
  return duree < 90;
});

const mentionAbbr = computed(() => {
  const nom = props.creneau?.mention?.nom ?? '';
  if (nom.includes('Informatique')) return 'Info';
  if (nom.includes('Management')) return 'Mgt';
  if (nom.includes('Relations Publiques')) return 'RPM';
  return nom ? nom.substring(0, 4) : '';
});

const handleDragStart = (e) => {
  e.dataTransfer.setData('creneauId', props.creneau.id);
  e.dataTransfer.effectAllowed = 'move';
  store.draggedCreneauId = props.creneau.id;
};

const handleDragEnd = () => {
  store.draggedCreneauId = null;
};

const updateTooltipPos = (e) => {
  tooltipPos.value = { x: e.clientX + 15, y: e.clientY + 15 };
};

</script>

<template>
  <div
    class="creneau-card absolute left-1 right-1 rounded-xl border-l-4 overflow-hidden cursor-pointer transition-all duration-300 z-10 hover:z-50"
    :style="{
      top: top + 'px',
      height: height + 'px',
      backgroundColor: creneau.matiere.couleur + 'F2',
      borderLeftColor: creneau.matiere.couleur,
      opacity: store.draggedCreneauId === creneau.id ? 0.5 : 1,
      transform: store.draggedCreneauId === creneau.id ? 'scale(0.98)' : 'none'
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click="store.ouvrirModal(creneau)"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    @mousemove="updateTooltipPos"
    :class="{ 'border-2 border-red-600 animate-conflict-blink shadow-lg': enConflit }"
  >
    <div v-if="enConflit" class="absolute top-1 right-1 text-red-600 bg-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm z-20">
      <AlertTriangle :size="12" />
    </div>

    <div class="p-2 h-full flex flex-col text-white">
      <!-- Header -->
      <div class="flex justify-between items-start gap-0.5 mb-0.5">
        <span class="bg-white/25 text-[8px] font-black font-mono px-1 py-0.5 rounded uppercase tracking-wider">
          {{ creneau.matiere.code }}
        </span>
        <span v-if="!isShort" class="bg-white/20 text-[7px] px-1 py-0.5 rounded font-black uppercase tracking-widest">
          {{ creneau.type }}
        </span>
      </div>

      <!-- Nom -->
      <h4 class="font-black text-[10px] leading-tight line-clamp-2 mb-0.5 drop-shadow-sm" :class="{ 'line-clamp-1': isShort }">
        {{ creneau.matiere.nom }}
      </h4>

      <!-- EMIT Badges -->
      <div class="flex items-center gap-1 mb-1 overflow-hidden">
         <span class="bg-white/20 text-[7px] font-black px-1 py-0.5 rounded-md uppercase tracking-tighter whitespace-nowrap">
           {{ creneau.parcours.code }} {{ creneau.niveau }}
         </span>
         <span class="text-[7px] font-black uppercase tracking-widest opacity-80 whitespace-nowrap">
           {{ mentionAbbr }}
         </span>
      </div>

      <!-- Detail Infos -->
      <div v-if="!isShort" class="mt-auto space-y-0.5">
        <div class="flex items-center gap-1 opacity-90 text-[9px] font-bold">
          <User :size="9" stroke-width="3" />
          <span class="truncate">{{ creneau.enseignant.nom }}</span>
        </div>
        <div class="flex items-center gap-1 opacity-90 text-[9px] font-bold">
          <MapPin :size="9" stroke-width="3" />
          <span class="truncate">{{ creneau.salle.nom }}</span>
        </div>
      </div>

      <!-- Very Short Mode -->
      <div v-else-if="height > 40" class="text-[9px] opacity-90 flex gap-2 font-black mt-auto">
        <span class="truncate">{{ creneau.salle.nom }}</span>
      </div>
    </div>

    <!-- Tooltip -->
    <Teleport to="body">
       <Transition name="fade">
          <div
            v-if="showTooltip"
            class="fixed z-[1000] bg-[#0C2340] text-white p-5 rounded-[2rem] shadow-2xl border border-white/10 pointer-events-none w-72 animate-tooltip-in"
            :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }"
          >
            <div class="flex justify-between items-start mb-3">
               <span class="px-2 py-0.5 rounded-lg bg-[#38BDF8] text-[10px] font-black uppercase tracking-widest">{{ creneau.matiere.code }}</span>
               <span class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">{{ creneau.type }}</span>
            </div>

            <p class="font-black text-lg leading-tight mb-4">{{ creneau.matiere.nom }}</p>

            <div class="space-y-3 text-[11px]">
              <div class="flex items-center gap-3 text-[#38BDF8] font-bold">
                <Clock :size="14" />
                <span>{{ creneau.heureDebut }} — {{ creneau.heureFin }} ({{ creneau.jour }})</span>
              </div>
              <div class="flex items-center gap-3">
                <User :size="14" class="text-[#64A8CC]" />
                <span class="font-bold">{{ creneau.enseignant.prenom }} {{ creneau.enseignant.nom }}</span>
              </div>
              <div class="flex items-center gap-3">
                <MapPin :size="14" class="text-[#64A8CC]" />
                <span class="font-bold">{{ creneau.salle.nom }} · {{ creneau.salle.batiment }}</span>
              </div>
              <div class="flex items-center gap-3">
                <Users :size="14" class="text-[#64A8CC]" />
                <span class="font-bold">{{ creneau.parcours.nom }} {{ creneau.niveau }} {{ creneau.groupe || '' }}</span>
              </div>
            </div>

            <div v-if="creneau.note" class="mt-4 pt-4 border-t border-white/10 italic text-white/60 text-[10px] leading-relaxed">
              "{{ creneau.note }}"
            </div>
          </div>
       </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.creneau-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.3);
}

@keyframes conflict-blink {
  0%, 100% { border-color: #DC2626; box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
  50% { border-color: transparent; box-shadow: 0 0 15px 5px rgba(220, 38, 38, 0.2); }
}

@keyframes tooltip-in {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
