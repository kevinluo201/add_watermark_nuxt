# Nuxt → GitHub Pages deployment reference

This reference documents the complete deployment flow used by this repository. It is for agents and maintainers who need to publish a fully static Nuxt application to GitHub Pages with a custom domain.

## 1. Architecture and eligibility

Nuxt can produce a static site with:

```bash
pnpm generate
```

The deployable output is:

```text
.output/public/
```

It contains static HTML, JavaScript, CSS, images, and generated files such as `sitemap.xml`. Static hosts including GitHub Pages do not run a Node/Nitro server.

### Static hosting is appropriate when

- image processing, watermarking, downloads, and UI state run in the browser;
- content is known at build time;
- no database is required;
- no server-side secrets or API endpoints are required.

### Static hosting is not sufficient when

- the frontend calls Nitro routes such as `server/api/*`;
- server-side authentication, database access, secret API keys, server image processing, webhooks, cron jobs, or dynamic SSR are required.

A `server/api/up.get.ts` health endpoint may exist locally, but it will not execute on GitHub Pages. It is harmless only if nothing depends on it.

### i18n and prerendering

With `@nuxtjs/i18n`, Nuxt generation can prerender separate locale routes, for example:

```text
.output/public/index.html
.output/public/zh-TW/index.html
.output/public/ja/index.html
```

Do not assume every locale is rendered merely because it appears in i18n configuration. Run a fresh generate and inspect the output:

```bash
pnpm generate
find .output/public -name index.html | sort
```

If a locale or route is missing, configure it to be discoverable or prerendered before deploying. Static HTML improves crawlability, but interactive Canvas functionality still requires browser JavaScript.

## 2. GitHub Actions deployment workflow

This repository's workflow is `.github/workflows/deploy.yml`:

1. checks out `main`;
2. installs pnpm 10 and Node 24;
3. runs `pnpm install --frozen-lockfile`;
4. runs `pnpm generate`;
5. uploads `.output/public` using `actions/upload-pages-artifact`;
6. deploys it using `actions/deploy-pages`.

It uses the official GitHub actions and includes the permissions required by Pages:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

The `concurrency` group prevents older simultaneous pushes from overwriting a newer deployment.

### Triggering and watching a deployment

Every push to `main` deploys automatically. An administrator can also trigger it manually:

```bash
gh workflow run deploy.yml --repo kevinluo201/add_watermark_nuxt
gh run list --repo kevinluo201/add_watermark_nuxt --workflow deploy.yml --limit 5
gh run watch RUN_ID --repo kevinluo201/add_watermark_nuxt --exit-status
```

The baseline GitHub URL for this repository is:

```text
https://kevinluo201.github.io/add_watermark_nuxt/
```

## 3. One-time GitHub Pages setup

### Enable Pages using GitHub Actions

In the repository, open **Settings → Pages** and choose **Source: GitHub Actions**.

Alternatively, an authenticated administrator can use:

```bash
gh api --method POST repos/OWNER/REPO/pages -f build_type=workflow
```

Verify it:

```bash
gh api repos/OWNER/REPO/pages \
  --jq '{html_url,cname,build_type,https_enforced,https_certificate}'
```

### First-run error: `Get Pages site failed` / HTTP 404

`actions/configure-pages` calls GitHub's Pages API. If Pages has never been enabled, it can fail with:

```text
Get Pages site failed. ... Not Found
```

Enable Pages in Settings first, then rerun the workflow.

`configure-pages` has an `enablement` option, but enabling Pages programmatically requires a Personal Access Token or GitHub App with sufficient permissions; the workflow-provided `GITHUB_TOKEN` alone is not enough. Do not add `enablement: true` without supplying such a separate secret.

### Private repository limitation

GitHub can reject Pages enablement for a private repository when the account/organization plan does not include private-repository Pages:

```text
Your current plan does not support GitHub Pages for this repository.
```

Options:

1. make an appropriate source repository public after auditing it for secrets;
2. use a plan that supports private Pages;
3. use Cloudflare Pages, Netlify, or another host that supports private repositories.

