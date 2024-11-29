<script setup lang="ts">
const model = defineModel()

const { data, status } = useAPI('/api/conco-diagnoses')
</script>

<template>
  <NSelect v-if="status === 'success'" v-model:value="model" multiple filterable :options="data.data" value-field="id" label-field="name" placeholder="" />
  <NSkeleton v-else :sharp="false" height="100%" width="100%" />
</template>
