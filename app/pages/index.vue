<template>
  <div>
    <AddWatermark :locale="locale" />
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
</script>

<style scoped>

</style>