This repository was changed to public before Pages could be enabled. Confirm there are no secrets in current files **or git history** before doing the same elsewhere.

### GitHub CLI installation and login on Ubuntu

A local user-level installation avoids requiring sudo:

```bash
ARCH=$(uname -m)
case "$ARCH" in
  x86_64) GH_ARCH=amd64 ;;
  aarch64|arm64) GH_ARCH=arm64 ;;
  *) echo "Unsupported architecture: $ARCH" >&2; exit 1 ;;
esac
VERSION=$(python3 - <<'PY'
import json, urllib.request
with urllib.request.urlopen('https://api.github.com/repos/cli/cli/releases/latest', timeout=20) as response:
    print(json.load(response)['tag_name'].removeprefix('v'))
PY
)
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT
curl -fsSL "https://github.com/cli/cli/releases/download/v${VERSION}/gh_${VERSION}_linux_${GH_ARCH}.tar.gz" -o "$TMPDIR/gh.tar.gz"
tar -xzf "$TMPDIR/gh.tar.gz" -C "$TMPDIR"
mkdir -p "$HOME/.local/bin"
install -m 0755 "$TMPDIR/gh_${VERSION}_linux_${GH_ARCH}/bin/gh" "$HOME/.local/bin/gh"
```

Log in interactively as the user. The device code must be approved by the user in a browser; never request their password or token in chat.

```bash
gh auth login --hostname github.com --git-protocol ssh --skip-ssh-key --web
gh auth status
```

The `--skip-ssh-key` option avoids offering to upload a local SSH key. Use `gh auth status` and `gh repo view OWNER/REPO --json viewerPermission` to confirm authentication and administrative access.

## 4. Custom domain and DNS

### Registrar versus authoritative DNS provider

The domain registrar sells and renews the domain. The authoritative DNS provider serves the active DNS records. These can differ.

For this project:

```text
Registrar: Porkbun
Authoritative DNS provider: Cloudflare
Nameservers: molly.ns.cloudflare.com, noel.ns.cloudflare.com
```

Because the nameservers point to Cloudflare, editing DNS records at Porkbun has no effect. Edit them in Cloudflare unless nameservers are deliberately moved back to Porkbun.

Keeping Porkbun for registration and Cloudflare for DNS is normal, even when Cloudflare proxy/CDN is not used.

### Configure the primary domain at GitHub

In **Settings → Pages → Custom domain**, enter the apex domain:

```text
addwatermark.online
```

Or use the API:

```bash
gh api --method PUT repos/kevinluo201/add_watermark_nuxt/pages \
  -f cname=addwatermark.online
```

When publishing with a GitHub Actions workflow, GitHub manages the Pages custom-domain setting. Do not rely on manually adding a `CNAME` file to Nuxt `public/`; it is not necessary for this deployment mechanism.

### Cloudflare records for an apex domain

Delete or replace the old DigitalOcean/VPS record for `@`, then create all four GitHub Pages records:

| Type | Name | Target | Cloudflare proxy |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | DNS only (gray cloud) |
| A | `@` | `185.199.109.153` | DNS only (gray cloud) |
| A | `@` | `185.199.110.153` | DNS only (gray cloud) |
| A | `@` | `185.199.111.153` | DNS only (gray cloud) |

GitHub also documents optional IPv6 AAAA records. IPv4 A records should always remain present for broad client compatibility.

### `www` setup

Support `www.addwatermark.online` by creating the following direct CNAME:

| Type | Name | Target | Cloudflare proxy |
| --- | --- | --- | --- |
| CNAME | `www` | `kevinluo201.github.io` | DNS only (gray cloud) |

The target must be `OWNER.github.io`, with **no repository path**. Do not point the CNAME to `addwatermark.online`.

When the apex is configured as the GitHub Pages custom domain and both records point to GitHub Pages, GitHub redirects `www.addwatermark.online` to `addwatermark.online`.

### Cloudflare proxy and SSL behavior

