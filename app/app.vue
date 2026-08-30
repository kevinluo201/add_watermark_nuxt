<template>
  <div id="wrapper" :class="{ rtl }">
    <NuxtPage />
    <section class="section support-section">
      <div class="container">
        <div class="box support-box">
          <p class="support-emoji">☕</p>
          <h2 class="title is-4">{{ $t('supportHeading') }}</h2>
          <p class="subtitle is-6">{{ $t('supportMessage') }}</p>
          <a
            class="button is-warning is-medium is-rounded"
            href="https://buymeacoffee.com/kevinluo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="icon">☕</span>
            <span>{{ $t('supportCta') }}</span>
          </a>
          <div class="mt-4">
            <img
              class="support-qr"
              src="/buymeacoffee-qr.png"
              alt="Buy me a coffee QR code for Kevin Luo"
              width="140"
              height="140"
            />
            <p class="help">{{ $t('supportScan') }}</p>
          </div>
        </div>
      </div>
    </section>
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

const i18nHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true
})

useHead({
  htmlAttrs: {
    lang: computed(() => i18nHead.value.htmlAttrs?.lang || locale.value),
    dir: computed(
      () => i18nHead.value.htmlAttrs?.dir || (rtl.value ? 'rtl' : 'ltr')
    )
  },
  link: computed(() => i18nHead.value.link || []),
  meta: computed(() => i18nHead.value.meta || [])
})
</script>

<style>
#wrapper.rtl {
  direction: rtl;
}
</style>
