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
            <div ref="canvasWrap" class="canvas-wrap">
              <canvas ref="canvas" class="main-canvas" />
              <canvas
                ref="overlayCanvas"
                class="mosaic-overlay"
                @pointerdown="onOverlayPointerDown"
                @pointermove="onOverlayPointerMove"
                @pointerup="onOverlayPointerUp"
                @pointercancel="onOverlayPointerUp"
              />
            </div>
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

              <div class="field mt-3">
                <label class="label is-small has-text-grey">{{
                  $t('quickPresetsTitle')
                }}</label>
                <div class="buttons are-small">
                  <button
                    type="button"
                    class="button is-info is-light is-rounded preset-btn"
                    @click="applyPreset($t('preset1'))"
                  >
                    {{ $t('preset1') }}
                  </button>
                  <button
                    type="button"
                    class="button is-info is-light is-rounded preset-btn"
                    @click="applyPreset($t('preset2'))"
                  >
                    {{ $t('preset2') }}
                  </button>
                  <button
                    type="button"
                    class="button is-info is-light is-rounded preset-btn"
                    @click="applyPreset($t('preset3'))"
                  >
                    {{ $t('preset3') }}
                  </button>
                  <button
                    type="button"
                    class="button is-info is-light is-rounded preset-btn"
                    @click="applyPreset($t('preset4'))"
                  >
                    {{ $t('preset4') }}
                  </button>
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

        <div class="box">
          <h2 class="title is-5">{{ $t('mosaicTitle') }}</h2>
          <p class="help mb-4">{{ $t('mosaicHint') }}</p>

          <div class="buttons mb-4">
            <button
              class="button is-primary"
              :disabled="!isImageLoaded"
              @click="addMosaicRegion"
            >
              <span class="icon">
                <i class="fas fa-vector-square" />
              </span>
              <span>{{ $t('addMosaicRegion') }}</span>
            </button>

            <button
              class="button is-danger is-light"
              :disabled="!isImageLoaded || !selectedRegion"
              @click="removeSelectedRegion"
            >
              <span class="icon">
                <i class="fas fa-trash" />
              </span>
              <span>{{ $t('deleteSelectedRegion') }}</span>
            </button>

            <button
              class="button is-warning is-light"
              :disabled="!isImageLoaded || mosaicRegions.length === 0"
              @click="clearMosaicRegions"
            >
              <span class="icon">
                <i class="fas fa-eraser" />
              </span>
              <span>{{ $t('clearAllRegions') }}</span>
            </button>
          </div>

          <div class="columns is-multiline">
            <div class="column is-4">
              <div class="field">
                <label class="label" for="mosaicType">
                  {{ $t('mosaicType') }}
                </label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select
                      id="mosaicType"
                      v-model="mosaicType"
                      :disabled="!selectedRegion"
                    >
                      <option value="pixelate">
                        {{ $t('mosaicPixelate') }}
                      </option>
                      <option value="solid">
                        {{ $t('mosaicSolid') }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="mosaicType === 'solid'" class="column is-4">
              <div class="field">
                <label class="label" for="mosaicColor">
                  {{ $t('mosaicColor') }}
                </label>
                <div class="control">
                  <input
                    id="mosaicColor"
                    v-model="mosaicColor"
                    class="input"
                    type="color"
                    :disabled="!selectedRegion"
                    style="height: 3rem"
                  />
                </div>
              </div>
            </div>

            <div v-if="mosaicType === 'pixelate'" class="column is-4">
              <div class="field">
                <label class="label" for="mosaicBlockSize">
                  {{ $t('mosaicBlockSize') }}
                </label>
                <div class="control">
                  <input
                    id="mosaicBlockSize"
                    v-model="mosaicBlockSize"
                    class="slider is-fullwidth"
                    type="range"
                    min="4"
                    max="64"
                    step="2"
                    :disabled="!selectedRegion"
                  />
                </div>
                <p class="help">{{ mosaicBlockSize }}px</p>
              </div>
            </div>
          </div>
        </div>

        <!-- SEO How-To Section -->
        <div class="box content-box mb-5 p-5">
          <h2 class="title is-4 has-text-centered mb-5">
            {{ $t('howToTitle') }}
          </h2>
          <div class="columns is-multiline">
            <div class="column is-4">
              <div
                class="box has-text-centered has-background-light"
                style="height: 100%"
              >
                <span class="icon is-large has-text-info mb-2">
                  <i class="fas fa-id-card fa-2x"></i>
                </span>
                <h3 class="title is-5 mb-2">{{ $t('howToStep1Title') }}</h3>
                <p class="is-size-6 has-text-grey-dark">
                  {{ $t('howToStep1Desc') }}
                </p>
              </div>
            </div>
            <div class="column is-4">
              <div
                class="box has-text-centered has-background-light"
                style="height: 100%"
              >
                <span class="icon is-large has-text-info mb-2">
                  <i class="fas fa-shield-alt fa-2x"></i>
                </span>
                <h3 class="title is-5 mb-2">{{ $t('howToStep2Title') }}</h3>
                <p class="is-size-6 has-text-grey-dark">
                  {{ $t('howToStep2Desc') }}
                </p>
              </div>
            </div>
            <div class="column is-4">
              <div
                class="box has-text-centered has-background-light"
                style="height: 100%"
              >
                <span class="icon is-large has-text-info mb-2">
                  <i class="fas fa-download fa-2x"></i>
                </span>
                <h3 class="title is-5 mb-2">{{ $t('howToStep3Title') }}</h3>
                <p class="is-size-6 has-text-grey-dark">
                  {{ $t('howToStep3Desc') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- SEO FAQ Section -->
        <div class="box content-box p-5">
          <h2 class="title is-4 has-text-centered mb-5">
            {{ $t('faqTitle') }}
          </h2>
          <div class="faq-list">
            <details class="faq-item mb-3 p-4">
              <summary class="faq-question is-size-6 has-text-weight-bold">
                {{ $t('faq1Q') }}
              </summary>
              <p class="faq-answer mt-3 is-size-6 has-text-grey-dark">
                {{ $t('faq1A') }}
              </p>
            </details>
            <details class="faq-item mb-3 p-4">
              <summary class="faq-question is-size-6 has-text-weight-bold">
                {{ $t('faq2Q') }}
              </summary>
              <p class="faq-answer mt-3 is-size-6 has-text-grey-dark">
                {{ $t('faq2A') }}
              </p>
            </details>
            <details class="faq-item mb-3 p-4">
              <summary class="faq-question is-size-6 has-text-weight-bold">
                {{ $t('faq3Q') }}
              </summary>
              <p class="faq-answer mt-3 is-size-6 has-text-grey-dark">
                {{ $t('faq3A') }}
              </p>
            </details>
            <details class="faq-item mb-3 p-4">
              <summary class="faq-question is-size-6 has-text-weight-bold">
                {{ $t('faq4Q') }}
              </summary>
              <p class="faq-answer mt-3 is-size-6 has-text-grey-dark">
                {{ $t('faq4A') }}
              </p>
            </details>
            <details class="faq-item mb-3 p-4">
              <summary class="faq-question is-size-6 has-text-weight-bold">
                {{ $t('faq5Q') }}
              </summary>
              <p class="faq-answer mt-3 is-size-6 has-text-grey-dark">
                {{ $t('faq5A') }}
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/// <reference types="webmcp-types" />

type MosaicType = 'pixelate' | 'solid'
type WatermarkPosition =
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'diagonal'

type WebMcpTextWatermarkInput = {
  text: unknown
  fontSize?: unknown
  opacity?: unknown
  color?: unknown
  position?: unknown
}

type WebMcpMosaicInput = {
  type?: unknown
  color?: unknown
  blockSize?: unknown
  x?: unknown
  y?: unknown
  width?: unknown
  height?: unknown
}

interface MosaicRegion {
  id: number
  x: number
  y: number
  w: number
  h: number
  type: MosaicType
  color: string
  blockSize: number
}

type OverlayInteraction =
  | {
      mode: 'move'
      id: number
      startNx: number
      startNy: number
      origX: number
      origY: number
    }
  | {
      mode: 'resize'
      id: number
      handle: 'nw' | 'ne' | 'sw' | 'se'
      startNx: number
      startNy: number
      orig: { x: number; y: number; w: number; h: number }
    }

const canvas = useTemplateRef('canvas')
const overlayCanvas = useTemplateRef('overlayCanvas')
const imageInput = useTemplateRef('imageInput')
const ctx = ref<CanvasRenderingContext2D | null>(null)
const overlayCtx = ref<CanvasRenderingContext2D | null>(null)
const originalImage = ref<HTMLImageElement | null>(null)
const isImageLoaded = ref(false)
let sourceCanvas: HTMLCanvasElement | null = null
let interaction: OverlayInteraction | null = null
let nextMosaicId = 1
let webMcpToolsController: AbortController | null = null

// Form state
const watermarkText = ref('')
const fontSize = ref(72)
const opacity = ref(0.5)
const position = ref('center')
const color = ref('#dc6969')

// Mosaic state
const mosaicRegions = ref<MosaicRegion[]>([])
const selectedRegionId = ref<number | null>(null)

const selectedRegion = computed<MosaicRegion | null>(() => {
  return (
    mosaicRegions.value.find(region => region.id === selectedRegionId.value) ||
    null
  )
})

const mosaicType = computed<MosaicType>({
  get: () => selectedRegion.value?.type || 'pixelate',
  set: (value: MosaicType) => {
    if (selectedRegion.value) {
      selectedRegion.value.type = value
    }
  }
})

const mosaicColor = computed({
  get: () => selectedRegion.value?.color || '#000000',
  set: (value: string) => {
    if (selectedRegion.value) {
      selectedRegion.value.color = value
    }
  }
})

const mosaicBlockSize = computed({
  get: () => selectedRegion.value?.blockSize || 16,
  set: (value: number | string) => {
    if (selectedRegion.value) {
      selectedRegion.value.blockSize = Number(value)
    }
  }
})

const initializeCanvas = () => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
  }
  if (overlayCanvas.value) {
    overlayCtx.value = overlayCanvas.value.getContext('2d')
  }
}

const trackEvent = (
  eventName: string,
  params: Record<string, unknown> = {}
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', eventName, params)
  }
}

