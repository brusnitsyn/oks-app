<script setup>
const model = defineModel()
</script>

<template>
  <NInput v-model:value="model" v-mask="'+7 (###) ###-##-##'" placeholder="+7 (914) 599-29-29" />
</template>

<style scoped>

</style>