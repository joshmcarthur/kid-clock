# Kid Clock

A kid-friendly schedule clock built on a **Wemos D1 Mini (ESP8266)** with a 16×2 I2C LCD and wake/sleep indicator LEDs. Up to ten time-window rules control messages, greetings, and LED states. Configure everything from a custom web UI in your browser.

![Built Kid Clock](docs/assets/kid-clock.png)

## Features

- 12-hour clock with AM/PM on a 16×2 LCD
- Up to 10 schedule rules (wake window, sleep window, custom windows)
- Green/red GPIO LEDs for wake and sleep signals
- Custom web UI (Preact) served via jsDelivr — keeps ESP8266 flash and RAM usage low
- Standalone operation: SNTP time, captive-portal WiFi setup
- Optional [Home Assistant](https://www.home-assistant.io/) integration via the ESPHome API

## Quick start

```bash
cp secrets.yaml.example secrets.yaml   # edit WiFi credentials
esphome run kid-clock.yaml             # compile, flash via USB, open logs
```

To change the web UI source, run `npm install && npm run build`, commit the built `kid-clock-app.js` / `.css`, bump `web_assets_version` in `kid-clock.yaml`, and tag the release on GitHub.

## Documentation

- [Hardware — BOM and wiring](docs/hardware.md)
- [Flashing and OTA](docs/flashing.md)
- [Configuration](docs/configuration.md)
- [Troubleshooting](docs/troubleshooting.md)

## License

MIT — see [LICENSE](LICENSE).
