<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'

const router = useRouter()
async function back() {
  await router.back()
}
</script>

<template>
  <NButton text @click="back">
    <template #icon>
      <NIcon>
        <IconArrowLeft />
      </NIcon>
    </template>
    Назад
  </NButton>
</template>

<style scoped>

</style>