Initially, all GitHub Pages records must be **DNS only** (gray cloud). GitHub needs to see DNS resolve directly to Pages while it validates the domain and obtains a certificate.

After GitHub has issued its certificate and `https_enforced` is `true`, Cloudflare proxy may optionally be enabled. If doing so:

- set Cloudflare SSL/TLS mode to **Full (strict)**;
- preserve the correct GitHub origin DNS target behind the proxy;
- retest both apex and `www` paths;
- disable proxy again if GitHub domain validation or certificate renewals fail.

For a simple static website, leaving it DNS only is reliable and uses GitHub Pages' own CDN and free HTTPS certificate.

## 5. HTTPS issuance and verification

After DNS changes, GitHub Pages first serves HTTP, then asynchronously validates the domain and requests a certificate. During this period the correct state can be:

```text
HTTP works
HTTPS reports certificate mismatch
GitHub API: https_enforced = false
https_certificate = null
```

This normally resolves in minutes; allow up to 24 hours before troubleshooting aggressively.

Check DNS:

```bash
dig +short addwatermark.online A
dig +short www.addwatermark.online CNAME
```

Expected values for this project:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

kevinluo201.github.io.
```

Check HTTP redirects and HTTPS:

```bash
curl -IL http://addwatermark.online
curl -IL http://www.addwatermark.online
curl -IL https://addwatermark.online
curl -IL https://www.addwatermark.online
```

Inspect Pages status:

```bash
gh api repos/kevinluo201/add_watermark_nuxt/pages \
  --jq '{cname,html_url,https_enforced,https_certificate,build_type}'
```

The completed state is:

```json
{
  "cname": "addwatermark.online",
  "html_url": "https://addwatermark.online/",
  "https_enforced": true,
  "build_type": "workflow"
}
```

If certificate issuance remains stuck:

1. confirm the custom domain in GitHub Pages exactly matches the intended primary domain;
2. confirm `@` has all four A records and no stale conflicting A, AAAA, or CNAME records;
3. confirm records are gray-cloud DNS only;
4. inspect CAA records with `dig +short example.com CAA`; a restrictive CAA record can block certificate issuance;
5. allow DNS TTL/propagation time;
6. check the repository Pages settings page for a domain-specific error.

## 6. GitHub URL base path versus custom domain

The default project Pages URL contains a subpath:

```text
https://OWNER.github.io/REPOSITORY/
```

A Nuxt app using root-absolute assets or links may require:

```ts
export default defineNuxtConfig({
  app: {
    baseURL: '/REPOSITORY/'
  }
})
```

That setting is usually **not** appropriate for the production custom apex domain, which serves from `/`. This project uses `https://addwatermark.online`, so it does not need a repository subpath base URL in production.

Test the temporary GitHub URL separately before relying on it. If it is only a transitional/testing URL, a custom domain is the preferred production target.

## 7. Migration and rollback procedure

1. Commit the workflow and ensure a local `pnpm generate` succeeds.
2. Enable GitHub Pages and complete one successful workflow deployment.
3. Set the custom domain in GitHub Pages.
4. Change DNS records from the old VPS to GitHub Pages.
5. Verify HTTP works at the custom domain.
6. Wait for GitHub HTTPS issuance, then verify `https_enforced: true` and test HTTPS.
7. Verify `www` redirect if it is supported.
8. Only then stop or delete the DigitalOcean service.

If the new site fails before DNS TTLs expire, restore the former VPS DNS record in Cloudflare to roll back. Keep a record of its old IP before deleting the droplet.

## 8. Current production state (recorded after migration)

The migration performed for this repository completed with:

```text
Repository: kevinluo201/add_watermark_nuxt (public)
GitHub Pages source: GitHub Actions
Custom domain: addwatermark.online
HTTPS enforced: true
Primary URL: https://addwatermark.online/
www behavior: redirects to primary domain
DNS: Cloudflare DNS only
```

The site's prior origin was a DigitalOcean droplet. Do not infer that the droplet is unused by other applications; inspect its services before deleting it.
