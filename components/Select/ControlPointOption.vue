<script setup lang="ts">
const model = defineModel()

const data = useNuxtData('control-point').data
</script>

<template>
  <NSelect v-model:value="model" filterable :options="data" value-field="id" label-field="name" placeholder="Норма" />
</template>