const applyPreset = (presetText: string) => {
  watermarkText.value = presetText
  trackEvent('apply_preset', { preset: presetText })
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
      renderCanvas()
      isImageLoaded.value = true
      drawOverlay()
      trackEvent('upload_image', { file_type: file.type })
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

  // Keep a clean, unscaled copy for the pixelation sampler.
  sourceCanvas = document.createElement('canvas')
  sourceCanvas.width = width
  sourceCanvas.height = height
  const sourceCtx = sourceCanvas.getContext('2d')
  if (sourceCtx) {
    sourceCtx.drawImage(img, 0, 0, width, height)
  }

  syncOverlaySize()
  drawOverlay()
}

const renderCanvas = () => {
  if (!canvas.value || !ctx.value || !sourceCanvas) return

  const { width, height } = canvas.value

  ctx.value.clearRect(0, 0, width, height)
  ctx.value.drawImage(sourceCanvas, 0, 0, width, height)

  drawMosaicRegions()
  drawWatermark()
}

const drawWatermark = () => {
  if (!canvas.value || !ctx.value) return

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

const drawMosaicRegions = () => {
  if (!canvas.value || !ctx.value || !sourceCanvas) return

  const { width, height } = canvas.value

  for (const region of mosaicRegions.value) {
    const x = region.x * width
    const y = region.y * height
    const w = region.w * width
    const h = region.h * height

    if (w <= 0 || h <= 0) continue

    if (region.type === 'solid') {
      ctx.value.fillStyle = region.color
      ctx.value.fillRect(x, y, w, h)
      continue
    }

    // Pixelate by downscaling the region and drawing it back with
    // image smoothing disabled, which creates a blocky grid effect.
    const blockSize = Math.max(2, region.blockSize || 16)
    const smallW = Math.max(1, Math.round(w / blockSize))
    const smallH = Math.max(1, Math.round(h / blockSize))

    const regionCanvas = document.createElement('canvas')
    regionCanvas.width = smallW
    regionCanvas.height = smallH
    const regionCtx = regionCanvas.getContext('2d')
    if (!regionCtx) continue

    regionCtx.drawImage(sourceCanvas, x, y, w, h, 0, 0, smallW, smallH)

    ctx.value.save()
    ctx.value.imageSmoothingEnabled = false
    ctx.value.drawImage(regionCanvas, 0, 0, smallW, smallH, x, y, w, h)
    ctx.value.restore()
  }
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

const syncOverlaySize = () => {
  if (!overlayCanvas.value || !canvas.value) return

  overlayCanvas.value.width = canvas.value.width
  overlayCanvas.value.height = canvas.value.height
  overlayCtx.value = overlayCanvas.value.getContext('2d')
}

const getNormalizedPoint = (event: PointerEvent) => {
  if (!overlayCanvas.value) return { nx: 0, ny: 0 }

  const rect = overlayCanvas.value.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return { nx: 0, ny: 0 }

  return {
    nx: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
    ny: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
  }
}

const findRegionAt = (nx: number, ny: number) => {
  for (let i = mosaicRegions.value.length - 1; i >= 0; i--) {
    const region = mosaicRegions.value[i]
    if (
      nx >= region.x &&
      nx <= region.x + region.w &&
      ny >= region.y &&
      ny <= region.y + region.h
    ) {
      return region.id
    }
  }
  return null
}

const hitTestHandle = (
  nx: number,
  ny: number,
  rectWidth: number,
  rectHeight: number
): { id: number; handle: 'nw' | 'ne' | 'sw' | 'se' } | null => {
  const thresholdX = 10 / rectWidth
  const thresholdY = 10 / rectHeight

  for (let i = mosaicRegions.value.length - 1; i >= 0; i--) {
    const region = mosaicRegions.value[i]
    const handles: Array<{
      handle: 'nw' | 'ne' | 'sw' | 'se'
      x: number
      y: number
    }> = [
      { handle: 'nw', x: region.x, y: region.y },
      { handle: 'ne', x: region.x + region.w, y: region.y },
      { handle: 'sw', x: region.x, y: region.y + region.h },
      { handle: 'se', x: region.x + region.w, y: region.y + region.h }
    ]

    for (const handle of handles) {
      if (
        Math.abs(nx - handle.x) <= thresholdX &&
        Math.abs(ny - handle.y) <= thresholdY
      ) {
        return { id: region.id, handle: handle.handle }
      }
    }
  }

  return null
}

const drawOverlay = () => {
  if (!overlayCanvas.value || !overlayCtx.value) return

  const octx = overlayCtx.value
  const { width, height } = overlayCanvas.value

  octx.clearRect(0, 0, width, height)

  if (!isImageLoaded.value) return

  const rect = overlayCanvas.value.getBoundingClientRect()
  const scale = rect.width / width || 1
  const lineWidth = 2 / scale
  const handleSize = 9 / scale

  for (const region of mosaicRegions.value) {
    const x = region.x * width
    const y = region.y * height
    const w = region.w * width
    const h = region.h * height
    const selected = region.id === selectedRegionId.value

    octx.strokeStyle = selected ? '#2563eb' : '#3b82f6'
    octx.lineWidth = lineWidth
    octx.setLineDash(selected ? [] : [6 / scale, 4 / scale])
    octx.strokeRect(x, y, w, h)
    octx.setLineDash([])

    if (selected) {
      octx.fillStyle = '#ffffff'
      octx.strokeStyle = '#2563eb'
      octx.lineWidth = 1.5 / scale

      const corners = [
        { hx: x, hy: y },
        { hx: x + w, hy: y },
        { hx: x, hy: y + h },
        { hx: x + w, hy: y + h }
      ]

      for (const corner of corners) {
        octx.fillRect(
          corner.hx - handleSize / 2,
          corner.hy - handleSize / 2,
          handleSize,
          handleSize
        )
        octx.strokeRect(
          corner.hx - handleSize / 2,
          corner.hy - handleSize / 2,
          handleSize,
          handleSize
        )
      }
    }
  }
}

const clampRegion = (region: MosaicRegion) => {
  region.x = Math.min(Math.max(region.x, 0), 1)
  region.y = Math.min(Math.max(region.y, 0), 1)
  region.w = Math.min(Math.max(region.w, 0), 1 - region.x)
  region.h = Math.min(Math.max(region.h, 0), 1 - region.y)
}

const onOverlayPointerDown = (event: PointerEvent) => {
  if (!overlayCanvas.value || !isImageLoaded.value) return

  const rect = overlayCanvas.value.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return

  const { nx, ny } = getNormalizedPoint(event)

  const handleHit = hitTestHandle(nx, ny, rect.width, rect.height)
  if (handleHit) {
    const region = mosaicRegions.value.find(r => r.id === handleHit.id)
    if (region) {
      selectedRegionId.value = region.id
      interaction = {
        mode: 'resize',
        id: region.id,
        handle: handleHit.handle,
        startNx: nx,
        startNy: ny,
        orig: { x: region.x, y: region.y, w: region.w, h: region.h }
      }
      overlayCanvas.value.setPointerCapture(event.pointerId)
      event.preventDefault()
      drawOverlay()
      return
    }
  }

  const regionId = findRegionAt(nx, ny)
  if (regionId !== null) {
    const region = mosaicRegions.value.find(r => r.id === regionId)
    if (region) {
      selectedRegionId.value = regionId
      interaction = {
        mode: 'move',
        id: regionId,
        startNx: nx,
        startNy: ny,
        origX: region.x,
        origY: region.y
      }
      overlayCanvas.value.setPointerCapture(event.pointerId)
      event.preventDefault()
      drawOverlay()
      return
    }
  }

  selectedRegionId.value = null
  drawOverlay()
}

const onOverlayPointerMove = (event: PointerEvent) => {
  if (!interaction || !overlayCanvas.value || !canvas.value) return

  const { nx, ny } = getNormalizedPoint(event)
  const region = mosaicRegions.value.find(r => r.id === interaction.id)
  if (!region) {
    interaction = null
    return
  }

  if (interaction.mode === 'move') {
    region.x = Math.min(
      Math.max(interaction.origX + (nx - interaction.startNx), 0),
      1 - region.w
    )
    region.y = Math.min(
      Math.max(interaction.origY + (ny - interaction.startNy), 0),
      1 - region.h
    )
  } else {
    const { orig, handle } = interaction
    const dx = nx - interaction.startNx
    const dy = ny - interaction.startNy

    let { x, y, w, h } = orig

    if (handle.includes('e')) w = orig.w + dx
    if (handle.includes('s')) h = orig.h + dy
    if (handle.includes('w')) {
      x = orig.x + dx
      w = orig.w - dx
    }
    if (handle.includes('n')) {
      y = orig.y + dy
      h = orig.h - dy
    }

    const minW = 24 / canvas.value.width
    const minH = 24 / canvas.value.height

    if (w < minW) {
      if (handle.includes('w')) x = orig.x + orig.w - minW
      w = minW
    }
    if (h < minH) {
      if (handle.includes('n')) y = orig.y + orig.h - minH
      h = minH
    }

    region.x = x
    region.y = y
    region.w = w
    region.h = h
    clampRegion(region)
  }

  renderCanvas()
  drawOverlay()
}

const onOverlayPointerUp = (event: PointerEvent) => {
  if (interaction && overlayCanvas.value?.hasPointerCapture(event.pointerId)) {
    overlayCanvas.value.releasePointerCapture(event.pointerId)
  }
  interaction = null
}

const addMosaicRegion = () => {
  if (!canvas.value) return

  const { width, height } = canvas.value
  const size = Math.min(width, height) * 0.3
  const w = size / width
  const h = size / height

  mosaicRegions.value.push({
    id: nextMosaicId++,
    x: (1 - w) / 2,
    y: (1 - h) / 2,
    w,
    h,
    type: mosaicType.value || 'pixelate',
    color: mosaicColor.value,
    blockSize: mosaicBlockSize.value
  })

  selectedRegionId.value = nextMosaicId - 1
  renderCanvas()
  drawOverlay()
  trackEvent('add_mosaic', { type: mosaicType.value || 'pixelate' })
}

const removeSelectedRegion = () => {
  if (selectedRegionId.value === null) return

  mosaicRegions.value = mosaicRegions.value.filter(
    r => r.id !== selectedRegionId.value
  )
  selectedRegionId.value = null
  renderCanvas()
  drawOverlay()
}

const clearMosaicRegions = () => {
  mosaicRegions.value = []
  selectedRegionId.value = null
  renderCanvas()
  drawOverlay()
}

const downloadImage = () => {
  if (!canvas.value) return

  const link = document.createElement('a')
  link.download = $t('downloadFilename') || 'watermarked-id-photo.png'
  link.href = canvas.value.toDataURL('image/png', 1.0)
  link.click()
  trackEvent('download_image', {
    has_mosaic: mosaicRegions.value.length > 0,
    watermark_position: position.value
  })
}

const isNumberInRange = (value: unknown, min: number, max: number) => {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
  )
}

const registerWebMcpTools = async () => {
  // WebMCP is an origin-trial API. Browsers outside the trial do not expose
  // modelContext, so the regular editor continues to work without these tools.
  const modelContext = document.modelContext
  if (!modelContext) return

  const controller = new AbortController()
  webMcpToolsController = controller

  try {
    await Promise.all([
      modelContext.registerTool(
        {
          name: 'focus_image_upload',
          title: 'Focus image upload',
          description:
            'Focuses the Choose ID Photo upload control so the user can select an image. For browser security, this tool cannot select or upload a file itself.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false
          },
          execute: async () => {
            if (!imageInput.value) {
              return 'The image upload control is not available yet.'
            }

            imageInput.value.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
            imageInput.value.focus()
            return 'The image upload control is focused. The user must choose the image file.'
          }
        },
        { signal: controller.signal }
      ),
      modelContext.registerTool(
        {
          name: 'set_text_watermark',
          title: 'Set text watermark',
          description:
            'Sets the text watermark and, optionally, its font size, opacity, color, and placement. The settings apply to the current image or the next image the user uploads.',
          inputSchema: {
            type: 'object',
            properties: {
              text: { type: 'string', description: 'The watermark text.' },
              fontSize: { type: 'number', minimum: 10, maximum: 150 },
              opacity: { type: 'number', minimum: 0.1, maximum: 1 },
              color: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
              position: {
                type: 'string',
                enum: [
                  'center',
                  'top-left',
                  'top-right',
                  'bottom-left',
                  'bottom-right',
                  'diagonal'
                ]
              }
            },
            required: ['text'],
            additionalProperties: false
          },
          execute: async input => {
            const {
              text,
              fontSize: requestedFontSize,
              opacity: requestedOpacity,
              color: requestedColor,
              position: requestedPosition
            } = input as WebMcpTextWatermarkInput

            if (typeof text !== 'string') {
              return 'A text watermark requires a text string.'
            }

            watermarkText.value = text
            if (isNumberInRange(requestedFontSize, 10, 150)) {
              fontSize.value = requestedFontSize
            }
            if (isNumberInRange(requestedOpacity, 0.1, 1)) {
              opacity.value = requestedOpacity
            }
            if (
              typeof requestedColor === 'string' &&
              /^#[0-9a-fA-F]{6}$/.test(requestedColor)
            ) {
              color.value = requestedColor
            }
            if (
              typeof requestedPosition === 'string' &&
              [
                'center',
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right',
                'diagonal'
              ].includes(requestedPosition)
            ) {
              position.value = requestedPosition as WatermarkPosition
            }

            await nextTick()
            return isImageLoaded.value
              ? 'The text watermark has been applied to the current image.'
              : 'The text watermark has been configured and will apply when the user uploads an image.'
          }
        },
        { signal: controller.signal }
      ),
      modelContext.registerTool(
        {
          name: 'add_mosaic_region',
          title: 'Add mosaic privacy mask',
          description:
            'Adds a rectangular privacy mask to the uploaded image. Choose a pixelated mosaic or a solid color and optionally provide normalized x, y, width, and height values between 0 and 1.',
          inputSchema: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['pixelate', 'solid'] },
              color: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
              blockSize: { type: 'number', minimum: 4, maximum: 64 },
              x: { type: 'number', minimum: 0, maximum: 1 },
              y: { type: 'number', minimum: 0, maximum: 1 },
              width: { type: 'number', exclusiveMinimum: 0, maximum: 1 },
              height: { type: 'number', exclusiveMinimum: 0, maximum: 1 }
            },
            additionalProperties: false
          },
          execute: async input => {
            if (!canvas.value || !isImageLoaded.value) {
              return 'The user must upload an image before a mosaic privacy mask can be added.'
            }

            const {
              type: requestedType,
              color: requestedColor,
              blockSize: requestedBlockSize,
              x: requestedX,
              y: requestedY,
              width: requestedWidth,
              height: requestedHeight
            } = input as WebMcpMosaicInput
            const type: MosaicType =
              requestedType === 'solid' ? 'solid' : 'pixelate'
            const width = isNumberInRange(requestedWidth, 0.001, 1)
              ? requestedWidth
              : 0.3
            const height = isNumberInRange(requestedHeight, 0.001, 1)
              ? requestedHeight
              : 0.3
            const x = isNumberInRange(requestedX, 0, 1)
              ? requestedX
              : (1 - width) / 2
            const y = isNumberInRange(requestedY, 0, 1)
              ? requestedY
              : (1 - height) / 2
            const region: MosaicRegion = {
              id: nextMosaicId++,
              x,
              y,
              w: width,
              h: height,
              type,
              color:
                typeof requestedColor === 'string' &&
                /^#[0-9a-fA-F]{6}$/.test(requestedColor)
                  ? requestedColor
                  : '#000000',
              blockSize: isNumberInRange(requestedBlockSize, 4, 64)
                ? requestedBlockSize
                : 16
            }

            clampRegion(region)
            if (region.w === 0 || region.h === 0) {
              return 'The mosaic privacy mask must occupy a visible area of the image.'
            }

            mosaicRegions.value.push(region)
            selectedRegionId.value = region.id
            renderCanvas()
            drawOverlay()
            return `A ${type} mosaic privacy mask has been added to the image.`
          }
        },
        { signal: controller.signal }
      ),
      modelContext.registerTool(
        {
          name: 'download_watermarked_image',
          title: 'Download watermarked image',
          description:
            'Downloads the current image, including its text watermark and mosaic privacy masks, as a PNG file.',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false
          },
          execute: async () => {
            if (!canvas.value || !isImageLoaded.value) {
              return 'The user must upload an image before it can be downloaded.'
            }

            downloadImage()
            return 'The watermarked PNG download has been started.'
          }
        },
        { signal: controller.signal }
      )
    ])
  } catch (error) {
    controller.abort()
    if (webMcpToolsController === controller) {
      webMcpToolsController = null
    }
    console.warn('WebMCP tools could not be registered.', error)
  }
}

