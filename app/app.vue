<template>
    <div class="container">
        <h1>{{ $t('mainHeading') }}</h1>
        <h2>{{ $t('privacyMessage') }}</h2>

        <div class="upload-section">
            <input
                ref="imageInput"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
            >
            <label for="imageInput" class="upload-btn">{{ $t('choosePhoto') }}</label>
        </div>

        <div class="watermark-controls">
            <div class="control-group">
                <label for="watermarkText">{{ $t('watermarkText') }}</label>
                <input
                    id="watermarkText"
                    v-model="watermarkText"
                    type="text"
                    :placeholder="$t('watermarkPlaceholder')"
                >
            </div>

            <div class="control-group">
                <label for="fontSize">{{ $t('fontSize') }}</label>
                <input
                    id="fontSize"
                    v-model="fontSize"
                    type="range"
                    min="10"
                    max="100"
                >
                <span>{{ fontSize }}px</span>
            </div>

            <div class="control-group">
                <label for="opacity">{{ $t('opacity') }}</label>
                <input
                    id="opacity"
                    v-model="opacity"
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                >
                <span>{{ opacity }}</span>
            </div>

            <div class="control-group">
                <label for="position">{{ $t('position') }}</label>
                <select id="position" v-model="position">
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
                <input
                    id="color"
                    v-model="color"
                    type="color"
                >
            </div>
        </div>

        <div class="canvas-section">
            <canvas ref="canvas"/>
        </div>

        <div class="action-buttons">
            <button
                :disabled="!isImageLoaded"
                @click="downloadImage"
            >
                {{ $t('download') }}
            </button>
            <button
                :disabled="!isImageLoaded"
                @click="resetImage"
            >
                {{ $t('reset') }}
            </button>
        </div>
    </div>
</template>

<script setup>
// Use the watermark composable
const {
  canvas,
  isImageLoaded,
  watermarkText,
  fontSize,
  opacity,
  position,
  color,
  initializeCanvas,
  handleImageUpload,
  downloadImage,
  reset
} = useWatermark()

// Initialize watermark text with translation
watermarkText.value = $t('defaultWatermark') || 'CONFIDENTIAL'

// Initialize canvas when component mounts
onMounted(() => {
  initializeCanvas()
})

// Reset method for the button
const resetImage = () => {
  reset()
  // Clear file input
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) {
    fileInput.value = ''
  }
}
</script>

<style>
@import url("~/assets/styles.css");
</style>
