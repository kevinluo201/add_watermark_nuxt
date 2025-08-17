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
        <strong>Bulma</strong> by
        <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is
        licensed <a href="https://opensource.org/license/mit">MIT</a>. The
        website content is licensed
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0//"
          >CC BY NC SA 4.0</a
        >.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import '~/assets/styles.css'
const { locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>
