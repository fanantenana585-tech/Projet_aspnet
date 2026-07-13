<script setup>
import { ref, computed, watch } from 'vue';
import { useEmploiStore } from '@/stores/emploiStore';
import { useFiliereStore } from '@/stores/filiereStore';
import { FileDown, X, Check, Loader2, Printer, Layout, FileText } from 'lucide-vue-next';

const store = useEmploiStore();
const filiereStore = useFiliereStore();
const isGenerating = ref(false);

const printForm = ref({
  mention: '',
  parcours: '',
  niveau: 'L1',
  format: 'A4 Paysage',
  style: 'Standard',
  includeLogo: true,
  fullNames: true,
  color: true
});

const filteredParcours = computed(() => {
  return filiereStore.parcours.filter(p => p.mentionId === printForm.value.mention);
});

watch(
  () => filiereStore.mentions,
  () => {
    if (filiereStore.mentions.length > 0 && !printForm.value.mention) {
      printForm.value.mention = filiereStore.mentions[0].id;
    }
  },
  { immediate: true }
);

watch(
  filteredParcours,
  () => {
    if (filteredParcours.value.length > 0 && !printForm.value.parcours) {
      printForm.value.parcours = filteredParcours.value[0].id;
    }
  },
  { immediate: true }
);

const handleMentionChange = () => {
  const firstP = filteredParcours.value[0];
  if (firstP) printForm.value.parcours = firstP.id;
};

const generatePDF = async () => {
  const target = document.getElementById('emploi-export-zone');
  if (!target) {
    console.error('Element d export introuvable : #emploi-export-zone');
    return;
  }

  isGenerating.value = true;

  try {
    const { default: html2pdf } = await import('html2pdf.js');
    const orientation = printForm.value.format.includes('Paysage') ? 'landscape' : 'portrait';
    const paperFormat = printForm.value.format.split(' ')[0] || 'A4';
    const filename = `planning-${printForm.value.parcours || 'emploi'}-${new Date().toISOString().slice(0, 10)}.pdf`;

    const options = {
      margin: [10, 10, 10, 10],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: paperFormat, orientation },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    await html2pdf().set(options).from(target).save();
  } catch (error) {
    console.error('Erreur lors de la génération PDF :', error);
  } finally {
    isGenerating.value = false;
    store.printModalOuverte = false;
  }
};

</script>

