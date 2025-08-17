<template>
  <div id="wrapper" :class="{ rtl }">
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
          <a href="https://www.linkedin.com/in/kevinluo201/">Kevin Luo</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import '~/assets/styles.css'
const { locales, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const rtl = computed(() => ['ar', 'he', 'ur'].includes(locale.value))
</script>

<style>
#wrapper.rtl {
  direction: rtl;
}
</style>
