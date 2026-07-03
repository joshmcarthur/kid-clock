# Flashing

## Prerequisites

- [ESPHome](https://esphome.io/) installed locally, **or** Docker with the included `compose.yml`
- USB cable to the D1 Mini (for the first flash)
- WiFi credentials

## Secrets

```bash
cp secrets.yaml.example secrets.yaml
```

Edit `secrets.yaml` with your WiFi SSID and password. If you use Home Assistant, generate an API key:

```bash
esphome secrets generate-key
```

and set `api_encryption_key` in `secrets.yaml`.

## First flash (USB)

From the project root:

```bash
esphome run kid-clock.yaml
```

This compiles firmware, uploads over USB, and opens the serial log.

### Docker alternative

```bash
docker compose up -d
# Use the ESPHome dashboard at http://localhost:6052
# Open kid-clock.yaml and use Install
```

Run `docker compose` from the project root so the config directory mounts correctly.

## Web UI hosting (jsDelivr)

By default, the config UI loads JavaScript and CSS from **jsDelivr**, not from the ESP8266. This keeps the device stable but means:

- Your **phone or computer needs internet** when opening the config page
- The **GitHub repo must be public** and the tag in `web_assets_version` must exist

### First publish bootstrap

Before the repo is on GitHub with a matching tag (`v1.0.0` by default), jsDelivr URLs will not work. Choose one:

1. **Publish first** — push to GitHub, tag `v1.0.0`, then flash with CDN URLs; or
2. **Embedded fallback** — temporarily switch to embedded assets in `kid-clock.yaml` (see [Configuration](configuration.md)), flash, then switch back after publishing.

## WiFi setup

If the device cannot join your WiFi, it starts a fallback access point:

- **SSID:** `kid-clock Fallback Hotspot`
- **Password:** see `ap.password` in `kid-clock.yaml`

Connect, open a browser (captive portal may appear), and enter your WiFi credentials. Note: with CDN-hosted UI, the full config page may not load on the fallback hotspot unless your phone also has internet — use embedded mode for offline portal setup.

## OTA updates

After the first USB flash, subsequent updates can be done over WiFi:

```bash
esphome run kid-clock.yaml   # detects device on network and OTA flashes
```

Prebuilt `.bin` files may also be attached to [GitHub Releases](https://github.com) when available.

## When to rebuild the web UI

Only when editing files under `web/src/`:

```bash
npm install
npm run build
git add kid-clock-app.js kid-clock-app.css
# Bump web_assets_version in kid-clock.yaml to match your new git tag
git tag v1.0.1
git push && git push --tags
```

Firmware-only changes do **not** require `npm run build`.
