<template>
  <NuxtPage />
  <footer class="footer">
    <div id="langs" class="buttons is-centered mb-4">
      <NuxtLink
        v-for="locale in locales"
        :key="locale.code"
        :to="switchLocalePath(locale.code)"
        class="button is-small is-light"
        >{{ locale.name }}
      </NuxtLink>
    </div>
    <div class="content has-text-centered">
      <p>
        <strong>addwatermark.online</strong> by
        <a href="https://www.linkedin.com/in/kevinluo201/">Kevin Luo</a>.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import '~/assets/styles.css'
const { locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>
