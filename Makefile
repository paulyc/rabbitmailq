node_modules: package.json
	npm install

install:
	npm install -g

test: node_modules test.js
	node test.js

.PHONY: install test
