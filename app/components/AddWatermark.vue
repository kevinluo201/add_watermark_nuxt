<template>
    <div class="container">
        <h1>{{ $t('mainHeading') }}</h1>
        <h2>{{ $t('privacyMessage') }}</h2>

        <div class="upload-section">
            <input id="imageInput" type="file" accept="image/*" >
            <label for="imageInput" class="upload-btn">{{ $t('choosePhoto') }}</label>
        </div>

        <div class="watermark-controls">
            <div class="control-group">
                <label for="watermarkText">{{ $t('watermarkText') }}</label>
                <input id="watermarkText" type="text" :placeholder="$t('watermarkPlaceholder')" :value="$t('defaultWatermark')">
            </div>

            <div class="control-group">
                <label for="fontSize">{{ $t('fontSize') }}</label>
                <input id="fontSize" type="range" min="10" max="100" value="24">
                <span id="fontSizeValue">24px</span>
            </div>

            <div class="control-group">
                <label for="opacity">{{ $t('opacity') }}</label>
                <input id="opacity" type="range" min="0.1" max="1" step="0.1" value="0.5">
                <span id="opacityValue">0.5</span>
            </div>

            <div class="control-group">
                <label for="position">{{ $t('position') }}</label>
                <select id="position">
                    <option value="center">{{ $t('center') }}</option>
                    <option value="top-left">{{ $t('topLeft') }}</option>
                    <option value="top-right">{{ $t('topRight') }}</option>
                    <option value="bottom-left">{{ $t('bottomLeft') }}</option>
                    <option value="bottom-right">{{ $t('bottomRight') }}</option>
                    <option value="diagonal">{{ $t('diagonal') }}</option>
                </select>
            </div>

            <div class="control-group">
                <label for="color">{{ $t('textColor') }}</label>
                <input id="color" type="color" value="#ffffff">
            </div>
        </div>

        <div class="canvas-section">
            <canvas id="canvas"/>
        </div>

        <div class="action-buttons">
            <button id="downloadBtn" disabled>{{ $t('download') }}</button>
            <button id="resetBtn" disabled>{{ $t('reset') }}</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
  locale: {
    type: String,
    default: 'en'
  }
})

const { $i18n } = useNuxtApp()

// Set locale if provided
if (props.locale) {
  const validLocales = ['en', 'de', 'es', 'fr', 'zh-TW']
  if (validLocales.includes(props.locale)) {
    $i18n.setLocale(props.locale)
  }
}
</script>

<style scoped>

</style>