const reset = () => {
  originalImage.value = null
  isImageLoaded.value = false
  sourceCanvas = null
  interaction = null
  mosaicRegions.value = []
  selectedRegionId.value = null

  if (canvas.value && ctx.value) {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  }
  if (overlayCanvas.value && overlayCtx.value) {
    overlayCtx.value.clearRect(
      0,
      0,
      overlayCanvas.value.width,
      overlayCanvas.value.height
    )
  }

  watermarkText.value = $t('defaultWatermark') || 'CONFIDENTIAL'
  fontSize.value = 24
  opacity.value = 0.5
  position.value = 'center'
  color.value = '#ffffff'
}

// Watchers for reactive updates
watch([watermarkText, fontSize, opacity, position, color], () => {
  renderCanvas()
})

watch(
  mosaicRegions,
  () => {
    renderCanvas()
    drawOverlay()
  },
  { deep: true }
)

watch(selectedRegionId, () => {
  drawOverlay()
})

// Initialize watermark text with translation
watermarkText.value = $t('defaultWatermark') || 'CONFIDENTIAL'

// Initialize canvas when component mounts
onMounted(() => {
  initializeCanvas()
  void registerWebMcpTools()
})

onUnmounted(() => {
  webMcpToolsController?.abort()
  webMcpToolsController = null
})

