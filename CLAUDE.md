# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 application for adding watermarks to images. The app provides a web interface where users can upload images and add customizable text watermarks with controls for position, opacity, font size, and color.

## Architecture

- **Framework**: Nuxt 4 with Vue 3 and TypeScript
- **Internationalization**: Uses @nuxtjs/i18n module with support for 5 languages (en, de, es, fr, zh-TW)
- **Routing**: File-based routing with locale-specific pages using `[locale].vue` dynamic route
- **Components**: Single main component `AddWatermark.vue` handles the watermarking functionality
- **Styling**: Global CSS in `app/assets/styles.css`

## Key Files

- `nuxt.config.ts`: Main configuration with i18n setup and locale definitions
- `app/components/AddWatermark.vue`: Core watermarking component with canvas-based image processing
- `app/pages/[locale].vue`: Dynamic locale routing page
- `i18n/locales/`: Translation files for all supported languages

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (runs on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Generate static site
pnpm generate

# Lint code
pnpm lint  # Note: Uses @nuxt/eslint module
```

## Internationalization

The app supports 5 locales configured in `nuxt.config.ts`. Translation files are in `i18n/locales/` directory. The locale is passed as a prop to components and can be accessed via the route parameter or component props.

## Canvas Implementation

The watermarking functionality uses HTML5 Canvas API for image processing. The canvas element and related JavaScript logic are contained within the `AddWatermark.vue` component, though the actual canvas manipulation code appears to be missing from the template-only implementation.
