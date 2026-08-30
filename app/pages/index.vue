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
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
type MosaicType = 'pixelate' | 'solid'

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
  return mosaicRegions.value.find(region => region.id === selectedRegionId.value) || null
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
    if (nx >= region.x && nx <= region.x + region.w && ny >= region.y && ny <= region.y + region.h) {
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
    const handles: Array<{ handle: 'nw' | 'ne' | 'sw' | 'se'; x: number; y: number }> = [
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
    region.x = Math.min(Math.max(interaction.origX + (nx - interaction.startNx), 0), 1 - region.w)
    region.y = Math.min(Math.max(interaction.origY + (ny - interaction.startNy), 0), 1 - region.h)
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
}

const removeSelectedRegion = () => {
  if (selectedRegionId.value === null) return

  mosaicRegions.value = mosaicRegions.value.filter(r => r.id !== selectedRegionId.value)
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
    overlayCtx.value.clearRect(0, 0, overlayCanvas.value.width, overlayCanvas.value.height)
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
</script>
