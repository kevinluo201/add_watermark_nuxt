# Add Watermark App

This skill provides context for working with the `add_watermark_nuxt` project — a client-side web app for adding text watermarks and mosaic effects to images.

## Live Site

https://addwatermark.online

## Project Overview

This is a **Nuxt.js v4** single-page application that processes images entirely in the browser using the HTML5 Canvas API. No images are uploaded to a server, ensuring user privacy.

## Architecture

- **Framework:** [Nuxt.js](https://nuxt.com/) v4 with Vue 3 and TypeScript
- **Styling:** [Bulma](https://bulma.io/) CSS framework (loaded via CDN)
- **Icons:** [Font Awesome](https://fontawesome.com/) (loaded via CDN)
- **Routing:** Single page app; all content lives in `app/pages/index.vue`
- **Layout:** Global layout with footer and language switcher in `app/app.vue`
- **State:** Vue Composition API with `ref()` and `computed()` (no external state library)
- **SEO:** Dynamic meta tags with `useSeoMeta`, Schema.org JSON-LD structured data (`WebApplication`, `HowTo`, `FAQPage`), automated `<link rel="canonical">` and 50-locale `<link rel="alternate" hreflang="...">` via `@nuxtjs/i18n` with `baseUrl`
- **WebMCP:** Experimental, origin-trial-only agent tools registered through `document.modelContext`; TypeScript typings come from the `webmcp-types` development dependency
- **Analytics:** Google Analytics (G-XLRM21CEWV) with custom conversion events (`upload_image`, `apply_preset`, `add_mosaic`, `download_image`) and Google Ads (ca-pub-8791642317068591) in production

## Key Files

| File                    | Purpose                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| `app/pages/index.vue`   | Main UI, canvas logic, watermarking, mosaic regions, and download/reset                                 |
| `app/app.vue`           | Root layout with language switcher and RTL support                                                      |
| `app/assets/styles.css` | Custom styles for canvas, sliders, and responsive action buttons                                        |
| `nuxt.config.ts`        | Nuxt config with i18n locales, site URL, Bulma/Font Awesome CDN links, and production analytics scripts |
| `i18n/locales/*.json`   | Translation files for all supported languages                                                           |

## Core Features

### 1. Image Upload

- File input accepts any image file (`image/*`)
- Invalid file types show an alert via `$t('invalidFileError')`
- Uploaded image is drawn to a canvas, scaled down if it exceeds 800×600px
- A hidden `sourceCanvas` keeps a clean copy for pixelation sampling

### 2. Text Watermark & Quick Presets

Users can customize:

- **Quick Presets:** One-click preset buttons for common ID protection phrases (e.g., "僅供身分驗證使用，他用無效", "FOR VERIFICATION ONLY", "SOLO PARA VERIFICACIÓN")
- **Text:** Free-form input (default is `$t('defaultWatermark')`, tailored to document protection)
- **Font size:** Range slider 10–150px
- **Opacity:** Range slider 0.1–1.0
- **Color:** Native HTML color picker
- **Position:**
  - `center` — centered with slight baseline offset
  - `top-left`, `top-right`, `bottom-left`, `bottom-right` — 20px inset with left/right alignment
  - `diagonal` — tiled repeating text at -45° across the entire image, spaced by text width + padding

The watermark is rendered with both `strokeText` (thin outline) and `fillText` for readability. Stroke color auto-contrasts: black stroke on white text, white stroke on all other colors.

### 3. Mosaic / Pixelation Regions

Users can add draggable, resizable rectangular regions on the image to hide sensitive areas:

- **Add region:** Creates a default region centered on the image (~30% of the smaller dimension)
- **Move:** Drag inside a region
- **Resize:** Drag corner handles (blue squares)
- **Select:** Click a region to select it (dashed border becomes solid blue)
- **Per-region settings:**
  - **Type:** `pixelate` or `solid`
  - **Pixelate:** Downscales the region and draws it back with `imageSmoothingEnabled = false` for a blocky effect; block size is adjustable (4–64px)
  - **Solid:** Fills the region with a chosen color
- **Delete selected region** or **Clear all regions**
- Regions are stored as normalized coordinates (`0–1` relative to canvas size) so they survive canvas resizes

The overlay uses a second transparent canvas (`overlayCanvas`) stacked on top of the main canvas. Pointer events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) handle interaction, with `setPointerCapture` for smooth dragging.

### 4. Rich SEO Content Sections

- **How-To 3 Steps:** Step-by-step guidance for protecting ID cards and passport copies.
- **FAQ Accordion:** Answers to top search questions on document watermarking security, privacy guarantees, and recommended phrasing.

### 5. Download

- Generates a PNG from the main canvas (`canvas.toDataURL('image/png', 1.0)`)
- Filename uses `$t('downloadFilename')` (default: `watermarked-id-photo.png`)
- Triggers GA4 `download_image` conversion event

### 6. Reset

- Clears the main canvas and overlay
- Resets all watermark settings to defaults
- Removes all mosaic regions
- Clears the file input

### 7. WebMCP Agent Tools (Experimental)

When the browser exposes `document.modelContext` through Chrome's WebMCP origin trial, the app registers four tools. The feature is optional: browsers that do not support the API simply skip registration and retain the standard editor experience.

| Tool                         | Purpose                                                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `focus_image_upload`         | Scrolls to and focuses the image-upload control. It cannot select a local file; browser security requires the user to do that.                                      |
| `set_text_watermark`         | Sets text and optional font size, opacity, color, and placement. It can configure settings before an image is uploaded.                                             |
| `add_mosaic_region`          | Adds a pixelated or solid-color privacy-mask rectangle to an uploaded image. Optional `x`, `y`, `width`, and `height` inputs use normalized 0–1 canvas coordinates. |
| `download_watermarked_image` | Invokes the existing PNG download for the current canvas, including all text and mosaic edits.                                                                      |

Registration lives in `app/pages/index.vue`, occurs only after mount, and uses an `AbortController` that unregisters the tools when the component unmounts. Keep the `document.modelContext` existence check: WebMCP is not available in standard browsers.

## Internationalization (i18n)

- **Module:** `@nuxtjs/i18n`
- **Strategy:** `prefix_except_default` (e.g., `/fr/`, `/de/`; default `en` has no prefix)
- **Default locale:** `en`
- **Browser detection:** Disabled (`detectBrowserLanguage: false`)
- **Supported locales:** 50 languages including Arabic, Bengali, Bulgarian, Catalan, Simplified Chinese, Traditional Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Filipino, Finnish, French, German, Greek, Gujarati, Hebrew, Hindi, Hungarian, Indonesian, Italian, Japanese, Kannada, Korean, Latvian, Lithuanian, Malay, Malayalam, Marathi, Norwegian, Polish, Portuguese, Punjabi, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish (Spain), Spanish (Latin America), Swedish, Tamil, Telugu, Thai, Turkish, Ukrainian, Urdu, Vietnamese

### RTL Support

The app supports right-to-left layouts for Arabic (`ar`), Hebrew (`he`), and Urdu (`ur`). The `#wrapper` element gets an `.rtl` class when one of these locales is active, which applies `direction: rtl`.

### Adding Translations

1. Add new strings to `i18n/locales/en.json` first.
2. Reference them in components with `$t('key')`.
3. Mirror the new keys across all other locale files.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Generate static site
pnpm generate

# Preview production build
pnpm preview

# Format code
pnpm format

# Check formatting
pnpm format:check

# Lint
pnpm lint
```

## Important Conventions

- **Privacy-first:** Do not introduce any server-side image upload. All processing must remain client-side.
- **Canvas sizing:** The visible canvas maxes out at 800×600px, but the `sourceCanvas` preserves the scaled dimensions for pixelation sampling.
- **Normalized coordinates:** Mosaic regions use `0–1` coordinates so they scale correctly with the canvas.
- **Reactive rendering:** `watch()` on watermark properties and `watch(..., { deep: true })` on `mosaicRegions` trigger `renderCanvas()` automatically.
- **SEO:** Meta tags are dynamic per locale via `useSeoMeta` in `index.vue`. Do not hard-code titles or descriptions.
