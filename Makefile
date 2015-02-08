SHELL := /bin/bash

dist:
	mkdir dist/ | true
	mocha
	jshint lib/timetravel.js
	cp lib/timetravel.js dist/timetravel.js
	uglifyjs --mangle < lib/timetravel.js > dist/timetravel.min.js
	cat lib/README.md <(jsdoc2md lib/timetravel.js) > README.md

.PHONY: dist
