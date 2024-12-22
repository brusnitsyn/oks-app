<script setup>
const model = defineModel()
</script>

<template>
<!--  <NSelect v-model:value="model" :show="false" filterable multiple tag placeholder="" v-mask="'+7 (###) ###-##-##'" :show-arrow="false" />-->
  <NInput v-model:value="model" v-mask="'+7 (###) ###-##-##'" placeholder="" />
</template>

<style scoped>

</style>