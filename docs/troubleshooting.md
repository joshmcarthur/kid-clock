# Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Blank LCD | Wrong I2C address | Try `0x27` vs `0x3F` in `kid-clock.yaml`; set `i2c: scan: true` temporarily and check logs |
| "Getting time…" on display | No WiFi or SNTP | Verify `secrets.yaml` WiFi credentials; ensure the network has internet; check `timezone` substitution |
| Web UI blank or unstyled | CDN mode + no internet on phone | Connect the phone to WiFi with internet, or switch to embedded `*_include` mode (see [Configuration](configuration.md)) |
| Web UI blank on fallback hotspot | jsDelivr requires internet | Use embedded mode for captive-portal setup, or configure WiFi then use normal LAN |
| Web UI stale after UI update | Old jsDelivr tag in yaml | Bump `web_assets_version` to match the new git tag and reflash (or hard-refresh browser) |
| jsDelivr 404 | Tag or path wrong | Ensure `web_assets_repo`, `web_assets_version`, and committed `kid-clock-app.*` match the tag on GitHub |
| LEDs always on/off | Wiring or wrong GPIO | Verify D6 (green) and D7 (red); check `green_led_pin` / `red_led_pin` substitutions |
| Can't reach device | Wrong network | Try `http://kid-clock.local/` or device IP; join `kid-clock Fallback Hotspot` |
| Compile fails on secrets | Missing `secrets.yaml` | `cp secrets.yaml.example secrets.yaml` and fill in values |
| Home Assistant won't pair | API key mismatch | Set `api_encryption_key` in `secrets.yaml` to match; reflash |
| Device reboots / unstable | Memory pressure | Prefer jsDelivr hosting (default); avoid embedded web assets unless needed |
| OTA fails | Network or old firmware | USB flash once; ensure device and computer are on the same LAN |

## Serial logs

```bash
esphome logs kid-clock.yaml
```

Look for I2C errors, WiFi disconnects, and SNTP sync messages.

## Test mode

Enable **Test Mode** in the web UI Advanced section to preview schedule scenarios without waiting for real time. Use **Test Next Scenario** or **Test Auto Cycle** to step through sleep/wake windows.
