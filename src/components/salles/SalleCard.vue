<script setup>
import { computed } from 'vue'
import { Users, Building2, MapPin, Monitor, Wifi, Wind, Video, Maximize2, Edit2, Trash2, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({
  salle: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'delete'])

const statusConfig = {
  disponible: {
    border: 'border-t-emerald-500',
    bg: 'bg-emerald-50 text-emerald-600',
    dot: 'bg-emerald-500'
  },
  occupée: {
    border: 'border-t-red-500',
    bg: 'bg-red-50 text-red-600',
    dot: 'bg-red-500'
  },
  maintenance: {
    border: 'border-t-orange-500',
    bg: 'bg-orange-50 text-orange-600',
    dot: 'bg-orange-500'
  }
}

const config = computed(() => statusConfig[props.salle.statut] || statusConfig.disponible)

const equipementIcons = {
  'Vidéoprojecteur': Video,
  'WiFi': Wifi,
  'Climatisation': Wind,
  'Ordinateurs': Monitor,
  'Tableau blanc': Edit2,
  'Tableau interactif': Maximize2,
  'Sono': Wind,
  'Webcam': Video
}

const getIcon = (name) => equipementIcons[name] || CheckCircle2
</script>

<template>
  <div
    class="bg-white rounded-[2.5rem] border-t-4 p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(14,165,233,0.1)] group relative overflow-hidden"
    :class="[config.border]"
  >
    <!-- Background Decor -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-[#F0F9FF] rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

    <!-- Header -->
    <div class="flex justify-between items-start mb-8 relative z-10">
      <div>
        <h3 class="text-2xl font-black text-[#0C2340] group-hover:text-[#38BDF8] transition-colors leading-tight mb-1">
          {{ salle.nom }}
        </h3>
        <span class="text-[10px] font-black uppercase tracking-widest text-[#64A8CC]">
          {{ salle.type }}
        </span>
      </div>
      <div :class="['flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white shadow-sm text-[9px] font-black uppercase tracking-widest', config.bg]">
        <div class="relative flex h-2 w-2">
          <span :class="['animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.dot]"></span>
          <span :class="['relative inline-flex rounded-full h-2 w-2', config.dot]"></span>
        </div>
        {{ salle.statut }}
      </div>
    </div>

    <!-- Body -->
    <div class="space-y-6 mb-10 relative z-10">
      <div class="grid grid-cols-2 gap-6">
        <div class="flex items-center gap-3 text-sm text-[#1E5F8E]">
          <div class="w-8 h-8 rounded-lg bg-[#F0F9FF] flex items-center justify-center text-[#38BDF8]">
            <Users :size="16" />
          </div>
          <span class="font-bold">{{ salle.capacite }} places</span>
        </div>
        <div class="flex items-center gap-3 text-sm text-[#1E5F8E]">
          <div class="w-8 h-8 rounded-lg bg-[#F0F9FF] flex items-center justify-center text-[#38BDF8]">
            <Building2 :size="16" />
          </div>
          <span class="font-bold truncate">{{ salle.batiment }}</span>
        </div>
      </div>

      <div class="flex items-center gap-3 text-sm text-[#1E5F8E]">
        <div class="w-8 h-8 rounded-lg bg-[#F0F9FF] flex items-center justify-center text-[#38BDF8]">
          <MapPin :size="16" />
        </div>
        <span class="font-bold">{{ salle.etage === 0 ? 'Rez-de-chaussée' : salle.etage + (salle.etage === 1 ? 'er' : 'ème') + ' étage' }}</span>
      </div>

      <!-- Equipements -->
      <div class="flex flex-wrap gap-2 pt-2">
        <div
          v-for="eq in salle.equipements"
          :key="eq"
          class="p-2 bg-[#F0F7FF] rounded-xl text-[#64A8CC] hover:text-[#38BDF8] transition-all border border-[#E1EFFF] shadow-sm"
          :title="eq"
        >
          <component :is="getIcon(eq)" :size="16" />
        </div>
      </div>

      <!-- Progress -->
      <div class="space-y-3 pt-2">
        <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
          <span class="text-[#64A8CC]">Occupation</span>
          <span class="text-[#0C2340]">{{ salle.tauxOccupation }}%</span>
        </div>
        <div class="h-1.5 w-full bg-[#F0F7FF] rounded-full overflow-hidden p-[2px]">
          <div
            class="h-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] rounded-full transition-all duration-700"
            :style="{ width: salle.tauxOccupation + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="flex items-center justify-between pt-6 border-t border-[#F0F7FF] relative z-10">
      <div class="flex gap-2">
        <button @click="emit('edit', salle)" class="p-2.5 text-[#64A8CC] hover:text-[#38BDF8] hover:bg-[#F0F9FF] rounded-xl transition-all"><Edit2 :size="20" /></button>
        <button @click="emit('delete', salle.id)" class="p-2.5 text-[#64A8CC] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 :size="20" /></button>
      </div>

      <div class="flex gap-2">
        <button v-if="salle.statut === 'disponible'" class="px-6 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Réserver</button>
        <button @click="emit('view', salle)" class="p-3 bg-[#F0F9FF] text-[#38BDF8] rounded-2xl hover:bg-[#38BDF8] hover:text-white transition-all shadow-sm"><Maximize2 :size="20" /></button>
      </div>
    </div>
  </div>
</template>
