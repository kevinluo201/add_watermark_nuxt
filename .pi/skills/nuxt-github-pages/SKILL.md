---
name: nuxt-github-pages
description: Deploy a Nuxt app as a fully static site to GitHub Pages, including GitHub Actions, a custom apex domain, Cloudflare DNS, HTTPS validation, and migration away from a VPS. Use when publishing or troubleshooting this project's static deployment.
compatibility: Requires pnpm, a GitHub repository, and GitHub Pages access. GitHub CLI (gh) is optional for API-based setup and verification.
---

# Nuxt Static Deployment to GitHub Pages

Use this skill to deploy a Nuxt project that does not require server-side runtime features to GitHub Pages. The deployed artifact is `.output/public` produced by `pnpm generate`.

This project's production configuration:

- Repository: `kevinluo201/add_watermark_nuxt`
- Default branch: `main`
- Production domain: `addwatermark.online`
- DNS provider: Cloudflare
- Domain registrar: Porkbun
- GitHub Pages build mode: GitHub Actions
- Deployment workflow: `.github/workflows/deploy.yml`

Read [the detailed deployment reference](references/deployment-reference.md) before changing DNS, GitHub Pages configuration, or deployment workflow behavior.

## Safety rules

1. Confirm that `pnpm generate` succeeds before changing DNS or deploying.
2. Do not stop or delete the old VPS/DigitalOcean service until both the custom domain and HTTPS work in production.
3. Never commit `.env`, API keys, private certificates, installers, generated `.output/`, or `node_modules/`.
4. GitHub Pages is static hosting: Nitro server handlers under `server/api/` do not run there. Remove, replace, or avoid depending on them.
5. Keep Cloudflare records **DNS only** while GitHub Pages verifies the custom domain and issues its certificate.

## Standard workflow

### 1. Validate the app is static-compatible

```bash
pnpm generate
find .output/public -maxdepth 2 -name index.html | sort
```

A successful static build reports that `.output/public` can be deployed to static hosting. Do not deploy `.output/server`; a static generate output should not need it.

For localized sites, verify that expected locale directories and their HTML are generated. Ensure all intended locale routes are discoverable/prerendered.

### 2. Use the repository workflow

The project workflow builds with Node 24, installs locked dependencies, runs `pnpm generate`, uploads `.output/public`, then uses the official GitHub Pages deploy action. Do not replace it with a Docker/VPS deployment unless server-side features are required.

Push `main`, or trigger it manually:

```bash
gh workflow run deploy.yml --repo kevinluo201/add_watermark_nuxt
gh run list --repo kevinluo201/add_watermark_nuxt --workflow deploy.yml --limit 5
```

### 3. Enable and configure GitHub Pages once

In GitHub repository **Settings → Pages**, choose **Source: GitHub Actions**.

If using `gh` and the authenticated user is an administrator:

```bash
gh api --method POST repos/OWNER/REPO/pages -f build_type=workflow
```

Set the custom domain in **Settings → Pages**, or with:

```bash
gh api --method PUT repos/OWNER/REPO/pages -f cname=example.com
```

For this project, the domain is already `addwatermark.online`.

### 4. Point DNS to GitHub Pages

For an apex domain, replace old VPS origin records with all four GitHub Pages A records, DNS only:

```text
A  @  185.199.108.153  DNS only
A  @  185.199.109.153  DNS only
A  @  185.199.110.153  DNS only
A  @  185.199.111.153  DNS only
```

If supporting `www`, create:

```text
CNAME  www  OWNER.github.io  DNS only
```

For this project, that CNAME is `www → kevinluo201.github.io`. Do not include the repository name in the CNAME target.

### 5. Verify HTTP, HTTPS, deployment, and redirects

```bash
dig +short example.com A
dig +short www.example.com CNAME
curl -IL http://example.com
curl -IL https://example.com
gh api repos/OWNER/REPO/pages --jq '{cname,html_url,https_enforced,https_certificate,build_type}'
```

GitHub Pages must first serve HTTP and issue the custom-domain certificate. Only then will `https_enforced` become `true`. HTTPS certificate provisioning may take minutes and occasionally up to 24 hours.

## Project-specific checks

```bash
# Current Pages configuration
export PATH="$HOME/.local/bin:$PATH"
gh api repos/kevinluo201/add_watermark_nuxt/pages \
  --jq '{cname,html_url,https_enforced,build_type}'

# Latest Pages workflow runs
gh run list --repo kevinluo201/add_watermark_nuxt --workflow deploy.yml --limit 5

# Current public DNS
 dig +short addwatermark.online A
 dig +short www.addwatermark.online CNAME
```

## Decision point: GitHub Pages versus a VPS

Use GitHub Pages when all processing occurs in the browser or at build time, as it does for the Canvas watermark tool. Use a VPS, Cloudflare Workers/Pages Functions, or another runtime host if the app needs authenticated APIs, database access, secrets, dynamic server rendering, uploads processed on the server, scheduled jobs, or Nuxt/Nitro API endpoints.

See [deployment reference](references/deployment-reference.md) for initial setup, Cloudflare/Porkbun DNS responsibilities, custom-domain SSL, temporary GitHub URL path handling, rollback, and troubleshooting.