<template>
  <Transition name="modal-fade">
    <div v-if="store.printModalOuverte" class="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#0C2340]/60 backdrop-blur-md" @click="store.printModalOuverte = false"></div>

      <div class="bg-white rounded-[3rem] p-10 max-w-2xl w-full relative border border-[#BFDBFE] shadow-[0_40px_100px_rgba(0,0,0,0.3)] flex flex-col gap-8 overflow-hidden animate-in zoom-in duration-300">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-48 h-48 bg-[#F0F9FF] rounded-bl-[120px] -z-10 opacity-60"></div>

        <div class="flex justify-between items-start">
           <div class="flex items-center gap-6">
              <div class="w-16 h-16 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-lg shadow-red-100 border border-red-100">
                 <FileDown :size="32" />
              </div>
              <div>
                 <h3 class="text-[#0C2340] text-2xl font-black tracking-tight">Exporter en PDF</h3>
                 <p class="text-[#64A8CC] font-black uppercase text-[10px] tracking-[0.2em] mt-1">Template Officiel EMIT Fianarantsoa</p>
              </div>
           </div>
           <button @click="store.printModalOuverte = false" class="p-3 bg-white rounded-2xl text-[#64A8CC] hover:text-red-500 shadow-sm border border-[#BFDBFE] transition-all">
             <X :size="20" />
           </button>
        </div>

        <div class="space-y-8">
          <!-- Source Selection -->
          <div class="grid grid-cols-2 gap-6 p-6 bg-[#F8FBFF] rounded-[2rem] border border-[#BFDBFE]/50">
             <div class="space-y-2">
                <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Mention</label>
                <select v-model="printForm.mention" @change="handleMentionChange" class="w-full bg-white border-2 border-[#BFDBFE] rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-[#38BDF8]">
                   <option v-for="m in filiereStore.mentions" :key="m.id" :value="m.id">{{ m.icone }} {{ m.nom }}</option>
                </select>
             </div>
             <div class="space-y-2">
                <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Parcours</label>
                <select v-model="printForm.parcours" class="w-full bg-white border-2 border-[#BFDBFE] rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-[#38BDF8]">
                   <option v-for="p in filteredParcours" :key="p.id" :value="p.id">[{{ p.code }}] {{ p.nomCourt }}</option>
                </select>
             </div>
          </div>

          <!-- Config -->
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Format Papier</label>
              <div class="relative">
                 <Layout class="absolute left-4 top-1/2 -translate-y-1/2 text-[#38BDF8]" :size="18" />
                 <select v-model="printForm.format" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] rounded-xl pl-12 pr-4 py-3 font-bold text-sm outline-none focus:border-[#38BDF8]">
                   <option>A4 Paysage</option>
                   <option>A4 Portrait</option>
                   <option>A3 Paysage</option>
                 </select>
              </div>
            </div>
            <div class="space-y-2">
               <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Mise en page</label>
               <div class="relative">
                  <FileText class="absolute left-4 top-1/2 -translate-y-1/2 text-[#38BDF8]" :size="18" />
                  <select v-model="printForm.style" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] rounded-xl pl-12 pr-4 py-3 font-bold text-sm outline-none focus:border-[#38BDF8]">
                   <option>Compacte</option>
                   <option>Standard</option>
                   <option>Aérée</option>
                 </select>
               </div>
            </div>
          </div>

          <!-- Options -->
          <div class="bg-[#F0F9FF] p-6 rounded-[2rem] border-2 border-[#BFDBFE] grid grid-cols-2 gap-4">
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="w-6 h-6 rounded-lg border-2 border-[#BFDBFE] flex items-center justify-center transition-all group-hover:border-[#38BDF8]" :class="printForm.includeLogo ? 'bg-[#38BDF8] border-[#38BDF8]' : 'bg-white'">
                 <Check v-if="printForm.includeLogo" :size="14" class="text-white" />
                 <input type="checkbox" v-model="printForm.includeLogo" class="hidden">
              </div>
              <span class="text-xs font-black text-[#1E5F8E] uppercase tracking-widest">Inclure le logo EMIT</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="w-6 h-6 rounded-lg border-2 border-[#BFDBFE] flex items-center justify-center transition-all group-hover:border-[#38BDF8]" :class="printForm.fullNames ? 'bg-[#38BDF8] border-[#38BDF8]' : 'bg-white'">
                 <Check v-if="printForm.fullNames" :size="14" class="text-white" />
                 <input type="checkbox" v-model="printForm.fullNames" class="hidden">
              </div>
              <span class="text-xs font-black text-[#1E5F8E] uppercase tracking-widest">Noms complets</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="w-6 h-6 rounded-lg border-2 border-[#BFDBFE] flex items-center justify-center transition-all group-hover:border-[#38BDF8]" :class="printForm.color ? 'bg-[#38BDF8] border-[#38BDF8]' : 'bg-white'">
                 <Check v-if="printForm.color" :size="14" class="text-white" />
                 <input type="checkbox" v-model="printForm.color" class="hidden">
              </div>
              <span class="text-xs font-black text-[#1E5F8E] uppercase tracking-widest">Couleurs matières</span>
            </label>
          </div>
        </div>

        <div class="flex gap-6 pt-4">
          <button
            @click="store.printModalOuverte = false"
            class="flex-1 py-5 bg-white border-2 border-[#BFDBFE] text-[#64A8CC] font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[#F0F9FF] hover:text-[#0C2340] transition-all"
          >
            Annuler
          </button>
          <button
            @click="generatePDF"
            :disabled="isGenerating"
            class="flex-1 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-red-200 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
          >
            <Loader2 v-if="isGenerating" :size="18" class="animate-spin" />
            <Printer v-else :size="18" />
            {{ isGenerating ? 'Génération...' : 'Exporter le planning' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
