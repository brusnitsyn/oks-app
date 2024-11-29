<script setup lang="ts">

</script>

<template>
  <div class="min-h-screen max-h-screen relative">
    <NFlex vertical justify="center" class="h-screen max-w-full">
      <NFlex justify="center">
        <slot />
      </NFlex>
    </NFlex>
<!--    <div class="absolute inset-y-0 inset-x-0">-->
<!--      <div class="h-full w-screen bg-cover bg-no-repeat bg-center" style="background-image: url('/img/bg-b.svg')" />-->
<!--    </div>-->
  </div>
</template>

<style scoped>

</style>
