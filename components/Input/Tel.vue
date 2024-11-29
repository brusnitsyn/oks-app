<script setup>
const model = defineModel()
</script>

<template>
  <NInput v-model:value="model" v-mask="'+7 (###) ###-##-##'" placeholder="" />
</template>

<style scoped>

</style>