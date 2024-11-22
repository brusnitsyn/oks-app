import VueTheMask from 'vue-the-mask'

export default defineNuxtPlugin(async (nitroApp) => {
  nitroApp.vueApp.use(VueTheMask)
})