// Reset method for the button
const resetImage = () => {
  reset()
  // Clear file input
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

useSeoMeta({
  title: $t('title'),
  ogTitle: $t('ogTitle'),
  description: $t('description'),
  ogDescription: $t('ogDescription'),
  ogImage: '/watermark.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: $t('twitterTitle'),
  twitterDescription: $t('twitterDescription'),
  keywords: $t('keywords'),
  robots: 'index, follow'
})

const structuredData = computed(() => {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: $t('title'),
      url: 'https://addwatermark.online',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      description: $t('description')
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: $t('howToTitle'),
      step: [
        {
          '@type': 'HowToStep',
          name: $t('howToStep1Title'),
          text: $t('howToStep1Desc'),
          position: 1
        },
        {
          '@type': 'HowToStep',
          name: $t('howToStep2Title'),
          text: $t('howToStep2Desc'),
          position: 2
        },
        {
          '@type': 'HowToStep',
          name: $t('howToStep3Title'),
          text: $t('howToStep3Desc'),
          position: 3
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: $t('faq1Q'),
          acceptedAnswer: {
            '@type': 'Answer',
            text: $t('faq1A')
          }
        },
        {
          '@type': 'Question',
          name: $t('faq2Q'),
          acceptedAnswer: {
            '@type': 'Answer',
            text: $t('faq2A')
          }
        },
        {
          '@type': 'Question',
          name: $t('faq3Q'),
          acceptedAnswer: {
            '@type': 'Answer',
            text: $t('faq3A')
          }
        },
        {
          '@type': 'Question',
          name: $t('faq4Q'),
          acceptedAnswer: {
            '@type': 'Answer',
            text: $t('faq4A')
          }
        },
        {
          '@type': 'Question',
          name: $t('faq5Q'),
          acceptedAnswer: {
            '@type': 'Answer',
            text: $t('faq5A')
          }
        }
      ]
    }
  ]
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(structuredData.value))
    }
  ]
})
</script>
