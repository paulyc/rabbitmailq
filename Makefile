node_modules: package.json
	npm install

install:
	npm install -g

run: index.js
	node index.js

test: test.js
	node test.js

.PHONY: install test run
