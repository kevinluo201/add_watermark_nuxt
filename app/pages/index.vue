<template>
  <div>
    <section class="hero is-light is-small">
      <div class="hero-body has-text-centered">
        <p class="title">{{ $t('mainHeading') }}</p>
        <p class="subtitle">{{ $t('privacyMessage') }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8">
            <div class="field">
              <div class="file is-boxed is-medium has-name is-centered">
                <label class="file-label">
                  <input
                    ref="imageInput"
                    class="file-input"
                    type="file"
                    accept="image/*"
                    @change="handleImageUpload"
                  />
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-upload" />
                    </span>
                    <span class="file-label">{{ $t('choosePhoto') }}</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="has-text-centered mb-5">
          <div class="box" style="display: inline-block">
            <canvas ref="canvas" />
          </div>
        </div>

        <div id="action-buttons" class="mb-5">
          <button
            class="button is-success is-large is-responsive"
            :disabled="!isImageLoaded"
            @click="downloadImage"
          >
            <span class="icon">
              <i class="fas fa-download" />
            </span>
            <span>{{ $t('download') }}</span>
          </button>

          <button
            class="button is-danger is-large is-responsive"
            :disabled="!isImageLoaded"
            @click="resetImage"
          >
            <span class="icon">
              <i class="fas fa-redo" />
            </span>
            <span>{{ $t('reset') }}</span>
          </button>
        </div>

        <div class="box">
          <div class="columns is-multiline">
            <div class="column is-6">
              <div class="field">
                <label class="label" for="watermarkText">
                  {{ $t('watermarkText') }}
                </label>
                <div class="control">
                  <input
                    id="watermarkText"
                    v-model="watermarkText"
                    class="input"
                    type="text"
                    :placeholder="$t('watermarkPlaceholder')"
                  />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label" for="fontSize">{{ $t('fontSize') }}</label>
                <div class="control">
                  <input
                    id="fontSize"
                    v-model="fontSize"
                    class="slider is-fullwidth"
                    type="range"
                    min="10"
                    max="150"
                  />
                </div>
                <p class="help">{{ fontSize }}px</p>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label" for="opacity">{{ $t('opacity') }}</label>
                <div class="control">
                  <input
                    id="opacity"
                    v-model="opacity"
                    class="slider is-fullwidth"
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                  />
                </div>
                <p class="help">{{ opacity }}</p>
              </div>
            </div>

            <div class="column is-6">
              <div class="field">
                <label class="label" for="position">{{ $t('position') }}</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select id="position" v-model="position">
                      <option value="center">{{ $t('center') }}</option>
                      <option value="top-left">{{ $t('topLeft') }}</option>
                      <option value="top-right">{{ $t('topRight') }}</option>
                      <option value="bottom-left">
                        {{ $t('bottomLeft') }}
                      </option>
                      <option value="bottom-right">
                        {{ $t('bottomRight') }}
                      </option>
                      <option value="diagonal">{{ $t('diagonal') }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label" for="color">{{ $t('textColor') }}</label>
                <div class="control">
                  <input
                    id="color"
                    v-model="color"
                    class="input"
                    type="color"
                    style="height: 3rem"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const canvas = useTemplateRef('canvas')
const imageInput = useTemplateRef('imageInput')
const ctx = ref<CanvasRenderingContext2D | null>(null)
const originalImage = ref<HTMLImageElement | null>(null)
const isImageLoaded = ref(false)

// Form state
const watermarkText = ref('')
const fontSize = ref(72)
const opacity = ref(0.5)
const position = ref('center')
const color = ref('#dc6969')

const initializeCanvas = () => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
  }
}

