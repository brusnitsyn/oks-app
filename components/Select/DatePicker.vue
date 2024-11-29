<script setup>
const model = defineModel()
</script>

<template>
  <NDatePicker
    v-model:value="model"
    v-mask="'##.##.####'"
    placeholder=""
    format="dd.MM.yyyy"
    type="date"
    class="w-full"
  />
</template>

<style scoped>

</style>
