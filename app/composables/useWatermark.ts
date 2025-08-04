export const useWatermark = () => {
    const canvas = ref(null)
    const ctx = ref(null)
    const originalImage = ref(null)
    const isImageLoaded = ref(false)

    // Form state
    const watermarkText = ref('')
    const fontSize = ref(24)
    const opacity = ref(0.5)
    const position = ref('center')
    const color = ref('#ffffff')

    const { $i18n } = useNuxtApp()

    const initializeCanvas = () => {
        if (canvas.value) {
            ctx.value = canvas.value.getContext('2d')
        }
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert($i18n.t('invalidFileError') || 'Please select a valid image file')
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
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

    const setupCanvas = (img) => {
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
        ctx.value.drawImage(originalImage.value, 0, 0, canvas.value.width, canvas.value.height)

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
        ctx.value.rotate(-45 * Math.PI / 180)
        ctx.value.textAlign = 'center'
        
        const spacing = fSize * 3
        const numRepeats = Math.ceil(Math.max(width, height) / spacing) + 2
        
        for (let i = -numRepeats; i <= numRepeats; i++) {
            for (let j = -numRepeats; j <= numRepeats; j++) {
                const x = i * spacing * 2
                const y = j * spacing
                ctx.value.strokeText(text, x, y)
                ctx.value.fillText(text, x, y)
            }
        }
        
        ctx.value.restore()
    }

    const downloadImage = () => {
        if (!canvas.value) return

        const link = document.createElement('a')
        link.download = $i18n.t('downloadFilename') || 'watermarked-id-photo.png'
        link.href = canvas.value.toDataURL('image/png', 1.0)
        link.click()
    }

    const reset = () => {
        originalImage.value = null
        isImageLoaded.value = false
        if (canvas.value && ctx.value) {
            ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
        }
        
        watermarkText.value = $i18n.t('defaultWatermark') || 'CONFIDENTIAL'
        fontSize.value = 24
        opacity.value = 0.5
        position.value = 'center'
        color.value = '#ffffff'
    }

    // Watchers for reactive updates
    watch([watermarkText, fontSize, opacity, position, color], () => {
        updateWatermark()
    })

    return {
        canvas,
        originalImage,
        isImageLoaded,
        watermarkText,
        fontSize,
        opacity,
        position,
        color,
        initializeCanvas,
        handleImageUpload,
        updateWatermark,
        downloadImage,
        reset
    }
}