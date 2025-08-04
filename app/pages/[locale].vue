<template>
  <div>
    <AddWatermark :locale="localeParam" />
  </div>
</template>

<script setup>
const route = useRoute()

// Get locale from route parameter
const localeParam = route.params.locale
</script>

<style scoped>

</style>