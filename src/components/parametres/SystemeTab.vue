<script setup>
import { Terminal, Download, Upload, AlertTriangle, ShieldAlert, Github, Globe, Info } from 'lucide-vue-next'

const stats = [
  { label: 'Enseignants', value: 24, color: 'text-blue-500' },
  { label: 'Salles', value: 12, color: 'text-purple-500' },
  { label: 'Matières', value: 38, color: 'text-emerald-500' },
  { label: 'Filières', value: 6, color: 'text-amber-500' }
]
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <!-- System Info -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <h3 class="text-xl font-black text-white mb-8">Informations système</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-6 bg-gray-800/40 rounded-3xl border border-gray-800 flex items-start gap-4">
          <Terminal :size="24" class="text-gray-700" />
          <div>
            <p class="text-sm font-medium text-white uppercase tracking-widest mb-1">Version</p>
            <p class="text-white font-bold">EMIT Schedule v1.0.0</p>
          </div>
        </div>
        <div class="p-6 bg-gray-800/40 rounded-3xl border border-gray-800 flex items-start gap-4">
          <Globe :size="24" class="text-gray-700" />
          <div>
            <p class="text-sm font-medium text-white uppercase tracking-widest mb-1">Environnement</p>
            <p class="text-emerald-500 font-bold uppercase tracking-wider text-xs">Production</p>
          </div>
        </div>
        <div class="p-6 bg-gray-800/40 rounded-3xl border border-gray-800 flex items-start gap-4">
          <Info :size="24" class="text-gray-700" />
          <div>
            <p class="text-sm font-medium text-white uppercase tracking-widest mb-1">Dernière mise à jour</p>
            <p class="text-white font-bold">15 Juin 2026</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Data & Export -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <h3 class="text-xl font-black text-white mb-8">Données et Export</h3>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="s in stats" :key="s.label" class="p-4 bg-gray-800/30 rounded-2xl border border-gray-800 text-center">
          <p class="text-2xl font-black text-white mb-1">{{ s.value }}</p>
          <p class="text-[9px] font-black text-gray-700 uppercase tracking-widest">{{ s.label }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 bg-gray-800/20 rounded-[2rem] border-2 border-dashed border-gray-800 flex flex-col items-center text-center space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-emit-blue/10 text-emit-blue flex items-center justify-center">
            <Download :size="24" />
          </div>
          <div>
            <h4 class="text-white font-bold">Exporter les données</h4>
            <p class="text-xs text-gray-700 mt-1">Sauvegardez l'intégralité de la base de données au format JSON.</p>
          </div>
          <button class="px-6 py-2 bg-emit-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emit-blue/20">Exporter JSON</button>
        </div>

        <div class="p-6 bg-gray-800/20 rounded-[2rem] border-2 border-dashed border-gray-800 flex flex-col items-center text-center space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Upload :size="24" />
          </div>
          <div>
            <h4 class="text-white font-bold">Importer des données</h4>
            <p class="text-xs text-gray-700 mt-1">Restaurez une sauvegarde ou importez des fichiers externes.</p>
          </div>
          <button class="px-6 py-2 bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-purple-500/20">Choisir un fichier</button>
        </div>
      </div>
    </section>

    <!-- Danger Zone -->
    <section class="bg-red-500/5 rounded-3xl border border-red-500/20 p-8 shadow-xl">
      <div class="flex items-center gap-4 mb-8">
        <div class="p-3 bg-red-500/10 text-red-500 rounded-2xl">
          <ShieldAlert :size="28" />
        </div>
        <div>
          <h3 class="text-xl font-black text-red-500 uppercase tracking-tight">Zone de danger</h3>
          <p class="text-sm text-red-500/60 font-medium">Actions irréversibles pour la gestion des données.</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="p-6 bg-gray-800/20 rounded-3xl border border-gray-800 flex items-center justify-between gap-6">
          <div>
            <h4 class="text-white font-bold">Réinitialiser les paramètres</h4>
            <p class="text-xs text-gray-700">Remettre tous les paramètres système à leurs valeurs par défaut.</p>
          </div>
          <button class="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Réinitialiser</button>
        </div>

        <div class="p-6 bg-gray-800/20 rounded-3xl border border-gray-800 flex items-center justify-between gap-6">
          <div>
            <h4 class="text-white font-bold">Effacer les emplois du temps</h4>
            <p class="text-xs text-gray-700">Vider toutes les planifications de tous les semestres.</p>
          </div>
          <button class="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Tout vider</button>
        </div>
      </div>
    </section>

    <!-- About -->
    <section class="text-center py-12">
      <div class="w-20 h-20 bg-gradient-to-br from-emit-blue to-emit-purple rounded-3xl flex items-center justify-center text-2xl font-black text-white shadow-2xl mx-auto mb-6">EMIT</div>
      <h4 class="text-white font-black uppercase tracking-[0.3em] mb-2">EMIT Management System</h4>
      <p class="text-gray-700 text-xs mb-8">Développé pour l'École de Management et d'Innovation Technologique</p>

      <div class="flex justify-center gap-6">
        <a href="#" class="text-gray-700 hover:text-white transition-colors"><Github :size="20" /></a>
        <a href="#" class="text-gray-700 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest">Documentation</a>
        <a href="#" class="text-gray-700 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest">Changelog</a>
      </div>
      <p class="mt-12 text-[10px] text-gray-700 font-bold uppercase tracking-widest">© 2026 EMIT · Université de Fianarantsoa</p>
    </section>
  </div>
</template>