const handleImageUpload = event => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert($t('invalidFileError') || 'Please select a valid image file')
    return
  }

  const reader = new FileReader()
  reader.onload = e => {
    const img = new Image()
    img.onload = () => {
      originalImage.value = img
      setupCanvas(img)
      updateWatermark()
      isImageLoaded.value = true
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const setupCanvas = img => {
  if (!canvas.value || !ctx.value) return

  const maxWidth = 800
  const maxHeight = 600

  let { width, height } = img

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    width *= ratio
    height *= ratio
  }

  canvas.value.width = width
  canvas.value.height = height

  ctx.value.clearRect(0, 0, width, height)
  ctx.value.drawImage(img, 0, 0, width, height)
}

const updateWatermark = () => {
  if (!originalImage.value || !canvas.value || !ctx.value) return

  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.value.drawImage(
    originalImage.value,
    0,
    0,
    canvas.value.width,
    canvas.value.height
  )

  const text = watermarkText.value
  if (!text) return

  ctx.value.save()
  ctx.value.globalAlpha = opacity.value
  ctx.value.font = `bold ${fontSize.value}px Arial`
  ctx.value.fillStyle = color.value
  ctx.value.strokeStyle = color.value === '#ffffff' ? '#000000' : '#ffffff'
  ctx.value.lineWidth = 1
  ctx.value.textAlign = 'center'

  drawWatermarkAtPosition(text, position.value, fontSize.value)
  ctx.value.restore()
}

const drawWatermarkAtPosition = (text, pos, fSize) => {
  if (!canvas.value || !ctx.value) return

  const { width, height } = canvas.value
  let x, y

  switch (pos) {
    case 'center':
      x = width / 2
      y = height / 2 + fSize / 3
      break
    case 'top-left':
      ctx.value.textAlign = 'left'
      x = 20
      y = fSize + 20
      break
    case 'top-right':
      ctx.value.textAlign = 'right'
      x = width - 20
      y = fSize + 20
      break
    case 'bottom-left':
      ctx.value.textAlign = 'left'
      x = 20
      y = height - 20
      break
    case 'bottom-right':
      ctx.value.textAlign = 'right'
      x = width - 20
      y = height - 20
      break
    case 'diagonal':
      drawDiagonalWatermark(text, fSize)
      return
  }

  ctx.value.strokeText(text, x, y)
  ctx.value.fillText(text, x, y)
}

const drawDiagonalWatermark = (text, fSize) => {
  if (!canvas.value || !ctx.value) return

  const { width, height } = canvas.value

  ctx.value.save()
  ctx.value.translate(width / 2, height / 2)
  ctx.value.rotate((-45 * Math.PI) / 180)
  ctx.value.textAlign = 'center'

  // Calculate text dimensions for proper spacing
  const textMetrics = ctx.value.measureText(text)
  const textWidth = textMetrics.width
  const textHeight = fSize

  // Use text dimensions plus padding for spacing
  const xSpacing = textWidth + fSize * 1.5
  const ySpacing = textHeight + fSize * 1.0

  const diagonal = Math.sqrt(width * width + height * height)
  const numRepeatsX = Math.ceil(diagonal / xSpacing) + 1
  const numRepeatsY = Math.ceil(diagonal / ySpacing) + 1

  for (let i = -numRepeatsX; i <= numRepeatsX; i++) {
    for (let j = -numRepeatsY; j <= numRepeatsY; j++) {
      const x = i * xSpacing
      const y = j * ySpacing
      ctx.value.strokeText(text, x, y)
      ctx.value.fillText(text, x, y)
    }
  }

  ctx.value.restore()
}

const downloadImage = () => {
  if (!canvas.value) return

  const link = document.createElement('a')
  link.download = $t('downloadFilename') || 'watermarked-id-photo.png'
  link.href = canvas.value.toDataURL('image/png', 1.0)
  link.click()
}

const reset = () => {
  originalImage.value = null
  isImageLoaded.value = false
  if (canvas.value && ctx.value) {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  }

  watermarkText.value = $t('defaultWatermark') || 'CONFIDENTIAL'
  fontSize.value = 24
  opacity.value = 0.5
  position.value = 'center'
  color.value = '#ffffff'
}

// Watchers for reactive updates
watch([watermarkText, fontSize, opacity, position, color], () => {
  updateWatermark()
})

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
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

// useSeoMeta({
//   title: 'My Amazing Site',
//   ogTitle: 'My Amazing Site',
//   description: 'This is my amazing site, let me tell you all about it.',
//   ogDescription: 'This is my amazing site, let me tell you all about it.',
//   ogImage: 'https://example.com/image.png',
//   twitterCard: 'summary_large_image',
// })
</script>
