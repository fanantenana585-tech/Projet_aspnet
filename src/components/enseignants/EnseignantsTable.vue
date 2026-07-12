<script setup>
import { Edit2, Trash2, Users } from 'lucide-vue-next'

defineProps({
  enseignants: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="bg-[#1E293B] rounded-[2.5rem] border border-[#334155] overflow-hidden shadow-2xl animate-in fade-in duration-700">
    <div v-if="enseignants.length === 0" class="flex flex-col items-center justify-center p-20 text-center">
      <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-500 shadow-inner">
        <Users :size="48" />
      </div>
      <h3 class="text-xl font-bold text-white mb-2">Aucun enseignant enregistré pour le moment</h3>
      <p class="text-gray-400 font-medium">Ajoutez un enseignant pour le voir apparaître ici.</p>
    </div>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left whitespace-nowrap">
        <thead>
          <tr class="bg-[#0F172A] border-b border-[#334155]">
            <th class="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Nom complet</th>
            <th class="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Spécialité</th>
            <th class="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Grade</th>
            <th class="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Charge Max</th>
            <th class="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
            <th class="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Matières assignées</th>
            <th class="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#334155]">
          <tr v-for="e in enseignants" :key="e.id" class="hover:bg-gray-800/50 transition-colors group">
            <td class="px-8 py-5">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center text-white font-black shadow-lg">
                  {{ e.prenom.charAt(0) }}{{ e.nom.charAt(0) }}
                </div>
                <div>
                  <p class="text-sm font-bold text-white">{{ e.prenom }} {{ e.nom }}</p>
                  <p class="text-[11px] font-medium text-gray-400">{{ e.email }} <span v-if="e.telephone">· {{ e.telephone }}</span></p>
                </div>
              </div>
            </td>
            <td class="px-8 py-5">
              <span class="px-3 py-1 bg-gray-800 text-emit-blue rounded-lg text-xs font-bold border border-gray-700">
                {{ e.specialite }}
              </span>
            </td>
            <td class="px-8 py-5 text-sm font-semibold text-gray-300">{{ e.grade }}</td>
            <td class="px-8 py-5 text-sm text-center font-bold text-emit-blue">{{ e.maxHeures || 20 }} h</td>
            <td class="px-8 py-5">
              <div :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-2',
                e.statut === 'Actif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20']">
                <div :class="['w-1.5 h-1.5 rounded-full', e.statut === 'Actif' ? 'bg-emerald-500' : 'bg-gray-500']"></div>
                {{ e.statut }}
              </div>
            </td>
            <td class="px-8 py-5">
              <div class="flex flex-wrap gap-2 max-w-xs">
                <span v-for="(mat, idx) in (e.matieres || []).slice(0, 3)" :key="idx" class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0F172A] text-gray-300 border border-[#334155]">
                  {{ mat }}
                </span>
                <span v-if="(e.matieres || []).length > 3" class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0F172A] text-gray-300 border border-[#334155]">
                  +{{ e.matieres.length - 3 }}
                </span>
                <span v-if="!e.matieres || e.matieres.length === 0" class="text-xs text-gray-500 italic">Aucune matière</span>
              </div>
            </td>
            <td class="px-8 py-5 text-right">
              <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="emit('edit', e)" class="p-2 text-gray-400 hover:text-emit-blue hover:bg-gray-800 rounded-lg transition-colors"><Edit2 :size="18" /></button>
                <button @click="emit('delete', e.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors"><Trash2 :size="18" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
