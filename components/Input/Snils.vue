<script setup>
const model = defineModel()
</script>

<template>
  <NInput v-model:value="model" v-mask="'###-###-### ##'" placeholder="" />
</template>

<style scoped>

</style>