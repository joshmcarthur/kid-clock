# Configuration

## Web UI

Open `http://kid-clock.local/` (or the device IP) in a browser. The custom schedule editor connects to the ESPHome REST API and SSE event stream on the device.

Sections:

- **Global settings** — child name, greeting prefix, alternate seconds
- **Schedule rules** — add/remove rules 3–10; edit times, messages, display mode, LED states
- **Advanced** — test mode, scenario cycling, manual LED control

## Web asset hosting

The web UI is loaded from **jsDelivr** by default (see `substitutions` in `kid-clock.yaml`):

```yaml
substitutions:
  web_assets_repo: "joshmcarthur/kid-clock"   # your GitHub slug
  web_assets_version: "v1.0.0"            # must match an existing git tag

web_server:
  css_include: ""
  js_include: ""
  css_url: "https://cdn.jsdelivr.net/gh/${web_assets_repo}@${web_assets_version}/kid-clock-app.css"
  js_url: "https://cdn.jsdelivr.net/gh/${web_assets_repo}@${web_assets_version}/kid-clock-app.js"
```

After forking, set `web_assets_repo` to your `username/repo` and keep `web_assets_version` in sync with git tags when you release UI changes.

### Why not raw GitHub URLs?

`raw.githubusercontent.com` serves files as `text/plain` with `nosniff`. Modern browsers refuse to load CSS and JS from those URLs. Use jsDelivr, GitHub Pages, or release assets instead.

### Embedded fallback (offline / captive portal)

If you need the config UI to work without internet on the client (e.g. on the fallback hotspot), switch to embedded assets:

```yaml
web_server:
  css_include: "kid-clock-app.css"
  js_include: "kid-clock-app.js"
  # Omit css_url and js_url, or leave them unset
```

Rebuild with `npm run build`, recompile, and reflash. This increases flash usage and can stress ESP8266 memory when serving the files.

| Mode | ESP8266 load | Client needs internet | Captive portal UI |
|------|--------------|----------------------|-------------------|
| jsDelivr (default) | Low | Yes | No |
| Embedded | Higher | No | Yes |

## Schedule rules

Rules are evaluated every second. The highest-priority enabled rule whose time window contains the current time becomes active.

| Field | Description |
|-------|-------------|
| Start / End | Minutes from midnight (0–1439) |
| Priority | Higher wins when windows overlap (1–99) |
| Display mode | `0` = message, `1` = greeting, `2` = alternate greeting/message |
| Green / Red LED | On/off while rule is active |
| Message | Up to 64 characters (scrolls if longer) |

Rules 1 and 2 default to wake and sleep windows. Rules 3–10 are optional and can be added from the web UI.

## Home Assistant

The device exposes entities via the ESPHome API. Add it in Home Assistant:

1. Ensure `api_encryption_key` is set in `secrets.yaml`
2. Flash firmware
3. Home Assistant should auto-discover the device, or add via **Settings → Devices → Add integration → ESPHome**

## Timezone

Set `timezone` in `substitutions` (default `Pacific/Auckland`). SNTP servers are configured in `kid-clock.yaml` under `time:`.
