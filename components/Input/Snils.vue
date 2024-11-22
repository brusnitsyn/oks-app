<script setup>
const model = defineModel()
</script>

<template>
  <NInput v-model:value="model" v-mask="'###-###-### ##'" placeholder="123-456-789 00" />
</template>

<style scoped>

</style>