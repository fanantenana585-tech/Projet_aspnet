<script setup>
import { useProfessorsStore } from '@/stores/professors'
import { useAcademicStore } from '@/stores/academic'
import { User, Mail, BookOpen, GraduationCap } from 'lucide-vue-next'

const professorsStore = useProfessorsStore()
const academicStore = useAcademicStore()

const getMentionColor = (mentionId) => {
  return academicStore.getMentionById(mentionId)?.color || '#gray-400'
}

const getMentionName = (mentionId) => {
  return academicStore.getMentionById(mentionId)?.name || 'N/A'
}
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-[#F7F9FC] p-8">
    <div class="max-w-6xl mx-auto">
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-[#0D1B3E]">Gestion des Professeurs</h1>
        <p class="text-gray-500">Liste des enseignants de l'EMIT par mention et spécialité.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="prof in professorsStore.professors"
          :key="prof.id"
          class="card bg-white hover:shadow-md transition-shadow group overflow-hidden border-t-4"
          :style="{ borderTopColor: getMentionColor(prof.mentionId) }"
        >
          <div class="flex items-start gap-4 mb-4">
            <div class="w-16 h-16 rounded-full bg-[#0D1B3E] text-white flex items-center justify-center font-bold text-xl shadow-inner">
              {{ prof.initiales }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-lg text-[#0D1B3E] truncate">{{ prof.nom }}</h3>
              <p class="text-gray-600 font-medium">{{ prof.prenom }}</p>
              <span
                class="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase"
                :style="{ backgroundColor: getMentionColor(prof.mentionId) }"
              >
                {{ getMentionName(prof.mentionId) }}
              </span>
            </div>
          </div>

          <div class="space-y-3 pt-4 border-t border-gray-100">
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <BookOpen :size="16" class="text-gray-400" />
              <span>{{ prof.specialite }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <GraduationCap :size="16" class="text-gray-400" />
              <span>Enseignant Titulaire</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-gray-600">
              <Mail :size="16" class="text-gray-400" />
              <span class="truncate">{{ prof.nom.toLowerCase() }}@emit.mg</span>
            </div>
          </div>

          <button class="w-full mt-6 btn btn-outline text-xs">
            Voir l'emploi du temps
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
