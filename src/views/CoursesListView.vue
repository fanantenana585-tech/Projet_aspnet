<script setup>
import { useCoursesStore } from '@/stores/courses'
import { useProfessorsStore } from '@/stores/professors'

const coursesStore = useCoursesStore()
const professorsStore = useProfessorsStore()

const getProfessorName = (id) => {
  const p = professorsStore.getProfessorById(id)
  return p ? `${p.prenom} ${p.nom}` : 'Inconnu'
}
</script>

<template>
  <div class="max-w-[1600px] mx-auto p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-poppins font-bold text-[#0D1B3E]">Liste des Cours</h1>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-widest">Cours</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-widest">Enseignant</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-widest">Promotion</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-widest">Horaire</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-widest">Salle</th>
            <th class="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-widest text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="course in coursesStore.courses" :key="course.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <p class="font-bold text-[#0D1B3E]">{{ course.nom }}</p>
              <p class="text-[10px] text-emerald-600 font-bold uppercase">{{ course.departement }}</p>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ getProfessorName(course.professeurId) }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">{{ course.promotion }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">{{ course.jour }} {{ course.creneau }}</td>
            <td class="px-6 py-4 text-sm font-bold text-[#0D1B3E]">{{ course.salle }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="coursesStore.deleteCourse(course.id)" class="text-[#0C2340] hover:text-red-500 transition-colors">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
