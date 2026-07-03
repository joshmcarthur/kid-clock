.PHONY: web firmware all lint
web:
	npm run build
firmware:
	esphome compile kid-clock.yaml
all: firmware
lint:
	npm run lint
