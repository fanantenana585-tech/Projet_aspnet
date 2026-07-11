<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#F0F7FF] to-[#E0F2FE] relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#38BDF8]/10 rounded-full blur-[100px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#0EA5E9]/10 rounded-full blur-[100px]"></div>

    <Transition
      appear
      enter-active-class="transition duration-700 ease-out"
      enter-from-class="opacity-0 translate-y-8"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div class="w-full max-w-md relative z-10">
        <div class="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(14,165,233,0.15)] border border-[#BFDBFE]">
          <!-- Logo / Header -->
          <div class="text-center mb-10">
            <div class="inline-block p-4 rounded-3xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] mb-6 shadow-lg shadow-[#38BDF8]/30">
              <h1 class="text-4xl font-black text-white tracking-tighter">EMIT</h1>
            </div>
            <h2 class="text-2xl font-black text-[#0C2340] mb-2">Bienvenue</h2>
            <p class="text-[#1E5F8E] font-medium">Gestion des Emplois du Temps</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Email -->
            <div class="space-y-2">
              <label class="text-xs font-black text-[#64A8CC] uppercase tracking-widest ml-1">Email</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64A8CC] group-focus-within:text-[#38BDF8] transition-colors">
                  <Mail :size="20" />
                </div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="admin@emit.mg"
                  class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] text-[#0C2340] font-bold rounded-2xl block pl-12 p-4 focus:outline-none focus:border-[#38BDF8] focus:ring-4 focus:ring-[#38BDF8]/10 transition-all placeholder:text-[#64A8CC]/50"
                  :class="{ 'border-red-300 ring-red-100': errors.email }"
                />
              </div>
              <p v-if="errors.email" class="text-red-500 text-xs mt-1 ml-1 font-bold">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label class="text-xs font-black text-[#64A8CC] uppercase tracking-widest ml-1">Mot de passe</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64A8CC] group-focus-within:text-[#38BDF8] transition-colors">
                  <Lock :size="20" />
                </div>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] text-[#0C2340] font-bold rounded-2xl block pl-12 pr-12 p-4 focus:outline-none focus:border-[#38BDF8] focus:ring-4 focus:ring-[#38BDF8]/10 transition-all placeholder:text-[#64A8CC]/50"
                  :class="{ 'border-red-300 ring-red-100': errors.password }"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-[#64A8CC] hover:text-[#38BDF8] transition-colors"
                >
                  <Eye v-if="!showPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
              <p v-if="errors.password" class="text-red-500 text-xs mt-1 ml-1 font-bold">{{ errors.password }}</p>
            </div>

            <div v-if="errors.general" class="p-4 bg-red-50 border border-red-100 rounded-2xl">
              <p class="text-red-600 text-xs text-center font-bold">{{ errors.general }}</p>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white font-black uppercase tracking-widest rounded-2xl py-4 px-6 flex items-center justify-center space-x-3 shadow-xl shadow-[#38BDF8]/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              <Loader2 v-if="isLoading" class="animate-spin" :size="20" />
              <span>{{ isLoading ? 'Connexion...' : 'Se connecter' }}</span>
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-10 pt-8 border-t border-[#F0F7FF] text-center">
            <p class="text-[#64A8CC] text-[10px] font-black uppercase tracking-[0.2em]">
              © 2026 EMIT · Management & Tech
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: '',
  general: ''
})

const showPassword = ref(false)
const isLoading = ref(false)

const validate = () => {
  let isValid = true
  errors.email = ''
  errors.password = ''
  errors.general = ''

  if (!form.email) {
    errors.email = 'L\'email est requis'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format d\'email invalide'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Le mot de passe est requis'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Le mot de passe doit faire au moins 6 caractères'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validate()) return

  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))

  const success = authStore.login(form.email, form.password)

  if (success) {
    router.push('/dashboard')
  } else {
    errors.general = 'Identifiants invalides (admin@emit.mg / password123)'
  }
  isLoading.value = false
}
</script>

<style scoped>
</style>
